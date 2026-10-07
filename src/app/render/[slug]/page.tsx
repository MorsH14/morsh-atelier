import { notFound } from "next/navigation";
import RenderStage from "@/components/RenderStage";
import { PRODUCTS, bySlug } from "@/lib/products";

/** Dev-only: a bare studio canvas that scripts/stills.mjs photographs. */
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

export default async function RenderPage({ params }: PageProps<"/render/[slug]">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  if (!bySlug(slug)) notFound();
  return <RenderStage slug={slug} />;
}
