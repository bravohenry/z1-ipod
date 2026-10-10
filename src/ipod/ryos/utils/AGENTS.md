# utils/
> L2 | 父级: ../AGENTS.md

纯工具与提供方辅助；消费方拥有会话状态。

成员清单
abortableFetch.ts: 可取消的提供方请求；导出AbortableFetchOptions, AbortableFetchDependencies, abortableFetch。
coverArt.ts: 封面URL解析；导出formatKugouImageUrl, resolveAppleMusicArtworkUrl, MediaCoverInput。
formatDuration.ts: 秒与毫秒的时长格式；导出FormatSecondsOptions, formatSeconds, formatSecondsMmSs。
furigana.ts: 注音片段对齐；导出FuriganaSegmentLike, hasRedundantKatakanaReading, getDisplayReading。
karaokeInterludeDisplay.ts: 间奏倒计时与歌词交接；导出InterludePlaceholderLine, VisibleLyricLine, INTERLUDE_COUNTDOWN_TOTAL_MS。
languageDetection.ts: 歌词文字语种判定；导出hasKoreanText, hasKanaText, hasKanjiText。
lyricsSearch.ts: 歌词时间戳解析与当前行查找；导出parseLyricTimestamps, findCurrentLineIndex。
lyricsTranslation.ts: 翻译语言枚举与标记；宿主未接翻译服务；导出TranslationLanguage, TRANSLATION_LANGUAGES, TRANSLATION_BADGES。
romanization.tsx: 歌词读音转换与注音显示；导出FuriganaSegment, RomanizationOptions, KOREAN_REGEX。
timeFormat.ts: 分钟与秒的时间格式；导出formatSecondsAsMinutesSeconds。
wallpapers.ts: 壁纸清单读取与缓存；导出WallpaperManifest, WallpaperPlaceholder, WallpaperPlaceholderManifest。
youtubeUrl.ts: YouTube域名与视频ID校验；导出isYouTubeHostname, isYouTubeUrl, ParseYouTubeVideoIdOptions。
zhuyin.ts: 拼音和汉字转注音；导出PinyinSyllableParts, applyZhuyinTone, pinyinSyllableToZhuyin。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
