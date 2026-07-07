# Meta Ads — Kit de lanzamiento Presencia Digital

**Campaña:** Presencia Digital · **Objetivo:** 3 clientes en 14–21 días  
**Landing:** https://software.wavys-technologies.com/presencia-digital  
**Presupuesto test:** S/20/día × 7 días = **S/140**  
**Kill rule:** CPL > S/50 en 3 días → pausar y cambiar creativo

---

## Skills a usar (ya instalados o en repo)

| Skill | Ruta | Para qué en esta campaña |
|-------|------|--------------------------|
| **paid-ads** | `~/.codex/skills/paid-ads` | Estructura cuenta, targeting, métricas, kill rules |
| **copywriting-frameworks** | `~/.agents/skills/copywriting-frameworks` | PAS / BAB / AIDA para variaciones de copy |
| **content_production** | `agent/skills/content_production/SKILL.md` | Pipeline posts orgánicos que alimentan retargeting |
| **social_design** | `agent/skills/social_design/SKILL.md` | Nuevos creativos 1080×1080 o 1080×1350 |
| **presencia_brief** | `agent/skills/presencia_brief/SKILL.md` | Narrativa valor → suscripción (no precio en gancho frío) |
| **STORYTELLING-GUIA** | `STORYTELLING-GUIA.md` | Arco problema → tensión → resolución → CTA |
| **persona-content-creator** | `~/.claude/skills/persona-content-creator` | Reel 15s desde landing (creativo video) |
| **video_production** | `agent/skills/video_production/SKILL.md` | Si escalas a video ads |

**Referencias paid-ads:**
- `paid-ads/references/platform-setup-checklists.md` — checklist Meta
- `paid-ads/references/ad-copy-templates.md` — fórmulas PAS/BAB
- `paid-ads/references/audience-targeting.md` — lookalikes y retargeting

---

## Pre-vuelo (hacer ANTES de publicar)

### Cuenta Meta

- [ ] Business Manager creado y verificado
- [ ] Cuenta publicitaria con método de pago (soles PEN)
- [ ] Página de Facebook Wavys vinculada
- [ ] Instagram @wavys_technologies vinculado
- [ ] WhatsApp Business conectado a la cuenta (si objetivo = Mensajes)

### Tracking

- [ ] Meta Pixel instalado en landing (evento PageView)
- [ ] Evento **Lead** al enviar formulario de contacto
- [ ] Evento **Contact** al clic en botón WhatsApp
- [ ] Dominio `software.wavys-technologies.com` verificado en Business Manager
- [ ] Aggregated Event Measurement: priorizar Lead > Contact > ViewContent
- [ ] Probar eventos en Events Manager (Test Events)

### Landing

- [ ] Landing carga en < 3 s en móvil
- [ ] Botón WhatsApp funciona (link definitivo — pendiente Phil)
- [ ] Formulario envía a email correcto
- [ ] Pixel Meta + Google Tag activos (incluido en plan Presencia)

### Creativos listos

| Asset | Formato | Uso |
|-------|---------|-----|
| `slide-01-hero.jpg` | 1080×1080 aprox | Ad principal feed |
| `slide-04-fotos.jpg` | — | Antes/después fotos |
| `promo-lleva-tu-web-1080x1350.png` | 4:5 | Feed IG/FB (más espacio) |
| `promo-latam-vibrante-1080x1350.png` | 4:5 | Variante vibrante |
| `Cover-Reel-Presencia-Digital-1080x1920.jpg` | 9:16 | Stories / Reels ads |
| `slide-03-planes.jpg` | — | Retargeting (ya conocen marca) |

---

## Estructura de campaña (copiar en Ads Manager)

### Naming

```
META_Conv_Huancayo_PresenciaDigital_2026Q3
```

### Nivel campaña

| Campo | Valor |
|-------|-------|
| **Objetivo** | Ventas → Conversiones **o** Interacción → Mensajes de WhatsApp |
| **Presupuesto** | S/20/día a nivel campaña (CBO) |
| **Estrategia puja** | Menor costo (test) → Costo por resultado cuando haya 50+ conversiones |

**Recomendación inicial:** **Mensajes WhatsApp** — ciclo de venta PYME es WhatsApp, no formulario web.

### Ad Set 1 — Huancayo local (70% budget mental)

| Campo | Valor |
|-------|-------|
| **Nombre** | `AS_Huancayo_28-55_Emprendimiento` |
| **Geo** | Huancayo + radio 30 km |
| **Edad** | 28–55 |
| **Intereses** | Pequeñas empresas, emprendimiento, restaurantes, clínicas, inmobiliarias |
| **Placement** | Advantage+ (dejar Meta optimizar) |
| **Exclusiones** | Conversores últimos 14 días (cuando tengas audiencia) |

### Ad Set 2 — Junín provincia (20%)

| Campo | Valor |
|-------|-------|
| **Nombre** | `AS_Junin_Provincia_28-55` |
| **Geo** | Junín (sin Lima) |
| **Resto** | Igual que Ad Set 1 |

### Ad Set 3 — Lima metropolitana (10% — activar día 6 si CPL < S/30)

| Campo | Valor |
|-------|-------|
| **Nombre** | `AS_Lima_Metro_28-55` |
| **Geo** | Lima metropolitana |
| **Nota** | Pausado al inicio; activar si Huancayo CPL < S/30 |

---

## Anuncios — 3 variaciones mínimo por ad set

Regla Meta: **mínimo 3 creativos** por ad set para que el algoritmo aprenda.

### Ad A — PAS (problema primero) — `slide-01-hero.jpg`

**Primary text:**
```
¿Tu negocio solo aparece en Instagram?

En Google casi no existes. Y pagar S/1,500+ de golpe a una agencia no es opción.

Presencia Digital de Wavys: landing profesional + fotos incluidas + dominio + hosting + WhatsApp — publicada en 5-7 días.

Suscripción mensual. 12 meses de servicio; después tú decides.

Escríbenos por WhatsApp 👇
```

**Headline:** `Landing + fotos incluidas · 5-7 días`  
**Description:** `Todo el Perú · Sin pagar miles de golpe`  
**CTA button:** `Enviar mensaje de WhatsApp` o `Más información`

---

### Ad B — BAB (antes/después) — `slide-04-fotos.jpg`

**Primary text:**
```
Antes: fotos de celular, sin web en Google, pauta que no convierte.

Después: landing editorial, fotos profesionales, pixel Meta listo para tus campañas.

Wavys Presencia Digital — desde S/149/mes. Dominio, hosting, SEO y soporte incluidos.

¿Te explicamos sin compromiso?
```

**Headline:** `Tu negocio merece verse profesional online`  
**Description:** `Pack Foto Essential incluido`  
**CTA button:** `Enviar mensaje de WhatsApp`

---

### Ad C — Directo (para quien ya pauta) — `promo-lleva-tu-web-1080x1350.png`

**Primary text:**
```
¿Vas a invertir en Meta Ads sin landing que convierta?

Instalamos pixel, WhatsApp y formulario desde el día 1.

Presencia Digital: web profesional publicada en días — no meses.

✅ Dominio + hosting + SSL
✅ SEO técnico
✅ Soporte mensual

Desde S/149/mes · 12 meses de servicio
```

**Headline:** `Llévate tu web profesional`  
**Description:** `Listo para Meta Ads`  
**CTA button:** `Más información` → landing con UTM

---

## Destinos y UTMs

### Si objetivo = WhatsApp

- Destino: **Click to WhatsApp** (número Business de Phil)
- Mensaje prellenado sugerido:
  ```
  Hola, vi su anuncio de Presencia Digital. Me interesa saber cómo funciona para [mi negocio].
  ```

### Si objetivo = Tráfico / Conversiones

**URL con UTM:**
```
https://software.wavys-technologies.com/presencia-digital?utm_source=facebook&utm_medium=paid&utm_campaign=presencia_digital_huancayo&utm_content={{ad.name}}
```

*(Meta reemplaza `{{ad.name}}` automáticamente si usas parámetros dinámicos)*

---

## Métricas y decisiones

| Métrica | Meta semana 1 | Acción |
|---------|---------------|--------|
| **CPL** (costo por lead/WhatsApp) | < S/30 excelente · S/30-50 aceptable | > S/50 → pausar 3 días, cambiar creativo |
| **CTR** | > 1% feed | < 0.5% → nuevo hook visual |
| **Frecuencia** | < 3 | > 4 → fatiga creativo, rotar assets |
| **Respuestas WhatsApp** | 5+ / semana | Registrar en `log_business_note` tag `presencia-digital` |

### Escala (día 6+)

| CPL | Acción |
|-----|--------|
| < S/30 | Subir a S/35/día · activar Ad Set Lima |
| S/30–50 | Nuevo creativo (slide-04 o reel 15s) |
| > S/50 | Pausar paid → orgánico + WhatsApp + referidos |

---

## Secuencia de lanzamiento (30 min)

1. **10 min** — Verificar pixel + WhatsApp en Events Manager
2. **10 min** — Crear campaña + 1 ad set (Huancayo) + 3 ads
3. **5 min** — Revisar preview móvil (Feed + Stories)
4. **5 min** — Publicar con S/20/día
5. **Día 3** — Revisar CPL; aplicar kill rule si aplica
6. **Viernes** — Pipeline review (`growth-focus-phil.md` § ritmo semanal)

---

## Retargeting (semana 2 — cuando haya tráfico)

Crear audiencias custom:

| Audiencia | Ventana | Mensaje |
|-----------|---------|---------|
| Visitantes landing | 7 días | "¿Tienes dudas sobre Presencia Digital? Escríbenos" |
| Visitantes pricing/planes | 14 días | Detalle planes + CTA WhatsApp |
| Video 50%+ | 14 días | Mismo creativo reel o slide-05-proceso |

Excluir siempre: conversores últimos 14 días.

---

## Qué pedirle a Cursor

```
Genera 3 variaciones PAS para Meta Ads Presencia Digital (sin precio en gancho Ad A).
```

```
Audita la landing presencia-digital en móvil — pixel, WhatsApp, velocidad.
```

```
Crea reel 15s desde landing para Ad Set Huancayo (persona-content-creator).
```

```
Registra lead Meta Ads [nombre] en log_business_note tag presencia-digital.
```

---

## Pendiente Phil antes de escalar

- [ ] WhatsApp Business link definitivo en landing
- [ ] Confirmar número para Click to WhatsApp en ads
- [ ] RUC / datos legales si el volumen de leads sube
- [ ] OK creativos `promo-lleva-tu-web` y `promo-latam-vibrante` antes de pautar

---

*Generado 2026-07-07 · Basado en `PLAN-MARKETING-7-DIAS.md`, `presencia-digital.md`, skill `paid-ads`.*
