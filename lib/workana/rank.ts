import type { EligibilityResult, WorkanaJobCard } from "./types.js";

export type RankedJob = {
  card: WorkanaJobCard;
  eligibility: EligibilityResult;
};

/** Prioriza custom software / SaaS / ERP / APIs, luego Shopify real, luego menos competencia. */
export function rankJobs(
  cards: WorkanaJobCard[],
  evaluate: (card: WorkanaJobCard) => EligibilityResult,
  limit: number,
): RankedJob[] {
  return cards
    .map((card) => ({ card, eligibility: evaluate(card) }))
    .filter((r) => r.eligibility.accept)
    .sort((a, b) => b.eligibility.score - a.eligibility.score)
    .slice(0, limit);
}
