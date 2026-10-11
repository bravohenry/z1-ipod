# ipod/
> L2 | 父级: ../AGENTS.md

ryOS 内部界面的 Z1 宿主。React 原生上下文连接菜单、歌词、播放与游戏；IPodPlayer 保留物理外壳。

成员清单
Shell.tsx: WebGL连续机身与38px厚度；当前甲板内追踪鼠标侧倾，按下冻结，静止与离屏停绘；接收屏幕和轮盘，几何归geometry，材质归shell.module.css。
Interface.tsx: 屏幕组合边界；将宿主会话投影到ryOS菜单、Cover Flow、歌词与游戏。
Wheel.tsx: 物理输入边界；点按、长按与旋转调用宿主动作，不占用甲板滚动。
Dialogs.tsx: 曲目添加、搜索与来源窗口；About集中展示改编署名、公开源码与许可证，Base UI拥有焦点锁与退出行为。
geometry.ts: 整机比例与屏幕几何真相源；外壳与内部界面共用逻辑尺寸，字形只等比缩放。
model.ts: 会话与持久化偏好类型；控制器和纯菜单共享，不依赖DOM。
use-controller.ts: iPod会话唯一写入口；连接菜单、播放、偏好与游戏。
menus.ts: 英文菜单投影；Favorites消费作者歌单，接收曲库与注入动作，不读取DOM或播放器引用。
use-library.ts: 作者歌单与本地增删曲库；补齐YouTube曲目信息，本地仅保存用户增删ID。
use-lyrics.ts: 同步歌词会话；作者歌单提供原文检索名，消费站内歌词API与播放时钟，取消离场请求并隔离旧曲目结果。
context.tsx: ryOS界面的React宿主上下文；隔离上游操作系统与云同步。
host-hooks.ts: React与浏览器媒体偏好的适配；供ryOS界面读取宿主能力。
host-types.ts: 宿主共享类型；供移植界面声明边界，不引入上游操作系统。
i18n.ts: iPod独立翻译实例；消费english.json，不改变全站语言状态。
english.json: ryOS界面的英文翻译资源，由i18n实例装配。
logger.ts: 移植界面的日志门面；上游调用通过宿主适配。
ipod.css: 内部界面的隔离字体与LCD材质；保留固定上游样式。
shell.module.css: 机身与轮盘材质；屏幕插槽关闭上游反光层，投影消费宿主变量。
PLAYLIST-SOURCES.md: 作者43首喜爱歌曲的YouTube来源、核对日期与验证限制；不作为播放状态缓存。
UPSTREAM.md: 固定上游版本、许可证与移植边界；公开许可证文本由public/ipod/ryos提供。
ryos/: 固定上游 d989f4d 的界面与纯数学，保留 AGPL-3.0。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
