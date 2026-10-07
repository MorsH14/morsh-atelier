import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { BUILDERS, type Mats } from "./productModels";
import { applySurfaces } from "./surfaces";
import type { Choice, Kind } from "./products";

/**
 * Product viewer: one piece on a studio floor that the customer can orbit,
 * re-colour and re-size. The model itself comes from productModels.ts.
 */

export type ViewConfig = { fabric: Choice; frame: Choice; w: number };
export type ViewName = "angle" | "front" | "side" | "back" | "detail";
export type Viewer = {
  setConfig: (c: ViewConfig) => void;
  setView: (v: ViewName) => void;
  resize: () => void;
  dispose: () => void;
};
export type ViewerOptions = {
  lowPower?: boolean;
  reducedMotion?: boolean;
  /** Catalogue still: fixed camera, no rotation, no controls. */
  still?: boolean;
  /** Multiplier on the camera distance (below 1 = closer). */
  distance?: number;
  /** Camera azimuth in degrees for stills (0 = straight on). */
  azimuth?: number;
};

export const hasModel = (kind: Kind) => kind in BUILDERS;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createProductViewer(
  canvas: HTMLCanvasElement,
  kind: Kind,
  initial: ViewConfig,
  opts: ViewerOptions = {}
): Viewer {
  if (!hasModel(kind)) throw new Error(`No 3D model for "${kind}" yet`);
  const { lowPower = false, reducedMotion = false, still = false, distance = 1, azimuth } = opts;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.4;

  scene.add(new THREE.HemisphereLight("#fff4e4", "#2a221a", 0.42));
  const key = new THREE.DirectionalLight("#ffe2bd", 2.0);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  key.shadow.radius = 5;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#9fb4d4", 0.7);
  rim.position.set(-5, 3, -4);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.2 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // a soft pool of shade right under the piece, so it sits on the floor instead of floating
  const contactTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(20,12,4,0.55)");
    grd.addColorStop(0.55, "rgba(20,12,4,0.22)");
    grd.addColorStop(1, "rgba(20,12,4,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  })();
  const contact = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false })
  );
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = 0.004;
  scene.add(contact);

  const matA = new THREE.MeshPhysicalMaterial({ roughness: 1 });
  const matB = new THREE.MeshPhysicalMaterial();
  let extras: THREE.Material[] = [];
  const mats: Mats = {
    a: matA,
    b: matB,
    fixed: (hex, p = {}) => {
      const m = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.6, ...p });
      extras.push(m);
      return m;
    },
  };

  const paint = (c: ViewConfig) => applySurfaces(matA, matB, c.fabric, c.frame, kind);

  let model: THREE.Group | null = null;
  let width = initial.w;
  const box = new THREE.Box3();
  const ctr = new THREE.Vector3();
  const dim = new THREE.Vector3();

  const disposeModel = () => {
    if (model) {
      model.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
      scene.remove(model);
    }
    extras.forEach((m) => m.dispose());
    extras = [];
  };
  const rebuild = (w: number) => {
    disposeModel();
    model = BUILDERS[kind](w, mats);
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    scene.add(model);
    width = w;
    box.setFromObject(model);
    box.getCenter(ctr);
    box.getSize(dim);
    contact.scale.set(dim.x * 1.28, dim.z * 1.45, 1);
    contact.position.x = ctr.x;
    contact.position.z = ctr.z;
  };
  paint(initial);
  rebuild(initial.w);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  // Frame by the piece's measured size, so a tall lamp and a wide bed both fit.
  const viewPos = (v: ViewName): THREE.Vector3 => {
    // the diagonal matters because the default view looks at the piece from a corner
    const ext = Math.max(Math.hypot(dim.x, dim.z) * 0.9, dim.y * 1.15);
    const d = (ext * 2.3 + 1.2) * distance;
    const y = ctr.y;
    switch (v) {
      case "front":
        return new THREE.Vector3(ctr.x, y + 0.7, ctr.z + d * 1.2);
      case "side":
        return new THREE.Vector3(ctr.x + d * 1.05, y + 0.5, ctr.z + 0.3);
      case "back":
        return new THREE.Vector3(ctr.x - d * 0.45, y + 0.9, ctr.z - d * 0.9);
      case "detail":
        return new THREE.Vector3(ctr.x + dim.x * 0.38, y + 0.35, ctr.z + dim.z / 2 + ext * 0.75 + 0.6);
      default: {
        if (azimuth !== undefined) {
          const a = (azimuth * Math.PI) / 180;
          return new THREE.Vector3(ctr.x + Math.sin(a) * d, y + 0.75, ctr.z + Math.cos(a) * d);
        }
        return new THREE.Vector3(ctr.x + d * 0.62, y + 1.1, ctr.z + d * 0.82);
      }
    }
  };
  camera.position.copy(viewPos("angle"));

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(ctr);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.enableZoom = false; // keep wheel/pinch free so the page still scrolls
  controls.minPolarAngle = 0.35;
  controls.maxPolarAngle = Math.PI / 2 - 0.04;
  controls.autoRotate = !reducedMotion && !still;
  controls.enabled = !still;
  controls.autoRotateSpeed = 0.9;
  controls.addEventListener("start", () => (controls.autoRotate = false));

  // eased camera moves between named views
  let tween: { from: THREE.Vector3; to: THREE.Vector3; t0: number } | null = null;
  let current: ViewName = "angle";
  const DUR = 900;
  const goTo = (v: ViewName) => {
    current = v;
    tween = { from: camera.position.clone(), to: viewPos(v), t0: performance.now() };
  };
  const setView = (v: ViewName) => {
    controls.autoRotate = false;
    goTo(v);
  };

  let visible = true;
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    if (tween) {
      const k = Math.min(1, (performance.now() - tween.t0) / DUR);
      camera.position.lerpVectors(tween.from, tween.to, ease(k));
      if (k >= 1) tween = null;
    }
    controls.update();
    renderer.render(scene, camera);
  };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    // keep the whole piece in frame on tall (phone) viewports
    camera.fov = camera.aspect < 0.9 ? 44 : 32;
    camera.updateProjectionMatrix();
  };
  resize();

  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
  io.observe(canvas);
  loop();

  return {
    setConfig: (c) => {
      paint(c);
      if (c.w !== width) {
        rebuild(c.w);
        controls.target.copy(ctr);
        goTo(current); // re-frame the new size
      }
    },
    setView,
    resize,
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      controls.dispose();
      disposeModel();
      matA.dispose();
      matB.dispose();
      contact.geometry.dispose();
      (contact.material as THREE.Material).dispose();
      contactTex.dispose();
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
