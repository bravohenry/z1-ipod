# lyrics-display/
> L2 | 父级: ../AGENTS.md

歌词显示；播放时钟决定行与逐字高亮，视觉设置来自宿主。

成员清单
LoadingErrorStates.tsx: 歌词加载与失败占位；导出LoadingState, ErrorState。
LyricsDisplay.tsx: 歌词状态分流与容器；导出LyricsDisplay。
LyricsDisplayLines.tsx: 可见歌词行组合；导出LyricsDisplayLines。
LyricsLineRowContent.tsx: 歌词行内容与间奏占位；导出interludeStackItemsClass, LyricsLineRowContent。
StaticWordRendering.tsx: 静态歌词字片；导出StaticWordRendering。
WordTimingHighlight.tsx: 逐字时间高亮；导出WordTimingHighlight。
animationVariants.ts: 歌词行进入和退出的动效参数；导出getVariants。
colorUtils.ts: 封面取色与歌词发光颜色；导出normalizeCoverColor, getNewCoverColorToSave, pickPrimaryColor。
constants.ts: lyrics-display几何与时间参数；导出ANIMATION_CONFIG, BASE_SHADOW, GLOW_SHADOW。
furiganaWordMapping.ts: 时间字片映射到注音片段；导出getTrailingWhitespace, mapWordTimingsToFurigana。
lyricsAlignmentUtils.ts: 行对齐与交错布局；导出getLyricsTextAlign, computeAlternatingVisibleLines。
types.ts: lyrics-display输入、状态与引用契约；导出LyricsDisplayProps, FuriganaMappingResult, WordRenderItem。
useInterludeHandoffEpoch.ts: 间奏结束的显示交接时钟；导出useInterludeHandoffEpoch。
useLyricsDisplayController.ts: 歌词视图模型；合并时钟、行数据与设置；导出LyricsDisplayViewModel, useLyricsDisplayController。
useLyricsDisplayGestures.ts: 歌词拖动与时间微调输入；导出useLyricsDisplayGestures。
useLyricsDisplayKaraokeStyle.ts: 逐字高亮样式派生；导出useLyricsDisplayKaraokeStyle。
useLyricsDisplayLineData.ts: 歌词文字与注音数据派生；导出useLyricsDisplayLineData。
useLyricsDisplaySettings.ts: 宿主歌词对齐、字体与读音设置；导出getIpodSmallScreenLyricsFontClassName, useLyricsDisplaySettings。
useLyricsVisibleLines.ts: 播放时间映射到可见行；导出useLyricsVisibleLines。
useRenderWithFurigana.tsx: 注音片段的显示组合；导出useRenderWithFurigana。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
