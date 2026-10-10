/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 MusicQuiz 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/music-quiz/MusicQuiz.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useMusicQuiz } from "./useMusicQuiz";
import { MusicQuizView } from "./MusicQuizView";
import type { MusicQuizProps, MusicQuizRef } from "./types";

export const MusicQuiz = function MusicQuiz(
  {
    ref,
    isVisible,
    lcdFilterOn = false,
    backlightOn = true,
    ...rest
  }: MusicQuizProps & {
    ref?: React.Ref<MusicQuizRef>;
  }
) {
  const viewModel = useMusicQuiz({
    ref,
    isVisible,
    lcdFilterOn,
    backlightOn,
    ...rest,
  });

  if (!isVisible) return null;

  return (
    <MusicQuizView
      {...viewModel}
      lcdFilterOn={lcdFilterOn}
      backlightOn={backlightOn}
    />
  );
};
