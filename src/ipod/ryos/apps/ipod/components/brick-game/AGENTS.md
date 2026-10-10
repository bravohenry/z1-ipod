# brick-game/
> L2 | 父级: ../AGENTS.md

弹球游戏；状态与画布分离，宿主轮盘通过引用驱动。

成员清单
BrickGame.tsx: 游戏门面，连接状态hook与视图；导出BrickGame。
BrickGameTitleBar.tsx: 游戏分数和暂停状态条；导出BrickGameTitleBar。
BrickGameView.tsx: 游戏画布容器；导出BrickGameView。
constants.ts: brick-game几何与时间参数；导出GAME_WIDTH, GAME_HEIGHT, BRICK_COLS。
drawGame.ts: 将游戏状态绘制到canvas；导出drawBrickGame。
gameState.ts: 砖块与球的初始化规则；导出makeBricks, initialState, launchBall。
types.ts: brick-game输入、状态与引用契约；导出Phase, BrickGameRef, BrickGameProps。
useBrickGame.ts: 游戏时钟、碰撞与轮盘输入；导出useBrickGame, BrickGameViewModel。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
