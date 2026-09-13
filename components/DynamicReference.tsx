"use client";

import { useEffect, useState } from "react";
import ReferencePage from "@/components/ReferencePage";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { collections } from "@/lib/collections";
import type { Reference } from "@/lib/references";
import { getSubcategory } from "@/lib/subcategories";

export default function DynamicReference() {
  const [reference, setReference] = useState<Reference | null>(null);
  const [message, setMessage] = useState("Loading reference…");
  const path = typeof window === "undefined" ? [] : window.location.pathname.split("/").filter(Boolean);
  const collectionSlug = path[0];
  const subcategorySlug = path[1];
  const slug = path[2];
  const collection = collections.find((item) => item.slug === collectionSlug);
  const subcategory = getSubcategory(collectionSlug, subcategorySlug);

  useEffect(() => {
    if (!collection || !subcategory || !slug) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ collection: collectionSlug, subcategory: subcategorySlug, slug });
    fetch(`/api/references?${query}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Reference unavailable.");
        return response.json() as Promise<{ reference: Reference }>;
      })
      .then((data) => {
        document.title = `${data.reference.title} — Curation Vault`;
        setReference(data.reference);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setMessage("Reference unavailable.");
      });
    return () => controller.abort();
  }, [collectionSlug, subcategorySlug, slug, collection, subcategory]);

  if (reference && collection && subcategory) {
    return <ReferencePage collection={collection} subcategory={subcategory} reference={reference} />;
  }

  return (
    <main>
      <SiteHeader />
      <section className="archive-empty"><p role="status">{message}</p></section>
      <SiteFooter />
    </main>
  );
}
