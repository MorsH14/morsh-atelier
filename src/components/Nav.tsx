"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { useSelection } from "@/context/Selection";

export default function Nav() {
  const { count, setOpen } = useSelection();
  return (
    <header className="nav">
      <Link href="/#top" className="logo" aria-label={`${BRAND.name} ${BRAND.suffix}`}>
        {BRAND.name}
        <span>{BRAND.suffix}</span>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        <Link href="/#collections">Collection</Link>
        <Link href="/#about">About</Link>
        <Link href="/#projects">Projects</Link>
        <Link href="/#faq">FAQ</Link>
        <Link href="/#contact">Get a free 3D concept</Link>
      </nav>
      <button className="nav-sel" onClick={() => setOpen(true)} aria-label={`Open selection, ${count} items`}>
        Selection <b>{count}</b>
      </button>
    </header>
  );
}
