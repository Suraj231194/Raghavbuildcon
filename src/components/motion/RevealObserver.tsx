"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Fades `[data-reveal]` elements up as they scroll into view.
 *
 * Uses the Web Animations API instead of toggling classes or attributes, so it never mutates
 * markup React is hydrating. Content is fully visible in the server HTML: without JavaScript,
 * with reduced motion, or for anything already on screen, nothing is hidden or animated.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          const delay = parseFloat(getComputedStyle(entry.target).getPropertyValue("--reveal-delay")) || 0;
          entry.target.animate(
            [
              { opacity: 0, transform: "translate3d(0, 26px, 0)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 900, delay, easing: EASE, fill: "backwards" },
          );
        }
      },
      // Start just before the element reaches the viewport so it never pops in visibly.
      { rootMargin: "0px 0px 10% 0px", threshold: 0 },
    );

    const track = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      const rect = el.getBoundingClientRect();
      // Already on screen: leave it alone rather than flash it out and back in.
      if (rect.top < window.innerHeight && rect.bottom > 0) return;
      io.observe(el);
    };
    const scan = () => document.querySelectorAll("[data-reveal]").forEach(track);
    scan();

    // Elements rendered later (filters, client navigation) are picked up automatically.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
