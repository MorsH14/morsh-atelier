"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSelection } from "@/context/Selection";
import { PROMISES } from "@/lib/content";
import { GALLERY } from "@/lib/gallery";
import { bySlug, defaultConfig, describeConfig, isConfigurable, naira, priceFor, type Config } from "@/lib/products";
import { createProductViewer, hasModel, type Viewer, type ViewName } from "@/lib/productViewer";
import { generalEnquiryUrl } from "@/lib/whatsapp";
import Plate from "./Plate";

const VIEWS: [ViewName, string][] = [
  ["angle", "Angle"],
  ["front", "Front"],
  ["side", "Side"],
  ["back", "Back"],
  ["detail", "Detail"],
];

export default function ProductConfigurator({ slug }: { slug: string }) {
  const p = bySlug(slug)!;
  const live = isConfigurable(p) && hasModel(p.kind);
  const { add, has } = useSelection();

  const [cfg, setCfg] = useState<Config>(() => defaultConfig(p));
  const [view, setView] = useState<ViewName>("angle");
  const [added, setAdded] = useState(false);
  const [mode, setMode] = useState<"3d" | "photos">("3d");
  const [shot, setShot] = useState(0);
  const photos = GALLERY[p.id] ?? [];

  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const initial = useRef(cfg);

  const fabric = p.fabrics?.find((x) => x.id === cfg.fabric);
  const frame = p.frames?.find((x) => x.id === cfg.frame);
  const size = p.sizes?.find((x) => x.id === cfg.size);
  const price = priceFor(p, live ? cfg : undefined);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !live) return;
    const c = initial.current;
    const f = p.fabrics!.find((x) => x.id === c.fabric)!;
    const fr = p.frames!.find((x) => x.id === c.frame)!;
    const s = p.sizes!.find((x) => x.id === c.size)!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
    try {
      viewer.current = createProductViewer(cv, p.kind, { fabric: f, frame: fr, w: s.w }, { lowPower, reducedMotion: reduced });
    } catch {
      stage.current?.classList.add("no-3d");
      return;
    }
    const onResize = () => viewer.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      viewer.current?.dispose();
      viewer.current = null;
    };
  }, [p, live]);

  useEffect(() => {
    if (!fabric || !frame || !size) return;
    viewer.current?.setConfig({ fabric, frame, w: size.w });
  }, [fabric, frame, size]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(t);
  }, [added]);

  useEffect(() => {
    if (mode === "3d") viewer.current?.resize();
  }, [mode]);

  const pick = (v: ViewName) => {
    setView(v);
    viewer.current?.setView(v);
  };

  const addToSelection = () => {
    add(p.id, live ? cfg : undefined);
    setAdded(true);
  };

  const spec = describeConfig(p, live ? cfg : undefined);
  const ask = generalEnquiryUrl(
    `Hello MORSH Atelier, I have a question about the ${p.name} (${p.ref})${spec ? `: ${spec}` : ""}.`
  );

  return (
    <>
      <div className="pdp wrap">
        <div className={`pdp-stage ${mode === "photos" ? "photos" : ""}`} ref={stage}>
          {live && <canvas ref={canvas} className="pdp-canvas" aria-label={`Interactive 3D view of the ${p.name}`} />}
          <div className="pdp-fallback">
            <Plate kind={p.kind} />
          </div>
          {live && photos.length > 0 && (
            <div className="pdp-mode" role="group" aria-label="View type">
              <button className={mode === "3d" ? "on" : ""} onClick={() => setMode("3d")} aria-pressed={mode === "3d"}>
                3D · your choices
              </button>
              <button className={mode === "photos" ? "on" : ""} onClick={() => setMode("photos")} aria-pressed={mode === "photos"}>
                Photos · {photos.length}
              </button>
            </div>
          )}
          {live && mode === "3d" && (
            <>
              <p className="pdp-hint">Drag to turn it around</p>
              <div className="pdp-views" role="group" aria-label="Camera views">
                {VIEWS.map(([v, label]) => (
                  <button key={v} className={view === v ? "on" : ""} onClick={() => pick(v)} aria-pressed={view === v}>
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
          {mode === "photos" && photos[shot] && (
            <div className="pdp-photos">
              <Image
                key={photos[shot].src}
                src={photos[shot].src}
                alt={photos[shot].alt}
                fill
                sizes="(max-width: 1020px) 100vw, 58vw"
                className="pdp-photo"
                priority
              />
              <p className="pdp-photo-note">
                {photos[shot].own ? "Our work" : "Styling inspiration, not this exact piece. Yours is made in the finish you choose in 3D."}
                {photos[shot].credit && <small> Photo: {photos[shot].credit} / Unsplash</small>}
              </p>
              {photos.length > 1 && (
                <div className="pdp-thumbs">
                  {photos.map((ph, i) => (
                    <button key={ph.src} className={i === shot ? "on" : ""} onClick={() => setShot(i)} aria-label={`Photo ${i + 1}`} aria-pressed={i === shot}>
                      <Image src={ph.src} alt="" width={64} height={64} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <p className="eyebrow">
            {p.collection} · {p.ref}
          </p>
          <h1 className="pdp-title">{p.name}</h1>
          <p className="pdp-price">
            {naira(price)}
            <small>Made for you · ready in {p.lead}</small>
          </p>
          <p className="pdp-blurb">{p.blurb}</p>

          {live && fabric && frame && size ? (
            <div className="opts">
              <fieldset className="opt">
                <legend>
                  {p.fabricLabel} <b>{fabric.name}</b>
                  {fabric.delta > 0 && <em> +{naira(fabric.delta)}</em>}
                </legend>
                <div className="swatches">
                  {p.fabrics!.map((c) => (
                    <button
                      key={c.id}
                      className={`sw ${cfg.fabric === c.id ? "on" : ""}`}
                      style={{ background: c.hex }}
                      onClick={() => setCfg((x) => ({ ...x, fabric: c.id }))}
                      aria-label={`${c.name}${c.delta ? `, plus ${naira(c.delta)}` : ""}`}
                      aria-pressed={cfg.fabric === c.id}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="opt">
                <legend>
                  {p.frameLabel} <b>{frame.name}</b>
                  {frame.delta > 0 && <em> +{naira(frame.delta)}</em>}
                </legend>
                <div className="swatches">
                  {p.frames!.map((c) => (
                    <button
                      key={c.id}
                      className={`sw ${cfg.frame === c.id ? "on" : ""}`}
                      style={{ background: c.hex }}
                      onClick={() => setCfg((x) => ({ ...x, frame: c.id }))}
                      aria-label={`${c.name}${c.delta ? `, plus ${naira(c.delta)}` : ""}`}
                      aria-pressed={cfg.frame === c.id}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="opt">
                <legend>
                  {p.sizeLabel ?? "Size"} <b>{size.name}</b>
                  <em> {size.dims}</em>
                </legend>
                <div className="sizes">
                  {p.sizes!.map((s) => (
                    <button
                      key={s.id}
                      className={cfg.size === s.id ? "on" : ""}
                      onClick={() => setCfg((x) => ({ ...x, size: s.id }))}
                      aria-pressed={cfg.size === s.id}
                    >
                      <span>{s.name}</span>
                      <small>{s.delta === 0 ? "Base price" : `${s.delta > 0 ? "+" : "−"}${naira(Math.abs(s.delta))}`}</small>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          ) : (
            <p className="pdp-soon">The interactive 3D view for this piece is coming soon. Add it to your selection and we&rsquo;ll show you the exact finish in 3D before anything is made.</p>
          )}

          <div className="pdp-buy">
            <button className="btn btn-solid btn-block" onClick={addToSelection}>
              {added ? "Added ✓ — view your selection" : has(p.id) ? "Add another to selection" : "Add to my selection"}
            </button>
            <a className="pdp-ask" href={ask} target="_blank" rel="noreferrer">
              Questions? Ask MorsH about this piece
            </a>
          </div>

          <ul className="pdp-assure">
            {PROMISES.slice(0, 3).map((a) => (
              <li key={a.t}>
                <b>{a.t}</b>
                <span>{a.d}</span>
              </li>
            ))}
          </ul>

          <dl className="pdp-spec">
            <div>
              <dt>Materials</dt>
              <dd>{p.material}</dd>
            </div>
            {size && (
              <div>
                <dt>Dimensions</dt>
                <dd>{size.dims}</dd>
              </div>
            )}
            <div>
              <dt>Lead time</dt>
              <dd>{p.lead}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="pdp-bar" aria-hidden={false}>
        <div>
          <b>{p.name}</b>
          <small>{spec || p.material}</small>
        </div>
        <span className="pdp-bar-price">{naira(price)}</span>
        <button className="btn btn-solid" onClick={addToSelection}>
          {added ? "Added ✓" : "Add to selection"}
        </button>
      </div>
    </>
  );
}
