# ryos/
> L2 | 父级: ../AGENTS.md

固定上游d989f4d的界面与纯运算；Z1适配在父目录，AGPL-3.0-or-later。

成员清单
apps/: 移植应用入口；仅保留iPod依赖。
components/: 界面组合；各叶子目录按菜单、媒体、歌词与游戏分界。
hooks/: 浏览器能力与媒体派生；不写曲库。
shared/: 背景与播放器；固定资源由public/ipod/ryos提供。
types/: 媒体显示契约；上游界面与宿主共用。
utils/: 纯工具与提供方辅助；消费方拥有会话状态。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
