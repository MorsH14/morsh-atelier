"use client";

import { BRAND } from "@/lib/brand";
import { useSelection } from "@/context/Selection";

export default function Nav() {
  const { count, setOpen } = useSelection();
  return (
    <header className="nav">
      <a href="#top" className="logo" aria-label={`${BRAND.name} ${BRAND.suffix}`}>
        {BRAND.name}
        <span>{BRAND.suffix}</span>
      </a>
      <nav className="nav-links" aria-label="Primary">
        <a href="#collections">Collection</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Get a free 3D concept</a>
      </nav>
      <button className="nav-sel" onClick={() => setOpen(true)} aria-label={`Open selection, ${count} items`}>
        Selection <b>{count}</b>
      </button>
    </header>
  );
}
