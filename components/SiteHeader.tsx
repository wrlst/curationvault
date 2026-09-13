import Link from "next/link";
import BrandWordmark from "@/components/BrandWordmark";
import SiteMenu from "@/components/SiteMenu";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand-wordmark" aria-label="curationvault — home"><BrandWordmark /></Link>
      <SiteMenu />
    </header>
  );
}
