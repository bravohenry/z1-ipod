# z1-ipod

**z1han.com 改编自 ryOS** — public AGPL-3.0 source mirror of the iPod player used on [z1han.com](https://www.z1han.com).

The same code ships **inlined** in the private portfolio [bravohenry/z1](https://github.com/bravohenry/z1). This repository exists so network users of that player can obtain and modify the AGPL-covered adaptation (AGPL §13).

Upstream: [ryOS](https://github.com/ryokun6/ryos) commit `d989f4d` (Copyright (C) 2025 Ryo Lu), AGPL-3.0-or-later.

## Run

```bash
pnpm install
pnpm dev
```

## Attribution (in UI)

- Settings: **z1han.com 改编自 ryOS**
- About dialog: same line + links to this repo (AGPL-3.0) and ryOS
- Standalone page footer: same

## Fonts

Commercial Myriad Pro / Geneva / VAG Rounded are **not** redistributed. Shipped faces use SIL OFL Source Sans 3 (plus ChicagoKare recreation and EB Garamond OFL).

## Videos

Upstream landscape wallpapers are omitted. Landscapes mode needs your own files under `public/ipod/ryos/wallpapers/videos/`.

## License

AGPL-3.0-or-later — see `LICENSE` and `NOTICE`.
