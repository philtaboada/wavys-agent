import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import { optionalEnv } from "../env.js";
import { buildJobsSearchUrl, DEFAULT_WORKANA_PARAMS } from "../workana/config.js";
import {
  detectLanguage,
  extractSecretKeyword,
  normalizeJobUrl,
  parseBudgetText,
} from "../workana/index.js";
import type { WorkanaJobCard, WorkanaJobDetail } from "../workana/types.js";

const root = resolve(import.meta.dirname, "..", "..");

export type WorkanaSession = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

export class WorkanaSessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkanaSessionError";
  }
}

async function loadStorageState(): Promise<
  string | { cookies: unknown[]; origins: unknown[] } | undefined
> {
  const inline = optionalEnv("WORKANA_STORAGE_STATE_JSON");
  if (inline) {
    return JSON.parse(inline) as { cookies: unknown[]; origins: unknown[] };
  }
  const path =
    optionalEnv("WORKANA_STORAGE_STATE_PATH") ??
    resolve(root, "data/workana-storage-state.json");
  try {
    const raw = await readFile(path, "utf8");
    if (!raw.trim()) return undefined;
    return path;
  } catch {
    return undefined;
  }
}

export async function openWorkanaSession(opts: { headless?: boolean } = {}): Promise<WorkanaSession> {
  const storageState = await loadStorageState();
  if (!storageState) {
    throw new WorkanaSessionError(
      "Sesión Workana no configurada. Exportá storage state de Playwright (Arnold S) a WORKANA_STORAGE_STATE_JSON o data/workana-storage-state.json",
    );
  }

  const browser = await chromium.launch({ headless: opts.headless ?? true });
  const context = await browser.newContext({
    storageState: storageState as string | { cookies: never[]; origins: never[] },
    locale: "es-ES",
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  return { browser, context, page };
}

export async function closeWorkanaSession(session: WorkanaSession): Promise<void> {
  await session.context.close().catch(() => undefined);
  await session.browser.close().catch(() => undefined);
}

export async function assertLoggedIn(page: Page): Promise<void> {
  await page.goto("https://www.workana.com/dashboard", {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  const url = page.url();
  if (/\/(login|signup|signin)/i.test(url)) {
    throw new WorkanaSessionError("Sesión caducada — re-login manual requerido (Arnold S)");
  }
  const loginForm = page.locator('input[type="password"], form[action*="login"]');
  if (await loginForm.first().isVisible().catch(() => false)) {
    throw new WorkanaSessionError("Sesión caducada — re-login manual requerido (Arnold S)");
  }
}

function parseProposals(text: string): number | null {
  const m = text.match(/(\d+)\s*(propuestas?|proposals?|propostas?)/i);
  return m ? Number(m[1]) : null;
}

export async function scrapeJobCards(
  page: Page,
  searchUrl = buildJobsSearchUrl(),
): Promise<WorkanaJobCard[]> {
  await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  if (/\/(login|signup)/i.test(page.url())) {
    throw new WorkanaSessionError("Sesión caducada al abrir listado — re-login manual (Arnold S)");
  }

  await page.waitForTimeout(1500);

  const cards = await page.evaluate(() => {
    const roots = Array.from(
      document.querySelectorAll(
        ".project-item, .js-project, article.project, .project-list .project, [data-project], .search-result",
      ),
    );
    const fallback = roots.length
      ? roots
      : Array.from(document.querySelectorAll("a[href*='/job/']"))
          .map((a) => a.closest("div, article, li, section") ?? a.parentElement)
          .filter((el, i, arr): el is Element => !!el && arr.indexOf(el) === i);

    return fallback.map((el) => {
      const link =
        (el.querySelector("a[href*='/job/']") as HTMLAnchorElement | null) ??
        (el.matches("a[href*='/job/']") ? (el as HTMLAnchorElement) : null);
      const title =
        link?.textContent?.trim() ||
        el.querySelector(".project-header, h2, h3")?.textContent?.trim() ||
        "";
      const href = link?.href || "";
      const budgetText =
        el.querySelector(".budget, .project-actions, .values, [class*='budget']")?.textContent?.trim() ||
        "";
      const bodyText = el.querySelector(".project-body, .project-details, p")?.textContent?.trim() || "";
      const fullText = el.textContent || "";
      const alreadyBidUi = /mejorar\s+propuesta|improve\s+(your\s+)?proposal|melhorar\s+proposta/i.test(
        fullText,
      );
      return {
        title,
        url: href,
        budgetText,
        bodyText,
        fullText,
        alreadyBidUi,
      };
    });
  });

  return cards
    .filter((c) => c.url && /\/job\//.test(c.url) && c.title)
    .map((c) => {
      const budget = parseBudgetText(c.budgetText || c.fullText);
      return {
        title: c.title.replace(/\s+/g, " ").trim(),
        url: normalizeJobUrl(c.url),
        budgetText: (c.budgetText || "").replace(/\s+/g, " ").trim(),
        budgetMinUsd: budget.min,
        budgetMaxUsd: budget.max,
        proposalsCount: parseProposals(c.fullText),
        snippet: (c.bodyText || c.fullText).replace(/\s+/g, " ").trim().slice(0, 500),
        alreadyBidUi: c.alreadyBidUi,
      } satisfies WorkanaJobCard;
    });
}

export async function scrapeJobDetail(page: Page, url: string): Promise<WorkanaJobDetail> {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(1000);

  const raw = await page.evaluate(() => {
    const title =
      document.querySelector("h1, .project-header h1, .project-title")?.textContent?.trim() ||
      document.title;
    const brief =
      document.querySelector(
        ".project-body, .project-description, #project-description, [itemprop='description'], .expander",
      )?.textContent?.trim() ||
      document.body.innerText.slice(0, 8000);
    const budgetText =
      document.querySelector(".budget, .project-actions, [class*='budget']")?.textContent?.trim() ||
      "";
    const clientName =
      document.querySelector(".author, .client-name, .user-name, [class*='author']")?.textContent?.trim() ||
      null;
    const skills = Array.from(document.querySelectorAll(".skills a, .skill, [class*='skill'] a"))
      .map((a) => a.textContent?.trim() || "")
      .filter(Boolean);
    const fullText = document.body.innerText;
    const alreadyBidUi = /mejorar\s+propuesta|improve\s+(your\s+)?proposal|melhorar\s+proposta/i.test(
      fullText,
    );
    const minBidMatch = fullText.match(/presupuesto\s+m[ií]nimo\s*:?\s*\$?\s*([\d.,]+)/i);
    return {
      title,
      brief,
      budgetText,
      clientName,
      skills,
      fullText,
      alreadyBidUi,
      minBidText: minBidMatch?.[1] ?? null,
    };
  });

  const budget = parseBudgetText(raw.budgetText || raw.fullText);
  const minBidUsd = raw.minBidText
    ? Number(raw.minBidText.replace(/\./g, "").replace(",", "."))
    : null;

  return {
    title: raw.title.replace(/\s+/g, " ").trim(),
    url: normalizeJobUrl(url),
    budgetText: raw.budgetText,
    budgetMinUsd: budget.min,
    budgetMaxUsd: budget.max,
    proposalsCount: parseProposals(raw.fullText),
    snippet: raw.brief.slice(0, 500),
    alreadyBidUi: raw.alreadyBidUi,
    clientName: raw.clientName,
    fullBrief: raw.brief.replace(/\s+/g, " ").trim(),
    skills: raw.skills,
    secretKeyword: extractSecretKeyword(raw.brief + "\n" + raw.fullText),
    minBidUsd: Number.isFinite(minBidUsd) ? minBidUsd : null,
    deliveryDaysHint: null,
    language: detectLanguage(raw.brief || raw.fullText),
  };
}

export type SubmitBidInput = {
  amountUsd: number;
  deliveryDays: number;
  content: string;
};

export type SubmitBidResult = {
  ok: boolean;
  confirmedImproveProposal: boolean;
  error?: string;
  screenshotPath?: string;
};

async function fillBidForm(page: Page, input: SubmitBidInput): Promise<void> {
  const amount = page.locator("#Amount, input[name='Amount'], input[name='amount']").first();
  const delivery = page
    .locator("#BidDeliveryTime, input[name='BidDeliveryTime'], input[name='delivery_time']")
    .first();
  const content = page
    .locator("#BidContent, textarea[name='BidContent'], textarea[name='content'], textarea")
    .first();

  if (!(await amount.count()) || !(await delivery.count()) || !(await content.count())) {
    throw new Error("Form fields no encontrados (#Amount / #BidDeliveryTime / #BidContent)");
  }

  await amount.fill(String(input.amountUsd));
  await delivery.fill(String(input.deliveryDays));
  await content.fill(input.content);
}

async function clickSubmitBid(page: Page): Promise<void> {
  const btn = page
    .locator(
      'button:has-text("Enviar presupuesto"), button:has-text("Submit"), button:has-text("Enviar"), input[type="submit"]',
    )
    .first();
  if (!(await btn.count())) {
    throw new Error("Botón Enviar presupuesto no encontrado");
  }
  await btn.click();
  await page.waitForTimeout(2500);
}

export async function openBidForm(page: Page): Promise<void> {
  const cta = page
    .locator(
      'a:has-text("Enviar presupuesto"), a:has-text("Send proposal"), button:has-text("Enviar presupuesto"), a:has-text("Hacer una propuesta")',
    )
    .first();
  if (await cta.count()) {
    await cta.click();
    await page.waitForTimeout(1500);
  }
}

export async function hasImproveProposal(page: Page): Promise<boolean> {
  const text = await page.locator("body").innerText();
  return /mejorar\s+propuesta|improve\s+(your\s+)?proposal|melhorar\s+proposta/i.test(text);
}

export async function submitBid(
  page: Page,
  input: SubmitBidInput,
  opts: { screenshotDir?: string; retryOnce?: boolean } = {},
): Promise<SubmitBidResult> {
  const screenshotDir = opts.screenshotDir ?? resolve(root, "data/workana-screenshots");
  await mkdir(screenshotDir, { recursive: true });

  try {
    if (await hasImproveProposal(page)) {
      return { ok: false, confirmedImproveProposal: true, error: "skip_ya_postulado" };
    }

    await openBidForm(page);
    await fillBidForm(page, input);
    await clickSubmitBid(page);

    let confirmed = await hasImproveProposal(page);
    if (!confirmed && opts.retryOnce !== false) {
      await page.waitForTimeout(2000);
      await openBidForm(page);
      await fillBidForm(page, input);
      await clickSubmitBid(page);
      confirmed = await hasImproveProposal(page);
    }

    if (!confirmed) {
      const screenshotPath = resolve(screenshotDir, `fail-${Date.now()}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      return {
        ok: false,
        confirmedImproveProposal: false,
        error: "Envío sin confirmación Mejorar propuesta",
        screenshotPath,
      };
    }

    return { ok: true, confirmedImproveProposal: true };
  } catch (error) {
    const screenshotPath = resolve(screenshotDir, `error-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
    return {
      ok: false,
      confirmedImproveProposal: false,
      error: error instanceof Error ? error.message : String(error),
      screenshotPath,
    };
  }
}

/** Utilidad one-shot: login manual interactivo para generar storage state. */
export async function exportStorageStateInteractive(outPath?: string): Promise<string> {
  const target =
    outPath ??
    optionalEnv("WORKANA_STORAGE_STATE_PATH") ??
    resolve(root, "data/workana-storage-state.json");
  await mkdir(dirname(target), { recursive: true });
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://www.workana.com/login");
  console.error("Iniciá sesión como Arnold S en la ventana. Cuando veas el dashboard, este script guardará el state en 90s o al detectar dashboard...");
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (/dashboard|projects|jobs/i.test(page.url()) && !/login/i.test(page.url())) break;
    await page.waitForTimeout(2000);
  }
  await context.storageState({ path: target });
  await browser.close();
  return target;
}

export { DEFAULT_WORKANA_PARAMS };
