/**
 * [INPUT]: React 上下文与 ryOS 显示类型。
 * [OUTPUT]: context 的宿主能力。
 * [POS]: craft/ipod 的适配边界；不导入 ryOS 操作系统或云同步。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { Track } from "./ryos/shared/media/library";
import type {
  LyricsAlignment,
  LyricsFont,
  RomanizationSettings,
} from "./ryos/types/lyrics";
export interface IpodHostState {
  tracks: Track[];
  appleMusicTracks: Track[];
  librarySource: "youtube" | "appleMusic";
  uiVariant: "classic" | "modern";
  elapsedTime: number;
  volume: number;
  lyricsAlignment: LyricsAlignment;
  lyricsFont: LyricsFont;
  romanization: RomanizationSettings;
  appleMusicKitNowPlaying: {
    title: string;
    artist?: string;
    album?: string;
    cover?: string;
  } | null;
  setAppleMusicKitNowPlaying: (
    track: IpodHostState["appleMusicKitNowPlaying"],
  ) => void;
}
const Host = createContext<IpodHostState | null>(null);
export function IpodHostProvider({
  value,
  children,
}: {
  value: IpodHostState;
  children: ReactNode;
}) {
  return <Host value={value}>{children}</Host>;
}
export function useIpodStore<T>(select: (state: IpodHostState) => T): T {
  const state = useContext(Host);
  if (!state) throw new Error("iPod requires its host provider");
  return select(state);
}
export const useAudioSettingsStore = useIpodStore;
export const selectEffectiveIpodVolume = (state: IpodHostState) => state.volume;
export function useIpodElapsedTime(enabled = true) {
  return useIpodStore((s) => (enabled ? s.elapsedTime : 0));
}
export function isAppleMusicCollectionTrack(track: Track | null | undefined) {
  return Boolean(
    track?.source === "appleMusic" &&
      (track.appleMusicPlayParams?.playlistId ||
        track.appleMusicPlayParams?.stationId),
  );
}
