import HeroStage from "@/components/HeroStage";
import Nav from "@/components/Nav";
import ProductCard from "@/components/ProductCard";
import SelectionDrawer from "@/components/SelectionDrawer";
import SmoothScroll from "@/components/SmoothScroll";
import Reveal from "@/components/Reveal";
import { SelectionProvider } from "@/context/Selection";
import { BRAND } from "@/lib/brand";
import { PRODUCTS } from "@/lib/products";
import { generalEnquiryUrl } from "@/lib/whatsapp";

const SERVICES = [
  {
    n: "01",
    t: "3D visualisation",
    d: "Walk through your room before anything is bought or built. Photoreal renders, material and lighting options, and as many revisions as it takes to be certain.",
  },
  {
    n: "02",
    t: "Bespoke furniture",
    d: "Sofas, beds, consoles and tables designed around your space and made to order by skilled makers, with finishes you choose.",
  },
  {
    n: "03",
    t: "Full interior design",
    d: "From layout and lighting to the last cushion. One point of contact, one cohesive result.",
  },
];

const PROCESS = [
  ["Conversation", "You tell us about the space and how you live in it, on WhatsApp or in person."],
  ["3D concept", "We model your room and propose layouts, materials and lighting you can see."],
  ["Refine & quote", "Adjust everything in 3D until it feels right. You get a clear, itemised price."],
  ["Make & install", "Pieces are made, delivered and placed. The room you saw is the room you get."],
];

export default function Home() {
  return (
    <SelectionProvider>
      <SmoothScroll />
      <Reveal />
      <Nav />
      <main>
        <HeroStage />

        <section className="manifesto wrap">
          <p className="eyebrow reveal">The idea</p>
          <p className="manifesto-text reveal">
            Luxury is not a price tag. It is <em>proportion</em>, <em>material</em> and <em>light</em>, resolved so well
            that a room feels effortless. We draw it in 3D first, so what you see is what you live in.
          </p>
        </section>

        <section id="collections" className="wrap section">
          <div className="section-head">
            <p className="eyebrow reveal">The collection</p>
            <h2 className="h2 reveal">Pieces made to order, priced for real life.</h2>
          </div>
          <div className="grid">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
          <p className="grid-note reveal">
            Choose what you love, then send your selection to MorsH on WhatsApp. We take it from there.
          </p>
        </section>

        <section id="services" className="services section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow reveal">The studio</p>
              <h2 className="h2 reveal">
                Design you can <em>walk through</em>.
              </h2>
            </div>
            <ul className="svc-list">
              {SERVICES.map((s) => (
                <li key={s.n} className="svc reveal">
                  <span className="svc-n">{s.n}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="process" className="wrap section">
          <div className="section-head">
            <p className="eyebrow reveal">How it works</p>
            <h2 className="h2 reveal">Four quiet steps.</h2>
          </div>
          <ol className="steps">
            {PROCESS.map(([t, d], i) => (
              <li key={t} className="step reveal">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="cta">
          <div className="wrap">
            <p className="eyebrow reveal">Begin</p>
            <h2 className="display reveal">
              Tell us about <em>your room.</em>
            </h2>
            <a className="btn btn-solid reveal" href={generalEnquiryUrl()} target="_blank" rel="noreferrer">
              Message MorsH on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="foot wrap">
        <div className="logo">
          {BRAND.name}
          <span>{BRAND.suffix}</span>
        </div>
        <p>{BRAND.tagline}</p>
        <p>{BRAND.whatsappDisplay}</p>
        <small>© {new Date().getFullYear()} MORSH Atelier</small>
      </footer>

      <SelectionDrawer />
    </SelectionProvider>
  );
}
