/** Minimal shim for Shell DPR clamp used by the open mirror. */
export function clampedDpr(max = 2) {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, max);
}
