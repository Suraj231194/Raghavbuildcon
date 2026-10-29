/*
 * How the site's animations are driven. One constant, read by every effect and every 3D view.
 *
 *   "auto"    Everything plays by itself. A reveal plays once, at its own pace, as it comes into
 *             view; a 3D model builds through its stages when its section appears, pauses while
 *             the section is off screen, and holds the finished model afterwards (a Replay button
 *             builds it again); the hero model builds as the page opens; hero photos, parallax
 *             pictures and depth layers drift slowly for as long as they are on screen. Nothing
 *             is pinned and nothing follows the scroll position.
 *   "scroll"  Everything is scrubbed by the scroll position: the 3D sections pin while their model
 *             builds, scrolling back takes it apart again, and the reveals progress as they are
 *             scrolled through.
 *
 * Reduced motion is honoured in both modes: nothing moves, and the finished models are shown.
 */
const mode = "auto" as "auto" | "scroll";

export const MOTION_MODE = mode;

/** True when the animations play by themselves rather than following the scroll. */
export const AUTOPLAY = mode === "auto";

/** Seconds each build stage takes when a model plays by itself. */
export const STAGE_SECONDS = {
  /** The full-screen stories (a bridge, a road, a building, a pipeline): seven stages in about eleven seconds. */
  story: 1.6,
  /** The framed card models. */
  frame: 1.1,
  /** The four-vertical world: 32 stages, so brisker. */
  world: 0.8,
  /** The township behind the home headline. */
  hero: 1,
} as const;
