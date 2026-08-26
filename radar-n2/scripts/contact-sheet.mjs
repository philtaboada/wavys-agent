#!/usr/bin/env node
// Hoja de contactos del número: arma un HTML con los 11 PNG de export/ y lo
// fotografía con el mismo Chromium headless del export.
//
//   node radar-n2/scripts/contact-sheet.mjs
//
// Sale en radar-n2/contact-sheet.png (4 columnas × 3 filas, escala 1:2.38).

import { chromium } from "playwright";
import { readdir, writeFile, readFile, unlink } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(HERE, "..");
const EXPORT = resolve(DIR, "export");
const CHROME =
  process.env.CHROME_PATH ??
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const TITLES = {
  "01-tapa": "Tapa",
  "02-carta-del-editor": "Carta del editor",
  "03-senal": "Señal · 3 notas",
  "04a-tema-central-apertura": "Tema · apertura",
  "04b-tema-central-relato": "Tema · relato",
  "04c-tema-central-casos": "Tema · casos",
  "04d-tema-central-cita-datos": "Tema · cita y datos",
  "04e-tema-central-reglas": "Tema · cierre",
  "05-mas-noticias": "Más notas",
  "08-tablero-ia": "Tablero de IA",
  "09-contratapa": "Contratapa",
};

const files = (await readdir(EXPORT)).filter((f) => f.endsWith(".png")).sort();
const COL = 4;
const TW = 520; // ancho de miniatura
const TH = Math.round((TW * 1754) / 1240);
const GAP = 30;
const PAD = 44;
const W = PAD * 2 + TW * COL + GAP * (COL - 1);
const rows = Math.ceil(files.length / COL);
const HEAD = 168;
const H = HEAD + rows * (TH + 46) + GAP * (rows - 1) + PAD;

const fontsCss = await readFile(resolve(DIR, "fonts/fonts.css"), "utf8");

const cells = files
  .map((f, i) => {
    const slug = basename(f, ".png");
    const n = slug.slice(0, 3).replace(/-$/, "");
    return `<figure class="c">
      <div class="thumb"><img src="export/${f}" /></div>
      <figcaption><b>${n}</b> ${TITLES[slug] ?? slug}</figcaption>
    </figure>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<style>
${fontsCss.replace(/url\(([^)]+)\)/g, "url(fonts/$1)")}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    background: #ece9e1;
    padding: ${PAD}px;
    position: relative;
  }
  body::before {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
    opacity: 0.05; mix-blend-mode: multiply;
  }
  .head {
    display: flex; align-items: flex-end; justify-content: space-between;
    padding-bottom: 16px; margin-bottom: ${GAP}px;
    border-bottom: 6px solid #141412;
  }
  .mast {
    font-family: "Martian Mono"; font-weight: 800; font-size: 72px;
    letter-spacing: 0.16em; font-variation-settings: "wdth" 90;
    text-transform: uppercase; color: #141412; line-height: 0.82;
  }
  .sub {
    font-family: "Instrument Sans"; font-weight: 500; font-size: 22px;
    letter-spacing: -0.01em; color: #6b675c; padding-bottom: 4px;
  }
  .meta {
    text-align: right; font-family: "JetBrains Mono"; font-size: 15px;
    line-height: 1.7; color: #6b675c;
  }
  .meta b { color: #d8452a; }
  .grid {
    display: grid; grid-template-columns: repeat(${COL}, ${TW}px);
    gap: ${GAP}px ${GAP}px; align-content: start;
  }
  .thumb {
    width: ${TW}px; height: ${TH}px; overflow: hidden;
    box-shadow: 0 3px 16px rgba(20,20,18,0.22); background: #fff;
  }
  .thumb img { width: 100%; height: 100%; display: block; }
  figcaption {
    margin-top: 11px; font-family: "Martian Mono"; font-weight: 500;
    font-size: 12px; letter-spacing: 0.13em; font-variation-settings: "wdth" 82;
    text-transform: uppercase; color: #6b675c;
  }
  figcaption b { color: #d8452a; margin-right: 8px; }
</style></head><body>
  <div class="head">
    <div style="display:flex; align-items:flex-end; gap:26px">
      <div class="mast">Radar</div>
      <div class="sub">N°2 · hoja de contactos · 11 páginas</div>
    </div>
    <div class="meta">
      1240 × 1754 px · Chromium headless<br>
      <b>14 — 21 de agosto de 2026</b> · Wavys Technologies
    </div>
  </div>
  <div class="grid">${cells}</div>
</body></html>`;

const tmp = resolve(DIR, ".contact-sheet.html");
await writeFile(tmp, html);

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(`file://${tmp}`, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: resolve(DIR, "contact-sheet.png") });
await browser.close();
await unlink(tmp);

console.log(`contact-sheet.png  ${W}×${H}  ${files.length} páginas`);
