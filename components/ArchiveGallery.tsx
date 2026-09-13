"use client";

import { useEffect, useState } from "react";
import ReferenceImage from "@/components/ReferenceImage";
import type { Collection } from "@/lib/collections";
import type { Reference } from "@/lib/references";
import type { Subcategory } from "@/lib/subcategories";

type Props = {
  collection: Collection;
  subcategory: Subcategory;
  initialReferences: Reference[];
};

export default function ArchiveGallery({ collection, subcategory, initialReferences }: Props) {
  const [liveReferences, setLiveReferences] = useState<Reference[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ collection: collection.slug, subcategory: subcategory.slug });
    fetch(`/api/references?${query}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (response.status === 404) return { references: [] }; // Static local preview.
        if (!response.ok) throw new Error("Archive unavailable");
        return response.json() as Promise<{ references: Reference[] }>;
      })
      .then((data) => setLiveReferences(data.references))
      .catch((error) => {
        if (error.name !== "AbortError") setUnavailable(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [collection.slug, subcategory.slug]);

  const referenceMap = new Map(initialReferences.map((reference) => [reference.slug, reference]));
  for (const reference of liveReferences) referenceMap.set(reference.slug, reference);
  const references = [...referenceMap.values()];

  if (!references.length) {
    return (
      <section className="archive-empty" aria-label={`${subcategory.title} references`}>
        <p>{loading ? "Loading references…" : unavailable ? "Live references are temporarily unavailable." : "References forthcoming."}</p>
        <a href={`/${collection.slug}/`} className="text-link">← Back to {collection.title}</a>
      </section>
    );
  }

  return (
    <section className="archive-grid" aria-label={`${subcategory.title} references`}>
      {references.map((reference, index) => (
        <a
          href={`/${collection.slug}/${subcategory.slug}/${reference.slug}/`}
          className="archive-card"
          key={reference.id || reference.slug}
        >
          <div className="archive-image">
            <ReferenceImage
              reference={reference}
              priority={index === 0}
              sizes="(max-width: 700px) 90vw, 47vw"
              className="archive-photo"
            />
          </div>
          <div className="archive-meta">
            <span>{subcategory.title}</span>
            <span>{[reference.location, reference.year].filter(Boolean).join(" · ")}</span>
          </div>
          <h2>{reference.title}</h2>
        </a>
      ))}
    </section>
  );
}
