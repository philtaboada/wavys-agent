#!/usr/bin/env node
// Atajo de iteración: mismas medidas que export-page.sh (1240×1754, DPR 1)
// pero con Playwright, que cierra el navegador y tarda ~1s por página.
// El export oficial de entrega sigue siendo radar-n2/export-page.sh.
//
//   node radar-n2/scripts/dev-shot.mjs 02-carta-del-editor.html [...]
//   node radar-n2/scripts/dev-shot.mjs            # todas
//
// Además del PNG imprime el diagnóstico de maquetación: hasta dónde llega el
// contenido, qué se sale de la caja y qué cajas de texto se pisan entre sí.

import { chromium } from "playwright";
import { readdir, mkdir } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(HERE, "..");
const OUT = resolve(DIR, "export");
const CHROME =
  process.env.CHROME_PATH ??
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

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

let bad = 0;
for (const file of pages) {
  await page.goto(`file://${resolve(DIR, file)}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  await page.screenshot({ path: resolve(OUT, `${basename(file, ".html")}.png`) });

  const info = await page.evaluate(() => {
    const root = document.querySelector(".page");
    const pr = root.getBoundingClientRect();
    let low = 0;
    const overflow = [];
    const boxes = [];
    const id = (el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().trim().split(/\s+/)[0] || "?"}`;

    for (const el of root.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.bottom > low && r.bottom <= pr.bottom + 2) low = r.bottom;
      // Las fotos sangran a propósito: no cuentan como desborde.
      const bleeds = el.closest(".ph") || el.tagName === "IMG";
      if (!bleeds && (r.right > pr.right + 1 || r.bottom > pr.bottom + 1 || r.left < -1 || r.top < -1)) {
        overflow.push(`${id(el)} → ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.right)}×${Math.round(r.bottom)}`);
      }
      // Solo hojas con texto: son las que producen colisiones visibles.
      const txt = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (txt && r.width > 8 && r.height > 8) boxes.push({ k: id(el), r, el });
    }

    const hit = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const A = boxes[i];
        const B = boxes[j];
        if (A.k === B.k) continue;
        // Padre/hijo e inline dentro del mismo párrafo no son colisión.
        if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
        const a = A.r;
        const b = B.r;
        const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        // Un inline que ocupa varias líneas devuelve la unión de sus cajas, y con
        // line-height < 1 esa unión sobresale del bloque. Pide más solape.
        const inline = /^(EM|I|B|SPAN|STRONG|A)$/;
        const slack = inline.test(A.el.tagName) || inline.test(B.el.tagName) ? 20 : 6;
        if (ox > slack && oy > slack) hit.push(`${A.k} ↔ ${B.k} (${Math.round(ox)}×${Math.round(oy)})`);
      }
    }
    return { low: Math.round(low), overflow: overflow.slice(0, 6), hit: [...new Set(hit)].slice(0, 6) };
  });

  const flags = [];
  if (info.overflow.length) flags.push(`FUERA DE CAJA: ${info.overflow.join(" | ")}`);
  if (info.hit.length) flags.push(`PISADA: ${info.hit.join(" | ")}`);
  if (flags.length) bad++;
  console.log(`${file.padEnd(34)} y=${info.low}${flags.length ? `  ⚠ ${flags.join("  ")}` : "  ok"}`);
}

await browser.close();
if (bad) console.log(`\n${bad} página(s) con avisos.`);
