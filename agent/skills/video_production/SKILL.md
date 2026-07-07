# Skill — Producción de video Wavys (pipeline completo)

Usar cuando Phil pida **crear un video**: promo, reel, story, explainer, launch, campaña, editorial, híbrido (producto + cultura/tendencia), etc.

**Regla madre:** Este pipeline es **obligatorio en orden**. No saltar fases. No renderizar sin validación exhaustiva.

**Gate 0 (pasos):** `agent/context/pipeline-gates.md` § `video_production` — log en `data/pipeline-runs/<slug>-step-compliance.md`

**Gate 1+ (calidad):** mismo doc § Gate 1+ `video_production` — `data/pipeline-runs/<slug>-video-validation.md` + `videos/<slug>/VALIDATION.md` (plantilla `_TEMPLATE-video-validation.md`)

**Prioridades Phil (orden de importancia):**
1. **Investigación profunda** — no superficial
2. **Validación visual/técnica** — no entregar roto
3. Storytelling + potencia visual (imágenes, 3D, Lottie)

---

## Pipeline (6 fases — blueprints obligatorios)

```
① INVESTIGAR  →  ② GUION (story-design)  →  ③a BLUEPRINTS (visual-design)
        →  ③b ASSETS  →  ④ EJECUTAR (HyperFrames)  →  ⑤ VALIDAR  →  MP4
```

**Regla de hierro:** Cada frame tiene **un blueprint id** de `hyperframes-animation/blueprints/` + **shot sequence time-coded al VO**. Prohibido un template genérico (foto + texto pequeño) que ignore el signature move.

**Stack default promo/campaña:** **HyperFrames** + `product-launch-video`. Remotion solo si Phil pide explícitamente React o hay composición editorial ya existente — aun así aplicar Fase ③a (blueprints) en `STORYBOARD.md`.

Entregables mínimos por proyecto:

| Archivo | Fase | Skill fuente |
|---------|------|--------------|
| `RESEARCH.md` | ① | — |
| `SCRIPT.md` | ② | `product-launch-video/references/story-design.md` |
| `STORYBOARD.md` (con Step 4 completo) | ③a | `visual-design.md` + `blueprints-index.md` + `blueprints/<id>.md` |
| `ASSET-PLAN.md` | ③b | `ASSET-PLAN` § abajo |
| `frame.md` | ③a | preset Wavys Agente o `hyperframes-creative` |
| `compositions/frames/*.html` | ④ | `hyperframes-animation/rules/` por motion citado |
| `VALIDATION.md` | ⑤ | — |
| `renders/*.mp4` | post-⑤ | — |

---

## Fase ① — Investigación profunda (LA MÁS IMPORTANTE)

**Objetivo:** Entender el tema **como un editor**, no como un resumen de Wikipedia. Phil debe sentir que investigaste de verdad antes de escribir una línea de guion.

### Prohibido

- 3–5 bullets genéricos y pasar a guion
- Una sola búsqueda web
- Inventar datos, fechas, quotes o stats
- Mezclar temas sin documentar el puente narrativo

### Obligatorio

Desglosar el brief en **ejes de investigación** (mínimo 4, típico 6–10). Ejemplo brief: *"video sobre software y Toy Story 5"*:

| Eje | Qué buscar |
|-----|------------|
| Película / cultura | Fecha estreno, tráiler, personajes, recepción prensa, memes |
| Software en producción | RenderMan, Pixar pipeline, IA en animación, herramientas 3D |
| Industria software | Paralelos SaaS, launches tech recientes, noticias del sector |
| Audiencia / ángulo Wavys | Si aplica: WhatsApp, PYME, automatización — **solo si Phil pidió conexión Wavys** |
| Referencias visuales | Posters, frames icónicos, paletas, motion de trailers, Behance/Pinterest |
| Competencia / formato | Cómo otros cuentan el mismo tema en Reels/YouTube (estructura, no copiar) |

### Método de búsqueda

**Subagente ① (obligatorio):** lanzar **`explore`** con brief completo — prompt en `agent/pipelines/subagents.md` § video RESEARCH. Mínimo 8 búsquedas y 10 fuentes. El padre **guarda** el borrador en `RESEARCH.md` y completa gaps.

1. **Mínimo 8–12 búsquedas web** con queries distintas (español + inglés si aplica)
2. **Mínimo 10 fuentes citables** con URL, medio, fecha, titular
3. **Leer** al menos 5 artículos completos (no solo snippets)
4. Si hay URL de producto/marca → `hyperframes capture` o Cursor Browser + screenshots
5. Guardar evidencia: URLs en `RESEARCH.md`; screenshots en `research/screenshots/`

### Plantilla `RESEARCH.md`

```markdown
# Investigación — [título video]
Fecha: YYYY-MM-DD · Duración objetivo: Xs · Formato: 9:16 / 16:9

## Brief Phil
[texto literal o parafraseado]

## Ejes investigados
- [eje 1]: …
- [eje 2]: …

## Hallazgos (con fuentes)
### [Subtema A]
- **Hecho:** …
- **Fuente:** [Medio](URL) — fecha
- **Quote usable:** "…" (opcional)
- **Visual ref:** screenshot / poster / frame

### [Subtema B]
…

## Ángulo narrativo recomendado
[1 párrafo: qué historia contar y por qué, basado en hallazgos]

## Puente visual (paleta, referencias, mood)
- Colores, tipografía, referencias motion (links o rutas locales)

## Descartado (y por qué)
- [ángulo X]: no hay fuente sólida / no encaja / Phil no pidió…

## Checklist investigación
- [ ] ≥8 búsquedas distintas
- [ ] ≥10 fuentes con URL
- [ ] ≥5 lecturas completas
- [ ] Referencias visuales documentadas
- [ ] Ángulo narrativo explícito
- [ ] Cero datos inventados
```

**Gate:** `RESEARCH.md` completo. **Mostrar resumen a Phil** (ejes + ángulo recomendado) antes de Fase ② salvo que diga "sigue directo".

---

## Fase ② — Guion con storytelling

**Default:** Siempre contar una **historia** (tensión → resolución → CTA o cierre). Ver `data/presencia-digital-brief/STORYTELLING-GUIA.md` (5 actos).

**Excepción:** Solo si Phil dice explícitamente *"sin storytelling"*, *"listicle"*, *"solo specs"*, *"montaje puro"*.

### Estructura guion (`SCRIPT.md`)

| Bloque | Contenido |
|--------|-----------|
| **Logline** | Una frase — de qué va la historia |
| **Acto 1 — Contexto** | Mundo del espectador / personaje (negocio, usuario, industria) |
| **Acto 2 — Tensión** | Problema, contraste, urgencia (datos de RESEARCH) |
| **Acto 3 — Resolución** | Qué cambia (producto, idea, revelación) |
| **Acto 4 — Prueba** | Evidencia: screenshots, cifras citadas, fotos reales |
| **Acto 5 — CTA / cierre** | Siguiente paso o remate emocional |

Tabla **timecode** (obligatoria):

| Seg | Acto | VO / texto pantalla | Emoción | Ref investigación |
|-----|------|---------------------|---------|-------------------|
| 0–4 | Hook | … | curiosidad | RESEARCH §… |

**Reglas copy:**
- Frases cortas y asimétricas — `content_craft/SKILL.md`
- Cifras **solo** de `RESEARCH.md`
- Hook en primeros 3 s — nada de logo lento salvo brand id explícito

**Gate:** `SCRIPT.md` con arco completo + timecodes. **Leer y aplicar** `wavys-stories/.agents/skills/product-launch-video/references/story-design.md` (arco PAS/BAB, script bank, blueprint por beat, persuasion/beat, transitions). Phil aprueba o pide cambios — **no codear antes de este gate**.

---

## Fase ③a — Plan visual por BLUEPRINTS (OBLIGATORIO — no codear sin esto)

**Objetivo:** Cada segundo del video planificado con **patrón probado**, no improvisación visual.

### Lectura obligatoria (en orden)

1. `wavys-stories/.agents/skills/product-launch-video/references/visual-design.md`
2. `wavys-stories/.agents/skills/hyperframes-animation/blueprints-index.md`
3. Por cada frame: `blueprints/<id>.md` del blueprint elegido
4. `product-launch-video/references/motion-language.md` — nombrar moves inline (kinetic beat-slam, count-up ring, cursor click…)
5. `hyperframes-creative/references/beat-direction.md` — cada beat = un **mundo**, no un layout

### Por cada frame en `STORYBOARD.md` (Step 4)

Además de story-design (type, persuasion, beat, VO), escribir:

| Campo | Contenido |
|-------|-----------|
| `blueprint:` | id + `(Reproduce)` / `(Adapt)` / `compose` |
| `focal:` / `roles:` | asset hero + rol (cutout / background / supporting) |
| `sfx:` | whoosh, impact-soft, riser (nombre, no embed) |
| **Scenes time-coded** | `Scene N (0.0–Xs):` qué entra **cuando el VO lo nombra** + motion verb + layout inline |
| **Signature move** | el move del blueprint — **no omitir** (ej. grid-card-assemble = stagger + hold + optional zoom-out) |

### Prohibido en Fase ③a

- Template único reutilizado en todos los frames (BinanceLayer, slide genérico, texto 38px sobre foto)
- Front-load: todo visible en t=0
- Blueprint tag sin shot sequence en segundos reales
- Inventar motion names — solo vocabulario de `motion-language.md` + rules index

**Gate ③a:** `STORYBOARD.md` con `## Video direction` + **8 frames** (o los que aplique) con shot sequences completas y blueprint id **distinto** cuando el rol lo pida.

---

## Fase ③b — Assets (`ASSET-PLAN.md`)

Por cada segmento del guion:

| Seg | Asset | Tipo | Origen | Acción |
|-----|-------|------|--------|--------|
| 0–4 | Hero Toy Story frame | imagen | RESEARCH screenshot | recortar 9:16 |
| 4–8 | Icono WhatsApp 3D | Three.js | HF `adapters/three.md` | icosaedro/glass verde |
| 8–12 | Check animado | Lottie | LottieFiles / AE export | `window.__hfLottie` |
| … | Textura grain | Gemini | `generate_image` | 20% frame, sin texto |
| … | Icono laptop 3D flotante | Gemini → cutout | `generate_image` + pipeline cutout | fondo blanco → `assets/laptop-cutout.png` |

**Cutout (objeto sobre fondo):** ver `agent/context/image-cutout-pipeline.md`. En `ASSET-PLAN.md`, columna **Acción** = `cutout` + ruta PNG final.

**Tipos de asset (usar libremente):**

| Tipo | Cuándo | Skill / tool |
|------|--------|--------------|
| Screenshot real | Credibilidad, producto, noticias | Browser MCP, `hyperframes capture` |
| Foto campaña | Promo Wavys (Presencia, etc.) | `data/presencia-digital-brief/*.jpg` |
| Gemini JPEG | Texturas, mood parcial, fondos sin texto | `generate_image` — regla Gemini |
| **Gemini → cutout PNG** | Objeto/icono/3D hero sobre fondo de frame | `generate_image` (fondo blanco/chroma) → **`agent/context/image-cutout-pipeline.md`** → `assets/*-cutout.png` |
| **Three.js** | Objetos 3D, spins, partículas, intro | HF `hyperframes-animation/adapters/three.md` · Remotion `rules/3d.md` |
| **Lottie** | Iconos, micro-UI, reveals | HF `adapters/lottie.md` · Remotion `rules/lottie.md` |
| GSAP motion | Editorial, cámara, kinetic type | HF default |
| Remotion | Reels `.tsx`, spring/interpolate | `remotion-best-practices` |

### `STORYBOARD.md`

Sincronizar con guion: frames, duración, `asset_candidates`, transiciones, motion rules (HF) o escenas (Remotion).

**Gate ③b:** `ASSET-PLAN.md` + assets staged en `videos/<slug>/assets/`. **Gate ③ (global):** ③a + ③b antes de Fase ④.

---

## Fase ④ — Ejecución (HyperFrames — default)

### Elegir stack

| Promo producto / landing / campaña | **HyperFrames** | `product-launch-video` + `hyperframes-animation` |
| Reel editorial / noticias | Remotion **solo si Phil pide** | `remotion-best-practices` — STORYBOARD con blueprints igual |

### HyperFrames — reglas de ejecución

1. Proyecto en `wavys-stories/videos/<slug>/` con `hyperframes.json`, `frame.md`, `STORYBOARD.md`
2. **Un HTML por frame** — implementar **signature move** del blueprint citado
3. Citar rule id en comentario GSAP → implementar según `hyperframes-animation/rules/<id>.md`
4. **Prohibido** `BinanceLayerScene`, overlay foto+texto pequeño, o un solo componente React para toda la promo
5. Three.js / Lottie según `ASSET-PLAN.md` y adapters HF
6. `npx hyperframes lint` durante desarrollo; **no render** sin Fase ⑤

---

## Fase ⑤ — Validación exhaustiva (SEGUNDA MÁS IMPORTANTE)

**Objetivo:** Cero sorpresas en el MP4 — texto legible, imágenes cargadas, nada superpuesto mal, screenshots no rotos.

### Subagentes ⑤ (orden — antes de `VALIDATION.md` final)

1. **`shell`** — `hyperframes lint` → `validate` → `inspect` (parar si falla)
2. **`bugbot`** readonly — frames HTML vs `STORYBOARD.md` (blueprints, signature moves)
3. **Browser MCP** (padre) — § B abajo; tabla QA visual

Prompts: `agent/pipelines/subagents.md`. Registrar subagentes en `step-compliance.md`.

### A. Validación técnica (HyperFrames)

Ejecutar **en orden**; si falla uno, **parar**, arreglar, repetir desde el fallido:

```bash
cd wavys-stories/videos/<slug>
npx hyperframes lint
npx hyperframes validate
npx hyperframes inspect
npx hyperframes snapshot --at <midpoints-por-frame>
```

Revisar `snapshots/contact-sheet.jpg` — glitch obvio = no renderizar.

### B. Validación visual (Browser MCP — obligatoria)

1. `npx hyperframes preview` o abrir frames HTML en browser
2. **Screenshot por frame** en punto medio y en reveal crítico (hook, CTA)
3. Viewport **1080×1920** (reel) y/o formato del proyecto
4. Comprobar:
   - [ ] Imágenes cargan (no 404, no `img` roto)
   - [ ] Texto **no cortado** / no sale del safe area
   - [ ] Texto **no tapado** por imágenes u overlays
   - [ ] Contraste legible (títulos sobre fotos)
   - [ ] Safe zone inferior/superior (IG/TikTok UI)
   - [ ] Screenshots recortados se ven nítidos, no estirados
   - [ ] Lottie/Three visible en el timecode correcto
   - [ ] Sin overflow horizontal (scroll fantasma)
   - [ ] Grain/overlays no matan legibilidad

### C. Validación Remotion (si aplica)

```bash
cd wavys-stories
pnpm remotion still src/Root.tsx <Comp> --frame=<N> out/qa-frame-N.png
# Repetir en frames clave: 0, hook, mitad, CTA, último
```

### D. Documentar `VALIDATION.md`

```markdown
# Validación — [slug]
Fecha: …

## Comandos
- lint: ✅ / ❌ (stderr si falló)
- validate: ✅
- inspect: ✅
- snapshot: ✅ — contact-sheet revisado

## QA visual (Browser)
| Frame | Time | OK | Notas |
|-------|------|----|-------|
| 01-hook | 2s | ✅ | … |
| 04-fotos | 28s | ❌ → fixed | texto solapaba imagen — padding +12px |

## Fixes aplicados
- …

## Render autorizado
✅ Sí — YYYY-MM-DD HH:MM
```

**Gate:** Todo ✅ en VALIDATION.md. **Solo entonces:**

```bash
npx hyperframes render --quality high --output renders/<slug>-YYYY-MM-DD.mp4
# o
pnpm remotion render src/Root.tsx <Comp> out/<slug>.mp4
```

Re-ejecutar lint/validate **solo si** hubo cambios post-QA.

---

## Fase ⑥ — Entrega a Phil

Paquete:

1. `RESEARCH.md` (resumen 5 líneas + link)
2. `SCRIPT.md`
3. MP4 final + contact sheet
4. `VALIDATION.md`
5. Copy caption (si aplica) → `data/content-drafts/<slug>-copy.md`
6. Opcional: `log_business_note` si es pieza comercial

**Esperar OK de Phil** antes de publicar.

---

## Skills instalados (referencia rápida)

| Skill | Ubicación | Uso |
|-------|-----------|-----|
| `remotion-best-practices` | wavys-stories + wavys-agents `.agents/skills/` | Remotion, 3D, Lottie en React |
| `hyperframes-animation` | wavys-stories | GSAP, adapters three/lottie |
| `product-launch-video` | wavys-stories | Orquestación HF promo |
| `product-launch-video/references/story-design.md` | wavys-stories | **Guion + orden beats (texto, obligatorio Step 3)** |
| `product-launch-video/references/visual-design.md` | wavys-stories | Plan visual time-coded por escena (Step 4) |
| `motion-design` | LottieFiles | Export AE → Lottie |
| `threejs-animation` | cloudai-x | Escenas 3D |
| `lottie-bodymovin` | animation-principles | Limitaciones Bodymovin |
| `content_craft` | wavys-agents | Anti-slop, screenshots reales |
| `content_production` | wavys-agents | Posts + filtro Wavys (si aplica) |

Docs: `agent/context/remocn-video-ecosystem.md`

---

## Checklist maestro (agente)

**Gate 1+ completo:** `data/pipeline-runs/<slug>-video-validation.md` — criterios en `agent/context/pipeline-gates.md` § Gate 1+ `video_production`.

- [ ] ① `RESEARCH.md`
- [ ] ② `SCRIPT.md` + `story-design.md` aplicado
- [ ] ③a `STORYBOARD.md` — **blueprint + shot sequence por frame** (`visual-design.md`)
- [ ] ③b `ASSET-PLAN.md` + assets en disco
- [ ] ④ Frames HF con **signature moves** (no template genérico)
- [ ] ⑤ lint + validate + inspect + snapshot + browser QA
- [ ] ⑤ `VALIDATION.md`
- [ ] Render MP4 solo post-gate

## Mapa rápido blueprints (promo PYME)

| Rol | Blueprints típicos |
|-----|-------------------|
| Hook lista dolores | `grid-card-assemble` (Benefits vertical-list) |
| Pivot / beneficio calm | `titlecard-reveal` |
| Stat / tiempo | `dataviz-countup` |
| Product intro | `kinetic-type-beats` |
| Demo landing | `device-surface-showcase` |
| Demo tienda | `cursor-ui-demo` |
| Modelo / prueba | `comparison-split` o compose |
| CTA | `logo-assemble-lockup` o `cta-morph-press` |

Índice completo: `wavys-stories/.agents/skills/hyperframes-animation/blueprints-index.md`

---

## Changelog

| Fecha | Cambio |
|-------|--------|
| 2026-07-05 | Fase ③a blueprints obligatoria; prohibido template genérico; HyperFrames default |
| 2026-07-05 | Pipeline Phil: investigación profunda → storytelling → plan → ejecutar → validación exhaustiva; 3D/Lottie explícitos |
