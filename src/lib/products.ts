export type Kind = "sofa" | "table" | "lamp" | "chair" | "bed" | "console";

/** A colour/material option. `delta` is added to the base price (Naira). */
export type Choice = { id: string; name: string; hex: string; delta: number; metal?: boolean; rough?: number };
/** A size option. `w` is the seat width in scene units; `dims` is what the customer reads. */
export type SizeChoice = { id: string; name: string; dims: string; w: number; delta: number };
export type Config = { fabric: string; frame: string; size: string };

export type Product = {
  id: string;
  ref: string;
  name: string;
  collection: string;
  kind: Kind;
  /** Naira. Placeholder pricing: edit freely, everything reads from here. */
  price: number;
  material: string;
  lead: string;
  blurb: string;
  /** Present only on pieces that have a configurable 3D model. */
  fabrics?: Choice[];
  frames?: Choice[];
  sizes?: SizeChoice[];
  fabricLabel?: string;
  frameLabel?: string;
  sizeLabel?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "oro-sofa",
    ref: "MA-S01",
    name: "Oro Sofa",
    collection: "Living",
    kind: "sofa",
    price: 1850000,
    material: "Bouclé, solid-wood frame, brass feet",
    lead: "6 – 8 weeks",
    blurb: "A low, sculpted three-seater with deep cushions and softly rounded arms.",
    fabricLabel: "Fabric",
    frameLabel: "Feet",
    fabrics: [
      { id: "ivory", name: "Ivory bouclé", hex: "#e3d9c8", delta: 0, rough: 1 },
      { id: "sand", name: "Sand linen", hex: "#c4b08e", delta: 0, rough: 1 },
      { id: "cocoa", name: "Cocoa bouclé", hex: "#6b5445", delta: 0, rough: 1 },
      { id: "terracotta", name: "Terracotta velvet", hex: "#a65d3f", delta: 60000, rough: 0.8 },
      { id: "forest", name: "Forest velvet", hex: "#2f4a3a", delta: 60000, rough: 0.8 },
      { id: "charcoal", name: "Charcoal velvet", hex: "#3a3836", delta: 60000, rough: 0.8 },
    ],
    frames: [
      { id: "brass", name: "Brushed brass", hex: "#b79b6a", delta: 0, metal: true, rough: 0.28 },
      { id: "black", name: "Matte black", hex: "#1b1a19", delta: 0, metal: true, rough: 0.5 },
      { id: "walnut", name: "Solid walnut", hex: "#4b2f1c", delta: 45000, rough: 0.45 },
    ],
    sizes: [
      { id: "two", name: "2-seater", dims: "170 × 95 × 78 cm", w: 2.8, delta: -450000 },
      { id: "three", name: "3-seater", dims: "220 × 95 × 78 cm", w: 3.6, delta: 0 },
      { id: "four", name: "4-seater", dims: "280 × 95 × 78 cm", w: 4.6, delta: 520000 },
    ],
  },
  {
    id: "kora-table",
    ref: "MA-T02",
    name: "Kora Coffee Table",
    collection: "Living",
    kind: "table",
    price: 485000,
    material: "Walnut top, travertine-finish base",
    lead: "4 – 6 weeks",
    blurb: "A walnut disc resting on a weighty drum, edged with a thin brass line.",
    fabricLabel: "Top",
    frameLabel: "Base",
    sizeLabel: "Diameter",
    fabrics: [
      { id: "walnut", name: "Walnut", hex: "#5a3a24", delta: 0, rough: 0.42 },
      { id: "oak", name: "Natural oak", hex: "#a68a64", delta: 0, rough: 0.5 },
      { id: "ebony", name: "Ebony", hex: "#1f1b18", delta: 40000, rough: 0.4 },
    ],
    frames: [
      { id: "travertine", name: "Travertine", hex: "#d9ccb4", delta: 0, rough: 0.7 },
      { id: "stone", name: "Warm stone", hex: "#9c8f7c", delta: 0, rough: 0.75 },
      { id: "charcoal", name: "Charcoal", hex: "#2c2b2a", delta: 0, rough: 0.7 },
    ],
    sizes: [
      { id: "s", name: "Compact", dims: "80 cm wide × 40 cm high", w: 0.66, delta: -60000 },
      { id: "m", name: "Standard", dims: "100 cm wide × 40 cm high", w: 0.83, delta: 0 },
      { id: "l", name: "Large", dims: "120 cm wide × 40 cm high", w: 1.0, delta: 110000 },
    ],
  },
  {
    id: "lume-lamp",
    ref: "MA-L03",
    name: "Lume Floor Lamp",
    collection: "Lighting",
    kind: "lamp",
    price: 265000,
    material: "Brushed brass, linen diffuser",
    lead: "3 – 4 weeks",
    blurb: "A slim column of warm light that makes any corner feel finished.",
    fabricLabel: "Shade",
    frameLabel: "Stem & base",
    sizeLabel: "Height",
    fabrics: [
      { id: "linen", name: "White linen", hex: "#ece3d2", delta: 0, rough: 1 },
      { id: "sand", name: "Sand linen", hex: "#cdb893", delta: 0, rough: 1 },
      { id: "smoke", name: "Smoke linen", hex: "#7a7066", delta: 0, rough: 1 },
    ],
    frames: [
      { id: "brass", name: "Brushed brass", hex: "#b79b6a", delta: 0, metal: true, rough: 0.28 },
      { id: "black", name: "Matte black", hex: "#1b1a19", delta: 0, metal: true, rough: 0.5 },
      { id: "nickel", name: "Satin nickel", hex: "#b9bcc0", delta: 15000, metal: true, rough: 0.35 },
    ],
    sizes: [
      { id: "a", name: "Short", dims: "150 cm tall", w: 2.5, delta: -30000 },
      { id: "b", name: "Standard", dims: "170 cm tall", w: 2.83, delta: 0 },
      { id: "c", name: "Tall", dims: "190 cm tall", w: 3.17, delta: 35000 },
    ],
  },
  {
    id: "sela-chair",
    ref: "MA-C04",
    name: "Sela Lounge Chair",
    collection: "Living",
    kind: "chair",
    price: 720000,
    material: "Bouclé, swivel brass base",
    lead: "5 – 7 weeks",
    blurb: "Generous, enveloping and made to be sat in for hours.",
    fabricLabel: "Fabric",
    frameLabel: "Swivel base",
    sizeLabel: "Size",
    fabrics: [
      { id: "ivory", name: "Ivory bouclé", hex: "#e3d9c8", delta: 0, rough: 1 },
      { id: "sand", name: "Sand linen", hex: "#c4b08e", delta: 0, rough: 1 },
      { id: "cocoa", name: "Cocoa bouclé", hex: "#6b5445", delta: 0, rough: 1 },
      { id: "terracotta", name: "Terracotta velvet", hex: "#a65d3f", delta: 40000, rough: 0.8 },
      { id: "forest", name: "Forest velvet", hex: "#2f4a3a", delta: 40000, rough: 0.8 },
      { id: "charcoal", name: "Charcoal velvet", hex: "#3a3836", delta: 40000, rough: 0.8 },
    ],
    frames: [
      { id: "brass", name: "Brushed brass", hex: "#b79b6a", delta: 0, metal: true, rough: 0.28 },
      { id: "black", name: "Matte black", hex: "#1b1a19", delta: 0, metal: true, rough: 0.5 },
      { id: "nickel", name: "Satin nickel", hex: "#b9bcc0", delta: 0, metal: true, rough: 0.35 },
    ],
    sizes: [
      { id: "std", name: "Standard", dims: "80 × 82 × 78 cm", w: 1.3, delta: 0 },
      { id: "wide", name: "Wide", dims: "95 × 82 × 78 cm", w: 1.55, delta: 90000 },
    ],
  },
  {
    id: "nuit-bed",
    ref: "MA-B05",
    name: "Nuit Bed",
    collection: "Bedroom",
    kind: "bed",
    price: 1420000,
    material: "Upholstered headboard, walnut frame",
    lead: "6 – 8 weeks",
    blurb: "A tall, quilted headboard and a quiet frame. King and queen sizes.",
    fabricLabel: "Headboard",
    frameLabel: "Frame",
    sizeLabel: "Size",
    fabrics: [
      { id: "ivory", name: "Ivory bouclé", hex: "#e3d9c8", delta: 0, rough: 1 },
      { id: "sand", name: "Sand linen", hex: "#c4b08e", delta: 0, rough: 1 },
      { id: "cocoa", name: "Cocoa bouclé", hex: "#6b5445", delta: 0, rough: 1 },
      { id: "terracotta", name: "Terracotta velvet", hex: "#a65d3f", delta: 70000, rough: 0.8 },
      { id: "forest", name: "Forest velvet", hex: "#2f4a3a", delta: 70000, rough: 0.8 },
      { id: "charcoal", name: "Charcoal velvet", hex: "#3a3836", delta: 70000, rough: 0.8 },
    ],
    frames: [
      { id: "walnut", name: "Walnut", hex: "#5a3a24", delta: 0, rough: 0.42 },
      { id: "oak", name: "Natural oak", hex: "#a68a64", delta: 0, rough: 0.5 },
      { id: "ebony", name: "Ebony", hex: "#1f1b18", delta: 40000, rough: 0.4 },
    ],
    sizes: [
      { id: "q", name: "Queen", dims: "160 × 200 cm mattress", w: 2.7, delta: -200000 },
      { id: "k", name: "King", dims: "180 × 200 cm mattress", w: 3.05, delta: 0 },
      { id: "sk", name: "Super king", dims: "200 × 200 cm mattress", w: 3.4, delta: 180000 },
    ],
  },
  {
    id: "arc-console",
    ref: "MA-K06",
    name: "Arc Console",
    collection: "Entry & Dining",
    kind: "console",
    price: 540000,
    material: "Walnut, fluted doors, brass pulls",
    lead: "5 – 6 weeks",
    blurb: "Fluted fronts and slim proportions. Storage that looks like sculpture.",
    fabricLabel: "Wood",
    frameLabel: "Pulls & feet",
    sizeLabel: "Width",
    fabrics: [
      { id: "walnut", name: "Walnut", hex: "#5a3a24", delta: 0, rough: 0.42 },
      { id: "oak", name: "Natural oak", hex: "#a68a64", delta: 0, rough: 0.5 },
      { id: "ebony", name: "Ebony", hex: "#1f1b18", delta: 45000, rough: 0.4 },
    ],
    frames: [
      { id: "brass", name: "Brushed brass", hex: "#b79b6a", delta: 0, metal: true, rough: 0.28 },
      { id: "black", name: "Matte black", hex: "#1b1a19", delta: 0, metal: true, rough: 0.5 },
      { id: "nickel", name: "Satin nickel", hex: "#b9bcc0", delta: 15000, metal: true, rough: 0.35 },
    ],
    sizes: [
      { id: "s", name: "120 cm", dims: "120 × 40 × 80 cm", w: 2.0, delta: -90000 },
      { id: "m", name: "150 cm", dims: "150 × 40 × 80 cm", w: 2.5, delta: 0 },
      { id: "l", name: "180 cm", dims: "180 × 40 × 80 cm", w: 3.0, delta: 120000 },
    ],
  },
];

export const naira = (n: number) =>
  "₦" + new Intl.NumberFormat("en-NG").format(n);

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.id === slug);
export const isConfigurable = (p: Product) => !!(p.fabrics && p.frames && p.sizes);

/** Defaults: the first fabric and frame, and the size with no price change. */
export function defaultConfig(p: Product): Config {
  return {
    fabric: p.fabrics?.[0].id ?? "",
    frame: p.frames?.[0].id ?? "",
    size: (p.sizes?.find((s) => s.delta === 0) ?? p.sizes?.[0])?.id ?? "",
  };
}

export function priceFor(p: Product, cfg?: Config) {
  if (!cfg) return p.price;
  const d =
    (p.fabrics?.find((x) => x.id === cfg.fabric)?.delta ?? 0) +
    (p.frames?.find((x) => x.id === cfg.frame)?.delta ?? 0) +
    (p.sizes?.find((x) => x.id === cfg.size)?.delta ?? 0);
  return p.price + d;
}

export function describeConfig(p: Product, cfg?: Config) {
  if (!cfg) return "";
  return [
    p.sizes?.find((x) => x.id === cfg.size)?.name,
    p.fabrics?.find((x) => x.id === cfg.fabric)?.name,
    p.frames?.find((x) => x.id === cfg.frame)?.name,
  ]
    .filter(Boolean)
    .join(" · ");
}
