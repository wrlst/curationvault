# Curation Vault on Cloudflare Pages

The existing `curationvault` Pages project can keep its GitHub integration and
static Next.js build. The deployment now also contains lightweight Pages
Functions in `functions/` and a Cloudflare D1 database for references added in
the private admin. Do not create a second Pages project or change hosting
platforms.

## Build settings (unchanged)

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | Next.js (Static HTML Export) |
| Root directory | Repository root (blank in Pages) |
| Build command | `npm run build` |
| Output directory | `out` |

`npm run build` exports the fixed collection/subcategory pages and the existing
local reference. New D1 references are fetched by the gallery after page load;
a Pages Function serves the static detail shell at their new URLs. Published
entries therefore appear without another Git push. The original local image
and its statically generated detail page continue to work. If the D1 binding is
absent, existing static content remains available and admin writes fail closed.

## One-time Cloudflare setup

Complete these steps **before deploying the code that adds Pages Functions**:

1. In Cloudflare **Workers & Pages → D1 SQL database → Create Database**, create
   a database named `curationvault-content`.
2. Open that database's **Console**. Paste the complete contents of
   [`migrations/0001_create_references.sql`](./migrations/0001_create_references.sql)
   and select **Execute**. Confirm the `vault_references` and
   `admin_login_attempts` tables exist. The schema is idempotent.
3. Open the existing **Workers & Pages → curationvault → Settings → Bindings**.
   Add a **D1 database** binding with variable name exactly `DB`, selecting
   `curationvault-content`. Configure the production environment (and preview
   too if you want admin testing on preview deployments).
4. In **Settings → Variables and Secrets → Add**, create `ADMIN_PASSWORD` as an
   **encrypted secret**, not a plain variable. Use a unique, randomly generated
   password of at least 16 characters (prefer 24+), and store it in your
   password manager. Configure the production environment (and preview if
   applicable). Never put it in Git, `wrangler.toml`, or browser source code.
5. Commit and push this source to the already-connected `main` branch. Pages
   should automatically redeploy the **same** project. Bindings and secrets
   take effect on a new deployment, so redeploy once more if they were added
   after the code deployment.

After deployment, visit `/admin/`, sign in, create a published test reference,
then confirm it appears under its selected subcategory and opens at its detail
URL. Check a published gallery's `/api/references?collection=objects&subcategory=furniture`
endpoint if troubleshooting. An unauthenticated request to `/api/admin/references`
must return `401`.

## Security and editing

The admin form is a static login shell; reference writes happen only in Pages
Functions. `ADMIN_PASSWORD` is checked server-side. The successful login sets
an HTTP-only, signed, 12-hour, SameSite=Strict session cookie. Admin writes
require that cookie, a same-origin JSON request, and valid taxonomy/URL data.
The login endpoint limits repeated failures per IP using D1. Use HTTPS in
production, and restrict access to the password. The public archive does not
require sign-in.

The admin takes direct HTTPS image URLs and stores the URL, not the bytes.
Remote hosts must allow hotlinking. Archive cards retain their crop; detail
images keep their natural aspect ratio. If a remote image fails to load, the
existing placeholder is shown without losing metadata. The optional `image`
field remains available for local files under `public/images` in code.

Subcategories are fixed site structure, edited in `lib/subcategories.ts` and
deployed through Git. References are content, entered through `/admin/`. Drafts
are saved with `published = 0`, can be published later from the admin's Drafts
list, and are not returned by the public API until published.

## Local verification

Run `npm ci`, `npm run build`, and `npm run lint`. The deployable output is
`out/`; `functions/` is detected by Cloudflare Pages at the project root.
`npm run dev` previews the static UI but does not provide D1 or Pages Functions.
For full-stack local testing, run `npx wrangler pages dev out` with a local D1
binding and a local `ADMIN_PASSWORD` secret. Local D1 storage is separate from
production; apply the migration locally before using the admin.

Relevant Cloudflare guides: [Pages Functions](https://developers.cloudflare.com/pages/functions/),
[D1 database setup](https://developers.cloudflare.com/d1/get-started/), and
[Pages bindings and secrets](https://developers.cloudflare.com/pages/functions/bindings/).
