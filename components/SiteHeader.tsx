import Link from "next/link";
import SiteMenu from "@/components/SiteMenu";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">CURATION VAULT</Link>
      <SiteMenu />
    </header>
  );
}
