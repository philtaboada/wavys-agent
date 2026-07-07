#!/usr/bin/env bun
/**
 * Exporta cover 1080×1920 para TikTok / Instagram Reels.
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const htmlPath = resolve(__dirname, 'cover-reel-presencia-digital.html');
const pngPath = resolve(__dirname, 'Cover-Reel-Presencia-Digital-1080x1920.png');
const jpgPath = resolve(__dirname, 'Cover-Reel-Presencia-Digital-1080x1920.jpg');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.setViewportSize({ width: 1080, height: 1920 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

await page.screenshot({
  path: pngPath,
  type: 'png',
  fullPage: false,
});

console.log(`PNG: ${pngPath}`);

await page.screenshot({
  path: jpgPath,
  type: 'jpeg',
  quality: 92,
  fullPage: false,
});

console.log(`JPG: ${jpgPath}`);

await browser.close();
