import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { readJsonStore } from "../store.js";
import type { CheckResult, ValidateContext } from "./types.js";
import {
  check,
  countImages,
  countUrls,
  fileExists,
  findPatternsDoc,
  grepDir,
  imageDimensions,
  mtime,
  pngHasAlpha,
  readText,
  runBunBuild,
} from "./utils.js";

function webProjectChecks(
  ctx: ValidateContext,
  prefix: "L" | "W" | "R",
): CheckResult[] {
  const { projectPath: proj, repoRoot, slug, runBuild } = ctx;
  if (!proj) {
    return [
      check(`${prefix}-ERR`, "CRITICAL", false, "projectPath requerido", undefined),
    ];
  }

  const checks: CheckResult[] = [];
  const patterns =
    ctx.patternsDocPath ?? findPatternsDoc(repoRoot, slug);
  const pkg = join(proj, "package.json");

  if (patterns && fileExists(pkg)) {
    const docId =
      prefix === "L" ? "L-D01" : prefix === "W" ? "W-D01" : "R-D02";
    const docText = readText(patterns);
    const linkedToProject = docText.includes(`/projects/${slug}`);
    const mtimeOk = mtime(patterns) < mtime(pkg);
    const ok = mtimeOk || linkedToProject;
    checks.push(
      check(
        docId,
        "CRITICAL",
        ok,
        ok
          ? mtimeOk
            ? "Doc patrones anterior a package.json"
            : "Doc patrones enlazado al proyecto"
          : "Doc patrones después del scaffold",
        `doc=${mtime(patterns)} pkg=${mtime(pkg)} linked=${linkedToProject}`,
      ),
    );
    if (fileExists(patterns)) {
      const hex = (readText(patterns).match(/#[0-9a-fA-F]{3,8}/g) ?? []).length;
      const hexId = prefix === "L" ? "L-D03" : "W-T04";
      if (prefix !== "R") {
        checks.push(
          check(
            hexId,
            "HIGH",
            hex >= 4,
            hex >= 4 ? "Tokens color en doc" : "Faltan tokens hex en doc",
            String(hex),
          ),
        );
      }
    }
  } else {
    checks.push(
      check(
        prefix === "L" ? "L-D01" : prefix === "R" ? "R-D01" : "W-D01",
        "CRITICAL",
        false,
        "Falta doc patrones o package.json",
        patterns ?? "no doc",
      ),
    );
  }

  const src = join(proj, "src");
  const fontId = prefix === "L" ? "L-T02" : prefix === "W" ? "W-T03" : "R-B05";
  const forbiddenFonts = grepDir(src, /\bInter\b|\bRoboto\b|\bGeist\b/i);
  checks.push(
    check(
      fontId,
      prefix === "R" ? "CRITICAL" : "CRITICAL",
      forbiddenFonts === 0,
      forbiddenFonts === 0 ? "Sin fonts prohibidas" : "Fonts default detectadas",
      String(forbiddenFonts),
    ),
  );

  const phId =
    prefix === "L" ? "L-C03" : prefix === "W" ? "W-G05" : "R-C03";
  const placeholders = grepDir(
    src,
    /picsum|placeholder|loremflickr|unsplash\.com\/random|lorem ipsum|TODO|TBD/i,
  );
  checks.push(
    check(
      phId,
      "CRITICAL",
      placeholders === 0,
      placeholders === 0 ? "Sin placeholders" : "Placeholders en src",
      String(placeholders),
    ),
  );

  const h1Id = prefix === "L" ? "L-S04" : prefix === "W" ? "W-C06" : "R-B06";
  let h1Count = grepDir(src, /<h1[\s>]/i, [".astro", ".tsx", ".jsx"]);
  checks.push(
    check(
      h1Id,
      "HIGH",
      h1Count === 1,
      h1Count === 1 ? "Un solo H1" : "H1 count incorrecto",
      String(h1Count),
    ),
  );

  const globalCss = [join(src, "styles/global.css"), join(src, "app/globals.css")].find(
    existsSync,
  );
  if (globalCss) {
    const hasRm = /prefers-reduced-motion/i.test(readText(globalCss));
    checks.push(
      check(
        `${prefix === "L" ? "L-S05" : "W-V09"}`,
        "HIGH",
        hasRm,
        hasRm ? "prefers-reduced-motion presente" : "Falta prefers-reduced-motion",
      ),
    );
  }

  const imgCount = countImages(join(proj, "public/images"));
  const minImgs = prefix === "W" ? 6 : 1;
  checks.push(
    check(
      `${prefix === "L" ? "L-G02" : "W-G01"}`,
      prefix === "W" ? "CRITICAL" : "HIGH",
      imgCount >= minImgs,
      imgCount >= minImgs ? "Imágenes en public/images" : "Faltan imágenes",
      String(imgCount),
    ),
  );

  if (runBuild) {
    const build = runBunBuild(proj);
    checks.push(
      check(
        `${prefix === "L" ? "L-V01" : prefix === "W" ? "W-V01" : "R-B06"}`,
        "CRITICAL",
        build.pass,
        build.pass ? "bun run build OK" : "Build falló",
        build.measured,
      ),
    );
  }

  const runsDir = join(repoRoot, "data/pipeline-runs");
  const s390 = join(runsDir, `${slug}-390.png`);
  const s1440 = join(runsDir, `${slug}-1440.png`);
  checks.push(
    check(
      `${prefix === "L" ? "L-V02" : "W-V02"}`,
      "CRITICAL",
      fileExists(s390) && fileExists(s1440),
      "Screenshots 390 + 1440",
      `${basenameExists(s390)}/${basenameExists(s1440)}`,
      true,
    ),
  );

  checks.push(
    check(`${prefix}-V04`, "HIGH", false, "Hero above fold @390px — revisión visual", undefined, true),
  );
  checks.push(
    check(`${prefix}-V08`, "HIGH", false, "Fidelidad layout vs referencia — revisión visual", undefined, true),
  );

  return checks;
}

function basenameExists(p: string): string {
  return existsSync(p) ? "ok" : "missing";
}

export function validateLanding(ctx: ValidateContext): CheckResult[] {
  return webProjectChecks(ctx, "L");
}

export function validateNext(ctx: ValidateContext): CheckResult[] {
  const checks = webProjectChecks(ctx, "W");
  const proj = ctx.projectPath!;
  const hasNext = existsSync(join(proj, "package.json"))
    ? /"next"/.test(readText(join(proj, "package.json")))
    : false;
  checks.push(
    check("W-S01", "CRITICAL", hasNext, hasNext ? "Next.js en package.json" : "Falta next"),
  );
  const hasFm = existsSync(join(proj, "package.json"))
    ? /framer-motion/.test(readText(join(proj, "package.json")))
    : false;
  checks.push(check("W-S04", "HIGH", hasFm, hasFm ? "framer-motion instalado" : "Falta framer-motion"));
  return checks;
}

export function validateReference(ctx: ValidateContext): CheckResult[] {
  const base = webProjectChecks(ctx, "R");
  const extra: CheckResult[] = [];

  const patterns = ctx.patternsDocPath ?? findPatternsDoc(ctx.repoRoot, ctx.slug);
  if (patterns && fileExists(patterns)) {
    const text = readText(patterns);
    extra.push(
      check("R-D01", "CRITICAL", true, "Doc patrones existe", patterns),
      check(
        "R-A01",
        "CRITICAL",
        /navbar|hero|grid/i.test(text),
        "Análisis secciones en doc",
      ),
    );
  } else {
    extra.push(check("R-D01", "CRITICAL", false, "Falta design-patterns doc"));
  }

  extra.push(
    check("R-V02", "CRITICAL", false, "Comparación sección vs capturas Phil — manual", undefined, true),
  );

  return [...base, ...extra];
}

export async function validateImage(ctx: ValidateContext): Promise<CheckResult[]> {
  const path = ctx.imagePath;
  const checks: CheckResult[] = [];
  if (!path || !fileExists(path)) {
    return [check("IG-05", "CRITICAL", false, "imagePath no existe", path)];
  }
  const bytes = statSync(path).size;
  checks.push(check("IG-05", "CRITICAL", true, "Archivo existe", path));
  checks.push(
    check(
      "IG-06",
      "CRITICAL",
      /\.jpe?g$/i.test(path),
      "Formato JPEG",
      path.split(".").pop(),
    ),
  );
  checks.push(
    check(
      "IG-07",
      "HIGH",
      bytes >= 5000,
      bytes >= 5000 ? "Tamaño OK" : "Archivo muy pequeño",
      `${bytes} bytes`,
    ),
  );
  return checks;
}

export async function validateCutout(ctx: ValidateContext): Promise<CheckResult[]> {
  const checks = await validateImage({ ...ctx, imagePath: ctx.imagePath });
  const cutout = ctx.cutoutPath;
  if (!cutout || !fileExists(cutout)) {
    checks.push(check("IC-04", "CRITICAL", false, "cutout PNG no existe", cutout));
    return checks;
  }
  checks.push(check("IC-04", "CRITICAL", true, "PNG cutout existe", cutout));
  const alpha = await pngHasAlpha(cutout);
  checks.push(
    check("IC-05", "CRITICAL", alpha, alpha ? "Canal alpha presente" : "Sin alpha", String(alpha)),
  );
  checks.push(
    check("IC-09", "CRITICAL", false, "Sin halo — revisión visual", undefined, true),
  );
  return checks;
}

export function validateBrief(ctx: ValidateContext): CheckResult[] {
  const html =
    ctx.htmlPath ??
    join(ctx.repoRoot, "data/presencia-digital-brief/brief-presencia-digital.html");
  const pdf =
    ctx.pdfPath ??
    join(ctx.repoRoot, "data/presencia-digital-brief/Wavys-Presencia-Digital-Brief.pdf");
  const checks: CheckResult[] = [];

  if (!fileExists(html)) {
    return [check("PB-02", "CRITICAL", false, "HTML brief no encontrado", html)];
  }

  const lines = readText(html).split("\n").slice(0, 120).join("\n");
  const coverPrice = /S\/\s*\d+/.test(lines);
  checks.push(
    check(
      "PB-03",
      "CRITICAL",
      !coverPrice,
      !coverPrice ? "Cover sin precio" : "Precio detectado en cover",
    ),
  );

  const hasInversion = /inversi[oó]n|cap[ií]tulo.*06/i.test(readText(html));
  checks.push(check("PB-09", "CRITICAL", hasInversion, "Sección inversión presente"));

  if (fileExists(pdf) && fileExists(html)) {
    const pdfNewer = mtime(pdf) >= mtime(html);
    checks.push(
      check(
        "PB-14",
        "CRITICAL",
        pdfNewer,
        pdfNewer ? "PDF regenerado post-HTML" : "PDF anterior al HTML",
        `pdf=${mtime(pdf)} html=${mtime(html)}`,
      ),
    );
  } else {
    checks.push(check("PB-14", "CRITICAL", false, "Falta PDF o HTML", pdf));
  }

  checks.push(
    check("PB-13", "HIGH", false, "Tono y copy — revisión manual", undefined, true),
  );
  return checks;
}

export function validateContent(ctx: ValidateContext): CheckResult[] {
  const copy =
    ctx.copyPath ??
    join(ctx.repoRoot, "data/content-drafts", `${ctx.slug}-copy.md`);
  const checks: CheckResult[] = [];
  checks.push(
    check(
      "CP-C01",
      "CRITICAL",
      fileExists(copy),
      fileExists(copy) ? "Copy file existe" : "Falta copy md",
      copy,
    ),
  );
  if (fileExists(copy)) {
    const urls = countUrls(readText(copy));
    checks.push(
      check("CP-C07", "HIGH", urls >= 0, "URLs en copy (si noticias)", String(urls)),
    );
  }
  checks.push(
    check("CP-F01", "CRITICAL", false, "Filtro Wavys — confirmación manual", undefined, true),
  );
  return checks;
}

export function validateVideo(ctx: ValidateContext): CheckResult[] {
  const dir =
    ctx.videoDir ??
    join(ctx.projectsRoot, "wavys-stories/videos", ctx.slug);
  const checks: CheckResult[] = [];
  const files = ["RESEARCH.md", "SCRIPT.md", "STORYBOARD.md", "ASSET-PLAN.md", "VALIDATION.md"];
  for (const f of files) {
    const p = join(dir, f);
    checks.push(
      check(
        `V-F-${f}`,
        f === "VALIDATION.md" ? "CRITICAL" : "HIGH",
        fileExists(p),
        fileExists(p) ? `${f} existe` : `Falta ${f}`,
        p,
      ),
    );
  }
  const research = join(dir, "RESEARCH.md");
  if (fileExists(research)) {
    const urls = countUrls(readText(research));
    checks.push(
      check("V-R03", "CRITICAL", urls >= 10, "Fuentes en RESEARCH", String(urls)),
    );
  }
  const validation = join(dir, "VALIDATION.md");
  if (fileExists(validation)) {
    const auth = /Render autorizado\s*\n✅\s*S[ií]/i.test(readText(validation));
    checks.push(
      check("V-V11", "CRITICAL", auth, auth ? "Render autorizado" : "Falta autorización render"),
    );
  }
  checks.push(
    check("V-V05", "CRITICAL", false, "Browser QA frames — manual", undefined, true),
  );
  return checks;
}

export function validateAudit(ctx: ValidateContext): CheckResult[] {
  const report = ctx.reportPath;
  if (!report || !fileExists(report)) {
    return [
      check("UA-R01", "CRITICAL", false, "reportPath requerido", report),
    ];
  }
  const text = readText(report);
  const sections = [
    /resumen ejecutivo/i,
    /funciona|qué no/i,
    /diseño|ux/i,
    /t[eé]cnico|seo/i,
    /por qu[eé] cambiar|deber[ií]an cambiar/i,
    /recomendaci/i,
    /oportunidad wavys|wavys/i,
  ];
  const found = sections.filter((re) => re.test(text)).length;
  const checks: CheckResult[] = [
    check(
      "UA-R01",
      "CRITICAL",
      found >= 6,
      found >= 6 ? "Secciones informe OK" : "Faltan secciones informe",
      `${found}/7`,
    ),
  ];
  checks.push(
    check("UA-B05", "CRITICAL", false, "Screenshot móvil 390 — manual/browser", undefined, true),
  );
  checks.push(
    check("UA-T01", "CRITICAL", false, "CTA principal probado — manual/browser", undefined, true),
  );
  return checks;
}

export async function validateSales(ctx: ValidateContext): Promise<CheckResult[]> {
  const notes = await readJsonStore<{ tags?: string[]; content?: string }[]>(
    "notes.json",
    [],
  );
  const tag = ctx.noteTag ?? ctx.slug;
  const hasNote = notes.some(
    (n) =>
      n.tags?.some((t) => t.includes(tag) || t.includes("ventas")) ||
      n.content?.toLowerCase().includes(tag.toLowerCase()),
  );
  return [
    check(
      "SP-03",
      "CRITICAL",
      hasNote,
      hasNote ? "log_business_note encontrado" : "Falta nota en notes.json",
      tag,
    ),
    check(
      "SP-05",
      "CRITICAL",
      false,
      "OK Phil antes de send_email — manual",
      undefined,
      true,
    ),
  ];
}

export function validateSocial(ctx: ValidateContext): CheckResult[] {
  return [
    check("SD-03", "CRITICAL", false, "Frame Figma Posts Agente — manual/MCP", undefined, true),
    check("SD-16", "CRITICAL", false, "Export dimensiones — manual", undefined, true),
    ...validateContent(ctx).filter((c) => c.id.startsWith("CP-")),
  ];
}
