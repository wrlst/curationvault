import { notFound } from "next/navigation";
import ReferencePage from "@/components/ReferencePage";
import { collections } from "@/lib/collections";
import { references } from "@/lib/references";
import { getSubcategory } from "@/lib/subcategories";

type PageProps = {
  params: Promise<{ collection: string; subcategory: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.flatMap((collection) =>
    references
      .filter(
        (reference) =>
          reference.collection === collection.slug &&
          reference.subcategory &&
          reference.published !== false &&
          getSubcategory(collection.slug, reference.subcategory)
      )
      .map((reference) => ({
        collection: collection.slug,
        subcategory: reference.subcategory!,
        slug: reference.slug,
      }))
  );
}

export default async function ReferenceRoute({ params }: PageProps) {
  const { collection: collectionSlug, subcategory: subcategorySlug, slug } = await params;
  const collection = collections.find((item) => item.slug === collectionSlug);
  const subcategory = getSubcategory(collectionSlug, subcategorySlug);
  const reference = references.find(
    (item) => item.slug === slug && item.collection === collection?.slug && item.subcategory === subcategorySlug && item.published !== false
  );

  if (!collection || !subcategory || !reference) notFound();

  return <ReferencePage collection={collection} subcategory={subcategory} reference={reference} />;
}
