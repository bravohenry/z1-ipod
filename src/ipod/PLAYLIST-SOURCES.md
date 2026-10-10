# 喜爱歌曲来源核对

作者提供 Apple Music 喜爱歌曲 43 首，依据截图导入；播放顺序经作者指定重新编排。
首曲为Dangerous Woman，随后Follow Me与Faraway Place。
菜单名为Favorites，菜单文案保持英文。
本表保留来源核对时的截图序号；最终播放顺序归playlist.ts。
歌曲、艺人、专辑和专辑时长归 `src/data/playlist.ts`。
来源检查日期：2026-10-10。
Faraway Place与Give me the time of a song保留作者展示名，歌词按原中文歌名与艺人检索。
本地真实歌词接口验证：Dangerous Woman返回64行，Follow Me返回49行，在那遥远的地方返回43行，给我一首歌的时间返回52行。
以上验证只证明检索和时间数据存在，不证明对应MV已实播或逐秒对齐。

全部 43 个当前来源的 YouTube oEmbed 返回 200。
此结果只确认公开元数据，不证明嵌入播放成功。
当前匿名测试环境连官方测试视频 M7lc1UVf-VE 都返回 LOGIN_REQUIRED，要求登录确认不是机器人。
因此没有把测试环境的认证失败记为歌曲删除或禁播。

优先使用艺人、唱片公司、VEVO 与自动分发 Topic 来源。
小半、好不容易、如果當時、fuze、All Star 使用第三方上传；这些版本未完成音频逐秒比对。
MV 与专辑时长不同，运行时进度读取实际播放器时钟；data中的时长仅描述作者专辑。
Tom Odell 的 MV 为 5:11，作者专辑为 4:52；未确认开场时间偏移。
ZENIT 使用 4:32 专辑音频，未用 3:38 MV。
Satisfaction 使用 4:46 专辑版，未用 2:27 MV 或 6:40 remix。
古典曲目来源注明 Kremer、Bernstein 与 Wiener Philharmoniker，1983年录音，8:55。
它是同场演奏的再版来源，来源专辑名与作者所持合集不同。
RUNWAY 的 MV 为 2:59，作者专辑为 2:51。
原 fuze 候选 qinR_BFupcU 的 oEmbed 返回401，已换为 zxs218Whcgg。

| # | 作者曲目 | YouTube ID | 来源标题 | 频道 |
|---|---|---|---|---|
| 1 | HUMBLE. | tvTRZJ-4EyI | Kendrick Lamar - HUMBLE. | KendrickLamarVEVO |
| 2 | Diamonds (with Normani) | r1MxCSRWgI0 | Megan Thee Stallion & Normani (Birds of Prey: The Album) - Diamonds [Official Music Video] | Atlantic Records |
| 3 | this is what slow dancing feels like | VVRXyZ6B0Qw | JVKE - this is what slow dancing feels like | JVKE |
| 4 | Out of Time | RL_n_hXu_Nc | Zeds Dead, Jem Cooke - Out of Time | ZedsDeadVEVO |
| 5 | Violin Concerto in D Major, Op. 77: II. Adagio | kEg-5YBH9aU | Brahms: Violin Concerto in D Major, Op. 77: II. Adagio (Live) | Gidon Kremer - Topic |
| 6 | Delicate | qRzHePvMQIg | Lucy Blue - Delicate (Official Visualiser) | Lucy Blue |
| 7 | Follow Me | Y_4GnC6U1Ys | 王力宏 Leehom Wang - Follow Me | leehomwangVEVO |
| 8 | 玻璃 | FB5-rPa5wBA | gareth.t - 玻璃 (official video) | Gareth.T |
| 9 | 小半 | 22PF83zIW0k | 陳粒《 小半 》Lyric Video | 雙下巴Indie Music |
| 10 | Give me the time of a song | wt0RKW3aC84 | 周杰倫 Jay Chou【給我一首歌的時間 Give me the Time of One Song】-Official Music Video | 周杰倫 Jay Chou |
| 11 | 好不容易 (《華燈初上》片尾曲) | -5JIvtqcPcg | 告五人 Accusefive [ 好不容易 Finally]（歌詞版） | Imusic |
| 12 | Lonely | yUbTU1ojKho | Imagine Dragons - Lonely (Official Lyric Video) | ImagineDragonsVEVO |
| 13 | 第一天 | y3lP_gPjlUo | 孫燕姿 Sun Yan-Zi - 第一天 First Day (official 官方完整版MV) | Timeless Music |
| 14 | Faraway Place | tqHB456_ejc | 王力宏 Leehom Wang - 在那遙遠的地方 | leehomwangVEVO |
| 15 | 如果當時 | h9HgClAlNWc | 如果当时 - 许嵩 (Vae Xu)【Lyrics Video】 | 星動音樂台 |
| 16 | Don't Let Me Go | BmeiEp_YqyY | Tom Odell - Don't Let Me Go (Official Music Video) | TomOdellVEVO |
| 17 | Thank You (Not So Bad) | fQWNeIiFf_s | Dimitri Vegas & Like Mike & Tiësto & Dido & W&W - Thank You (Not So Bad) (Official video) | Dimitri Vegas & Like Mike |
| 18 | Sign of the Times | qN4ooNx77u0 | Harry Styles - Sign of the Times (Official Video) | HarryStylesVEVO |
| 19 | RUNWAY | XXIX2WnfbpE | Lady Gaga, Doechii - RUNWAY (Official Music Video) | LadyGagaVEVO |
| 20 | The Long Road | snSvQIlIzyw | Hans Zimmer - The Long Road \| Euphoria: Season 3 (HBO Original Series Soundtrack) | SonySoundtracksVEVO |
| 21 | Toxic Masculinity | mUNyrfapc9M | Hans Zimmer - Toxic Masculinity \| Euphoria: Season 3 (HBO Original Series Soundtrack) | SonySoundtracksVEVO |
| 22 | Memories | dcP0D4PWqKM | Thutmose - Memories (SpiderMan: Into The SpiderVerse Soundtrack) (Official Music Video) | Thutmose |
| 23 | Familia (feat. Bantu) | mEX9ht4bexQ | Familia (Spider-Man: Into the Spider-Verse) | Nicki Minaj - Topic |
| 24 | Man I Need | JGKgbmz_gcU | Olivia Dean - Man I Need (Lyric Video) | OliviaDeanVEVO |
| 25 | Biking | gfkcWUQDO9s | Daniela Andrade - Biking (Official Video) | Daniela Andrade |
| 26 | A Couple Minutes | lrS1LC2cu-U | Olivia Dean - A Couple Minutes (Lyric Video) | Olivia Dean |
| 27 | 愛我還是他 | T5PumlknQK0 | 陶喆 - 愛我還是他 | DavidTaoVEVO |
| 28 | Take Me Home, Country Roads (Original Version) | 1vrEljMfXYo | John Denver - Take Me Home, Country Roads (Official Audio) | JohnDenverVEVO |
| 29 | fuze | zxs218Whcgg | SKRILLEX & ISOxo - Fuze | The Monster Drops |
| 30 | ZENIT | Uw1TTtc8QIY | ZENIT | Onuka - Topic |
| 31 | Friend | lPZQLQavG4A | Gracie Abrams - Friend | GracieAbramsVEVO |
| 32 | 还有什么更好的 | yZuPNTlmtTA | 還有什麼更好的 | Yichun Shan - Topic |
| 33 | DtMF | v9T_MGfzq7I | BAD BUNNY - DtMF (Visualizer) \| DeBÍ TiRAR MáS FOToS | Bad Bunny |
| 34 | Satisfaction | OrvZ9BlakX8 | Satisfaction (Isak Original Extended) | Benny Benassi - Topic |
| 35 | Mercy (Jon Casey Remix) | 9jeWaZnvreo | What So Not, MØ - Mercy (Jon Casey Remix) | Sweat It Out |
| 36 | Victory Lap | 08C987fQEKU | Fred again.. x Skepta x PlaqueBoyMax - Victory Lap (NYC, 17th June 2025) | Fred again . . |
| 37 | 珠玉 | RRkpkyQoIVU | 珠玉 | Yichun Shan - Topic |
| 38 | Tessellate | ge5nUfUB6N8 | Tessellate | alt-J - Topic |
| 39 | This Is Who I Am (From “The Day of the Jackal”) | UwIN9gIFsys | Celeste - This Is Who I Am (From "The Day of the Jackal") \| Official Lyric Video | celesteVEVO |
| 40 | Deadman | TPyS382hHYM | KUN - Deadman (Official Video) | KUN 蔡徐坤 |
| 41 | All Star | TiV2iSLfU0g | Smash Mouth - All Star (Lyrics) | TikTokHymn |
| 42 | Fruitcake Part 2 | sLq_Y-mZGjo | Fruitcake part 2 | BFRND - Topic |
| 43 | Dangerous Woman | 9WbCfHutDSE | Ariana Grande - Dangerous Woman (Official Video) | ArianaGrandeVevo |

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
