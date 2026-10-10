/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 nowPlayingArtReducer 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/ipod-screen/nowPlayingArtReducer.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
export type NowPlayingPingState = {
  slots: [string | null, string | null];
  front: 0 | 1;
  crossfading: boolean;
};

export function nowPlayingArtReducer(
  state: NowPlayingPingState,
  action:
    | { type: "reset" }
    | { type: "cover"; payload: string }
    | { type: "abort-back" }
    | { type: "begin-fade" }
    | { type: "commit" }
): NowPlayingPingState {
  switch (action.type) {
    case "reset":
      return { slots: [null, null], front: 0, crossfading: false };
    case "cover": {
      const url = action.payload;
      const [s0, s1] = state.slots;
      const fu = state.front === 0 ? s0 : s1;
      if (fu === url) {
        return { ...state, crossfading: false };
      }
      if (fu === null) {
        return state.front === 0
          ? { ...state, slots: [url, s1], crossfading: false }
          : { ...state, slots: [s0, url], crossfading: false };
      }
      const back = 1 - state.front;
      return back === 0
        ? { ...state, slots: [url, s1], crossfading: false }
        : { ...state, slots: [s0, url], crossfading: false };
    }
    case "abort-back": {
      const back = 1 - state.front;
      return back === 0
        ? { ...state, slots: [null, state.slots[1]], crossfading: false }
        : { ...state, slots: [state.slots[0], null], crossfading: false };
    }
    case "begin-fade":
      return { ...state, crossfading: true };
    case "commit": {
      const back = 1 - state.front;
      const won = state.slots[back];
      if (won === null) {
        return { ...state, crossfading: false };
      }
      return {
        slots: back === 0 ? [won, null] : [null, won],
        front: back as 0 | 1,
        crossfading: false,
      };
    }
    default:
      return state;
  }
}
