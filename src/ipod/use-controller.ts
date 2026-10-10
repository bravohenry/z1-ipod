/**
 * [INPUT]: React 状态、Z1 曲库与 ryOS 菜单/屏幕类型。
 * [OUTPUT]: useIpodController，连接菜单、播放、偏好与游戏。
 * [POS]: iPod 宿主控制器；界面读取投影，用户动作改变唯一会话状态。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
"use client";
import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import type ReactPlayer from "react-player";
import type { MenuHistoryEntry } from "./ryos/apps/ipod/types";
import type { CoverFlowRef } from "./ryos/apps/ipod/components/cover-flow/types";
import type { BrickGameRef } from "./ryos/apps/ipod/components/brick-game/types";
import type { MusicQuizRef } from "./ryos/apps/ipod/components/music-quiz/types";
import {
  DisplayMode,
  LyricsAlignment,
  LyricsFont,
  type RomanizationSettings,
} from "./ryos/types/lyrics";
import type { IpodHostState } from "./context";
import { useIpodLibrary } from "./use-library";
import { useLyrics } from "./use-lyrics";
import { buildMenu } from "./menus";
import type { Route, Preferences } from "./model";
const KEY = "z1:ipod:preferences";
const defaultRomanization: RomanizationSettings = {
  enabled: false,
  japaneseFurigana: false,
  japaneseRomaji: false,
  korean: false,
  chinese: false,
  chineseZhuyin: false,
  chineseLyricsLanguage: "auto",
  soramimi: false,
  soramamiTargetLanguage: "en",
};
const defaults: Preferences = {
  uiVariant: "modern",
  theme: "classic",
  repeat: "off",
  shuffle: false,
  backlight: "always-on",
  volume: 0.65,
  displayMode: DisplayMode.Video,
  showLyrics: true,
  lyricsFont: LyricsFont.SansSerif,
  lyricsAlignment: LyricsAlignment.FocusThree,
  romanization: defaultRomanization,
  favorites: [],
};
const randomIndex = (length: number) => Math.floor(Math.random() * length);
export function useIpodController(
  youtubeUrl: string,
  initialTheme: Preferences["theme"],
) {
  const library = useIpodLibrary(youtubeUrl);
  const [preferences, setPreferences] = useState<Preferences>({
    ...defaults,
    theme: initialTheme,
  });
  const [hydrated, setHydrated] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([
    { title: "iPod", kind: "root" },
  ]);
  const [selected, setSelected] = useState(0);
  const [menuMode, setMenuMode] = useState(true);
  const [menuDirection, setMenuDirection] = useState<"forward" | "backward">(
    "forward",
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRequested, setPlaybackRequested] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [backlightOn, setBacklightOn] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<
    "cover-flow" | "brick" | "quiz" | null
  >(null);
  const [dialog, setDialog] = useState<"add" | "search" | "about" | null>(null);
  const [lyricOffset, setLyricOffset] = useState(0);
  const playerRef = useRef<ReactPlayer | null>(null);
  const coverFlowRef = useRef<CoverFlowRef | null>(null);
  const brickGameRef = useRef<BrickGameRef | null>(null);
  const musicQuizRef = useRef<MusicQuizRef | null>(null);
  const activityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentTrack = library.tracks[currentIndex] ?? null;
  const lyrics = useLyrics(
    currentTrack,
    elapsedTime,
    lyricOffset,
    preferences.showLyrics && (!menuMode || playbackRequested),
    setElapsedTime,
  );
  const patch = (next: Partial<Preferences>) =>
    setPreferences((p) => ({ ...p, ...next }));
  const push = (route: Route) => {
    setRoutes((prev) => [...prev, route]);
    setSelected(0);
    setMenuMode(true);
    setShowVideo(false);
    setMenuDirection("forward");
  };
  const showStatus = (message: string) => setStatusMessage(message);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved && typeof saved === "object")
        startTransition(() =>
          setPreferences((prev) => ({
            ...prev,
            uiVariant: saved.uiVariant === "classic" ? "classic" : "modern",
            volume:
              typeof saved.volume === "number"
                ? Math.max(0, Math.min(1, saved.volume))
                : prev.volume,
            repeat: ["off", "one", "all"].includes(saved.repeat)
              ? saved.repeat
              : prev.repeat,
            shuffle: saved.shuffle === true,
            theme: ["classic", "black", "u2"].includes(saved.theme)
              ? saved.theme
              : prev.theme,
            backlight: ["2s", "10s", "always-on", "off"].includes(
              saved.backlight,
            )
              ? saved.backlight
              : prev.backlight,
            displayMode: Object.values(DisplayMode).includes(saved.displayMode)
              ? saved.displayMode
              : prev.displayMode,
            showLyrics:
              typeof saved.showLyrics === "boolean"
                ? saved.showLyrics
                : prev.showLyrics,
            lyricsFont: Object.values(LyricsFont).includes(saved.lyricsFont)
              ? saved.lyricsFont
              : prev.lyricsFont,
            lyricsAlignment: Object.values(LyricsAlignment).includes(
              saved.lyricsAlignment,
            )
              ? saved.lyricsAlignment
              : prev.lyricsAlignment,
            favorites: Array.isArray(saved.favorites)
              ? saved.favorites.filter((v: unknown) => typeof v === "string")
              : [],
            romanization: { ...defaultRomanization, ...saved.romanization },
          })),
        );
    } catch {
      /* 旧偏好损坏时保留默认值。 */
    }
    startTransition(() => setHydrated(true));
  }, []);
  useEffect(() => {
    if (hydrated)
      try {
        localStorage.setItem(KEY, JSON.stringify(preferences));
      } catch {
        /* 本地偏好不可写时会话仍可用。 */
      }
  }, [preferences, hydrated]);
  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => setStatusMessage(null), 2200);
    return () => clearTimeout(timer);
  }, [statusMessage]);
  useEffect(
    () => () => {
      if (activityTimer.current) clearTimeout(activityTimer.current);
    },
    [],
  );
  const registerActivity = () => {
    if (activityTimer.current) clearTimeout(activityTimer.current);
    setBacklightOn(preferences.backlight !== "off");
    if (preferences.backlight === "2s" || preferences.backlight === "10s")
      activityTimer.current = setTimeout(
        () => setBacklightOn(false),
        preferences.backlight === "2s" ? 2000 : 10000,
      );
  };
  const togglePlay = () => {
    registerActivity();
    setPlaybackError(null);
    setPlaybackRequested((value) => !value);
  };
  const playTrack = (index: number) => {
    if (!library.tracks[index]) return;
    setCurrentIndex(index);
    setElapsedTime(0);
    setTotalTime(0);
    setIsPlaying(false);
    setPlaybackError(null);
    setPlaybackRequested(true);
    setMenuMode(false);
    setShowVideo(true);
    setOverlay(null);
    setLyricOffset(library.tracks[index].lyricOffset ?? 0);
    registerActivity();
  };
  const nextTrack = () => {
    const n = library.tracks.length;
    if (!n) return;
    if (preferences.shuffle && n > 1) {
      const offset = 1 + randomIndex(n - 1);
      playTrack((currentIndex + offset) % n);
      return;
    }
    playTrack((currentIndex + 1) % n);
  };
  const previousTrack = () => {
    if (elapsedTime > 3) {
      playerRef.current?.seekTo(0, "seconds");
      setElapsedTime(0);
    } else if (library.tracks.length)
      playTrack(
        (currentIndex - 1 + library.tracks.length) % library.tracks.length,
      );
  };
  const openOverlay = (value: typeof overlay) => {
    setOverlay(value);
    setShowVideo(false);
    if (value === "brick" || value === "quiz") setPlaybackRequested(false);
  };
  const back = () => {
    registerActivity();
    setPlaybackError(null);
    if (overlay === "cover-flow" && coverFlowRef.current?.handleMenuButton())
      return;
    if (overlay) {
      setOverlay(null);
      return;
    }
    if (dialog) {
      setDialog(null);
      return;
    }
    setShowVideo(false);
    setMenuDirection("backward");
    setSelected(0);
    if (!menuMode) {
      setMenuMode(true);
      return;
    }
    if (routes.length > 1) setRoutes((prev) => prev.slice(0, -1));
  };
  const nowPlaying = () => {
    setMenuMode(false);
    setShowVideo(false);
    setOverlay(null);
    setMenuDirection("forward");
  };
  const favorite = () => {
    if (currentTrack)
      patch({
        favorites: preferences.favorites.includes(currentTrack.id)
          ? preferences.favorites.filter((id) => id !== currentTrack.id)
          : [...preferences.favorites, currentTrack.id],
      });
  };
  // 菜单只封装事件；构建时不调用捕获播放器引用的动作。
  // eslint-disable-next-line react-hooks/refs
  const menuHistory: MenuHistoryEntry[] = routes.map((route) => ({
    title: route.title,
    kind: route.kind,
    id: route.filter,
    items: buildMenu(route, {
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
    }),
    selectedIndex: selected,
    modernMediaList: route.kind === "albums" || Boolean(route.filter),
    alphabetic: route.kind === "artists" || route.kind === "albums",
  }));
  const scroll = (delta: number) => {
    registerActivity();
    if (overlay === "cover-flow") {
      if (delta > 0) coverFlowRef.current?.navigateNext();
      else coverFlowRef.current?.navigatePrevious();
      return;
    }
    if (overlay === "brick") {
      brickGameRef.current?.navigate(delta > 0 ? "next" : "previous");
      return;
    }
    if (overlay === "quiz") {
      musicQuizRef.current?.navigate(delta > 0 ? "next" : "previous");
      return;
    }
    if (menuMode) {
      const max = menuHistory.at(-1)?.items.length ?? 0;
      setSelected((value) => Math.max(0, Math.min(max - 1, value + delta)));
    } else
      setPreferences((previous) => ({
        ...previous,
        volume: Math.max(0, Math.min(1, previous.volume + delta * 0.05)),
      }));
  };
  const select = () => {
    registerActivity();
    if (overlay === "cover-flow") {
      coverFlowRef.current?.selectCurrent();
      return;
    }
    if (overlay === "brick") {
      brickGameRef.current?.selectCurrent();
      return;
    }
    if (overlay === "quiz") {
      musicQuizRef.current?.selectCurrent();
      return;
    }
    if (menuMode) menuHistory.at(-1)?.items[selected]?.action();
    else setShowVideo((value) => !value);
  };
  const longPress = () => {
    if (overlay || dialog) return;
    if (currentTrack) {
      setRoutes([{ title: "Song", kind: "nowPlayingSong" }]);
      setSelected(0);
      setMenuMode(true);
      setShowVideo(false);
    }
  };
  const wheelClick = (area: "top" | "right" | "bottom" | "left" | "center") => {
    if (area === "top") back();
    else if (area === "center") select();
    else if (area === "right") {
      if (overlay) scroll(1);
      else nextTrack();
    } else if (area === "left") {
      if (overlay) scroll(-1);
      else previousTrack();
    } else if (overlay === "brick") brickGameRef.current?.togglePause();
    else if (overlay === "quiz") musicQuizRef.current?.replaySnippet();
    else togglePlay();
  };
  const handleTrackEnd = () => {
    if (preferences.repeat === "one") {
      playerRef.current?.seekTo(0, "seconds");
      setPlaybackRequested(true);
    } else if (
      currentIndex < library.tracks.length - 1 ||
      preferences.repeat === "all" ||
      preferences.shuffle
    )
      nextTrack();
    else setPlaybackRequested(false);
  };
  const handlePlaybackAttemptFailed = () => {
    setPlaybackRequested(false);
    setIsPlaying(false);
    setShowVideo(false);
    setPlaybackError("YouTube could not play this song.");
    setMenuMode(false);
  };
  const [appleMusicKitNowPlaying, setAppleMusicKitNowPlaying] =
    useState<IpodHostState["appleMusicKitNowPlaying"]>(null);
  const host = useMemo<IpodHostState>(
    () => ({
      tracks: library.tracks,
      appleMusicTracks: [],
      librarySource: "youtube",
      uiVariant: preferences.uiVariant,
      elapsedTime,
      volume: preferences.volume,
      lyricsAlignment: preferences.lyricsAlignment,
      lyricsFont: preferences.lyricsFont,
      romanization: preferences.romanization,
      appleMusicKitNowPlaying,
      setAppleMusicKitNowPlaying,
    }),
    [library.tracks, preferences, elapsedTime, appleMusicKitNowPlaying],
  );
  return {
    host,
    preferences,
    patch,
    library,
    currentTrack,
    currentIndex,
    isPlaying,
    playbackRequested,
    setIsPlaying,
    setPlaybackRequested,
    elapsedTime,
    setElapsedTime,
    totalTime,
    setTotalTime,
    menuMode,
    menuHistory,
    selected,
    setSelected,
    menuDirection,
    showVideo,
    setShowVideo,
    backlightOn,
    registerActivity,
    statusMessage,
    showStatus,
    playbackError,
    setPlaybackError,
    dialog,
    setDialog,
    overlay,
    setOverlay,
    playerRef,
    coverFlowRef,
    brickGameRef,
    musicQuizRef,
    lyricOffset,
    setLyricOffset,
    lyrics,
    playTrack,
    nextTrack,
    previousTrack,
    togglePlay,
    back,
    select,
    scroll,
    longPress,
    wheelClick,
    handleTrackEnd,
    handlePlaybackAttemptFailed,
  };
}
export type IpodController = ReturnType<typeof useIpodController>;
