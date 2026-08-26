#!/usr/bin/env bun
/**
 * Genera briefs PDF por pack MVP (Tienda · Salón · Restaurante).
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PACKS = [
  { html: 'brief-tienda.html', pdf: 'Wavys-OS-Brief-Tienda.pdf' },
  { html: 'brief-salon.html', pdf: 'Wavys-OS-Brief-Salon.pdf' },
  { html: 'brief-restaurante.html', pdf: 'Wavys-OS-Brief-Restaurante.pdf' },
] as const;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const pack of PACKS) {
  const htmlPath = resolve(__dirname, pack.html);
  const pdfPath = resolve(__dirname, pack.pdf);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  console.log(`PDF: ${pdfPath}`);
}

await browser.close();
