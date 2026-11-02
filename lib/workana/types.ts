export type WorkanaJobType = "codigo" | "shopify";

export type WorkanaBidStatus =
  | "enviada"
  | "skip_ya_postulado"
  | "skip_filtro"
  | "fail"
  | "skip_sesion"
  | "pending_approval";

export type WorkanaJobCard = {
  title: string;
  url: string;
  budgetText: string;
  budgetMinUsd: number | null;
  budgetMaxUsd: number | null;
  proposalsCount: number | null;
  snippet: string;
  alreadyBidUi?: boolean;
};

export type WorkanaJobDetail = WorkanaJobCard & {
  clientName: string | null;
  fullBrief: string;
  skills: string[];
  secretKeyword: string | null;
  minBidUsd: number | null;
  deliveryDaysHint: number | null;
  language: "es" | "en" | "pt" | "other";
};

export type EligibilityResult = {
  accept: boolean;
  type: WorkanaJobType | null;
  reasons: string[];
  score: number;
};

export type PricingPlan = {
  amountUsd: number;
  deliveryDays: number;
  isPhase1: boolean;
  note: string;
};

export type WorkanaBidRecord = {
  id: string;
  date: string;
  account: string;
  title: string;
  url: string;
  type: WorkanaJobType | null;
  amountUsd: number | null;
  deliveryDays: number | null;
  status: WorkanaBidStatus;
  error?: string;
  proposalPreview?: string;
};

export type WorkanaDailyRun = {
  id: string;
  startedAt: string;
  finishedAt?: string;
  account: string;
  jobsPerDay: number;
  scanned: number;
  eligible: number;
  results: WorkanaBidRecord[];
  alert?: string;
};

export type WorkanaBidsStore = {
  version: 1;
  postedUrls: string[];
  runs: WorkanaDailyRun[];
  bids: WorkanaBidRecord[];
};

export type WorkanaDailyParams = {
  jobsPerDay: number;
  minBudgetUsd: number;
  preferredBudgetUsd: number;
  category: string;
  account: string;
  include: string[];
  exclude: string[];
  delayBetweenBidsSec: [number, number];
  humanGate: boolean;
  dryRun: boolean;
  language?: string;
};
