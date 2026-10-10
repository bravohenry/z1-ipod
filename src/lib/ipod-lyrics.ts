/**
 * [INPUT]: KuGou/LRCLIB 公开歌词接口、Node zlib 与 OpenCC。
 * [OUTPUT]: fetchIpodLyrics、parseIpodLrc、parseIpodKrc，同步行与逐词时钟。
 * [POS]: iPod 歌词服务边界；客户端不直接访问 KuGou。KRC 格式适配自 ryOS d989f4d，AGPL-3.0-or-later，Copyright (C) 2025 Ryo Lu。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { inflateSync } from "node:zlib";
import { Converter } from "opencc-js";
export interface IpodLyricWord {
  text: string;
  startTimeMs: number;
  durationMs: number;
}
export interface IpodLyricLine {
  startTimeMs: string;
  words: string;
  wordTimings?: IpodLyricWord[];
}
const simplify = Converter({ from: "tw", to: "cn" });
const KRC_KEY = [
  64, 71, 97, 119, 94, 50, 116, 71, 81, 54, 49, 45, 206, 210, 110, 105,
];
const MAX_BYTES = 1024 * 1024;
export function parseIpodLrc(text: string): IpodLyricLine[] {
  const lines: IpodLyricLine[] = [];
  for (const row of text.split(/\r?\n/)) {
    const words = row.replace(/\[[^\]]+\]/g, "").trim();
    if (!words) continue;
    for (const stamp of row.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g))
      lines.push({
        startTimeMs: String((+stamp[1] * 60 + +stamp[2]) * 1000),
        words,
      });
  }
  return lines.sort((a, b) => +a.startTimeMs - +b.startTimeMs);
}
export function parseIpodKrc(text: string): IpodLyricLine[] {
  const lines: IpodLyricLine[] = [];
  for (const row of text.split(/\r?\n/)) {
    const time = row.match(/^\[(\d+),(\d+)\]/);
    if (!time) continue;
    const timed = [...row.matchAll(/<(\d+),(\d+),\d+>([^<]*)/g)].map(
      (word) => ({
        text: word[3],
        startTimeMs: +word[1],
        durationMs: +word[2],
      }),
    );
    const words = timed
      .map((word) => word.text)
      .join("")
      .trim();
    if (words) lines.push({ startTimeMs: time[1], words, wordTimings: timed });
  }
  return lines.sort((a, b) => +a.startTimeMs - +b.startTimeMs);
}
export function decodeIpodKrc(content: string) {
  const bytes = Buffer.from(content, "base64");
  if (bytes.length > MAX_BYTES || bytes.subarray(0, 4).toString() !== "krc1")
    throw new Error("Invalid KRC payload");
  const encoded = bytes.subarray(4);
  for (let i = 0; i < encoded.length; i++)
    encoded[i] ^= KRC_KEY[i % KRC_KEY.length];
  return inflateSync(encoded, { maxOutputLength: MAX_BYTES }).toString("utf8");
}
async function providerJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(4000),
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!response.ok)
    throw new Error(`Lyrics provider returned ${response.status}`);
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Empty lyrics response");
  const chunks: Uint8Array[] = [];
  let count = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      count += value.byteLength;
      if (count > MAX_BYTES) throw new Error("Lyrics response too large");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as T;
}
type KugouSong = { hash?: string; songname?: string; singername?: string };
const normalize = (text: string) =>
  simplify(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
function matchSong(song: KugouSong, title: string, artist: string) {
  const t = normalize(title),
    a = normalize(artist),
    st = normalize(song.songname ?? ""),
    sa = normalize(song.singername ?? "");
  return (
    (!t || !st ? 0 : st === t ? 4 : st.includes(t) || t.includes(st) ? 2 : 0) +
    (a && sa && (sa.includes(a) || a.includes(sa)) ? 2 : 0)
  );
}
async function kugouLyrics(
  title: string,
  artist: string,
): Promise<IpodLyricLine[]> {
  const keyword = encodeURIComponent(simplify(`${title} ${artist}`));
  const result = await providerJson<{ data?: { info?: KugouSong[] } }>(
    `https://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${keyword}&page=1&pagesize=8&showtype=1`,
  );
  const matches = (result.data?.info ?? [])
    .filter(
      (song) =>
        typeof song.hash === "string" && typeof song.songname === "string",
    )
    .sort((a, b) => matchSong(b, title, artist) - matchSong(a, title, artist));
  const song = matches[0];
  if (!song?.hash || matchSong(song, title, artist) < 2) return [];
  const candidates = await providerJson<{
    candidates?: { id?: string | number; accesskey?: string }[];
  }>(
    `https://krcs.kugou.com/search?ver=1&man=yes&client=mobi&keyword=&duration=&hash=${encodeURIComponent(song.hash)}&album_audio_id=`,
  );
  const candidate = candidates.candidates?.[0];
  if (!candidate?.id || !candidate.accesskey) return [];
  const url = `https://lyrics.kugou.com/download?ver=1&client=pc&id=${encodeURIComponent(candidate.id)}&accesskey=${encodeURIComponent(candidate.accesskey)}&charset=utf8`;
  try {
    const krc = await providerJson<{ content?: string }>(`${url}&fmt=krc`);
    if (krc.content) {
      const lines = parseIpodKrc(decodeIpodKrc(krc.content));
      if (lines.length) return lines;
    }
  } catch {
    /* KRC 不可用时继续请求同一曲目的 LRC。 */
  }
  const lrc = await providerJson<{ content?: string }>(`${url}&fmt=lrc`);
  return lrc.content
    ? parseIpodLrc(Buffer.from(lrc.content, "base64").toString("utf8"))
    : [];
}
async function lrclibLyrics(
  title: string,
  artist: string,
): Promise<IpodLyricLine[]> {
  const rows = await providerJson<
    { syncedLyrics?: string; trackName?: string; artistName?: string }[]
  >(
    `https://lrclib.net/api/search?q=${encodeURIComponent(`${title} ${artist}`)}`,
  );
  const sorted = rows
    .filter((row) => row.syncedLyrics)
    .sort(
      (a, b) =>
        matchSong(
          { songname: b.trackName, singername: b.artistName },
          title,
          artist,
        ) -
        matchSong(
          { songname: a.trackName, singername: a.artistName },
          title,
          artist,
        ),
    );
  const row = sorted[0];
  return row?.syncedLyrics &&
    matchSong(
      { songname: row.trackName, singername: row.artistName },
      title,
      artist,
    ) >= 2
    ? parseIpodLrc(row.syncedLyrics)
    : [];
}
export async function fetchIpodLyrics(
  title: string,
  artist: string,
): Promise<IpodLyricLine[]> {
  try {
    const lines = await kugouLyrics(title, artist);
    if (lines.length) return lines;
  } catch {
    /* 第二公开来源承担服务故障降级。 */
  }
  return lrclibLyrics(title, artist);
}
