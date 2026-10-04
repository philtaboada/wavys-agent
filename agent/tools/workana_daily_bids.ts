import { z } from "zod";
import {
  assertLoggedIn,
  closeWorkanaSession,
  openWorkanaSession,
  scrapeJobCards,
  scrapeJobDetail,
  submitBid,
  WorkanaSessionError,
} from "../../lib/integrations/workana.js";
import {
  appendBid,
  buildProposal,
  DEFAULT_WORKANA_PARAMS,
  evaluateEligibility,
  finishDailyRun,
  formatDailySummary,
  planPricing,
  postedUrlSet,
  randomDelayMs,
  rankJobs,
  startDailyRun,
  type WorkanaBidRecord,
  type WorkanaDailyParams,
} from "../../lib/workana/index.js";
import { newId, nowIso } from "../../lib/store.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

const inputSchema = z.object({
  mode: z.enum(["full", "scan", "apply"]).default("full"),
  jobsPerDay: z.number().int().min(1).max(20).default(DEFAULT_WORKANA_PARAMS.jobsPerDay),
  minBudgetUsd: z.number().default(DEFAULT_WORKANA_PARAMS.minBudgetUsd),
  preferredBudgetUsd: z.number().default(DEFAULT_WORKANA_PARAMS.preferredBudgetUsd),
  account: z.string().default(DEFAULT_WORKANA_PARAMS.account),
  humanGate: z.boolean().default(false),
  dryRun: z.boolean().default(false),
  headless: z.boolean().default(true),
  /** Si mode=apply, URLs concretas (tras human_gate). */
  urls: z.array(z.string().url()).optional(),
});

type Input = z.infer<typeof inputSchema>;

type Output = {
  summary: string;
  runId: string;
  alert?: string;
  candidates: Array<{
    title: string;
    url: string;
    type: string | null;
    score: number;
    budgetText: string;
    amountUsd?: number;
    deliveryDays?: number;
    proposalPreview?: string;
  }>;
  results: WorkanaBidRecord[];
};

function toParams(input: Input): WorkanaDailyParams {
  return {
    ...DEFAULT_WORKANA_PARAMS,
    jobsPerDay: input.jobsPerDay,
    minBudgetUsd: input.minBudgetUsd,
    preferredBudgetUsd: input.preferredBudgetUsd,
    account: input.account,
    humanGate: input.humanGate,
    dryRun: input.dryRun,
  };
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export default {
  description:
    "Postulación diaria Workana (Arnold S): busca IT/Programación, filtra código∨Shopify ¬WP/Woo/bots, top N, redacta, envía, verifica y loguea en data/workana-bids.json.",
  inputSchema,
  async execute(input): Promise<Output> {
    const params = toParams(input);
    const { loadBidsStore } = await import("../../lib/workana/store.js");
    const store = await loadBidsStore();
    const posted = postedUrlSet(store);

    const run = await startDailyRun({
      account: params.account,
      jobsPerDay: params.jobsPerDay,
      scanned: 0,
      eligible: 0,
    });

    let session;
    try {
      session = await openWorkanaSession({ headless: input.headless });
      await assertLoggedIn(session.page);
    } catch (error) {
      const alert =
        error instanceof WorkanaSessionError
          ? error.message
          : `Fallo abriendo sesión Workana: ${error instanceof Error ? error.message : String(error)}`;
      const finished = await finishDailyRun(run.id, {
        scanned: 0,
        eligible: 0,
        results: [],
        alert,
      });
      return {
        summary: formatDailySummary(finished!),
        runId: run.id,
        alert,
        candidates: [],
        results: [],
      };
    }

    const results: WorkanaBidRecord[] = [];
    const candidates: Output["candidates"] = [];

    try {
      const cards = await scrapeJobCards(session.page);
      const ranked = rankJobs(
        cards,
        (card) =>
          evaluateEligibility(card, {
            minBudgetUsd: params.minBudgetUsd,
            postedUrls: posted,
          }),
        Math.max(params.jobsPerDay * 3, 10),
      );

      let slots = 0;
      for (const item of ranked) {
        if (slots >= params.jobsPerDay) break;

        const detail = await scrapeJobDetail(session.page, item.card.url);
        const elig = evaluateEligibility(detail, {
          minBudgetUsd: params.minBudgetUsd,
          postedUrls: posted,
          extraBrief: detail.fullBrief,
        });

        if (detail.alreadyBidUi || !elig.accept || !elig.type) {
          const status = detail.alreadyBidUi ? "skip_ya_postulado" : "skip_filtro";
          const rec: WorkanaBidRecord = {
            id: newId("wbid"),
            date: nowIso(),
            account: params.account,
            title: detail.title,
            url: detail.url,
            type: elig.type,
            amountUsd: null,
            deliveryDays: null,
            status,
            error: elig.reasons.join(","),
          };
          results.push(rec);
          await appendBid(rec);
          continue;
        }

        const pricing = planPricing(detail, elig.type);
        const proposal = buildProposal({ detail, type: elig.type, pricing });
        candidates.push({
          title: detail.title,
          url: detail.url,
          type: elig.type,
          score: elig.score,
          budgetText: detail.budgetText,
          amountUsd: pricing.amountUsd,
          deliveryDays: pricing.deliveryDays,
          proposalPreview: proposal.slice(0, 400),
        });
        slots += 1;

        if (input.mode === "scan" || params.humanGate || params.dryRun) {
          const rec: WorkanaBidRecord = {
            id: newId("wbid"),
            date: nowIso(),
            account: params.account,
            title: detail.title,
            url: detail.url,
            type: elig.type,
            amountUsd: pricing.amountUsd,
            deliveryDays: pricing.deliveryDays,
            status: "pending_approval",
            proposalPreview: proposal.slice(0, 280),
            error: params.dryRun ? "dry_run" : params.humanGate ? "human_gate" : "scan_only",
          };
          results.push(rec);
          await appendBid(rec);
          continue;
        }

        const submit = await submitBid(session.page, {
          amountUsd: pricing.amountUsd,
          deliveryDays: pricing.deliveryDays,
          content: proposal,
        });

        const rec: WorkanaBidRecord = {
          id: newId("wbid"),
          date: nowIso(),
          account: params.account,
          title: detail.title,
          url: detail.url,
          type: elig.type,
          amountUsd: pricing.amountUsd,
          deliveryDays: pricing.deliveryDays,
          status: submit.ok ? "enviada" : submit.error === "skip_ya_postulado" ? "skip_ya_postulado" : "fail",
          error: submit.ok ? undefined : submit.error,
          proposalPreview: proposal.slice(0, 280),
        };
        results.push(rec);
        await appendBid(rec);
        if (submit.ok) posted.add(detail.url);

        await sleep(randomDelayMs(params.delayBetweenBidsSec));
      }

      // apply mode with explicit urls
      if (input.mode === "apply" && input.urls?.length) {
        for (const url of input.urls.slice(0, params.jobsPerDay)) {
          const detail = await scrapeJobDetail(session.page, url);
          const elig = evaluateEligibility(detail, {
            minBudgetUsd: params.minBudgetUsd,
            postedUrls: posted,
            extraBrief: detail.fullBrief,
          });
          if (!elig.accept || !elig.type || detail.alreadyBidUi) {
            const rec: WorkanaBidRecord = {
              id: newId("wbid"),
              date: nowIso(),
              account: params.account,
              title: detail.title,
              url: detail.url,
              type: elig.type,
              amountUsd: null,
              deliveryDays: null,
              status: detail.alreadyBidUi ? "skip_ya_postulado" : "skip_filtro",
              error: elig.reasons.join(","),
            };
            results.push(rec);
            await appendBid(rec);
            continue;
          }
          const pricing = planPricing(detail, elig.type);
          const proposal = buildProposal({ detail, type: elig.type, pricing });
          if (params.dryRun) {
            const rec: WorkanaBidRecord = {
              id: newId("wbid"),
              date: nowIso(),
              account: params.account,
              title: detail.title,
              url: detail.url,
              type: elig.type,
              amountUsd: pricing.amountUsd,
              deliveryDays: pricing.deliveryDays,
              status: "pending_approval",
              proposalPreview: proposal.slice(0, 280),
              error: "dry_run",
            };
            results.push(rec);
            await appendBid(rec);
            continue;
          }
          const submit = await submitBid(session.page, {
            amountUsd: pricing.amountUsd,
            deliveryDays: pricing.deliveryDays,
            content: proposal,
          });
          const rec: WorkanaBidRecord = {
            id: newId("wbid"),
            date: nowIso(),
            account: params.account,
            title: detail.title,
            url: detail.url,
            type: elig.type,
            amountUsd: pricing.amountUsd,
            deliveryDays: pricing.deliveryDays,
            status: submit.ok ? "enviada" : submit.error === "skip_ya_postulado" ? "skip_ya_postulado" : "fail",
            error: submit.ok ? undefined : submit.error,
            proposalPreview: proposal.slice(0, 280),
          };
          results.push(rec);
          await appendBid(rec);
          await sleep(randomDelayMs(params.delayBetweenBidsSec));
        }
      }

      let alert: string | undefined;
      const enviadas = results.filter((r) => r.status === "enviada").length;
      if (ranked.length === 0 && results.length === 0) {
        alert = "sin matches — 0 jobs elegibles (código∨Shopify); no forzar WordPress/WA";
      } else if (input.mode === "scan") {
        alert = `scan: ${candidates.length} candidatos listos (no enviados)`;
      } else if (params.humanGate) {
        alert = `human_gate: ${candidates.length} candidatos esperan OK de Phil antes de apply`;
      } else if (!params.dryRun && enviadas === 0 && candidates.length === 0 && results.every((r) => r.status.startsWith("skip"))) {
        alert = "sin matches tras filtro / ya postulados";
      }

      const finished = await finishDailyRun(run.id, {
        scanned: cards.length,
        eligible: ranked.length,
        results,
        alert,
      });

      return {
        summary: formatDailySummary(finished!),
        runId: run.id,
        alert,
        candidates,
        results,
      };
    } finally {
      await closeWorkanaSession(session);
    }
  },
} satisfies ToolDefinition<Input, Output>;
