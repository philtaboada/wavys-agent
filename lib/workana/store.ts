import { newId, nowIso, readJsonStore, writeJsonStore } from "../store.js";
import { normalizeJobUrl } from "./filter.js";
import type { WorkanaBidRecord, WorkanaBidsStore, WorkanaDailyRun } from "./types.js";

const STORE_FILE = "workana-bids.json";

const emptyStore = (): WorkanaBidsStore => ({
  version: 1,
  postedUrls: [],
  runs: [],
  bids: [],
});

export async function loadBidsStore(): Promise<WorkanaBidsStore> {
  const store = await readJsonStore<WorkanaBidsStore>(STORE_FILE, emptyStore());
  if (!store.version) return emptyStore();
  store.postedUrls = store.postedUrls ?? [];
  store.runs = store.runs ?? [];
  store.bids = store.bids ?? [];
  return store;
}

export async function saveBidsStore(store: WorkanaBidsStore): Promise<string> {
  return writeJsonStore(STORE_FILE, store);
}

export function postedUrlSet(store: WorkanaBidsStore): Set<string> {
  return new Set(store.postedUrls.map(normalizeJobUrl));
}

export async function appendBid(record: Omit<WorkanaBidRecord, "id"> & { id?: string }): Promise<WorkanaBidRecord> {
  const store = await loadBidsStore();
  const bid: WorkanaBidRecord = {
    ...record,
    id: record.id ?? newId("wbid"),
  };
  store.bids.push(bid);
  if (bid.status === "enviada") {
    const url = normalizeJobUrl(bid.url);
    if (!store.postedUrls.includes(url)) store.postedUrls.push(url);
  }
  await saveBidsStore(store);
  return bid;
}

export async function startDailyRun(partial: Omit<WorkanaDailyRun, "id" | "startedAt" | "results"> & { results?: WorkanaBidRecord[] }): Promise<WorkanaDailyRun> {
  const store = await loadBidsStore();
  const run: WorkanaDailyRun = {
    id: newId("wrun"),
    startedAt: nowIso(),
    account: partial.account,
    jobsPerDay: partial.jobsPerDay,
    scanned: partial.scanned,
    eligible: partial.eligible,
    results: partial.results ?? [],
    alert: partial.alert,
  };
  store.runs.unshift(run);
  store.runs = store.runs.slice(0, 60);
  await saveBidsStore(store);
  return run;
}

export async function finishDailyRun(runId: string, patch: Partial<WorkanaDailyRun>): Promise<WorkanaDailyRun | null> {
  const store = await loadBidsStore();
  const idx = store.runs.findIndex((r) => r.id === runId);
  if (idx < 0) return null;
  const updated: WorkanaDailyRun = {
    ...store.runs[idx]!,
    ...patch,
    finishedAt: patch.finishedAt ?? nowIso(),
  };
  store.runs[idx] = updated;
  for (const bid of updated.results) {
    if (bid.status === "enviada") {
      const url = normalizeJobUrl(bid.url);
      if (!store.postedUrls.includes(url)) store.postedUrls.push(url);
    }
    if (!store.bids.some((b) => b.id === bid.id)) store.bids.push(bid);
  }
  await saveBidsStore(store);
  return updated;
}

export function formatDailySummary(run: WorkanaDailyRun): string {
  const lines = [
    `Workana daily — ${run.account} — ${run.startedAt.slice(0, 10)}`,
    `Escaneados: ${run.scanned} · Elegibles: ${run.eligible} · Target: ${run.jobsPerDay}`,
    "",
    "| # | Proyecto | URL | Tipo | Oferta | Plazo | Estado |",
    "|---|----------|-----|------|--------|-------|--------|",
  ];
  run.results.forEach((r, i) => {
    lines.push(
      `| ${i + 1} | ${r.title.replace(/\|/g, "/")} | ${r.url} | ${r.type ?? "-"} | ${r.amountUsd ?? "-"} | ${r.deliveryDays ?? "-"} | ${r.status} |`,
    );
  });
  if (run.alert) {
    lines.push("", `Alert: ${run.alert}`);
  }
  return lines.join("\n");
}
