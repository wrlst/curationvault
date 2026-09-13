import { notFound } from "next/navigation";
import type { Collection } from "@/lib/collections";
import type { Reference } from "@/lib/references";
import ReferencePage from "@/components/ReferencePage";

type ReferenceRouteProps = {
  collection: Collection;
  references: Reference[];
  slug: string;
};

export default function ReferenceRoute({
  collection,
  references,
  slug,
}: ReferenceRouteProps) {
  const reference = references.find((item) => item.slug === slug);

  if (!reference) {
    notFound();
  }

  return <ReferencePage collection={collection} reference={reference} />;
}
