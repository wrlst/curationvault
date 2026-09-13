import { collections } from "../../lib/collections";
import { getSubcategory } from "../../lib/subcategories";
import { toReference, type ReferenceRow } from "../_lib/references";
import { json, type Context } from "../_lib/types";

export async function onRequestGet({ request, env }: Context) {
  if (!env.DB) return json({ error: "Archive database is not configured." }, 503);
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection") || "";
  const subcategory = url.searchParams.get("subcategory") || "";
  const slug = url.searchParams.get("slug");

  if (!collections.some((item) => item.slug === collection) || !getSubcategory(collection, subcategory)) {
    return json({ error: "Unknown gallery." }, 404);
  }

  try {
    if (slug) {
      const row = await env.DB.prepare("SELECT * FROM vault_references WHERE collection = ?1 AND subcategory = ?2 AND slug = ?3 AND published = 1")
        .bind(collection, subcategory, slug).first<ReferenceRow>();
      return row ? json({ reference: toReference(row) }) : json({ error: "Reference not found." }, 404);
    }
    const { results } = await env.DB.prepare("SELECT * FROM vault_references WHERE collection = ?1 AND subcategory = ?2 AND published = 1 ORDER BY created_at DESC, rowid DESC")
      .bind(collection, subcategory).all<ReferenceRow>();
    return json({ references: results.map(toReference) });
  } catch {
    return json({ error: "Archive unavailable." }, 503);
  }
}
