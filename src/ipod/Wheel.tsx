/**
 * [INPUT]: Base UI Button、iPod 控制器动作与外壳局部材质。
 * [OUTPUT]: IpodWheel，142px 轮盘的点按、长按与连续旋转输入。
 * [POS]: Shell 的物理输入插槽；保留独立命中区域，不占用甲板滚动与拖拽。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { IpodController } from "./use-controller";
import styles from "./shell.module.css";
export function IpodWheel({ c }: { c: IpodController }) {
  const wheel = useRef<HTMLDivElement>(null);
  const latest = useRef(c);
  useEffect(() => {
    latest.current = c;
  }, [c]);
  const angle = useRef<number | null>(null);
  const accumulated = useRef(0);
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);
  useEffect(() => {
    const node = wheel.current;
    if (!node) return;
    let delta = 0;
    const scroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      delta += event.deltaY;
      if (Math.abs(delta) >= 24) {
        latest.current.scroll(Math.sign(delta));
        delta = 0;
      }
    };
    node.addEventListener("wheel", scroll, { passive: false });
    return () => {
      node.removeEventListener("wheel", scroll);
      if (longPress.current) clearTimeout(longPress.current);
    };
  }, []);
  const currentAngle = (x: number, y: number) => {
    const r = wheel.current!.getBoundingClientRect();
    return Math.atan2(y - r.y - r.height / 2, x - r.x - r.width / 2);
  };
  const clear = () => {
    if (longPress.current) clearTimeout(longPress.current);
  };
  return (
    <div
      ref={wheel}
      className={styles.wheel}
      data-theme={c.preferences.theme}
      data-ipod-controls=""
      role="group"
      aria-label="iPod click wheel"
      onPointerDown={(e) => {
        if ((e.target as Element).closest("button")) return;
        angle.current = currentAngle(e.clientX, e.clientY);
        accumulated.current = 0;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (angle.current === null) return;
        const next = currentAngle(e.clientX, e.clientY);
        let delta = next - angle.current;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;
        angle.current = next;
        accumulated.current += delta;
        const step = Math.PI / 12;
        while (Math.abs(accumulated.current) >= step) {
          const direction = Math.sign(accumulated.current);
          c.scroll(direction);
          accumulated.current -= direction * step;
        }
      }}
      onPointerUp={(e) => {
        angle.current = null;
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={() => {
        angle.current = null;
        clear();
      }}
    >
      <Button
        aria-label="Menu"
        className={`${styles.control} ${styles.menu}`}
        onClick={c.back}
      >
        MENU
      </Button>
      <Button
        aria-label="Previous track"
        className={`${styles.control} ${styles.previous}`}
        onClick={() => c.wheelClick("left")}
      >
        <svg viewBox="0 0 21 12" aria-hidden="true">
          <path d="M0 0h2v12H0zm2 6L11 0v12zm9 0L20 0v12z" />
        </svg>
      </Button>
      <Button
        aria-label="Next track"
        className={`${styles.control} ${styles.next}`}
        onClick={() => c.wheelClick("right")}
      >
        <svg viewBox="0 0 21 12" aria-hidden="true">
          <path d="M19 0h2v12h-2zM19 6l-9 6V0zm-9 0L1 12V0z" />
        </svg>
      </Button>
      <Button
        aria-label="Play or pause"
        className={`${styles.control} ${styles.play}`}
        onClick={() => c.wheelClick("bottom")}
      >
        <svg viewBox="0 0 26 12" aria-hidden="true">
          <path d="M1 0l10 6-10 6zm16 0h3v12h-3zm6 0h3v12h-3z" />
        </svg>
      </Button>
      <Button
        aria-label="Select"
        className={`${styles.control} ${styles.center}`}
        onPointerDown={() => {
          fired.current = false;
          longPress.current = setTimeout(() => {
            fired.current = true;
            c.longPress();
          }, 500);
        }}
        onPointerUp={clear}
        onPointerCancel={clear}
        onPointerLeave={clear}
        onClick={() => {
          if (!fired.current) c.select();
        }}
      />
    </div>
  );
}
