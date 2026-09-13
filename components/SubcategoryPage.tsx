import Link from "next/link";
import type { Collection } from "@/lib/collections";
import type { Reference } from "@/lib/references";
import type { Subcategory } from "@/lib/subcategories";
import ArchiveGallery from "@/components/ArchiveGallery";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type Props = {
  collection: Collection;
  subcategory: Subcategory;
  references: Reference[];
};

export default function SubcategoryPage({ collection, subcategory, references }: Props) {
  return (
    <main>
      <SiteHeader />
      <section className="collection-header">
        <div className="section-label">
          <span>{collection.number} / <Link href={`/${collection.slug}`}>{collection.title}</Link></span>
          <span>SUBCATEGORY</span>
        </div>
        <h1>{subcategory.title}</h1>
        {subcategory.description && <p>{subcategory.description}</p>}
      </section>

      <ArchiveGallery collection={collection} subcategory={subcategory} initialReferences={references} />
      <SiteFooter />
    </main>
  );
}
