---
description: Gestionar leads de LinkedIn, agencias partner y envío de propuestas comerciales.
---

# Pipeline comercial (LinkedIn y agencias)

**Gate 0 (pasos):** `agent/context/pipeline-gates.md` § `sales_pipeline`

**Gate 1+ (calidad):** mismo doc § Gate 1+ `sales_pipeline` — `data/pipeline-runs/<lead>-sales-validation.md` (plantilla `_TEMPLATE-sales-validation.md`). **SP-05:** OK Phil obligatorio antes de `send_email`.

Usa esta skill cuando haya respuestas de LinkedIn, pedidos de propuesta, seguimiento a agencias o clientes tipo Onza.

## Clasificar el lead

| Señal | Tipo | Oferta |
|-------|------|--------|
| Agencia de marketing / consultora | Partner | Colaboración, white-label, implementación para sus clientes |
| Empresa con leads por WhatsApp | Cliente SaaS | Wavys Quoter / ReActiva / 24/7 |
| Pide "propuesta" o email corporativo | Caliente | Enviar propuesta en <24h |

## Flujo Onza (y similares)

1. Registrar lead:

```bash
npm run tool -- log_business_note '{"content":"Onza Marketing respondió LinkedIn. Pidieron propuesta a asesoria@onzamarketing.com. Partner potencial.","category":"ventas","tags":["onza","linkedin","partner"]}'
```

2. Redactar propuesta de **colaboración para agencias** (no solo producto):
   - Opcional: **`generalPurpose`** subagente solo para borrador — prompt en `agent/pipelines/subagents.md` § sales. El padre revisa antes de mostrar a Phil.
   - Qué complementa para sus clientes (captura + calificación + seguimiento WhatsApp).
   - Modelos: referido, co-entrega, implementación white-label.
   - Piloto sugerido con 1 cliente de ellos o demo en 20 min.
   - CTA: llamada de exploración + propuesta adjunta.

3. Confirmar borrador con Phil → enviar:

```bash
npm run tool -- send_email '{"to":["asesoria@onzamarketing.com"],"subject":"Propuesta de colaboración — Automatización IA WhatsApp (Wavys)","body":"..."}'
```

4. Recordatorio seguimiento 48h:

```bash
npm run tool -- create_reminder '{"title":"Follow-up Onza si no responden al correo","dueAt":"2026-07-03T10:00:00-05:00","notes":"LinkedIn + email asesoria@onzamarketing.com"}'
```

## Plantilla de asunto (correo)

- Partner: `Propuesta de colaboración — Automatización con IA para leads WhatsApp`
- Cliente directo: `Propuesta Wavys — [Nombre empresa] — más reuniones desde WhatsApp`

## No hacer

- Enviar propuesta genérica SaaS a una agencia sin mencionar colaboración.
- Prometer integraciones no confirmadas con su stack.
