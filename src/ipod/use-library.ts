/**
 * [INPUT]: 作者歌单与 YouTube oEmbed。
 * [OUTPUT]: useIpodLibrary，本地添加/移除与异步曲目信息。
 * [POS]: 作者歌单保留在 data/playlist；本地存储只保存用户添加和移除的 ID。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import {
  useEffect,
  useRef,
  useState,
  startTransition,
  useCallback,
} from "react";
import type { Track } from "./ryos/shared/media/library";
import { IPOD_TRACKS } from "@/data/playlist";
import { getYouTubeVideoId } from "./ryos/apps/ipod/constants";
const knownMetadata: Record<string, Partial<Track>> = Object.fromEntries(
  IPOD_TRACKS.map((track) => [track.id, track]),
);
const KEY = "z1:ipod:library";
type Changes = { added: string[]; removed: string[] };
const validIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .filter(
          (id): id is string =>
            typeof id === "string" && /^[\w-]{11}$/.test(id),
        )
        .slice(0, 1000)
    : [];
const seed = (urls: string): Track[] =>
  [
    ...new Set(
      urls
        .split(",")
        .map(getYouTubeVideoId)
        .filter((id): id is string => Boolean(id)),
    ),
  ].map((id, index) => ({
    id,
    url: `https://www.youtube.com/watch?v=${id}`,
    title: `Song ${index + 1}`,
    source: "youtube",
    importOrder: index,
    ...knownMetadata[id],
  }));
export function useIpodLibrary(urls: string) {
  const [tracks, setTracks] = useState(() => seed(urls));
  const changes = useRef<Changes>({ added: [], removed: [] });
  const signal = useRef<AbortSignal | null>(null);
  const enrich = useCallback(async (entries: Track[], abort: AbortSignal) => {
    let cursor = 0;
    const worker = async () => {
      while (cursor < entries.length && !abort.aborted) {
        const track = entries[cursor++];
        if (knownMetadata[track.id]) continue;
        try {
          const response = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(track.url)}&format=json`,
            { signal: abort },
          );
          if (!response.ok) continue;
          const data = await response.json();
          if (typeof data.title !== "string" || abort.aborted) continue;
          setTracks((previous) =>
            previous.map((value) =>
              value.id === track.id
                ? {
                    ...value,
                    title: data.title.slice(0, 500),
                    artist:
                      typeof data.author_name === "string"
                        ? data.author_name.slice(0, 200)
                        : "YouTube",
                  }
                : value,
            ),
          );
        } catch {
          /* 元数据失败保留可识别的曲目 ID，不伪造歌手。 */
        }
      }
    };
    await Promise.all(Array.from({ length: 4 }, worker));
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    signal.current = controller.signal;
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      changes.current = {
        added: validIds(saved?.added),
        removed: validIds(saved?.removed),
      };
    } catch {
      changes.current = { added: [], removed: [] };
    }
    const original = seed(urls),
      saved = changes.current;
    const initial = [
      ...original,
      ...seed(saved.added.join(",")).filter(
        (track) => !original.some((value) => value.id === track.id),
      ),
    ].filter((track) => !saved.removed.includes(track.id));
    startTransition(() => setTracks(initial));
    void enrich(initial, controller.signal);
    return () => controller.abort();
  }, [urls, enrich]);
  const persist = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(changes.current));
    } catch {
      /* 存储不可用时保留本次会话。 */
    }
  };
  const add = (input: string) => {
    const entries = seed(input).filter(
      (track) => !tracks.some((value) => value.id === track.id),
    );
    if (!entries.length) return false;
    changes.current = {
      added: [
        ...new Set([
          ...changes.current.added,
          ...entries.map((track) => track.id),
        ]),
      ],
      removed: changes.current.removed.filter(
        (id) => !entries.some((track) => track.id === id),
      ),
    };
    persist();
    setTracks((previous) => [
      ...previous,
      ...entries.filter(
        (track) => !previous.some((value) => value.id === track.id),
      ),
    ]);
    if (signal.current) void enrich(entries, signal.current);
    return true;
  };
  const remove = (id: string) => {
    changes.current = {
      added: changes.current.added.filter((value) => value !== id),
      removed: [...new Set([...changes.current.removed, id])],
    };
    persist();
    setTracks((previous) => previous.filter((track) => track.id !== id));
  };
  return { tracks, add, remove };
}
