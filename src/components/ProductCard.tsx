"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LOOKS, bySlug, naira, priceFor, stillOf, type Product } from "@/lib/products";

/** A catalogue tile: a rendered still, colour dots that swap it, and the price for that look. */
export default function ProductCard({ p, index }: { p: Product; index: number }) {
  const looks = LOOKS[p.id] ?? [];
  const [lookId, setLookId] = useState(looks[0]?.id);
  const look = looks.find((l) => l.id === lookId) ?? looks[0];
  const href = `/shop/${p.id}`;

  const swatch = (fabric: string) => p.fabrics?.find((f) => f.id === fabric)?.hex ?? "#ccc";
  const price = look
    ? priceFor(bySlug(p.id)!, {
        fabric: look.fabric,
        frame: look.frame,
        size: (p.sizes?.find((s) => s.delta === 0) ?? p.sizes?.[0])?.id ?? "",
      })
    : p.price;

  return (
    <article className="card reveal" style={{ ["--d" as string]: `${(index % 3) * 90}ms` }}>
      <Link href={href} className="card-plate" aria-label={`View the ${p.name} in 3D`}>
        {looks.map((l, i) => (
          <Image
            key={l.id}
            className="still"
            src={stillOf(p.id, l.id)}
            alt={i === 0 ? `${p.name} in ${l.name}` : ""}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1020px) 50vw, 33vw"
            style={{ opacity: l.id === look?.id ? 1 : 0 }}
          />
        ))}
        <span className="card-ref">{p.ref}</span>
        <span className="card-tag">
          <span>Customise in 3D</span>
          <span aria-hidden>→</span>
        </span>
      </Link>
      <div className="card-body">
        <div className="card-row">
          <h3>
            <Link href={href}>{p.name}</Link>
          </h3>
          <span className="price">
            <small>from </small>
            {naira(price)}
          </span>
        </div>
        <p className="card-meta">
          {p.material} · made to order, {p.lead}
        </p>
        {looks.length > 1 && (
          <div className="dots" role="group" aria-label={`${p.name} colourways`}>
            {looks.map((l) => (
              <button
                key={l.id}
                className={`dot ${l.id === look?.id ? "on" : ""}`}
                style={{ background: swatch(l.fabric) }}
                onClick={() => setLookId(l.id)}
                aria-label={l.name}
                aria-pressed={l.id === look?.id}
              />
            ))}
            <small>{look?.name}</small>
          </div>
        )}
      </div>
    </article>
  );
}
