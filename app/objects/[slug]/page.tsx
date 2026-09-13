import ReferenceRoute from "@/components/ReferenceRoute";
import { collections } from "@/lib/collections";
import { objectReferences } from "@/lib/references";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const collection = collections.find((item) => item.slug === "objects")!;

export const dynamicParams = false;

export function generateStaticParams() {
  return objectReferences.map(({ slug }) => ({ slug }));
}

export default async function ObjectReferencePage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <ReferenceRoute
      collection={collection}
      references={objectReferences}
      slug={slug}
    />
  );
}
