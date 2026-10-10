/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 types 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/brick-game/types.ts 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
export type Phase = "ready" | "playing" | "paused" | "lifeLost" | "won" | "gameOver";

export interface BrickGameRef {
  /** Move paddle left/right. Returns true if handled. */
  navigate: (direction: "next" | "previous") => boolean;
  /** Confirm: start / pause / resume / restart from game over. */
  selectCurrent: () => void;
  /** Bottom of wheel — toggle pause during play. */
  togglePause: () => void;
}

export interface BrickGameProps {
  isVisible: boolean;
  onExit: () => void;
  lcdFilterOn?: boolean;
  backlightOn?: boolean;
  /** Pause main player when entering, called once when visible turns true. */
  onEnter?: () => void;
  playClick?: () => void;
  playScroll?: () => void;
  vibrate?: () => void;
}

export interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
  row: number;
}

export interface GameState {
  paddleX: number;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  bricks: Brick[];
  score: number;
  lives: number;
  level: number;
}
