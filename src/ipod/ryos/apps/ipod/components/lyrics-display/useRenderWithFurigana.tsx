/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 useRenderWithFurigana 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/lyrics-display/useRenderWithFurigana.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useCallback, type ReactNode } from "react";
import { toRomaji } from "wanakana";
import type { LyricLine, RomanizationSettings } from "@/ipod/ryos/types/lyrics";
import { getChinesePhoneticSystem } from "@/ipod/ryos/types/lyrics";
import {
  isChineseText,
  hasKanaTextLocal,
  hasKoreanText,
  renderKoreanWithRomanization,
  renderChineseWithPhonetics,
  renderKanaWithRomaji,
  getFuriganaSegmentsPronunciationOnly,
  getKoreanPronunciationOnly,
  getChinesePronunciationOnly,
  getKanaPronunciationOnly,
  type FuriganaSegment,
} from "@/ipod/ryos/utils/romanization";
import { getDisplayReading } from "@/ipod/ryos/utils/furigana";

export function useRenderWithFurigana(
  romanization: RomanizationSettings,
  furiganaMap: Map<string, FuriganaSegment[]>,
  soramimiMap: Map<string, FuriganaSegment[]>
) {
  return useCallback(
    (line: LyricLine, processedText: string): ReactNode => {
      if (!romanization.enabled) {
        return processedText;
      }

      const keyPrefix = `line-${line.startTimeMs}`;
      const pronunciationOnly = romanization.pronunciationOnly ?? false;

      if (romanization.soramimi) {
        const soramimiSegments = soramimiMap.get(line.startTimeMs);
        if (soramimiSegments && soramimiSegments.length > 0) {
          if (pronunciationOnly) {
            if (romanization.soramamiTargetLanguage === "en") {
              const pronunciationText = soramimiSegments
                .map((seg) => seg.reading || seg.text)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();
              return <span key={keyPrefix}>{pronunciationText}</span>;
            }
            const pronunciationText = soramimiSegments
              .map((seg) => seg.reading || seg.text)
              .join("");
            return <span key={keyPrefix}>{pronunciationText}</span>;
          }
          return (
            <>
              {(() => {
                let segmentOffset = 0;
                return soramimiSegments.map((segment) => {
                  const segmentKey = `soramimi-${segmentOffset}-${segment.text}-${segment.reading ?? ""}`;
                  segmentOffset += Math.max(segment.text.length, 1);
                  if (segment.reading) {
                    return (
                      <ruby
                        key={segmentKey}
                        className="lyrics-furigana lyrics-soramimi"
                      >
                        {segment.text}
                        <rp>(</rp>
                        <rt className="lyrics-furigana-rt lyrics-soramimi-rt">
                          {segment.reading}
                        </rt>
                        <rp>)</rp>
                      </ruby>
                    );
                  }
                  return <span key={segmentKey}>{segment.text}</span>;
                });
              })()}
            </>
          );
        }
        return processedText;
      }

      const chinesePhonetic = getChinesePhoneticSystem(romanization);

      if (!romanization.japaneseFurigana) {
        if (chinesePhonetic && isChineseText(processedText)) {
          if (pronunciationOnly) {
            return (
              <span key={keyPrefix}>
                {getChinesePronunciationOnly(processedText, chinesePhonetic)}
              </span>
            );
          }
          return renderChineseWithPhonetics(processedText, keyPrefix, chinesePhonetic);
        }
        if (romanization.korean && hasKoreanText(processedText)) {
          if (pronunciationOnly) {
            return (
              <span key={keyPrefix}>
                {getKoreanPronunciationOnly(processedText)}
              </span>
            );
          }
          return renderKoreanWithRomanization(processedText, keyPrefix);
        }
        if (romanization.japaneseRomaji && hasKanaTextLocal(processedText)) {
          if (pronunciationOnly) {
            return (
              <span key={keyPrefix}>
                {getKanaPronunciationOnly(processedText)}
              </span>
            );
          }
          return renderKanaWithRomaji(processedText, keyPrefix);
        }
        return processedText;
      }

      const segments = furiganaMap.get(line.startTimeMs);
      if (!segments || segments.length === 0) {
        if (chinesePhonetic && isChineseText(processedText)) {
          if (pronunciationOnly) {
            return (
              <span key={keyPrefix}>
                {getChinesePronunciationOnly(processedText, chinesePhonetic)}
              </span>
            );
          }
          return renderChineseWithPhonetics(processedText, keyPrefix, chinesePhonetic);
        }
        if (romanization.korean && hasKoreanText(processedText)) {
          if (pronunciationOnly) {
            return (
              <span key={keyPrefix}>
                {getKoreanPronunciationOnly(processedText)}
              </span>
            );
          }
          return renderKoreanWithRomanization(processedText, keyPrefix);
        }
        if (romanization.japaneseRomaji && hasKanaTextLocal(processedText)) {
          if (pronunciationOnly) {
            return (
              <span key={keyPrefix}>
                {getKanaPronunciationOnly(processedText)}
              </span>
            );
          }
          return renderKanaWithRomaji(processedText, keyPrefix);
        }
        return processedText;
      }

      if (pronunciationOnly) {
        const options = {
          koreanRomanization: romanization.korean,
          japaneseRomaji: romanization.japaneseRomaji,
          chinesePinyin: romanization.chinese,
          chineseZhuyin: romanization.chineseZhuyin,
        };
        return (
          <span key={keyPrefix}>
            {getFuriganaSegmentsPronunciationOnly(segments, options)}
          </span>
        );
      }

      return (
        <>
          {(() => {
            let segmentOffset = 0;
            return segments.map((segment) => {
              const segmentKey = `furigana-${segmentOffset}-${segment.text}-${segment.reading ?? ""}`;
              segmentOffset += Math.max(segment.text.length, 1);
              const displayReadingSource = getDisplayReading(segment);
              if (displayReadingSource) {
                const displayReading = romanization.japaneseRomaji
                  ? toRomaji(displayReadingSource)
                  : displayReadingSource;
                return (
                  <ruby key={segmentKey} className="lyrics-furigana">
                    {segment.text}
                    <rp>(</rp>
                    <rt className="lyrics-furigana-rt">{displayReading}</rt>
                    <rp>)</rp>
                  </ruby>
                );
              }

              if (romanization.korean && hasKoreanText(segment.text)) {
                return renderKoreanWithRomanization(
                  segment.text,
                  `${segmentKey}-kr`
                );
              }

              if (chinesePhonetic && isChineseText(segment.text)) {
                return renderChineseWithPhonetics(
                  segment.text,
                  `${segmentKey}-cn`,
                  chinesePhonetic
                );
              }

              if (romanization.japaneseRomaji && hasKanaTextLocal(segment.text)) {
                return renderKanaWithRomaji(segment.text, `${segmentKey}-jp`);
              }

              return <span key={segmentKey}>{segment.text}</span>;
            });
          })()}
        </>
      );
    },
    [romanization, furiganaMap, soramimiMap]
  );
}
