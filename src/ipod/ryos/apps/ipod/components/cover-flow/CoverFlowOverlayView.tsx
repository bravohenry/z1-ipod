/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 CoverFlowOverlayView 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/cover-flow/CoverFlowOverlayView.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CoverFlowReflectiveFloor } from "./CoverFlowReflectiveFloor";
import { CoverFlowModernTitlebar } from "./CoverFlowModernTitlebar";
import { CoverFlowCarouselStage } from "./CoverFlowCarouselStage";
import { CoverFlowTrackInfoBar } from "./CoverFlowTrackInfoBar";
import { CoverFlowAlbumFlipOverlay } from "./CoverFlowAlbumFlipOverlay";
import type { CoverFlowController } from "./useCoverFlowController";

interface CoverFlowOverlayViewProps {
  vm: CoverFlowController;
  isVisible: boolean;
}

export function CoverFlowOverlayView({ vm, isVisible }: CoverFlowOverlayViewProps) {
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "absolute inset-0 z-50 overflow-hidden",
            isModernIpodCoverFlow ? "bg-white" : "bg-black",
            ipodMode && "border-0 rounded-none",
            ipodMode ? "ipod-force-font" : "karaoke-force-font",
          )}
          style={{ containerType: "size" }}
          initial={{ opacity: 0, scale: ipodMode ? 1 : 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: ipodMode ? 1 : 1.05 }}
          transition={{ duration: ipodMode ? 0.2 : 0.35, ease: "easeOut" }}
        >
          <CoverFlowReflectiveFloor
            isModernIpodCoverFlow={isModernIpodCoverFlow}
          />
          {isModernIpodCoverFlow && (
            <CoverFlowModernTitlebar isPlaying={isPlaying} />
          )}
          <CoverFlowCarouselStage vm={vm} />
          <CoverFlowTrackInfoBar vm={vm} animated />
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
            titlebarOffset
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
