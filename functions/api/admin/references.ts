import { collections } from "../../../lib/collections";
import { getSubcategory } from "../../../lib/subcategories";
import { references as localReferences } from "../../../lib/references";
import { hasSession, isConfigured } from "../../_lib/auth";
import { json, sameOrigin, type Context } from "../../_lib/types";

export async function onRequestGet({ request, env }: Context) {
  if (!isConfigured(env)) return json({ error: "Admin is not configured." }, 503);
  if (!(await hasSession(request, env))) return json({ error: "Sign in required." }, 401);
  const { results } = await env.DB!.prepare("SELECT id, title, collection, subcategory, slug, published FROM vault_references ORDER BY created_at DESC, rowid DESC")
    .bind().all<{ id: string; title: string; collection: string; subcategory: string; slug: string; published: number }>();

  return json({
    ok: true,
    references: results,
    drafts: results.filter((item) => item.published === 0),
  });
}

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function externalUrl(value: string, image = false) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && (!image && url.protocol !== "http:")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function slugify(title: string) {
  return title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    .slice(0, 80).replace(/-$/g, "");
}

export async function onRequestPost({ request, env }: Context) {
  if (!isConfigured(env)) return json({ error: "Admin is not configured." }, 503);
  if (!(await hasSession(request, env))) return json({ error: "Sign in required." }, 401);
  if (!sameOrigin(request) || !request.headers.get("Content-Type")?.startsWith("application/json")) {
    return json({ error: "Invalid request." }, 403);
  }

  const body = await request.text();
  if (body.length > 16000) return json({ error: "Entry is too large." }, 413);
  let input: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    input = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid entry." }, 400);
  }

  const title = text(input.title, 180);
  const collection = text(input.collection, 80);
  const subcategory = text(input.subcategory, 80);
  const slug = slugify(title);
  const imageUrl = text(input.imageUrl, 2000);
  const sourceUrl = text(input.sourceUrl, 2000);
  const creatorUrl = text(input.creatorUrl, 2000);
  const creatorName = text(input.creatorName, 180);
  const sourceLabel = text(input.sourceLabel, 180);
  const location = text(input.location, 180);
  const year = text(input.year, 30);
  const description = text(input.description, 3000);
  const published = input.published === true;

  if (!title || !slug || !collections.some((item) => item.slug === collection) || !getSubcategory(collection, subcategory)) {
    return json({ error: "Choose a title, collection, and matching subcategory." }, 400);
  }
  if ((imageUrl && !externalUrl(imageUrl, true)) || (sourceUrl && !externalUrl(sourceUrl)) || (creatorUrl && !externalUrl(creatorUrl))) {
    return json({ error: "Enter valid URLs. Image URLs must use HTTPS." }, 400);
  }
  if ((sourceLabel && !sourceUrl) || (creatorUrl && !creatorName)) {
    return json({ error: "A source label needs a source URL, and a creator URL needs a creator name." }, 400);
  }
  if (localReferences.some((reference) =>
    reference.collection === collection && reference.subcategory === subcategory && reference.slug === slug && reference.published !== false
  )) {
    return json({ error: "A reference with this title already exists in that subcategory." }, 409);
  }

  const id = crypto.randomUUID();
  try {
    await env.DB!.prepare(`INSERT INTO vault_references (
      id, slug, title, collection, subcategory, creator_name, creator_url,
      location, year, description, image_url, source_label, source_url, published
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)`)
      .bind(
        id, slug, title, collection, subcategory,
        creatorName || null, externalUrl(creatorUrl), location || null, year || null,
        description || null, externalUrl(imageUrl, true),
        sourceUrl ? sourceLabel || "Source" : null, externalUrl(sourceUrl), published ? 1 : 0
      ).run();
  } catch (error) {
    if (String(error).includes("UNIQUE")) return json({ error: "A reference with this title already exists in that subcategory." }, 409);
    return json({ error: "Could not save the reference." }, 500);
  }

  return json({ ok: true, id, slug, published, url: `/${collection}/${subcategory}/${slug}/` }, 201);
}

export async function onRequestPatch({ request, env }: Context) {
  if (!isConfigured(env)) return json({ error: "Admin is not configured." }, 503);
  if (!(await hasSession(request, env))) return json({ error: "Sign in required." }, 401);
  if (!sameOrigin(request) || !request.headers.get("Content-Type")?.startsWith("application/json")) {
    return json({ error: "Invalid request." }, 403);
  }
  let id: unknown;
  try {
    id = (await request.json() as { id?: unknown }).id;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/.test(id)) return json({ error: "Invalid draft." }, 400);

  const draft = await env.DB!.prepare("SELECT slug, collection, subcategory FROM vault_references WHERE id = ?1 AND published = 0")
    .bind(id).first<{ slug: string; collection: string; subcategory: string }>();
  if (!draft) return json({ error: "Draft not found." }, 404);
  await env.DB!.prepare("UPDATE vault_references SET published = 1 WHERE id = ?1 AND published = 0").bind(id).run();
  return json({ ok: true, url: `/${draft.collection}/${draft.subcategory}/${draft.slug}/` });
}


export async function onRequestDelete({ request, env }: Context) {
  if (!isConfigured(env)) return json({ error: "Admin is not configured." }, 503);
  if (!(await hasSession(request, env))) return json({ error: "Sign in required." }, 401);
  if (!sameOrigin(request) || !request.headers.get("Content-Type")?.startsWith("application/json")) {
    return json({ error: "Invalid request." }, 403);
  }

  let id: unknown;
  try {
    id = (await request.json() as { id?: unknown }).id;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/.test(id)) {
    return json({ error: "Invalid reference." }, 400);
  }

  const existing = await env.DB!.prepare(
    "SELECT id FROM vault_references WHERE id = ?1"
  ).bind(id).first<{ id: string }>();

  if (!existing) return json({ error: "Reference not found." }, 404);

  await env.DB!.prepare(
    "DELETE FROM vault_references WHERE id = ?1"
  ).bind(id).run();

  return json({ ok: true });
}
