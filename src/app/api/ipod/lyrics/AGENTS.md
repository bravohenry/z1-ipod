# lyrics/
> L2 | 父级: ../AGENTS.md

成员清单
route.ts: GET 同步歌词；校验参数与已有Origin、复用request-guard限流；缓存成功结果6小时与未命中5分钟；保留 KuGou 逐词时钟，LRCLIB 提供逐行降级。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
