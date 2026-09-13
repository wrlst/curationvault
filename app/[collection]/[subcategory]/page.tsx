import { notFound } from "next/navigation";
import SubcategoryPage from "@/components/SubcategoryPage";
import { collections } from "@/lib/collections";
import { getReferencesForSubcategory } from "@/lib/references";
import { getSubcategory, subcategories } from "@/lib/subcategories";

type PageProps = {
  params: Promise<{ collection: string; subcategory: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return subcategories.map(({ collection, slug }) => ({
    collection,
    subcategory: slug,
  }));
}

export default async function SubcategoryRoute({ params }: PageProps) {
  const { collection: collectionSlug, subcategory: subcategorySlug } = await params;
  const collection = collections.find((item) => item.slug === collectionSlug);
  const subcategory = getSubcategory(collectionSlug, subcategorySlug);

  if (!collection || !subcategory) notFound();

  return (
    <SubcategoryPage
      collection={collection}
      subcategory={subcategory}
      references={getReferencesForSubcategory(collection.slug, subcategory.slug)}
    />
  );
}
