/**
 * [INPUT]: Base UI Button、文档输入事件、iPod 控制器动作与外壳局部材质。
 * [OUTPUT]: IpodWheel，142px 轮盘的平面矢量印刷层与点按、长按、连续旋转输入。
 * [POS]: Shell 的物理输入插槽；长按只抑制同次指针点击，不阻断键盘选择；区分指针/键盘焦点，不占用甲板滚动与拖拽。
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
    const pointerInput = () => {
      node.dataset.input = "pointer";
    };
    const keyboardInput = () => {
      node.dataset.input = "keyboard";
    };
    document.addEventListener("pointerdown", pointerInput, true);
    document.addEventListener("keydown", keyboardInput, true);
    node.addEventListener("wheel", scroll, { passive: false });
    return () => {
      node.removeEventListener("wheel", scroll);
      document.removeEventListener("pointerdown", pointerInput, true);
      document.removeEventListener("keydown", keyboardInput, true);
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
      {/* MENU 字形转轮廓；四个标记共用一个平面，透明按钮只承担输入。 */}
      <svg
        className={styles.markings}
        viewBox="0 0 142 142"
        aria-hidden="true"
        focusable="false"
      >
        <path
          data-wheel-mark="menu"
          d="M56.70 8.64L56.70 15.36L58.08 15.36L58.08 10.65L58.10 10.65L59.75 15.36L60.88 15.36L62.53 10.60L62.55 10.60L62.55 15.36L63.93 15.36L63.93 8.64L61.85 8.64L60.37 13.26L60.35 13.26L58.78 8.64ZM65.68 8.64L65.68 15.36L70.77 15.36L70.77 14.12L67.15 14.12L67.15 12.47L70.40 12.47L70.40 11.32L67.15 11.32L67.15 9.88L70.70 9.88L70.70 8.64ZM72.22 8.64L72.22 15.36L73.60 15.36L73.60 10.86L73.62 10.86L76.41 15.36L77.88 15.36L77.88 8.64L76.50 8.64L76.50 13.15L76.48 13.15L73.68 8.64ZM85.33 12.82L85.33 8.64L83.85 8.64L83.85 12.82Q83.85 13.57 83.55 13.92Q83.25 14.27 82.46 14.27Q82.01 14.27 81.74 14.15Q81.47 14.02 81.32 13.82Q81.17 13.62 81.13 13.35Q81.08 13.09 81.08 12.82L81.08 8.64L79.60 8.64L79.60 12.82Q79.60 14.19 80.35 14.85Q81.10 15.51 82.46 15.51Q83.81 15.51 84.57 14.84Q85.33 14.18 85.33 12.82Z"
        />
        <path
          data-wheel-mark="previous"
          transform="translate(8.7 67.4) scale(.6)"
          d="M0 0h2v12H0zm2 6L11 0v12zm9 0L20 0v12z"
        />
        <path
          data-wheel-mark="next"
          transform="translate(120.7 67.4) scale(.6)"
          d="M19 0h2v12h-2zM19 6l-9 6V0zm-9 0L1 12V0z"
        />
        <path
          data-wheel-mark="play"
          transform="translate(63.2 126.4) scale(.6)"
          d="M1 0l10 6-10 6zm16 0h3v12h-3zm6 0h3v12h-3z"
        />
      </svg>
      <Button
        aria-label="Menu"
        className={`${styles.control} ${styles.menu}`}
        onClick={c.back}
      />
      <Button
        aria-label="Previous track"
        className={`${styles.control} ${styles.previous}`}
        onClick={() => c.wheelClick("left")}
      />
      <Button
        aria-label="Next track"
        className={`${styles.control} ${styles.next}`}
        onClick={() => c.wheelClick("right")}
      />
      <Button
        aria-label="Play or pause"
        className={`${styles.control} ${styles.play}`}
        onClick={() => c.wheelClick("bottom")}
      />
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
        onClick={(event) => {
          if (event.detail === 0 || !fired.current) c.select();
          fired.current = false;
        }}
      />
    </div>
  );
}
