"use client";

import { useEffect, useRef } from "react";
import { bySlug, defaultConfig } from "@/lib/products";
import { createProductViewer } from "@/lib/productViewer";

declare global {
  interface Window {
    __ready?: boolean;
  }
}

/** A bare studio canvas on a warm backdrop. Config comes from the query string. */
export default function RenderStage({ slug }: { slug: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const p = bySlug(slug)!;
    const q = new URLSearchParams(window.location.search);
    const d = defaultConfig(p);
    const f = p.fabrics!.find((x) => x.id === (q.get("fabric") ?? d.fabric))!;
    const fr = p.frames!.find((x) => x.id === (q.get("frame") ?? d.frame))!;
    const s = p.sizes!.find((x) => x.id === (q.get("size") ?? d.size))!;
    const cv = canvas.current!;
    const v = createProductViewer(
      cv,
      p.kind,
      { fabric: f, frame: fr, w: s.w },
      {
        still: true,
        distance: q.get("distance") ? Number(q.get("distance")) : 1,
        azimuth: q.get("azimuth") ? Number(q.get("azimuth")) : undefined,
      }
    );
    v.resize();
    // let a few frames and the texture uploads settle before the script photographs
    const t = setTimeout(() => (window.__ready = true), 1800);
    return () => {
      clearTimeout(t);
      v.dispose();
    };
  }, [slug]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 50% 38%, #f8f3ea 0%, #ece3d4 62%, #ddd2bf 100%)" }}>
      <canvas ref={canvas} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
