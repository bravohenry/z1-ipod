/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 lyricsAlignmentUtils 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/lyrics-display/lyricsAlignmentUtils.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { LyricsAlignment } from "@/ipod/ryos/types/lyrics";
import type { LyricLine } from "@/ipod/ryos/types/lyrics";

export function getLyricsTextAlign(
  align: LyricsAlignment,
  lineIndex: number,
  totalVisibleLines: number
): CanvasTextAlign {
  if (
    align === LyricsAlignment.Center ||
    align === LyricsAlignment.FocusThree
  ) {
    return "center";
  }

  if (align === LyricsAlignment.Alternating) {
    if (totalVisibleLines === 1) return "center";
    return lineIndex === 0 ? "left" : "right";
  }

  if (totalVisibleLines === 1) {
    return "center";
  }
  if (totalVisibleLines === 2) {
    return lineIndex === 0 ? "left" : "right";
  }
  if (lineIndex === 0) return "left";
  if (lineIndex === 1) return "center";
  if (lineIndex === 2) return "right";

  return "center";
}

/** Lines shown in Alternating alignment (current + next). */
export function computeAlternatingVisibleLines(
  allLines: LyricLine[],
  currIdx: number
): LyricLine[] {
  if (!allLines.length) return [];

  if (currIdx < 0) {
    return allLines.slice(0, 2).filter(Boolean);
  }

  const clampedIdx = Math.min(currIdx, allLines.length - 1);
  const nextLine = allLines[clampedIdx + 1];

  if (clampedIdx % 2 === 0) {
    return [allLines[clampedIdx], nextLine].filter(Boolean);
  }

  return [nextLine, allLines[clampedIdx]].filter(Boolean);
}
