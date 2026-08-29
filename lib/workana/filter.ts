import type { EligibilityResult, WorkanaJobCard, WorkanaJobType } from "./types.js";

const EXCLUDE_PATTERNS: Array<{ id: string; re: RegExp }> = [
  { id: "wordpress", re: /\b(wordpress|word\s*press|wp[\s-]?theme|elementor|divi)\b/i },
  { id: "woocommerce", re: /\b(woocommerce|woo[\s-]?commerce)\b/i },
  { id: "magento", re: /\bmagento\b/i },
  { id: "prestashop", re: /\b(prestashop|presta\s*shop)\b/i },
  { id: "vtex", re: /\bvtex\b/i },
  { id: "tiendanube", re: /\b(tiendanube|nuvemshop)\b/i },
  { id: "wix", re: /\bwix\b/i },
  { id: "squarespace", re: /\bsquarespace\b/i },
  { id: "chatbot_wa", re: /\b(whats?app|chat\s*bots?|chatbots?|gohighlevel|\bghl\b|make\+?\s*wa|n8n\b.*\b(chat|whats?app|convers)|bot\s*de\s*whats?app|automatizaci[oó]n\s+por\s+whats?app)\b/i },
  { id: "design_only", re: /\b(solo\s+dise[nñ]o|only\s+design|ui\/ux\s+only|copywriting|redacci[oó]n\s+de\s+ads|meta\s+ads|google\s+ads|seo\s+on[\s-]?page)\b/i },
];

const SHOPIFY_RE =
  /\b(shopify|liquid\b|shopify\s+app|shopify\s+theme|checkout\s+extensi|shopify\s+plus|hydrogen)\b/i;

const CODE_RE =
  /\b(fullstack|full[\s-]?stack|frontend|front[\s-]?end|backend|back[\s-]?end|saas|api[s]?\b|rest\b|graphql|dashboard|erp\b|pos\b|mobile\s+app|react\b|next\.?js|node\.?js|typescript|python|laravel|django|nestjs|flutter|react\s*native|integraci[oó]n(es)?|plataforma|software\s+(a\s+medida|custom)|desarrollo\s+(web|custom|de\s+software)|web\s+app|mvp\b)\b/i;

function haystack(card: Pick<WorkanaJobCard, "title" | "snippet" | "url">, extra = ""): string {
  return `${card.title}\n${card.snippet}\n${card.url}\n${extra}`;
}

export function detectJobType(
  card: Pick<WorkanaJobCard, "title" | "snippet" | "url">,
  extraBrief = "",
): WorkanaJobType | null {
  const text = haystack(card, extraBrief);
  const shopify = SHOPIFY_RE.test(text);
  const code = CODE_RE.test(text);
  if (shopify) return "shopify";
  if (code) return "codigo";
  return null;
}

export function evaluateEligibility(
  card: WorkanaJobCard,
  opts: {
    minBudgetUsd?: number;
    postedUrls?: Set<string> | string[];
    extraBrief?: string;
  } = {},
): EligibilityResult {
  const reasons: string[] = [];
  const text = haystack(card, opts.extraBrief ?? "");
  const posted = opts.postedUrls
    ? opts.postedUrls instanceof Set
      ? opts.postedUrls
      : new Set(opts.postedUrls)
    : new Set<string>();

  if (card.alreadyBidUi || /mejorar\s+propuesta/i.test(text)) {
    reasons.push("ya_postulado_ui");
  }

  const normalizedUrl = normalizeJobUrl(card.url);
  if (posted.has(normalizedUrl) || posted.has(card.url)) {
    reasons.push("ya_postulado_historial");
  }

  for (const { id, re } of EXCLUDE_PATTERNS) {
    if (re.test(text)) reasons.push(`exclude:${id}`);
  }

  const type = detectJobType(card, opts.extraBrief);
  if (!type) reasons.push("no_codigo_ni_shopify");

  const minBudget = opts.minBudgetUsd ?? 250;
  const budgetFloor = card.budgetMinUsd ?? card.budgetMaxUsd;
  if (budgetFloor != null && budgetFloor < minBudget) {
    reasons.push(`presupuesto_bajo_${budgetFloor}`);
  }

  const blocking = reasons.filter(
    (r) =>
      r.startsWith("exclude:") ||
      r === "ya_postulado_ui" ||
      r === "ya_postulado_historial" ||
      r === "no_codigo_ni_shopify",
  );

  const accept = blocking.length === 0 && type != null;
  const score = accept ? scoreEligible(card, type!) : 0;

  if (!accept && reasons.length === 0) reasons.push("rechazado");

  return { accept, type: accept ? type : type, reasons, score };
}

function scoreEligible(card: WorkanaJobCard, type: WorkanaJobType): number {
  let score = 0;
  const text = haystack(card);
  const max = card.budgetMaxUsd ?? card.budgetMinUsd ?? 0;

  if (type === "codigo") {
    score += 40;
    if (/\b(saas|erp|api|plataforma|mvp)\b/i.test(text)) score += 25;
    if (/\b(dashboard|fullstack|backend)\b/i.test(text)) score += 10;
  } else {
    score += 30;
    if (/\b(shopify\s+app|integraci|liquid|theme\s+custom)\b/i.test(text)) score += 20;
    else score += 8;
  }

  if (max >= 5000) score += 30;
  else if (max >= 3000) score += 22;
  else if (max >= 1000) score += 15;
  else if (max >= 500) score += 8;

  const proposals = card.proposalsCount ?? 20;
  if (proposals <= 5) score += 20;
  else if (proposals <= 15) score += 12;
  else if (proposals <= 30) score += 5;
  else score -= 5;

  if (card.snippet.trim().length > 80) score += 5;

  return score;
}

export function normalizeJobUrl(url: string): string {
  try {
    const u = new URL(url, "https://www.workana.com");
    const path = u.pathname.replace(/\/+$/, "");
    return `https://www.workana.com${path}`;
  } catch {
    return url.split("?")[0]?.replace(/\/+$/, "") ?? url;
  }
}

export function parseBudgetText(text: string): { min: number | null; max: number | null } {
  const cleaned = text.replace(/,/g, "").replace(/\s+/g, " ");
  const range = cleaned.match(/USD?\s*\$?\s*(\d+(?:\.\d+)?)\s*[-–a]+\s*USD?\s*\$?\s*(\d+(?:\.\d+)?)/i);
  if (range) {
    return { min: Number(range[1]), max: Number(range[2]) };
  }
  const single = cleaned.match(/USD?\s*\$?\s*(\d+(?:\.\d+)?)/i) ?? cleaned.match(/\$\s*(\d+(?:\.\d+)?)/);
  if (single) {
    const n = Number(single[1]);
    return { min: n, max: n };
  }
  if (/menos\s+de\s+250|under\s+250|<\s*250/i.test(cleaned)) {
    return { min: 0, max: 249 };
  }
  return { min: null, max: null };
}
