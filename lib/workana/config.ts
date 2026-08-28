import type { WorkanaDailyParams } from "./types.js";

export const WORKANA_JOBS_URL =
  "https://www.workana.com/jobs?category=it-programming&language=xx&budget=500-1000,1000-3000,3000-5000,5000-&publication=any";

export const DEFAULT_WORKANA_PARAMS: WorkanaDailyParams = {
  jobsPerDay: 5,
  minBudgetUsd: 250,
  preferredBudgetUsd: 500,
  category: "it-programming",
  account: "Arnold S",
  include: ["codigo_custom", "shopify"],
  exclude: [
    "wordpress",
    "woocommerce",
    "magento",
    "prestashop",
    "vtex",
    "tiendanube",
    "wix",
    "whatsapp",
    "chatbot",
    "ghl",
    "gohighlevel",
    "make+wa",
  ],
  delayBetweenBidsSec: [10, 30],
  humanGate: false,
  dryRun: false,
  language: "xx",
};

export function buildJobsSearchUrl(params: Partial<WorkanaDailyParams> = {}): string {
  const category = params.category ?? DEFAULT_WORKANA_PARAMS.category;
  const language = params.language ?? "xx";
  const preferred = params.preferredBudgetUsd ?? DEFAULT_WORKANA_PARAMS.preferredBudgetUsd;
  const budgets =
    preferred >= 500
      ? "500-1000,1000-3000,3000-5000,5000-"
      : "250-500,500-1000,1000-3000,3000-5000,5000-";
  return `https://www.workana.com/jobs?category=${encodeURIComponent(category)}&language=${encodeURIComponent(language)}&budget=${budgets}&publication=any`;
}

export function randomDelayMs(range: [number, number] = DEFAULT_WORKANA_PARAMS.delayBetweenBidsSec): number {
  const [min, max] = range;
  return Math.floor((min + Math.random() * (max - min)) * 1000);
}
