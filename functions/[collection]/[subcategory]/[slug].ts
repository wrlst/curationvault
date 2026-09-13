import { collections } from "../../../lib/collections";
import { getSubcategory } from "../../../lib/subcategories";
import { json, type Context } from "../../_lib/types";

export async function onRequestGet({ request, env, params }: Context<{ collection: string; subcategory: string; slug: string }>) {
  const { collection, subcategory, slug } = params;

  if (collection === "architecture" && subcategory === "houses" && slug === "reference-one") {
    return Response.redirect(new URL("/architecture/residential/reference-one/", request.url), 301);
  }
  if (!collections.some((item) => item.slug === collection) || !getSubcategory(collection, subcategory)) {
    return json({ error: "Reference not found." }, 404);
  }
  if (!env.ASSETS) return json({ error: "Static assets unavailable." }, 503);

  // Existing committed references stay available as their original static HTML.
  const staticPage = await env.ASSETS.fetch(request);
  if (staticPage.ok) return staticPage;

  if (!env.DB) return json({ error: "Reference not found." }, 404);
  const row = await env.DB.prepare("SELECT title FROM vault_references WHERE collection = ?1 AND subcategory = ?2 AND slug = ?3 AND published = 1")
    .bind(collection, subcategory, slug).first<{ title: string }>();
  if (!row) return json({ error: "Reference not found." }, 404);

  // The static Next.js detail shell fetches this published record on the client.
  const shell = await env.ASSETS.fetch(new URL("/reference/", request.url));
  const safeTitle = row.title.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
  const html = (await shell.text())
    .replace(/<title>[^<]*<\/title>/, `<title>${safeTitle} — Curation Vault</title>`)
    .replace(/<meta name="robots" content="noindex"\s*\/>/, "");
  const headers = new Headers(shell.headers);
  headers.set("Cache-Control", "no-store");
  headers.delete("Content-Length");
  return new Response(html, { status: shell.status, headers });
}
