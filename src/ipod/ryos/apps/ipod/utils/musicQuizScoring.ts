/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 musicQuizScoring 的界面或纯运算。
 * [POS]: ryOS apps/ipod/utils/musicQuizScoring.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
export const MUSIC_QUIZ_SNIPPET_MS = 10_000;
export const MUSIC_QUIZ_MAX_POINTS_PER_ROUND = 200;

/** More time left in the snippet window ⇒ more points (0 at timeout). */
export function computeSpeedScore(
  elapsedMs: number,
  windowMs: number = MUSIC_QUIZ_SNIPPET_MS,
  maxPoints: number = MUSIC_QUIZ_MAX_POINTS_PER_ROUND
): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return 0;
  if (elapsedMs >= windowMs) return 0;
  const remaining = windowMs - elapsedMs;
  return Math.max(0, Math.round((remaining / windowMs) * maxPoints));
}

export function musicQuizMaxScore(
  rounds: number,
  maxPerRound: number = MUSIC_QUIZ_MAX_POINTS_PER_ROUND
): number {
  return rounds * maxPerRound;
}
