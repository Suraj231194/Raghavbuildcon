"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { assemblyStages, type AssemblyId } from "@/content/assembly";
import { activeStage } from "@/lib/assembly-timing";
import { AUTOPLAY, STAGE_SECONDS } from "@/lib/motion";
import { cn } from "@/lib/site";
import { driveProgress, type Drive } from "./drive";
import { mountAssembly } from "./mount";

type AssemblyFrameProps = {
  model: AssemblyId;
  /** What the model shows, for screen readers. */
  label: string;
  /** The frame's background colour; the site floor fades into it. */
  backdrop: string;
  tone?: "light" | "dark";
  /** Blueprint outlines for parts still to arrive; heavy scenes keep them to desktops. */
  ghosts?: boolean | "desktop";
  /** "scroll" mode: where the build starts and finishes, as ScrollTrigger positions of the frame. */
  start?: string;
  end?: string;
  className?: string;
};

/**
 * A framed 3D model that assembles itself in a card. Nothing is pinned, so it adds no scroll
 * length. In "auto" mode (lib/motion.ts) the build plays while the card is on screen and the
 * Replay button starts it again; in "scroll" mode it follows the card through the screen. The
 * current stage is named in the caption, and on a mouse the model turns a little towards the
 * pointer.
 *
 * The 3D view is created near the screen and released far from it (mount.ts), so a page with
 * several frames keeps only the nearby ones alive. With reduced motion the finished model is shown.
 */
export function AssemblyFrame({ model, label, backdrop, tone = "light", ghosts = true, start = "top 88%", end = "center 42%", className }: AssemblyFrameProps) {
  const stages = assemblyStages[model];
  const rootRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = rootRef.current;
    const host = hostRef.current;
    const bar = barRef.current;
    if (!frame || !host || !bar) return;
    gsap.registerPlugin(ScrollTrigger);

    const titles = Array.from(frame.querySelectorAll<HTMLElement>("[data-frame-stage]"));
    const replay = frame.querySelector<HTMLButtonElement>("[data-replay]");
    let current = 0;
    let drive: Drive | null = null;
    const orbit = { yaw: 0, pitch: 0 };
    const view = mountAssembly(host, frame, model, {
      stages: stages.length,
      backdrop,
      tone,
      ghosts: ghosts === "desktop" ? window.matchMedia("(min-width: 1024px)").matches : ghosts,
      margin: "60% 0px",
      onReady: (ready) => {
        if (ready) frame.dataset.ready = "";
        else delete frame.dataset.ready;
      },
    });

    const show = (p: number) => {
      view.setProgress(p);
      bar.style.transform = `scaleX(${p})`;
      const active = activeStage(p, stages.length);
      if (active === current) return;
      current = active;
      titles.forEach((t, i) => (t.dataset.active = String(i === active)));
    };
    const onReplay = () => drive?.replay();

    const turn = () => view.setOrbit(orbit.yaw, orbit.pitch);
    const toYaw = gsap.quickTo(orbit, "yaw", { duration: 0.9, ease: "power3.out", onUpdate: turn });
    const toPitch = gsap.quickTo(orbit, "pitch", { duration: 0.9, ease: "power3.out", onUpdate: turn });
    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      toYaw(((e.clientX - r.left) / r.width - 0.5) * 0.6);
      toPitch(((e.clientY - r.top) / r.height - 0.5) * -0.12);
    };
    const onLeave = () => {
      toYaw(0);
      toPitch(0);
    };

    const mm = gsap.matchMedia();
    // gsap.matchMedia skips the callback when no condition matches, so both preferences are listed.
    mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (context.conditions?.reduce) {
        show(1);
        return;
      }
      drive = driveProgress({
        trigger: frame,
        onUpdate: show,
        seconds: stages.length * STAGE_SECONDS.frame,
        start: "top 80%",
        end: "bottom 20%",
        scroll: { start, end, scrub: 0.7 },
      });
      replay?.addEventListener("click", onReplay);
      const pointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (pointer) {
        frame.addEventListener("pointermove", onMove);
        frame.addEventListener("pointerleave", onLeave);
      }
      return () => {
        replay?.removeEventListener("click", onReplay);
        drive = null;
        if (pointer) {
          frame.removeEventListener("pointermove", onMove);
          frame.removeEventListener("pointerleave", onLeave);
        }
      };
    });

    return () => {
      mm.revert();
      gsap.killTweensOf(orbit);
      view.dispose();
    };
  }, [model, backdrop, tone, ghosts, start, end, stages.length]);

  const total = String(stages.length).padStart(2, "0");

  return (
    <figure ref={rootRef} className={cn("group/frame relative isolate overflow-hidden rounded-sm", className)} style={{ backgroundColor: backdrop }}>
      <div ref={hostRef} aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity duration-1000 group-data-[ready]/frame:opacity-100" />
      {AUTOPLAY ? (
        <button
          type="button"
          data-replay=""
          aria-label="Replay the build"
          className={cn(
            "absolute top-3 left-3 inline-flex size-7 items-center justify-center rounded-sm transition-colors duration-300 still:hidden",
            tone === "light" ? "bg-white/75 text-ink-600 hover:text-ink-950" : "bg-ink-950/60 text-ink-300 hover:text-white",
          )}
        >
          <Icon name="replay" className="size-3.5" />
        </button>
      ) : null}
      <span
        className={cn(
          "absolute top-3 right-3 rounded-sm px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.16em] uppercase",
          tone === "light" ? "bg-white/75 text-ink-600" : "bg-ink-950/60 text-ink-300",
        )}
      >
        Illustrative model
      </span>
      <figcaption className="absolute inset-x-3 bottom-3 rounded-sm bg-ink-950/85 px-3.5 py-2.5 text-white backdrop-blur-sm">
        <span className="sr-only">{label}. Build sequence:</span>
        <ol className="grid">
          {stages.map((s, i) => (
            <li
              key={s.title}
              data-frame-stage=""
              data-active={i === 0 ? "true" : "false"}
              className="col-start-1 row-start-1 flex items-baseline gap-3 opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100"
            >
              <span aria-hidden="true" className="font-display text-xs font-semibold text-gold-400 tabular-nums">
                {String(i + 1).padStart(2, "0")} / {total}
              </span>
              <span className="text-sm font-semibold">{s.title}</span>
            </li>
          ))}
        </ol>
      </figcaption>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-ink-950/10">
        <div ref={barRef} className="h-full origin-left bg-gold-500" style={{ transform: "scaleX(0)" }} />
      </div>
    </figure>
  );
}
