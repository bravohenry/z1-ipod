# shared/
> L2 | 父级: ../AGENTS.md

背景与播放器；固定资源由public/ipod/ryos提供。

成员清单
AmbientBackground.tsx: 封面色驱动的环境背景；导出AmbientVariant, AmbientBackground。
LandscapeVideoBackground.tsx: 风景视频轮播与交接；导出LandscapeVideoBackground。
MeshGradientBackground.tsx: 封面色驱动的网格背景；导出MeshGradientBackground。
WaterBackground.tsx: 封面纹理水面折射背景；导出WaterBackground。
YouTubePlayer.tsx: 客户端YouTube加载、播放确认与失败通知；导出PLAYBACK_CONFIRMATION_TIMEOUT_MS, YouTubePlaybackFailure, YouTubePlayerProps。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
