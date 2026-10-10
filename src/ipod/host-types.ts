/**
 * [INPUT]: Z1 iPod 宿主与 ryOS 内部界面。
 * [OUTPUT]: host-types 的宿主能力。
 * [POS]: craft/ipod 的适配边界；不导入 ryOS 操作系统或云同步。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
export interface ActivityInfo {
  isLoadingLyrics?: boolean;
  isTranslating?: boolean;
  isFetchingFurigana?: boolean;
  isFetchingSoramimi?: boolean;
  isAddingSong?: boolean;
  translationProgress?: number;
  furiganaProgress?: number;
  soramimiProgress?: number;
  translationLanguage?: string;
}
export function getActivityLabel(
  state: ActivityInfo,
  t: (key: string) => string,
) {
  const active =
    state.isLoadingLyrics ||
    state.isTranslating ||
    state.isFetchingFurigana ||
    state.isFetchingSoramimi ||
    state.isAddingSong;
  return {
    isActive: Boolean(active),
    label: active ? t("apps.ipod.status.loading") : "",
  };
}
