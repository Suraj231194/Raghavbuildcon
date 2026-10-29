import type { AssemblyId } from "@/content/assembly";
import type { AssemblyScene, SceneOptions } from "./scene";

export type MountOptions = Omit<SceneOptions, "compact"> & {
  /** Number of build stages the model is divided into. */
  stages: number;
  /** How far outside the screen the scene is created, and beyond which it is released. */
  margin?: string;
  /** Wait for the page's load event and an idle moment before creating the first scene. */
  afterLoad?: boolean;
  onReady?: (ready: boolean) => void;
  /** No WebGL, or the scene failed to build. */
  onFail?: () => void;
};

export type MountedAssembly = {
  setProgress(p: number): void;
  setShift(x: number, y: number): void;
  setOrbit(yaw: number, pitch: number): void;
  dispose(): void;
};

/**
 * The lifecycle every 3D view shares. three.js and the model are loaded when the view comes near
 * the screen; the scene is released (and its WebGL context with it) when the view moves far away,
 * and rebuilt when it returns, so a page keeps only the nearby views alive. Progress, framing and
 * orbit set before the scene exists are applied as soon as it does.
 */
export function mountAssembly(host: HTMLElement, watch: Element, model: AssemblyId, options: MountOptions): MountedAssembly {
  const compact = !window.matchMedia("(min-width: 1024px)").matches;
  let scene: AssemblyScene | null = null;
  let loading = false;
  let alive = true;
  let near = false;
  let failed = false;
  let progress = 0;
  let shift: [number, number] = [0, 0];
  let orbit: [number, number] = [0, 0];

  const create = async () => {
    if (scene || loading || failed) return;
    loading = true;
    try {
      const [{ createAssemblyScene }, { buildModel }] = await Promise.all([import("./scene"), import("./catalog")]);
      // Build in an idle moment rather than in the middle of a scroll frame.
      await new Promise<void>((resolve) =>
        typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(() => resolve(), { timeout: 400 }) : window.setTimeout(resolve, 50),
      );
      if (alive && near && !scene) {
        scene = createAssemblyScene(host, buildModel(model), options.stages, {
          compact,
          backdrop: options.backdrop,
          tone: options.tone,
          ghosts: options.ghosts,
          distance: options.distance,
        });
        scene.setShift(...shift);
        scene.setOrbit(...orbit);
        scene.setProgress(progress);
        options.onReady?.(true);
      }
    } catch {
      failed = true;
      if (alive) options.onFail?.();
    }
    loading = false;
  };
  const release = () => {
    if (!scene) return;
    scene.dispose();
    scene = null;
    options.onReady?.(false);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      near = !!entry?.isIntersecting;
      if (near) void create();
      else release();
    },
    { rootMargin: options.margin ?? "100% 0px" },
  );
  const begin = () => {
    if (alive) io.observe(watch);
  };
  let idle = 0;
  const later = () => {
    // Safari has no requestIdleCallback.
    idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(begin, { timeout: 1500 }) : window.setTimeout(begin, 200);
  };
  if (!options.afterLoad) begin();
  else if (document.readyState === "complete") later();
  else window.addEventListener("load", later, { once: true });

  return {
    setProgress(p) {
      progress = p;
      scene?.setProgress(p);
    },
    setShift(x, y) {
      shift = [x, y];
      scene?.setShift(x, y);
    },
    setOrbit(yaw, pitch) {
      orbit = [yaw, pitch];
      scene?.setOrbit(yaw, pitch);
    },
    dispose() {
      alive = false;
      io.disconnect();
      window.removeEventListener("load", later);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      release();
    },
  };
}
