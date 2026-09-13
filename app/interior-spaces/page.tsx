import CollectionPage from "@/components/CollectionPage";
import { collections } from "@/lib/collections";

const collection = collections.find(
  (item) => item.slug === "interior-spaces"
)!;

export default function InteriorSpacesPage() {
  return (
    <CollectionPage collection={collection} />
  );
}
