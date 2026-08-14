#!/usr/bin/env node
// RADAR N°1 — captura de los gráficos reales de Artificial Analysis para la página 08.
//
// LOCK: el tablero de 08 NO se dibuja a mano ni se genera con IA. Son recortes reales
// del sitio (artificialanalysis.ai) capturados con Chrome headless vía Playwright.
// URL y fecha de captura quedan anotadas en radar-n1/charts/SOURCES.md.
//
// Uso:
//   node radar-n1/scripts/capture-aa-charts.mjs             # captura todo
//   node radar-n1/scripts/capture-aa-charts.mjs --headings  # lista títulos disponibles

import { chromium } from "playwright";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "..", "charts");
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome-stable";

const TARGETS = [
  {
    file: "aa-leaderboard.png",
    url: "https://artificialanalysis.ai/leaderboards/models",
    table: true,
    cropHeight: 430,
    label: "LLM Leaderboard — cabecera + primeras filas",
  },
  {
    file: "aa-intelligence-vs-cost.png",
    url: "https://artificialanalysis.ai/models",
    heading: "Intelligence Index vs. Cost per Intelligence Index Task",
    label: "Intelligence Index vs Cost per Task (scatter)",
  },
  {
    file: "aa-intelligence-bars.png",
    url: "https://artificialanalysis.ai/models",
    heading: "Artificial Analysis Intelligence Index",
    label: "Artificial Analysis Intelligence Index (barras)",
  },
  {
    file: "aa-output-speed.png",
    url: "https://artificialanalysis.ai/models",
    heading: "Output Speed",
    label: "Output Speed, tokens/s (barras)",
  },
];

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1150 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await mkdir(OUT, { recursive: true });

let current = null;
async function settle(url) {
  if (current === url) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    return;
  }
  current = url;
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(3500);
  // Los charts son lazy: recorrer la página los monta.
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
}

if (process.argv.includes("--headings")) {
  for (const url of [...new Set(TARGETS.map((t) => t.url))]) {
    await settle(url);
    const headings = await page.evaluate(() =>
      [...document.querySelectorAll("h1,h2,h3,h4")]
        .map((el) => ({
          tag: el.tagName,
          text: el.textContent.trim().slice(0, 90),
          top: Math.round(el.getBoundingClientRect().top + window.scrollY),
        }))
        .filter((h) => h.text),
    );
    console.log(`\n=== ${url}`);
    for (const h of headings) console.log(`${h.top}\t${h.tag}\t${h.text}`);
  }
  await browser.close();
  process.exit(0);
}

for (const target of TARGETS) {
  await settle(target.url);
  const path = resolve(OUT, target.file);

  const handle = target.table
    ? await page.evaluateHandle((cropHeight) => {
        const table = document.querySelector("table");
        if (!table) return null;
        // Contenedor scrolleable de la tabla: se recorta en alto para quedarnos
        // con la cabecera y las primeras filas del ranking.
        let box = table.parentElement;
        for (let i = 0; i < 3 && box?.parentElement; i++) {
          if (box.scrollHeight > box.clientHeight + 4) break;
          box = box.parentElement;
        }
        box.style.maxHeight = `${cropHeight}px`;
        box.style.overflow = "hidden";
        box.scrollIntoView({ block: "center" });
        return box;
      }, target.cropHeight)
    : await page.evaluateHandle((needle) => {
        const leaf = [...document.querySelectorAll("h1,h2,h3,h4,div,span,p")].find(
          (el) => el.children.length === 0 && el.textContent.trim().startsWith(needle),
        );
        if (!leaf) return null;
        let node = leaf;
        for (let i = 0; i < 9 && node.parentElement; i++) {
          const r = node.getBoundingClientRect();
          if (r.width > 760 && r.height > 430) break;
          node = node.parentElement;
        }
        node.scrollIntoView({ block: "center" });
        return node;
      }, target.heading);

  const element = handle.asElement();
  if (!element) {
    console.error(`FALLO  ${target.file}: no encontré el bloque`);
    continue;
  }
  await page.waitForTimeout(2500);
  await element.screenshot({ path });
  console.log(`ok     ${target.file}  ${target.label}`);
}

await browser.close();
