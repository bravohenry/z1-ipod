# ryOS iPod 移植

来源：https://github.com/ryokun6/ryos
版本：d989f4dc29e5a8ae0054fd741a485f46949049d8
许可证：AGPL-3.0-or-later；完整文本见 public/ipod/ryos/LICENSE.txt。

保留屏幕、Cover Flow、歌词、游戏与可视化源码。Z1 宿主适配菜单、曲库、音量、凭据与播放生命周期。上游操作系统窗口、云同步和管理后台不进入宿主。

Z1逻辑外壳为230×388；整机按geometry的1.1比例放大至253×426.8。
保留196×150硬件黑边，内部显示区189×143无额外边框。
作者43首喜爱歌曲归src/data/playlist.ts；来源核对见PLAYLIST-SOURCES.md。
宿主使用同一播放时钟驱动进度和歌词；显示、歌词和主题偏好保存于本地。
逐字歌词取决于提供方KRC；LRC只有逐行时间。
Apple Music/MusicKit、云同步、AI翻译未接入。公开演示不得宣称这些服务可用。
用户看见的About保留上游源码与许可证入口；公开部署前须满足AGPL对应源码要求。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md


公开源码镜像：https://github.com/bravohenry/z1-ipod（AGPL-3.0）。站点内署名：z1han.com 改编自 ryOS。
