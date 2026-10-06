import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductConfigurator from "@/components/ProductConfigurator";
import ProductCard from "@/components/ProductCard";
import Shell from "@/components/Shell";
import { PRODUCTS, bySlug, naira } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name} — MORSH Atelier`,
    description: `${p.blurb} Made to order from ${naira(p.price)}.`,
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();
  const more = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <Shell>
      <main className="pdp-main">
        <nav className="crumbs wrap" aria-label="Breadcrumb">
          <Link href="/#collections">Collection</Link>
          <span>/</span>
          <span>{p.name}</span>
        </nav>
        <ProductConfigurator slug={p.id} />
        <section className="wrap section">
          <div className="section-head">
            <p className="eyebrow">Pairs well with</p>
            <h2 className="h2">Complete the room.</h2>
          </div>
          <div className="grid">
            {more.map((m, i) => (
              <ProductCard key={m.id} p={m} index={i} />
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}
