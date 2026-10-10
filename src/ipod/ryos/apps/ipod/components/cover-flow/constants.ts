/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 constants 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/cover-flow/constants.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { IPOD_MODERN_TITLEBAR_HEIGHT_PX } from "../../constants";

// Shared cross-fade for cover images: stay invisible while
// loading (the wrapping element's gray background reads as the
// placeholder), then fade up to the loaded state in 250ms.
export const COVER_FADE_TRANSITION = "opacity 250ms ease-out" as const;

// Matches `MODERN_TITLEBAR_HEIGHT` in IpodScreen (shared constant).
export const MODERN_TITLEBAR_HEIGHT = IPOD_MODERN_TITLEBAR_HEIGHT_PX;

// Long press delay in milliseconds
export const LONG_PRESS_DELAY = 500;
