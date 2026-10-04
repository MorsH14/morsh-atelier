export type Kind = "sofa" | "table" | "lamp" | "chair" | "bed" | "console";

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
  },
];

export const naira = (n: number) =>
  "₦" + new Intl.NumberFormat("en-NG").format(n);
