#!/usr/bin/env bun
import { chromium } from 'playwright';
import { resolve } from 'path';

const marketingDir = resolve('/Volumes/mac externo/Mac Externo/projects/tina-web-next/public/images/marketing');
const htmlPath = resolve(marketingDir, 'cover-reel-rankana.html');
const pngPath = resolve(marketingDir, 'Cover-Reel-RANKANA-Shopify-1080x1920.png');
const jpgPath = resolve(marketingDir, 'Cover-Reel-RANKANA-Shopify-1080x1920.jpg');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.setViewportSize({ width: 1080, height: 1920 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

await page.screenshot({ path: pngPath, type: 'png', fullPage: false });
console.log(`PNG: ${pngPath}`);

await page.screenshot({
  path: jpgPath,
  type: 'jpeg',
  quality: 92,
  fullPage: false,
});
console.log(`JPG: ${jpgPath}`);

await browser.close();
