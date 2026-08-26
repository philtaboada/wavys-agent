#!/usr/bin/env bun
import { chromium } from "playwright";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const flyers = [
  "flyer-01-deployment",
  "flyer-02-whatsapp-billing",
  "flyer-03-vertical",
  "flyer-04-wavys-os",
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1080, height: 1350 });

for (const id of flyers) {
  const htmlPath = resolve(__dirname, `${id}.html`);
  const pngPath = resolve(__dirname, `${id}-1080x1350.png`);
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: pngPath, type: "png" });
  console.log(`OK ${pngPath}`);
}

await browser.close();
console.log("4 flyers IG listos.");
