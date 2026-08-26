import { mkdir, readFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { CANVAS, briefSchema, type Brief } from "./brief.js";

const repoRoot = resolve(import.meta.dirname, "../..");
const templatePath = resolve(
  repoRoot,
  "agent/design-kit/templates/template.html",
);
const logoPath = resolve(
  repoRoot,
  "data/brand-assets/logos/logo-wavys-technologies.png",
);

export type RenderInput = {
  brief?: unknown;
  briefPath?: string;
  outputPath?: string;
};

export type RenderResult = {
  slug: string;
  outputPath: string;
  canvas: { width: number; height: number };
  family: Brief["family"];
  channel: Brief["channel"];
  hookFontSize: number;
  checks: { name: string; passed: boolean; detail?: string }[];
};

function toFileUrl(p: string) {
  return pathToFileURL(isAbsolute(p) ? p : resolve(repoRoot, p)).href;
}

export async function renderDesign(input: RenderInput): Promise<RenderResult> {
  if (!input.brief && !input.briefPath) {
    throw new Error("Pasa 'brief' (objeto) o 'briefPath' (ruta a un .json)");
  }

  const raw = input.briefPath
    ? JSON.parse(
        await readFile(
          isAbsolute(input.briefPath)
            ? input.briefPath
            : resolve(repoRoot, input.briefPath),
          "utf8",
        ),
      )
    : input.brief;

  const brief = briefSchema.parse(raw);
  const canvas = CANVAS[brief.channel];

  const outputPath = resolve(
    repoRoot,
    input.outputPath ??
      `data/design-out/${brief.slug}-${canvas.width}x${canvas.height}.png`,
  );
  await mkdir(dirname(outputPath), { recursive: true });

  const assets: Record<string, string> = {};
  if (brief.logo) assets.logo = toFileUrl(logoPath);
  if (brief.asset) {
    const url = toFileUrl(brief.asset.path);
    if (brief.asset.placement === "background") assets.background = url;
    else assets.float = url;
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: canvas,
      deviceScaleFactor: 1,
    });

    await page.addInitScript(
      ([b, c, a]) => {
        Object.assign(window, { __BRIEF__: b, __CANVAS__: c, __ASSETS__: a });
      },
      [brief, canvas, assets] as const,
    );

    await page.goto(pathToFileURL(templatePath).href, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(() => window.__READY__ === true, null, {
      timeout: 15_000,
    });

    const measured = await page.evaluate(() => {
      const card = document.querySelector(".card") as HTMLElement;
      const hook = document.querySelector(".hook") as HTMLElement;
      return {
        cardOverflow: card.scrollHeight - card.clientHeight,
        hookOverflow: hook.scrollWidth - hook.clientWidth,
        hookFontSize: parseFloat(getComputedStyle(hook).fontSize),
      };
    });

    await page.screenshot({ path: outputPath, type: "png" });

    const checks = [
      {
        name: "contenido dentro de la card",
        passed: measured.cardOverflow <= 1,
        detail:
          measured.cardOverflow > 1
            ? `desborda ${measured.cardOverflow}px — acorta body o proof`
            : undefined,
      },
      {
        name: "titular sin corte horizontal",
        passed: measured.hookOverflow <= 1,
        detail:
          measured.hookOverflow > 1
            ? `hook excede ${measured.hookOverflow}px — acorta hook.line1/line2`
            : undefined,
      },
      {
        name: "titular mantiene jerarquía",
        passed: measured.hookFontSize >= 56,
        detail:
          measured.hookFontSize < 56
            ? `hook bajó a ${measured.hookFontSize}px — el texto es demasiado largo`
            : undefined,
      },
    ];

    return {
      slug: brief.slug,
      outputPath,
      canvas,
      family: brief.family,
      channel: brief.channel,
      hookFontSize: measured.hookFontSize,
      checks,
    };
  } finally {
    await browser.close();
  }
}

declare global {
  interface Window {
    __READY__?: boolean;
  }
}
