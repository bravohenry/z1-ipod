/**
 * [INPUT]: Z1 iPod 宿主与 ryOS 内部界面。
 * [OUTPUT]: i18n 的宿主能力。
 * [POS]: craft/ipod 的适配边界；不导入 ryOS 操作系统或云同步。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { createInstance } from "i18next";
import english from "./english.json";
const i18n = createInstance();
void i18n.init({
  lng: "en",
  fallbackLng: "en",
  resources: { en: { translation: english } },
  interpolation: { escapeValue: false },
  initAsync: false,
});
export default i18n;
