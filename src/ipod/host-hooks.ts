/**
 * [INPUT]: React 与浏览器媒体偏好。
 * [OUTPUT]: host-hooks 的宿主能力。
 * [POS]: craft/ipod 的适配边界；不导入 ryOS 操作系统或云同步。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useEffect, useState, useCallback } from "react";
import { useIpodStore } from "./context";
import type { Track } from "./ryos/shared/media/library";
function useQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = matchMedia(query);
    const update = () => setMatches(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, [query]);
  return matches;
}
export function useShaderAnimationDisabled() {
  return useQuery("(prefers-reduced-motion: reduce)");
}
export function useReducedGraphics() {
  return useQuery("(pointer: coarse)");
}
let graphicsAvailable: boolean | undefined;
export function useShaderEffectsEnabled() {
  const reduced = useShaderAnimationDisabled();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (reduced || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setReady(false));
      return;
    }
    if (graphicsAvailable === undefined) {
      const canvas = document.createElement("canvas");
      try {
        const gl = canvas.getContext("webgl2");
        graphicsAvailable = Boolean(gl);
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        graphicsAvailable = false;
      }
    }
    queueMicrotask(() => setReady(Boolean(graphicsAvailable)));
  }, [reduced]);
  return ready && !reduced;
}
export function useThemeFlags() {
  return { isMacOSTheme: true, isClassicTheme: false, isSystem7Theme: false };
}
export function useSaveSongCoverColor(track: Track) {
  return useCallback(
    (color: string, url: string) => {
      try {
        localStorage.setItem(
          `z1:ipod:cover:${track.id}`,
          JSON.stringify({ color, url }),
        );
      } catch {
        /* 缓存失败不阻塞播放。 */
      }
    },
    [track.id],
  );
}
export function useIpodVolume() {
  return useIpodStore((s) => s.volume);
}
