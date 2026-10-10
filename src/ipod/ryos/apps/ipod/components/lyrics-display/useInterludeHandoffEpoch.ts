/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 useInterludeHandoffEpoch 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/lyrics-display/useInterludeHandoffEpoch.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useLayoutEffect, useRef, useState } from "react";

/**
 * When delay dots leave the screen, bump a presence epoch so the lyric list
 * remounts instead of letting Motion play exit/layout animations over the
 * incoming line.
 *
 * `skipEnter` is true only for the commit that paints that remount. The new
 * line is already the settled row; an enter from y/scale would overlap it
 * for a frame. Later line changes in the same epoch still animate.
 */
export function useInterludeHandoffEpoch(interludeOnScreen: boolean): {
  epoch: number;
  skipEnter: boolean;
} {
  const [epoch, setEpoch] = useState(0);
  const [dotsWereOnScreen, setDotsWereOnScreen] = useState(interludeOnScreen);
  const paintedEpochRef = useRef(0);

  if (dotsWereOnScreen !== interludeOnScreen) {
    setDotsWereOnScreen(interludeOnScreen);
    if (dotsWereOnScreen && !interludeOnScreen) {
      setEpoch((current) => current + 1);
    }
  }

  const skipEnter = epoch > 0 && paintedEpochRef.current !== epoch;
  useLayoutEffect(() => {
    paintedEpochRef.current = epoch;
  }, [epoch]);

  return { epoch, skipEnter };
}
