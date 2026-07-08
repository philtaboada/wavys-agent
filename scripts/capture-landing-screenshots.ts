#!/usr/bin/env tsx
/**
 * Captura screenshots 390px y 1440px de un landing en preview local.
 * Uso: tsx scripts/capture-landing-screenshots.ts <slug> [url]
 */
import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import { resolveProjectsRoot } from "../lib/projects-root.js";

const slug = process.argv[2];
const url = process.argv[3] ?? "http://127.0.0.1:4321";
const projectsRoot = resolveProjectsRoot();
const repoRoot = resolve(import.meta.dirname, "..");
const outDir = join(repoRoot, "data/pipeline-runs");

if (!slug) {
  console.error("Usage: tsx scripts/capture-landing-screenshots.ts <slug> [url]");
  process.exit(1);
}

const projectPath = join(projectsRoot, slug);
if (!existsSync(projectPath)) {
  console.error(`Proyecto no encontrado: ${projectPath}`);
  process.exit(1);
}

console.log(`Building ${slug}...`);
execSync("bun run build", { cwd: projectPath, stdio: "inherit" });

const preview = spawn("bun", ["run", "preview", "--host", "127.0.0.1", "--port", "4321"], {
  cwd: projectPath,
  stdio: "pipe",
});

await new Promise((r) => setTimeout(r, 2500));

try {
  const browser = await chromium.launch({ headless: true });

  for (const [width, suffix] of [
    [390, "390"],
    [1440, "1440"],
  ] as const) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(1500);
    const outPath = join(outDir, `${slug}-${suffix}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved ${outPath}`);
    await page.close();
  }

  await browser.close();
} finally {
  preview.kill();
}
