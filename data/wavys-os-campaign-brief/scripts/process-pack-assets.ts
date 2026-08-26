/**
 * Crop + white-background cutout for pack brief Gemini assets.
 * Usage: bun run scripts/process-pack-assets.ts
 */
import sharp from "sharp";
import { mkdir, copyFile } from "fs/promises";
import { dirname, join, resolve } from "path";

const root = resolve(import.meta.dir, "../../..");
const srcDir = join(root, "data/generated-images/wavys-os-briefs");
const outRoot = join(root, "data/wavys-os-campaign-brief/assets/packs");

type Job = {
  readonly pack: "tienda" | "salon" | "restaurante";
  readonly src: string;
  readonly out: string;
  readonly mode: "cutout" | "scene";
};

const jobs: readonly Job[] = [
  { pack: "tienda", src: "tienda-cover-src.jpg", out: "cover-cutout.png", mode: "cutout" },
  { pack: "tienda", src: "tienda-cta-src.jpg", out: "cta-cutout.png", mode: "cutout" },
  { pack: "tienda", src: "tienda-scene-src.jpg", out: "scene.jpg", mode: "scene" },
  { pack: "salon", src: "salon-cover-src.jpg", out: "cover-cutout.png", mode: "cutout" },
  { pack: "salon", src: "salon-cta-src.jpg", out: "cta-cutout.png", mode: "cutout" },
  { pack: "salon", src: "salon-scene-src.jpg", out: "scene.jpg", mode: "scene" },
  { pack: "restaurante", src: "restaurante-cover-src.jpg", out: "cover-cutout.png", mode: "cutout" },
  { pack: "restaurante", src: "restaurante-cta-src.jpg", out: "cta-cutout.png", mode: "cutout" },
  { pack: "restaurante", src: "restaurante-scene-src.jpg", out: "scene.jpg", mode: "scene" },
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

async function executeSceneCrop(inputPath: string, outputPath: string): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true });
  await sharp(inputPath)
    .resize(1600, 900, { fit: "cover", position: "attention" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outputPath);
}

async function main(): Promise<void> {
  for (const job of jobs) {
    const inputPath = join(srcDir, job.src);
    const outputPath = join(outRoot, job.pack, job.out);
    if (job.mode === "cutout") {
      await executeCutout(inputPath, outputPath);
    } else {
      await executeSceneCrop(inputPath, outputPath);
    }
    console.log("OK", job.pack, job.out);
  }
  // Keep a copy of sources next to packs for audit trail
  for (const job of jobs) {
    const dest = join(outRoot, job.pack, `src-${job.src}`);
    await copyFile(join(srcDir, job.src), dest);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
