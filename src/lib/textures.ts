import * as THREE from "three";

/**
 * Procedural surface detail, drawn on a canvas, so the models read as cloth and
 * wood instead of flat colour. Greyscale maps are multiplied by the material
 * colour, so one texture serves every colourway.
 */

export type Surface = "boucle" | "velvet" | "linen" | "wood" | "stone" | "metal" | "plain";

/** Pick a surface from a choice's name, e.g. "Ivory bouclé" -> boucle. */
export function surfaceOf(name: string, metal?: boolean): Surface {
  const n = name.toLowerCase();
  if (metal) return "metal";
  if (n.includes("bouclé") || n.includes("boucle")) return "boucle";
  if (n.includes("velvet")) return "velvet";
  if (n.includes("linen")) return "linen";
  if (/(walnut|oak|ebony)/.test(n)) return "wood";
  if (/(travertine|stone|charcoal)/.test(n)) return "stone";
  return "plain";
}

// small seeded PRNG: the same texture every time, so stills are reproducible
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const cache = new Map<string, THREE.CanvasTexture>();

function make(key: string, size: number, draw: (g: CanvasRenderingContext2D, r: () => number) => void, repeat: number) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  draw(g, rng(key.length * 7919));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  cache.set(key, t);
  return t;
}

/** Bouclé: dense little loops. Used as a bump map, so it catches light. */
export const boucleBump = () =>
  make(
    "boucle",
    512,
    (g, r) => {
      g.fillStyle = "#808080";
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 9000; i++) {
        const x = r() * 512;
        const y = r() * 512;
        const rad = 2 + r() * 3.5;
        const v = 150 + r() * 105;
        const grd = g.createRadialGradient(x, y, 0, x, y, rad);
        grd.addColorStop(0, `rgb(${v},${v},${v})`);
        grd.addColorStop(1, "rgba(128,128,128,0)");
        g.fillStyle = grd;
        g.beginPath();
        g.arc(x, y, rad, 0, Math.PI * 2);
        g.fill();
      }
    },
    5
  );

/** Linen: a fine woven grid. */
export const linenBump = () =>
  make(
    "linen",
    256,
    (g, r) => {
      g.fillStyle = "#808080";
      g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 256; i += 2) {
        const a = 110 + r() * 60;
        g.fillStyle = `rgba(${a},${a},${a},0.7)`;
        g.fillRect(i, 0, 1, 256);
        const b = 110 + r() * 60;
        g.fillStyle = `rgba(${b},${b},${b},0.7)`;
        g.fillRect(0, i, 256, 1);
      }
    },
    10
  );

/** Wood: long streaks of grain, as a colour multiplier. */
export const woodGrain = () =>
  make(
    "wood",
    512,
    (g, r) => {
      g.fillStyle = "#e6e6e6";
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 160; i++) {
        const y = r() * 512;
        const w = 0.6 + r() * 2.4;
        const v = 150 + r() * 80;
        g.strokeStyle = `rgba(${v},${v},${v},${0.18 + r() * 0.3})`;
        g.lineWidth = w;
        g.beginPath();
        g.moveTo(0, y);
        const wob = 2 + r() * 6;
        for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x * 0.02 + i) * wob);
        g.stroke();
      }
    },
    1.6
  );

/** Stone: soft mottling. */
export const stoneMottle = () =>
  make(
    "stone",
    512,
    (g, r) => {
      g.fillStyle = "#ececec";
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 1400; i++) {
        const x = r() * 512;
        const y = r() * 512;
        const rad = 3 + r() * 22;
        const v = 190 + r() * 55;
        const grd = g.createRadialGradient(x, y, 0, x, y, rad);
        grd.addColorStop(0, `rgba(${v},${v},${v},0.25)`);
        grd.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grd;
        g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
    },
    1.2
  );
