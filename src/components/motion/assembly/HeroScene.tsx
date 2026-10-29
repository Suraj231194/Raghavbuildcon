"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { assemblyStages, type AssemblyId } from "@/content/assembly";
import { mountAssembly } from "./mount";

/** The hero background (ink-950). */
const BACKDROP = "#070b14";

type HeroSceneProps = {
  /** The model behind the hero; the home page uses the township. */
  model?: AssemblyId;
  /** How far the model builds itself on arrival; scrolling the hero away builds the rest. */
  intro?: number;
};

/**
 * A 3D model behind a page hero. It builds itself as the page opens, keeps building — and the
 * camera moves — as the hero scrolls away, and on a mouse the camera leans towards the pointer.
 *
 * It sits behind the hero text, under the hero's own gradients, and fades in over the hero photo
 * once it has drawn; the photo stays as the first paint and as the fallback without WebGL. The
 * 3D loads after the page has loaded and is released when the hero is far off screen. With
 * reduced motion the finished model is shown, still.
 */
export function HeroScene({ model = "township", intro = 0.62 }: HeroSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    const hero = root?.closest("section");
    if (!root || !host || !hero) return;
    gsap.registerPlugin(ScrollTrigger);

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { intro: reduce ? intro : 0, scroll: 0 };
    const orbit = { yaw: 0, pitch: 0 };
    let introPlayed = reduce;

    const apply = () => view.setProgress(reduce ? 1 : Math.min(1, state.intro + state.scroll * (1 - intro)));
    const view = mountAssembly(host, hero, model, {
      stages: assemblyStages[model].length,
      backdrop: BACKDROP,
      ghosts: desktop.matches,
      // Wide scenes are framed for wide views; single structures are framed for cards and need room.
      distance: model === "township" ? 1 : model === "network" || model === "bridge" ? 1.1 : 1.5,
      margin: "50% 0px",
      afterLoad: true,
      onReady: (ready) => {
        if (!ready) {
          delete root.dataset.ready;
          return;
        }
        root.dataset.ready = "";
        if (introPlayed) return;
        introPlayed = true;
        gsap.to(state, { intro, duration: 3.6, ease: "power2.inOut", delay: 0.3, onUpdate: apply });
      },
    });
    // Right of the headline on desktop; on phones the model sits dimmed behind the text.
    const frame = () => view.setShift(desktop.matches ? 0.33 : 0.08, desktop.matches ? 0.02 : 0.06);
    frame();
    apply();

    const turn = () => view.setOrbit(orbit.yaw, orbit.pitch);
    const toYaw = gsap.quickTo(orbit, "yaw", { duration: 1.4, ease: "power3.out", onUpdate: turn });
    const toPitch = gsap.quickTo(orbit, "pitch", { duration: 1.4, ease: "power3.out", onUpdate: turn });
    const onMove = (e: PointerEvent) => {
      toYaw((e.clientX / window.innerWidth - 0.5) * 0.3);
      toPitch((e.clientY / window.innerHeight - 0.5) * -0.08);
    };

    const mm = gsap.matchMedia();
    // gsap.matchMedia skips the callback when no condition matches, so both preferences are listed.
    mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (context.conditions?.reduce) return;
      gsap.fromTo(
        state,
        { scroll: 0 },
        { scroll: 1, ease: "none", onUpdate: apply, scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 } },
      );
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    });
    desktop.addEventListener("change", frame);

    return () => {
      desktop.removeEventListener("change", frame);
      mm.revert();
      gsap.killTweensOf(state);
      gsap.killTweensOf(orbit);
      view.dispose();
    };
  }, [model, intro]);

  return (
    <div ref={rootRef} aria-hidden="true" className="group/hero3d absolute inset-0 -z-20">
      {/* Dims the photo once the model is drawn. */}
      <div className="absolute inset-0 bg-ink-950 opacity-0 transition-opacity duration-[1600ms] group-data-[ready]/hero3d:opacity-85" />
      <div ref={hostRef} className="absolute inset-0 opacity-0 transition-opacity duration-[1600ms] group-data-[ready]/hero3d:opacity-100 max-lg:group-data-[ready]/hero3d:opacity-75" />
      <span className="absolute top-24 right-5 rounded-sm bg-ink-950/60 px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.18em] text-ink-300 uppercase opacity-0 transition-opacity duration-[1600ms] group-data-[ready]/hero3d:opacity-100 sm:right-8 lg:top-28 lg:right-12">
        Illustrative model
      </span>
    </div>
  );
}
