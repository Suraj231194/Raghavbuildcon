/**
 * Shared timing for the 3D models: the scene and its caption list read the same progress (of the
 * scroll, or of the playback) the same way, so the highlighted stage always matches what is being
 * built.
 */

/** Share of the progress at the end that holds the finished model still. */
const HOLD = 0.08;

/** Progress (0–1) → build progress (0–1), finished before the hold. */
export function buildProgress(p: number) {
  return Math.min(1, Math.max(0, p / (1 - HOLD)));
}

/** The progress at which a share (0–1) of the build is done: the inverse of buildProgress. */
export function progressFor(built: number) {
  return Math.min(1, Math.max(0, built)) * (1 - HOLD);
}

/** The stage being built at progress `p`. */
export function activeStage(p: number, count: number) {
  return Math.min(count - 1, Math.floor(buildProgress(p) * count));
}
