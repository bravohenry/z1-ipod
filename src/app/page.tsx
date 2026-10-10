import IPodPlayer from "@/components/IPodPlayer";
import { IPOD_PLAYLIST_URLS } from "@/data/playlist";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "32px 16px 48px",
        gap: 16,
        background: "#f3f3f3",
      }}
    >
      <div style={{ width: 250, height: 400 }}>
        <IPodPlayer theme="classic" youtubeUrl={IPOD_PLAYLIST_URLS} textShadow={false} />
      </div>
      <p style={{ margin: 0, fontSize: 14, color: "#444", textAlign: "center" }}>
        z1han.com 改编自 ryOS
      </p>
      <p style={{ margin: 0, fontSize: 12, color: "#777", textAlign: "center", maxWidth: 480 }}>
        Interface by Ryo Lu /{" "}
        <a href="https://github.com/ryokun6/ryos">ryOS</a>
        . Adapted by{" "}
        <a href="https://www.z1han.com">Zihan Huang</a>
        . Public source:{" "}
        <a href="https://github.com/bravohenry/z1-ipod">bravohenry/z1-ipod</a>{" "}
        (AGPL-3.0). Same player is embedded on{" "}
        <a href="https://www.z1han.com">z1han.com</a>.
      </p>
    </main>
  );
}
