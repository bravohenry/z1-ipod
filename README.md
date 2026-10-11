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

- Settings: one **About** entry
- About dialog: **z1han.com 改编自 ryOS**, with links to this adaptation, ryOS and the license
- Standalone page footer: same

## Fonts

Commercial Myriad Pro / Geneva / VAG Rounded are **not** redistributed. Shipped faces use SIL OFL Source Sans 3 (plus ChicagoKare recreation and EB Garamond OFL).

## Videos

Upstream landscape wallpapers are omitted. Landscapes mode needs your own files under `public/ipod/ryos/wallpapers/videos/`.

## Source correspondence

Player TypeScript and hardware styles follow Z1 commit `158d8aa695ebdc6e5c98aaf06914180b2ed218af`, including pointer-only focus outline suppression and preserving native list scroll during playback and metadata refreshes. The standalone Tailwind loader is scoped to `globals.css` so the hardware CSS Module keeps its class exports and keyboard focus styles. This is source correspondence, not deployment confirmation. Host import aliases are remapped for this standalone demo.

The demo retains its existing Source Sans 3 substitutions and omits landscape media. `SITE-FONTS.patch` provides the exact site CSS mapping; applying it requires supplying the referenced fonts separately. No font or video binaries were changed by this synchronization.

## UI regression check

With the demo running, use an existing Playwright installation:

```bash
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/verify-ipod-ui.mjs http://localhost:3000
```

The check covers modern and classic menus, scroll preservation during controlled playback, selection positioning, menu transitions, and pointer/keyboard focus. It does not assert live YouTube availability.

## License

AGPL-3.0-or-later — see `LICENSE` and `NOTICE`.
