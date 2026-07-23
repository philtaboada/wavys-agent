# Wavys OS — Costos, créditos IA y precios (cómo funciona para PYME)

**Documento de unit economics / monetización**  
**Fecha:** 2026-07-21  
**Para:** Phil / Wavys  
**Depende de:** [planes-entitlements-chat.md](./planes-entitlements-chat.md)  
**Estado:** modelo de costos + propuesta de precios (números a validar con Phil antes de publicar)

---

## 1. El problema (por qué te preocupa con razón)

Los planes **Presence / Operate / Scale** sin precio son incompletos porque cada acción del chat cuesta dinero real:

| Gasto | Ejemplos |
|-------|----------|
| **IA texto / agente** | Chat, detectar pack, importar Excel, editar copy |
| **IA imágenes** | Gemini `gemini-3.1-flash-lite-image` (~**USD 0.034** / imagen 1K) |
| **Generar / regenerar website** | Skill + posibles imágenes de hero/secciones |
| **Hosting / deploy** | Vercel (sites + panel), dominio, SSL |
| **DB / storage** | Oferta masiva, fotos de productos |
| **Soporte** | Tiempo humano cuando el chat no alcanza |

Si el cliente regenera la web 40 veces o pide 200 imágenes Gemini al mes **sin tope**, el plan de S/149 puede dar pérdida.

**Solución de producto:** suscripción (plataforma) + **créditos IA** (uso variable). Así la empresa pequeña/mediana paga predecible, y el abuso se corta solo.

---

## 2. Para quién es (ICP de precio)

No es enterprise gigante. Es **PYME que ya vende** (tiene clientes, WhatsApp, local o delivery):

- Tienda, salón, resto, clínica, taller, hotel chico, profesional, B2B local  
- Puede pagar **S/150–450/mes** si le ahorra tiempo y desorden  
- Ancla de mercado hoy: **Presencia Digital** S/149–229/mes  

Wavys OS debe sentirse como **upgrade natural** de Presencia Digital, no como Salesforce.

---

## 3. Cómo funciona el dinero (modelo mental)

```text
┌─────────────────────────────────────────┐
│  SUSCRIPCIÓN MENSUAL (plan)             │
│  → derecho a pack + módulos + límites   │
│  → incluye un pack de CRÉDITOS IA/mes   │
└─────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────┐
│  CRÉDITOS IA (se gastan con el chat)    │
│  → generar web, editar, imágenes Gemini │
│  → si se acaban: compra top-up o espera │
└─────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────┐
│  INFRA FIJA (absorbida en el plan)      │
│  → hosting site, DB base, SSL           │
└─────────────────────────────────────────┘
```

El chat, antes de ejecutar una tool cara, chequea:

1. ¿El **plan** permite el módulo?  
2. ¿Quedan **créditos** (o el límite soft del mes)?  
3. Si no → explica: *“Te quedan 0 créditos de imagen; compra pack o espera el próximo mes.”*

---

## 4. Costos variables estimados (referencia 2026)

> Tipo de cambio de trabajo: **USD 1 ≈ S/3.70** (ajustar). Márgenes con buffer.

### 4.1 Imágenes (Gemini — modelo Wavys)

| Concepto | Costo aprox. |
|----------|----------------|
| `gemini-3.1-flash-lite-image` 1K | **~USD 0.034** ≈ **S/0.13** / imagen |
| 10 imágenes (pack foto chico) | ~USD 0.34 ≈ S/1.3 |
| 50 imágenes / mes | ~USD 1.70 ≈ S/6.3 |
| 200 imágenes / mes | ~USD 6.70 ≈ S/25 |

Costo bajo por imagen, pero **sin tope** un cliente “creativo” puede disparar cientos.

### 4.2 Chat / agente (orden de magnitud)

Depende del modelo (Flash-Lite vs Pro). Orden de magnitud realista:

| Acción | Costo estimado Wavys |
|--------|----------------------|
| Mensaje chat simple | USD 0.005–0.02 |
| Import Excel + validación | USD 0.05–0.30 |
| Generar website completa (texto+orquestación) | USD 0.50–3.00 |
| Edición puntual de web | USD 0.10–0.80 |
| Generar web + 8 imágenes Gemini | USD 0.80–3.50 |

### 4.3 Infra fija por tenant (orden de magnitud)

| Concepto | Estimación / mes |
|----------|------------------|
| Hosting site + preview | USD 0.50–3 (promedio bajo con Fluid/serverless) |
| DB + storage fotos (Operate) | USD 1–8 según catálogo |
| Dominio (prorrateo año 1) | ~USD 1–1.5 / mes |

**Regla de diseño:** el plan debe cubrir infra + **créditos incluidos** + margen ≥ 50–60% en uso “normal”, no en abuso.

---

## 4b. Enrutamiento de modelos (Vercel AI Gateway)

**Decisión Phil (2026-07-21):** no todo usa el mismo modelo.

| Momento | Qué modelo | Por qué |
|---------|------------|---------|
| **Primera creación de website** (y regeneraciones “full” de calidad) | Uno **potente**: Grok 4.5 **o** Kimi K3 **o** GPT 5.6 Sol | Diseño + estructura + código bien hechos |
| **Resto del chat** (activar módulos, Excel, stock, guía, ediciones chicas) | Modelo **bueno, multimodal y barato** | Volumen alto; lee fotos/PDFs/Excel sin quemar margen |
| **Imágenes** | Gateway `google/gemini-3.1-flash-lite-image` | Mismo `AI_GATEWAY_API_KEY` (sin key Gemini aparte en OS) |

Gateway: [vercel.com/docs/ai-gateway/pricing](https://vercel.com/docs/ai-gateway/pricing) — **sin markup** sobre el precio del provider.

### Precios AI Gateway (referencia, USD / 1M tokens)

#### Tier potente — solo website “bien hecha”

| Modelo | ID Gateway | Input | Output | Nota |
|--------|------------|-------|--------|------|
| **Grok 4.5** | `xai/grok-4.5` | **$2** | **$6** | Potente + vision; **mejor precio** del trío |
| **Kimi K3** | `moonshotai/kimi-k3` | **$3** | **$15** | Muy fuerte en coding largo (1M ctx); más caro en output |
| **GPT 5.6 Sol** | `openai/gpt-5.6-sol` | **$5** | **$30** | Flagship; el más caro |

**Recomendación website v1:** **`xai/grok-4.5`** como default potente (calidad alta, costo ~3–5× menor que Sol en output).  
Alternar a Kimi K3 si un rubro necesita coding muy largo; Sol solo si Phil quiere máximo techo y el plan Scale lo paga.

Costo orden de magnitud de **1 generación web** (ej. 30k in + 40k out):

| Modelo | ≈ USD | ≈ S/ (×3.7) |
|--------|-------|-------------|
| Grok 4.5 | ~0.30 | ~1.1 |
| Kimi K3 | ~0.69 | ~2.6 |
| GPT Sol | ~1.35 | ~5.0 |

(Más imágenes Gemini aparte.)

#### Tier diario — multimodal no costoso

| Modelo | ID Gateway | Input | Output | Multimodal | Recomendación |
|--------|------------|-------|--------|------------|---------------|
| **Gemini 3.1 Flash Lite** | `google/gemini-3.1-flash-lite` | **$0.25** | **$1.50** | Sí (img/audio/docs) | **Default chat / tools** |
| Gemini 2.5 Flash Lite | `google/gemini-2.5-flash-lite` | $0.10 | $0.40 | Sí | Más barato; un poco menos capaz |
| GPT 5.6 Luna | `openai/gpt-5.6-luna` | $1 | $6 | Serie GPT | Bueno, ~4× más caro que Gemini 3.1 FL |
| Grok 4.3 | `xai/grok-4.3` | $1.25 | $2.50 | (familia xAI) | Mid; output barato vs Luna |

**Recomendación día a día:** **`google/gemini-3.1-flash-lite`**  
— multimodal, agentic, $0.25/$1.50, encaja con Excel/fotos/WhatsApp screenshots sin comerse los créditos.

### Tabla de routing (producto)

```text
generate_website (primera vez / regen full)  →  xai/grok-4.5
edit_website (cambio grande de layout)       →  xai/grok-4.5  (o Terra si se quiere ahorrar)
edit_website (copy corto)                    →  google/gemini-3.1-flash-lite
offer_import_excel / stock / scheduling      →  google/gemini-3.1-flash-lite
list_capabilities / explain_plan             →  google/gemini-3.1-flash-lite
vision (foto de local, menú escaneado)       →  google/gemini-3.1-flash-lite
imagen hero / asset                          →  gemini-3.1-flash-lite-image (API Gemini)
```

### Cómo impacta créditos

- Generar web con Grok 4.5 ≈ pocos USD → sigue cabiendo en créditos del plan si se limita regen.  
- Chat diario con Flash Lite ≈ centavos → el volumen no rompe el margen.  
- Nunca usar Sol/Kimi para “¿qué puedo hacer?” o ajustar stock.

---

### 5.1 Unidad

1 **crédito** ≈ costo interno redondeado para el cliente.

Tabla de consumo (ajustable):

| Acción | Créditos | Costo interno ≈ |
|--------|----------|-----------------|
| Mensaje chat / guía | 1 | muy bajo |
| CRUD oferta / stock / cita (sin IA pesada) | 0–1 | infra |
| Import Excel (hasta 100 filas) | 15 | parse + validación |
| Import Excel (hasta 500 filas) | 40 | |
| Generar website (1 vez) | 80 | skill + orquestación |
| Editar website (cambio grande) | 25 | |
| Editar website (copy corto) | 8 | |
| 1 imagen Gemini | 3 | ~USD 0.034 + margen |
| Publicar / redeploy | 5 | |

### 5.2 Packs de créditos por plan (propuesta)

| Plan | Créditos / mes incluidos | Top-up sugerido |
|------|--------------------------|-----------------|
| **Presence** | 120 | +100 créditos ≈ S/39 |
| **Operate** | 350 | +200 ≈ S/69 |
| **Scale** | 900 | +500 ≈ S/149 |

Ejemplo Presence “mes normal”:

- 1 generación web (80) + 8 imágenes (24) + 10 ediciones cortas (80) + chat (20) ≈ **204** → se pasa; por eso Presence debe limitar regeneraciones y fotos, o subir créditos/precio.

Ajuste realista Presence:

| Plan | Créditos / mes | Lo que “aguanta” |
|------|----------------|------------------|
| Presence | **150** | 1 web + ~10 imgs + chat y 2–3 edits |
| Operate | **400** | varias edits + imports + ~40 imgs |
| Scale | **1000** | uso intensivo chat + regeneraciones |

Si pide más → top-up o upgrade.

---

## 6. Precios de suscripción (propuesta alineada a Presencia Digital)

Ancla oficial hoy:

- Presencia **S/149** (promo) / **S/179** regular  
- Tienda **S/229** / **S/259**  
- Catálogo add-on por volumen productos  

### 6.1 Wavys OS — precios oficiales (Phil 2026-07-21)

| Plan OS | Precio / mes | Créditos / mes | Incluye (resumen) |
|---------|--------------|----------------|-------------------|
| **Presence** | **S/169** | 150 | Web + oferta + leads + subdominio |
| **Operate** | **S/279** | 400 | Presence + módulos E+I del pack |
| **Scale** | **S/449** | 1000 | Operate + automations + prioridad |

*(Detalle: [precios-soles-finales.md](./precios-soles-finales.md))*

### Add-on Marketing — cómo sube el precio

| Opción | Precio | Incluye |
|--------|--------|---------|
| **Marketing Posts** | **+S/89**/mes | `marketing.posts` + ~80 créditos creativos extra |
| **Marketing Pro** (posts + video) | **+S/149**/mes | Posts + `marketing.video` (cupo 2 reels/mes) + ~200 créditos creativos |
| Solo top-up creativo | S/39 / 69 / 149 | Sin subir suscripción; para picos |

**Sin add-on, con créditos:** el usuario puede igual pedir un flyer si tiene saldo; la UI/chat **debe indicar** que marketing **consume muchos créditos** y pedir confirmación. El add-on mensual sale a cuenta si lo usa seguido (más barato que solo top-ups).

**Setup (opcional, como hoy):** S/350–800 según complejidad (o absorbido en 12 meses).

**Compromiso:** mismo modelo 12 meses en Presence/Operate (confianza de cashflow); Scale flexible si quieres.

### 6.2 Add-ons (sin inflar el plan base)

| Add-on | Precio orientativo | Para qué |
|--------|--------------------|----------|
| Más productos (bloques) | como hoy +S/29 / 50 SKUs | Tiendas grandes |
| Pack créditos IA | S/39 / 69 / 149 | Picos de diseño |
| Dominio + email (si no incluido) | costo + margen | |
| WhatsApp IA (Quoter/ReActiva) | precio SaaS aparte o Scale+ | No mezclar en Presence |

### 6.3 Margen objetivo (ejemplo Operate S/279)

Supuesto mes “normal” Operate:

| Concepto | USD | S/ |
|----------|-----|-----|
| Ingreso | ~75 | 279 |
| IA créditos usados (50% del pack) | ~8–15 | 30–55 |
| Infra + storage | ~3–8 | 11–30 |
| Soporte prorrateado | ~5–10 | 20–37 |
| **Contribución** | | **~S/150–200** antes de CAC |

Si el cliente quema el 100% de créditos + top-ups, el margen baja pero no debería ser negativo (precio del crédito > costo × 2.5–3).

**Precio interno del crédito (sugerido):**  
Costo medio ~S/0.15–0.25 → venta en top-up ~**S/0.40–0.70** / crédito.

---

## 7. Cómo lo vive el cliente (empresa con mercado)

Historia corta — **tienda en Huancayo / Lima**:

1. Contrata **Operate S/279**.  
2. Chat: “Somos ferretería, arma mi web y catálogo.”  
3. Gasta ~80–100 créditos (web + fotos).  
4. Sube Excel de 300 productos (40 créditos).  
5. Activa stock (módulo del plan, sin crédito extra o 1 crédito).  
6. Mes a mes: edita precios por chat, pocas imágenes → cabe en 400 créditos.  
7. Si arma campaña y pide 100 renders → compra top-up S/69 o espera.

No necesita entender Gemini ni Vercel. Solo ve: **plan + créditos restantes** en el chat (`explain_plan`).

---

## 8. Reglas duras (para que “todo funcione bien”)

1. **Toda tool cara consume créditos** (web, imagen, import grande).  
2. **CRUD operativo barato** (stock adjust, crear cita) ≈ 0–1 crédito.  
3. **Límites duros** además de créditos: máx. regeneraciones web / mes en Presence (ej. 2).  
4. **Cola / rate limit** en imágenes (ej. 10/hora) para evitar bugs de loop.  
5. **Modelo barato por defecto** (Flash-Lite imagen + Flash texto); Pro solo en Scale o tool explícita.  
6. **No** incluir “imágenes ilimitadas” en ningún plan.  
7. Presencia Digital manual sigue existiendo; OS self-serve usa **los mismos anclajes de precio** para no canibalizar mal.

---

## 9. Qué medir en los primeros 20 clientes

| Métrica | Objetivo |
|---------|----------|
| Créditos usados / créditos incluidos | 40–70% |
| Costo IA / ingreso | &lt; 25% |
| Regeneraciones web / mes | &lt; 3 en Presence |
| Churn por “se me acabaron créditos” | bajo (mejor upsell que sorpresa) |
| Margen contribución | &gt; 50% |

Si el costo IA / ingreso &gt; 35% → subir precio, bajar créditos incluidos, o encarecer acciones.

---

## 10. Decisiones propuestas (para que Phil confirme)

| # | Decisión | Propuesta |
|---|----------|-----------|
| 1 | Presence | **S/169** |
| 2 | Operate | **S/279** |
| 3 | Scale | **S/449** |
| 4 | Monetización | Suscripción + créditos IA |
| 5 | Top-ups | S/39 / 69 / 149 |
| 6 | Imagen | Gemini lite; cobrada en créditos |
| 7 | WhatsApp IA | Add-on aparte |
| 8 | Website 1ª vez | Grok 4.5 (Gateway) |
| 9 | Chat diario | Gemini 3.1 Flash Lite |
| 10 | Marketing | Add-on +S/89 / +S/149 |
| 11 | Cobro | Polar (no Stripe merchant PE) |

**Precios finales = Phil aprueba.** Este doc es el marco para no vender a pérdida.

---

## 11. Relación con docs previos

| Doc | Rol |
|-----|-----|
| Mapa negocios | Qué módulos existen |
| Modelo dominio | Qué hay en DB |
| Planes / entitlements / chat | Qué puede hacer el chat |
| **Este doc** | Cuánto cuesta y cómo se cobra |

En DB: además de `TenantSubscription`, hace falta `CreditBalance`, `CreditLedger`, `UsageCounter`.

---

## 12. Siguiente paso

1. Phil marca precios finales (o ajusta bandas).  
2. Fijar tabla exacta acción → créditos.  
3. Meter `CreditBalance` en el schema junto al dominio.  
4. Pack piloto + primeras tools con chequeo de créditos.

---

*Ubicación:* `data/wavys-os-brief/costos-creditos-precios.md`
