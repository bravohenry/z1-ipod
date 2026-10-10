/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 CoverFlowInlineView 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/cover-flow/CoverFlowInlineView.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { cn } from "@/lib/utils";
import { CoverFlowReflectiveFloor } from "./CoverFlowReflectiveFloor";
import { CoverFlowCarouselStage } from "./CoverFlowCarouselStage";
import { CoverFlowTrackInfoBar } from "./CoverFlowTrackInfoBar";
import { CoverFlowAlbumFlipOverlay } from "./CoverFlowAlbumFlipOverlay";
import type { CoverFlowController } from "./useCoverFlowController";

interface CoverFlowInlineViewProps {
  vm: CoverFlowController;
}

export function CoverFlowInlineView({ vm }: CoverFlowInlineViewProps) {
  const {
    ipodMode,
    isModernIpodCoverFlow,
    isPlaying,
    isFlipped,
    setIsFlipped,
    currentItem,
    flipCoverUrl,
    flipCoverSizeCqmin,
    albumTracks,
    selectedTrackInAlbum,
    playingPositionInAlbum,
    handleSelectAlbumTrack,
  } = vm;

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden",
        isModernIpodCoverFlow ? "bg-white" : "bg-black",
        ipodMode ? "ipod-force-font" : "karaoke-force-font",
      )}
      style={{ containerType: "size" }}
    >
      <CoverFlowReflectiveFloor isModernIpodCoverFlow={isModernIpodCoverFlow} />
      <CoverFlowCarouselStage vm={vm} />
      <CoverFlowTrackInfoBar vm={vm} />
      <CoverFlowAlbumFlipOverlay
        isFlipped={isFlipped}
        currentItem={currentItem}
        coverUrl={flipCoverUrl}
        coverSizeCqmin={flipCoverSizeCqmin}
        tracks={albumTracks}
        selectedTrackInAlbum={selectedTrackInAlbum}
        playingPositionInAlbum={playingPositionInAlbum}
        isPlaying={isPlaying}
        isModernIpodCoverFlow={isModernIpodCoverFlow}
        ipodMode={ipodMode}
        onPlayTrack={handleSelectAlbumTrack}
        onExitFlip={() => setIsFlipped(false)}
      />
    </div>
  );
}
