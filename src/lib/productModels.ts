import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Kind } from "./products";

/**
 * Parametric furniture models. Scene units: 1 unit ≈ 60 cm.
 * Every builder takes the customer's size `w` plus two shared materials:
 *   a = the main surface (fabric, wood top, linen shade …)
 *   b = the secondary part (feet, base, pulls, frame …)
 * and returns a Group sitting on y = 0. Models are rebuilt (not scaled) when the
 * size changes, so proportions and details (cushion count, flutes) stay correct.
 */

export type Mats = {
  a: THREE.MeshStandardMaterial;
  b: THREE.MeshStandardMaterial;
  /** Fixed-colour materials a builder needs (brass trim, mattress …). Disposed by the viewer. */
  fixed: (hex: string, p?: Partial<THREE.MeshStandardMaterialParameters>) => THREE.MeshStandardMaterial;
};

type Builder = (w: number, m: Mats) => THREE.Group;

const rbox = (w: number, h: number, d: number, r: number, mat: THREE.Material, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)), mat);
  m.position.set(x, y, z);
  return m;
};
const cyl = (rt: number, rb: number, h: number, mat: THREE.Material, x = 0, y = 0, z = 0, seg = 48) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z);
  return m;
};

const sofa: Builder = (w, { a, b }) => {
  const g = new THREE.Group();
  g.add(
    rbox(w, 0.5, 1.45, 0.16, a, 0, 0.55),
    rbox(w, 0.95, 0.5, 0.2, a, 0, 1.0, -0.5),
    rbox(0.42, 0.78, 1.45, 0.18, a, -(w / 2 - 0.2), 0.76),
    rbox(0.42, 0.78, 1.45, 0.18, a, w / 2 - 0.2, 0.76)
  );
  const n = w < 3.2 ? 2 : w < 4.1 ? 3 : 4;
  const cw = (w - 0.7) / n;
  for (let i = 0; i < n; i++) g.add(rbox(cw - 0.02, 0.26, 1.0, 0.12, a, (i - (n - 1) / 2) * cw, 0.93, 0.12));
  const xs = w > 4 ? [-(w / 2 - 0.2), 0, w / 2 - 0.2] : [-(w / 2 - 0.2), w / 2 - 0.2];
  for (const x of xs) for (const z of [-0.5, 0.5]) g.add(cyl(0.04, 0.025, 0.28, b, x, 0.14, z, 20));
  return g;
};

/** w = tabletop radius */
const table: Builder = (r, { a, b, fixed }) => {
  const g = new THREE.Group();
  const trim = fixed("#b79b6a", { metalness: 1, roughness: 0.28 });
  const h = 0.66;
  g.add(cyl(r, r, 0.07, a, 0, h - 0.035, 0, 72));
  g.add(cyl(r + 0.005, r + 0.005, 0.012, trim, 0, h - 0.07, 0, 72));
  const drum = cyl(r * 0.52, r * 0.6, h - 0.08, b, 0, (h - 0.08) / 2, 0, 56);
  g.add(drum);
  return g;
};

/** w = overall height */
const lamp: Builder = (H, { a, b }) => {
  const g = new THREE.Group();
  const shadeH = 0.78;
  g.add(cyl(0.3, 0.3, 0.04, b, 0, 0.02, 0, 48));
  g.add(cyl(0.022, 0.022, H - shadeH, b, 0, (H - shadeH) / 2 + 0.02, 0, 16));
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, shadeH, 56, 1, true), a);
  (shade.material as THREE.Material).side = THREE.DoubleSide;
  shade.position.set(0, H - shadeH / 2, 0);
  g.add(shade);
  g.add(cyl(0.05, 0.05, 0.05, b, 0, H - shadeH * 0.5, 0, 16));
  const light = new THREE.PointLight("#ffc98a", 6, 7, 1.6);
  light.position.set(0, H - shadeH * 0.5, 0);
  g.add(light);
  return g;
};

/** w = seat width */
const chair: Builder = (w, { a, b }) => {
  const g = new THREE.Group();
  g.add(cyl(0.07, 0.07, 0.36, b, 0, 0.2, 0, 20));
  g.add(cyl(0.52, 0.55, 0.05, b, 0, 0.025, 0, 56));
  g.add(rbox(w, 0.34, 1.25, 0.15, a, 0, 0.5));
  g.add(rbox(w + 0.2, 0.95, 0.4, 0.2, a, 0, 0.95, -0.55));
  g.add(rbox(0.38, 0.62, 1.1, 0.17, a, -(w / 2 + 0.02), 0.78, -0.05));
  g.add(rbox(0.38, 0.62, 1.1, 0.17, a, w / 2 + 0.02, 0.78, -0.05));
  g.add(rbox(w - 0.3, 0.2, 0.95, 0.1, a, 0, 0.78, 0.12));
  return g;
};

/** w = bed width */
const bed: Builder = (w, { a, b, fixed }) => {
  const g = new THREE.Group();
  const linen = fixed("#ece6da", { roughness: 1 });
  const duvet = fixed("#d6cdbd", { roughness: 1 });
  const L = 3.35;
  g.add(rbox(w + 0.12, 0.3, L + 0.1, 0.05, b, 0, 0.28, 0.02));
  g.add(rbox(w - 0.2, 0.16, L - 0.3, 0.04, fixed("#1a1816", { roughness: 0.8 }), 0, 0.1, 0.02));
  g.add(rbox(w, 0.4, L - 0.1, 0.12, linen, 0, 0.63, 0.05));
  g.add(rbox(w + 0.02, 0.1, L * 0.62, 0.06, duvet, 0, 0.86, 0.5));
  const hb = rbox(w + 0.2, 1.6, 0.22, 0.08, a, 0, 0.95, -L / 2 - 0.02);
  g.add(hb);
  const ribs = Math.round(w / 0.5);
  const rw = (w + 0.1) / ribs;
  for (let i = 0; i < ribs; i++)
    g.add(rbox(rw - 0.05, 1.42, 0.07, 0.03, a, (i - (ribs - 1) / 2) * rw, 0.95, -L / 2 + 0.12));
  const pn = w > 3 ? 3 : 2;
  for (let i = 0; i < pn; i++) {
    const p = rbox(w / pn - 0.12, 0.2, 0.62, 0.1, linen, (i - (pn - 1) / 2) * (w / pn), 0.93, -L / 2 + 0.55);
    p.rotation.x = -0.14;
    g.add(p);
  }
  return g;
};

/** w = overall width */
const console_: Builder = (w, { a, b }) => {
  const g = new THREE.Group();
  const D = 0.66;
  const baseY = 0.28;
  const H = 0.98;
  g.add(rbox(w, H, D, 0.03, a, 0, baseY + H / 2));
  g.add(rbox(w - 0.1, 0.05, D - 0.08, 0.01, b, 0, baseY - 0.02));
  const n = Math.round((w - 0.12) / 0.075);
  const sw = (w - 0.12) / n;
  for (let i = 0; i < n; i++)
    g.add(rbox(sw - 0.014, H - 0.1, 0.045, 0.018, a, (i - (n - 1) / 2) * sw, baseY + H / 2, D / 2 + 0.012));
  for (const x of [-0.12, 0.12]) g.add(rbox(0.03, 0.5, 0.04, 0.012, b, x, baseY + H / 2, D / 2 + 0.06));
  for (const x of [-(w / 2 - 0.12), w / 2 - 0.12])
    for (const z of [-(D / 2 - 0.1), D / 2 - 0.1]) g.add(cyl(0.035, 0.025, baseY, b, x, baseY / 2, z, 16));
  return g;
};

export const BUILDERS: Record<Kind, Builder> = { sofa, table, lamp, chair, bed, console: console_ };
