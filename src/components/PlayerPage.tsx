"use client";

import { useSearchParams } from "next/navigation";
import IPodPlayer from "@/components/IPodPlayer";
import { IPOD_PLAYLIST_URLS } from "@/data/playlist";

export function PlayerPage() {
  const params = useSearchParams();
  const embed = params.get("embed") === "1";
  const theme = (params.get("theme") as "classic" | "black" | "u2") || "classic";
  const playlist = params.get("playlist") || IPOD_PLAYLIST_URLS;

  const player = (
    <div style={{ width: embed ? "100%" : 250, height: embed ? "100%" : 400 }}>
      <IPodPlayer theme={theme} youtubeUrl={playlist} textShadow={false} />
    </div>
  );

  if (embed) {
    return (
      <main style={{ margin: 0, width: "100vw", height: "100dvh", background: "transparent" }}>
        {player}
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "32px 16px 48px",
        gap: 16,
      }}
    >
      {player}
      <p style={{ margin: 0, fontSize: 14, letterSpacing: "0.01em", color: "#444", textAlign: "center" }}>
        z1han.com 改编自 ryOS
      </p>
      <p style={{ margin: 0, fontSize: 12, color: "#777", textAlign: "center", maxWidth: 420 }}>
        Interface by Ryo Lu /{" "}
        <a href="https://github.com/ryokun6/ryos" style={{ color: "inherit" }}>
          ryOS
        </a>
        , adapted by{" "}
        <a href="https://www.z1han.com" style={{ color: "inherit" }}>
          Zihan Huang
        </a>
        . Source:{" "}
        <a href="https://github.com/bravohenry/z1-ipod" style={{ color: "inherit" }}>
          bravohenry/z1-ipod
        </a>{" "}
        (AGPL-3.0).{" "}
        <a href="/ipod/ryos/LICENSE.txt" style={{ color: "inherit" }}>
          License
        </a>
        .
      </p>
    </main>
  );
}
