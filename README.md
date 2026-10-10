# z1-ipod

First-generation iPod web player — **z1han.com 改编自 ryOS**.

This is the open-source (AGPL-3.0) adaptation of the [ryOS](https://github.com/ryokun6/ryos) iPod app (commit `d989f4d`, Copyright (C) 2025 Ryo Lu) by [Zihan Huang / z1han.com](https://www.z1han.com).

The private portfolio site [bravohenry/z1](https://github.com/bravohenry/z1) embeds this player via iframe so the AGPL code is not part of that private bundle. Source for *this* adaptation stays public here, satisfying AGPL §13 for network use.

## Run locally

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

```bash
pnpm build && pnpm start
```

## Deploy

1. Import https://github.com/bravohenry/z1-ipod in the Vercel dashboard (project name `z1-ipod`).
2. Production URL becomes `https://z1-ipod.vercel.app`.
3. Optional: point `ipod.z1han.com` CNAME at that Vercel project.
4. Set `NEXT_PUBLIC_Z1_IPOD_URL` on the private z1 project to the same origin.

## Embed

```html
<iframe
  src="https://YOUR-DEPLOYMENT/"
  title="z1-ipod"
  width="250"
  height="400"
  loading="lazy"
  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
  style="border:0;background:transparent"
></iframe>
```

The deploy sets `Content-Security-Policy: frame-ancestors` so `https://www.z1han.com` (and `*.vercel.app` previews) may embed it.

## Lyrics API

`GET /api/ipod/lyrics?id=<youtubeId>&title=...&artist=...`

Same-origin browser requests only (when `Origin` is present). Rate-limited. Proxies KuGou / LRCLIB; clients never talk to those providers directly.

## Fonts

| Face in CSS | File shipped | License |
|---|---|---|
| MyriadPro / modern UI | `SourceSans3-Semibold.woff2` | SIL OFL (Adobe Source Sans 3) |
| IpodGeneva | `SourceSans3-Regular.woff2` | SIL OFL |
| ChicagoKare | `ChicagoKare-Regular.woff2` | free Chicago recreation (upstream) |
| lyrics serif | Georgia (system) + `EBGaramond-Latin.woff2` | OFL |

Commercial Myriad Pro, Geneva, and VAG Rounded from upstream are **not** redistributed.

## Wallpapers / Landscapes mode

Upstream landscape `.mp4` files (~72 MB) are omitted from git (size + unclear redistribution). Drop your own files under `public/ipod/ryos/wallpapers/videos/` and list them in `manifest.json` if you want that mode.

## Attribution in the UI

- Settings menu: **「z1han.com 改编自 ryOS」** (opens About)
- About dialog: same line as the title emphasis, plus ryOS / LICENSE / this repo links
- Standalone page footer: same line

## License

GNU Affero General Public License v3.0 or later — see [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE).
