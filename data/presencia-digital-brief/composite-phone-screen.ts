#!/usr/bin/env bun
/**
 * Compone la UI móvil dentro de la pantalla del celular (píxeles exactos).
 * Calibrar SCREEN_* si cambia la foto base.
 */
import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Rect interior pantalla en promo-latam-holding-phone.jpg (896×1200) */
const SCREEN = { left: 227, top: 568, width: 442, height: 504 };

const basePath = resolve(__dirname, 'promo-latam-holding-phone.jpg');
const uiPath = resolve(__dirname, 'promo-mobile-ui-vibrant.jpg');
const outPath = resolve(__dirname, 'promo-latam-holding-phone-composited.jpg');

const uiBuffer = await sharp(uiPath)
  .resize(SCREEN.width, SCREEN.height, { fit: 'cover', position: 'top' })
  .toBuffer();

await sharp(basePath)
  .composite([{ input: uiBuffer, left: SCREEN.left, top: SCREEN.top }])
  .jpeg({ quality: 95 })
  .toFile(outPath);

console.log(`Composited: ${outPath} (${SCREEN.width}×${SCREEN.height} @ ${SCREEN.left},${SCREEN.top})`);
