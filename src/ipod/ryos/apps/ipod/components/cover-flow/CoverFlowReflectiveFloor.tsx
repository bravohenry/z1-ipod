/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 CoverFlowReflectiveFloor 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/cover-flow/CoverFlowReflectiveFloor.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
interface CoverFlowReflectiveFloorProps {
  isModernIpodCoverFlow: boolean;
}

export function CoverFlowReflectiveFloor({
  isModernIpodCoverFlow,
}: CoverFlowReflectiveFloorProps) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: isModernIpodCoverFlow
          ? "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.06) 78%, rgba(0,0,0,0.12) 100%)"
          : "linear-gradient(to bottom, transparent 40%, rgba(38,38,38,0.5) 70%, rgba(64,64,64,0.3) 100%)",
        pointerEvents: "none",
      }}
    />
  );
}
