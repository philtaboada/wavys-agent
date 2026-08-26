import type { PricingPlan, WorkanaJobDetail, WorkanaJobType } from "./types.js";

export type ProposalInput = {
  detail: WorkanaJobDetail;
  type: WorkanaJobType;
  pricing: PricingPlan;
  specialtyLine?: string;
};

function firstName(name: string | null, lang: WorkanaJobDetail["language"]): string {
  if (!name) return lang === "en" ? "there" : lang === "pt" ? "olá" : "";
  const cleaned = name.replace(/^Cliente\s*/i, "").trim();
  const part = cleaned.split(/\s+/)[0] ?? cleaned;
  return part;
}

function defaultSpecialty(type: WorkanaJobType, lang: WorkanaJobDetail["language"]): string {
  if (type === "shopify") {
    if (lang === "en") return "Shopify developer focused on themes, apps and store integrations";
    if (lang === "pt") return "desenvolvedor Shopify focado em themes, apps e integrações";
    return "desarrollador Shopify enfocado en themes, apps e integraciones";
  }
  if (lang === "en") return "fullstack developer building custom web apps, APIs and SaaS MVPs";
  if (lang === "pt") return "desenvolvedor fullstack de apps web custom, APIs e MVPs SaaS";
  return "desarrollador fullstack de apps web a medida, APIs y MVPs SaaS";
}

function briefBullets(detail: WorkanaJobDetail, max = 2): string[] {
  const text = detail.fullBrief || detail.snippet;
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 220);
  const picked = sentences.slice(0, max);
  if (picked.length) return picked.map((s) => s.replace(/^[-•]\s*/, ""));
  return [
    detail.title,
    detail.snippet.slice(0, 160) || (detail.language === "en" ? "Reviewed the project goals and constraints." : "Revisé objetivos y restricciones del brief."),
  ].filter(Boolean);
}

function stackFor(type: WorkanaJobType, detail: WorkanaJobDetail, pricing: PricingPlan): string[] {
  const text = `${detail.title} ${detail.fullBrief} ${detail.skills.join(" ")}`;
  if (type === "shopify") {
    if (pricing.amountUsd <= 1000) {
      return [
        "Shopify Online Store 2.0 + Liquid / theme sections",
        "Pagos, catálogo y configuración operativa (sin stack enterprise)",
      ];
    }
    return [
      "Shopify app / extensions (Checkout UI / Admin) según alcance",
      "Integraciones API Admin GraphQL + webhooks",
    ];
  }
  if (/\b(next\.?js|react)\b/i.test(text)) {
    return ["Next.js + TypeScript", "API/backend y base de datos según MVP"];
  }
  if (/\b(laravel|php)\b/i.test(text)) {
    return ["Laravel + API REST", "Panel admin y auth"];
  }
  if (pricing.amountUsd >= 2500) {
    return ["Arquitectura por fases (discovery → MVP)", "Stack web moderno (TypeScript) alineado al presupuesto de Fase 1"];
  }
  return ["Stack web fullstack pragmático (TypeScript)", "Entrega incremental con demos cortas"];
}

function scopeLines(type: WorkanaJobType, pricing: PricingPlan, lang: WorkanaJobDetail["language"]): string[] {
  if (pricing.isPhase1) {
    if (lang === "en") {
      return [
        "Discovery: requirements, risks and MVP boundary",
        "Core flows implementation for Phase 1",
        "Handoff notes + next-phase roadmap",
      ];
    }
    return [
      "Discovery: requisitos, riesgos y límite del MVP",
      "Implementación de flujos core de Fase 1",
      "Handoff + roadmap de siguientes fases",
    ];
  }
  if (type === "shopify") {
    return lang === "en"
      ? ["Theme / store setup aligned to brief", "Payments + catalog essentials", "QA on desktop/mobile before handoff"]
      : ["Theme / tienda según brief", "Pagos + catálogo esencial", "QA desktop/móvil antes del handoff"];
  }
  return lang === "en"
    ? ["Core feature set agreed in brief", "API/data layer as needed", "Deploy + short walkthrough"]
    : ["Features core acordadas en el brief", "Capa API/datos según necesidad", "Deploy + walkthrough corto"];
}

/** Plantilla Arnold — personalizar con detalle concreto del brief; no Wavys/Phil. */
export function buildProposal(input: ProposalInput): string {
  const { detail, type, pricing } = input;
  const lang = detail.language === "other" ? "es" : detail.language;
  const name = firstName(detail.clientName, lang);
  const specialty = input.specialtyLine ?? defaultSpecialty(type, lang);
  const understanding = briefBullets(detail, 2);
  const stack = stackFor(type, detail, pricing);
  const scope = scopeLines(type, pricing, lang);
  const scopeTitle = pricing.isPhase1
    ? lang === "en"
      ? "SCOPE — PHASE 1"
      : lang === "pt"
        ? "ESCOPO — FASE 1"
        : "ALCANCE INCLUIDO — FASE 1"
    : lang === "en"
      ? "SCOPE INCLUDED"
      : lang === "pt"
        ? "ESCOPO INCLUÍDO"
        : "ALCANCE INCLUIDO";

  const hello =
    lang === "en"
      ? `Hi${name && name !== "there" ? ` ${name}` : ""},`
      : lang === "pt"
        ? `Olá${name && name !== "olá" ? ` ${name}` : ""},`
        : `Hola${name ? ` ${name}` : ""},`;

  const intro =
    lang === "en"
      ? `I'm Arnold, ${specialty}.`
      : lang === "pt"
        ? `Sou Arnold, ${specialty}.`
        : `Soy Arnold, ${specialty}.`;

  const sections =
    lang === "en"
      ? {
          understanding: "UNDERSTANDING",
          approach: "APPROACH / STACK",
          delivery: "DELIVERABLES & TIMELINE",
          close: "Happy to jump on a short call to align details.",
          deliveryEst: `Estimated delivery: ${pricing.deliveryDays} days`,
        }
      : lang === "pt"
        ? {
            understanding: "ENTENDIMENTO",
            approach: "ABORDAGEM / STACK",
            delivery: "ENTREGÁVEIS E PRAZO",
            close: "Fico à disposição para uma call curta se quiserem alinhar detalhes.",
            deliveryEst: `Entrega estimada: ${pricing.deliveryDays} dias`,
          }
        : {
            understanding: "ENTENDIMIENTO",
            approach: "ENFOQUE / STACK",
            delivery: "ENTREGABLES Y PLAZO",
            close: "Quedo atento a una call corta si quieren alinear detalles.",
            deliveryEst: `Entrega estimada: ${pricing.deliveryDays} días`,
          };

  const lines: string[] = [];
  if (detail.secretKeyword) {
    lines.push(detail.secretKeyword, "");
  }
  lines.push(
    hello,
    intro,
    "",
    sections.understanding,
    ...understanding.map((b) => `• ${b}`),
    "",
    sections.approach,
    ...stack.map((b) => `• ${b}`),
    "",
    scopeTitle,
    ...scope.map((b, i) => `${i + 1}. ${b}`),
    "",
    sections.delivery,
    `• ${pricing.note}`,
    `• ${sections.deliveryEst}`,
    "",
    "CIERRE",
    sections.close,
    "",
    "Arnold",
  );

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function detectLanguage(text: string): WorkanaJobDetail["language"] {
  const sample = text.slice(0, 2000).toLowerCase();
  const pt = (sample.match(/\b(você|preciso|projeto|orçamento|desenvolvimento)\b/g) ?? []).length;
  const en = (sample.match(/\b(the|and|project|looking|need|budget|developer)\b/g) ?? []).length;
  const es = (sample.match(/\b(que|para|proyecto|necesito|presupuesto|desarrollo)\b/g) ?? []).length;
  if (pt > en && pt > es) return "pt";
  if (en > es && en > pt) return "en";
  if (es > 0) return "es";
  return "other";
}

export function extractSecretKeyword(brief: string): string | null {
  const patterns = [
    /(?:palabra|código|codigo|keyword|code)\s*(?:secreto|secret)?\s*[:\-–]\s*["']?([A-Za-z0-9_\-]{3,40})["']?/i,
    /(?:escriba|escribe|write|mention|menciona)\s+(?:la\s+palabra\s+)?["']([A-Za-z0-9_\-]{3,40})["']/i,
    /(?:start|empieza|inicie)\s+(?:your\s+proposal|tu\s+propuesta)\s+with\s+["']([A-Za-z0-9_\-]{3,40})["']/i,
  ];
  for (const re of patterns) {
    const m = brief.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}
