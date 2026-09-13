# Curation Vault

A static Next.js archive of architecture, interior spaces, and objects.

## Development

Run `npm ci`, then `npm run dev`. Open http://localhost:3000.

Edit references in `lib/references.ts` and collections in `lib/collections.ts`.

## Production

Run `npm run build` to generate `out/`. All reference routes are generated
from the data. Images load directly; no Next.js server is needed in production.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the static preview command and exact
GitHub → Cloudflare Pages setup.
