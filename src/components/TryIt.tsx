"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LOOKS, bySlug, defaultConfig, naira, priceFor, stillOf } from "@/lib/products";

const SLUG = "oro-sofa";

/** A taste of the configurator: pick a colourway and the sofa and the price change. */
export default function TryIt() {
  const p = bySlug(SLUG)!;
  const looks = LOOKS[SLUG];
  const [i, setI] = useState(0);
  const base = defaultConfig(p);
  const priceOf = (k: number) => priceFor(p, { ...base, fabric: looks[k].fabric, frame: looks[k].frame });

  return (
    <div className="try-grid">
      <div className="try-stage reveal">
        {looks.map((l, k) => (
          <Image
            key={l.id}
            className={`still ${k === i ? "on" : ""}`}
            src={stillOf(SLUG, l.id)}
            alt={k === i ? `${p.name}, ${l.name}` : ""}
            fill
            sizes="(max-width: 1020px) 100vw, 50vw"
          />
        ))}
        <span className="try-badge">The {p.name}</span>
      </div>
      <div className="try-copy">
        <p className="eyebrow reveal">Make it yours</p>
        <h2 className="h2 reveal">
          Choose it. <em>Turn it.</em> Own it.
        </h2>
        <p className="reveal">
          Every piece is made to order, so nothing is off the shelf. Pick the cloth and the finish, change the size,
          and watch the price update. When you open a piece you can turn it around in 3D before you decide.
        </p>
        <div className="try-looks reveal" role="group" aria-label="Choose a colourway">
          {looks.map((l, k) => {
            const f = p.fabrics!.find((x) => x.id === l.fabric)!;
            return (
              <button key={l.id} className={`look ${k === i ? "on" : ""}`} onClick={() => setI(k)} aria-pressed={k === i}>
                <i style={{ background: f.hex }} />
                <span>
                  <b>{l.name}</b>
                  <br />
                  <small>{f.name}</small>
                </span>
                <small>{naira(priceOf(k))}</small>
              </button>
            );
          })}
        </div>
        <div className="reveal" style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <Link href={`/shop/${SLUG}`} className="btn btn-solid">
            Open it in 3D
          </Link>
          <span className="try-price">
            {naira(priceOf(i))}
            <small>3-seater</small>
          </span>
        </div>
      </div>
    </div>
  );
}
