/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 quizState 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/music-quiz/quizState.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import type { QuizUiAction, QuizUiState } from "./types";

export const initialQuizUiState: QuizUiState = {
  phase: "idle",
  round: null,
  roundNumber: 0,
  score: 0,
  lastRoundPoints: 0,
  selectedIndex: 0,
  isPlayerReady: false,
};

export function quizUiReducer(
  state: QuizUiState,
  action: QuizUiAction
): QuizUiState {
  switch (action.type) {
    case "setPhase":
      return { ...state, phase: action.value };
    case "setRound":
      return {
        ...state,
        round:
          typeof action.value === "function"
            ? action.value(state.round)
            : action.value,
      };
    case "setRoundNumber":
      return {
        ...state,
        roundNumber:
          typeof action.value === "function"
            ? action.value(state.roundNumber)
            : action.value,
      };
    case "setScore":
      return {
        ...state,
        score:
          typeof action.value === "function"
            ? action.value(state.score)
            : action.value,
      };
    case "setLastRoundPoints":
      return { ...state, lastRoundPoints: action.value };
    case "setSelectedIndex":
      return {
        ...state,
        selectedIndex:
          typeof action.value === "function"
            ? action.value(state.selectedIndex)
            : action.value,
      };
    case "setIsPlayerReady":
      return { ...state, isPlayerReady: action.value };
    default:
      return state;
  }
}
