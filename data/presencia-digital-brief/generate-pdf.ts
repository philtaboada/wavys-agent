#!/usr/bin/env bun
/**
 * Genera PDF del brief Presencia Digital desde HTML.
 * Usa Playwright (descarga Chromium si hace falta).
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, 'brief-presencia-digital.html');
const pdfPath = resolve(__dirname, 'Wavys-Presencia-Digital-Brief.pdf');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500); // fonts

await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});

await browser.close();
console.log(`PDF generado: ${pdfPath}`);
