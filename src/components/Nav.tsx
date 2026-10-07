"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BRAND } from "@/lib/brand";
import { useSelection } from "@/context/Selection";

export default function Nav() {
  const { count, setOpen } = useSelection();
  const el = useRef<HTMLElement>(null);

  // Over the dark 3D hero the nav is light-on-dark; everywhere else it is a frosted paper bar.
  useEffect(() => {
    const nav = el.current;
    if (!nav) return;
    const update = () => {
      const hero = document.querySelector(".stage");
      const overHero = !!hero && hero.getBoundingClientRect().bottom > 70 && hero.getBoundingClientRect().top <= 0;
      nav.classList.toggle("on-dark", overHero);
      nav.classList.toggle("solid", !overHero && window.scrollY > 30);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header className="nav" ref={el}>
      <Link href="/#top" className="logo" aria-label={`${BRAND.name} ${BRAND.suffix}`}>
        {BRAND.name}
        <span>{BRAND.suffix}</span>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        <Link href="/#collections">Collection</Link>
        <Link href="/#room">Shop the room</Link>
        <Link href="/#about">About</Link>
        <Link href="/#faq">FAQ</Link>
        <Link href="/#contact">Free 3D concept</Link>
      </nav>
      <button className="nav-sel" onClick={() => setOpen(true)} aria-label={`Open selection, ${count} items`}>
        Selection <b>{count}</b>
      </button>
    </header>
  );
}
