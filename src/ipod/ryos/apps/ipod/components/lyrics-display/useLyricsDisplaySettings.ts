/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 useLyricsDisplaySettings 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/lyrics-display/useLyricsDisplaySettings.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useIpodStore } from "@/ipod/context";
import {
  LyricsFont,
  getLyricsFontClassName,
} from "@/ipod/ryos/types/lyrics";

import type { LyricsDisplayProps } from "./types";

/** Small iPod LCD lyrics always use sans-serif; ignore stored lyric style. */
export function getIpodSmallScreenLyricsFontClassName(
  uiVariant: "classic" | "modern"
): string {
  return uiVariant !== "classic"
    ? "font-ipod-modern-ui font-semibold"
    : "font-geneva-12";
}

export function useLyricsDisplaySettings({
  alignment: alignmentOverride,
  fontClassName: fontClassNameFromProp,
}: Pick<LyricsDisplayProps, "alignment" | "fontClassName">) {
  const {
    lyricsAlignment: storeAlignment,
    romanization,
    uiVariant: storeUiVariant,
    lyricsFont: storeLyricsFont,
  } = useIpodStore(
    ((s) => ({
      lyricsAlignment: s.lyricsAlignment,
      romanization: s.romanization,
      uiVariant: s.uiVariant,
      lyricsFont: s.lyricsFont,
    }))
  );

  const fontClassName =
    fontClassNameFromProp ??
    (storeUiVariant !== "classic"
      ? storeLyricsFont === LyricsFont.SansSerif
        ? "font-ipod-modern-ui font-semibold"
        : getLyricsFontClassName(storeLyricsFont)
      : "font-geneva-12");

  const alignment = alignmentOverride ?? storeAlignment;
  const showKoreanRomanization = romanization.enabled && romanization.korean;

  return {
    alignment,
    fontClassName,
    romanization,
    showKoreanRomanization,
  };
}
