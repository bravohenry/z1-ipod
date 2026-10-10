/**
 * [INPUT]: 作者歌单、曲库与会话投影，事件动作作为函数注入。
 * [OUTPUT]: buildMenu，ryOS 菜单结构与动作映射。
 * [POS]: iPod 纯菜单投影；创建菜单时不读取 DOM、计时器或播放器引用。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import type { MenuItem } from "./ryos/apps/ipod/types";
import type { Preferences, Route } from "./model";
import type { Track } from "./ryos/shared/media/library";
import type { Dispatch, SetStateAction } from "react";
import { DisplayMode, LyricsAlignment, LyricsFont } from "./ryos/types/lyrics";
import { resolveTrackCoverUrl } from "./ryos/apps/ipod/constants";
import { IPOD_PLAYLIST } from "@/data/playlist";
type MenuEnvironment = {
  library: { tracks: Track[]; remove: (id: string) => void };
  preferences: Preferences;
  currentTrack: Track | null;
  lyricOffset: number;
  push: (route: Route) => void;
  patch: (value: Partial<Preferences>) => void;
  playTrack: (index: number) => void;
  openOverlay: (overlay: "cover-flow" | "brick" | "quiz" | null) => void;
  setDialog: (value: "add" | "search" | "about" | null) => void;
  showStatus: (message: string) => void;
  setBacklightOn: Dispatch<SetStateAction<boolean>>;
  nowPlaying: () => void;
  setLyricOffset: Dispatch<SetStateAction<number>>;
  setShowVideo: (value: boolean) => void;
  setMenuMode: (value: boolean) => void;
  favorite: () => void;
  setCurrentIndex: (index: number) => void;
  setPlaybackRequested: (value: boolean) => void;
  back: () => void;
};
const cycle = <T>(values: readonly T[], current: T) =>
  values[(values.indexOf(current) + 1) % values.length];
const randomIndex = (length: number) => Math.floor(Math.random() * length);
export function buildMenu(
  route: Route,
  environment: MenuEnvironment,
): MenuItem[] {
  const {
    library,
    preferences,
    currentTrack,
    lyricOffset,
    push,
    patch,
    playTrack,
    openOverlay,
    setDialog,
    showStatus,
    setBacklightOn,
    nowPlaying,
    setLyricOffset,
    setShowVideo,
    setMenuMode,
    favorite,
    setCurrentIndex,
    setPlaybackRequested,
    back,
  } = environment;
  const command = (
    label: string,
    action: () => void,
    value?: string,
    showChevron = true,
  ): MenuItem => ({ label, action, value, showChevron });
  const songs = (
    filter: (track: (typeof library.tracks)[number]) => boolean = () => true,
  ): MenuItem[] =>
    library.tracks.flatMap((track, index) =>
      filter(track)
        ? [
            {
              label: track.title,
              subtitle: track.artist,
              coverUrl: resolveTrackCoverUrl(track),
              showChevron: false,
              action: () => playTrack(index),
            },
          ]
        : [],
    );
  const groups = (group: "artist" | "album") =>
    [...new Set(library.tracks.map((t) => t[group] || `Unknown ${group}`))]
      .sort((a, b) => a.localeCompare(b))
      .map((label) => ({
        ...command(label, () =>
          push({ title: label, kind: group, filter: label, group }),
        ),
        coverUrl: resolveTrackCoverUrl(
          library.tracks.find(
            (t) => (t[group] || `Unknown ${group}`) === label,
          ),
        ),
      }));
  if (route.filter && route.group)
    return songs(
      (t) => (t[route.group!] || `Unknown ${route.group}`) === route.filter,
    );
  switch (route.title) {
    case "iPod":
      return [
        command("Music", () => push({ title: "Music", kind: "music" })),
        command("Extras", () => push({ title: "Extras", kind: "extras" })),
        command("Settings", () =>
          push({ title: "Settings", kind: "settings" }),
        ),
        command(
          "Shuffle Songs",
          () => {
            patch({ shuffle: true });
            playTrack(randomIndex(library.tracks.length));
          },
          undefined,
          false,
        ),
        command("Backlight", () => setBacklightOn((v) => !v), undefined, false),
        command("Now Playing", nowPlaying),
      ];
    case "Music":
      return [
        command("Cover Flow", () => openOverlay("cover-flow")),
        command("Playlists", () =>
          push({ title: "Playlists", kind: "playlists" }),
        ),
        command("Artists", () => push({ title: "Artists", kind: "artists" })),
        command("Albums", () => push({ title: "Albums", kind: "albums" })),
        command("All Songs", () => push({ title: "All Songs", kind: "songs" })),
        command("Recently Added", () =>
          push({ title: "Recently Added", kind: "recentlyAdded" }),
        ),
        command("Favorite Songs", () =>
          push({ title: "Favorite Songs", kind: "favorites" }),
        ),
        command("Add Songs", () => setDialog("add"), undefined, false),
      ];
    case "Playlists":
      return [
        command("Favorites", () => push({ title: "Favorites", kind: "songs" })),
        command("All Songs", () => push({ title: "All Songs", kind: "songs" })),
        command("Favorite Songs", () =>
          push({ title: "Favorite Songs", kind: "favorites" }),
        ),
      ];
    case "All Songs":
      return songs();
    case "Favorites":
      return songs((track) => IPOD_PLAYLIST.includes(track.id));
    case "Recently Added":
      return songs().reverse();
    case "Favorite Songs":
      return songs((t) => preferences.favorites.includes(t.id));
    case "Artists":
      return groups("artist");
    case "Albums":
      return groups("album");
    case "Extras":
      return [
        command("Music Quiz", () => openOverlay("quiz")),
        command("Brick", () => openOverlay("brick")),
        command("Search Songs", () => setDialog("search"), undefined, false),
      ];
    case "Settings":
      return [
        command(
          "Repeat",
          () =>
            patch({
              repeat: cycle(["off", "one", "all"] as const, preferences.repeat),
            }),
          preferences.repeat,
          false,
        ),
        command(
          "Shuffle",
          () => patch({ shuffle: !preferences.shuffle }),
          preferences.shuffle ? "On" : "Off",
          false,
        ),
        command(
          "Backlight",
          () => {
            patch({
              backlight: cycle(
                ["2s", "10s", "always-on", "off"] as const,
                preferences.backlight,
              ),
            });
            setBacklightOn(true);
          },
          preferences.backlight,
          false,
        ),
        command(
          "Theme",
          () =>
            patch({
              theme: cycle(
                ["classic", "black", "u2"] as const,
                preferences.theme,
              ),
            }),
          preferences.theme,
          false,
        ),
        command(
          "UI Theme",
          () =>
            patch({
              uiVariant:
                preferences.uiVariant === "modern" ? "classic" : "modern",
            }),
          preferences.uiVariant,
          false,
        ),
        command(
          "Library",
          () => showStatus("Apple Music needs developer credentials"),
          "YouTube",
          false,
        ),
        command(
          "Apple Music",
          () => showStatus("Apple Music is not configured"),
          "Unconfigured",
          false,
        ),
        command("Display", () => push({ title: "Display" })),
        command("Lyrics", () => push({ title: "Lyrics" })),
        command("Volume", () => push({ title: "Volume" })),
        command("z1han.com 改编自 ryOS", () => setDialog("about")),
        command("About · AGPL-3.0", () => setDialog("about")),
      ];
    case "Display":
      return Object.values(DisplayMode).map((mode) =>
        command(
          mode[0].toUpperCase() + mode.slice(1),
          () => {
            patch({ displayMode: mode });
            setShowVideo(true);
            setMenuMode(false);
          },
          preferences.displayMode === mode ? "✓" : undefined,
          false,
        ),
      );
    case "Lyrics":
      return [
        command(
          "Show Lyrics",
          () => patch({ showLyrics: !preferences.showLyrics }),
          preferences.showLyrics ? "On" : "Off",
          false,
        ),
        command(
          "Alignment",
          () =>
            patch({
              lyricsAlignment: cycle(
                Object.values(LyricsAlignment),
                preferences.lyricsAlignment,
              ),
            }),
          preferences.lyricsAlignment,
          false,
        ),
        command(
          "Font",
          () =>
            patch({
              lyricsFont: cycle(
                Object.values(LyricsFont),
                preferences.lyricsFont,
              ),
            }),
          preferences.lyricsFont,
          false,
        ),
        command(
          "Timing +0.1s",
          () => setLyricOffset((v) => v + 100),
          `${lyricOffset / 1000}s`,
          false,
        ),
        command(
          "Timing −0.1s",
          () => setLyricOffset((v) => v - 100),
          undefined,
          false,
        ),
        command("Pronunciation", () => push({ title: "Pronunciation" })),
      ];
    case "Pronunciation":
      return (
        [
          ["enabled", "Pronunciation"],
          ["japaneseFurigana", "Japanese Furigana"],
          ["japaneseRomaji", "Japanese Romaji"],
          ["korean", "Korean"],
          ["chinese", "Chinese Pinyin"],
          ["chineseZhuyin", "Chinese Zhuyin"],
          ["pronunciationOnly", "Pronunciation Only"],
        ] as const
      ).map(([key, label]) =>
        command(
          label,
          () =>
            patch({
              romanization: {
                ...preferences.romanization,
                [key]: !preferences.romanization[key],
              },
            }),
          preferences.romanization[key] ? "On" : "Off",
          false,
        ),
      );
    case "Volume":
      return [
        command(
          "Volume Up",
          () => patch({ volume: Math.min(1, preferences.volume + 0.1) }),
          `${Math.round(preferences.volume * 100)}%`,
          false,
        ),
        command(
          "Volume Down",
          () => patch({ volume: Math.max(0, preferences.volume - 0.1) }),
          undefined,
          false,
        ),
      ];
    case "Song":
      return [
        command(
          preferences.favorites.includes(currentTrack?.id ?? "")
            ? "Remove Favorite"
            : "Add Favorite",
          favorite,
          undefined,
          false,
        ),
        command(
          "Lyrics",
          () => {
            patch({ showLyrics: true });
            nowPlaying();
            setShowVideo(true);
          },
          undefined,
          false,
        ),
        command("Display", () => push({ title: "Display" })),
        command(
          "Open on YouTube",
          () => {
            if (currentTrack)
              window.open(currentTrack.url, "_blank", "noopener,noreferrer");
          },
          undefined,
          false,
        ),
        command(
          "Remove Song",
          () => {
            if (currentTrack) {
              library.remove(currentTrack.id);
              setCurrentIndex(0);
              setPlaybackRequested(false);
              back();
            }
          },
          undefined,
          false,
        ),
      ];
    default:
      return [];
  }
}
