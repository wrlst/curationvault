import type { Reference } from "../../lib/references";

export type ReferenceRow = {
  id: string;
  slug: string;
  title: string;
  collection: string;
  subcategory: string;
  creator_name: string | null;
  creator_url: string | null;
  location: string | null;
  year: string | null;
  description: string | null;
  image_url: string | null;
  image: string | null;
  source_label: string | null;
  source_url: string | null;
  published: number;
};

export function toReference(row: ReferenceRow): Reference {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    collection: row.collection,
    subcategory: row.subcategory,
    creator: row.creator_name ? { name: row.creator_name, ...(row.creator_url ? { url: row.creator_url } : {}) } : undefined,
    location: row.location || undefined,
    year: row.year || undefined,
    description: row.description || undefined,
    imageUrl: row.image_url || undefined,
    image: row.image || undefined,
    source: row.source_label && row.source_url ? { label: row.source_label, url: row.source_url } : undefined,
    published: row.published === 1,
  };
}
