/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 coverFlowUiReducer 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/cover-flow/coverFlowUiReducer.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import type { CoverFlowUiAction, CoverFlowUiState } from "./types";

export function coverFlowUiReducer(
  state: CoverFlowUiState,
  action: CoverFlowUiAction
): CoverFlowUiState {
  switch (action.type) {
    case "setSelectedIndex":
      return {
        ...state,
        selectedIndex:
          typeof action.value === "function"
            ? action.value(state.selectedIndex)
            : action.value,
      };
    case "setShowCD":
      return { ...state, showCD: action.value };
    case "setIsFlipped":
      return { ...state, isFlipped: action.value };
    case "setIsFlipAnimating":
      return { ...state, isFlipAnimating: action.value };
    case "setSelectedTrackInAlbum":
      return {
        ...state,
        selectedTrackInAlbum:
          typeof action.value === "function"
            ? action.value(state.selectedTrackInAlbum)
            : action.value,
      };
    default:
      return state;
  }
}
