"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createRoomScene, type RoomScene } from "@/lib/roomScene";
import { generalEnquiryUrl } from "@/lib/whatsapp";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    n: "I",
    title: "The shell",
    body: "Every room begins as nothing: concrete, cold light, and a lot of possibility.",
    range: [0.04, 0.26],
  },
  {
    n: "II",
    title: "The composition",
    body: "Each piece is drawn, modelled and placed in 3D before a single board is cut.",
    range: [0.3, 0.52],
  },
  {
    n: "III",
    title: "The finish",
    body: "Materials warm, lamps ignite, daylight arrives. This is the room you will live in.",
    range: [0.62, 0.9],
  },
];

export default function HeroStage() {
  const wrap = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const chapterEls = useRef<(HTMLDivElement | null)[]>([]);
  const introEl = useRef<HTMLDivElement>(null);
  const outroEl = useRef<HTMLDivElement>(null);
  const barEl = useRef<HTMLSpanElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;

    let room: RoomScene | null = null;
    try {
      room = createRoomScene(cv, { lowPower, reducedMotion: reduced });
    } catch {
      setFallback(true);
      return;
    }

    const paint = (p: number) => {
      room?.setProgress(p);
      if (barEl.current) barEl.current.style.transform = `scaleX(${p})`;

      if (introEl.current) {
        const k = Math.max(0, 1 - p / 0.06);
        introEl.current.style.opacity = String(k);
        introEl.current.style.transform = `translateY(${(1 - k) * -30}px)`;
      }
      CHAPTERS.forEach((c, i) => {
        const el = chapterEls.current[i];
        if (!el) return;
        const [a, b] = c.range;
        const fade = 0.035;
        const k = Math.max(0, Math.min(1, Math.min((p - a) / fade, (b - p) / fade)));
        el.style.opacity = String(k);
        el.style.transform = `translateY(${(1 - k) * 26}px)`;
        el.style.pointerEvents = k > 0.5 ? "auto" : "none";
      });
      if (outroEl.current) {
        const k = Math.max(0, Math.min(1, (p - 0.92) / 0.06));
        outroEl.current.style.opacity = String(k);
        outroEl.current.style.transform = `translateY(${(1 - k) * 26}px)`;
        outroEl.current.style.pointerEvents = k > 0.5 ? "auto" : "none";
      }
    };

    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => paint(self.progress),
    });
    paint(reduced ? 1 : 0);

    const onResize = () => room?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
      room?.dispose();
    };
  }, []);

  return (
    <section ref={wrap} className="stage" id="top" aria-label="A room transforming as you scroll">
      <div className="stage-sticky">
        {fallback ? <div className="stage-fallback" /> : <canvas ref={canvas} className="stage-canvas" />}
        <div className="stage-vignette" />

        <div ref={introEl} className="stage-intro">
          <p className="eyebrow">Interior design · Bespoke furniture · 3D visualisation</p>
          <h1 className="display">
            See your room<br />
            <em>before it exists.</em>
          </h1>
          <p className="scroll-cue">
            <span /> Scroll
          </p>
        </div>

        {CHAPTERS.map((c, i) => (
          <div
            key={c.n}
            ref={(el) => {
              chapterEls.current[i] = el;
            }}
            className="chapter"
            style={{ opacity: 0 }}
          >
            <span className="chapter-n">{c.n}</span>
            <h2 className="chapter-t">{c.title}</h2>
            <p className="chapter-b">{c.body}</p>
          </div>
        ))}

        <div ref={outroEl} className="stage-outro" style={{ opacity: 0 }}>
          <a className="btn btn-solid" href="#collections">
            Explore the collection
          </a>
          <a className="btn btn-ghost" href={generalEnquiryUrl("Hello MORSH Atelier, I'd like to start a room.")} target="_blank" rel="noreferrer">
            Start your room on WhatsApp
          </a>
        </div>

        <div className="stage-progress" aria-hidden="true">
          <span ref={barEl} />
        </div>
      </div>
    </section>
  );
}
