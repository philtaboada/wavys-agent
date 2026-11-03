import type { PricingPlan, WorkanaJobDetail, WorkanaJobType } from "./types.js";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function respectMin(amount: number, minBid: number | null): number {
  if (minBid == null) return amount;
  return Math.max(amount, Math.ceil(minBid));
}

export function planPricing(
  detail: Pick<
    WorkanaJobDetail,
    "budgetMinUsd" | "budgetMaxUsd" | "minBidUsd" | "title" | "snippet" | "fullBrief"
  >,
  type: WorkanaJobType,
): PricingPlan {
  const text = `${detail.title}\n${detail.snippet}\n${detail.fullBrief}`;
  const min = detail.budgetMinUsd ?? 250;
  const max = detail.budgetMaxUsd ?? min;
  const mid = (min + max) / 2;

  const isLarge =
    type === "codigo" &&
    /\b(saas|erp|plataforma|marketplace|mvp\s+completo|sistema\s+completo)\b/i.test(text);
  const isShopifyApp =
    type === "shopify" && /\b(app|integraci|checkout|custom\s+theme|liquid)\b/i.test(text);
  const isShopifyLaunch =
    type === "shopify" && !isShopifyApp && /\b(tienda|store|lanzamiento|cat[aá]logo|pagos)\b/i.test(text);

  if (isLarge || max >= 3000) {
    const phase = respectMin(clamp(Math.round(mid * 0.45), 2500, 5500), detail.minBidUsd);
    return {
      amountUsd: phase,
      deliveryDays: clamp(Math.round(30 + (phase / 5500) * 60), 30, 90),
      isPhase1: true,
      note: "Fase 1 discovery/MVP — alcance completo no cabe en un solo bid",
    };
  }

  if (type === "shopify" && isShopifyApp) {
    const amount = respectMin(clamp(Math.round(max >= 1000 ? Math.min(max * 0.9, 2500) : 900), 900, 2500), detail.minBidUsd);
    return {
      amountUsd: amount,
      deliveryDays: clamp(Math.round(21 + (amount / 2500) * 24), 21, 45),
      isPhase1: false,
      note: "Shopify app / integraciones / theme custom",
    };
  }

  if (type === "shopify" && isShopifyLaunch) {
    const amount = respectMin(clamp(Math.round(mid), 500, 1000), detail.minBidUsd);
    return {
      amountUsd: amount,
      deliveryDays: clamp(Math.round(14 + ((amount - 500) / 500) * 7), 14, 21),
      isPhase1: false,
      note: "Shopify lanzamiento (catálogo + pagos + theme)",
    };
  }

  if (max <= 500 || (min >= 250 && max <= 500)) {
    return {
      amountUsd: respectMin(Math.min(500, max || 500), detail.minBidUsd),
      deliveryDays: 22,
      isPhase1: false,
      note: "Rango 250–500 → techo ~500",
    };
  }

  if (max <= 1000) {
    const amount = respectMin(clamp(Math.round(Math.max(900, mid)), 900, 1000), detail.minBidUsd);
    return {
      amountUsd: Math.min(amount, max || amount),
      deliveryDays: clamp(Math.round(18 + ((amount - 900) / 100) * 12), 18, 30),
      isPhase1: false,
      note: "Rango 500–1000",
    };
  }

  const amount = respectMin(clamp(Math.round(max * 0.85), 1000, max), detail.minBidUsd);
  return {
    amountUsd: amount,
    deliveryDays: clamp(Math.round(21 + (amount / 5000) * 40), 21, 60),
    isPhase1: amount < max * 0.6,
    note: amount < max * 0.6 ? "Propuesta fase 1 alineada a presupuesto" : "Oferta alineada al rango del cliente",
  };
}
