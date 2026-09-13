import Link from "next/link";
import type { Collection } from "@/lib/collections";
import { getSubcategoriesForCollection } from "@/lib/subcategories";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function CollectionPage({ collection }: { collection: Collection }) {
  const subcategories = getSubcategoriesForCollection(collection.slug);

  return (
    <main>
      <SiteHeader />
      <section className="collection-header">
        <div className="section-label">
          <span>{collection.number}</span>
          <span>COLLECTION</span>
        </div>
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>
      </section>

      <section className="world-section subcategory-section" aria-label={`${collection.title} subcategories`}>
        <div className="section-label">
          <span>{String(subcategories.length).padStart(2, "0")} CATEGORIES</span>
          <span>EXPLORE {collection.title}</span>
        </div>
        <div className="world-list">
          {subcategories.map((subcategory, index) => (
            <Link
              href={`/${collection.slug}/${subcategory.slug}`}
              className="world-row"
              key={subcategory.slug}
            >
              <span className="world-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="world-content">
                <h2>{subcategory.title}</h2>
                {subcategory.description && <p>{subcategory.description}</p>}
              </div>
              <span className="world-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
