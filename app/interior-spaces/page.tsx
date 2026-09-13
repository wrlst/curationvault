import CollectionPage from "@/components/CollectionPage";
import { collections } from "@/lib/collections";
import { interiorSpaceReferences } from "@/lib/references";

const collection = collections.find(
  (item) => item.slug === "interior-spaces"
)!;

export default function InteriorSpacesPage() {
  return (
    <CollectionPage
      collection={collection}
      references={interiorSpaceReferences}
    />
  );
}