#!/usr/bin/env bun
import sharp from "sharp";
import { mkdir } from "fs/promises";
import { dirname, resolve } from "path";

const root = resolve(import.meta.dir, "../../..");
const srcDir = resolve(root, "data/generated-images/ig-android-earthquake-alerts-2026-08-11");
const outDir = resolve(import.meta.dir, "assets");

const jobs = [
  "phone-alert-src.jpg",
  "wave-p-src.jpg",
  "phone-still-src.jpg",
  "network-phones-src.jpg",
  "shield-seconds-src.jpg",
] as const;

async function executeCutout(inputPath: string, outputPath: string): Promise<void> {
  const image = sharp(inputPath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const threshold = 245;
  const softness = 18;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const isNearWhite = min >= threshold - softness && max - min < 28;
    if (isNearWhite) {
      const alpha = Math.max(0, Math.min(255, Math.round(((threshold - min) / softness) * 255)));
      data[i + 3] = alpha;
    }
  }
  await mkdir(dirname(outputPath), { recursive: true });
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 12 })
    .png()
    .toFile(outputPath);
}

for (const src of jobs) {
  const out = src.replace("-src.jpg", "-cutout.png");
  await executeCutout(resolve(srcDir, src), resolve(outDir, out));
  console.log("OK", out);
}
