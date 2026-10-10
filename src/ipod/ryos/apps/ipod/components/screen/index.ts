/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 index 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/screen/index.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
// Re-export all screen components
export { BatteryIndicator } from "./BatteryIndicator";
export { Scrollbar } from "./Scrollbar";
export { MenuListItem } from "./MenuListItem";
export { ScrollingText } from "./ScrollingText";
export { StatusDisplay } from "./StatusDisplay";
export { IpodModernPlayPauseIcon } from "./IpodModernPlayPauseIcon";
export {
  IpodArtworkPlaceholder,
  type IpodEmptyArtworkKind,
} from "./IpodArtworkPlaceholder";
