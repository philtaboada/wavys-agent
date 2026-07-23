#!/usr/bin/env bun
/**
 * Exporta flyer A4 (PDF+PNG) e infografía social (PNG) — Wavys OS.
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const flyerHtml = resolve(__dirname, 'flyer-wavys-os.html');
const socialHtml = resolve(__dirname, 'infografia-wavys-os.html');
const flyerPdf = resolve(__dirname, 'Wavys-OS-Flyer.pdf');
const flyerPng = resolve(__dirname, 'Wavys-OS-Flyer.png');
const socialPng = resolve(__dirname, 'Wavys-OS-Infografia.png');

const browser = await chromium.launch({ headless: true });

{
  const page = await browser.newPage();
  await page.goto(`file://${flyerHtml}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.pdf({
    path: flyerPdf,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  console.log(`PDF: ${flyerPdf}`);
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.screenshot({ path: flyerPng, fullPage: true, type: 'png' });
  console.log(`PNG flyer: ${flyerPng}`);
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1128, height: 1400 });
  await page.goto(`file://${socialHtml}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const card = page.locator('.card');
  await card.screenshot({ path: socialPng, type: 'png' });
  console.log(`PNG social: ${socialPng}`);
  await page.close();
}

await browser.close();
