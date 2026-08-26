# Wavys OS — Cobro (Polar, no Stripe directo en Perú)

**Fecha:** 2026-07-21  
**Investigación:** Stripe **no** ofrece cuenta merchant estándar en Perú.  
**Polar** sí lista **Perú** para payouts vía Stripe Connect Express, porque Polar es **Merchant of Record** (cobra el cliente; a ti te paga).

---

## 1. Conclusión

| Opción | ¿Sirve desde Perú? | Veredicto |
|--------|--------------------|-----------|
| **Stripe Payments** (cuenta propia) | No (PE no soportado como business country) | No para cobrar directo |
| **Polar** | Sí (MoR + payout PE en lista Connect Express) | **Elegido para Wavys OS** |
| Culqi / Niubiz / Yape | Sí, local PEN | Fase 2 si quieres tarjetas locales sin fricción internacional |

**Decisión:** suscripciones y top-ups de créditos → **Polar**.  
Stripe “solo” aparece por debajo en Connect para **recibir** payouts, no como checkout tuyo.

Docs: [polar.sh/docs](https://polar.sh/docs/introduction) · [Supported countries](https://polar.sh/docs/merchant-of-record/supported-countries) (incluye 🇵🇪 Peru).

---

## 2. Qué vende Polar en OS

| Producto Polar | Mapeo Wavys |
|----------------|-------------|
| Subscription Presence | Plan Presence S/… |
| Subscription Operate | Plan Operate |
| Subscription Scale | Plan Scale |
| Add-on Marketing Posts / Pro | +S/89 / +S/149 |
| One-shot credit packs | Top-ups S/39 / 69 / 149 |

Precios en Polar pueden ir en **USD** (común en MoR) con equivalente S/ en la web comercial; o product prices en USD convertidos. Definir moneda de catálogo Polar en implementación (recomendación: **USD** en Polar + mostrar S/ aprox al cliente PE).

---

## 2.1 Product IDs — sandbox (2026-07-23)

Planes creados en Polar **sandbox**. Mapear en `wavys-os` vía `POLAR_PRODUCT_*` (ver `.env.example` + `packages/shared/src/polar-catalog.ts`).

| Plan | Precio S/ | Env | Product ID (sandbox) |
|------|-----------|-----|----------------------|
| **Presence** | 169 | `POLAR_PRODUCT_PRESENCE` | `37640cf7-3e55-4215-9bd6-a8e5c4582841` |
| **Operate** | 279 | `POLAR_PRODUCT_OPERATE` | `e37bdc5f-de15-4f53-ad39-9ee47a12f589` |
| **Scale** | 449 | `POLAR_PRODUCT_SCALE` | `9ff5cc6d-4c07-43ac-b834-ad91232f6d09` |

**Moneda en Polar (sandbox, verificado 2026-07-23):** precios en **PEN** (S/169 · S/279 · S/449), no USD.  
**Auth:** `POLAR_ACCESS_TOKEN` = OAT sandbox en `wavys-os/.env` (no commitear). Smoke: `GET /v1/products` + checkout Presence OK.  
**Webhook:** `POLAR_WEBHOOK_SECRET` configurado en `wavys-os/.env` (2026-07-23). Endpoint local vía túnel → `POST /webhooks/polar`.  
**E2E sandbox FULL (2026-07-23):** pago real tarjeta `4242…` → Polar webhooks `subscription.active` + `order.paid` (HTTP 202 vía cloudflared) → DB `plan=presence` `status=active` **150 créditos** + `polarSubscriptionId`. Script: `scripts/e2e-polar-fullpay.ts` + Playwright fill `input[name=number|expiry|cvc]` en iframe Stripe.  
**Pendiente sandbox:** add-ons/top-ups · checkout UI en app (hoy stub) · túnel estable en día a día (`cloudflared` / `polar listen`).  
**Prod:** IDs distintos; no reutilizar sandbox. Bloqueado hasta OK legal.

---

## 3. Flujo

```text
Usuario elige plan en chat/panel
    → Checkout Polar (hosted o embed)
    → Webhook polar → TenantSubscription active + créditos
    → Fallo pago → status past_due → chat avisa
```

Payout Phil: Connect Express → banco PE (misma moneda local según reglas Stripe Connect).

---

## 4. Fees (orden de magnitud)

Polar: platform fee (ej. ~4%+ fijo según plan Polar) + pass-through tarjeta.  
Más caro que Stripe “puro”, pero incluye MoR/impuestos internacionales y desbloquea PE.

---

## 5. No olvidar

- Sandbox Polar antes de prod  
- Webhooks firmados → actualizar entitlements  
- Refunds / cancelación de sub  
- Factura/comprobante: Polar emite como MoR; revisar si el cliente PE necesita boleta local (asesor contable)

---

*Ubicación:* `data/wavys-os-brief/cobro-polar.md`
