// Photographs the styled living room (real catalogue models) + records where each piece lands.
//   node scripts/room.mjs   (needs `npm run dev`)
// -> public/room/living.jpg, living-m.jpg  and  src/lib/roomSpots.json
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = path.resolve("public/room");
const SIZES = [["wide", "living", 1800, 1100], ["tall", "living-m", 800, 1000]];

fs.mkdirSync(OUT, { recursive: true });
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=9341", "--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", "--user-data-dir=" + path.resolve(".shots/profile-room"), "about:blank"], { stdio: "ignore" });
let tabs;
for (let i = 0; i < 40 && !tabs; i++) { await new Promise((r) => setTimeout(r, 500)); try { tabs = await (await fetch("http://127.0.0.1:9341/json")).json(); } catch {} }
const ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true })).result?.value;
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });

const spots = {};
for (const [key, name, w, h] of SIZES) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: BASE + "/render/room" });
  for (let i = 0; i < 80 && !(await ev("window.__ready === true")); i++) await new Promise((r) => setTimeout(r, 500));
  await new Promise((r) => setTimeout(r, 800));
  spots[key] = await ev("window.__spots");
  const shot = await send("Page.captureScreenshot", { format: "png" });
  const png = path.join(OUT, `${name}.png`);
  fs.writeFileSync(png, Buffer.from(shot.data, "base64"));
  execFileSync("python3", ["-c", `from PIL import Image; im=Image.open(${JSON.stringify(png)}).convert("RGB"); im.save(${JSON.stringify(png.replace(".png", ".jpg"))}, quality=86, optimize=True, progressive=True)`]);
  fs.unlinkSync(png);
  console.log("✓", name + ".jpg", JSON.stringify(spots[key]));
}
fs.writeFileSync("src/lib/roomSpots.json", JSON.stringify(spots, null, 2) + "\n");
chrome.kill();
process.exit(0);
