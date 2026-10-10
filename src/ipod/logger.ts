/**
 * [INPUT]: Z1 iPod 宿主与 ryOS 内部界面。
 * [OUTPUT]: logger 的宿主能力。
 * [POS]: craft/ipod 的适配边界；不导入 ryOS 操作系统或云同步。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
type Detail = unknown;
export function createClientLogger(scope: string) {
  const emit = (
    level: "debug" | "info" | "warn" | "error",
    message: string,
    ...details: Detail[]
  ) => {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("dev")
    )
      console[level](`[iPod:${scope}] ${message}`, ...details);
  };
  return {
    debug: (m: string, ...d: Detail[]) => emit("debug", m, ...d),
    info: (m: string, ...d: Detail[]) => emit("info", m, ...d),
    warn: (m: string, ...d: Detail[]) => emit("warn", m, ...d),
    error: (m: string, ...d: Detail[]) => emit("error", m, ...d),
  };
}
