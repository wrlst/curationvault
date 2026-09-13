import CollectionPage from "@/components/CollectionPage";
import { collections } from "@/lib/collections";

const collection = collections.find((item) => item.slug === "architecture")!;

export default function ArchitecturePage() {
  return <CollectionPage collection={collection} />;
}
