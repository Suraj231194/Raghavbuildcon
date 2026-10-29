import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Fog,
  GridHelper,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Euler,
  PMREMGenerator,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildProgress } from "@/lib/assembly-timing";
import type { AssemblyModel, CameraKey, Finish, Part, Vec3 } from "./kit";
import { makeTextures, metreUVs } from "./textures";

/*
 * Renders an AssemblyModel with three.js and poses it for a scroll progress.
 *
 * Nothing animates on its own: every frame is a pure function of the progress, so scrolling back
 * takes the structure apart again, and the canvas only redraws when the progress, the size or the
 * framing changes. Each part travels from its offset (or grows out of its base) during its stage,
 * glowing gold while it moves; until it arrives it is drawn as a gold blueprint outline.
 */

const GOLD = "#f2b04a";

/** Colours of the site floor, its grid and the blueprint outlines, for dark and light sections. */
const TONES = {
  dark: { floor: 0.9, grid: "#2a3855", gridOpacity: 0.32, ghost: GOLD, ghostOpacity: 0.5 },
  light: { floor: 0.74, grid: "#b9c0cd", gridOpacity: 0.5, ghost: "#c97a14", ghostOpacity: 0.75 },
};

type Look = { color: string; roughness: number; metalness?: number; opacity?: number };

const FINISHES: Record<Finish, Look> = {
  concrete: { color: "#c9ccd2", roughness: 0.82 },
  concreteDark: { color: "#8e949e", roughness: 0.9 },
  steel: { color: "#71809a", roughness: 0.42, metalness: 0.55 },
  gold: { color: "#e8962a", roughness: 0.45, metalness: 0.25 },
  asphalt: { color: "#25282e", roughness: 0.92 },
  asphaltLight: { color: "#3a3d44", roughness: 0.95 },
  earth: { color: "#6e5a44", roughness: 1 },
  earthDark: { color: "#4d3f30", roughness: 1 },
  gravel: { color: "#9b9286", roughness: 1 },
  gravelDark: { color: "#7a7268", roughness: 1 },
  sand: { color: "#cbb592", roughness: 1 },
  water: { color: "#1c3d63", roughness: 0.55, opacity: 0.84 },
  glass: { color: "#7d9dbd", roughness: 0.12, metalness: 0.35, opacity: 0.88 },
  glassDark: { color: "#33465f", roughness: 0.1, metalness: 0.5, opacity: 0.92 },
  cabin: { color: "#1e2a3c", roughness: 0.2, metalness: 0.3 },
  paint: { color: "#f4f5f8", roughness: 0.6 },
  lamp: { color: "#fff1d6", roughness: 0.4 },
  leaf: { color: "#5f7f48", roughness: 0.95 },
  pipe: { color: "#3b5878", roughness: 0.5, metalness: 0.35 },
  white: { color: "#e9ebef", roughness: 0.5, metalness: 0.1 },
  tyre: { color: "#15171b", roughness: 0.9 },
  paving: { color: "#b9b2a4", roughness: 0.95 },
  plaster: { color: "#ebe4d6", roughness: 0.9 },
  tile: { color: "#94452b", roughness: 0.8 },
  wood: { color: "#7a5230", roughness: 0.7 },
  sheet: { color: "#aeb8c6", roughness: 0.45, metalness: 0.5 },
  solar: { color: "#1b2f52", roughness: 0.2, metalness: 0.6 },
};

/** How brightly glazing and lamps glow once the lights come on. */
const LIGHT_UP: Partial<Record<Finish, number>> = { glass: 0.2, glassDark: 0.35, lamp: 2 };

type Live = {
  part: Part;
  mesh: Mesh;
  material: MeshStandardMaterial;
  ghost: LineSegments | null;
  /** Arrival window, in build progress; negative when it is there from the start. */
  t0: number;
  t1: number;
  /** Exit window; Infinity when it stays. */
  e0: number;
  e1: number;
  /** When its outline appears during the survey stage, in stage-0 progress. */
  sweep: number;
};

export type SceneOptions = {
  /** Phones: fewer pixels, smaller shadow maps, rounder-but-cheaper cylinders. */
  compact: boolean;
  /** The colour behind the canvas; the fog fades the site floor into it. */
  backdrop?: string;
  tone?: keyof typeof TONES;
  /** Draw blueprint outlines for parts still to arrive. */
  ghosts?: boolean;
  /** Multiplies the camera's distance: a model framed for a card sits further back in a wide hero. */
  distance?: number;
};

export type AssemblyScene = {
  setProgress(p: number): void;
  /** Turns the camera around the model (radians), e.g. towards the pointer. */
  setOrbit(yaw: number, pitch: number): void;
  /** Moves the model across the frame, as a share of its width and height, to clear the captions. */
  setShift(x: number, y: number): void;
  dispose(): void;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeIn = (t: number) => t ** 3;
const ZERO: Vec3 = [0, 0, 0];
const UP = new Vector3(0, 1, 0);

function windows(parts: Part[], stages: number) {
  const len = 1 / stages;
  const window = (stage: number, members: Part[], self: Part, order?: number, dur?: number) => {
    const m = members.length;
    const i = members.indexOf(self);
    const o = order ?? (m > 1 ? i / (m - 1) : 0);
    const d = dur ?? (m <= 1 ? 0.85 : Math.min(0.4, Math.max(0.14, 1.2 / m)));
    const t0 = stage * len + o * (1 - d) * len;
    return [t0, t0 + d * len] as const;
  };
  const arriving = new Map<number, Part[]>();
  const leaving = new Map<number, Part[]>();
  for (const p of parts) {
    if (p.stage >= 0) arriving.set(p.stage, [...(arriving.get(p.stage) ?? []), p]);
    if (p.exit) leaving.set(p.exit.stage, [...(leaving.get(p.exit.stage) ?? []), p]);
  }
  return parts.map((p) => {
    const [t0, t1] = p.stage >= 0 ? window(p.stage, arriving.get(p.stage)!, p, p.order, p.dur) : [-1, -1];
    const [e0, e1] = p.exit ? window(p.exit.stage, leaving.get(p.exit.stage)!, p, p.exit.order) : [Infinity, Infinity];
    return { t0, t1, e0, e1 };
  });
}

/** A triangular prism along x: the gable end of a roof, ridge on top. Flat-shaded. */
function gableGeometry(width: number, height: number, depth: number) {
  const [w, h, d] = [width / 2, height / 2, depth / 2];
  const A = [w, -h, -d], B = [w, -h, d], C = [w, h, 0];
  const A2 = [-w, -h, -d], B2 = [-w, -h, d], C2 = [-w, h, 0];
  const faces = [A, C, B, A2, B2, C2, A, B, A2, B, B2, A2, B, C, C2, B, C2, B2, A, C2, C, A, A2, C2];
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(faces.flat()), 3));
  g.computeVertexNormals();
  return g;
}

/** Catmull-Rom through the camera keys, so the camera never stops dead at a key. */
function along(keys: CameraKey[], p: number, pick: (k: CameraKey) => Vec3, out: Vector3) {
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1]!.at) i++;
  const a = keys[i]!;
  const b = keys[i + 1]!;
  const t = clamp01((p - a.at) / (b.at - a.at));
  const p0 = pick(keys[Math.max(0, i - 1)]!);
  const p1 = pick(a);
  const p2 = pick(b);
  const p3 = pick(keys[Math.min(keys.length - 1, i + 2)]!);
  const c = (k: 0 | 1 | 2) =>
    0.5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t * t * t);
  return out.set(c(0), c(1), c(2));
}

export function createAssemblyScene(
  host: HTMLElement,
  model: AssemblyModel,
  stages: number,
  { compact, backdrop = "#0b1220", tone = "dark", ghosts = true, distance = 1 }: SceneOptions,
): AssemblyScene {
  const look = TONES[tone];
  // Throws when WebGL is unavailable; the caller falls back to the static layout.
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.style.cssText = "display:block;width:100%;height:100%";
  host.appendChild(canvas);

  const scene = new Scene();
  const [fogNear, fogFar] = model.fog ?? [model.extent * 1.7, model.extent * 4.4];
  scene.fog = new Fog(backdrop, fogNear, fogFar);
  const camera = new PerspectiveCamera(32, 1, 0.5, model.extent * 12);
  const center = model.center ?? ZERO;

  // Soft studio reflections for glass and steel, under a warm low sun and a cool rim light.
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  scene.environment = environment;
  scene.environmentIntensity = 0.35;
  scene.add(new HemisphereLight("#dfe7f5", "#2a2116", 1.1));
  const sun = new DirectionalLight("#ffe6c4", 2.6);
  const shadowExtent = model.shadowExtent ?? model.extent;
  const sunOffset = new Vector3(-0.7, 1.3, 0.9).multiplyScalar(shadowExtent);
  sun.position.set(center[0], center[1], center[2]).add(sunOffset);
  sun.target.position.set(...center);
  scene.add(sun.target);
  sun.castShadow = true;
  const size = compact ? 1024 : 2048;
  sun.shadow.mapSize.set(size, size);
  Object.assign(sun.shadow.camera, { left: -shadowExtent * 1.1, right: shadowExtent * 1.1, top: shadowExtent * 1.1, bottom: -shadowExtent * 1.1, near: 1, far: shadowExtent * 4 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);
  const rim = new DirectionalLight("#7d9bd6", 0.9);
  rim.position.set(model.extent * 0.4, model.extent * 0.5, -model.extent);
  scene.add(rim);

  // The site floor: a dark plane with a blueprint grid, fading into the backdrop.
  const floorGeometry = new PlaneGeometry(model.extent * 12, model.extent * 12);
  const floorMaterial = new MeshStandardMaterial({ color: new Color(backdrop).multiplyScalar(look.floor), roughness: 1 });
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(center[0], model.floor - 0.002, center[2]);
  floor.receiveShadow = true;
  scene.add(floor);
  const cell = model.extent > 40 ? 4 : 2;
  const gridSize = Math.round((model.extent * 6) / cell) * cell;
  const grid = new GridHelper(gridSize, gridSize / cell, GOLD, look.grid);
  const gridMaterial = grid.material as LineBasicMaterial;
  gridMaterial.transparent = true;
  gridMaterial.opacity = look.gridOpacity;
  gridMaterial.depthWrite = false;
  grid.position.set(center[0], model.floor + 0.01, center[2]);
  scene.add(grid);

  const geometries = new Map<string, BufferGeometry>();
  const edges = new Map<string, BufferGeometry>();
  const segments = compact ? 18 : 28;
  const geometryOf = (part: Part) => {
    const key = `${part.shape}:${part.size.join(",")}`;
    let g = geometries.get(key);
    if (!g) {
      const [a, b, c] = part.size;
      g = part.shape === "box" ? new BoxGeometry(a, b, c) : part.shape === "gable" ? gableGeometry(a, b, c) : new CylinderGeometry(a, c, b, segments);
      metreUVs(g, part);
      geometries.set(key, g);
      edges.set(key, new EdgesGeometry(g, 30));
    }
    return { geometry: g, outline: edges.get(key)! };
  };

  const ghostMaterial = new LineBasicMaterial({ color: look.ghost, transparent: true, opacity: look.ghostOpacity, depthWrite: false });
  const timing = windows(model.parts, stages);
  const textures = makeTextures(compact ? 2 : 8);
  // Each structure's outlines sweep in across its own width when its first stage begins.
  const spans = new Map<number, [number, number]>();
  for (const p of model.parts) {
    const g = p.group ?? 0;
    const [lo, hi] = spans.get(g) ?? [Infinity, -Infinity];
    spans.set(g, [Math.min(lo, p.at[0]), Math.max(hi, p.at[0])]);
  }
  const sweepOf = (p: Part) => {
    const g = p.group ?? 0;
    const [lo, hi] = spans.get(g)!;
    return g + 0.05 + ((p.at[0] - lo) / (hi - lo || 1)) * 0.75;
  };

  const live: Live[] = model.parts.map((part, i) => {
    const look = FINISHES[part.finish];
    const material = new MeshStandardMaterial({
      color: look.color,
      roughness: look.roughness,
      metalness: look.metalness ?? 0,
      transparent: look.opacity !== undefined,
      opacity: look.opacity ?? 1,
      emissive: new Color(GOLD),
      emissiveIntensity: 0,
      map: textures.get(part.finish),
    });
    const { geometry, outline } = geometryOf(part);
    const mesh = new Mesh(geometry, material);
    mesh.castShadow = part.shadow !== false;
    mesh.receiveShadow = true;
    scene.add(mesh);
    let ghost: LineSegments | null = null;
    if (ghosts && part.stage > 0 && part.ghost !== false) {
      ghost = new LineSegments(outline, ghostMaterial);
      ghost.position.set(...part.at);
      ghost.rotation.set(...(part.rot ?? ZERO));
      ghost.visible = false;
      scene.add(ghost);
    }
    const { t0, t1, e0, e1 } = timing[i]!;
    return { part, mesh, material, ghost, t0, t1, e0, e1, sweep: sweepOf(part) };
  });

  let progress = 0;
  let shiftX = 0;
  let shiftY = 0;
  let yaw = 0;
  let pitch = 0;
  let width = 0;
  let height = 0;
  const eye = new Vector3();
  const target = new Vector3();
  const shift = new Vector3();
  const turned = new Euler();

  const pose = () => {
    const bp = buildProgress(progress);
    const surveyed = bp * stages;
    const lights = model.lightsStage === undefined ? 0 : clamp01((bp * stages - model.lightsStage) * 1.6);
    for (const l of live) {
      const { part, mesh } = l;
      const u = l.t1 < 0 ? 1 : clamp01((bp - l.t0) / (l.t1 - l.t0));
      const v = l.e1 === Infinity ? 0 : clamp01((bp - l.e0) / (l.e1 - l.e0));
      if (l.ghost) l.ghost.visible = u < 1 && surveyed >= l.sweep;
      mesh.visible = u > 0 && v < 1;
      if (!mesh.visible) continue;
      const e = easeOut(u);
      let [x, y, z] = part.at;
      mesh.scale.set(1, 1, 1);
      if (part.grow) {
        // Grows from one end along its own axis, so a rotated part still grows from its base.
        const k = Math.max(0.001, e);
        const axis = part.grow === "x" ? 0 : part.grow === "y" ? 1 : 2;
        mesh.scale.setComponent(axis, k);
        shift.set(0, 0, 0).setComponent(axis, (-part.size[axis] / 2) * (1 - k));
        if (part.rot) shift.applyEuler(turned.set(...part.rot));
        x += shift.x;
        y += shift.y;
        z += shift.z;
      } else if (part.from) {
        x += part.from[0] * (1 - e);
        y += part.from[1] * (1 - e);
        z += part.from[2] * (1 - e);
      }
      if (part.exit && v > 0) {
        const w = easeIn(v);
        x += part.exit.to[0] * w;
        y += part.exit.to[1] * w;
        z += part.exit.to[2] * w;
      }
      mesh.position.set(x, y, z);
      const r = part.rot ?? ZERO;
      const t = part.turn ?? ZERO;
      mesh.rotation.set(r[0] + t[0] * (1 - e), r[1] + t[1] * (1 - e), r[2] + t[2] * (1 - e));
      // Large layers being laid glow less than parts flying in, or they would flood the frame.
      l.material.emissiveIntensity = (u < 1 ? Math.sin(Math.PI * u) * (part.grow ? 0.4 : 0.9) : 0) + Math.sin(Math.PI * v) * 0.6 + (LIGHT_UP[part.finish] ?? 0) * lights;
    }

    // Narrow screens see less of the width: pull the camera back and widen the lens.
    const aspect = width / height || 1.6;
    camera.fov = aspect < 1 ? 40 : 32;
    const fit = aspect < 1.6 ? (1.6 / aspect) ** (aspect < 1 ? 0.42 : 0.7) : 1;
    const at = model.cameraOnBuild ? bp : progress;
    along(model.camera, at, (k) => k.look, target);
    along(model.camera, at, (k) => k.pos, eye);
    if (model.shadowExtent) {
      sun.target.position.set(target.x, model.floor, target.z);
      sun.position.copy(sun.target.position).add(sunOffset);
    }
    const offset = eye.sub(target).multiplyScalar(fit * distance);
    if (yaw) offset.applyAxisAngle(UP, yaw);
    if (pitch) offset.y += pitch * offset.length();
    camera.position.copy(offset.add(target));
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  };

  // Shaders compile in the background (where the browser supports it) before the first frame,
  // so creating a view while the page scrolls does not stall the scroll.
  let compiled = false;
  let frame = 0;
  const render = () => {
    frame = 0;
    if (!compiled || !width || !height) return;
    pose();
    renderer.render(scene, camera);
  };
  const request = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const resize = () => {
    width = host.clientWidth;
    height = host.clientHeight;
    if (!width || !height) return;
    // Cap the pixel count: a 4K screen at 2x would cost four times the fill for no visible gain.
    let dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 1.75);
    const budget = compact ? 1.6e6 : 3.4e6;
    if (width * height * dpr * dpr > budget) dpr = Math.max(1, Math.sqrt(budget / (width * height)));
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.setViewOffset(width, height, -shiftX * width, shiftY * height, width, height);
    request();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  pose();
  // Without the extension (Firefox, software renderers) compiling up front gains nothing and
  // three.js warns, so the first frame compiles as usual.
  if (renderer.extensions.has("KHR_parallel_shader_compile"))
    void renderer
      .compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        compiled = true;
        request();
      });
  else compiled = true;

  const onLost = (event: Event) => event.preventDefault();
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", request);

  return {
    setProgress(p) {
      if (p === progress) return;
      progress = p;
      request();
    },
    setOrbit(y, p) {
      if (y === yaw && p === pitch) return;
      yaw = y;
      pitch = p;
      request();
    },
    setShift(x, y) {
      shiftX = x;
      shiftY = y;
      resize();
    },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", request);
      for (const l of live) l.material.dispose();
      geometries.forEach((g) => g.dispose());
      edges.forEach((g) => g.dispose());
      ghostMaterial.dispose();
      textures.dispose();
      environment.dispose();
      pmrem.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      grid.geometry.dispose();
      gridMaterial.dispose();
      renderer.dispose();
      // Each mount creates its own canvas, so the context can be released at once.
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
