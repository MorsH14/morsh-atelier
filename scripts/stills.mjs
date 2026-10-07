// Renders catalogue stills from the live 3D models: `npm run dev`, then
//   node scripts/stills.mjs [slug] [lookId]
// Output: public/stills/<slug>-<look>.jpg. Needs Google Chrome (macOS path below).
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = path.resolve("public/stills");
const W = 1000, H = 1250, DPR = 1.4;

// per-piece framing: [distance multiplier, azimuth in degrees]
const FRAME = {
  "oro-sofa": [0.78, 32],
  "kora-table": [0.62, 28],
  "lume-lamp": [0.6, 24],
  "sela-chair": [0.7, 30],
  "nuit-bed": [0.8, 36],
  "arc-console": [0.76, 22],
};
const LOOKS = JSON.parse(fs.readFileSync(new URL("./looks.json", import.meta.url), "utf8"));

const [onlySlug, onlyLook] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });

const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=9340", `--window-size=${W},${H}`, "--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", "--user-data-dir=" + path.resolve(".shots/profile"), "about:blank"], { stdio: "ignore" });
let tabs;
for (let i = 0; i < 40 && !tabs; i++) {
  await new Promise((r) => setTimeout(r, 500));
  try { tabs = await (await fetch("http://127.0.0.1:9340/json")).json(); } catch {}
}
if (!tabs) throw new Error("Chrome did not start");
const ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true })).result?.value;
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true }); // always render with the current code
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: DPR, mobile: false });

for (const [slug, looks] of Object.entries(LOOKS)) {
  if (onlySlug && onlySlug !== slug) continue;
  for (const look of looks) {
    if (onlyLook && onlyLook !== look.id) continue;
    const [distance, azimuth] = FRAME[slug];
    const url = `${BASE}/render/${slug}?fabric=${look.fabric}&frame=${look.frame}${look.size ? `&size=${look.size}` : ""}&distance=${distance}&azimuth=${azimuth}`;
    await send("Page.navigate", { url });
    for (let i = 0; i < 60 && !(await ev("window.__ready === true")); i++) await new Promise((r) => setTimeout(r, 500));
    await new Promise((r) => setTimeout(r, 600));
    const shot = await send("Page.captureScreenshot", { format: "png" });
    const png = path.join(OUT, `${slug}-${look.id}.png`);
    fs.writeFileSync(png, Buffer.from(shot.data, "base64"));
    execFileSync("python3", ["-c", `from PIL import Image; im=Image.open(${JSON.stringify(png)}).convert("RGB"); im.thumbnail((1200,1500)); im.save(${JSON.stringify(png.replace(".png", ".jpg"))}, quality=84, optimize=True, progressive=True)`]);
    fs.unlinkSync(png);
    console.log("✓", `${slug}-${look.id}.jpg`);
  }
}
chrome.kill();
process.exit(0);
