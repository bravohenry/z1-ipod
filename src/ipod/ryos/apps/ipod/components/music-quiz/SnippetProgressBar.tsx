/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 SnippetProgressBar 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/music-quiz/SnippetProgressBar.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { motion, AnimatePresence } from "framer-motion";

export function SnippetProgressBar({
  durationMs,
  running,
  isModernUi,
}: {
  durationMs: number;
  running: boolean;
  isModernUi: boolean;
}) {
  return isModernUi ? (
    <div className="aqua-progress h-[9px] w-full shrink-0 rounded-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={running ? "run" : "stop"}
          className="aqua-progress-fill h-full rounded-none"
          initial={{ width: "0%" }}
          animate={{ width: running ? "100%" : "0%" }}
          transition={{
            duration: running ? durationMs / 1000 : 0,
            ease: "linear",
          }}
        />
      </AnimatePresence>
    </div>
  ) : (
    <div className="h-[6px] w-full shrink-0 rounded-full overflow-hidden border border-[#0a3667]">
      <AnimatePresence mode="wait">
        <motion.div
          key={running ? "run" : "stop"}
          className="h-full bg-[#0a3667]"
          initial={{ width: "0%" }}
          animate={{ width: running ? "100%" : "0%" }}
          transition={{
            duration: running ? durationMs / 1000 : 0,
            ease: "linear",
          }}
        />
      </AnimatePresence>
    </div>
  );
}
