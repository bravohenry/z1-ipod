/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 AquaShineOverlay 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/cover-flow/AquaShineOverlay.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
// Aqua-style shine overlay for macOS X theme buttons
export function AquaShineOverlay() {
  return (
    <div
      className="pointer-events-none absolute top-[3px] blur-[0.5px] left-1/2 -translate-x-1/2 rounded-full"
      style={{
        width: "40%",
        height: "35%",
        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))",
      }}
    />
  );
}
