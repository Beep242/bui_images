# CLAUDE.md

## What this is

A self-hosted image CDN backing store plus a single static gallery page. A Caddy
`file_server` on the VPS serves a clone of this repo at `https://img.iambeep.com`, so every
committed file is immediately public at `https://img.iambeep.com/<repo-relative-path>` — the
repo root *is* the web root. `index.html` is a standalone vanilla HTML/CSS/JS gallery of the
GMod UI assets.

## Layout

- `images/gmod/` — 43 PNGs, GMod addon UI assets. These are what `script.js` lists. They were
  added one-per-commit (`Copy <file>.png into images/gmod/`) rather than through the upload API.
- `images/portfolio/` — 11 UUID-named files, **machine-written** by the PortFolio app through
  Gitea's Contents API. Never rename or reorganize these.
- `images/products/<key>/` — same mechanism, one namespace per product. Currently absent; it
  existed (`images/products/polyshield/`, commit `6215846` deleted it) and is recreated
  automatically on the next upload.
- `index.html`, `style.css`, `script.js` — the gallery page. No framework, no bundler.
- `.gitea/workflows/gitea-fallback-deploy.yml` — the only automation in the repo.

## Commands

No build tooling — no `package.json`, `Makefile`, or any other manifest. Opening `index.html`
directly in a browser is the full "run" story; its only non-relative reference is the Google
Fonts stylesheet for Rubik (`style.css` names that family), which just falls back offline.

The deploy workflow (`runs-on: vps-fallback`, on push to `main` or `workflow_dispatch`) runs:

```
set -e
cd /opt/bui_images
git fetch gitea
git reset --hard gitea/main
```

## Architecture notes

- Two remotes: `origin` = `github.com/Beep242/bui_images`, `gitea` =
  `ssh://git@git.iambeep.com:2222/Beep/bui_images.git`. `main` tracks `origin`, but the deploy job
  lives in `.gitea/workflows/` and there is no `.github/` — **a push to `origin` alone does not
  deploy**. Per the workflow's own header comment, the runner is host-mode and registered only
  under the `vps-fallback` label.
- The workflow's `git fetch gitea` assumes the server clone at `/opt/bui_images` already has a
  `gitea` remote; nothing in this repo creates it.
- Deploy is a hard reset, not a copy: anything edited in place at `/opt/bui_images` is destroyed on
  the next push. Caddy's config is outside this repo — PortFolio's `imageCdn.js` comment points at
  `/opt/truthseeker/Caddyfile` on the VPS (not verifiable from here).
- Uploads arrive from outside this repo. PortFolio's `lib/media/imageCdn.js` POSTs to
  `/api/v1/repos/Beep/bui_images/contents/<path>`, naming each file `crypto.randomUUID()` with a
  png/jpg/webp/gif extension by MIME — do not assume `.png`. Its deletes are Contents API DELETEs,
  which is where the `Remove images/...` commits in the log come from.
  Env var names (set in the *consuming* app, not here): `GITEA_TOKEN`, `GITEA_URL`,
  `GITEA_IMAGES_OWNER`, `GITEA_IMAGES_REPO`, `GITEA_IMAGES_BRANCH`, `GITEA_IMAGES_BASE_URL`.
- Those repo-relative paths are stored in the PortFolio database and the public URL is
  reconstructed from them. Moving a file under `images/portfolio/` breaks live records.

## Conventions & gotchas

- **The gallery page is currently broken.** `script.js:53` builds `img.src = "images/" + id + ".png"`,
  which was correct until commit `93b521a` ("moved images into project folders") deleted all 43
  PNGs from `images/` root after they had been copied into `images/gmod/`. `script.js` was never
  updated, so every tile 404s. Fix is the path prefix, not the id list — the 43 ids and the 43
  files still match exactly.
- The image list in `script.js` is a hardcoded array; there is no directory listing. Adding a GMod
  asset means committing the PNG **and** appending its id (filename minus `.png`) to that array.
- `index.html`'s footer claims "Hosted on GitHub Pages" — stale; serving is Caddy + Gitea (above).
- No `.gitattributes` and no Git LFS: images are committed as plain blobs and history grows
  permanently. Deletes shrink the working tree, never the history.
- License is EPL-2.0. The `index.html` footer credits game-icons.net under CC BY 3.0 — it covers the
  handful of icon-named assets (`check-mark`, `price-tag`, `sell-card`, `skeleton-inside`,
  `pencil-ruler`, `door_cancel`, `uzi`), not the random-id screenshots. Keep it when editing.
