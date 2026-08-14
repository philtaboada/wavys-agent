#!/usr/bin/env node
// Atajo de iteración: mismas medidas que export-page.sh (1240×1754, DPR 1)
// pero con Playwright, que cierra el navegador y tarda ~2s por página.
// El export oficial de entrega sigue siendo radar-n1/export-page.sh.
//
//   node radar-n1/scripts/dev-shot.mjs 02-carta-del-editor.html [...]
//   node radar-n1/scripts/dev-shot.mjs            # todas

import { chromium } from "playwright";
import { readdir, mkdir } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(HERE, "..");
const OUT = resolve(DIR, "export");
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome-stable";

let pages = process.argv.slice(2).map((p) => basename(p));
if (!pages.length) {
  pages = (await readdir(DIR)).filter((f) => f.endsWith(".html")).sort();
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const page = await browser.newPage({
  viewport: { width: 1240, height: 1754 },
  deviceScaleFactor: 1,
});

for (const file of pages) {
  await page.goto(`file://${resolve(DIR, file)}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const out = resolve(OUT, `${basename(file, ".html")}.png`);
  await page.screenshot({ path: out });
  // Diagnóstico de maquetación: qué tan abajo llega el contenido real y
  // si algo se sale de la caja de 1240×1754.
  const info = await page.evaluate(() => {
    const page = document.querySelector(".page");
    const pr = page.getBoundingClientRect();
    let low = 0;
    let overflow = [];
    for (const el of page.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.bottom > low && r.bottom <= pr.bottom + 2) low = r.bottom;
      if (r.right > pr.right + 1 || r.bottom > pr.bottom + 1 || r.left < -1) {
        const cls = el.className?.toString?.().slice(0, 34) ?? "";
        overflow.push(`${el.tagName.toLowerCase()}.${cls} → ${Math.round(r.right)}×${Math.round(r.bottom)}`);
      }
    }
    return { low: Math.round(low), overflow: overflow.slice(0, 6) };
  });
  console.log(`${file}  contenido hasta y=${info.low}${info.overflow.length ? `  ⚠ ${info.overflow.join(" | ")}` : ""}`);
}

await browser.close();
