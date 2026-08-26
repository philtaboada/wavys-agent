import { execFile } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { chromium, type Browser } from "playwright";
import {
  FORMATS,
  PLACEHOLDER_PATTERNS,
  clipAssets,
  clipStrings,
  reelSchema,
  type Clip,
  type Reel,
} from "./clip.js";

const run = promisify(execFile);

const repoRoot = resolve(import.meta.dirname, "../..");
const kitDir = resolve(repoRoot, "agent/motion-kit");
const templatePath = resolve(kitDir, "templates/scene.html");
const vendorPath = resolve(kitDir, "vendor/gsap.min.js");
const gsapSource = resolve(repoRoot, "node_modules/gsap/dist/gsap.min.js");
// La versión chica (98px de ancho) se estiraba en el outro, donde el logo se
// dibuja a 96px de alto. En video un logo interpolado se ve blando enseguida.
const logoPath = resolve(
  repoRoot,
  "data/brand-assets/logos/logo-wavys-technologies.png",
);

export type RenderInput = {
  reel?: unknown;
  reelPath?: string;
  outDir?: string;
  /** Ids de clip a renderizar. Sirve para iterar uno solo sin rehacer el reel. */
  only?: string[];
  /** Deja los PNG por frame en disco para inspección o para reencodar a mano. */
  keepFrames?: boolean;
  /** Suma un WebM con alfa además del .mov (útil para web). */
  webm?: boolean;
};

type Check = { name: string; passed: boolean; detail?: string };

type ClipResult = {
  index: number;
  id: string;
  type: Clip["type"];
  file: string;
  poster: string;
  strip: string;
  webm?: string;
  duration: number;
  frames: number;
  /** Si el archivo lleva canal alfa. El editor necesita saberlo para keyearlo. */
  alpha: boolean;
  startsAt: number;
  endsAt: number;
  checks: Check[];
};

export type RenderResult = {
  ok: boolean;
  slug: string;
  outDir: string;
  format: Reel["format"];
  canvas: { width: number; height: number };
  fps: number;
  transparent: boolean;
  totalDuration: number;
  clips: ClipResult[];
  reelFile?: string;
  manifest: string;
  checks: Check[];
  /** Avisos que no son defectos: explican por qué falta el archivo pegado. */
  notes: string[];
};

type Metrics = {
  duration: number;
  restTime: number;
  overflowY: number;
  overflowX: number;
  minFontSize: number | null;
  brokenImages: string[];
  upscaled: string[];
};

function abs(p: string) {
  return isAbsolute(p) ? p : resolve(repoRoot, p);
}

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureGsap() {
  if (await exists(vendorPath)) return;
  if (!(await exists(gsapSource))) {
    throw new Error(
      "Falta GSAP. Corré `npm install` en la raíz del repo antes de renderizar.",
    );
  }
  await mkdir(resolve(kitDir, "vendor"), { recursive: true });
  await writeFile(vendorPath, await readFile(gsapSource));
}

async function ensureFfmpeg() {
  try {
    await run("ffmpeg", ["-version"]);
  } catch {
    throw new Error(
      "ffmpeg no está instalado. En macOS: `brew install ffmpeg`. Sin él se pueden generar los frames (keepFrames) pero no el video.",
    );
  }
}

/**
 * El error crudo de Zod nombra el clip por índice (`clips.7.title`), que no le
 * dice nada a quien escribió el contrato. Se traduce a id de clip para poder
 * devolverle el mensaje tal cual a quien lo redactó.
 */
function parseReel(raw: unknown): Reel {
  const parsed = reelSchema.safeParse(raw);
  if (parsed.success) return parsed.data;

  const clips = (raw as { clips?: { id?: string }[] })?.clips ?? [];

  const lines = parsed.error.issues.map((issue) => {
    const [head, index, ...rest] = issue.path;
    if (head === "clips" && typeof index === "number") {
      const id = clips[index]?.id ?? `#${index + 1}`;
      const field = rest.join(".");
      return `  clip "${id}"${field ? ` · ${field}` : ""}: ${issue.message}`;
    }
    return `  ${issue.path.join(".") || "(raíz)"}: ${issue.message}`;
  });

  throw new Error(`El contrato no valida:\n${[...new Set(lines)].join("\n")}`);
}

/** El bot puede mandar copy correcto en forma pero vacío en contenido. */
function findPlaceholders(reel: Reel) {
  const hits: string[] = [];
  for (const clip of reel.clips) {
    for (const value of clipStrings(clip)) {
      for (const pattern of PLACEHOLDER_PATTERNS) {
        if (pattern.test(value)) hits.push(`${clip.id}: "${value}"`);
      }
    }
  }
  return [...new Set(hits)];
}

/**
 * Mapa ruta declarada → file:// resuelto. Se valida antes de abrir el browser:
 * una imagen faltante en el frame 40 arruina el clip entero y cuesta minutos.
 */
async function resolveAssets(reel: Reel) {
  const map: Record<string, string> = {};
  const missing: string[] = [];

  for (const clip of reel.clips) {
    for (const path of clipAssets(clip)) {
      if (map[path]) continue;
      const full = abs(path);
      if (!(await exists(full))) {
        missing.push(`${clip.id} → ${path}`);
        continue;
      }
      map[path] = pathToFileURL(full).href;
    }
  }

  if (missing.length) {
    throw new Error(
      `Assets que no existen:\n  ${missing.join("\n  ")}\nGeneralos con generate_image o corregí la ruta.`,
    );
  }

  if (reel.logo && (await exists(logoPath))) {
    map.__logo = pathToFileURL(logoPath).href;
  }

  return map;
}

function pad(n: number, width = 2) {
  return String(n).padStart(width, "0");
}

/**
 * Un "recorte" cuyo alfa nunca llega a cero es un rectángulo semiopaco: sobre
 * el fondo oscuro se ve como una estampilla con su propio marco. Es un defecto
 * del asset, no del layout, y a ojo cuesta distinguirlo de un recorte bueno,
 * así que se mide el canal antes de gastar minutos de render.
 */
async function checkCutouts(reel: Reel): Promise<Check[]> {
  const checks: Check[] = [];

  for (const clip of reel.clips) {
    const images =
      clip.type === "cutout"
        ? [clip.image]
        : clip.type === "hook" && clip.cutout
          ? [clip.cutout]
          : [];

    for (const path of images) {
      const alpha = (await sharp(abs(path)).stats()).channels[3];
      const cut = alpha != null && alpha.min <= 16;
      checks.push({
        name: `${clip.id}: recorte con fondo transparente`,
        passed: cut,
        detail: cut
          ? undefined
          : `${path} no tiene zonas transparentes (alfa mínimo ${alpha?.min ?? "sin canal"}): se va a ver como una estampilla pegada. Rehacé el recorte con fondo real.`,
      });
    }
  }

  return checks;
}

async function encode(
  framePattern: string,
  fps: number,
  outFile: string,
  kind: "mp4" | "mov" | "webm",
) {
  const input = [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-framerate",
    String(fps),
    "-start_number",
    "0",
    "-i",
    framePattern,
  ];

  const codec = {
    mp4: [
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "17",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
    ],
    // ProRes 4444 es el formato que cualquier editor abre con el alfa intacto.
    mov: [
      "-c:v",
      "prores_ks",
      "-profile:v",
      "4444",
      "-pix_fmt",
      "yuva444p10le",
      "-vendor",
      "apl0",
    ],
    webm: [
      "-c:v",
      "libvpx-vp9",
      "-pix_fmt",
      "yuva420p",
      "-crf",
      "26",
      "-b:v",
      "0",
      "-row-mt",
      "1",
    ],
  }[kind];

  await run("ffmpeg", [...input, ...codec, outFile], {
    maxBuffer: 1024 * 1024 * 32,
  });
}

/**
 * Damero para revisar los clips con alfa. Sobre negro, un panel oscuro
 * translúcido se desvanece; sobre blanco aparece una caja gris que no existe en
 * el diseño. En los dos casos el poster deja de servir para opinar. El damero
 * muestra qué es transparente y qué no.
 */
function checkerboard(width: number, height: number, cell: number) {
  const step = cell * 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <pattern id="c" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
          <rect width="${step}" height="${step}" fill="#8c8c8c"/>
          <rect width="${cell}" height="${cell}" fill="#6b6b6b"/>
          <rect x="${cell}" y="${cell}" width="${cell}" height="${cell}" fill="#6b6b6b"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#c)"/>
    </svg>`,
  );
}

/**
 * Tira de contactos: 6 cuadros del clip en una sola imagen. Es lo que permite
 * revisar el arco de la animación (y que lo revise otro agente) sin ver video.
 */
async function buildStrip(
  framesDir: string,
  frameCount: number,
  canvas: { width: number; height: number },
  outFile: string,
  alpha: boolean,
) {
  const picks = [0.06, 0.24, 0.42, 0.6, 0.78, 0.94].map((r) =>
    Math.min(frameCount - 1, Math.max(0, Math.round(r * (frameCount - 1)))),
  );

  const thumbWidth = 320;
  const thumbHeight = Math.round((thumbWidth * canvas.height) / canvas.width);
  const gap = 8;

  const thumbs = await Promise.all(
    picks.map(async (frame) => {
      const shot = await sharp(join(framesDir, `${pad(frame, 5)}.png`))
        .resize(thumbWidth, thumbHeight, { fit: "contain" })
        .png()
        .toBuffer();

      if (!alpha) {
        return sharp(shot).flatten({ background: "#070604" }).png().toBuffer();
      }

      return sharp(checkerboard(thumbWidth, thumbHeight, 13))
        .composite([{ input: shot }])
        .png()
        .toBuffer();
    }),
  );

  await sharp({
    create: {
      width: thumbs.length * thumbWidth + (thumbs.length - 1) * gap,
      height: thumbHeight,
      channels: 3,
      background: alpha ? "#3d3d3d" : "#070604",
    },
  })
    .composite(
      thumbs.map((input, i) => ({ input, left: i * (thumbWidth + gap), top: 0 })),
    )
    .png()
    .toFile(outFile);
}

async function renderClip(
  browser: Browser,
  reel: Reel,
  clip: Clip,
  index: number,
  assets: Record<string, string>,
  outDir: string,
  input: RenderInput,
): Promise<ClipResult> {
  const canvas = FORMATS[reel.format];
  const label = `${pad(index)}-${clip.id}`;
  const framesDir = join(outDir, "frames", label);
  await mkdir(framesDir, { recursive: true });

  /**
   * La transparencia se decide por clip. Un reel con fondo puede incluir una
   * `lower-third`, que sin alfa no se puede montar sobre nada. La plantilla lee
   * `reel.transparent`, así que se le entrega el valor ya resuelto.
   */
  const alpha = clip.transparent ?? reel.transparent;
  const pageReel = { ...reel, transparent: alpha };

  // Una pestaña por clip: addInitScript se acumula y contaminaría al siguiente.
  const page = await browser.newPage({
    viewport: canvas,
    deviceScaleFactor: 1,
  });

  try {
    await page.addInitScript(
      ([c, r, cv, a]) => {
        Object.assign(window, {
          __CLIP__: c,
          __REEL__: r,
          __CANVAS__: cv,
          __ASSETS__: a,
        });
      },
      [clip, pageReel, canvas, assets] as const,
    );

    await page.goto(pathToFileURL(templatePath).href, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(() => window.__READY__ === true, null, {
      timeout: 25_000,
    });

    const metrics = (await page.evaluate(() =>
      window.__MEASURE__!(),
    )) as Metrics;

    const frameCount = Math.max(1, Math.round(metrics.duration * reel.fps));

    /**
     * Captura por CDP en vez de `page.screenshot`: `optimizeForSpeed` cambia el
     * nivel de compresión PNG y baja el costo por frame casi a la mitad. Los
     * frames son temporales, así que pesar más no importa. Los `writeFile` se
     * acumulan y se vacían por lotes para no esperar el disco en cada cuadro.
     */
    const cdp = await page.context().newCDPSession(page);
    if (alpha) {
      await cdp.send("Emulation.setDefaultBackgroundColorOverride", {
        color: { r: 0, g: 0, b: 0, a: 0 },
      });
    }

    const shotParams = {
      format: "png",
      captureBeyondViewport: false,
      optimizeForSpeed: true,
    } as Parameters<typeof cdp.send<"Page.captureScreenshot">>[1];

    const writes: Promise<void>[] = [];

    for (let frame = 0; frame < frameCount; frame++) {
      await page.evaluate((t) => window.__SEEK__!(t), frame / reel.fps);
      const shot = await cdp.send("Page.captureScreenshot", shotParams);
      writes.push(
        writeFile(
          join(framesDir, `${pad(frame, 5)}.png`),
          Buffer.from(shot.data, "base64"),
        ),
      );
      if (writes.length >= 32) await Promise.all(writes.splice(0));
    }

    await Promise.all(writes);

    const posterFile = `${label}.png`;
    await page.evaluate((t) => window.__SEEK__!(t), metrics.restTime);
    const poster = await page.screenshot({ type: "png", omitBackground: alpha });

    // El poster es material de revisión, no de entrega: el alfa ya viaja en el
    // .mov. Vale más poder juzgar la placa que conservarle el canal.
    if (alpha) {
      await sharp(checkerboard(canvas.width, canvas.height, 44))
        .composite([{ input: poster }])
        .png()
        .toFile(join(outDir, posterFile));
    } else {
      await writeFile(join(outDir, posterFile), poster);
    }

    const pattern = join(framesDir, "%05d.png");
    const primaryKind = alpha ? "mov" : "mp4";
    const primaryFile = `${label}.${primaryKind}`;
    await encode(pattern, reel.fps, join(outDir, primaryFile), primaryKind);

    let webmFile: string | undefined;
    if (input.webm && alpha) {
      webmFile = `${label}.webm`;
      await encode(pattern, reel.fps, join(outDir, webmFile), "webm");
    }

    const stripFile = `${label}-strip.png`;
    await buildStrip(
      framesDir,
      frameCount,
      canvas,
      join(outDir, stripFile),
      alpha,
    );

    if (!input.keepFrames) {
      await rm(framesDir, { recursive: true, force: true });
    }

    const checks: Check[] = [
      {
        name: `${clip.id}: assets cargan`,
        passed: metrics.brokenImages.length === 0,
        detail: metrics.brokenImages.length
          ? `no cargaron: ${metrics.brokenImages.join(", ")}`
          : undefined,
      },
      {
        name: `${clip.id}: contenido dentro del cuadro`,
        passed: metrics.overflowY <= 2,
        detail:
          metrics.overflowY > 2
            ? `desborda ${metrics.overflowY}px de alto — quitá un ítem o acortá el copy`
            : undefined,
      },
      {
        name: `${clip.id}: titulares sin corte`,
        passed: metrics.overflowX <= 2,
        detail:
          metrics.overflowX > 2
            ? `excede ${metrics.overflowX}px de ancho — acortá la línea más larga`
            : undefined,
      },
      {
        name: `${clip.id}: jerarquía tipográfica`,
        passed: metrics.minFontSize == null || metrics.minFontSize >= 34,
        detail:
          metrics.minFontSize != null && metrics.minFontSize < 34
            ? `el display bajó a ${metrics.minFontSize}px — el texto es demasiado largo para el formato`
            : undefined,
      },
      {
        name: `${clip.id}: imágenes a tamaño nativo`,
        passed: metrics.upscaled.length === 0,
        detail: metrics.upscaled.length
          ? `se estiran y se ven blandas en video: ${metrics.upscaled.join(", ")} — regenerá el asset más grande`
          : undefined,
      },
      {
        name: `${clip.id}: duración editable`,
        passed: metrics.duration >= 1.6 && metrics.duration <= 14,
        detail:
          metrics.duration < 1.6
            ? `${metrics.duration.toFixed(2)}s es muy corto para leerse — subí hold`
            : metrics.duration > 14
              ? `${metrics.duration.toFixed(2)}s es demasiado para un clip — partilo en dos`
              : undefined,
      },
    ];

    return {
      index,
      id: clip.id,
      type: clip.type,
      file: primaryFile,
      poster: posterFile,
      strip: stripFile,
      webm: webmFile,
      duration: Number(metrics.duration.toFixed(3)),
      frames: frameCount,
      alpha,
      startsAt: 0,
      endsAt: 0,
      checks,
    };
  } finally {
    await page.close();
  }
}

export async function renderMotion(input: RenderInput): Promise<RenderResult> {
  if (!input.reel && !input.reelPath) {
    throw new Error("Pasa 'reel' (objeto) o 'reelPath' (ruta a un .json)");
  }

  const raw = input.reelPath
    ? JSON.parse(await readFile(abs(input.reelPath), "utf8"))
    : input.reel;

  const reel = parseReel(raw);

  const ids = reel.clips.map((c) => c.id);
  const duplicated = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicated.length) {
    throw new Error(
      `Ids de clip repetidos: ${[...new Set(duplicated)].join(", ")}. Cada clip es un archivo, necesita nombre propio.`,
    );
  }

  const placeholders = findPlaceholders(reel);
  if (placeholders.length) {
    throw new Error(
      `Texto de relleno en el contrato:\n  ${placeholders.join("\n  ")}\nEscribí el copy real antes de renderizar.`,
    );
  }

  const canvas = FORMATS[reel.format];
  const outDir = abs(input.outDir ?? `data/motion-out/${reel.slug}`);
  await mkdir(outDir, { recursive: true });

  await ensureGsap();
  await ensureFfmpeg();
  const assets = await resolveAssets(reel);

  const wanted = input.only?.length
    ? reel.clips.filter((c) => input.only!.includes(c.id))
    : reel.clips;

  if (!wanted.length) {
    throw new Error(
      `Ningún clip coincide con only: ${input.only?.join(", ")}. Ids disponibles: ${ids.join(", ")}`,
    );
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--force-color-profile=srgb",
      // El antialias subpixel tiñe los bordes de las letras de rojo y azul,
      // que en video comprimido se ve como suciedad alrededor del texto.
      "--disable-lcd-text",
      "--font-render-hinting=none",
    ],
  });

  const clips: ClipResult[] = [];

  try {
    for (const clip of wanted) {
      const index = reel.clips.indexOf(clip) + 1;
      process.stderr.write(
        `[motion] ${pad(index)}/${pad(reel.clips.length)} ${clip.id} (${clip.type})…\n`,
      );
      clips.push(
        await renderClip(browser, reel, clip, index, assets, outDir, input),
      );
    }
  } finally {
    await browser.close();
  }

  // Timecodes acumulados: son los puntos de corte para montar el video largo.
  let cursor = 0;
  for (const clip of clips) {
    clip.startsAt = Number(cursor.toFixed(3));
    cursor += clip.duration;
    clip.endsAt = Number(cursor.toFixed(3));
  }

  if (!input.keepFrames) {
    await rm(join(outDir, "frames"), { recursive: true, force: true });
  }

  let reelFile: string | undefined;
  const full = clips.length === reel.clips.length;

  // Los clips con alfa y los opacos no se pueden pegar con `-c copy`: son
  // códecs distintos. Si el reel mezcla, se entregan sueltos y se avisa.
  const mixedAlpha = clips.some((c) => c.alpha !== clips[0].alpha);

  if (reel.concat && full && clips.length > 1 && !mixedAlpha) {
    const ext = clips[0].alpha ? "mov" : "mp4";
    const listPath = join(outDir, "_concat.txt");
    await writeFile(
      listPath,
      clips.map((c) => `file '${c.file}'`).join("\n"),
      "utf8",
    );
    reelFile = `reel.${ext}`;
    await run(
      "ffmpeg",
      [
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        listPath,
        "-c",
        "copy",
        join(outDir, reelFile),
      ],
      { maxBuffer: 1024 * 1024 * 32 },
    );
  }

  const totalDuration = Number(
    clips.reduce((sum, c) => sum + c.duration, 0).toFixed(3),
  );

  const manifest = {
    slug: reel.slug,
    format: reel.format,
    canvas,
    fps: reel.fps,
    theme: reel.theme,
    transparent: reel.transparent,
    generatedAt: new Date().toISOString(),
    totalDuration,
    reel: reelFile,
    clips: clips.map(({ checks, ...rest }) => rest),
  };

  const manifestPath = join(outDir, "MANIFEST.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  const checks = [
    ...clips.flatMap((c) => c.checks),
    ...(await checkCutouts({ ...reel, clips: wanted })),
  ];

  const notes: string[] = [];
  if (reel.concat && full && clips.length > 1 && mixedAlpha) {
    notes.push(
      "El reel mezcla clips con alfa y sin alfa, que no comparten códec: no se pegó el archivo único y los clips quedan sueltos para montar en el editor.",
    );
  }
  if (!full) {
    notes.push(
      `Se renderizaron ${clips.length} de ${reel.clips.length} clips (only). No se armó el archivo pegado.`,
    );
  }

  return {
    ok: checks.every((c) => c.passed),
    slug: reel.slug,
    outDir,
    format: reel.format,
    canvas,
    fps: reel.fps,
    transparent: reel.transparent,
    totalDuration,
    clips,
    reelFile,
    manifest: manifestPath,
    checks,
    notes,
  };
}

declare global {
  interface Window {
    __READY__?: boolean;
    __SEEK__?: (t: number) => void;
    __MEASURE__?: () => unknown;
  }
}
