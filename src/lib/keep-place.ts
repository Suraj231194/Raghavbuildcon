import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * Keeps the reader's place across the desktop/phone layout change (a window resize or a tablet
 * turning). When gsap.matchMedia reverts a breakpoint's pins, ScrollTrigger 3.15 skips recording
 * the scroll position before it measures, scrolls to 0 to measure and never restores, so the page
 * jumped to the top. The two layouts differ in height, so the place is kept as the section at the
 * top of the screen and how far through it the reader is, not as a pixel value.
 */
// Set while ScrollTrigger measures; missing from its typings.
const refreshing = () => !!(ScrollTrigger as unknown as { isRefreshing?: boolean }).isRefreshing;

export function keepPlaceAcrossLayouts(query = "(min-width: 1024px)") {
  gsap.registerPlugin(ScrollTrigger);
  let anchor: { section: Element; ratio: number } | null = null;
  // Held from the layout change until the place is restored, so the scroll events of
  // ScrollTrigger's own measuring do not overwrite it.
  let frozen = false;
  const remember = () => {
    if (frozen || refreshing()) return;
    // A page section, not a pin spacer: spacers are rebuilt by the very layout change this guards.
    const section = document
      .elementsFromPoint(window.innerWidth / 2, 2)
      .map((e) => e.closest("main section, footer"))
      .find(Boolean);
    if (!section) return;
    const r = section.getBoundingClientRect();
    anchor = { section, ratio: r.height ? -r.top / r.height : 0 };
  };
  const restore = () => {
    if (!anchor || !anchor.section.isConnected) return;
    const r = anchor.section.getBoundingClientRect();
    // "instant": the site's smooth scroll-behavior would otherwise animate the correction.
    window.scrollTo({ top: Math.round(r.top + window.scrollY + anchor.ratio * r.height), behavior: "instant" });
    ScrollTrigger.update();
  };
  let thaw = 0;
  const settle = () => {
    restore();
    window.clearTimeout(thaw);
    thaw = window.setTimeout(() => (frozen = false), 300);
  };
  const onRefresh = () => {
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    settle();
  };
  let frame = 0;
  const onChange = () => {
    frozen = true;
    ScrollTrigger.addEventListener("refresh", onRefresh);
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(settle);
    });
  };
  // ScrollTrigger caches the window's scroll and, when it refreshes, records that cache before
  // re-measuring and restores it afterwards. A scroll the cache has not read yet is recorded
  // stale, so a late refresh threw a reader who had just scrolled back up. Reading it after every
  // scroll keeps it current; this listener is added after ScrollTrigger's own.
  const scrollCache = ScrollTrigger.getScrollFunc(window) as () => number;
  const readScroll = () => {
    scrollCache();
  };
  window.addEventListener("scroll", readScroll, { passive: true });
  const mq = window.matchMedia(query);
  window.addEventListener("scroll", remember, { passive: true });
  mq.addEventListener("change", onChange);
  remember();
  return () => {
    window.removeEventListener("scroll", readScroll);
    window.removeEventListener("scroll", remember);
    mq.removeEventListener("change", onChange);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    cancelAnimationFrame(frame);
    window.clearTimeout(thaw);
  };
}
