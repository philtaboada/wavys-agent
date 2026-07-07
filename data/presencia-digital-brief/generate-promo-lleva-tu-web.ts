#!/usr/bin/env bun
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, 'promo-lleva-tu-web.html');
const pngPath = resolve(__dirname, 'promo-lleva-tu-web-1080x1350.png');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1080, height: 1350 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: pngPath, type: 'png' });
console.log(`PNG generado: ${pngPath}`);
await browser.close();
