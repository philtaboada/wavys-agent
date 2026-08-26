#!/usr/bin/env bun
import { chromium } from "playwright";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const slides = [
  "slide-00-cover",
  "slide-01-hook",
  "slide-02-detecta",
  "slide-03-acelero",
  "slide-04-red",
  "slide-05-cta",
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1080, height: 1350 });

for (const id of slides) {
  await page.goto(`file://${resolve(__dirname, `${id}.html`)}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: resolve(__dirname, `${id}-1080x1350.png`), type: "png" });
  console.log(`OK ${id}`);
}
await browser.close();
