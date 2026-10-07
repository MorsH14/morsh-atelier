"use client";

import { useEffect, useRef } from "react";
import { createRoomStill, type Spot } from "@/lib/roomStill";

declare global {
  interface Window {
    __ready?: boolean;
    __spots?: Spot[];
  }
}

export default function RenderRoom() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const r = createRoomStill(canvas.current!);
    window.__spots = r.spots;
    const t = setTimeout(() => (window.__ready = true), 1500);
    return () => {
      clearTimeout(t);
      r.dispose();
    };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <canvas ref={canvas} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
