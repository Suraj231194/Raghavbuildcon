"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { keepPlaceAcrossLayouts } from "@/lib/keep-place";
import { AUTOPLAY } from "@/lib/motion";

const TARGETS =
  "[data-hero], [data-hero-media], [data-hero-content], [data-parallax] img, [data-depth], [data-assemble-item], [data-tilt], [data-words], [data-clip], [data-draw], [data-fill], [data-hover-tilt]";
/** Set by React on every element it has hydrated. */
const hydrated = (el: Element) => Object.keys(el).some((key) => key.startsWith("__reactFiber$"));

/*
 * Motion for every page. Elements opt in with data attributes:
 *
 *   data-hero              a page hero: its picture ([data-hero-media]) breathes slowly, or — in
 *                          "scroll" mode — drifts and zooms as the hero scrolls away while its
 *                          text ([data-hero-content]) lifts and fades
 *   data-parallax="6"      a clipping frame whose picture drifts by ±6% of its height
 *   data-depth="0.4"       a decorative layer that moves at a different speed from the page
 *   data-assemble          a grid whose [data-assemble-item] children fly in from spread-out 3D
 *                          positions and lock into place
 *   data-tilt              a block that tips up from a 3D tilt
 *   data-words             a heading or statement whose words brighten one by one as it is read
 *   data-clip              a picture frame that opens from a cropped window to full size
 *   data-draw              an SVG whose strokes draw themselves
 *   data-fill-sequence     a list whose [data-fill] lines fill one after another
 *   data-hover-tilt        a card that tilts towards the mouse (desktop, mouse only)
 *
 * How they play is decided in lib/motion.ts. In "auto" mode a reveal plays once, at its own pace,
 * from the moment it comes into view, and the drifts run for as long as their element is on
 * screen. In "scroll" mode every effect is scrubbed by the scroll position, so scrolling back plays
 * it in reverse. Nothing is hidden by CSS: without JavaScript, or with reduced motion, everything
 * is simply in place.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  // Once per visit: keep the reader's place across layout changes (ScrollTrigger's re-measuring
  // would jump to the top, pins or no pins), and measure triggers in page order so a pin above a
  // trigger is always accounted for, whichever was created first.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const sort = () => ScrollTrigger.sort();
    ScrollTrigger.addEventListener("refreshInit", sort);
    const release = keepPlaceAcrossLayouts();

    // Late layout changes (web fonts, filtered lists) move everything below them.
    let timer = 0;
    let lastHeight = document.documentElement.scrollHeight;
    const remeasure = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const height = document.documentElement.scrollHeight;
        if (Math.abs(height - lastHeight) < 2) return;
        lastHeight = height;
        ScrollTrigger.refresh();
      }, 250);
    };
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", sort);
      release();
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    let mm: gsap.MatchMedia | null = null;
    let waiting = 0;

    const build = () => {
      mm?.revert();
      mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;

        // A reveal: played once from `start` in "auto" mode, scrubbed through `scroll` otherwise.
        // "clamp()" keeps a position inside the page, so an element near the end still plays.
        const once = (trigger: Element, scroll: ScrollTrigger.Vars, start: string): ScrollTrigger.Vars =>
          AUTOPLAY ? { trigger, start, once: true } : { trigger, ...scroll };
        // A drift: runs while its element is on screen in "auto" mode, follows the scroll otherwise.
        const through = (trigger: Element): ScrollTrigger.Vars =>
          AUTOPLAY
            ? { trigger, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" }
            : { trigger, start: "top bottom", end: "bottom top", scrub: true };
        const ease = AUTOPLAY ? "power3.out" : "none";
        // A scrubbed tween's duration only sets the overlap of its stagger; keep that as it was.
        const dur = (seconds: number) => (AUTOPLAY ? seconds : 0.5);

        main.querySelectorAll<HTMLElement>("[data-hero]").forEach((hero) => {
          const media = hero.querySelector("[data-hero-media]");
          const content = hero.querySelector("[data-hero-content]");
          if (AUTOPLAY) {
            // The text has its own entrance (CSS); the picture breathes while the hero is on screen.
            if (media) gsap.fromTo(media, { scale: 1 }, { scale: 1.07, duration: 14, ease: "sine.inOut", yoyo: true, repeat: -1, scrollTrigger: through(hero) });
            return;
          }
          const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
          if (media) tl.to(media, { yPercent: 14, scale: 1.08, ease: "none" }, 0);
          if (content) tl.to(content, { y: () => -hero.offsetHeight * 0.18, opacity: 0.2, ease: "none" }, 0);
        });

        main.querySelectorAll<HTMLElement>("[data-parallax]").forEach((frame) => {
          const picture = frame.querySelector("img");
          if (!picture) return;
          const amount = parseFloat(frame.dataset.parallax ?? "") || 6;
          if (AUTOPLAY)
            gsap.fromTo(
              picture,
              { yPercent: -amount / 2, scale: 1 + amount / 50 },
              { yPercent: amount / 2, duration: 6 + amount, ease: "sine.inOut", yoyo: true, repeat: -1, scrollTrigger: through(frame) },
            );
          else gsap.fromTo(picture, { yPercent: -amount, scale: 1 + amount / 50 }, { yPercent: amount, ease: "none", scrollTrigger: through(frame) });
        });

        main.querySelectorAll<HTMLElement>("[data-depth]").forEach((layer) => {
          const depth = parseFloat(layer.dataset.depth ?? "") || 0.3;
          const travel = depth * (AUTOPLAY ? 40 : 90);
          gsap.fromTo(
            layer,
            { y: travel },
            {
              y: -travel,
              ease: AUTOPLAY ? "sine.inOut" : "none",
              ...(AUTOPLAY ? { duration: 7 + depth * 6, yoyo: true, repeat: -1 } : {}),
              scrollTrigger: through(layer.parentElement ?? layer),
            },
          );
        });

        main.querySelectorAll<HTMLElement>("[data-assemble]").forEach((grid) => {
          const items = Array.from(grid.querySelectorAll<HTMLElement>("[data-assemble-item]"));
          const n = items.length;
          // -1 at the left end of the row to 1 at the right.
          const side = (i: number) => (n > 1 ? (i / (n - 1)) * 2 - 1 : 0);
          if (desktop) {
            gsap.fromTo(
              items,
              {
                x: (i) => side(i) * 150,
                y: (i) => 110 + Math.abs(side(i)) * 70,
                z: -160,
                rotateX: 24,
                rotateY: (i) => -side(i) * 26,
                opacity: 0,
                transformPerspective: 1100,
              },
              {
                x: 0,
                y: 0,
                z: 0,
                rotateX: 0,
                rotateY: 0,
                opacity: 1,
                duration: dur(1.1),
                ease: "power2.out",
                stagger: 0.08,
                scrollTrigger: once(grid, { start: "top 92%", end: "top 40%", scrub: 0.6 }, "clamp(top 86%)"),
              },
            );
          } else {
            items.forEach((item, i) =>
              gsap.fromTo(
                item,
                { y: 70, rotateX: 20, rotateZ: i % 2 ? 2 : -2, opacity: 0, transformPerspective: 900 },
                {
                  y: 0,
                  rotateX: 0,
                  rotateZ: 0,
                  opacity: 1,
                  duration: 0.9,
                  ease: "power2.out",
                  scrollTrigger: once(item, { start: "top 96%", end: "top 62%", scrub: 0.5 }, "clamp(top 92%)"),
                },
              ),
            );
          }
        });

        main.querySelectorAll<HTMLElement>("[data-tilt]").forEach((block) =>
          gsap.fromTo(
            block,
            { rotateX: 14, y: 70, transformPerspective: 1400, transformOrigin: "50% 100%" },
            { rotateX: 0, y: 0, duration: 1.2, ease, scrollTrigger: once(block, { start: "top 98%", end: "top 55%", scrub: 0.6 }, "clamp(top 90%)") },
          ),
        );

        const splits: SplitText[] = [];
        main.querySelectorAll<HTMLElement>("[data-words]").forEach((el) => {
          const split = SplitText.create(el, { type: "words" });
          splits.push(split);
          gsap.fromTo(
            split.words,
            { opacity: 0.16 },
            {
              opacity: 1,
              duration: dur(0.5),
              ease: AUTOPLAY ? "power1.out" : "none",
              stagger: AUTOPLAY ? 0.06 : 0.1,
              scrollTrigger: once(el, { start: "clamp(top 90%)", end: "clamp(bottom 55%)", scrub: true }, "clamp(top 88%)"),
            },
          );
        });

        main.querySelectorAll<HTMLElement>("[data-clip]").forEach((frame) => {
          const picture = frame.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: once(frame, { start: "clamp(top 95%)", end: "clamp(top 40%)", scrub: 0.6 }, "clamp(top 88%)") });
          tl.fromTo(frame, { clipPath: "inset(16% 9% 16% 9% round 2px)" }, { clipPath: "inset(0% 0% 0% 0% round 2px)", duration: 1.4, ease }, 0);
          if (picture && !frame.hasAttribute("data-parallax")) tl.fromTo(picture, { scale: 1.22 }, { scale: 1, duration: 1.4, ease }, 0);
        });

        main.querySelectorAll<SVGSVGElement>("svg[data-draw]").forEach((svg) => {
          const strokes = Array.from(svg.querySelectorAll<SVGGeometryElement>("path, line, polyline, polygon, circle, rect, ellipse"));
          strokes.forEach((stroke) => {
            const length = stroke.getTotalLength();
            gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
          });
          gsap.to(strokes, {
            strokeDashoffset: 0,
            duration: dur(1.2),
            ease: AUTOPLAY ? "power2.inOut" : "none",
            stagger: 0.06,
            scrollTrigger: once(svg, { start: "clamp(top 92%)", end: `clamp(${svg.dataset.draw || "top 50%"})`, scrub: 0.6 }, "clamp(top 90%)"),
          });
        });

        main.querySelectorAll<HTMLElement>("[data-fill-sequence]").forEach((list) =>
          gsap.fromTo(
            list.querySelectorAll("[data-fill]"),
            { scaleX: 0, transformOrigin: "0% 50%" },
            {
              scaleX: 1,
              duration: dur(0.7),
              ease: AUTOPLAY ? "power2.out" : "none",
              stagger: AUTOPLAY ? 0.4 : 0.6,
              scrollTrigger: once(list, { start: "clamp(top 85%)", end: "clamp(bottom 65%)", scrub: 0.6 }, "clamp(top 85%)"),
            },
          ),
        );

        const unhook: (() => void)[] = [];
        if (desktop && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          main.querySelectorAll<HTMLElement>("[data-hover-tilt]").forEach((card) => {
            gsap.set(card, { transformPerspective: 900 });
            const toX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
            const toY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
            const move = (e: PointerEvent) => {
              const r = card.getBoundingClientRect();
              toY(((e.clientX - r.left) / r.width - 0.5) * 7);
              toX(((e.clientY - r.top) / r.height - 0.5) * -7);
            };
            const leave = () => {
              toX(0);
              toY(0);
            };
            card.addEventListener("pointermove", move);
            card.addEventListener("pointerleave", leave);
            unhook.push(() => {
              card.removeEventListener("pointermove", move);
              card.removeEventListener("pointerleave", leave);
            });
          });
        }

        return () => {
          unhook.forEach((fn) => fn());
          splits.forEach((split) => split.revert());
        };
      });
    };

    // The page hydrates after this layout component does. Writing inline styles into its markup
    // before React reaches it would be reported as a hydration mismatch, so wait for every target
    // to be hydrated (giving up after about five seconds).
    const whenHydrated = () => {
      cancelAnimationFrame(waiting);
      let frames = 0;
      const check = () => {
        if (Array.from(main.querySelectorAll(TARGETS)).every(hydrated) || ++frames > 300) build();
        else waiting = requestAnimationFrame(check);
      };
      check();
    };
    whenHydrated();
    // Content that streams in after the route changes is picked up as well.
    let pending = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(pending);
      pending = window.setTimeout(whenHydrated, 120);
    });
    mo.observe(main, { childList: true });

    return () => {
      mo.disconnect();
      window.clearTimeout(pending);
      cancelAnimationFrame(waiting);
      mm?.revert();
    };
  }, [pathname]);

  return null;
}
