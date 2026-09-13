# Curation Vault

A Next.js static export on Cloudflare Pages, with Pages Functions and D1 for
private reference entry and live public galleries.

## Content workflow

After the Cloudflare setup in [DEPLOYMENT.md](./DEPLOYMENT.md), open `/admin/`,
sign in, choose a collection and subcategory, paste a direct HTTPS image URL,
add the reference details, and save. Published entries appear in their gallery
without a code edit, commit, or rebuild. Unpublished entries remain private.

The fixed collection/subcategory taxonomy is in `lib/collections.ts` and
`lib/subcategories.ts`. Existing local references are in `lib/references.ts`;
its placeholder records stay internal. Tags are type-only for future use.

## Development

Run `npm ci`, then `npm run dev` for the static Next.js UI at
http://localhost:3000. The D1-backed admin requires a Cloudflare Pages local
preview (`npx wrangler pages dev out` with a local D1 binding and local
`ADMIN_PASSWORD` secret) after `npm run build`.

Run `npm run build` and `npm run lint` before deployment.
