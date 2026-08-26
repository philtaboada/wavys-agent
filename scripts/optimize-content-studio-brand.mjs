import { readdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const DIR =
  "/Volumes/mac externo/Mac Externo/projects/content-studio/public/brand";

const TARGETS = {
  "auth-aurora.jpg": 1200,
  "hero-dashboard.jpg": 1600,
  "empty-ideas.jpg": 640,
  "empty-content.jpg": 640,
  "empty-assets.jpg": 640,
};

for (const [file, width] of Object.entries(TARGETS)) {
  const input = join(DIR, file);
  const output = input.replace(/\.jpg$/, ".webp");
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);
  console.log(`${file} -> ${output.split("/").pop()} ${(info.size / 1024).toFixed(0)}KB`);
  await unlink(input);
}

console.log(await readdir(DIR));
