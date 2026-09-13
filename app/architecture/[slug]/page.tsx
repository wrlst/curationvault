import ReferenceRoute from "@/components/ReferenceRoute";
import { collections } from "@/lib/collections";
import { architectureReferences } from "@/lib/references";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const collection = collections.find((item) => item.slug === "architecture")!;

export const dynamicParams = false;

export function generateStaticParams() {
  return architectureReferences.map(({ slug }) => ({ slug }));
}

export default async function ArchitectureReferencePage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <ReferenceRoute
      collection={collection}
      references={architectureReferences}
      slug={slug}
    />
  );
}
