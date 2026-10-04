import { BRAND } from "./brand";
import { PRODUCTS, naira } from "./products";

export type SelectionItem = { id: string; qty: number };

export function buildWhatsAppUrl(items: SelectionItem[], name?: string) {
  const lines = items
    .map((it) => {
      const p = PRODUCTS.find((x) => x.id === it.id);
      if (!p) return null;
      return `• ${p.name} (${p.ref}) × ${it.qty} — ${naira(p.price * it.qty)}`;
    })
    .filter(Boolean);

  const total = items.reduce((sum, it) => {
    const p = PRODUCTS.find((x) => x.id === it.id);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);

  const text = [
    `Hello MORSH Atelier${name ? `, I'm ${name}` : ""}.`,
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
