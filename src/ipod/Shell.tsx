/**
 * [INPUT]: ReactNode 屏幕与轮盘插槽、机身主题及局部材质样式。
 * [OUTPUT]: Shell 与 ShellProps，230×388 的物理机身。
 * [POS]: iPod 外壳边界；界面铺满 189×143px，保留硬件窄黑边，内部界面不叠加第二层黑框，宿主保留会话、键盘与抬升。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import type { ReactNode } from "react";
import { IPOD_BEZEL } from "./geometry";
import styles from "./shell.module.css";

export interface ShellProps {
  theme: "classic" | "black" | "u2";
  screen: ReactNode;
  wheel: ReactNode;
}

export function Shell({ theme, screen, wheel }: ShellProps) {
  return (
    <div className={styles.shell} data-ipod-device="" data-theme={theme}>
      <div
        className={styles.screenBezel}
        style={{
          width: IPOD_BEZEL.width,
          height: IPOD_BEZEL.height,
          padding: IPOD_BEZEL.padding,
        }}
      >
        <div className={styles.screenViewport} data-ipod-slot="screen">
          <div className={styles.screenScale}>{screen}</div>
        </div>
      </div>
      <div className={styles.wheelSlot} data-ipod-slot="wheel">
        {wheel}
      </div>
    </div>
  );
}
