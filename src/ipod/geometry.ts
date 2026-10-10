/**
 * [INPUT]: 用户参考图的屏幕比例与 ryOS 216px 逻辑宽度。
 * [OUTPUT]: IPOD_BEZEL、IPOD_DISPLAY 与 IPOD_LOGICAL_DISPLAY，屏幕几何唯一参数。
 * [POS]: 外壳、界面与 ryOS 菜单共用；调整屏幕高度不拉伸字形。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
export const IPOD_BEZEL = { width: 196, height: 150, padding: 3.5 } as const;
export const IPOD_DISPLAY = {
  width: IPOD_BEZEL.width - IPOD_BEZEL.padding * 2,
  height: IPOD_BEZEL.height - IPOD_BEZEL.padding * 2,
} as const;
export const IPOD_LOGICAL_DISPLAY = {
  width: 216,
  height: (IPOD_DISPLAY.height * 216) / IPOD_DISPLAY.width,
  scale: IPOD_DISPLAY.width / 216,
} as const;
