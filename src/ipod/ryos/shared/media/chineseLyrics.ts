/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 chineseLyrics 的界面或纯运算。
 * [POS]: ryOS shared/media/chineseLyrics.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
export const CHINESE_LYRICS_LANGUAGES = ["zh-TW", "zh-CN"] as const;

export type ChineseLyricsLanguage =
  (typeof CHINESE_LYRICS_LANGUAGES)[number];
export type ChineseLyricsLanguagePreference =
  | ChineseLyricsLanguage
  | "auto";

export function isChineseLyricsLanguage(
  value: string | null | undefined
): value is ChineseLyricsLanguage {
  return CHINESE_LYRICS_LANGUAGES.includes(value as ChineseLyricsLanguage);
}

export function resolveChineseLyricsLanguage(
  preference: ChineseLyricsLanguagePreference | null | undefined,
  uiLanguage: string | null | undefined
): ChineseLyricsLanguage {
  if (isChineseLyricsLanguage(preference)) {
    return preference;
  }

  const normalized = uiLanguage?.replaceAll("_", "-").toLowerCase() ?? "";
  const subtags = normalized.split("-");
  if (
    subtags[0] === "zh" &&
    (subtags.includes("cn") ||
      subtags.includes("sg") ||
      subtags.includes("hans"))
  ) {
    return "zh-CN";
  }

  return "zh-TW";
}
