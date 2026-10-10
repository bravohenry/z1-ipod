/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 menuScrollReducer 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/ipod-screen/menuScrollReducer.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
export interface MenuScrollState {
  scrollTop: number;
  containerHeight: number;
}

export const menuScrollInitialState: MenuScrollState = {
  scrollTop: 0,
  containerHeight: 0,
};

export type MenuScrollAction =
  | { type: "setScrollTop"; value: number }
  | { type: "setContainerHeight"; value: number };

export function menuScrollReducer(
  state: MenuScrollState,
  action: MenuScrollAction
): MenuScrollState {
  switch (action.type) {
    case "setScrollTop":
      if (state.scrollTop === action.value) return state;
      return { ...state, scrollTop: action.value };
    case "setContainerHeight":
      if (state.containerHeight === action.value) return state;
      return { ...state, containerHeight: action.value };
    default:
      return state;
  }
}
