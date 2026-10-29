"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { keepPlaceAcrossLayouts } from "@/lib/keep-place";

const TARGETS =
  "[data-hero], [data-hero-media], [data-hero-content], [data-parallax] img, [data-depth], [data-assemble-item], [data-tilt], [data-words], [data-clip], [data-draw], [data-fill], [data-hover-tilt]";
/** Set by React on every element it has hydrated. */
const hydrated = (el: Element) => Object.keys(el).some((key) => key.startsWith("__reactFiber$"));

/*
 * Scroll-linked motion for every page. Elements opt in with data attributes:
 *
 *   data-hero              a page hero: as it scrolls away its picture ([data-hero-media]) drifts
 *                          and zooms while its text ([data-hero-content]) lifts and fades
 *   data-parallax="6"      a clipping frame whose picture drifts by ±6% of its height
 *   data-depth="0.4"       a decorative layer that moves at a different speed from the page
 *   data-assemble          a grid whose [data-assemble-item] children fly in from spread-out 3D
 *                          positions and lock into place as it scrolls in
 *   data-tilt              a block that tips up from a 3D tilt as it scrolls in
 *   data-words             a heading or statement whose words brighten one by one as it is read
 *   data-clip              a picture frame that opens from a cropped window to full size
 *   data-draw              an SVG whose strokes draw themselves
 *   data-fill-sequence     a list whose [data-fill] lines fill one after another
 *   data-hover-tilt        a card that tilts towards the mouse (desktop, mouse only)
 *
 * Every effect is scrubbed by the scroll position, so scrolling back plays it in reverse. Nothing
 * is hidden by CSS: without JavaScript, or with reduced motion, everything is simply in place.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  // Once per visit: keep the reader's place across layout changes, and measure triggers in page
  // order so a pin above a trigger is always accounted for, whichever was created first.
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

        main.querySelectorAll<HTMLElement>("[data-hero]").forEach((hero) => {
          const media = hero.querySelector("[data-hero-media]");
          const content = hero.querySelector("[data-hero-content]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
          if (media) tl.to(media, { yPercent: 14, scale: 1.08, ease: "none" }, 0);
          if (content) tl.to(content, { y: () => -hero.offsetHeight * 0.18, opacity: 0.2, ease: "none" }, 0);
        });

        main.querySelectorAll<HTMLElement>("[data-parallax]").forEach((frame) => {
          const picture = frame.querySelector("img");
          if (!picture) return;
          const amount = parseFloat(frame.dataset.parallax ?? "") || 6;
          gsap.fromTo(
            picture,
            { yPercent: -amount, scale: 1 + amount / 50 },
            { yPercent: amount, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        main.querySelectorAll<HTMLElement>("[data-depth]").forEach((layer) => {
          const depth = parseFloat(layer.dataset.depth ?? "") || 0.3;
          gsap.fromTo(
            layer,
            { y: depth * 90 },
            { y: -depth * 90, ease: "none", scrollTrigger: { trigger: layer.parentElement ?? layer, start: "top bottom", end: "bottom top", scrub: true } },
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
                ease: "power2.out",
                stagger: 0.08,
                scrollTrigger: { trigger: grid, start: "top 92%", end: "top 40%", scrub: 0.6 },
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
                  ease: "power2.out",
                  scrollTrigger: { trigger: item, start: "top 96%", end: "top 62%", scrub: 0.5 },
                },
              ),
            );
          }
        });

        main.querySelectorAll<HTMLElement>("[data-tilt]").forEach((block) =>
          gsap.fromTo(
            block,
            { rotateX: 14, y: 70, transformPerspective: 1400, transformOrigin: "50% 100%" },
            { rotateX: 0, y: 0, ease: "none", scrollTrigger: { trigger: block, start: "top 98%", end: "top 55%", scrub: 0.6 } },
          ),
        );

        // "clamp()" keeps every range inside the page, so a heading near the end still completes.
        const splits: SplitText[] = [];
        main.querySelectorAll<HTMLElement>("[data-words]").forEach((el) => {
          const split = SplitText.create(el, { type: "words" });
          splits.push(split);
          gsap.fromTo(
            split.words,
            { opacity: 0.16 },
            { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "clamp(top 90%)", end: "clamp(bottom 55%)", scrub: true } },
          );
        });

        main.querySelectorAll<HTMLElement>("[data-clip]").forEach((frame) => {
          const picture = frame.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "clamp(top 95%)", end: "clamp(top 40%)", scrub: 0.6 } });
          tl.fromTo(frame, { clipPath: "inset(16% 9% 16% 9% round 2px)" }, { clipPath: "inset(0% 0% 0% 0% round 2px)", ease: "none" }, 0);
          if (picture && !frame.hasAttribute("data-parallax")) tl.fromTo(picture, { scale: 1.22 }, { scale: 1, ease: "none" }, 0);
        });

        main.querySelectorAll<SVGSVGElement>("svg[data-draw]").forEach((svg) => {
          const strokes = Array.from(svg.querySelectorAll<SVGGeometryElement>("path, line, polyline, polygon, circle, rect, ellipse"));
          strokes.forEach((stroke) => {
            const length = stroke.getTotalLength();
            gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
          });
          gsap.to(strokes, {
            strokeDashoffset: 0,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: { trigger: svg, start: "clamp(top 92%)", end: `clamp(${svg.dataset.draw || "top 50%"})`, scrub: 0.6 },
          });
        });

        main.querySelectorAll<HTMLElement>("[data-fill-sequence]").forEach((list) =>
          gsap.fromTo(
            list.querySelectorAll("[data-fill]"),
            { scaleX: 0, transformOrigin: "0% 50%" },
            { scaleX: 1, ease: "none", stagger: 0.6, scrollTrigger: { trigger: list, start: "clamp(top 85%)", end: "clamp(bottom 65%)", scrub: 0.6 } },
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
