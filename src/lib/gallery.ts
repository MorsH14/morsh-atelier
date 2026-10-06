/**
 * Photos shown beside the 3D viewer on a product page.
 *
 * ⚠️  These are free-licence STYLING photos (Unsplash). They show the mood, not
 * MorsH's exact pieces, and the page labels them that way. Replace them with
 * photos of your own finished pieces: put files in public/products/<slug>/ and
 * list them here with `own: true` to drop the "inspiration" label.
 */
export type Photo = { src: string; alt: string; credit?: string; own?: boolean };

export const GALLERY: Record<string, Photo[]> = {
  "oro-sofa": [
    { src: "/products/oro-sofa/1.jpg", alt: "A soft cream sofa beside a warm floor lamp", credit: "Nadi Spasibenko" },
    { src: "/products/oro-sofa/2.jpg", alt: "A curved cream sofa in a warm, panelled living room", credit: "Poojan Thanekar" },
  ],
  "nuit-bed": [
    { src: "/products/nuit-bed/1.jpg", alt: "A bedroom with a tall upholstered headboard", credit: "Clay Banks" },
    { src: "/products/nuit-bed/2.jpg", alt: "A bed with a dark, channelled upholstered headboard", credit: "mk. s" },
  ],
  "arc-console": [
    { src: "/products/arc-console/1.jpg", alt: "A slim oak sideboard styled with plants", credit: "Sophia Baboolal" },
  ],
  "sela-chair": [
    { src: "/products/sela-chair/1.jpg", alt: "A deep lounge armchair by a window", credit: "Joshua Lawrence" },
  ],
  "kora-table": [
    { src: "/products/kora-table/1.jpg", alt: "A warm wood coffee table in front of a soft sofa", credit: "Lui Peng" },
  ],
};
