import { BRAND } from "./brand";
import { PRODUCTS, describeConfig, naira, priceFor, type Config } from "./products";

/** `key` is unique per product + configuration, so two sofa colours are two lines. */
export type SelectionItem = { key: string; id: string; qty: number; cfg?: Config };

export type Brief = { name: string; city?: string; room?: string; budget?: string; note?: string };

export function buildBriefUrl(b: Brief) {
  const text = [
    `Hello MORSH Atelier, I'm ${b.name}.`,
    "",
    "I'd like a free 3D concept for my space.",
    b.room ? `Room: ${b.room}` : null,
    b.city ? `City: ${b.city}` : null,
    b.budget ? `Budget: ${b.budget}` : null,
    b.note ? `\n${b.note}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppUrl(items: SelectionItem[], name?: string, city?: string) {
  const lines = items.flatMap((it) => {
    const p = PRODUCTS.find((x) => x.id === it.id);
    if (!p) return [];
    const spec = describeConfig(p, it.cfg);
    return [`• ${p.name} (${p.ref}) × ${it.qty} — ${naira(priceFor(p, it.cfg) * it.qty)}${spec ? `\n   ${spec}` : ""}`];
  });

  const total = items.reduce((sum, it) => {
    const p = PRODUCTS.find((x) => x.id === it.id);
    return sum + (p ? priceFor(p, it.cfg) * it.qty : 0);
  }, 0);

  const text = [
    `Hello MORSH Atelier${name ? `, I'm ${name}` : ""}${city ? ` from ${city}` : ""}.`,
    "",
    "I'd like to talk about these pieces:",
    ...lines,
    "",
    `Estimated total: ${naira(total)}`,
    "",
    "Could we discuss details, finishes and delivery?",
  ].join("\n");

  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const generalEnquiryUrl = (msg = "Hello MORSH Atelier, I'd like to discuss a project.") =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;
