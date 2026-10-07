import * as THREE from "three";
import { boucleBump, linenBump, stoneMottle, surfaceOf, woodGrain } from "./textures";
import type { Choice, Kind } from "./products";

/**
 * Dresses the two shared materials of a model (a = main surface, b = secondary)
 * with the customer's choices: weave, grain, sheen and metal. Used by the live
 * viewer, the catalogue stills and the styled room render, so a piece looks the
 * same everywhere.
 */
export function applySurfaces(
  matA: THREE.MeshPhysicalMaterial,
  matB: THREE.MeshPhysicalMaterial,
  fabric: Choice,
  frame: Choice,
  kind: Kind
) {
  // ---- main surface
  const surf = surfaceOf(fabric.name, fabric.metal);
  matA.color.set(fabric.hex);
  matA.roughness = fabric.rough ?? 1;
  matA.metalness = fabric.metal ? 1 : 0;
  matA.map = surf === "wood" ? woodGrain() : surf === "stone" ? stoneMottle() : null;
  matA.bumpMap = surf === "boucle" ? boucleBump() : surf === "linen" ? linenBump() : null;
  matA.bumpScale = surf === "boucle" ? 2.2 : surf === "linen" ? 0.7 : 0;
  matA.sheen = surf === "velvet" || surf === "boucle" || surf === "linen" ? 1 : 0;
  matA.sheenRoughness = surf === "velvet" ? 0.4 : 0.8;
  // the sheen takes the cloth's own colour: a white sheen veils dark velvets in grey
  matA.sheenColor.set(fabric.hex).multiplyScalar(surf === "velvet" ? 1.1 : 0.8);
  // cloth barely reflects: without this, dark velvets look chalky under a bright studio
  matA.specularIntensity = surf === "velvet" ? 0.12 : surf === "boucle" || surf === "linen" ? 0.2 : 0.6;
  matA.clearcoat = surf === "wood" ? 0.22 : 0;
  matA.clearcoatRoughness = 0.4;
  // a lampshade glows: it is lit from inside
  matA.emissive.set(kind === "lamp" ? fabric.hex : "#000000");
  matA.emissiveIntensity = kind === "lamp" ? 0.85 : 0;
  matA.needsUpdate = true;
  // ---- secondary part
  const surfB = surfaceOf(frame.name, frame.metal);
  matB.color.set(frame.hex);
  matB.metalness = frame.metal ? 1 : 0;
  matB.roughness = frame.rough ?? 0.5;
  matB.map = surfB === "wood" ? woodGrain() : surfB === "stone" ? stoneMottle() : null;
  matB.clearcoat = surfB === "wood" ? 0.22 : 0;
  matB.needsUpdate = true;
}
