/**
 * Shared timing for the scroll-driven 3D models: the scene and its caption list read the same
 * scroll progress the same way, so the highlighted stage always matches what is being built.
 */

/** Share of the scroll at the end that holds the finished model still. */
const HOLD = 0.08;

/** Scroll progress (0–1) → build progress (0–1), finished before the hold. */
export function buildProgress(p: number) {
  return Math.min(1, Math.max(0, p / (1 - HOLD)));
}

/** The stage being built at scroll progress `p`. */
export function activeStage(p: number, count: number) {
  return Math.min(count - 1, Math.floor(buildProgress(p) * count));
}
