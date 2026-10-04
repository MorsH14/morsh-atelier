"use client";

import { useEffect, useState } from "react";
import { useSelection } from "@/context/Selection";
import { PRODUCTS, naira } from "@/lib/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Plate from "./Plate";

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
  const total = rows.reduce((s, r) => s + r.p.price * r.qty, 0);

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
              <li key={r.id}>
                <div className="drawer-thumb">
                  <Plate kind={r.p.kind} />
                </div>
                <div className="drawer-info">
                  <b>{r.p.name}</b>
                  <small>{r.p.ref}</small>
                  <div className="qty">
                    <button onClick={() => setQty(r.id, r.qty - 1)} aria-label="Decrease">−</button>
                    <span>{r.qty}</span>
                    <button onClick={() => setQty(r.id, r.qty + 1)} aria-label="Increase">+</button>
                    <button className="rm" onClick={() => remove(r.id)}>Remove</button>
                  </div>
                </div>
                <div className="drawer-price">{naira(r.p.price * r.qty)}</div>
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
