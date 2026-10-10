/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 lyricsSearch 的界面或纯运算。
 * [POS]: ryOS utils/lyricsSearch.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
/**
 * Optimized utilities for lyrics line searching
 * Uses binary search O(log n) instead of linear search O(n)
 */

import type { LyricLine } from "@/ipod/ryos/types/lyrics";

/**
 * Pre-parse all lyric line timestamps to numbers for efficient searching.
 * Call this once when lines change, not on every search.
 */
export function parseLyricTimestamps(lines: LyricLine[]): number[] {
  return lines.map((line) => parseInt(line.startTimeMs, 10));
}

/**
 * Find the current lyric line index using binary search - O(log n)
 *
 * @param timestamps - Pre-parsed numeric timestamps (must be sorted ascending)
 * @param timeMs - Current playback time in milliseconds
 * @returns Index of the current line, or -1 if before first line
 */
export function findCurrentLineIndex(
  timestamps: number[],
  timeMs: number
): number {
  const len = timestamps.length;
  if (len === 0) return -1;

  // Edge case: before first line
  if (timeMs < timestamps[0]) return -1;

  // Edge case: at or after last line
  if (timeMs >= timestamps[len - 1]) return len - 1;

  // Binary search: find the largest index where timestamp <= timeMs
  let low = 0;
  let high = len - 1;

  while (low < high) {
    // Bias toward higher index to find the rightmost valid line
    const mid = Math.ceil((low + high + 1) / 2);

    if (timestamps[mid] <= timeMs) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return low;
}
