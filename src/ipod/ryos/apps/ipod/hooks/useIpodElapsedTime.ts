/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 useIpodElapsedTime 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/ipod-screen/../../hooks/useIpodElapsedTime.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useIpodStore } from "@/ipod/context";

/**
 * Narrow subscription to the iPod playback clock.
 *
 * `elapsedTime` updates ~20x/sec while a track plays. Subscribing to it from
 * `useIpodLogic` (or any other large hook) re-renders the entire iPod tree on
 * every tick, so only leaf components that actually display time should call
 * this hook.
 *
 * Pass `enabled: false` while the consuming UI is hidden (e.g. a closed
 * dialog) to opt out of tick re-renders entirely — the selector then returns
 * a constant `0`.
 */
export function useIpodElapsedTime(enabled: boolean = true): number {
  return useIpodStore((s) => (enabled ? s.elapsedTime : 0));
}
