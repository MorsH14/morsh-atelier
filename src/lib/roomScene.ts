import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * MORSH Atelier — procedural room.
 * One room, three states. Scroll progress (0..1) drives:
 *   0.00 – 0.30  The Shell        raw concrete, cold light, empty
 *   0.20 – 0.60  The Composition  furniture assembles piece by piece
 *   0.55 – 0.95  The Finish       materials warm, lamps ignite, daylight floods in
 * The camera travels a spline through the whole sequence.
 */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Tinted = {
  mat: THREE.MeshStandardMaterial;
  from: THREE.Color;
  to: THREE.Color;
  window: [number, number];
};

type Piece = {
  group: THREE.Group;
  baseY: number;
  window: [number, number];
  mats: THREE.MeshStandardMaterial[];
};

export type RoomScene = {
  setProgress: (p: number) => void;
  resize: () => void;
  dispose: () => void;
};

export type RoomOptions = {
  lowPower?: boolean;
  reducedMotion?: boolean;
};

export function createRoomScene(
  canvas: HTMLCanvasElement,
  opts: RoomOptions = {}
): RoomScene {
  const { lowPower = false, reducedMotion = false } = opts;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = !lowPower;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b0a09");
  scene.fog = new THREE.Fog("#0b0a09", 14, 30);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.3;

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);

  /* ---------- palette: [shell, finished] ---------- */
  const C = (h: string) => new THREE.Color(h);
  const tinted: Tinted[] = [];
  const std = (
    from: string,
    to: string,
    window: [number, number],
    p: Partial<THREE.MeshStandardMaterialParameters> = {}
  ) => {
    const mat = new THREE.MeshStandardMaterial({
      color: C(from),
      roughness: 0.8,
      metalness: 0,
      ...p,
    });
    tinted.push({ mat, from: C(from), to: C(to), window });
    return mat;
  };

  const FIN: [number, number] = [0.55, 0.92];

  const matFloor = std("#46423d", "#8a6a47", FIN, { roughness: 0.55 });
  const matWall = std("#5d5852", "#c8b9a3", FIN, { roughness: 0.95 });
  const matSlat = std("#4b4742", "#5c4631", FIN, { roughness: 0.6 });
  const matSkirt = std("#2e2c2a", "#2a2018", FIN);

  /* ---------- room shell ---------- */
  const room = new THREE.Group();
  scene.add(room);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 14), matFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  room.add(floor);

  const back = new THREE.Mesh(new THREE.PlaneGeometry(16, 7), matWall);
  back.position.set(0, 3.5, -4);
  back.receiveShadow = true;
  room.add(back);

  const left = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), matWall);
  left.rotation.y = Math.PI / 2;
  left.position.set(-6, 3.5, 3);
  left.receiveShadow = true;
  room.add(left);

  const right = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), matWall);
  right.rotation.y = -Math.PI / 2;
  right.position.set(6, 3.5, 3);
  right.receiveShadow = true;
  room.add(right);

  // fluted wall panelling behind the sofa
  const slatGeo = new THREE.BoxGeometry(0.1, 4.2, 0.12);
  for (let i = 0; i < 34; i++) {
    const s = new THREE.Mesh(slatGeo, matSlat);
    s.position.set(-3.3 + i * 0.2, 2.1, -3.94);
    s.castShadow = true;
    s.receiveShadow = true;
    room.add(s);
  }

  // skirting
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(16, 0.18, 0.06), matSkirt);
  skirt.position.set(0, 0.09, -3.97);
  room.add(skirt);

  // window on the right wall: glowing pane + mullions
  const matGlass = new THREE.MeshBasicMaterial({ color: C("#1a2330") });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.4), matGlass);
  glass.rotation.y = -Math.PI / 2;
  glass.position.set(5.96, 2.7, -0.4);
  room.add(glass);
  const matFrame = std("#161513", "#161513", FIN, { roughness: 0.4, metalness: 0.6 });
  const frameParts: [number, number, number, number, number, number][] = [
    [0.08, 4.5, 0.08, 5.9, 2.7, -2.7],
    [0.08, 4.5, 0.08, 5.9, 2.7, 1.9],
    [0.08, 0.08, 4.6, 5.9, 0.5, -0.4],
    [0.08, 0.08, 4.6, 5.9, 4.9, -0.4],
    [0.08, 4.4, 0.05, 5.9, 2.7, -0.4],
    [0.08, 0.05, 4.6, 5.9, 2.7, -0.4],
  ];
  for (const [w, h, d, x, y, z] of frameParts) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matFrame);
    m.position.set(x, y, z);
    room.add(m);
  }

  /* ---------- lights ---------- */
  const hemi = new THREE.HemisphereLight("#9fb0c8", "#2a2420", 0.7);
  scene.add(hemi);

  const coolKey = new THREE.DirectionalLight("#a9bddc", 1.9);
  coolKey.position.set(-4, 7, 8);
  scene.add(coolKey);

  const sun = new THREE.DirectionalLight("#ffd9a8", 0);
  sun.position.set(9, 4.5, 0.5);
  sun.target.position.set(-1, 0.5, -0.5);
  sun.castShadow = !lowPower;
  sun.shadow.mapSize.set(1536, 1536);
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 6;
  sun.shadow.camera.bottom = -3;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 24;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  const lampLight = new THREE.PointLight("#ffb866", 0, 9, 1.6);
  lampLight.position.set(-3.6, 2.5, -0.4);
  scene.add(lampLight);

  const pendantLight = new THREE.PointLight("#ffc98a", 0, 8, 1.6);
  pendantLight.position.set(0.4, 3.4, 0.9);
  scene.add(pendantLight);

  /* ---------- furniture ---------- */
  const pieces: Piece[] = [];
  const emissive: { mat: THREE.MeshStandardMaterial; max: number; window: [number, number] }[] = [];

  const addPiece = (group: THREE.Group, window: [number, number]) => {
    const mats: THREE.MeshStandardMaterial[] = [];
    group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const m = mesh.material as THREE.MeshStandardMaterial;
        if (!mats.includes(m)) mats.push(m);
      }
    });
    mats.forEach((m) => (m.transparent = true));
    pieces.push({ group, baseY: group.position.y, window, mats });
    scene.add(group);
  };

  const brass = new THREE.MeshStandardMaterial({
    color: C("#b79b6a"),
    metalness: 1,
    roughness: 0.28,
  });
  const matBoucle = std("#5f5d5a", "#e3d9c8", FIN, { roughness: 1 });
  const matWalnut = std("#4a4744", "#4b2f1c", FIN, { roughness: 0.42 });
  const matTravertine = std("#55524e", "#d9ccb4", FIN, { roughness: 0.7 });
  const matRug = std("#3a3835", "#a89a85", FIN, { roughness: 1 });

  // Rug
  {
    const g = new THREE.Group();
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, 0.025, 72), matRug);
    rug.position.y = 0.0125;
    g.add(rug);
    g.position.set(0.2, 0, 0.5);
    addPiece(g, [0.2, 0.32]);
  }

  // Sofa
  {
    const g = new THREE.Group();
    const seat = new THREE.Mesh(new RoundedBoxGeometry(3.6, 0.5, 1.45, 5, 0.16), matBoucle);
    seat.position.y = 0.55;
    const backrest = new THREE.Mesh(new RoundedBoxGeometry(3.6, 0.95, 0.5, 5, 0.2), matBoucle);
    backrest.position.set(0, 1.0, -0.5);
    const armL = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.78, 1.45, 5, 0.18), matBoucle);
    armL.position.set(-1.6, 0.76, 0);
    const armR = armL.clone();
    armR.position.x = 1.6;
    g.add(seat, backrest, armL, armR);
    for (let i = -1; i <= 1; i++) {
      const c = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.26, 1.0, 5, 0.12), matBoucle);
      c.position.set(i * 1.02, 0.93, 0.12);
      g.add(c);
    }
    for (const x of [-1.6, 1.6]) {
      for (const z of [-0.5, 0.5]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.025, 0.28, 16), brass);
        leg.position.set(x, 0.14, z);
        g.add(leg);
      }
    }
    g.position.set(0.3, 0, -2.6);
    addPiece(g, [0.28, 0.42]);
  }

  // Coffee table (walnut disc on travertine drum)
  {
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.07, 64), matWalnut);
    top.position.y = 0.46;
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.42, 48), matTravertine);
    drum.position.y = 0.21;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.955, 0.012, 12, 96), brass);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.46;
    g.add(top, drum, ring);
    g.position.set(0.5, 0, -0.5);
    addPiece(g, [0.36, 0.5]);
  }

  // Lounge chair
  {
    const g = new THREE.Group();
    const seat = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.36, 0.95, 5, 0.14), matBoucle);
    seat.position.y = 0.52;
    const back = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.85, 0.3, 5, 0.14), matBoucle);
    back.position.set(0, 0.92, -0.4);
    back.rotation.x = -0.12;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.12, 40), brass);
    base.position.y = 0.06;
    g.add(seat, back, base);
    g.position.set(3.3, 0, 0.6);
    g.rotation.y = -0.95;
    addPiece(g, [0.42, 0.54]);
  }

  // Side table
  {
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.04, 48), brass);
    top.position.y = 0.58;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.56, 16), brass);
    stem.position.y = 0.29;
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.03, 40), brass);
    foot.position.y = 0.015;
    g.add(top, stem, foot);
    g.position.set(-2.1, 0, -2.35);
    addPiece(g, [0.46, 0.58]);
  }

  // Floor lamp (arc-less column lamp with glowing shade)
  {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.05, 40), brass);
    base.position.y = 0.025;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.75, 12), brass);
    pole.position.y = 0.9;
    const shadeMat = new THREE.MeshStandardMaterial({
      color: C("#d8ccb6"),
      emissive: C("#ffb45e"),
      emissiveIntensity: 0,
      roughness: 0.9,
    });
    emissive.push({ mat: shadeMat, max: 1.5, window: [0.62, 0.8] });
    shadeMat.side = THREE.DoubleSide;
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 0.55, 40, 1, true), shadeMat);
    shade.position.y = 2.0;
    g.add(base, pole, shade);
    g.position.set(-3.6, 0, -0.4);
    addPiece(g, [0.5, 0.62]);
  }

  // Plant
  {
    const g = new THREE.Group();
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.26, 0.6, 40),
      std("#4a4744", "#a9917a", FIN, { roughness: 0.8 })
    );
    pot.position.y = 0.3;
    g.add(pot);
    const leafMat = new THREE.MeshStandardMaterial({ color: C("#3d4a35"), roughness: 0.7 });
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), leafMat);
      leaf.scale.set(0.34, 1.6 + (i % 3) * 0.35, 0.12);
      leaf.position.set(Math.cos(a) * 0.17, 1.15 + (i % 3) * 0.2, Math.sin(a) * 0.17);
      leaf.rotation.set(Math.sin(a) * 0.4, -a, -Math.cos(a) * 0.4);
      g.add(leaf);
    }
    g.position.set(-5.0, 0, -3.0);
    addPiece(g, [0.54, 0.66]);
  }

  // Arched artwork on the wall
  {
    const g = new THREE.Group();
    const shape = new THREE.Shape();
    const w = 1.4;
    const h = 2.4;
    shape.moveTo(-w / 2, 0);
    shape.lineTo(-w / 2, h - w / 2);
    shape.absarc(0, h - w / 2, w / 2, Math.PI, 0, true);
    shape.lineTo(w / 2, 0);
    shape.lineTo(-w / 2, 0);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
    const art = new THREE.Mesh(geo, std("#4a4744", "#a7573a", FIN, { roughness: 0.9 }));
    g.add(art);
    const inset = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { depth: 0.01, bevelEnabled: false }),
      brass
    );
    inset.scale.set(1.08, 1.04, 1);
    inset.position.set(0, -0.04, -0.02);
    g.add(inset);
    g.position.set(-1.6, 1.1, -3.85);
    addPiece(g, [0.56, 0.68]);
  }

  // Pendant globe
  {
    const g = new THREE.Group();
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 4, 8), brass);
    cable.position.y = 2.0;
    const gMat = new THREE.MeshStandardMaterial({
      color: C("#f0e6d2"),
      emissive: C("#ffc47a"),
      emissiveIntensity: 0,
      roughness: 0.35,
    });
    emissive.push({ mat: gMat, max: 2.2, window: [0.66, 0.84] });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.42, 48, 32), gMat);
    g.add(cable, globe);
    g.position.set(0.4, 3.2, 0.9);
    addPiece(g, [0.58, 0.7]);
  }

  // Curtains — fluted drapery beside the window
  {
    const g = new THREE.Group();
    const curtainMat = std("#4a4744", "#e8dfd0", FIN, { roughness: 1 });
    for (let i = 0; i < 16; i++) {
      const fold = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5.6, 16), curtainMat);
      fold.position.set(5.5, 2.8, -3.3 + i * 0.13);
      g.add(fold);
    }
    addPiece(g, [0.6, 0.74]);
  }

  /* ---------- camera path ---------- */
  const camPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0.0, 2.8, 15.0),
      new THREE.Vector3(-1.6, 2.6, 11.0),
      new THREE.Vector3(-4.0, 2.3, 7.6),
      new THREE.Vector3(-1.6, 1.9, 6.4),
      new THREE.Vector3(0.9, 2.2, 8.4),
    ],
    false,
    "catmullrom",
    0.5
  );
  const lookPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 1.8, -2),
      new THREE.Vector3(0, 1.5, -1.5),
      new THREE.Vector3(0.4, 1.2, -1.0),
      new THREE.Vector3(0.6, 1.0, -1.2),
      new THREE.Vector3(0.0, 1.7, -1.4),
    ],
    false,
    "catmullrom",
    0.5
  );

  /* ---------- progress application ---------- */
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const glassFrom = C("#1a2330");
  const glassTo = C("#ffe9c4");
  const bgFrom = C("#0b0a09");
  const bgTo = C("#14100c");
  let current = reducedMotion ? 1 : 0;
  let target = reducedMotion ? 1 : 0;
  let raf = 0;
  let running = true;
  let lastRender = -1;
  let lastT = performance.now();

  const apply = (p: number) => {
    camPath.getPoint(clamp(p), tmpA);
    lookPath.getPoint(clamp(p), tmpB);
    camera.position.copy(tmpA);
    camera.lookAt(tmpB);

    for (const t of tinted) {
      const k = smooth(t.window[0], t.window[1], p);
      t.mat.color.copy(t.from).lerp(t.to, k);
    }
    for (const pc of pieces) {
      const k = smooth(pc.window[0], pc.window[1], p);
      pc.group.visible = k > 0.001;
      pc.group.position.y = pc.baseY + (1 - k) * 0.9;
      pc.group.scale.setScalar(0.94 + 0.06 * k);
      for (const m of pc.mats) {
        m.opacity = k;
        m.depthWrite = k > 0.98;
      }
    }
    for (const e of emissive) {
      e.mat.emissiveIntensity = e.max * smooth(e.window[0], e.window[1], p);
    }

    const warm = smooth(0.55, 0.92, p);
    const dayK = smooth(0.62, 0.95, p);
    sun.intensity = 3.4 * dayK;
    coolKey.intensity = 1.9 - 1.4 * warm;
    hemi.intensity = 0.7 - 0.05 * warm;
    lampLight.intensity = 7 * smooth(0.6, 0.8, p);
    pendantLight.intensity = 7 * smooth(0.64, 0.84, p);
    scene.environmentIntensity = 0.3 + 0.15 * warm;
    renderer.toneMappingExposure = 0.9 + 0.25 * warm;
    matGlass.color.copy(glassFrom).lerp(glassTo, dayK);
    (scene.background as THREE.Color).copy(bgFrom).lerp(bgTo, warm);
    (scene.fog as THREE.Fog).color.copy(scene.background as THREE.Color);
  };

  const render = () => {
    if (!running) return;
    raf = requestAnimationFrame(render);
    // critically-damped glide gives the scroll its cinematic inertia
    const now = performance.now();
    const dt = Math.min(0.25, (now - lastT) / 1000);
    lastT = now;
    current += (target - current) * (reducedMotion ? 1 : 1 - Math.exp(-dt * 5.5));
    if (Math.abs(target - current) < 0.00005) current = target;
    if (Math.abs(current - lastRender) < 0.00002 && lastRender >= 0) return;
    lastRender = current;
    apply(current);
    renderer.render(scene, camera);
  };

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the room framed on portrait phones
    camera.fov = w / h < 0.8 ? 52 : 36;
    camera.updateProjectionMatrix();
    lastRender = -1;
  };

  resize();
  apply(current);
  render();

  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      lastRender = -1;
      render();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setProgress: (p) => {
      target = clamp(p);
    },
    resize,
    dispose: () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          const mat = m.material as THREE.Material | THREE.Material[];
          (Array.isArray(mat) ? mat : [mat]).forEach((x) => x.dispose());
        }
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
