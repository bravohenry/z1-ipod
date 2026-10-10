/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 timeFormat 的界面或纯运算。
 * [POS]: ryOS utils/timeFormat.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { formatSeconds } from "./formatDuration";

/** Unpadded minutes playback label (e.g. `1:05`, `60:00`). */
export function formatSecondsAsMinutesSeconds(totalSeconds: number): string {
  return formatSeconds(totalSeconds);
}
