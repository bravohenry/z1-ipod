/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 BrickGame 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/brick-game/BrickGame.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useBrickGame } from "./useBrickGame";
import { BrickGameView } from "./BrickGameView";
import type { BrickGameProps, BrickGameRef } from "./types";

export const BrickGame = function BrickGame({
  ref,
  isVisible,
  lcdFilterOn = false,
  backlightOn = true,
  ...rest
}: BrickGameProps & { ref?: React.Ref<BrickGameRef> }) {
  const viewModel = useBrickGame({ ref, isVisible, lcdFilterOn, backlightOn, ...rest });
  if (!isVisible) return null;
  return <BrickGameView {...viewModel} />;
};
