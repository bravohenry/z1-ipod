# components/
> L2 | 父级: ../AGENTS.md

界面组合；各叶子目录按菜单、媒体、歌词与游戏分界。

成员清单
brick-game/: 弹球游戏；状态与画布分离，宿主轮盘通过引用驱动。
cover-flow/: 专辑封面浏览；控制器拥有选择状态，视图消费同一投影。
ipod-screen/: 屏幕合成；菜单、封面与播放层读取宿主会话。
lyrics-display/: 歌词显示；播放时钟决定行与逐字高亮，视觉设置来自宿主。
music-quiz/: 听歌测验；随机曲目与片段播放共用宿主曲库。
screen/: LCD基础组件；不拥有曲库或播放请求。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
