#!/usr/bin/env tsx
/** Smoke tests puros (sin browser) para filtro / pricing / proposal. */
import assert from "node:assert/strict";
import {
  buildProposal,
  evaluateEligibility,
  parseBudgetText,
  planPricing,
  rankJobs,
} from "../lib/workana/index.js";

function card(partial: {
  title: string;
  snippet: string;
  budget?: string;
  proposals?: number;
  url?: string;
  alreadyBidUi?: boolean;
}) {
  const budget = parseBudgetText(partial.budget ?? "USD 500 - 1000");
  return {
    title: partial.title,
    url: partial.url ?? "https://www.workana.com/job/demo-slug",
    budgetText: partial.budget ?? "USD 500 - 1000",
    budgetMinUsd: budget.min,
    budgetMaxUsd: budget.max,
    proposalsCount: partial.proposals ?? 8,
    snippet: partial.snippet,
    alreadyBidUi: partial.alreadyBidUi,
  };
}

{
  const ok = evaluateEligibility(
    card({
      title: "API SaaS dashboard Next.js",
      snippet: "Necesito un backend y dashboard fullstack con APIs REST",
    }),
  );
  assert.equal(ok.accept, true);
  assert.equal(ok.type, "codigo");
}

{
  const shop = evaluateEligibility(
    card({
      title: "Tienda Shopify + pagos",
      snippet: "Lanzar catálogo y theme Liquid en Shopify",
      url: "https://www.workana.com/job/shopify-store",
    }),
  );
  assert.equal(shop.accept, true);
  assert.equal(shop.type, "shopify");
}

{
  const wp = evaluateEligibility(
    card({
      title: "WordPress + WooCommerce tienda",
      snippet: "Necesito una tienda WooCommerce con Elementor",
      url: "https://www.workana.com/job/wp-woo",
    }),
  );
  assert.equal(wp.accept, false);
  assert.ok(wp.reasons.some((r) => r.includes("wordpress") || r.includes("woocommerce")));
}

{
  const wa = evaluateEligibility(
    card({
      title: "Chatbot WhatsApp GHL",
      snippet: "Automatización GoHighLevel + WhatsApp bot",
      url: "https://www.workana.com/job/wa-bot",
    }),
  );
  assert.equal(wa.accept, false);
  assert.ok(wa.reasons.some((r) => r.includes("chatbot")));
}

{
  const posted = evaluateEligibility(
    card({
      title: "React app",
      snippet: "Desarrollo web custom React",
      url: "https://www.workana.com/job/already",
    }),
    { postedUrls: ["https://www.workana.com/job/already"] },
  );
  assert.equal(posted.accept, false);
}

{
  const ranked = rankJobs(
    [
      card({
        title: "WordPress blog",
        snippet: "WordPress SEO",
        url: "https://www.workana.com/job/a",
        proposals: 2,
      }),
      card({
        title: "ERP custom APIs",
        snippet: "Plataforma ERP SaaS con APIs",
        budget: "USD 3000 - 5000",
        url: "https://www.workana.com/job/b",
        proposals: 4,
      }),
      card({
        title: "Shopify theme",
        snippet: "Custom Liquid theme Shopify",
        budget: "USD 500 - 1000",
        url: "https://www.workana.com/job/c",
        proposals: 20,
      }),
    ],
    (c) => evaluateEligibility(c),
    5,
  );
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0]?.eligibility.type, "codigo");
}

{
  const pricing = planPricing(
    {
      title: "Tienda Shopify lanzamiento",
      snippet: "catálogo y pagos",
      fullBrief: "Necesito lanzar tienda Shopify con catálogo y pagos",
      budgetMinUsd: 500,
      budgetMaxUsd: 1000,
      minBidUsd: null,
    },
    "shopify",
  );
  assert.ok(pricing.amountUsd >= 500 && pricing.amountUsd <= 1000);
  assert.ok(pricing.deliveryDays >= 14 && pricing.deliveryDays <= 21);
}

{
  const proposal = buildProposal({
    detail: {
      title: "API SaaS",
      url: "https://www.workana.com/job/x",
      budgetText: "USD 1000",
      budgetMinUsd: 1000,
      budgetMaxUsd: 1000,
      proposalsCount: 3,
      snippet: "API REST para SaaS de inventario",
      clientName: "María López",
      fullBrief: "Necesitamos APIs REST y un dashboard para inventario. Keyword secreto: ALFA42",
      skills: ["Node.js", "React"],
      secretKeyword: "ALFA42",
      minBidUsd: null,
      deliveryDaysHint: null,
      language: "es",
    },
    type: "codigo",
    pricing: { amountUsd: 1000, deliveryDays: 25, isPhase1: false, note: "Rango 500–1000" },
  });
  assert.match(proposal, /^ALFA42/);
  assert.match(proposal, /Arnold/);
  assert.doesNotMatch(proposal, /Wavys|Phil/i);
  assert.match(proposal, /María/);
}

console.log(JSON.stringify({ ok: true, tests: 8 }, null, 2));
