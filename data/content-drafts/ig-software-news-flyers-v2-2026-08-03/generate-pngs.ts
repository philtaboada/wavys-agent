#!/usr/bin/env bun
import { chromium } from "playwright";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const flyers = [
  "flyer-01-whatsapp-folder",
  "flyer-02-openai-80",
  "flyer-03-octubre",
  "flyer-04-cta",
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
  console.log(`OK ${id}`);
}

await browser.close();
