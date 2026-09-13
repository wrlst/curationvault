import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/">BUILT TO LAST / MEANT TO BE EXPLORED</Link>
      <a
        href="https://www.instagram.com/curationvault/"
        target="_blank"
        rel="noreferrer"
      >
        @CURATIONVAULT
      </a>
      <a href="mailto:curationvault@gmail.com">CURATIONVAULT@GMAIL.COM</a>
    </footer>
  );
}
