/**
 * GET /api/ipod/lyrics — same-origin lyrics proxy for the open z1-ipod player.
 * Bounded params, shared rate limiter, miss cache. KuGou/LRCLIB only via lib/ipod-lyrics.
 */
import { fetchIpodLyrics, type IpodLyricLine } from "@/lib/ipod-lyrics";
import { createRateLimiter, isSameOriginRequest, requestClientIp } from "@/lib/request-guard";

export const runtime = "nodejs";
export const maxDuration = 30;

const cache = new Map<string, { expires: number; lines: IpodLyricLine[] | null }>();
const pending = new Map<string, Promise<IpodLyricLine[]>>();
const retryAfter = createRateLimiter(
  [
    { duration: 60_000, limit: 12 },
    { duration: 3_600_000, limit: 120 },
  ],
  1000,
);

export async function GET(request: Request) {
  // Browser embeds must be same-origin; server-to-server / curl without Origin is allowed.
  const origin = request.headers.get("origin");
  if (origin && !isSameOriginRequest(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  const title = url.searchParams.get("title")?.trim() ?? "";
  const artist = url.searchParams.get("artist")?.trim() ?? "";
  if (!/^[\w-]{11}$/.test(id) || !title || title.length > 180 || artist.length > 120) {
    return Response.json({ error: "Invalid song metadata" }, { status: 400 });
  }

  const now = Date.now();
  const key = JSON.stringify([id, title, artist]);
  const saved = cache.get(key);
  if (saved && saved.expires > now) {
    if (!saved.lines?.length) {
      return Response.json(
        { error: "No synchronized lyrics found" },
        { status: 404, headers: { "Cache-Control": "private, max-age=300" } },
      );
    }
    return Response.json(
      { lines: saved.lines },
      { headers: { "Cache-Control": "private, max-age=3600" } },
    );
  }

  const wait = retryAfter(requestClientIp(request), now);
  if (wait) {
    return Response.json(
      { error: "Too many lyric requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
  }

  try {
    let operation = pending.get(key);
    if (!operation) {
      operation = fetchIpodLyrics(title, artist);
      pending.set(key, operation);
      void operation.finally(() => pending.delete(key)).catch(() => {});
    }
    const lines = await operation;
    if (cache.size >= 200) cache.delete(cache.keys().next().value!);
    if (!lines.length) {
      cache.set(key, { lines: null, expires: now + 5 * 60_000 });
      return Response.json({ error: "No synchronized lyrics found" }, { status: 404 });
    }
    cache.set(key, { lines, expires: now + 6 * 3_600_000 });
    return Response.json({ lines });
  } catch {
    return Response.json(
      { error: "Lyrics service unavailable. Try again later." },
      { status: 503 },
    );
  }
}
