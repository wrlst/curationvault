import CollectionPage from "@/components/CollectionPage";
import { collections } from "@/lib/collections";
import { objectReferences } from "@/lib/references";

const collection = collections.find(
  (item) => item.slug === "objects"
)!;

export default function ObjectsPage() {
  return (
    <CollectionPage
      collection={collection}
      references={objectReferences}
    />
  );
}