/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 types 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/music-quiz/types.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import type { Track } from "@/ipod/ryos/shared/media/library";

export interface MusicQuizRound {
  correctIndex: number;
  options: Track[];
  startSec: number;
  selectedIndex: number | null;
  isCorrect: boolean | null;
}

export type Phase =
  | "idle"
  | "awaitingStart"
  | "loading"
  | "starting"
  | "playing"
  | "feedback"
  | "finished";

export interface QuizUiState {
  phase: Phase;
  round: MusicQuizRound | null;
  roundNumber: number;
  score: number;
  lastRoundPoints: number;
  selectedIndex: number;
  isPlayerReady: boolean;
}

export type QuizUiAction =
  | { type: "setPhase"; value: Phase }
  | {
      type: "setRound";
      value:
        | MusicQuizRound
        | null
        | ((prev: MusicQuizRound | null) => MusicQuizRound | null);
    }
  | { type: "setRoundNumber"; value: number | ((prev: number) => number) }
  | { type: "setScore"; value: number | ((prev: number) => number) }
  | { type: "setLastRoundPoints"; value: number }
  | { type: "setSelectedIndex"; value: number | ((prev: number) => number) }
  | { type: "setIsPlayerReady"; value: boolean };

export interface MusicQuizRef {
  navigate: (direction: "next" | "previous") => boolean;
  selectCurrent: () => void;
  replaySnippet: () => void;
}

export interface MusicQuizProps {
  isVisible: boolean;
  onExit: () => void;
  lcdFilterOn?: boolean;
  backlightOn?: boolean;
  onEnter?: () => void;
  playClick?: () => void;
  playScroll?: () => void;
  vibrate?: () => void;
}
