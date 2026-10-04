"use client";

import type { Product } from "@/lib/products";
import { naira } from "@/lib/products";
import { useSelection } from "@/context/Selection";
import Plate from "./Plate";

export default function ProductCard({ p, index }: { p: Product; index: number }) {
  const { add, has } = useSelection();
  const chosen = has(p.id);
  return (
    <article className="card reveal" style={{ ["--d" as string]: `${(index % 3) * 90}ms` }}>
      <div className="card-plate">
        <Plate kind={p.kind} />
        <span className="card-ref">{p.ref}</span>
      </div>
      <div className="card-body">
        <div className="card-row">
          <h3>{p.name}</h3>
          <span className="price">{naira(p.price)}</span>
        </div>
        <p className="card-meta">{p.material}</p>
        <p className="card-blurb">{p.blurb}</p>
        <div className="card-row card-foot">
          <small>Made to order · {p.lead}</small>
          <button className="link-btn" onClick={() => add(p.id)}>
            {chosen ? "Add another +" : "Add to selection +"}
          </button>
        </div>
      </div>
    </article>
  );
}
