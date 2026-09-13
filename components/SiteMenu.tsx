"use client";

import Link from "next/link";
import { useRef } from "react";
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
            <span>CURATION VAULT</span>
            <button type="button" className="menu-close" onClick={closeMenu} aria-label="Close menu">Close ×</button>
          </div>
          <nav className="menu-content" aria-label="Site navigation">
            <div className="menu-group">
              <span className="menu-group-label">01 / EXPLORE</span>
              <Link href="/about" className="menu-primary-link" onClick={closeMenu}>About <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="menu-group">
              <span className="menu-group-label">02 / SOCIALS</span>
              <a href="https://www.instagram.com/curationvault/" target="_blank" rel="noreferrer" className="menu-link">Instagram <span aria-hidden="true">↗</span></a>
              <a href="https://www.tiktok.com/@curationvault" target="_blank" rel="noreferrer" className="menu-link">TikTok <span aria-hidden="true">↗</span></a>
              <span className="menu-handle">@curationvault</span>
            </div>
            <div className="menu-group">
              <span className="menu-group-label">03 / EMAIL</span>
              <a href="mailto:curationvault@gmail.com" className="menu-email">curationvault@gmail.com</a>
            </div>
            <div className="menu-group menu-theme">
              <span className="menu-group-label">04 / DARK MODE</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}
