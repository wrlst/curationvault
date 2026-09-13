import type { Metadata } from "next";
import DynamicReference from "@/components/DynamicReference";

export const metadata: Metadata = { title: "Reference", robots: { index: false } };

// This static shell is served by a Pages Function for newly added D1 references.
export default function ReferenceShell() {
  return <DynamicReference />;
}
