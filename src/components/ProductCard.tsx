"use client";

import Link from "next/link";
import { isConfigurable, naira, type Product } from "@/lib/products";
import { useSelection } from "@/context/Selection";
import Plate from "./Plate";

export default function ProductCard({ p, index }: { p: Product; index: number }) {
  const { add, has } = useSelection();
  const chosen = has(p.id);
  const live = isConfigurable(p);
  const href = `/shop/${p.id}`;
  return (
    <article className="card reveal" style={{ ["--d" as string]: `${(index % 3) * 90}ms` }}>
      <Link href={href} className="card-plate" aria-label={`View ${p.name}`}>
        <Plate kind={p.kind} />
        <span className="card-ref">{p.ref}</span>
        {live && <span className="card-tag">View in 3D</span>}
      </Link>
      <div className="card-body">
        <div className="card-row">
          <h3>
            <Link href={href}>{p.name}</Link>
          </h3>
          <span className="price">
            {live && <small>from </small>}
            {naira(p.price)}
          </span>
        </div>
        <p className="card-meta">{p.material}</p>
        <p className="card-blurb">{p.blurb}</p>
        <div className="card-row card-foot">
          <small>Made to order · {p.lead}</small>
          {live ? (
            <Link className="link-btn" href={href}>
              Customise in 3D →
            </Link>
          ) : (
            <button className="link-btn" onClick={() => add(p.id)}>
              {chosen ? "Add another +" : "Add to selection +"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
