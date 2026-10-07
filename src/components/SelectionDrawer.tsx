"use client";

import { useEffect, useState } from "react";
import { useSelection } from "@/context/Selection";
import { LOOKS, PRODUCTS, describeConfig, naira, priceFor, stillOf } from "@/lib/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";

export default function SelectionDrawer() {
  const { items, open, setOpen, setQty, remove } = useSelection();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const rows = items
    .map((i) => ({ ...i, p: PRODUCTS.find((x) => x.id === i.id)! }))
    .filter((r) => r.p);
  const total = rows.reduce((s, r) => s + priceFor(r.p, r.cfg) * r.qty, 0);

  return (
    <>
      <div className={`scrim ${open ? "on" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? "on" : ""}`} aria-hidden={!open} aria-label="Your selection">
        <div className="drawer-head">
          <h3>Your selection</h3>
          <button onClick={() => setOpen(false)} aria-label="Close">
            Close
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="drawer-empty">
            Nothing here yet. Add the pieces you love and send them to us. We will talk finishes, sizing and delivery
            together on WhatsApp.
          </p>
        ) : (
          <ul className="drawer-list">
            {rows.map((r) => (
              <li key={r.key}>
                <div className="drawer-thumb">
                  <Image
                    src={stillOf(r.p.id, (LOOKS[r.p.id]?.find((l) => l.fabric === r.cfg?.fabric && l.frame === r.cfg?.frame) ?? LOOKS[r.p.id]?.[0])?.id ?? "")}
                    alt=""
                    width={92}
                    height={115}
                  />
                </div>
                <div className="drawer-info">
                  <b>{r.p.name}</b>
                  <small>{describeConfig(r.p, r.cfg) || r.p.ref}</small>
                  <div className="qty">
                    <button onClick={() => setQty(r.key, r.qty - 1)} aria-label="Decrease">−</button>
                    <span>{r.qty}</span>
                    <button onClick={() => setQty(r.key, r.qty + 1)} aria-label="Increase">+</button>
                    <button className="rm" onClick={() => remove(r.key)}>Remove</button>
                  </div>
                </div>
                <div className="drawer-price">{naira(priceFor(r.p, r.cfg) * r.qty)}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="drawer-foot">
          <div className="total">
            <span>Estimated total</span>
            <b>{naira(total)}</b>
          </div>
          {rows.length > 0 && (
            <div className="drawer-who">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" autoComplete="given-name" />
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" aria-label="Your city" autoComplete="address-level2" />
            </div>
          )}
          <p className="note">
            Nothing is charged here. Prices are starting estimates; you get a final itemised quote on WhatsApp and
            decide from there.
          </p>
          <a
            className={`btn btn-solid btn-block ${rows.length ? "" : "disabled"}`}
            href={rows.length ? buildWhatsAppUrl(items, name.trim() || undefined, city.trim() || undefined) : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!rows.length}
          >
            Send to MorsH on WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
