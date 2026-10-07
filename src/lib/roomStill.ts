import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { BUILDERS, type Mats } from "./productModels";
import { applySurfaces } from "./surfaces";
import { LOOKS, bySlug, defaultConfig } from "./products";
import { linenBump, woodGrain } from "./textures";

/**
 * A styled living room made from the real catalogue models, rendered as a still.
 * Because we place every piece ourselves, we know exactly where each one lands on
 * screen, which is what makes "Shop the room" tap targets exact.
 */

export type Spot = { slug: string; x: number; y: number };

type Placed = { slug: string; look: string; at: [number, number]; rot?: number; size?: string };

const PIECES: Placed[] = [
  { slug: "oro-sofa", look: "ivory", at: [0.4, -2.55] },
  { slug: "kora-table", look: "walnut", at: [0.6, 0.35] },
  { slug: "lume-lamp", look: "linen", at: [-2.35, -2.95] },
  { slug: "sela-chair", look: "terracotta", at: [3.7, -0.5], rot: -0.75 },
  { slug: "arc-console", look: "walnut", at: [-5.0, -3.2], size: "m" },
];

export function createRoomStill(canvas: HTMLCanvasElement): { spots: Spot[]; dispose: () => void } {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e8dccb");
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;

  const std = (hex: string, p: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
    new THREE.MeshStandardMaterial({ color: hex, roughness: 0.9, ...p });
  const addShadowed = (m: THREE.Object3D) => {
    m.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    scene.add(m);
  };

  /* ---------- the room ---------- */
  const wall = std("#e4d6c2", { roughness: 1 });
  const floorMat = std("#8d7253", { roughness: 0.42, map: woodGrain() });
  (floorMat.map as THREE.Texture).repeat.set(5, 4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 16), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 1);
  floor.receiveShadow = true;
  scene.add(floor);

  const back = new THREE.Mesh(new THREE.PlaneGeometry(22, 8), wall);
  back.position.set(0, 4, -4);
  back.receiveShadow = true;
  scene.add(back);
  const side = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), wall);
  side.rotation.y = Math.PI / 2;
  side.position.set(-8, 4, 1);
  side.receiveShadow = true;
  scene.add(side);

  // fluted walnut panel behind the sofa
  const slatMat = std("#7a5538", { roughness: 0.55, map: woodGrain() });
  const slatGeo = new THREE.BoxGeometry(0.11, 4.4, 0.13);
  for (let i = 0; i < 30; i++) {
    const s = new THREE.Mesh(slatGeo, slatMat);
    s.position.set(-2.8 + i * 0.2, 2.2, -3.93);
    s.castShadow = true;
    s.receiveShadow = true;
    scene.add(s);
  }
  // arched art, in terracotta with a brass edge
  const arch = new THREE.Shape();
  arch.moveTo(-0.62, 0);
  arch.lineTo(-0.62, 1.5);
  arch.absarc(0, 1.5, 0.62, Math.PI, 0, true);
  arch.lineTo(0.62, 0);
  arch.lineTo(-0.62, 0);
  const archMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(arch, { depth: 0.05, bevelEnabled: false }), std("#c4704a", { roughness: 0.9 }));
  archMesh.position.set(-1.55, 1.6, -3.8);
  archMesh.castShadow = true;
  scene.add(archMesh);
  const archTrim = new THREE.Mesh(new THREE.ExtrudeGeometry(arch, { depth: 0.03, bevelEnabled: false }), std("#b79b6a", { metalness: 1, roughness: 0.3 }));
  archTrim.scale.set(1.08, 1.045, 1);
  archTrim.position.set(-1.55, 1.57, -3.83);
  scene.add(archTrim);

  // a round rug
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.03, 96), std("#d9ccb6", { roughness: 1, bumpMap: linenBump(), bumpScale: 0.6 }));
  rug.position.set(0.4, 0.015, -0.4);
  rug.receiveShadow = true;
  scene.add(rug);

  // pendant globe
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.62, 48, 32), new THREE.MeshStandardMaterial({ color: "#fff6e6", emissive: "#ffe2b8", emissiveIntensity: 0.9, roughness: 0.6 }));
  globe.position.set(0.5, 3.75, -0.6);
  scene.add(globe);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 3.2, 8), std("#b79b6a", { metalness: 1, roughness: 0.3 }));
  cord.position.set(0.5, 5.35, -0.6);
  scene.add(cord);

  // sheer curtain on the right wall
  const sheer = new THREE.Mesh(new RoundedBoxGeometry(0.05, 6.4, 3.2, 2, 0.02), new THREE.MeshStandardMaterial({ color: "#f7f1e6", roughness: 1, transparent: true, opacity: 0.8 }));
  sheer.position.set(9.4, 3.3, -2.2);
  scene.add(sheer);

  /* ---------- light: low warm sun from the right, soft fill ---------- */
  scene.add(new THREE.HemisphereLight("#fff3df", "#6a5640", 0.62));
  const sun = new THREE.DirectionalLight("#ffd8a6", 3.2);
  sun.position.set(9, 5.2, 4);
  sun.target.position.set(-0.5, 0.5, -1.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.left = -9;
  sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -4;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 30;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight("#cfd9ec", 0.55);
  fill.position.set(-6, 4, 7);
  scene.add(fill);
  const glow = new THREE.PointLight("#ffcf94", 14, 12, 1.7);
  glow.position.set(0.5, 3.6, -0.6);
  scene.add(glow);
  const lampGlow = new THREE.PointLight("#ffbf7a", 5, 6, 1.7);
  lampGlow.position.set(-2.35, 2.2, -2.7);
  scene.add(lampGlow);

  /* ---------- the furniture ---------- */
  const toDispose: THREE.Material[] = [];
  const placed: { slug: string; group: THREE.Group }[] = [];
  for (const pc of PIECES) {
    const p = bySlug(pc.slug)!;
    const look = LOOKS[pc.slug].find((l) => l.id === pc.look)!;
    const d = defaultConfig(p);
    const fabric = p.fabrics!.find((x) => x.id === look.fabric)!;
    const frame = p.frames!.find((x) => x.id === look.frame)!;
    const size = p.sizes!.find((x) => x.id === (pc.size ?? d.size))!;
    const a = new THREE.MeshPhysicalMaterial();
    const b = new THREE.MeshPhysicalMaterial();
    applySurfaces(a, b, fabric, frame, p.kind);
    const mats: Mats = {
      a,
      b,
      fixed: (hex, params = {}) => {
        const m = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.6, ...params });
        toDispose.push(m);
        return m;
      },
    };
    toDispose.push(a, b);
    const g = BUILDERS[p.kind](size.w, mats);
    g.position.set(pc.at[0], 0, pc.at[1]);
    g.rotation.y = pc.rot ?? 0;
    addShadowed(g);
    placed.push({ slug: pc.slug, group: g });
  }

  /* ---------- camera ---------- */
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 80);
  const aspect = () => canvas.clientWidth / canvas.clientHeight;
  const frameCamera = () => {
    const a = aspect();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = a;
    // wide screens see the whole room; tall phones lean in on the sofa group
    if (a >= 1.2) {
      camera.fov = 34;
      camera.position.set(-0.3, 2.3, 11);
      camera.lookAt(-0.7, 1.95, -1.6);
    } else {
      camera.fov = 46;
      camera.position.set(0.8, 2.4, 10.4);
      camera.lookAt(0.2, 1.7, -1.6);
    }
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  };
  frameCamera();
  renderer.render(scene, camera);

  // where does each piece land on screen? (percent of the frame)
  const spots: Spot[] = placed.map(({ slug, group }) => {
    const box = new THREE.Box3().setFromObject(group);
    const c = box.getCenter(new THREE.Vector3());
    c.y = box.min.y + (box.max.y - box.min.y) * 0.55;
    const v = c.project(camera);
    return { slug, x: Math.round(((v.x + 1) / 2) * 1000) / 10, y: Math.round(((1 - v.y) / 2) * 1000) / 10 };
  });

  return {
    spots,
    dispose: () => {
      toDispose.forEach((m) => m.dispose());
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
