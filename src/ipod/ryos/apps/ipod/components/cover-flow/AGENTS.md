# cover-flow/
> L2 | 父级: ../AGENTS.md

专辑封面浏览；控制器拥有选择状态，视图消费同一投影。

成员清单
AlbumFlipFaces.tsx: 专辑翻转的正反面；导出AlbumFlipFaces。
AlbumTracklist.tsx: 专辑曲目列表；导出AlbumTracklist。
AquaShineOverlay.tsx: 封面的光泽层；导出AquaShineOverlay。
CoverFlow.tsx: 封面浏览门面；导出CoverFlow。
CoverFlowAlbumFlipOverlay.tsx: 翻转专辑的覆盖层；导出CoverFlowAlbumFlipOverlay。
CoverFlowCarouselStage.tsx: 封面队列的透视布局；导出CoverFlowCarouselStage。
CoverFlowInlineView.tsx: 屏幕内封面浏览视图；导出CoverFlowInlineView。
CoverFlowModernTitlebar.tsx: 彩色封面浏览状态条；导出CoverFlowModernTitlebar。
CoverFlowOverlayView.tsx: 经典封面浏览覆盖层；导出CoverFlowOverlayView。
CoverFlowReflectiveFloor.tsx: 封面镜面反射层；导出CoverFlowReflectiveFloor。
CoverFlowTrackInfoBar.tsx: 当前曲目信息条；导出CoverFlowTrackInfoBar。
CoverImage.tsx: 封面加载与失效占位；导出CoverImage。
SpinningCD.tsx: 旋转光盘视觉；导出SpinningCD。
constants.ts: cover-flow几何与时间参数；导出COVER_FADE_TRANSITION, MODERN_TITLEBAR_HEIGHT, LONG_PRESS_DELAY。
coverFlowUiReducer.ts: 封面浏览状态转移；导出coverFlowUiReducer。
types.ts: cover-flow输入、状态与引用契约；导出CoverFlowUiState, CoverFlowUiAction, CoverFlowProps。
useCoverFlowController.ts: 封面选择、翻转与输入控制；导出useCoverFlowController, CoverFlowController。
useCoverFlowItems.ts: 曲库聚合为专辑封面项；导出useCoverFlowItems。
utils.ts: cover-flow格式与曲目派生；导出formatTrackDuration, resolveCoverUrl, getCoverSizeCqmin。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
