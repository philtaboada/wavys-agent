# Skill — Producción de contenido Wavys (investigar → decidir → crear)

Usar cuando Phil pida posts, stories, carruseles o copy social (IG, LinkedIn, Facebook, TikTok).

**Video (reels, promos, MP4):** usar **`agent/skills/video_production/SKILL.md`** — pipeline propio (investigación profunda → storytelling → plan visual → ejecutar → validación exhaustiva). Este skill complementa con filtro Wavys cuando aplique.

**Regla madre:** Nada se publica sin OK de Phil. Cada pieza debe **conectar con lo que hace Wavys** (IA, WhatsApp, leads, automatización, agencias) — no contenido genérico de tendencia.

**Gate 0 (pasos):** `agent/context/pipeline-gates.md` § `content_production` — log en `data/pipeline-runs/<slug>-step-compliance.md`

**Gate 1+ (calidad):** mismo doc § Gate 1+ `content_production` — `data/pipeline-runs/<slug>-content-validation.md` + copy en `data/content-drafts/<slug>-copy.md` (plantilla `_TEMPLATE-content-validation.md`)

---

## Pipeline completo (7 fases) — posts / carruseles / copy

```
① INVESTIGAR → ② FILTRAR WAVYS → ③ ELEGIR FORMATO → ④ GUION + COPY
       → ⑤ VISUAL (Figma / Gemini / Remotion) → ⑥ GENERAR → ⑦ ENTREGAR
```

**Nota video:** la Fase 1 de este skill es **básica** para posts. Para **video**, la investigación vive en `video_production` Fase ① (8+ búsquedas, 10+ fuentes, `RESEARCH.md`).

---

## Fase 1 — Investigar

**Subagente ①:** **`explore`** en paralelo — prompt en `agent/pipelines/subagents.md` § content ①.

**Objetivo:** Qué se está haciendo / diciendo en el tema (ej. Mundial, IA, WhatsApp marketing).

| Acción | Cómo |
|--------|------|
| Búsqueda web | Tendencias evento + ángulo tech/software |
| Señales a buscar | Apps, IA en deportes, volumen mensajes/WhatsApp en picos, automatización atención, datos curiosos B2B |
| Fuentes | Noticias recientes, launches, casos de uso reales (no inventar stats) |

**Entregable interno:** brief de 3–5 bullets “qué está pasando” + 2–3 ángulos posibles.

---

## Fase 2 — Filtrar por Wavys (obligatorio)

**Pregunta gate:** ¿Por qué le importa a alguien que vende/compra automatización con IA?

| ✅ Sí publicar si… | ❌ No publicar si… |
|-------------------|-------------------|
| Conecta con leads, respuesta rápida, WhatsApp, picos de demanda | Solo meme futbolero sin puente a negocio |
| Menciona IA/automatización/software de forma honesta | Stats inventados o claims falsos |
| Audiencia LatAm B2B / agencias / pymes encaja | Copia de competidor sin ángulo propio |
| CTA claro hacia Wavys (suave o directo) | Trending vacío “porque es Mundial” |

**Puente típico (ej. Mundial):**
- Picos de mensajes / consultas → necesitas responder en segundos
- Negocios (bares, tiendas, agencias) saturados → agentes IA 24/7
- “Mientras ves el partido, Wavys atiende por ti”
- Software + eventos: integración CRM, calificación automática

Si ningún ángulo pasa el gate → **decirlo a Phil** y proponer otro tema; no forzar.

---

## Fase 3 — Elegir formato

| Formato | Cuándo | Spec |
|---------|--------|------|
| **Story / Reel 15s** | Hook emocional, urgencia, un solo mensaje | 1080×1920, 9:16, ~15s @ 30fps |
| **Post IG feed** | Más texto, carrusel educativo | 1080×1350 |
| **LinkedIn / FB cuadrado** | B2B, credibilidad, quote + stats | 1080×1080 |
| **Carrusel** | 3–5 slides, tutorial o lista | IG 1080×1350 por slide |
| **Solo copy** | LinkedIn texto nativo sin imagen | — |

**Una idea → un formato principal.** Repurpose opcional después (mismo ángulo, adaptar layout).

Decisión documentada en 1 línea: *“Ángulo X → Story 15s porque…”*

---

## Fase 4 — Guion + copy

### Video story 15s (estructura default)

| Seg | Bloque | Ejemplo |
|-----|--------|---------|
| 0–3 | **Hook** visual + texto | “¿Tu negocio pierde mensajes en el Mundial?” |
| 3–8 | **Puente** dato/tensión | “Cuando hay pico, el que responde primero gana” |
| 8–12 | **Wavys** | “Agentes IA en WhatsApp — 24/7” |
| 12–15 | **CTA** | “Síguenos / DM / Calendly” |

### Copy aparte (para pegar en IG)

- 1–2 líneas caption + hashtags acotados
- CTA según `agent/context/brand-channels.md`

**Creatividad:** cada pieza distinta en metáfora visual y hook; no repetir el mismo template de frase.

### Subagente ④ (después de guardar copy)

**`generalPurpose`** readonly — score copy vs `content-feedback-log` y filtro Wavys (`CP-F01`–`CP-C07`). Prompt en `agent/pipelines/subagents.md`. Si algún criterio <8 → loop en ④ (máx. 3).

---

## Fase 5 — Visual (creativo, híbrido)

**Antes de generar:** leer `agent/skills/content_craft/SKILL.md` (anti “look de IA”) y **`agent/context/content-feedback-log.md`** (retro Phil).

Leer siempre:
- `agent/context/wavys-visual-brand-guide.md` (Familia **C Agente**)
- Figma **Posts → Agente**

| Tipo pieza | Herramientas |
|------------|--------------|
| **Imagen estática** | Figma Agente + Gemini assets (`generate_image`) |
| **Objeto flotante / cutout** | Gemini → quitar fondo → PNG — `agent/context/image-cutout-pipeline.md` |
| **Video 15s** | **Remotion + remocn** (+ Gemini fondos si aplica) |

### Gemini (cuando aplique)

- Fondos aurora, 3D glass, escenas **sin texto**
- **Cutout:** si un objeto debe ir sobre otro fondo → pipeline cutout (blanco/chroma → PNG)
- Prompt: plantilla §5 guía visual
- Ratio story: `9:16`

### Video (Remotion / HyperFrames)

- **Pipeline obligatorio:** `agent/skills/video_production/SKILL.md`
- Proyecto: `wavys-stories` (`videos/<slug>/` HyperFrames o `src/compositions/` Remotion)
- Skills: `remotion-best-practices`, `hyperframes-animation`, `product-launch-video`
- Ver `agent/context/remocn-video-ecosystem.md`

### Figma

- Composición final estática o frames de referencia para video
- Tipografía Rubik, logo Wavys — **siempre en Figma/código**, no quemada en Gemini

---

## Fase 6 — Generar

| Output | Comando / acción |
|--------|------------------|
| Imagen asset | `npm run tool -- generate_image '{...}'` |
| Frame Figma | `use_figma` MCP |
| MP4 story | `pnpm remotion render` (cuando proyecto exista) |
| Export JPG/PNG | Export desde Figma |

Archivos locales:
- `data/generated-images/` — assets Gemini (gitignored)
- Video render → ruta acordada (ej. `out/mundial-story-01.mp4`)

---

## Fase 7 — Entregar a Phil

Paquete mínimo:

1. **Resumen investigación** (2–3 líneas + por qué encaja Wavys)
2. **Formato elegido** y alternativas descartadas (1 línea)
3. **Copy** caption + textos on-screen
4. **Archivos** — MP4 / JPG + link Figma frame
5. **Checklist** publicación (canal, CTA, horario — Phil decide)
6. Opcional: `log_business_note` con id pieza y fecha

**Esperar “publica” / “ok”** antes de asumir publicado.

---

## Gestión y repetición

### Por pieza (nombre convention)

```
[canal]-[tema]-[YYYY-MM-DD]
ej: ig-story-mundial-pico-whatsapp-2026-07-01
```

### Mes actual (Figma Agente)

Actualizar bloque **Mes actual** si cambia campaña (Mundial, producto, etc.).

### Repurpose (opcional, fase 8)

Mismo ángulo investigado:
- Story 15s → frame IG 4:5 → LinkedIn 1:1 (mismo copy adaptado)

---

## Checklist rápido (agente)

**Gate 1+ completo:** `data/pipeline-runs/<slug>-content-validation.md` — criterios en `agent/context/pipeline-gates.md` § Gate 1+ `content_production`.

- [ ] Investigué tendencias reales del tema
- [ ] Ángulo pasa filtro Wavys (WhatsApp / IA / leads)
- [ ] Elegí formato con razón
- [ ] Copy + guion 15s (si video)
- [ ] Visual creativo (no clone genérico) — `content_craft` checklist
- [ ] Generé assets/video
- [ ] Entregué paquete completo a Phil
- [ ] Sin publicar hasta OK

---

## Referencias cruzadas

| Doc | Uso |
|-----|-----|
| `agent/context/wavys-visual-brand-guide.md` | Marca visual |
| `agent/context/brand-channels.md` | CTAs por canal |
| `agent/skills/video_production/SKILL.md` | **Pipeline video completo** |
| `agent/context/remocn-video-ecosystem.md` | Video Remotion/remocn |
| `agent/skills/content_craft/SKILL.md` | Anti AI-slop — mezcla Figma/screenshot/Gemini |
| `agent/connections/gemini-image.md` | Tool imágenes |
| `agent/context/image-cutout-pipeline.md` | **Recorte fondo** — Gemini → PNG para flyers/video |
| `agent/connections/figma-posts.md` | File Figma |

---

## Changelog guía

| Fecha | Cambio |
|-------|--------|
| 2026-07-01 | Pipeline Phil: investigar → Wavys → formato → copy → generar |
