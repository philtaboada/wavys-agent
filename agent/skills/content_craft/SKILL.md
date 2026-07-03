# Skill — Content craft (anti “look de IA”)

Usar **siempre** después de elegir noticias/copy y **antes** de generar visuals o render Remotion.

Leer también **`agent/context/content-feedback-log.md`** — retro de Phil acumulada.

**Problema:** Piezas con fondo Gemini genérico + glass card + badges A/B/C + progress bar + gradiente neón = **plantilla reconocible al instante**.

**Objetivo:** Que se sienta **hecho por una marca** (Wavys Agente), no por un prototipo de Reels automático.

---

## Señales de “AI slop” (evitar)

| Patrón | Por qué delata |
|--------|----------------|
| Imagen hero 100% Gemini (aurora, glass, ciudad bokeh) | Mismo estilo que millones de prompts |
| Collage 2×2 + “TECH NEWS” en caps gigantes | Template TikTok 2024–2026 |
| Barra de progreso + badges A/B/C + flash verde entre slides | UI de “reel generator” |
| Misma card glass centrada en cada slide | Cero variación editorial |
| Ken Burns sobre arte IA | Motion stock |
| Copy simétrico: tag → headline → accent verde → body | Suena a LLM, no a editor |
| Solo dominio en fuente (sin screenshot real) | Poca credibilidad periodística |

---

## Reglas Wavys (prioridad)

### 1. Mezcla de medios (obligatorio)

Mínimo **2 capas reales** por pieza:

| Capa | Fuente |
|------|--------|
| **Marca / tipo** | Figma Agente (Rubik, glass real de la guía) |
| **Evidencia** | Screenshot recortado de la noticia (BBC, OpenAI blog, TechCrunch) — blur si hace falta, **siempre cita + URL** |
| **Opcional mood** | Gemini solo como **textura parcial** (20–40% del frame), nunca hero full-screen solo |

**Prohibido:** video entero construido solo con Remotion + JPGs Gemini.

### 2. Layout editorial (no simétrico siempre)

Rotar entre familias (una por noticia en carruseles/reels):

- **Split 60/40** — screenshot izq, copy der (o invertido)
- **Ticker inferior** — imagen full bleed + franja negra abajo con copy (estilo broadcast LatAm)
- **Quote card** — una cifra grande (“39% WER”, “$0.034”, “20 partners”) + 2 líneas contexto
- **Screenshot + highlight** — caja neón sobre párrafo real de la fuente

Familia **C Agente** (`wavys-visual-brand-guide.md`) — no inventar paleta nueva.

### 3. Motion con intención (no catálogo Remotion)

| Sí | No |
|----|-----|
| Un tipo de transición por video (ej. solo slide editorial) | Flash + wipe + spring + progress en el mismo reel |
| Cortes en **beat** del copy (cada 2–3 s) | 9 s estáticos por slide |
| Micro-jitter/grain sutil (CSS overlay fijo) | Ken Burns infinito sobre IA art |

### 4. Copy que suena humano

- Frases **cortas y asimétricas** — una línea larga + una punch corta
- Opinión mínima permitida: *“esto es raro”*, *“ojo con esto”* — no brochure
- **Sin** “4 noticias que marcaron junio 🔥” si ya suena formulaico — probar hook distinto cada pieza
- Cifras **reales** de la fuente; si no hay dato, no inventar

### 5. Credibilidad

Cada noticia en video o caption incluye:

1. Nombre medio (BBC, OpenAI, TechCrunch…)
2. **URL completa** (guardar en `data/content-drafts/`)
3. Screenshot o logo tipográfico del medio (texto “BBC News”, no logo pirateado si no hay asset)

### 6. Checklist antes de render

- [ ] ¿Hay al menos un screenshot o frame Figma real?
- [ ] ¿Gemini es ≤40% del visual?
- [ ] ¿Quité badges A/B/C + progress bar (salvo que Phil pida formato quiz)?
- [ ] ¿Layouts varían entre segmentos?
- [ ] ¿Hook no es “TECH NEWS” genérico?
- [ ] ¿URLs en draft para caption?
- [ ] ¿Logo Wavys oficial (`data/brand-assets/logos/`)?

---

## Workflow actualizado (insertar en content_production fase 5)

```
Copy aprobado
  → content_craft (este skill) — plan visual anti-slop
  → Figma Agente frame base O screenshot fuente
  → Gemini solo textura/asset secundario si hace falta
  → Remotion compone (tipografía código, no “template reel”)
  → Render + draft con URLs
```

---

## Referencias útiles (no son skills Wavys)

| Skill | Uso |
|-------|-----|
| `taste-skill` (Codex) | Anti-slop UI — principios de asymmetry, anti-purple, no card spam |
| `social_design` | Figma + Gemini híbrido |
| `wavys-visual-brand-guide.md` | Familia C Agente |

---

## Changelog

| Fecha | Cambio |
|-------|--------|
| 2026-07-02 | Retro Phil: screenshots reales, anti-template reel |
| 2026-07-02 | Skill Phil: anti AI-slop para reels/posts Wavys |
