"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

/** The collection grid with category filters. */
export default function Collection({ products }: { products: Product[] }) {
  const cats = ["All", ...Array.from(new Set(products.map((p) => p.collection)))];
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? products : products.filter((p) => p.collection === cat);
  return (
    <>
      <div className="section-head row">
        <div style={{ display: "grid", gap: 22 }}>
          <p className="eyebrow reveal">The collection</p>
          <h2 className="h2 reveal">Made to order, priced for real life.</h2>
        </div>
        <div className="filters reveal" role="group" aria-label="Filter by room">
          {cats.map((c) => (
            <button key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)} aria-pressed={c === cat}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid">
        {shown.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </>
  );
}
