/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 lyricsTranslation 的界面或纯运算。
 * [POS]: ryOS utils/lyricsTranslation.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import i18n from "@/ipod/i18n";

// Translation language options shared by the lyrics surfaces (iPod, Karaoke,
// lyrics menus and dialogs).
export interface TranslationLanguage {
  labelKey?: string;
  label?: string;
  code: string | null;
  separator?: boolean;
}

export const TRANSLATION_LANGUAGES: TranslationLanguage[] = [
  { labelKey: "apps.ipod.translationLanguages.original", code: null },
  { labelKey: "apps.ipod.translationLanguages.auto", code: "auto" },
  { separator: true, code: null, label: "" }, // Separator
  { labelKey: "apps.ipod.translationLanguages.english", code: "en" },
  { labelKey: "settings.language.chineseTraditional", code: "zh-TW" },
  { labelKey: "settings.language.chineseSimplified", code: "zh-CN" },
  { labelKey: "apps.ipod.translationLanguages.japanese", code: "ja" },
  { labelKey: "apps.ipod.translationLanguages.korean", code: "ko" },
  { labelKey: "apps.ipod.translationLanguages.spanish", code: "es" },
  { labelKey: "apps.ipod.translationLanguages.french", code: "fr" },
  { labelKey: "apps.ipod.translationLanguages.german", code: "de" },
  { labelKey: "apps.ipod.translationLanguages.portuguese", code: "pt" },
  { labelKey: "apps.ipod.translationLanguages.italian", code: "it" },
  { labelKey: "apps.ipod.translationLanguages.russian", code: "ru" },
];

// Translation badge mappings
export const TRANSLATION_BADGES: Record<string, string> = {
  "zh-TW": "繁",
  "zh-CN": "简",
  en: "En",
  ja: "日",
  ko: "한",
  es: "Es",
  fr: "Fr",
  de: "De",
  pt: "Pt",
  it: "It",
  ru: "Ru",
};

// Helper to get translation badge from code
export function getTranslationBadge(code: string | null): string | null {
  if (!code) return null;
  // For "auto", resolve to the actual ryOS language
  if (code === "auto") {
    const actualLang = i18n.language;
    return (
      TRANSLATION_BADGES[actualLang] || actualLang[0]?.toUpperCase() || "?"
    );
  }
  return TRANSLATION_BADGES[code] || code[0]?.toUpperCase() || "?";
}
