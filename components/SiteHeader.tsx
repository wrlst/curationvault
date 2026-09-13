import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">
        CURATION VAULT
      </Link>

      <nav className="main-nav" aria-label="Primary navigation">
        <Link href="/about">About</Link>
        <details className="contact-nav">
          <summary>Contact</summary>
          <div>
            <a href="mailto:curationvault@gmail.com">Email</a>
            <a
              href="https://www.instagram.com/curationvault/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@curationvault"
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </a>
          </div>
        </details>
      </nav>

      <div className="header-actions">
        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            <Link href="/about">About</Link>
            <span>Contact</span>
            <a href="mailto:curationvault@gmail.com">Email</a>
            <a
              href="https://www.instagram.com/curationvault/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@curationvault"
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </a>
          </nav>
        </details>
        <ThemeToggle />
      </div>
    </header>
  );
}
