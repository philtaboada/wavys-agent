#!/usr/bin/env bun
/**
 * Genera PDF del brief comercial Wavys OS desde HTML.
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, 'brief-wavys-os.html');
const pdfPath = resolve(__dirname, 'Wavys-OS-Brief.pdf');

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
await browser.close();
