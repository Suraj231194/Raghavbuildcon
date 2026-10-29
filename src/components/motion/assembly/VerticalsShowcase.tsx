"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { assemblyStages, verticalAssembly } from "@/content/assembly";
import type { Vertical } from "@/content/types";
import { buildProgress, progressFor } from "@/lib/assembly-timing";
import { AUTOPLAY, STAGE_SECONDS } from "@/lib/motion";
import { driveProgress, type Drive } from "./drive";
import { mountAssembly } from "./mount";

/** Matches STAGES_PER_VERTICAL in models-world.ts: seven build stages, then one to travel on. */
const PER = 8;
/** "scroll" mode: pinned scroll per vertical, in screen heights (phones use a little less). */
const SCREENS_EACH = 0.85;

/**
 * The four business verticals as one presentation. A single 3D world holds a road, a bridge, a
 * building and a pipeline on one landscape: the camera follows each build, then flies on to the
 * next site, while the panel beside it changes to that vertical. The tabs jump to a vertical. In
 * "auto" mode (lib/motion.ts) the tour plays by itself while the section is on screen and the
 * Replay button starts it again; in "scroll" mode the section pins and the tour follows the
 * scroll. With reduced motion, or without WebGL, the four are listed in full with the finished
 * world beside them.
 */
export function VerticalsShowcase({ verticals }: { verticals: Vertical[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = rootRef.current;
    const pinned = stageRef.current;
    const host = hostRef.current;
    const bar = barRef.current;
    const chip = chipRef.current;
    if (!section || !pinned || !host || !bar || !chip) return;
    gsap.registerPlugin(ScrollTrigger);

    const tabs = Array.from(section.querySelectorAll<HTMLElement>("[data-vertical-tab]"));
    const panels = Array.from(section.querySelectorAll<HTMLElement>("[data-vertical-panel]"));
    const text = section.querySelector<HTMLElement>("[data-verticals-text]");
    const head = section.querySelector<HTMLElement>("[data-verticals-head]");
    const replay = section.querySelector<HTMLButtonElement>("[data-replay]");
    const desktop = window.matchMedia("(min-width: 1024px)");
    // Landscape phones use the desktop layout: text beside the world.
    const shortQuery = window.matchMedia("(max-height: 520px) and (orientation: landscape)");
    const count = verticals.length;
    let active = -1;
    let stageShown = -1;
    let drive: Drive | null = null;

    const view = mountAssembly(host, section, "verticals", {
      stages: count * PER,
      ghosts: desktop.matches,
      margin: "120% 0px",
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
      const built = buildProgress(p) * count * PER;
      const now = Math.min(count - 1, Math.floor(built / PER));
      if (now !== active) {
        active = now;
        tabs.forEach((t, i) => (t.dataset.state = i < now ? "done" : i === now ? "active" : "next"));
        panels.forEach((panel, i) => (panel.dataset.active = String(i === now)));
      }
      const local = Math.min(PER - 1, Math.floor(built - now * PER));
      if (local === stageShown) return;
      stageShown = local;
      const stages = assemblyStages[verticalAssembly[verticals[now]!.slug].model];
      chip.textContent = local < stages.length ? `Stage ${String(local + 1).padStart(2, "0")} / ${String(stages.length).padStart(2, "0")} · ${stages[local]!.title}` : "Complete";
    };

    const goStatic = () => {
      section.dataset.mode = "static";
      active = -1;
      tabs.forEach((t) => delete t.dataset.state);
      panels.forEach((panel) => delete panel.dataset.active);
      view.setProgress(1);
    };

    // The world sits right of the text on desktop, between the heading and the panel on phones.
    const frame = () => {
      const box = pinned.getBoundingClientRect();
      if (!box.width || !box.height) return;
      if ((desktop.matches || shortQuery.matches) && text) {
        const right = text.getBoundingClientRect().right - box.left;
        view.setShift(Math.min(0.25, Math.max(0, (right + box.width) / 2 / box.width - 0.5)), 0);
      } else if (section.dataset.mode === "live" && head) {
        const below = head.getBoundingClientRect().bottom - box.top;
        view.setShift(0, Math.min(0.22, Math.max(-0.22, 0.5 - (below + box.height * 0.62) / 2 / box.height)));
      } else {
        view.setShift(0, 0);
      }
    };

    // A tab jumps to its vertical: the start of its build when playing by itself, the middle of it
    // when the scroll drives the tour.
    const jump = (event: Event) => {
      const i = tabs.indexOf(event.currentTarget as HTMLElement);
      if (!drive || i < 0) return;
      drive.seek(progressFor((i * PER + (AUTOPLAY ? 0.05 : 4)) / (count * PER)));
    };
    const onReplay = () => drive?.replay();

    const mm = gsap.matchMedia();
    // gsap.matchMedia skips the callback when no condition matches, so both preferences are listed.
    mm.add({ desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      const { desktop: wide, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
      if (reduce) {
        goStatic();
        requestAnimationFrame(frame);
        return () => delete section.dataset.mode;
      }
      section.dataset.mode = "live";
      drive = driveProgress({
        trigger: pinned,
        onUpdate: show,
        seconds: count * PER * STAGE_SECONDS.world,
        start: "top 70%",
        end: "bottom 30%",
        scroll: {
          start: "top top",
          end: () => `+=${window.innerHeight * count * SCREENS_EACH * (wide ? 1 : 0.8)}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });
      tabs.forEach((t) => t.addEventListener("click", jump));
      replay?.addEventListener("click", onReplay);
      requestAnimationFrame(frame);
      return () => {
        tabs.forEach((t) => t.removeEventListener("click", jump));
        replay?.removeEventListener("click", onReplay);
        drive = null;
        delete section.dataset.mode;
        active = -1;
        stageShown = -1;
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
  }, [verticals]);

  return (
    <section ref={rootRef} aria-labelledby="expertise-title" className="group/verticals relative isolate bg-ink-900 text-white">
      <div ref={stageRef} className="relative flex h-[100svh] min-h-[38rem] flex-col overflow-hidden short:min-h-0 still:h-auto still:min-h-0">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint opacity-60 [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_75%)]" />
        <div
          ref={hostRef}
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-[1400ms] group-data-[ready]/verticals:opacity-100 still:max-lg:relative still:max-lg:order-last still:max-lg:h-[50svh]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink-900/90 via-transparent via-40% to-ink-900/95 lg:bg-linear-to-r lg:from-ink-900/95 lg:via-ink-900/60 lg:via-35% lg:to-transparent lg:to-62% short:bg-linear-to-r short:from-ink-900/95 short:via-ink-900/60 short:via-35% short:to-transparent short:to-62% still:max-lg:hidden"
        />

        <Container className="relative flex flex-1 flex-col pt-24 pb-9 sm:pt-28 lg:justify-center lg:pt-28 lg:pb-14 short:pt-[4.5rem] short:pb-3 still:py-24 still:lg:py-28">
          <div data-verticals-text="" className="flex flex-1 flex-col lg:max-w-[28rem] lg:flex-none short:max-w-[24rem] short:flex-none">
            <div data-verticals-head="">
              <Eyebrow tone="light">Our expertise</Eyebrow>
              <h2 id="expertise-title" className="mt-4 text-[1.9rem] leading-[1.06] font-semibold sm:text-4xl lg:text-[2.6rem] short:mt-2 short:text-xl">
                Four verticals. One standard of delivery.
              </h2>
              <ol className="mt-6 grid grid-cols-4 gap-1.5 lg:mt-8 lg:grid-cols-1 lg:gap-1 short:mt-2.5 short:gap-1 still:hidden">
                {verticals.map((v, i) => (
                  <li key={v.slug}>
                    <button
                      type="button"
                      data-vertical-tab=""
                      className="group/tab flex w-full items-center gap-3 rounded-sm border border-white/10 px-2.5 py-2 text-left transition-colors short:py-1 duration-300 hover:border-gold-400/50 data-[state=active]:border-gold-500/70 data-[state=active]:bg-white/[0.06] lg:border-transparent lg:px-2 lg:py-1.5 lg:data-[state=active]:border-transparent"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/15 font-display text-[0.7rem] font-semibold text-ink-400 tabular-nums transition-colors duration-500 group-data-[state=active]/tab:border-gold-500 group-data-[state=active]/tab:bg-gold-500 group-data-[state=active]/tab:text-ink-950 group-data-[state=done]/tab:border-gold-500/60 group-data-[state=done]/tab:text-gold-400 max-lg:hidden">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon name={v.icon} className="size-5 shrink-0 text-ink-400 transition-colors group-data-[state=active]/tab:text-gold-400 lg:hidden" />
                      <span className="text-[0.95rem] font-semibold text-ink-400 transition-colors duration-500 group-data-[state=active]/tab:text-white group-data-[state=done]/tab:text-ink-200 max-lg:sr-only">
                        {v.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative mt-auto grid pt-6 lg:mt-8 lg:pt-0 short:mt-3 short:pt-0 still:mt-12 still:gap-10 still:sm:grid-cols-2 still:lg:grid-cols-1">
              {verticals.map((v, i) => (
                <article
                  key={v.slug}
                  data-vertical-panel=""
                  data-active={i === 0 ? "true" : "false"}
                  className="col-start-1 row-start-1 translate-y-3 opacity-0 transition-[opacity,translate] duration-500 focus-within:translate-y-0 focus-within:opacity-100 data-[active=true]:translate-y-0 data-[active=true]:opacity-100 data-[active=false]:pointer-events-none still:pointer-events-auto still:col-auto still:row-auto still:translate-y-0 still:opacity-100"
                >
                  <p className="font-display text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
                    {String(i + 1).padStart(2, "0")} · {v.title}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-ink-200 sm:text-lg short:mt-1.5 short:text-sm">{v.summary}</p>
                  <ul className="mt-4 hidden flex-wrap gap-2 sm:flex short:hidden">
                    {v.capabilities.map((c) => (
                      <li key={c.title} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-ink-200">
                        {c.title}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/expertise/${v.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200 short:mt-2">
                    Explore {v.title}
                    <Icon name="arrow-right" className="size-4" />
                  </Link>
                </article>
              ))}
            </div>
            <p ref={chipRef} aria-hidden="true" className="mt-5 hidden text-[0.72rem] font-bold tracking-[0.16em] text-ink-400 uppercase lg:block still:hidden" />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 lg:absolute lg:right-12 lg:bottom-12 lg:mt-0 short:absolute short:right-5 short:bottom-3 short:mt-0 still:static still:mt-12">
            <ButtonLink href="/expertise" variant="outline-light">
              All expertise
            </ButtonLink>
            <div className="flex items-center gap-2">
              {AUTOPLAY ? (
                <button
                  type="button"
                  data-replay=""
                  aria-label="Replay the tour of the four verticals"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-ink-950/60 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.18em] text-ink-300 uppercase transition-colors duration-300 hover:text-white still:hidden"
                >
                  <Icon name="replay" className="size-3" />
                  Replay
                </button>
              ) : null}
              <span className="rounded-sm bg-ink-950/60 px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.18em] text-ink-300 uppercase">Illustrative models</span>
            </div>
          </div>
        </Container>

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10 still:hidden">
          <div ref={barRef} className="h-full origin-left bg-gold-500" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
