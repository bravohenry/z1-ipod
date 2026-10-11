# ipod-screen/
> L2 | 父级: ../AGENTS.md

屏幕合成；菜单、封面与播放层读取宿主会话。

成员清单
IpodScreen.tsx: 菜单与媒体的屏幕总装；滚动定位消费菜单路径与选中项，播放时钟/元数据重建数组时保留原生滚动；导出IpodScreen。
IpodScreenMediaOverlay.tsx: 视频、背景与歌词合成；读取宿主播放请求与时钟；导出IpodScreenMediaOverlayProps, IpodScreenMediaOverlay。
IpodScreenMenuChrome.tsx: 菜单状态条与行列表；导出IpodScreenMenuChromeProps, IpodScreenMenuChrome。
IpodScreenSplitArtPanel.tsx: 菜单旁的封面侧栏；导出IpodScreenSplitArtPanelProps, IpodScreenSplitArtPanel。
ModernNowPlayingArtwork.tsx: 播放封面与信息；动画状态归reducer；导出ModernNowPlayingArtwork。
constants.ts: ipod-screen几何与时间参数；导出NP_CROSSFADE_MS, COVER_FADE_EASING, COVER_FADE_TRANSITION。
formatPlaybackTime.ts: 播放时间格式；导出formatPlaybackTime。
menuScrollReducer.ts: 菜单滚动状态转移；导出MenuScrollState, menuScrollInitialState, MenuScrollAction。
nowPlayingArtReducer.ts: 封面双缓冲切换状态；导出NowPlayingPingState, nowPlayingArtReducer。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
