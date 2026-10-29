"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { assemblyStages, type AssemblyId } from "@/content/assembly";
import { activeStage } from "@/lib/assembly-timing";
import { AUTOPLAY, STAGE_SECONDS } from "@/lib/motion";
import { driveProgress, type Drive } from "./drive";
import { mountAssembly } from "./mount";

type AssemblyStoryProps = {
  model: AssemblyId;
  /** Prefix for the heading id. */
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  /** "scroll" mode: how long the section stays pinned on desktop, in screen heights. Phones use a little less. */
  length?: number;
};

/**
 * A full-screen section in which a 3D model assembles itself, stage by stage, with the stage being
 * built highlighted in the list beside it. In "auto" mode (lib/motion.ts) the build plays by itself
 * once the section is on screen, pausing while it is not, and the Replay button builds it again;
 * in "scroll" mode the section pins and the build follows the scroll.
 *
 * The stage list is ordinary server-rendered text. The 3D view is created near the screen and
 * released far from it (mount.ts); the canvas fades in once it has drawn. With reduced motion, or
 * without WebGL, the section is static: it shows every stage, and the finished model when it can
 * be drawn.
 */
export function AssemblyStory({ model, id, eyebrow, title, lead, length = 2 }: AssemblyStoryProps) {
  const stages = assemblyStages[model];
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = rootRef.current;
    const pinned = stageRef.current;
    const host = hostRef.current;
    const bar = barRef.current;
    if (!section || !pinned || !host || !bar) return;
    gsap.registerPlugin(ScrollTrigger);

    const items = Array.from(section.querySelectorAll<HTMLElement>("[data-stage]"));
    const text = section.querySelector<HTMLElement>("[data-assembly-text]");
    const head = section.querySelector<HTMLElement>("[data-assembly-head]");
    const replay = section.querySelector<HTMLButtonElement>("[data-replay]");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    // Landscape phones use the desktop layout: text beside the model.
    const shortQuery = window.matchMedia("(max-height: 520px) and (orientation: landscape)");
    let current = -1;
    let drive: Drive | null = null;
    const view = mountAssembly(host, section, model, {
      stages: stages.length,
      margin: "150% 0px",
      onReady: (ready) => {
        if (ready) section.dataset.ready = "";
        else delete section.dataset.ready;
      },
      onFail: () => {
        mm.revert();
        goStatic();
        ScrollTrigger.refresh();
      },
    });

    const show = (p: number) => {
      view.setProgress(p);
      bar.style.transform = `scaleX(${p})`;
      const active = activeStage(p, stages.length);
      if (active === current) return;
      current = active;
      items.forEach((li, i) => (li.dataset.state = i < active ? "done" : i === active ? "active" : "next"));
    };

    const goStatic = () => {
      section.dataset.mode = "static";
      current = -1;
      items.forEach((li) => delete li.dataset.state);
      view.setProgress(1);
    };

    // Keep the model clear of the text: right of the column on desktop, between the heading and
    // the caption on phones. The static phone layout gives the canvas a block of its own.
    const frame = () => {
      const box = pinned.getBoundingClientRect();
      if (!box.width || !box.height) return;
      if ((desktopQuery.matches || shortQuery.matches) && text) {
        const right = text.getBoundingClientRect().right - box.left;
        view.setShift(Math.min(0.25, Math.max(0, (right + box.width) / 2 / box.width - 0.5)), 0);
      } else if (section.dataset.mode === "live" && head) {
        const below = head.getBoundingClientRect().bottom - box.top;
        view.setShift(0, Math.min(0.2, Math.max(-0.2, 0.5 - (below + box.height * 0.74) / 2 / box.height)));
      } else {
        view.setShift(0, 0);
      }
    };
    const onReplay = () => drive?.replay();

    const mm = gsap.matchMedia();
    // gsap.matchMedia skips the callback when no condition matches, so both motion preferences are
    // listed: one of them always does.
    mm.add({ desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
      if (reduce) {
        goStatic();
        requestAnimationFrame(frame);
        return () => delete section.dataset.mode;
      }
      section.dataset.mode = "live";
      const pinLength = () => window.innerHeight * (desktop ? length : length * 0.8);
      // "scroll" mode pins the stage while the model builds. The build starts as the section
      // scrolls in, so the blueprint is drawing by the time it pins.
      if (!AUTOPLAY) {
        ScrollTrigger.create({
          trigger: pinned,
          start: "top top",
          end: () => `+=${pinLength()}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }
      drive = driveProgress({
        trigger: pinned,
        onUpdate: show,
        seconds: stages.length * STAGE_SECONDS.story,
        start: "top 70%",
        end: "bottom 30%",
        scroll: { start: "top 70%", end: () => `+=${window.innerHeight * 0.7 + pinLength()}`, scrub: 0.8, invalidateOnRefresh: true },
      });
      replay?.addEventListener("click", onReplay);
      requestAnimationFrame(frame);
      return () => {
        replay?.removeEventListener("click", onReplay);
        drive = null;
        delete section.dataset.mode;
        current = -1;
      };
    });

    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(frame);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeFrame);
      mm.revert();
      view.dispose();
    };
  }, [model, stages.length, length]);

  const total = String(stages.length).padStart(2, "0");

  return (
    <section ref={rootRef} aria-labelledby={`${id}-title`} className="group/assembly relative isolate bg-ink-900 text-white">
      <div
        ref={stageRef}
        className="relative flex h-[100svh] min-h-[34rem] flex-col overflow-hidden short:min-h-0 still:h-auto still:min-h-0 still:max-lg:pb-0"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint opacity-70 [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_75%)]" />
        <div
          ref={hostRef}
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-[1400ms] group-data-[ready]/assembly:opacity-100 still:max-lg:relative still:max-lg:order-last still:max-lg:h-[55svh]"
        />
        {/* Keeps the text legible over the model. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink-900/85 via-transparent via-35% to-ink-900/90 lg:bg-linear-to-r lg:from-ink-900/95 lg:via-ink-900/55 lg:via-35% lg:to-transparent lg:to-62% short:bg-linear-to-r short:from-ink-900/95 short:via-ink-900/55 short:via-35% short:to-transparent short:to-62% still:max-lg:hidden"
        />

        <Container className="relative flex flex-1 flex-col justify-between pt-24 pb-9 sm:pt-28 lg:justify-center lg:pt-28 lg:pb-14 short:justify-start short:pt-[4.5rem] short:pb-4 still:py-24 still:lg:py-28">
          <div data-assembly-text="" className="lg:max-w-[26rem] short:max-w-[22rem]">
            <div data-assembly-head="">
              <Eyebrow tone="light">{eyebrow}</Eyebrow>
              <h2 id={`${id}-title`} className="mt-4 text-[1.9rem] leading-[1.06] font-semibold sm:text-4xl lg:text-[2.6rem] short:mt-2 short:text-xl">
                {title}
              </h2>
              <p className="mt-4 hidden text-base leading-relaxed text-ink-200 sm:text-lg lg:block lg:[@media(max-height:760px)]:hidden still:block">
                {lead}
              </p>
            </div>

            <ol className="mt-8 grid gap-1 max-lg:absolute max-lg:inset-x-5 max-lg:bottom-9 max-lg:mt-0 sm:max-lg:inset-x-8 lg:mt-9 short:static short:mt-3 still:static still:mt-10 still:gap-4 still:sm:grid-cols-2 still:lg:max-w-none still:lg:grid-cols-1">
              {stages.map((s, i) => (
                <li
                  key={s.title}
                  data-stage=""
                  className="group/stage flex gap-4 max-lg:hidden max-lg:rounded-sm max-lg:border max-lg:border-white/10 max-lg:bg-ink-950/75 max-lg:p-4 max-lg:backdrop-blur-md short:p-3 max-lg:data-[state=active]:flex max-lg:data-[state=active]:animate-fade-up still:flex still:border-0 still:bg-transparent still:p-0 still:backdrop-blur-none"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 font-display text-xs font-semibold text-ink-400 tabular-nums transition-colors duration-500 group-data-[state=active]/stage:border-gold-500 group-data-[state=active]/stage:bg-gold-500 group-data-[state=active]/stage:text-ink-950 group-data-[state=done]/stage:border-gold-500/60 group-data-[state=done]/stage:text-gold-400 still:border-gold-500/60 still:text-gold-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="flex items-baseline justify-between gap-3 font-display text-[0.98rem] font-semibold text-ink-400 transition-colors duration-500 group-data-[state=active]/stage:text-white group-data-[state=done]/stage:text-ink-200 still:text-white">
                      {s.title}
                      <span aria-hidden="true" className="text-[0.7rem] font-bold tracking-[0.16em] text-ink-400 lg:hidden still:hidden">
                        {String(i + 1).padStart(2, "0")} / {total}
                      </span>
                    </p>
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-data-[state=active]/stage:grid-rows-[1fr] max-lg:grid-rows-[1fr] still:grid-rows-[1fr]">
                      <p className="overflow-hidden text-sm leading-relaxed text-ink-300">
                        <span className="block pt-1.5 pb-1">{s.text}</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>

        <div className="absolute right-5 bottom-2 flex items-center justify-end gap-2 sm:right-8 lg:right-12 lg:bottom-6 still:static still:px-5 still:pb-6 still:max-lg:order-last still:lg:absolute">
          {AUTOPLAY ? (
            <button
              type="button"
              data-replay=""
              aria-label="Replay the build sequence"
              className="inline-flex items-center gap-1.5 rounded-sm bg-ink-950/60 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.18em] text-ink-300 uppercase backdrop-blur-sm transition-colors duration-300 hover:text-white lg:text-[0.68rem] still:hidden"
            >
              <Icon name="replay" className="size-3" />
              Replay
            </button>
          ) : null}
          <p className="rounded-sm bg-ink-950/60 px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.18em] text-ink-300 uppercase backdrop-blur-sm lg:py-1 lg:text-[0.68rem]">
            Illustrative model
          </p>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10 still:hidden">
          <div ref={barRef} className="h-full origin-left bg-gold-500" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
