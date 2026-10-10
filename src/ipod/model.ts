/**
 * [INPUT]: ryOS 菜单与歌词显示类型。
 * [OUTPUT]: Route、Preferences，会话与持久化偏好契约。
 * [POS]: 控制器和纯菜单共享类型；不依赖 React hooks 或 DOM。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import type { MenuHistoryEntry } from "./ryos/apps/ipod/types";
import type {
  DisplayMode,
  LyricsAlignment,
  LyricsFont,
  RomanizationSettings,
} from "./ryos/types/lyrics";
export type Route = {
  title: string;
  kind?: MenuHistoryEntry["kind"];
  filter?: string;
  group?: "artist" | "album";
};
export type Preferences = {
  uiVariant: "classic" | "modern";
  theme: "classic" | "black" | "u2";
  repeat: "off" | "one" | "all";
  shuffle: boolean;
  backlight: "2s" | "10s" | "always-on" | "off";
  volume: number;
  displayMode: DisplayMode;
  showLyrics: boolean;
  lyricsFont: LyricsFont;
  lyricsAlignment: LyricsAlignment;
  romanization: RomanizationSettings;
  favorites: string[];
};
