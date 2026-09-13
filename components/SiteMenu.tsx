"use client";

import Link from "next/link";
import { useRef } from "react";
import BrandWordmark from "@/components/BrandWordmark";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="menu-trigger"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span className="menu-trigger-lines" aria-hidden="true"><span /><span /></span>
      </button>
      <dialog
        ref={dialogRef}
        className="menu-dialog"
        aria-label="Site menu"
        onClose={() => triggerRef.current?.focus()}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeMenu();
        }}
      >
        <div className="menu-panel">
          <div className="menu-topline">
            <span className="brand-wordmark"><BrandWordmark /></span>
            <button type="button" className="menu-close" onClick={closeMenu} aria-label="Close menu">Close ×</button>
          </div>
          <nav className="menu-content" aria-label="Site navigation">
            <div className="menu-primary">
              <Link href="/architecture" onClick={closeMenu}>Architecture</Link>
              <Link href="/interior-spaces" onClick={closeMenu}>Interior Spaces</Link>
              <Link href="/objects" onClick={closeMenu}>Objects</Link>
            </div>
            <div className="menu-utilities">
              <div className="menu-utility-links">
                <Link href="/about" onClick={closeMenu}>About</Link>
                <a href="https://www.instagram.com/curationvault/" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://www.tiktok.com/@curationvault" target="_blank" rel="noreferrer">TikTok</a>
                <a href="mailto:curationvault@gmail.com">Email</a>
              </div>
              <div className="menu-theme-row">
                <span>Light / Dark</span>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}
