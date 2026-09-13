# Cloudflare Pages

This project exports static HTML, CSS, and JavaScript. No server, API keys,
Cloudflare Workers adapter, or runtime environment variables are required.

## Build and preview

Run `npm ci`, then `npm run build`. The deployable output is `out/`.
The build uses Next.js's supported Webpack bundler because Turbopack's
persistence cache has failed on the local external drive.

To preview with Python 3 installed:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory out
```

Open http://localhost:4173. `next start` is not used for static exports.
Routes use directory indexes (for example `architecture/index.html`).

## GitHub and Pages

1. Create or select a GitHub repository under your chosen account. For a new
   repository, leave README, license, and gitignore initialization unchecked.
2. Review `git status`, then commit the source on `main`. Add your chosen
   repository as `origin` and push `main`. Do not upload `out/` or `node_modules/`.
3. In Cloudflare, open Workers & Pages, create a Pages project, and connect
   the GitHub repository. Authorize access to that repository when prompted.
4. Use these settings:

| Setting | Value |
| --- | --- |
| Project name | `curationvault` |
| Production branch | `main` |
| Framework preset | Next.js (Static HTML Export) |
| Root directory | Repository root (leave blank) |
| Build command | `npm run build` |
| Build output directory | `out` |

Override the preset's `npx next build` command with `npm run build` to use
the tested Webpack build. If `curationvault` is unavailable, stop and choose
a name explicitly; the desired address is https://curationvault.pages.dev.

## Content and image workflow

References in `lib/references.ts` automatically generate pages for their
collection during each build. Push content changes to trigger a new deployment.
Unknown slugs return 404; there is no on-demand page generation.

`imageUrl` takes priority over local `image`. Local files live in `public/images`.
Images load directly from their source with optimization disabled for static
hosting, so no `/_next/image` endpoint is required. Cropped archive cards and
uncropped detail photos keep their existing CSS treatment. Direct remote URLs
do not require allowlist edits in this mode. Remote hosts must permit hotlinking;
expired or blocked links cannot be repaired by static hosting. Original image
bytes are served, so large files should be compressed before adding them.

Theme preference is stored in the visitor's browser, with system preference used
initially. It requires no server. No accounts or deployment have been created
by the local preparation step.

Official guide: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
