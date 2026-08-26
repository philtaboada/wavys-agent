/**
 * Revisor punto por punto — briefs pack MVP.
 * Exit 0 = PASS, 1 = FAIL.
 * Usage: bun run review-pack-briefs.ts
 */
import { readFileSync, existsSync, statSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));

type Check = {
  readonly id: string;
  readonly ok: boolean;
  readonly evidence: string;
};

type PackId = "tienda" | "salon" | "restaurante";

const PACKS: readonly {
  readonly id: PackId;
  readonly html: string;
  readonly pdf: string;
  readonly mustHaveCompleto: readonly string[];
}[] = [
  {
    id: "tienda",
    html: "brief-tienda.html",
    pdf: "Wavys-OS-Brief-Tienda.pdf",
    mustHaveCompleto: ["Stock", "Pedidos", "Cotizaciones"],
  },
  {
    id: "salon",
    html: "brief-salon.html",
    pdf: "Wavys-OS-Brief-Salon.pdf",
    mustHaveCompleto: ["Agenda", "Clientes"],
  },
  {
    id: "restaurante",
    html: "brief-restaurante.html",
    pdf: "Wavys-OS-Brief-Restaurante.pdf",
    mustHaveCompleto: ["Pedidos", "Agotados"],
  },
] as const;

const FORBIDDEN_ASSETS = [
  "phone-cutout.png",
  "store-cutout.png",
  "hero.png",
  "hero-unified.png",
] as const;

const checks: Check[] = [];

function addCheck(id: string, ok: boolean, evidence: string): void {
  checks.push({ id, ok, evidence });
}

function readHtml(name: string): string {
  return readFileSync(resolve(__dirname, name), "utf8");
}

function assertSharedRules(): void {
  const css = readFileSync(resolve(__dirname, "brief-pack-styles.css"), "utf8");
  addCheck("B1-08", css.includes("#f5f5f7") && css.includes("#0071e3"), "CSS tokens Apple-like");
  addCheck(
    "B4-01",
    /h1\s*\{[^}]*line-height:\s*1\.(2[8-9]|[3-9])/.test(css) || css.includes("line-height: 1.28"),
    "H1 line-height in CSS",
  );

  const headlines = new Set<string>();
  for (const pack of PACKS) {
    const html = readHtml(pack.html);
    const h1 = html.match(/<h1>[\s\S]*?<\/h1>/)?.[0] ?? "";
    headlines.add(h1.replace(/\s+/g, " ").trim());
    addCheck(`B1-01-${pack.id}`, html.includes("Wavys OS") && html.includes(`Pack ·`), `${pack.html} brand+pill`);
    addCheck(
      `B1-04-${pack.id}`,
      html.includes("https://calendly.com/philtaboada2julio"),
      "Calendly CTA",
    );
    addCheck(
      `B1-05-${pack.id}`,
      html.includes("contact@wavys-technologies.com"),
      "Email Wavys",
    );
    addCheck(
      `B1-06-${pack.id}`,
      html.includes("S/169") && html.includes("S/279") && html.includes("S/449"),
      "Precios 169/279/449",
    );
    addCheck(
      `B1-07-${pack.id}`,
      !/S\/\d+/.test(h1),
      "Sin precio en H1",
    );
    addCheck(
      `B2-01-${pack.id}`,
      html.includes("Plan web") && html.includes("Plan completo"),
      "Planes separados",
    );
    addCheck(
      `B2-05-${pack.id}`,
      html.includes("Website") && html.includes("WhatsApp") && /Oferta|Menú|Servicios|Catálogo/.test(html),
      "Plan web core",
    );
    for (const mod of pack.mustHaveCompleto) {
      addCheck(`B2-mod-${pack.id}-${mod}`, html.includes(mod), `Módulo ${mod}`);
    }
    for (const bad of FORBIDDEN_ASSETS) {
      addCheck(
        `B3-02-${pack.id}-${bad}`,
        !html.includes(bad),
        `No usa ${bad}`,
      );
    }
    const packAssetPrefix = `assets/packs/${pack.id}/`;
    addCheck(
      `B3-01-${pack.id}`,
      html.includes(`${packAssetPrefix}cover-`) && html.includes(`${packAssetPrefix}cta-`),
      `Assets en ${packAssetPrefix}`,
    );
    addCheck(
      `B3-03-${pack.id}`,
      html.includes("cover-") && html.includes("cta-") && html.includes("scene.jpg"),
      "Cover + CTA + scene",
    );
    const coverPath = resolve(__dirname, `assets/packs/${pack.id}/cover-cutout.png`);
    const ctaPath = resolve(__dirname, `assets/packs/${pack.id}/cta-cutout.png`);
    const scenePath = resolve(__dirname, `assets/packs/${pack.id}/scene.jpg`);
    addCheck(`B3-file-cover-${pack.id}`, existsSync(coverPath), coverPath);
    addCheck(`B3-file-cta-${pack.id}`, existsSync(ctaPath), ctaPath);
    addCheck(`B3-file-scene-${pack.id}`, existsSync(scenePath), scenePath);
    const pdfPath = resolve(__dirname, pack.pdf);
    if (existsSync(pdfPath)) {
      const pdfM = statSync(pdfPath).mtimeMs;
      const htmlM = statSync(resolve(__dirname, pack.html)).mtimeMs;
      addCheck(`B5-01-${pack.id}`, pdfM >= htmlM - 1000, `PDF mtime >= HTML`);
    } else {
      addCheck(`B5-01-${pack.id}`, false, `PDF missing: ${pack.pdf}`);
    }
  }
  addCheck("B1-02", headlines.size === PACKS.length, `Headlines únicos: ${headlines.size}`);

  const geminiDir = resolve(__dirname, "../generated-images/wavys-os-briefs");
  const hasGemini = existsSync(geminiDir) && readdirSync(geminiDir).some((f) => f.endsWith(".jpg"));
  addCheck("B3-04", hasGemini, `Gemini sources in ${geminiDir}`);
}

async function assertVisualQa(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  const previewDir = resolve(__dirname, "_preview");
  for (const pack of PACKS) {
    const htmlPath = resolve(__dirname, pack.html);
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    const pages = page.locator(".page");
    const count = await pages.count();
    addCheck(`B4-04-${pack.id}`, count >= 4 && count <= 5, `pages=${count}`);
    await pages.nth(0).screenshot({ path: resolve(previewDir, `review-${pack.id}-p01.png`), type: "png" });
    await pages.nth(2).screenshot({ path: resolve(previewDir, `review-${pack.id}-p03.png`), type: "png" });
    const overlap = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      if (!h1) return true;
      const style = getComputedStyle(h1);
      const lh = parseFloat(style.lineHeight);
      const fs = parseFloat(style.fontSize);
      return !(lh / fs >= 1.25);
    });
    addCheck(`B4-01v-${pack.id}`, !overlap, "H1 computed line-height");
  }
  await browser.close();
  addCheck("B4-05", true, "Screenshots saved under _preview/review-*");
}

function writeLog(verdict: "PASS" | "FAIL"): void {
  const failed = checks.filter((c) => !c.ok);
  const lines = [
    `# Wavys OS — Pack brief validation`,
    ``,
    `- **Fecha:** ${new Date().toISOString()}`,
    `- **Veredicto:** ${verdict}`,
    `- **Checks:** ${checks.length} · **FAIL:** ${failed.length}`,
    ``,
    `## Checklist`,
    ``,
    `| ID | OK | Evidencia |`,
    `|----|----|-----------|`,
    ...checks.map((c) => `| ${c.id} | ${c.ok ? "✅" : "❌"} | ${c.evidence.replace(/\|/g, "/")} |`),
    ``,
    verdict === "PASS"
      ? `> **Briefs pack MVP: PASS.** Listos para WhatsApp/email/demo.`
      : `> **Los briefs pack no están listos para entrega.** Hallazgos: ${failed.map((f) => f.id).join(", ")}`,
    ``,
  ];
  const out = resolve(__dirname, "../pipeline-runs/wavys-os-pack-brief-validation.md");
  writeFileSync(out, lines.join("\n"), "utf8");
  console.log(`Log: ${out}`);
}

async function main(): Promise<void> {
  assertSharedRules();
  await assertVisualQa();
  const failed = checks.filter((c) => !c.ok);
  const verdict = failed.length === 0 ? "PASS" : "FAIL";
  writeLog(verdict);
  for (const c of checks) {
    console.log(`${c.ok ? "OK" : "FAIL"} ${c.id} — ${c.evidence}`);
  }
  console.log(`\nVERDICT: ${verdict}`);
  if (verdict !== "PASS") process.exit(1);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
