import CollectionPage from "@/components/CollectionPage";
import { collections } from "@/lib/collections";
import { architectureReferences } from "@/lib/references";

const collection = collections.find((item) => item.slug === "architecture")!;

export default function ArchitecturePage() {
  return <CollectionPage collection={collection} references={architectureReferences} />;
}
