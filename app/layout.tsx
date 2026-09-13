import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Curation Vault",
    template: "%s — Curation Vault",
  },
  description: "A considered digital archive of visual references.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Script id="theme-preference" strategy="beforeInteractive">
          {`try {
            const savedTheme = localStorage.getItem("curation-vault-theme");
            const theme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            document.documentElement.dataset.theme = theme;
          } catch {}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
