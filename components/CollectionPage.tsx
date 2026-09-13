import type { Collection } from "@/lib/collections";
import type { Reference } from "@/lib/references";
import Link from "next/link";
import ReferenceImage from "@/components/ReferenceImage";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type CollectionPageProps = {
  collection: Collection;
  references: Reference[];
};

export default function CollectionPage({
  collection,
  references,
}: CollectionPageProps) {
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

      <section className="archive-grid">
        {references.map((reference) => (
          <Link
            href={`/${collection.slug}/${reference.slug}`}
            className="archive-card"
            key={reference.slug}
          >
            <div className="archive-image">
              <ReferenceImage
                reference={reference}
                priority={reference === references[0]}
                sizes="(max-width: 700px) 90vw, 47vw"
                className="archive-photo"
              />
            </div>

            <div className="archive-meta">
              <span>{reference.category}</span>

              <span>
                {[reference.location, reference.year]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>

            <h2>{reference.title}</h2>
          </Link>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
