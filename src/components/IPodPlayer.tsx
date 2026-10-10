/**
 * [INPUT]: React、ipod 宿主控制器与 ryOS 内部界面；保留 theme/youtubeUrl/textShadow 调用契约。
 * [OUTPUT]: IPodPlayer，Z1 一代 iPod 外壳与 ryOS 完整屏幕界面。
 * [POS]: 首页 CollectionFrame 与 01-ipod 正文的唯一播放器；外壳拥有轻投影，ipod/拥有会话。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
"use client";
import type { CSSProperties } from "react";
import { I18nextProvider } from "react-i18next";
import { MotionConfig } from "framer-motion";
import { IpodInterface } from "@/ipod/Interface";
import { Shell } from "@/ipod/Shell";
import { IpodWheel } from "@/ipod/Wheel";
import { IpodDialogs } from "@/ipod/Dialogs";
import { useIpodController } from "@/ipod/use-controller";
import i18n from "@/ipod/i18n";
import "@/ipod/ipod.css";
interface IPodPlayerProps {
  theme: "classic" | "black" | "u2";
  youtubeUrl: string;
  textShadow: boolean;
  font?: CSSProperties;
  style?: CSSProperties;
  ownerName?: string;
}
export default function IPodPlayer({
  theme = "classic",
  youtubeUrl = "",
  style,
  ownerName = "Zihan",
}: IPodPlayerProps) {
  const c = useIpodController(youtubeUrl, theme);
  return (
    <I18nextProvider i18n={i18n}>
      <MotionConfig reducedMotion="user">
        <div
          className="z1-ipod"
          aria-label={`${ownerName}'s iPod`}
          tabIndex={0}
          data-cursor-native=""
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "visible",
            ...style,
          }}
          onKeyDown={(e) => {
            if (
              e.metaKey ||
              e.ctrlKey ||
              e.altKey ||
              (e.target as HTMLElement).isContentEditable ||
              /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName)
            )
              return;
            const action = {
              ArrowUp: () => c.scroll(-1),
              ArrowDown: () => c.scroll(1),
              ArrowRight: () => c.wheelClick("right"),
              ArrowLeft: () => c.wheelClick("left"),
              Enter: c.select,
              " ": c.togglePlay,
              Escape: c.back,
            }[e.key];
            if (!action) return;
            if (
              (e.key === "Enter" || e.key === " ") &&
              (e.target as HTMLElement).closest("button")
            )
              return;
            e.preventDefault();
            e.stopPropagation();
            action();
          }}
        >
          <Shell
            theme={c.preferences.theme}
            screen={<IpodInterface c={c} />}
            wheel={<IpodWheel c={c} />}
          />
          <IpodDialogs c={c} />
        </div>
      </MotionConfig>
    </I18nextProvider>
  );
}
