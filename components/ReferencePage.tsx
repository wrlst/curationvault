import Link from "next/link";
import type { Collection } from "@/lib/collections";
import type { Reference } from "@/lib/references";
import type { Subcategory } from "@/lib/subcategories";
import ReferenceImage from "@/components/ReferenceImage";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { normalizeExternalUrl } from "@/lib/image-config";

type ReferencePageProps = {
  collection: Collection;
  reference: Reference;
  subcategory: Subcategory;
};

export default function ReferencePage({
  collection,
  reference,
  subcategory,
}: ReferencePageProps) {
  const creatorUrl = normalizeExternalUrl(reference.creator?.url);
  const sourceUrl = normalizeExternalUrl(reference.source?.url);

  return (
    <main>
      <SiteHeader />

      <section className="reference-page">
        <div
          className={`reference-image${reference.imageUrl || reference.image ? "" : " reference-image--placeholder"}`}
        >
          <ReferenceImage
            reference={reference}
            priority
            sizes="(max-width: 800px) 90vw, 62vw"
            className="reference-photo"
            variant="detail"
          />
        </div>

        <article className="reference-information">
          <div className="section-label">
            <span>{collection.number} / <Link href={`/${collection.slug}`}>{collection.title}</Link> / <Link href={`/${collection.slug}/${subcategory.slug}`}>{subcategory.title}</Link></span>
            <span>Reference</span>
          </div>

          <h1>{reference.title}</h1>

          {reference.description && (
            <p className="reference-description">{reference.description}</p>
          )}

          {(reference.creator || reference.location || reference.year || reference.source) && (
            <dl className="reference-details">
              {reference.creator && (
                <div>
                  <dt>Creator</dt>
                  <dd>
                    {creatorUrl ? (
                      <a
                        href={creatorUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {reference.creator.name}
                      </a>
                    ) : (
                      reference.creator.name
                    )}
                  </dd>
                </div>
              )}
              {reference.location && (
                <div>
                  <dt>Location</dt>
                  <dd>{reference.location}</dd>
                </div>
              )}
              {reference.year && (
                <div>
                  <dt>Year</dt>
                  <dd>{reference.year}</dd>
                </div>
              )}
              {reference.source && (
                <div>
                  <dt>Source</dt>
                  <dd>
                    {sourceUrl ? (
                      <a href={sourceUrl} target="_blank" rel="noreferrer">
                        {reference.source.label}
                      </a>
                    ) : (
                      reference.source.label
                    )}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <Link href={`/${collection.slug}/${subcategory.slug}`} className="text-link">
            ← Back to {subcategory.title}
          </Link>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
