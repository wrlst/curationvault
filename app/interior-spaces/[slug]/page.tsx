import ReferenceRoute from "@/components/ReferenceRoute";
import { collections } from "@/lib/collections";
import { interiorSpaceReferences } from "@/lib/references";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const collection = collections.find((item) => item.slug === "interior-spaces")!;

export const dynamicParams = false;

export function generateStaticParams() {
  return interiorSpaceReferences.map(({ slug }) => ({ slug }));
}

export default async function InteriorReferencePage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <ReferenceRoute
      collection={collection}
      references={interiorSpaceReferences}
      slug={slug}
    />
  );
}
