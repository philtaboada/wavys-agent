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
