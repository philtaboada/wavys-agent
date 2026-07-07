#!/usr/bin/env bun
/**
 * Genera PDF del flyer Presencia Digital (website por suscripción).
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const htmlPath = resolve(__dirname, 'flyer-website-suscripcion.html');
const pdfPath = resolve(__dirname, 'Wavys-Flyer-Website-Suscripcion.pdf');
const pngPath = resolve(__dirname, 'Wavys-Flyer-Website-Suscripcion.png');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});

console.log(`PDF generado: ${pdfPath}`);

await page.setViewportSize({ width: 794, height: 1123 });
await page.screenshot({
  path: pngPath,
  fullPage: true,
  type: 'png',
});

console.log(`PNG generado: ${pngPath}`);

await browser.close();
