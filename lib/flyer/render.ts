import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import QRCode from "qrcode";
import {
  BG_PHOTO_LAYOUTS,
  FORMAT,
  GAP_LIMIT,
  MIN_TITLE_PX,
  PLACEHOLDER_PATTERNS,
  flyerSchema,
  type Flyer,
  type FormatName,
} from "./flyer.js";

const repoRoot = resolve(import.meta.dirname, "../..");
const templatePath = resolve(repoRoot, "agent/flyer-kit/templates/flyer.html");
const logosDir = resolve(repoRoot, "data/brand-assets/logos");

export type Check = {
  name: string;
  passed: boolean;
  detail?: string;
};

export type RenderFlyerResult = {
  slug: string;
  layout: Flyer["layout"];
  format: FormatName;
  canvas: { width: number; height: number };
  pngPath: string;
  pdfPath?: string;
  measured: Measured;
  checks: Check[];
  ok: boolean;
};

type Measured = {
  fit: number;
  overflow: number;
  trailingGap: number;
  innerGap: number;
  titlePx: number;
  titleLines: number;
  widow: string | null;
  dekWidow: string | null;
  brandbarTop: number;
  footBottom: number;
  height: number;
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

/**
 * El QR existe porque un flyer impreso se escanea; nadie teclea una URL desde
 * un papel. Se dibuja en negro sobre blanco y con margen propio: un QR con el
 * acento de marca o sin zona de silencio deja de leerse en la mitad de los
 * teléfonos.
 */
async function qrDataUrl(url: string) {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 0,
    width: 360,
    color: { dark: "#000000ff", light: "#ffffffff" },
  });
}

export async function renderFlyer(input: {
  flyer?: unknown;
  flyerPath?: string;
  outputPath?: string;
}): Promise<RenderFlyerResult> {
  if (!input.flyer && !input.flyerPath) {
    throw new Error("Pasa 'flyer' (objeto) o 'flyerPath' (ruta a un .json)");
  }

  const raw = input.flyerPath
    ? JSON.parse(await readFile(abs(input.flyerPath), "utf8"))
    : input.flyer;

  const flyer = flyerSchema.parse(raw);
  const format = FORMAT[flyer.format];
  const canvas = { width: format.width, height: format.height };

  const pngPath = abs(
    input.outputPath ??
      `data/flyer-out/${flyer.slug}-${flyer.layout}-${canvas.width}x${canvas.height}.png`,
  );
  await mkdir(dirname(pngPath), { recursive: true });

  const checks: Check[] = [];

  // Relleno: se revisa sobre el contrato, antes de gastar un render.
  const hits = collectStrings(flyer).filter((s) =>
    PLACEHOLDER_PATTERNS.some((re) => re.test(s)),
  );
  checks.push({
    name: "sin texto de relleno",
    passed: hits.length === 0,
    detail: hits.length ? `relleno detectado: "${hits[0]}"` : undefined,
  });

  const imageExists = existsSync(abs(flyer.image));
  checks.push({
    name: "la foto existe",
    passed: imageExists,
    detail: imageExists ? undefined : `no encontrado: ${flyer.image}`,
  });
  if (!imageExists) {
    throw new Error(
      `La foto ${flyer.image} no existe. Genérala con generate_image o corrige la ruta: sin foto no hay flyer.`,
    );
  }

  const assets: Record<string, string> = {
    image: fileUrl(flyer.image),
    logo: fileUrl(resolve(logosDir, "logo-wavys-technologies.png")),
    isotipo: fileUrl(resolve(logosDir, "isotipo.png")),
  };
  if (flyer.cta.url && flyer.cta.qr) {
    assets.qr = await qrDataUrl(flyer.cta.url);
  }

  const browser = await chromium.launch({ headless: true });
  let measured: Measured;

  try {
    const page = await browser.newPage({ viewport: canvas, deviceScaleFactor: 1 });
    await page.addInitScript(
      ([f, fmt, as, minTitle]) => {
        Object.assign(window, {
          __FLYER__: f,
          __FORMAT__: fmt,
          __ASSETS__: as,
          __MIN_TITLE__: minTitle,
        });
      },
      [flyer, format, assets, MIN_TITLE_PX[flyer.format]] as const,
    );

    await page.goto(pathToFileURL(templatePath).href, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(() => window.__READY__ === true, null, {
      timeout: 20_000,
    });

    measured = (await page.evaluate(() => window.__M__)) as Measured;
    await page.screenshot({ path: pngPath, type: "png" });
  } finally {
    await browser.close();
  }

  // Aire tolerable antes del pie. Proporcional al lienzo —200px sobran en un
  // cuadrado y no se notan en un story— y más generoso cuando detrás hay foto.
  const overPhoto = BG_PHOTO_LAYOUTS.has(flyer.layout);
  const maxGap = Math.round(
    canvas.height * (overPhoto ? GAP_LIMIT.overPhoto : GAP_LIMIT.overFlat),
  );

  checks.push({
    name: "el contenido cabe",
    passed: measured.overflow <= 1,
    detail:
      measured.overflow > 1
        ? `desborda ${measured.overflow}px incluso al ${Math.round(measured.fit * 100)}% — acorta el texto`
        : measured.fit < 1
          ? `entra al ${Math.round(measured.fit * 100)}%`
          : undefined,
  });

  checks.push({
    name: "sin hueco muerto al pie",
    passed: measured.trailingGap <= maxGap,
    detail:
      measured.trailingGap > maxGap
        ? `${measured.trailingGap}px vacíos antes del pie (máx ${maxGap}) — falta contenido, un bullet más o una foto con más peso`
        : undefined,
  });

  // Hueco entre bloques. Anclar el último bloque al pie no lo elimina: lo
  // traslada al medio, donde sobre fondo plano se ve igual de mal.
  const maxInnerGap = Math.round(
    canvas.height *
      (overPhoto ? GAP_LIMIT.overPhoto : GAP_LIMIT.betweenBlocksOverFlat),
  );
  checks.push({
    name: "sin hueco muerto en medio",
    passed: measured.innerGap <= maxInnerGap,
    detail:
      measured.innerGap > maxInnerGap
        ? `${measured.innerGap}px vacíos entre dos bloques (máx ${maxInnerGap}) — el layout necesita más contenido en esa zona`
        : undefined,
  });

  const minTitle = MIN_TITLE_PX[flyer.format];
  checks.push({
    name: "el titular manda",
    passed: measured.titlePx >= minTitle,
    detail:
      measured.titlePx < minTitle
        ? `el titular bajó a ${measured.titlePx}px (mínimo ${minTitle}) en ${measured.titleLines} líneas — el texto es demasiado largo para dominar la pieza`
        : undefined,
  });

  checks.push({
    name: "titular sin viuda",
    passed: measured.widow === null,
    detail: measured.widow
      ? `"${measured.widow}" queda solo en la última línea del titular — reescribe o acorta para que la última línea lleve al menos dos palabras`
      : undefined,
  });

  checks.push({
    name: "párrafo sin viuda",
    passed: measured.dekWidow === null,
    detail: measured.dekWidow
      ? `"${measured.dekWidow}" queda solo en la última línea del párrafo — quita o agrega una palabra al dek`
      : undefined,
  });

  const safeOk =
    measured.brandbarTop >= format.safeTop &&
    measured.footBottom <= canvas.height - format.safeBottom;
  checks.push({
    name: "zonas seguras del formato",
    passed: safeOk,
    detail: safeOk
      ? undefined
      : `contenido dentro de la franja que tapa la interfaz de la app (arriba ${format.safeTop}px, abajo ${format.safeBottom}px)`,
  });

  let pdfPath: string | undefined;
  if (format.printable) pdfPath = await buildPdf(pngPath, canvas);

  return {
    slug: flyer.slug,
    layout: flyer.layout,
    format: flyer.format,
    canvas,
    pngPath,
    pdfPath,
    measured,
    checks,
    ok: checks.every((c) => c.passed),
  };
}

/** PDF de una hoja para imprimir o mandar por WhatsApp sin recompresión. */
async function buildPdf(pngPath: string, canvas: { width: number; height: number }) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: ${canvas.width}px ${canvas.height}px; margin: 0; }
    html,body { margin:0; padding:0; }
    img { display:block; width:${canvas.width}px; height:${canvas.height}px; }
  </style></head><body><img src="${pathToFileURL(pngPath).href}"></body></html>`;

  const indexPath = pngPath.replace(/\.png$/, "_print.html");
  await writeFile(indexPath, html, "utf8");

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(indexPath).href, { waitUntil: "networkidle" });
    const pdfPath = pngPath.replace(/\.png$/, ".pdf");
    await page.pdf({
      path: pdfPath,
      width: `${canvas.width}px`,
      height: `${canvas.height}px`,
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
    __M__?: unknown;
  }
}
