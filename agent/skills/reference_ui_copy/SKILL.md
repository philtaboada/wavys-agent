# Skill — Copiar UI desde referencia visual (Pinterest / Dribbble / Behance)

Usar cuando Phil comparta **capturas, pins, shots o links** de Pinterest, Dribbble, Behance, Figma, Mobbin, etc. y quiera una web/UI **muy similar** — no “inspirada”, **replicada**.

**Relacionado:** `one_call_landing` (Astro) · `one_call_website` (Next) · `design-patterns-animal-health-behance.md`

**Gate 0 (pasos):** `agent/context/pipeline-gates.md` § `reference_ui_copy`

**Gate 1+ (calidad):** mismo doc § Gate 1+ `reference_ui_copy` — `data/pipeline-runs/<slug>-reference-validation.md` + Gate 1+ padre (`one_call_landing` o `one_call_website`)

---

## ¿Existe un skill de Pinterest/Dribbble “oficial”?

**No hay uno fiable que haga lo que Phil necesita.**

| Skill encontrado | Installs | Qué hace realmente | ¿Sirve para copiar pins? |
|------------------|----------|--------------------|---------------------------|
| `ihlamury/design-skills@pinterest-ui-skills` | ~150 | UI **estilo app Pinterest** (Inter, grid 4px) | ❌ No |
| `ihlamury/design-skills@dribbble-ui-skills` | ~238 | UI **estilo app Dribbble** (fondo negro, rosa) | ❌ No |
| `nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max` | ~248K | Auditoría UX, tipografías, paletas, reglas | ✅ Complemento |
| `notedit/happy-skills@screenshot-analyzer` | ~182 | Extrae features de screenshot (multi-agent) | ⚠️ Análisis, no build |
| `rshvr/elite-web-design@elite-inspiration` | ~58 | Inspiración web genérica | ⚠️ Poco específico |
| `anthropics/skills@frontend-design` | ~621K | Anti-slop, diseño frontend distintivo | ⚠️ Sin flujo “copia referencia” |

**Conclusión:** Los nombres “pinterest-ui” / “dribbble-ui” **no** significan “copia lo que ves en Pinterest”. Phil debe usar **este skill + capturas + documento de patrones**.

---

## Cuándo activar

Phil dice cosas como:
- “Mira este pin de Pinterest, hazlo igual”
- “Copia este shot de Dribbble”
- “Como el Behance que te mandé”
- “Estas fotos son la referencia, es importante”

---

## Pipeline (referencia → código)

```
① RECIBIR REFERENCIA → ② ANALIZAR POR SECCIONES → ③ DOCUMENTAR PATRONES → ④ IMÁGENES ÚNICAS → ⑤ BUILD FIEL → ⑥ VALIDAR vs CAPTURAS → ⑦ ENTREGAR
```

### 1 — Recibir referencia

Aceptar:
- Screenshots (preferido — Phil ya lo hace)
- Link Behance/Dribbble (abrir y pedir capturas si no se puede scrapear bien)
- Pin Pinterest (screenshot del pin completo + detalles zoom si hay tipografía/UI fina)

**Pedir si falta:** mobile + desktop del mismo diseño.

### 2 — Analizar por secciones (no mirar “vibe general”)

**Subagente ②:** lanzar **`explore`** con capturas Phil — prompt en `agent/pipelines/subagents.md` § reference_ui_copy. El padre valida y pasa a fase ③.

Descomponer **cada captura** en checklist:

| Bloque | Anotar |
|--------|--------|
| Navbar | Logo, items, pills, search, **¿un solo menú?** |
| Hero | Layout (bento / full bleed / split), tipografía, subrayados, CTAs |
| Grids | Columnas, spans, badges, cards pastel |
| Tipografía | Serif vs sans, tamaños, MAYÚSCULAS en labels |
| Color | Tokens hex aproximados por superficie |
| Imágenes | ¿Cuántas únicas? ¿Fondo pastel integrado? |
| Detalles | SVG sketch underline, chat bubbles, footer redondeado |
| Interacción | Hover states, symptom grid, etc. |

### 3 — Documentar patrones (obligatorio si Phil enfatiza importancia)

Crear o actualizar en `agent/context/`:

```
design-patterns-<proyecto>-<fuente>.md
```

Incluir: layout ASCII, tokens, DO/DON'T, anti-patrones, checklist pre-deploy.

**Ejemplo:** `design-patterns-animal-health-behance.md`

Entrada en `website-feedback-log.md` con reglas derivadas.

### 4 — Imágenes (Gemini, wavys-agents)

- **Una imagen distinta por card/slot** — nunca reciclar la misma foto
- Prompts con **fondo pastel sólido** cuando la referencia lo tenga
- `no text, no logo`
- Nombres descriptivos: `svc-therapy.jpg`, `cta-dog-nose.jpg`

```bash
cd "C:/Users/siste/Project/wavys-agents"
npm run tool -- generate_image '{"prompt":"...","aspectRatio":"4:3","outputPath":"/abs/path/public/images/svc-xxx.jpg"}'
```

### 5 — Build fiel

**Prioridad:** replicar layout y detalles **antes** que inventar.

| Referencia muestra | Hacer | No hacer |
|--------------------|-------|----------|
| Hero bento blanco | Grid + collage | Hero oscuro full-width |
| Subrayado manuscrito | `<SketchUnderline>palabra</SketchUnderline>` — trazos en tercio inferior viewBox | SVG suelto + `absolute -bottom-1` (cruza letras) |
| Servicios 4×3 | Grid explícito + placement | Misma imagen en 4 cards |
| CTA morado + card blanca | Section bg + inner card | Fondo gris plano |
| Navbar Behance | 1 Menu pill centrado | Doble hamburger |

**Tipografía:** elegir par **después** de ver referencia (ej. Cormorant + Manrope para Animal Health).

**Skills complementarios:**
- `ui-ux-pro-max` — validación accesibilidad, contraste, touch targets
- `web-typography` — escalas y legibilidad
- `one_call_landing` (Astro) o `one_call_website` (Next) — según `website-stack-rules.md`

### 6 — Validar vs capturas Phil

**Subagentes ⑥ (orden):**

1. **`shell`** — `validate_pipeline` (`reference_ui_copy` + gate padre landing/next)
2. **`bugbot`** readonly — tabla sección × ✅/❌ vs capturas (`R-V02`) — prompt en `agent/pipelines/subagents.md`
3. **Browser MCP** — screenshots 390 + 1440 si faltan

Gate antes de deploy:
- Screenshot 390px + 1440px
- Comparar mentalmente **sección por sección** con las fotos Phil
- Checklist del doc de patrones

### 7 — Entregar

- URL live
- Ruta doc patrones
- Qué se replicó y qué diferencias quedan (si las hay)

---

## Anti-patrones (de retro Phil)

1. Reinterpretar referencia sin mirar capturas
2. Reutilizar misma imagen en múltiples cards
3. CSS underline en headlines “sketch”
4. **SketchUnderline:** SVG hermano del texto o trazos centrados en viewBox → línea atraviesa letras
5. Doble menú en navbar
6. Defaults Geist/Inter sin criterio
7. Entregar URL sin comparar con fotos Phil
8. Entregar sketch underline sin screenshot zoom del H1

---

## Skills globales instalados (Phil — 2026-07-03)

| Skill | Ruta | Cuándo usar |
|-------|------|-------------|
| `ui-ux-pro-max` | `~/.agents/skills/ui-ux-pro-max` | **Antes de deploy:** contraste, touch targets, tipografías, checklist UX |
| `screenshot-analyzer` | `~/.agents/skills/screenshot-analyzer` | **Al recibir capturas Phil:** descomponer UI en features/layout antes de codear |

```bash
# ya instalados globalmente:
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max -g -y
npx skills add notedit/happy-skills@screenshot-analyzer -g -y
```

**Orden en cada website:**

1. Leer `website-feedback-log.md` + `one_call_landing` (pipeline completo)
2. **Investigar** 3+ referencias (WebSearch / createtoday / Pinterest) — obligatorio sin capturas
3. Crear `design-patterns-<slug>.md` + tabla diferenciación vs proyecto anterior
4. Build → `one_call_landing` (Astro) o `one_call_website` (sistema)
5. Pre-entrega → `ui-ux-pro-max` + 390px + 1440px + sketch underline si aplica
6. Deploy **solo si Phil pide**; si no, `bun run dev`

Si Phil manda capturas además: leer `screenshot-analyzer` y replicar fielmente.

---

## Flujo rápido para Phil

1. Mandar capturas (Pinterest/Dribbble/Behance) + industria + CTA
2. Agente lee **este skill** + crea doc patrones
3. Build + imágenes únicas + validación visual
4. URL + doc guardado para futuras iteraciones

---

## Historial

| Proyecto | Fuente | Doc patrones | Fecha |
|----------|--------|--------------|-------|
| lumen-vet / Animal Health | Behance Anastasia Sosikova | `design-patterns-animal-health-behance.md` | 2026-07-03 |
