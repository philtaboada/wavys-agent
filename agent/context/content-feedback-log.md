# Content feedback log — Phil

Retroalimentación acumulada para **próximos videos/posts**. El agente debe leer esto al iniciar fase 5 (`content_craft` + `content_production`).

---

## 2026-07-02 — Reel noticias IA (A · B · E · N)

### Qué pidió
- Noticias tech/IA recientes, **no CRM**
- Elegidas: **A** Anthropic Fable, **B** GPT-5.6, **E** Nano Banana (precio/velocidad), **N** Meta Business Agent (cómo funciona + LatAm)
- Textos **medianos**, no largos
- **30–45 s**, transiciones
- Imágenes de referencia + **URLs en copy**
- Más **llamativo** pero **no** look de prototipo IA

### Qué no funcionó
| Versión | Problema |
|---------|----------|
| v1 (3 noticias genéricas) | Noticias sin gancho; Brain2Qwerty/TabFM no convencieron |
| v2 | Solo cards texto; poco visual |
| v3 | Mejor, pero **se siente hecho por IA**: collage TECH NEWS, badges A/B/E/N, progress bar, flash verde, heroes 100% Gemini, misma card glass → *“cualquiera se dará cuenta”* |

### Correcciones explícitas
- Hook **A**: decir **Anthropic**, no Meta
- **Guardar feedback** en repo para siguientes piezas
- Aplicar skill **`content_craft`** antes de render

### Reglas derivadas (permanentes hasta nuevo aviso)
1. Mezcla: **screenshot fuente + Figma Agente + Gemini ≤30%**
2. Sin progress bar / badges quiz / “TECH NEWS” caps / flash verde entre slides
3. Layout **distinto** por segmento
4. URLs completas en `data/content-drafts/` + dominio en video
5. Copy asimétrico, tono editor humano LatAm
6. Logo oficial `data/brand-assets/logos/` (desde `assest/`)

---

## 2026-07-02 — Reel v3 → v4

### Qué no funcionó (v3)
- Heroes 100% Gemini + collage “TECH NEWS” + badges A/B/E/N + progress bar + flash verde = **plantilla IA obvia**

### Qué pidió para v4
- **Screenshots reales** de fuentes (BBC, OpenAI, Google, TechCrunch)
- Layouts **distintos** por noticia (split, ticker, stat)
- Menos efecto “generador de reels”
- **Guardar retro** en este log para siguientes videos

### Reglas v4 (aplicar en adelante)
1. Screenshot de artículo **obligatorio** por noticia
2. Sin badges quiz / progress / flash / collage hook
3. Grain sutil OK; crossfade editorial OK
4. Copy + URLs en `data/content-drafts/` siempre
5. Isotipo Wavys pequeño OK; logo lockup solo en CTA

### Entregado (v4)
- MP4: `wavys-stories/out/ig-tiktok-ai-news-aben-v4-2026-07-02.mp4` (45 s, 8.5 MB)
- Copy: `data/content-drafts/ig-tiktok-ai-news-aben-v4-copy.md`
- Screenshots archivados: `data/content-drafts/screenshots/`
- Layouts: split-left (A), ticker (B), stat (E), split-right (N)
- **Pendiente:** OK de Phil antes de publicar

### Qué sí funcionó (v4)
- Dirección editorial general — *“mucho mejor”*

### Qué no funcionó (v4)
- **Screenshots desktop 16:9** mal encuadrados en paneles 9:16 (`object-fit: cover` recortaba titulares / nav / márgenes)

### v4.1 — fix imágenes
- Recortes 9:16 por fuente en `screenshots/crops/` (titular visible)
- Componente `ScreenshotFrame`: `contain` vs `cover` + `objectPosition` por segmento
- TechCrunch: `cover` centrado en bloque artículo (`50% 38%`)
- MP4: `wavys-stories/out/ig-tiktok-ai-news-aben-v4.1-2026-07-02.mp4` (6.9 MB)

### Regla derivada (screenshots)
1. Captura desktop → **recortar a 9:16** enfocando titular antes de `cover`
2. Layouts horizontales (TechCrunch) → `contain` o `cover` con `objectPosition` manual
3. Probar encuadre **por segmento**; no un solo `object-fit` global

### Cierre Phil (v4 / v4.1)
- **Prefiere v4** (anterior) sobre v4.1 visualmente
- Screenshots **siguen sin adaptarse del todo** — aceptado
- **Decisión:** dejar así, no más iteraciones en este reel
- **Pendiente publicación:** OK de Phil cuando quiera

---

## 2026-07-02 — Regla meta (Phil)

### Qué pidió
- **Cada retroalimentación** que dé Phil debe **guardarse en este log** (y aplicarse en `content_craft`) para que los **siguientes videos** no repitan errores.

### Regla permanente
- Tras cada ronda de feedback → añadir entrada aquí con: qué pidió, qué no funcionó, qué sí, reglas derivadas.
- Leer este archivo **antes** de fase 5 en todo contenido nuevo.

---

## 2026-08-27 — Guiones de reel (estreno del skill `reel_script`)

### Qué pidió
- Un agente que escriba **guiones de reel** para grabar en cámara
- Prueba con la carta de ciberdefensa de OpenAI (https://openai.com/collective-cyberdefense/)

### Qué no funcionó
- La primera versión vendía el **CRM de agentes de WhatsApp**. Phil: *"es en base a Theros website, no en base a Wavys Technologies. No tenemos que hablar de WhatsApp sino de software a medida"*
- La causa no fue el guionista: el skill tenía el ángulo *"negocio que cotiza en Excel y vende por WhatsApp"* **escrito duro**, así que ataba todo guion futuro al SaaS

### Qué sí funcionó
- El bucle guionista → crítico readonly caza errores reales: una atribución falsa a la fuente, una cita entrecomillada no literal y un cierre que abandonaba su propio hook
- El guionista contradijo al crítico con evidencia (contó los firmantes: 128 hoy, no 116) y sacó la cifra exacta de cámara

### Reglas derivadas (permanentes)
1. **El default de todo guion es el estudio** — software y diseño a medida, `software.wavys-technologies.com`. El CRM de WhatsApp solo si Phil lo pide en ese mensaje
2. En un guion del estudio, el chat aparece como **síntoma** del desorden del cliente, nunca como la oferta
3. El archivo declara la **línea de negocio** en el encabezado; el crítico la revisa como error de primer orden
4. Cifras que un tercero puede recontar (firmantes, participantes) → decir "más de cien", no el número exacto
5. Toda regla de posicionamiento va en la tabla del skill, **no clavada en una frase suelta**

---

## Plantilla (añadir entradas nuevas)

```markdown
## YYYY-MM-DD — [título pieza]

### Qué pidió
### Qué no funcionó
### Qué sí funcionó
### Reglas derivadas
```
