# music-quiz/
> L2 | 父级: ../AGENTS.md

听歌测验；随机曲目与片段播放共用宿主曲库。

成员清单
MusicQuiz.tsx: 测验门面；导出MusicQuiz。
MusicQuizView.tsx: 题目与反馈视图；导出MusicQuizView。
SnippetProgressBar.tsx: 播放片段进度；导出SnippetProgressBar。
constants.ts: music-quiz几何与时间参数；导出SNIPPET_DURATION_MS, FEEDBACK_DURATION_MS, TOTAL_ROUNDS。
quizState.ts: 测验阶段状态转移；导出initialQuizUiState, quizUiReducer。
types.ts: music-quiz输入、状态与引用契约；导出MusicQuizRound, Phase, QuizUiState。
useMusicQuiz.ts: 曲目抽样、片段播放与答题时钟；导出useMusicQuiz, MusicQuizViewModel。
utils.ts: music-quiz格式与曲目派生；导出shuffle, pickRound, formatOption。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
