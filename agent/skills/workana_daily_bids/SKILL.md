---
description: Postulación diaria Workana (cuenta Arnold S) — IT/código o Shopify, 5/día.
---

# Workana — postulación diaria (Arnold S)

Usá esta skill en el cron diario o cuando Phil pida postular en Workana.

## Objetivo

Cada día, postular a **5** proyectos desde **Arnold S**, solo si son **desarrollo de código** o **Shopify**.

## Parámetros (defaults)

| Param | Default |
|-------|---------|
| jobs_per_day | 5 |
| min_budget_usd | 250 |
| preferred_budget_usd | 500 |
| category | it-programming |
| account | Arnold S |
| include | codigo_custom, shopify |
| exclude | wordpress, woocommerce, magento, prestashop, vtex, tiendanube, wix, whatsapp, chatbot, ghl, gohighlevel, make+wa |
| delay_between_bids_sec | 10–30 |
| human_gate | false (opcional true) |
| dedupe_store | `data/workana-bids.json` |

## Flujo (1 línea)

Buscar IT → filtrar (código ∨ Shopify) ∧ ¬WP/Woo/bots → top 5 → redactar → enviar → verificar → loguear → reportar.

## Pasos

1. Confirmar sesión Arnold S (`WORKANA_STORAGE_STATE_JSON` o `data/workana-storage-state.json`). Si caducó → **parar y avisar** (re-login manual). Ver `agent/connections/workana.md`.
2. Scan / full:

```bash
npm run tool -- workana_daily_bids '{"mode":"scan","jobsPerDay":5}'
npm run tool -- workana_daily_bids '{"mode":"full","jobsPerDay":5}'
```

3. Si `humanGate: true`, mostrar los 5 candidatos (título, URL, tipo, oferta, plazo, preview) y esperar OK de Phil; luego:

```bash
npm run tool -- workana_daily_bids '{"mode":"apply","urls":["https://www.workana.com/job/..."]}'
```

4. Tras el run, reportar tabla a Phil (resumen del tool) + alertas.

## Regla de elegibilidad

```
aceptar =
  (es_codigo_custom OR es_shopify)
  AND NOT wordpress
  AND NOT woocommerce
  AND NOT chatbot_wa
  AND NOT ya_postulado
```

**Incluir:** web, fullstack, SaaS, ERP/POS, APIs, dashboards, apps, backends, integraciones, Shopify (tienda/theme/app/checkout).

**Excluir siempre:** WordPress/Woo, Magento/Presta/VTEX/Tiendanube/Wix/Squarespace, WhatsApp/chatbots/GHL/Make+WA, solo diseño/copy/ads/SEO, UI “Mejorar propuesta”.

## Pricing / plazos

| Señal | Oferta | Plazo |
|-------|--------|-------|
| 250–500 | ~500 | 18–25 d |
| 500–1000 | 900–1000 | 18–30 d |
| Shopify lanzamiento | 500–1000 | 14–21 d |
| Shopify app/integraciones | 900–2500+ | 21–45 d |
| SaaS/ERP grande | 2500–5500 Fase 1 | 30–90 d |
| Form “Presupuesto mínimo” | respetarlo | — |

Si el presupuesto no cubre el alcance → **Fase 1** clara, no milagro.

## Propuesta

- Idioma = idioma del brief.
- Firma = **Arnold** (no Phil / no Wavys).
- Personalizar nombre + detalle concreto; keyword secreto al inicio si pide.
- Stack coherente con presupuesto; cero WP/Woo.

Plantilla implementada en `lib/workana/proposal.ts` (`buildProposal`).

## Fallas / alertas

| Caso | Acción |
|------|--------|
| Sesión caducada | Parar + avisar re-login |
| Form fields missing | fail + screenshot en `data/workana-screenshots/` |
| Sin “Mejorar propuesta” | reintento 1× o fail |
| 0 elegibles | avisar “sin matches”; no forzar WP/WA |

## Credenciales

Ver `agent/connections/workana.md`. Nunca commitear `workana-storage-state.json`.

## Salida

Log: `data/workana-bids.json`  
Estados: `enviada` | `skip_ya_postulado` | `skip_filtro` | `fail` | `pending_approval`
