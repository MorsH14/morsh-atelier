import BriefForm from "@/components/BriefForm";
import HeroStage from "@/components/HeroStage";
import Nav from "@/components/Nav";
import ProductCard from "@/components/ProductCard";
import SelectionDrawer from "@/components/SelectionDrawer";
import SmoothScroll from "@/components/SmoothScroll";
import Reveal from "@/components/Reveal";
import WhatsAppFab from "@/components/WhatsAppFab";
import { SelectionProvider } from "@/context/Selection";
import { BRAND } from "@/lib/brand";
import { ABOUT, FAQ, PROJECTS, PROMISES, TESTIMONIALS } from "@/lib/content";
import { PRODUCTS } from "@/lib/products";

const SERVICES = [
  {
    n: "01",
    t: "See it before you buy it",
    d: "We build your room in 3D so you can walk through it, swap fabrics, move the sofa, and change your mind as often as you need to. It costs nothing to start.",
  },
  {
    n: "02",
    t: "Furniture made for your space",
    d: "Sofas, beds, consoles and tables made to order by skilled makers, sized to your room, in the finishes you choose.",
  },
  {
    n: "03",
    t: "The whole room, handled",
    d: "From layout and lighting to the last cushion. You talk to one person, and the room comes together as one.",
  },
];

const PROCESS = [
  ["Tell me about your space", "A short chat on WhatsApp: your room, how you live, what you want it to feel like. Free."],
  ["See it in 3D", "I model your room and send concepts with real layouts, materials and lighting."],
  ["Adjust until it's right", "Change anything. When you love it, you get a clear, itemised price with no surprises."],
  ["We make it and set it up", "Your pieces are made, delivered and placed. The room you approved is the room you get."],
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
          <p className="eyebrow reveal">Why people choose us</p>
          <p className="manifesto-text reveal">
            A beautiful room shouldn&rsquo;t be a gamble. We show you <em>exactly</em> how it will look, in 3D, before a single
            piece is made.
          </p>
        </section>

        <section id="services" className="services section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow reveal">What we do</p>
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

        <section id="collections" className="wrap section">
          <div className="section-head">
            <p className="eyebrow reveal">The collection</p>
            <h2 className="h2 reveal">Made to order, priced for real life.</h2>
          </div>
          <div className="grid">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
          <p className="grid-note reveal">
            Save the pieces you like, then send them to me on WhatsApp. Nothing is charged. We&rsquo;ll talk sizes, fabrics
            and delivery, and you decide.
          </p>
        </section>

        <section id="about" className="about section">
          <div className="wrap about-grid">
            <div className="ph ph-portrait reveal" role="img" aria-label="Portrait of MorsH">
              <span>{ABOUT.photoNote}</span>
            </div>
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

        <section id="projects" className="wrap section">
          <div className="section-head">
            <p className="eyebrow reveal">Recent rooms</p>
            <h2 className="h2 reveal">From render to real life.</h2>
          </div>
          <div className="projects">
            {PROJECTS.map((p) => (
              <article key={p.id} className="project reveal">
                <div className="ba">
                  <div className="ph" role="img" aria-label={`${p.title}, 3D concept`}>
                    <span>3D concept</span>
                  </div>
                  <div className="ph ph-b" role="img" aria-label={`${p.title}, finished room`}>
                    <span>Finished room</span>
                  </div>
                </div>
                <div className="project-copy">
                  <h3>{p.title}</h3>
                  <small>{p.place}</small>
                  <p>{p.brief}</p>
                  <p className="project-res">{p.result}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="services section">
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

        <section id="promise" className="wrap section">
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
        </section>

        <section className="quotes section">
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

        <section id="faq" className="wrap section">
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

        <section id="contact" className="cta">
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

      <footer className="foot wrap">
        <div className="logo">
          {BRAND.name}
          <span>{BRAND.suffix}</span>
        </div>
        <p>{BRAND.tagline}</p>
        <p>WhatsApp {BRAND.whatsappDisplay}</p>
        <small>© {new Date().getFullYear()} MORSH Atelier</small>
      </footer>

      <WhatsAppFab />
      <SelectionDrawer />
    </SelectionProvider>
  );
}
