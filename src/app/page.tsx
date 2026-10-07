import Image from "next/image";
import BriefForm from "@/components/BriefForm";
import Collection from "@/components/Collection";
import HeroStage from "@/components/HeroStage";
import Shell from "@/components/Shell";
import ShopTheRoom from "@/components/ShopTheRoom";
import TryIt from "@/components/TryIt";
import { ABOUT, FAQ, PROMISES, TESTIMONIALS } from "@/lib/content";
import { PRODUCTS, stillOf } from "@/lib/products";
import { surfaceOf } from "@/lib/textures";

const MARQUEE = [
  "Designed in 3D first",
  "Made to order in Nigeria",
  "Your cloth, your finish",
  "A free 3D concept of your room",
  "See it before you buy it",
];

const PROCESS = [
  ["Tell me about your space", "A short chat on WhatsApp: your room, how you live, what you want it to feel like. Free."],
  ["See it in 3D", "I model your room and send concepts with real layouts, materials and lighting."],
  ["Adjust until it's right", "Change anything. When you love it, you get a clear, itemised price with no surprises."],
  ["We make it and set it up", "Your pieces are made, delivered and placed. The room you approved is the room you get."],
];

const SURFACE_LABEL = { boucle: "Bouclé", velvet: "Velvet", linen: "Linen", wood: "Solid wood", stone: "Stone", metal: "Metal", plain: "Finish" } as const;

/** Every distinct cloth and finish across the collection, for the swatch library. */
function materials() {
  const seen = new Map<string, { name: string; hex: string; kind: keyof typeof SURFACE_LABEL }>();
  for (const p of PRODUCTS)
    for (const c of [...(p.fabrics ?? []), ...(p.frames ?? [])])
      if (!seen.has(c.name)) seen.set(c.name, { name: c.name, hex: c.hex, kind: surfaceOf(c.name, c.metal) });
  return [...seen.values()];
}

const Pill = ({ src, pos = "50% 58%" }: { src: string; pos?: string }) => (
  <span className="pill" aria-hidden>
    <Image src={src} alt="" fill sizes="240px" style={{ objectFit: "cover", objectPosition: pos }} />
  </span>
);

export default function Home() {
  const mats = materials();
  return (
    <Shell>
      <main>
        <HeroStage />

        <div className="marquee" aria-hidden>
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <div className="marquee-item" key={k}>
                {MARQUEE.map((t) => (
                  <span key={t} style={{ display: "contents" }}>
                    <span>{t}</span>
                    <i>◆</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="statement wrap">
          <div>
            <p className="eyebrow reveal">Why people choose us</p>
            <p className="statement-text reveal">
              A room should feel <Pill src={stillOf("oro-sofa", "ivory")} /> effortless, <Pill src={stillOf("sela-chair", "terracotta")} pos="50% 50%" /> warm,
              and entirely <Pill src={stillOf("kora-table", "walnut")} /> <em>yours.</em>
            </p>
            <p className="statement-foot reveal">
              We show you exactly how it will look, in 3D, before a single piece is made. No guessing, no surprises.
            </p>
          </div>
          <figure className="statement-img reveal-img">
            <Image src="/room/living-m.jpg" alt="A living room modelled in 3D, with a cream sofa and a terracotta chair" fill sizes="(max-width: 1020px) 80vw, 33vw" />
          </figure>
        </section>

        <section id="room" className="room-sec wrap">
          <div className="section-head">
            <p className="eyebrow reveal">Shop the room</p>
            <h2 className="h2 reveal">
              Every piece you see <em>is for sale.</em>
            </h2>
          </div>
          <div className="reveal-img">
            <ShopTheRoom />
          </div>
          <p className="room-caption reveal">
            <span>A living room, modelled in our studio.</span>
            <span>Tap a piece to turn it around in 3D.</span>
          </p>
        </section>

        <section id="collections" className="wrap section" style={{ paddingTop: 0 }}>
          <Collection products={PRODUCTS} />
          <p className="grid-note reveal">
            Save the pieces you like, then send them to me on WhatsApp. Nothing is charged. We&rsquo;ll talk sizes,
            fabrics and delivery, and you decide.
          </p>
        </section>

        <section className="try dark section">
          <div className="wrap">
            <TryIt />
          </div>
        </section>

        <section id="materials" className="wrap section">
          <div className="section-head">
            <p className="eyebrow reveal">Fabrics &amp; finishes</p>
            <h2 className="h2 reveal">Choose what it&rsquo;s made of.</h2>
          </div>
          <div className="mats">
            {mats.map((m, i) => (
              <div key={m.name} className="mat reveal" style={{ ["--d" as string]: `${(i % 6) * 60}ms` }}>
                <div className={`mat-chip ${m.kind}`} style={{ backgroundColor: m.hex }} />
                <b>{m.name}</b>
                <small>{SURFACE_LABEL[m.kind]}</small>
              </div>
            ))}
          </div>
          <p className="mats-note reveal">
            Swatches are shown on screen, so colours vary a little between devices. For anything you&rsquo;re unsure of,
            we&rsquo;ll send you a physical sample before you decide.
          </p>
        </section>

        <section id="process" className="alt section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow reveal">How it works</p>
              <h2 className="h2 reveal">Four simple steps.</h2>
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
          </div>
        </section>

        <section id="about" className="section">
          <div className="wrap about-grid">
            <figure className="about-img reveal-img">
              <Image src="/room/living-m.jpg" alt="A living room modelled in the MORSH Atelier studio" fill sizes="(max-width: 1020px) 100vw, 42vw" />
              <figcaption>Modelled in our studio</figcaption>
            </figure>
            <div className="about-copy">
              <p className="eyebrow reveal">Meet the maker</p>
              <h2 className="h2 reveal">{ABOUT.heading}</h2>
              {ABOUT.paragraphs.map((p) => (
                <p key={p} className="about-p reveal">
                  {p}
                </p>
              ))}
              <p className="about-sign reveal">{ABOUT.signoff}</p>
              <ul className="facts reveal">
                {ABOUT.facts.map(([a, b]) => (
                  <li key={a}>
                    <b>{a}</b>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="promise" className="alt section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow reveal">Our promise</p>
              <h2 className="h2 reveal">You&rsquo;re in control, every step.</h2>
            </div>
            <ul className="promises">
              {PROMISES.map((p) => (
                <li key={p.t} className="promise reveal">
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="quotes">
          <div className="wrap">
            <ul className="quote-list">
              {TESTIMONIALS.map((t) => (
                <li key={t.q} className="quote reveal">
                  <p>“{t.q}”</p>
                  <small>
                    {t.who} · {t.place}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="faq" className="wrap section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <p className="eyebrow reveal">Good questions</p>
            <h2 className="h2 reveal">Before you reach out.</h2>
          </div>
          <div className="faq reveal">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="cta dark">
          <div className="wrap cta-grid">
            <div className="cta-copy">
              <p className="eyebrow reveal">Start here · free</p>
              <h2 className="display reveal">
                Tell me about <em>your room.</em>
              </h2>
              <p className="cta-sub reveal">
                Share a few details and I&rsquo;ll reply on WhatsApp with ideas and a free 3D concept. No pressure, no
                obligation.
              </p>
            </div>
            <div className="reveal">
              <BriefForm />
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}
