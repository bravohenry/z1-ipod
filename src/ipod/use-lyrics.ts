/**
 * [INPUT]: 当前曲目、播放时钟与站内 iPod 歌词 API。
 * [OUTPUT]: useLyrics，同步歌词与请求状态。
 * [POS]: ryOS 歌词界面的会话适配；取消离场请求并隔离旧曲目结果。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useEffect, useMemo, useState } from "react";
import type { Track } from "./ryos/shared/media/library";
import type { LyricLine } from "./ryos/types/lyrics";
const EMPTY_LINES: LyricLine[] = [];
export function useLyrics(
  track: Track | null,
  time: number,
  offset: number,
  enabled: boolean,
  onSeek: (seconds: number) => void,
) {
  const [result, setResult] = useState<{
    key: string;
    lines: LyricLine[];
    error?: string;
  }>({ key: "", lines: [] });
  const id = track?.id,
    title = track?.title,
    artist = track?.artist ?? "";
  const key = JSON.stringify([id, title, artist]);
  useEffect(() => {
    if (!enabled || !id || !title) return;
    const controller = new AbortController();
    const params = new URLSearchParams({
      id,
      title: title.slice(0, 180),
      artist: artist.slice(0, 120),
    });
    void fetch(`/api/ipod/lyrics?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            typeof data.error === "string" ? data.error : "Lyrics unavailable",
          );
        if (!Array.isArray(data.lines))
          throw new Error("Invalid lyrics response");
        const lines = data.lines.filter(
          (line: LyricLine) =>
            typeof line.words === "string" &&
            Number.isFinite(+line.startTimeMs),
        );
        if (!controller.signal.aborted) setResult({ key, lines });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setResult({
            key,
            lines: [],
            error:
              error instanceof Error ? error.message : "Lyrics unavailable",
          });
      });
    return () => controller.abort();
  }, [id, title, artist, key, enabled]);
  const lines = result.key === key ? result.lines : EMPTY_LINES;
  const currentLine = useMemo(() => {
    let index = -1;
    for (let i = 0; i < lines.length; i++)
      if (+lines[i].startTimeMs <= time * 1000 + offset) index = i;
    return index;
  }, [lines, time, offset]);
  return {
    lines,
    originalLines: lines,
    currentLine,
    isLoading: enabled && result.key !== key,
    error: result.key === key ? result.error : undefined,
    isTranslating: false,
    currentTranslation: null,
    translationProgress: 0,
    updateCurrentTimeManually: (seconds: number) => onSeek(seconds),
  };
}
