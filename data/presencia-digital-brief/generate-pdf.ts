#!/usr/bin/env bun
/**
 * Genera PDFs del brief Presencia Digital, Presencia Tienda y Presencia Catálogo desde HTML.
 * Usa Playwright (descarga Chromium si hace falta).
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BRIEFS = [
  {
    html: 'brief-presencia-digital.html',
    pdf: 'Wavys-Presencia-Digital-Brief.pdf',
  },
  {
    html: 'brief-presencia-tienda.html',
    pdf: 'Wavys-Presencia-Tienda-Brief.pdf',
  },
  {
    html: 'brief-presencia-catalogo.html',
    pdf: 'Wavys-Presencia-Catalogo-Brief.pdf',
  },
] as const;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const brief of BRIEFS) {
  const htmlPath = resolve(__dirname, brief.html);
  const pdfPath = resolve(__dirname, brief.pdf);

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  console.log(`PDF generado: ${pdfPath}`);
}

await browser.close();
