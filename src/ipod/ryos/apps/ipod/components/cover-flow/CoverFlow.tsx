/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 CoverFlow 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/cover-flow/CoverFlow.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import type { CoverFlowComponentProps } from "./types";
import { useCoverFlowController } from "./useCoverFlowController";
import { CoverFlowInlineView } from "./CoverFlowInlineView";
import { CoverFlowOverlayView } from "./CoverFlowOverlayView";

export function CoverFlow(props: CoverFlowComponentProps) {
  const vm = useCoverFlowController(props);
  const { inline } = props;

  if (inline) {
    return <CoverFlowInlineView vm={vm} />;
  }

  return <CoverFlowOverlayView vm={vm} isVisible={props.isVisible} />;
}
