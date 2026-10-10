/**
 * [INPUT]: iPod 宿主控制器与 ryOS 屏幕、Cover Flow、歌词和游戏。
 * [OUTPUT]: IpodInterface，物理屏幕内的完整界面。
 * [POS]: iPod 组合边界；共用屏幕几何，以逻辑坐标增加菜单高度，字形只做等比缩放。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
"use client";
import { IPOD_DISPLAY, IPOD_LOGICAL_DISPLAY } from "./geometry";
import { lazy, Suspense } from "react";
import { StatusDisplay } from "./ryos/apps/ipod/components/screen/StatusDisplay";
import { IpodScreen } from "./ryos/apps/ipod/components/ipod-screen/IpodScreen";
import { IpodHostProvider } from "./context";
import type { IpodController } from "./use-controller";
import { Button } from "@/components/ui/button";
const CoverFlow = lazy(() =>
  import("./ryos/apps/ipod/components/cover-flow/CoverFlow").then((m) => ({
    default: m.CoverFlow,
  })),
);
const BrickGame = lazy(() =>
  import("./ryos/apps/ipod/components/brick-game/BrickGame").then((m) => ({
    default: m.BrickGame,
  })),
);
const MusicQuiz = lazy(() =>
  import("./ryos/apps/ipod/components/music-quiz/MusicQuiz").then((m) => ({
    default: m.MusicQuiz,
  })),
);
const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  scale: SCREEN_SCALE,
} = IPOD_LOGICAL_DISPLAY;
export function IpodInterface({ c }: { c: IpodController }) {
  const { coverFlowRef, brickGameRef, musicQuizRef, playerRef, ...view } = c;
  const coverFlow = view.overlay === "cover-flow";
  const slot = (
    <Suspense fallback={<div className="p-3 text-xs">Loading Cover Flow…</div>}>
      <CoverFlow
        ref={coverFlowRef}
        tracks={view.library.tracks}
        currentIndex={view.currentIndex}
        onSelectTrack={view.playTrack}
        onExit={() => view.setOverlay(null)}
        onRotation={view.registerActivity}
        isVisible={coverFlow}
        ipodMode
        inline={view.preferences.uiVariant === "modern"}
        isPlaying={view.isPlaying}
        onTogglePlay={view.togglePlay}
        onPlayTrackInPlace={view.playTrack}
      />
    </Suspense>
  );
  return (
    <IpodHostProvider value={view.host}>
      <div
        data-ipod-controls=""
        data-ipod-screen=""
        style={{
          position: "relative",
          width: IPOD_DISPLAY.width,
          height: IPOD_DISPLAY.height,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            transform: `scale(${SCREEN_SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <IpodScreen
            currentTrack={view.currentTrack}
            isPlaying={view.isPlaying}
            playbackRequested={view.playbackRequested}
            totalTime={view.totalTime}
            menuMode={view.menuMode}
            menuHistory={view.menuHistory}
            selectedMenuItem={view.selected}
            onSelectMenuItem={view.setSelected}
            currentIndex={view.currentIndex}
            tracksLength={view.library.tracks.length}
            backlightOn={view.backlightOn}
            menuDirection={view.menuDirection}
            onMenuItemAction={(action) => {
              view.registerActivity();
              action();
            }}
            showVideo={view.showVideo}
            displayMode={view.preferences.displayMode}
            playerRef={playerRef}
            handleTrackEnd={view.handleTrackEnd}
            handleProgress={(state) => view.setElapsedTime(state.playedSeconds)}
            handleDuration={view.setTotalTime}
            requestPlayback={() => view.setPlaybackRequested(true)}
            handlePlay={() => view.setIsPlaying(true)}
            handlePause={() => view.setIsPlaying(false)}
            handleReady={() => view.setPlaybackError(null)}
            handlePlaybackAttemptFailed={view.handlePlaybackAttemptFailed}
            loopCurrent={view.preferences.repeat === "one"}
            loopAll={view.preferences.repeat === "all"}
            isShuffled={view.preferences.shuffle}
            statusMessage={view.statusMessage}
            onToggleVideo={() => view.setShowVideo((v) => !v)}
            lcdFilterOn={view.preferences.uiVariant === "classic"}
            ipodVolume={view.preferences.volume}
            showStatusCallback={view.showStatus}
            showLyrics={view.preferences.showLyrics}
            lyricsAlignment={view.preferences.lyricsAlignment}
            lyricOffset={view.lyricOffset}
            adjustLyricOffset={(delta) => view.setLyricOffset((v) => v + delta)}
            registerActivity={view.registerActivity}
            isFullScreen={false}
            lyricsControls={view.lyrics}
            onNextTrack={view.nextTrack}
            onPreviousTrack={view.previousTrack}
            activityState={{ isLoadingLyrics: view.lyrics.isLoading }}
            isCoverFlowOpen={coverFlow}
            coverFlowSlot={
              view.preferences.uiVariant === "modern" && coverFlow
                ? slot
                : undefined
            }
          />
          {coverFlow && view.preferences.uiVariant === "classic" && slot}
          <Suspense
            fallback={
              <div className="absolute inset-0 z-50 bg-white p-3 text-xs">
                Loading game…
              </div>
            }
          >
            {view.overlay === "brick" && (
              <BrickGame
                ref={brickGameRef}
                isVisible
                onExit={() => view.setOverlay(null)}
                backlightOn={view.backlightOn}
                lcdFilterOn={view.preferences.uiVariant === "classic"}
              />
            )}
            {view.overlay === "quiz" && (
              <MusicQuiz
                ref={musicQuizRef}
                isVisible
                onExit={() => view.setOverlay(null)}
                backlightOn={view.backlightOn}
                lcdFilterOn={view.preferences.uiVariant === "classic"}
              />
            )}
          </Suspense>
          {view.statusMessage && view.menuMode && (
            <div className="absolute inset-0 z-50 pointer-events-none">
              <StatusDisplay
                message={view.statusMessage}
                variant={view.preferences.uiVariant}
              />
            </div>
          )}
          {view.playbackError && (
            <div className="ipod-error absolute inset-0 z-50" role="alert">
              <span>{view.playbackError}</span>
              <Button onClick={view.nextTrack}>Next song</Button>
              <Button
                onClick={() => {
                  if (view.currentTrack)
                    window.open(
                      view.currentTrack.url,
                      "_blank",
                      "noopener,noreferrer",
                    );
                }}
              >
                Open on YouTube
              </Button>
            </div>
          )}
        </div>
      </div>
    </IpodHostProvider>
  );
}
