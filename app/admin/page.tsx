import type { Metadata } from "next";
import AdminEntry from "@/components/AdminEntry";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = { title: "Add to Vault", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <main>
      <SiteHeader />
      <AdminEntry />
      <SiteFooter />
    </main>
  );
}
