# ipod/
> L2 | 父级: ../AGENTS.md

固定上游iPod界面；宿主拥有播放、曲库和偏好。

成员清单
components/: 界面组合；各叶子目录按菜单、媒体、歌词与游戏分界。
constants.ts: ipod几何与时间参数；导出IPOD_MODERN_SCREEN_HEIGHT_PX, IPOD_MODERN_SCREEN_BORDER_PX, IPOD_MODERN_DRAWABLE_HEIGHT_PX。
hooks/: 浏览器能力与媒体派生；不写曲库。
logging.ts: 播放器日志命名门面；导出ipodLog, appleMusicLog。
types.ts: ipod输入、状态与引用契约；导出WheelArea, RotationDirection, MenuItem。
utils/: 纯工具与提供方辅助；消费方拥有会话状态。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
