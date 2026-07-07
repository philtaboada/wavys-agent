import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import sharp from "sharp";
import type { CheckResult, CheckTier, ValidationOutput } from "./types.js";

export function check(
  id: string,
  tier: CheckTier,
  pass: boolean,
  message: string,
  measured?: string,
  manual = false,
): CheckResult {
  return { id, tier, pass, message, measured, manual };
}

export function fileExists(path: string | undefined): boolean {
  return Boolean(path && existsSync(path));
}

export function readText(path: string): string {
  return readFileSync(path, "utf8");
}

export function grepDir(
  dir: string,
  pattern: RegExp,
  extensions = [".tsx", ".ts", ".astro", ".jsx", ".js", ".css"],
): number {
  if (!existsSync(dir)) return 0;
  let count = 0;
  walk(dir, (file) => {
    if (!extensions.includes(extname(file))) return;
    if (pattern.test(readFileSync(file, "utf8"))) count++;
  });
  return count;
}

function walk(dir: string, onFile: (path: string) => void) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    if (entry.isDirectory()) walk(full, onFile);
    else onFile(full);
  }
}

export function countUrls(text: string): number {
  return (text.match(/https?:\/\//g) ?? []).length;
}

export function countImages(dir: string): number {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).length;
}

export function mtime(path: string): number {
  return statSync(path).mtimeMs;
}

export function runBunBuild(projectPath: string): { pass: boolean; measured: string } {
  try {
    execSync("bun run build", {
      cwd: projectPath,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 120_000,
    });
    return { pass: true, measured: "exit 0" };
  } catch (err) {
    const msg =
      err instanceof Error && "stderr" in err
        ? String((err as { stderr?: Buffer }).stderr ?? err.message)
        : String(err);
    return { pass: false, measured: msg.slice(0, 400) };
  }
}

export async function pngHasAlpha(path: string): Promise<boolean> {
  const meta = await sharp(path).metadata();
  return Boolean(meta.hasAlpha);
}

export function imageDimensions(path: string): { width: number; height: number } | null {
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight "${path}"`, {
      encoding: "utf8",
    });
    const w = out.match(/pixelWidth:\s*(\d+)/)?.[1];
    const h = out.match(/pixelHeight:\s*(\d+)/)?.[1];
    if (!w || !h) return null;
    return { width: Number(w), height: Number(h) };
  } catch {
    return null;
  }
}

export function findPatternsDoc(repoRoot: string, slug: string): string | undefined {
  const ctxDir = join(repoRoot, "agent/context");
  if (!existsSync(ctxDir)) return undefined;

  const files = readdirSync(ctxDir).filter((f) => f.startsWith("design-patterns-"));
  const byName = files.find((f) => f.startsWith(`design-patterns-${slug}`));
  if (byName) return join(ctxDir, byName);

  const implNeedle = `/projects/${slug}`;
  for (const f of files) {
    const text = readFileSync(join(ctxDir, f), "utf8");
    if (text.includes(implNeedle)) return join(ctxDir, f);
  }

  return undefined;
}

export function summarizeChecks(checks: CheckResult[]) {
  const tiers = ["CRITICAL", "HIGH", "MEDIUM"] as const;
  const summary = {} as ValidationOutput["summary"];

  for (const tier of tiers) {
    const subset = checks.filter((c) => c.tier === tier && !c.manual);
    const pass = subset.filter((c) => c.pass).length;
    const total = subset.length;
    summary[tier.toLowerCase() as "critical" | "high" | "medium"] = {
      total,
      pass,
      fail: total - pass,
      pct: total ? Math.round((pass / total) * 100) : 100,
    };
  }

  const criticalOk = summary.critical.fail === 0;
  const highOk = summary.high.pct >= 95;
  const authorized = criticalOk && highOk;

  const manualRemaining = checks.filter((c) => c.manual).map((c) => c.id);

  return { summary, authorized, manualRemaining };
}

export function formatReport(output: ValidationOutput): string {
  const lines = [
    `# Pipeline validation — ${output.slug}`,
    `Pipeline: ${output.pipeline}`,
    `Authorized: ${output.authorized ? "✅ Sí" : "❌ No"}`,
    "",
    "## Summary",
    `- CRITICAL: ${output.summary.critical.pass}/${output.summary.critical.total}`,
    `- HIGH: ${output.summary.high.pass}/${output.summary.high.total} (${output.summary.high.pct}%)`,
    `- MEDIUM: ${output.summary.medium.pass}/${output.summary.medium.total}`,
    "",
    "## Checks",
    "| ID | Tier | Pass | Measured | Message |",
    "|----|------|------|----------|---------|",
  ];

  for (const c of output.checks) {
    lines.push(
      `| ${c.id} | ${c.tier} | ${c.pass ? "✅" : "❌"} | ${c.measured ?? ""} | ${c.message.replace(/\|/g, "\\|")} |`,
    );
  }

  if (output.manualRemaining.length) {
    lines.push("", "## Manual / browser required", output.manualRemaining.join(", "));
  }

  return `${lines.join("\n")}\n`;
}
