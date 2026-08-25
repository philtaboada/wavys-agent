import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type Page as PwPage } from "playwright";
import {
  PAGE,
  PLACEHOLDER_PATTERNS,
  issueSchema,
  type Issue,
  type Page,
} from "./issue.js";

const repoRoot = resolve(import.meta.dirname, "../..");
const templatePath = resolve(repoRoot, "agent/radar-kit/templates/page.html");

/** Aire tolerable entre el último bloque y el folio antes de que la página se
 *  lea como inacabada. Por encima de esto fue exactamente lo que pasó en la
 *  N°2 que armó el bot. */
const MAX_TRAILING_GAP = 260;

export type Check = {
  page: string;
  name: string;
  passed: boolean;
  detail?: string;
};

export type RenderIssueResult = {
  slug: string;
  outDir: string;
  pdfPath: string;
  pages: { file: string; type: Page["type"]; folio: number }[];
  checks: Check[];
  ok: boolean;
};

function abs(p: string) {
  return isAbsolute(p) ? p : resolve(repoRoot, p);
}

function fileUrl(p: string) {
  return pathToFileURL(abs(p)).href;
}

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) collectStrings(v, out);
  else if (value && typeof value === "object")
    for (const v of Object.values(value)) collectStrings(v, out);
  return out;
}

function pageAssets(page: Page) {
  const assets: Record<string, unknown> = {};
  if ("image" in page && page.image) assets.image = fileUrl(page.image);
  if (page.type === "tema-casos" && page.closer)
    assets.closer = fileUrl(page.closer.image);
  if (page.type === "tablero") assets.charts = page.charts.map(fileUrl);
  return assets;
}

function missingImages(page: Page): string[] {
  const paths: string[] = [];
  if ("image" in page && page.image) paths.push(page.image);
  if (page.type === "tema-casos" && page.closer) paths.push(page.closer.image);
  if (page.type === "tablero") paths.push(...page.charts);
  return paths.filter((p) => !existsSync(abs(p)));
}

async function measure(pw: PwPage) {
  return pw.evaluate(() => {
    const art = document.querySelector(".page") as HTMLElement;
    const stack = document.querySelector(".stack") as HTMLElement;
    const inner = document.querySelector(".stack__inner") as HTMLElement;
    const folio = document.querySelector(".folio") as HTMLElement | null;

    // Punto más bajo ocupado por contenido real dentro del stack.
    // Recorrido iterativo: una función nombrada aquí rompe al transpilar.
    let lowest = 0;
    const queue: Element[] = Array.from(inner.children);
    while (queue.length) {
      const child = queue.shift() as Element;
      const box = child.getBoundingClientRect();
      const hasInk =
        (child.textContent ?? "").trim().length > 0 || child.tagName === "IMG";
      if (hasInk && box.height > 0) lowest = Math.max(lowest, box.bottom);
      queue.push(...Array.from(child.children));
    }

    const limit = folio
      ? folio.getBoundingClientRect().top
      : art.getBoundingClientRect().bottom;

    return {
      overflow: window.__OVERFLOW__ ?? 0,
      trailingGap: Math.round(limit - lowest),
      pageHeight: Math.round(art.getBoundingClientRect().height),
      fit: window.__FIT__ ?? 1,
    };
  });
}

export async function renderIssue(input: {
  issue?: unknown;
  issuePath?: string;
  outDir?: string;
}): Promise<RenderIssueResult> {
  if (!input.issue && !input.issuePath) {
    throw new Error("Pasa 'issue' (objeto) o 'issuePath' (ruta a un .json)");
  }

  const raw = input.issuePath
    ? JSON.parse(await readFile(abs(input.issuePath), "utf8"))
    : input.issue;

  const issue: Issue = issueSchema.parse(raw);
  const outDir = abs(input.outDir ?? `data/radar-out/${issue.slug}`);
  await mkdir(outDir, { recursive: true });

  const checks: Check[] = [];

  // Placeholders: se revisan sobre el contrato, antes de gastar un render.
  for (const [i, page] of issue.pages.entries()) {
    const label = `${String(i + 1).padStart(2, "0")}-${page.type}`;
    const hits = collectStrings(page).filter((s) =>
      PLACEHOLDER_PATTERNS.some((re) => re.test(s)),
    );
    checks.push({
      page: label,
      name: "sin texto de relleno",
      passed: hits.length === 0,
      detail: hits.length ? `relleno detectado: "${hits[0]}"` : undefined,
    });

    const missing = missingImages(page);
    checks.push({
      page: label,
      name: "imágenes existen",
      passed: missing.length === 0,
      detail: missing.length ? `no encontrado: ${missing.join(", ")}` : undefined,
    });
  }

  const browser = await chromium.launch({ headless: true });
  const pages: RenderIssueResult["pages"] = [];

  try {
    for (const [i, page] of issue.pages.entries()) {
      const folio = i + 1;
      const label = `${String(folio).padStart(2, "0")}-${page.type}`;
      const payload = { ...page, __folio: folio, __tick: i };

      // Una pestaña por hoja: addInitScript se acumula y contaminaría la siguiente.
      const pw = await browser.newPage({ viewport: PAGE, deviceScaleFactor: 1 });
      await pw.addInitScript(
        ([p, is, as]) => {
          Object.assign(window, { __PAGE__: p, __ISSUE__: is, __ASSETS__: as });
        },
        [payload, issue, pageAssets(page)] as const,
      );

      await pw.goto(pathToFileURL(templatePath).href, {
        waitUntil: "domcontentloaded",
      });
      await pw.waitForFunction(() => window.__READY__ === true, null, {
        timeout: 20_000,
      });

      const m = await measure(pw);
      const file = `${label}.png`;
      await pw.screenshot({ path: resolve(outDir, file), type: "png" });
      pages.push({ file, type: page.type, folio });

      checks.push({
        page: label,
        name: "contenido cabe en la página",
        passed: m.overflow <= 1,
        detail:
          m.overflow > 1
            ? `desborda ${m.overflow}px incluso al ${Math.round(m.fit * 100)}% — acorta el texto de esta sección`
            : m.fit < 1
              ? `entra al ${Math.round(m.fit * 100)}%`
              : undefined,
      });

      checks.push({
        page: label,
        name: "página sin hueco muerto",
        passed: m.trailingGap <= MAX_TRAILING_GAP,
        detail:
          m.trailingGap > MAX_TRAILING_GAP
            ? `${m.trailingGap}px vacíos antes del folio — falta contenido o una foto`
            : undefined,
      });

      await pw.close();
    }
  } finally {
    await browser.close();
  }

  const pdfPath = await buildPdf(outDir, pages, issue);
  const ok = checks.every((c) => c.passed);

  return { slug: issue.slug, outDir, pdfPath, pages, checks, ok };
}

async function buildPdf(
  outDir: string,
  pages: RenderIssueResult["pages"],
  issue: Issue,
) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: ${PAGE.width}px ${PAGE.height}px; margin: 0; }
    html,body { margin:0; padding:0; background:#070604; }
    img { display:block; width:${PAGE.width}px; height:${PAGE.height}px; break-after: page; }
    img:last-child { break-after: auto; }
  </style></head><body>${pages
    .map((p) => `<img src="${p.file}">`)
    .join("")}</body></html>`;

  const indexPath = resolve(outDir, "_print.html");
  await writeFile(indexPath, html, "utf8");

  const browser = await chromium.launch({ headless: true });
  try {
    const pw = await browser.newPage();
    await pw.goto(pathToFileURL(indexPath).href, { waitUntil: "networkidle" });
    const pdfPath = resolve(outDir, `radar-n${issue.number}.pdf`);
    await pw.pdf({
      path: pdfPath,
      width: `${PAGE.width}px`,
      height: `${PAGE.height}px`,
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    return pdfPath;
  } finally {
    await browser.close();
  }
}

declare global {
  interface Window {
    __READY__?: boolean;
    __FIT__?: number;
    __OVERFLOW__?: number;
  }
}
