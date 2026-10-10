/**
 * [INPUT]: 依赖 clsx 的条件类解析与 tailwind-merge 的 Tailwind 冲突消解。
 * [OUTPUT]: 提供全站唯一 cn() 类名组合函数。
 * [POS]: lib 的样式组合边界；组件库与业务组件共同消费，避免不同 class 合并语义并存。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
