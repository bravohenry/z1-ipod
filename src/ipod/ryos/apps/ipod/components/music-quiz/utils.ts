/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 utils 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/music-quiz/utils.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import type { Track } from "@/ipod/ryos/shared/media/library";
import { NUM_OPTIONS } from "./constants";

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRound(
  tracks: Track[]
): { options: Track[]; correctIndex: number; correct: Track } | null {
  if (tracks.length < 1) return null;
  const optionCount = Math.min(NUM_OPTIONS, tracks.length);
  const shuffled = shuffle(tracks);
  const options = shuffled.slice(0, optionCount);
  const correctIndex = Math.floor(Math.random() * options.length);
  return { options, correctIndex, correct: options[correctIndex] };
}

export function formatOption(track: Track): string {
  const artist = track.artist ? ` — ${track.artist}` : "";
  return `${track.title}${artist}`;
}

export function scoreMessageKey(score: number, maxScore: number): string {
  const ratio = maxScore === 0 ? 0 : score / maxScore;
  if (ratio === 1) return "apps.ipod.musicQuiz.perfect";
  if (ratio >= 0.6) return "apps.ipod.musicQuiz.greatJob";
  if (ratio >= 0.3) return "apps.ipod.musicQuiz.notBad";
  return "apps.ipod.musicQuiz.keepPracticing";
}
