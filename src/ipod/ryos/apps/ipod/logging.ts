/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 logging 的界面或纯运算。
 * [POS]: ryOS apps/ipod/logging.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { createClientLogger } from "@/ipod/logger";

export const ipodLog = createClientLogger("iPod");
export const appleMusicLog = createClientLogger("AppleMusic");
