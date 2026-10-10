/**
 * [INPUT]: ryOS 界面依赖与 Z1 宿主适配。
 * [OUTPUT]: 保留上游 CoverFlowAlbumFlipOverlay 的界面或纯运算。
 * [POS]: ryOS apps/ipod/components/cover-flow/CoverFlowAlbumFlipOverlay.tsx 移植；上游 d989f4d，Copyright (C) 2025 Ryo Lu，AGPL-3.0-or-later。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { motion, AnimatePresence } from "framer-motion";
import type { Track } from "@/ipod/ryos/shared/media/library";
import { AlbumFlipFaces } from "./AlbumFlipFaces";
import type { CoverFlowItem } from "./types";
import { MODERN_TITLEBAR_HEIGHT } from "./constants";

interface CoverFlowAlbumFlipOverlayProps {
  isFlipped: boolean;
  currentItem: CoverFlowItem | undefined;
  coverUrl: string | null;
  coverSizeCqmin: number;
  tracks: Track[];
  selectedTrackInAlbum: number;
  playingPositionInAlbum: number;
  isPlaying: boolean;
  isModernIpodCoverFlow: boolean;
  ipodMode: boolean;
  onPlayTrack: (indexInAlbum: number) => void;
  onExitFlip: () => void;
  /** When set, offsets the overlay below the modern titlebar (full-screen branch). */
  titlebarOffset?: boolean;
}

export function CoverFlowAlbumFlipOverlay({
  isFlipped,
  currentItem,
  coverUrl,
  coverSizeCqmin,
  tracks,
  selectedTrackInAlbum,
  playingPositionInAlbum,
  isPlaying,
  isModernIpodCoverFlow,
  ipodMode,
  onPlayTrack,
  onExitFlip,
  titlebarOffset = false,
}: CoverFlowAlbumFlipOverlayProps) {
  const wrapperStyle = titlebarOffset
    ? {
        top: isModernIpodCoverFlow ? MODERN_TITLEBAR_HEIGHT : 0,
        left: 0,
        right: 0,
        bottom: 0,
        perspective: 1500,
        WebkitPerspective: 1500,
      }
    : { perspective: 1500, WebkitPerspective: 1500 };

  return (
    <div
      className={
        titlebarOffset
          ? "absolute z-30 pointer-events-none"
          : "absolute inset-0 z-30 pointer-events-none"
      }
      style={wrapperStyle}
    >
      <AnimatePresence>
        {isFlipped && currentItem && (
          <motion.div
            key={`flip-${currentItem.key}`}
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transformOrigin: ipodMode ? "50% 35%" : "50% 47%",
              pointerEvents: "auto",
            }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 180 }}
            exit={{ rotateY: 0 }}
            transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
            onClick={onExitFlip}
          >
            <AlbumFlipFaces
              album={currentItem.title}
              artist={currentItem.artist}
              coverUrl={coverUrl}
              coverSizeCqmin={coverSizeCqmin}
              tracks={tracks}
              selectedIndex={selectedTrackInAlbum}
              currentlyPlayingIndex={playingPositionInAlbum}
              isPlaying={isPlaying}
              isModern={isModernIpodCoverFlow}
              ipodMode={ipodMode}
              onPlayTrack={onPlayTrack}
              onExitFlip={onExitFlip}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
