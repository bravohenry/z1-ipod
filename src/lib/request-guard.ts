/**
 * [INPUT]: Web Request（headers/body 字节流）与服务端时钟。
 * [OUTPUT]: isSameOriginRequest、requestClientIp、createRateLimiter（多窗口、满额淘汰最旧客户端）、
 *           readLimitedBody（按实际字节上限读取，超限立即取消流）。
 * [POS]: lib 的公开 API 资源边界工具；/api/siri 与 /api/contact（经 contact/guard.ts）共同消费。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

/* 浏览器发出的 Origin 必须与实际 Host 一致；Next 开发服务器会改写 URL 主机名，故以 Host 头为准。 */
export function isSameOriginRequest(request: Request): boolean {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${request.headers.get("host") || url.host}`;
  return request.headers.get("origin") === origin;
}

/* Vercel 边缘会覆盖这两个头；本地无代理时退化为同一 "unknown" 桶。 */
export function requestClientIp(request: Request): string {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

type RateWindow = { readonly duration: number; readonly limit: number };

/**
 * 每客户端多窗口固定计数。返回 0 表示放行并已记账，否则返回需等待的秒数。
 * 容量满时先清过期客户端，仍满则淘汰最久未活动的客户端（Map 按最近活动重排），
 * 绝不整表清零——溢出只影响最冷的那个 IP，不会让所有人的额度复位。
 * shortcut: 计数只在当前实例内存中；严格全局配额需 Vercel Firewall 或共享存储。
 */
export function createRateLimiter(windows: readonly RateWindow[], maxClients = 1000) {
  const hits = new Map<string, { start: number; count: number }[]>();
  const expired = (entry: { start: number }[], now: number) =>
    entry.every((window, i) => now - window.start >= windows[i].duration);

  return function retryAfter(key: string, now = Date.now()): number {
    if (!hits.has(key) && hits.size >= maxClients) {
      for (const [client, entry] of hits) if (expired(entry, now)) hits.delete(client);
      if (hits.size >= maxClients) hits.delete(hits.keys().next().value as string);
    }
    const current = windows.map(({ duration }, i) => {
      const recent = hits.get(key)?.[i];
      return recent && now - recent.start < duration ? recent : { start: now, count: 0 };
    });
    const wait = Math.max(0, ...current.map((window, i) => window.count >= windows[i].limit
      ? Math.ceil((window.start + windows[i].duration - now) / 1000) : 0));
    if (wait) return wait;
    current.forEach((window) => window.count++);
    hits.delete(key); // 重新插入 = 移到“最近活动”端
    hits.set(key, current);
    return 0;
  };
}

/* 按实际 UTF-8 字节读取正文；超过 maxBytes 立即取消上游流并返回 null。非法 UTF-8 抛错。 */
export async function readLimitedBody(request: Request, maxBytes: number): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let length = 0, text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return text + decoder.decode();
      length += value.byteLength;
      if (length > maxBytes) { await reader.cancel(); return null; }
      text += decoder.decode(value, { stream: true });
    }
  } catch (error) { await reader.cancel(); throw error; }
  finally { reader.releaseLock(); }
}
