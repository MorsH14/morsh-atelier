"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import spots from "@/lib/roomSpots.json";
import { LOOKS, bySlug, naira, stillOf } from "@/lib/products";

type Spot = { slug: string; x: number; y: number };

/** The styled room, with a tap target on every piece that opens its card. */
export default function ShopTheRoom() {
  const [open, setOpen] = useState<string | null>(null);

  const layer = (key: "wide" | "tall", src: string, className: string) => (
    <div className={`room-frame ${className}`} onMouseLeave={() => setOpen(null)}>
      <Image
        className="room-img"
        src={src}
        alt="A living room with a cream bouclé sofa, a walnut coffee table, a brass floor lamp, a terracotta lounge chair and a fluted console"
        fill
        sizes="100vw"
      />
      {(spots[key] as Spot[])
        // a piece that falls off the edge of a phone crop gets no target
        .filter((s) => s.x > 7 && s.x < 93)
        .map((s) => {
          const p = bySlug(s.slug)!;
          const k = `${key}:${s.slug}`;
          const look = LOOKS[s.slug][0];
          return (
            <div
              key={k}
              className={`spot ${open === k ? "on" : ""} ${s.x > 58 ? "flip" : ""}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              onMouseEnter={() => setOpen(k)}
            >
              <button
                className="spot-dot"
                aria-label={`${p.name}, from ${naira(p.price)}`}
                aria-expanded={open === k}
                onClick={() => setOpen(open === k ? null : k)}
              />
              <div className="spot-card" role="group" aria-label={p.name}>
                <div className="thumb">
                  <Image src={stillOf(s.slug, look.id)} alt="" fill sizes="90px" style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <b>{p.name}</b>
                  <small>from {naira(p.price)}</small>
                  <Link href={`/shop/${s.slug}`}>View in 3D →</Link>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );

  return (
    <div className="room">
      <p className="room-hint">
        <i />
        Tap a piece
      </p>
      {layer("wide", "/room/living.jpg", "")}
      {layer("tall", "/room/living-m.jpg", "tall")}
    </div>
  );
}
