# Estrategia adquisición — Phil (poco tiempo)

Phil tiene **poco tiempo** y su cuello de botella es **conseguir clientes**, no producto ni contenido masivo.
Este doc manda sobre el plan general cuando haya conflicto de prioridades.

## Campaña activa (Jul 2026)

**Presencia Digital** — producto empaquetado, marketing directo a PYME.

| | |
|--|--|
| **Doc** | `campaigns/presencia-digital.md` |
| **Kit** | `data/presencia-digital-brief/` |
| **Landing** | https://software.wavys-technologies.com/presencia-digital |
| **Meta** | 3 clientes en 14–21 días |
| **Plan acción** | `data/presencia-digital-brief/PLAN-MARKETING-7-DIAS.md` |

**Regla:** si Phil pide clientes rápido, mensajes, pauta o contrato de web con fotos → **Presencia Digital primero**. Partner/Onza sigue en pipeline pero no compite por el mismo bloque de tiempo.

## Diagnóstico

| Lo que funciona | Lo que NO hacer ahora |
|-----------------|---------------------|
| **Presencia Digital** — landing + pricing listos, kit completo | TikTok/IG diario sin CTA a Presencia Digital |
| WhatsApp + referidos (William, JLH, Coophitel) | Rebuild producto, más features SaaS |
| Auditoría web gratis → gancho venta (`website_audit`) | Instalar 15 skills |
| Meta Ads test geo Huancayo (CPL < S/50) | Vender SaaS frío a empresa final |
| LinkedIn → agencias (Onza) — pipeline paralelo | Perfeccionar landing sin vender |

## Dos carriles (90 días)

### Carril A — Presencia Digital *(prioridad tiempo Phil)*

Venta directa PYME: WhatsApp, referidos, Maps, Meta Ads local.

- Producto y precios **ya definidos** — ejecutar plan 7 días.
- Entrega 5–7 días — cashflow recurrente S/149–199/mes.
- Ver `campaigns/presencia-digital.md`.

### Carril B — Partner agencia *(pipeline, no bloque principal)*

LinkedIn → agencias como Onza — mismo mensaje que ya funcionó.

- 1 agencia = N clientes a mediano plazo.
- Cotización custom / white-label — ticket alto.
- Mantener follow-up Onza; no abandonar, pero **no sustituye** Carril A esta semana.

## Ritmo semanal mínimo (~3–5 h total)

| Bloque | Tiempo | Acción |
|--------|--------|--------|
| **Lunes** | 45 min | 10 WhatsApps Presencia Digital (red + Maps) · ver `PLAN-MARKETING-7-DIAS.md` |
| **Martes** | 30 min | Follow-up 48h leads Presencia Digital + Onza si aplica |
| **Miércoles** | 30 min | 1 post/carrusel IG o LinkedIn → link presencia-digital |
| **Jueves** | 60 min | 2 auditorías web gratis + llamada cierre o contrato |
| **Viernes** | 20 min | Pipeline: respuestas, CPL Meta Ads, `log_business_note` |

**Regla:** si solo tienes 1 hora → WhatsApps Presencia Digital + follow-up lead caliente más cercano al cierre.

## Skills recomendados (solo 4 — no más)

Instalar **solo estos** hasta tener 2 conversaciones calificadas/mes:

```bash
npx skills add anthropics/knowledge-work-plugins@compose-outreach -g -y
npx skills add claude-office-skills/skills@proposal-writer -g -y
npx skills add refoundai/lenny-skills@sales-qualification -g -y
npx skills add coreyhaines31/marketingskills@email-sequence -g -y
```

| Skill | Para qué (Phil) |
|-------|-----------------|
| **compose-outreach** | Escribir 5 DMs/semana rápido, estilo Onza |
| **proposal-writer** | Propuesta Onza y similares sin partir de cero |
| **sales-qualification** | Descartar leads malos; no perder tiempo |
| **email-sequence** | Follow-up 48h / 5d sin pensar cada correo |

**Ya instalados — usar, no acumular:**
- `persona-sales-ops` + `gws-gmail-send` + `gws-workflow-meeting-prep`

**Posponer:** copywriting, content-strategy, SEO, paid-ads, TikTok skills, whatsapp integrate (hasta vender).

## 3 palancas rápidas (esta semana)

### 1. Cerrar el loop caliente
- Onza: propuesta hoy + Calendly + follow-up 48h.
- Cualquier otro LinkedIn que haya respondido: mismo tratamiento.

### 2. Referidos de clientes actuales
Mensaje corto a William, JLH, Coophitel:
> "¿Conoces alguna agencia o empresa que pierda leads por WhatsApp? Te agradezco una intro."

1 intro calificada > 20 cold messages.

### 3. LinkedIn / IG mínimo viable (Presencia Digital)
- 1 carrusel o post/semana → link **presencia-digital**
- 5 DMs/semana solo si hay tiempo (agencias Huancayo o partners)
- No TikTok hasta 2 clientes Presencia Digital cerrados

## ICP — dos perfiles (no mezclar mensaje)

| Carril | ICP | Mensaje |
|--------|-----|---------|
| **A — Presencia Digital** | PYME Perú: restaurante, clínica, hotel, profesional | Landing + fotos S/149/mes, 5–7 días |
| **B — Partner** | Agencia 5–50 personas, LatAm, clientes WhatsApp | Colaboración / white-label automatización |

Filtro Presencia Digital:
- ¿Tiene negocio local sin web decente o solo redes? → SÍ seguir
- ¿Va a pautar en Meta? → PRIORIDAD
- ¿Es agencia buscando partner IA? → Carril B (Onza), no Presencia Digital

## Métricas que importan (Presencia Digital)

1. WhatsApps / mensajes enviados / semana (meta: 25+ semana 1)
2. Respuestas recibidas (meta: 5+)
3. Llamadas o WhatsApp calificados (meta: 2+)
4. Cierres / pilotos (meta: 3 en 14–21 días)

Ignorar: followers TikTok, likes sin CTA, features SaaS shipped.

## Qué pedirle a Cursor en cada sesión

Ejemplos de tareas acotadas (poco tiempo):

- "10 mensajes WhatsApp Presencia Digital para Huancayo"
- "Auditoría web gratis + mensaje venta para 3 negocios Maps"
- "Post/carrusel IG Presencia Digital — slide listo"
- "Follow-up 48h leads Presencia Digital"
- "Mensaje referido para William con link presencia-digital"
- "Rellenar contrato Presencia Digital para [cliente]"

Evitar: "mejora Wavys", "plan marketing completo", "integrar 3 APIs".

## Meta 30 días (realista)

- **2 clientes Presencia Digital** cerrados o en contrato
- Plan 7 días ejecutado (WhatsApp + referidos + Meta Ads test)
- Propuesta Onza enviada (Carril B, paralelo)
- Pipeline registrado en `log_business_note` tag `presencia-digital`

## Meta 90 días

- **6+ clientes Presencia Digital** recurrentes
- Meta Ads escalado si CPL < S/30
- 1 partner activo (ideal: Onza o agencia Huancayo)
- Segunda campaña documentada en `campaigns/` si Phil lanza nueva oferta
