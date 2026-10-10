/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 constants 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/music-quiz/constants.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import {
  musicQuizMaxScore,
  MUSIC_QUIZ_SNIPPET_MS,
} from "../../utils/musicQuizScoring";

export const SNIPPET_DURATION_MS = MUSIC_QUIZ_SNIPPET_MS;
export const FEEDBACK_DURATION_MS = 1800;
export const TOTAL_ROUNDS = 5;
export const NUM_OPTIONS = 4;
export const MAX_GAME_SCORE = musicQuizMaxScore(TOTAL_ROUNDS);

export const SNIPPET_MIN_START_SEC = 20;
export const SNIPPET_MAX_FALLBACK_SEC = 180;

const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
const isIOS = /iP(hone|od|ad)/.test(ua);
const isSafari =
  /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
export const isIOSSafari = isIOS && isSafari;
