# Skill — One-Call Landing (Astro)

Usar cuando Phil pida una **landing** / **website** de marketing (one-page) para un **cliente o demo**: clínica, restaurante, pastelería, florería, taller, estudio, etc.

**Stack fijo:** Astro + Tailwind + TypeScript + Bun  
**No usar para:** sistemas, apps, dashboards, automatizaciones → `one_call_website` (Next.js).

**Regla stack:** `agent/context/website-stack-rules.md`

**Gate 0 (pasos):** `agent/context/pipeline-gates.md` § `one_call_landing` — log en `data/pipeline-runs/<slug>-step-compliance.md`

**Gate 1+ (calidad):** mismo doc § Gate 1+ `one_call_landing` — validación en `data/pipeline-runs/<slug>-validation.md` (plantilla `_TEMPLATE-landing-validation.md`)

---

## Regla de oro

**Nunca codear primero.** Cada website de cliente sigue **el mismo pipeline** abajo. Si Phil no manda Pinterest, **igual** investigar. Si ya hiciste otra landing en la sesión, **no clonar** su layout.

---

## Pipeline obligatorio (siempre igual)

```
⓪ CONTEXTO → ① BRIEF → ② INVESTIGAR → ③ DOC PATRONES → ④ MARCA → ⑤ SCAFFOLD → ⑥ IMÁGENES → ⑦ BUILD → ⑧ VALIDAR → ⑨ ENTREGAR
```

| Fase | Qué hacer | Gate (no avanzar sin esto) |
|------|-----------|----------------------------|
| ⓪ | Leer `website-feedback-log.md`, `website-stack-rules.md`, skill `web-typography` | — |
| ① | Brief: industria, nombre, tono, CTA, secciones, ¿deploy o solo local? | Confirmado landing (no sistema) |
| ② | **Investigación visual** (ver § abajo) | 3+ referencias anotadas |
| ③ | Crear `agent/context/design-patterns-<slug>.md` | Archivo guardado **antes** de `bun create` |
| ④ | Tipografía + tokens + lista de componentes **desde el doc** | Distinto al proyecto anterior del batch |
| ⑤ | Scaffold Astro + Tailwind | — |
| ⑥ | Imágenes Gemini (una por slot) | — |
| ⑦ | Componentes `.astro` fieles al doc | No plantilla genérica |
| ⑧ | `bun run build` + screenshots 390px y 1440px | UX + sketch underline si aplica |
| ⑨ | Deploy **solo si Phil lo pide**; si no → `bun run dev` | Reportar URL o localhost |

---

## ⓪ — Contexto previo

Leer siempre:

- `agent/context/website-feedback-log.md` — errores Phil (slop, sketch, clonación)
- `agent/context/website-stack-rules.md`
- `agent/skills/reference_ui_copy/SKILL.md` — si hay capturas Phil
- Skills globales: `web-typography`, `ui-ux-pro-max`
- `screenshot-analyzer` — si Phil manda fotos

Docs de patrones existentes (consultar, no copiar ciegamente):

| Industria | Doc |
|-----------|-----|
| Veterinaria / Behance | `design-patterns-animal-health-behance.md` |
| Florería editorial | `design-patterns-florist-editorial-pinterest.md` |
| Pastelería playful | `design-patterns-bakery-playful-pinterest.md` |

---

## ① — Brief

Extraer o inferir:

- **Industria** y tipo de negocio
- **Nombre** de marca (o proponer uno demo)
- **Tono** (boutique, industrial, playful, luxury…)
- **CTA principal** (WhatsApp, pedido, cita, menú)
- **Secciones** necesarias (no usar lista fija del skill — salen de la investigación)
- **Deploy:** ¿Vercel o solo levantar local? **No deployear** salvo que Phil lo pida explícitamente

---

## ② — Investigación visual (OBLIGATORIA)

### Phil manda capturas / pin / Behance

1. Leer `screenshot-analyzer`
2. Descomponer **sección por sección** (navbar, hero, grids, footer, tipografía, colores)
3. Ir a fase ③ replicando fielmente → `reference_ui_copy`

### Phil NO manda capturas (caso habitual)

1. **WebSearch** con industria + `Pinterest website UI`, `site:createtoday.io`, `Dribbble`, `Behance`, casos reales
2. Anotar **3+ referencias** concretas (nombre del sitio o plantilla + qué patrón usa)
3. Responder por escrito (en el doc de patrones):
   - ¿Hero oscuro o claro? ¿Centrado o asimétrico?
   - ¿Qué tipo de grid? (bento, masonry, edge-to-edge, circular, scalloped…)
   - ¿Qué motion? (marquee, circular text, ninguno…)
   - ¿Tipografía? (slab, serif, script accent…)
4. **Tabla de diferenciación** — comparar con el **último website creado en el batch/sesión**:

### Subagente ② (obligatorio si investigación web)

Lanzar **`explore`** en paralelo mientras el padre prepara brief — prompt en `agent/pipelines/subagents.md` § landing ②.

El padre **integra** el resultado en fase ③ (`design-patterns-<slug>.md`). No codear hasta tener 3+ refs del subagente o búsqueda propia equivalente.

```markdown
| Patrón | Proyecto anterior | Este proyecto |
|--------|-------------------|---------------|
| Hero | crema + blob | chocolate oscuro + fotos superpuestas |
| Nav | pill Menú centro | links simples |
| … | … | **debe diferir** |
```

**Prohibido** reutilizar del proyecto anterior sin fila en esta tabla: marquee, bento, sketch underline, navbar 3-col pill, masonry, footer `rounded-t-[3rem]`, misma pareja tipográfica.

### Anti-slop (nunca como default)

- Hero 50/50 + 3 cards blancas idénticas + formulario partido
- Paleta genérica rose/sage/cream sin investigación
- Emoji como logo (✿, 🌸, 🍰)
- Stats en fila tipo SaaS en negocios artesanales
- Inter / Roboto / Geist sin criterio
- Copiar componentes `.astro` del repo anterior del cliente

---

## ③ — Documento de patrones (antes del código)

Crear **`agent/context/design-patterns-<slug>.md`** con:

1. Fuentes investigadas (URLs o nombres)
2. Tabla diferenciación vs proyecto anterior
3. Tokens CSS (hex)
4. Tipografía display + body + por qué
5. ASCII o descripción **por sección** (navbar, hero, productos, CTA, footer)
6. DO / DON'T y checklist pre-entrega
7. Componentes previstos (lista con nombres de archivo)

**No ejecutar `bun create astro` hasta que este archivo exista.**

---

## ④ — Marca y tipografía

- Leer skill `web-typography` — elegir par **antes** de codear
- **Display** = personalidad (slab, serif, script accent)
- **Body** = legibilidad (sans geométrica/humanista)
- **Nunca** repetir el mismo par que el proyecto anterior del batch (ej. si florería = Fraunces+Outfit, pastelería ≠ ese par)
- Stats y números: sans con `tabular-nums`, no display font

---

## ⑤ — Scaffold Astro

```bash
cd "/Volumes/mac externo/Mac Externo/projects"
bun create astro@latest <slug> -- --template minimal --typescript strict --install --git
cd <slug>
bun astro add tailwind --yes
mkdir -p public/images src/{layouts,components,styles}
```

Estructura:

```
src/
  pages/index.astro
  layouts/Layout.astro
  components/          # nombres según doc patrones — NO lista fija
  styles/global.css    # tokens del doc
public/images/
```

- CSS primero; islands React solo si hace falta
- `prefers-reduced-motion` en `global.css`
- Un solo `<h1>` por página

---

## ⑥ — Imágenes Gemini

**Nunca** `GenerateImage` de Cursor. Solo:

```bash
cd "/Volumes/mac externo/Mac Externo/projects/wavys-agents"
npm run tool -- generate_image '{"prompt":"...","aspectRatio":"16:9","outputPath":"/abs/.../public/images/hero.jpg"}'
```

- **Una imagen distinta por card/slot**
- Fondo pastel en prompt si el doc lo indica
- `no text, no logo` en prompts
- Aspect ratios válidos: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `5:4`

---

## ⑦ — Build

Los componentes salen del **doc de patrones**, no de una plantilla fija.

Ejemplos reales (varían por cliente):

| Cliente | Componentes distintivos |
|---------|-------------------------|
| pitlane-moto | Hero oscuro industrial, stats, services grid |
| petalo-floreria | Hero bento, marquee, masonry, SketchUnderline |
| miga-pasteleria | Hero chocolate, product strip, scalloped, circular text, split order |

**SketchUnderline** — solo si el doc lo pide. Contrato obligatorio (`design-patterns-animal-health-behance.md` § Contrato):

1. `<SketchUnderline variant="hero">palabra</SketchUnderline>` — envuelve children
2. Trazos SVG en **tercio inferior** del viewBox
3. `absolute -bottom-2`, `w-[108%]`, `preserveAspectRatio="none"`
4. Espacio explícito `{' '}` entre palabras
5. `leading-[1.12]+` en H1
6. Screenshot zoom — si la línea cruza letras, **no entregar**

Referencia código: `lumen-vet/src/components/SketchUnderline.tsx`

---

## ⑧ — Validación UX (gate)

```bash
bun run build
```

### Subagentes ⑧ (orden)

1. **`shell`** — `bun run build` + `validate_pipeline` (`one_call_landing`, slug) — prompt en `agent/pipelines/subagents.md`
2. **`bugbot`** readonly — review vs `design-patterns-<slug>.md` + `website-feedback-log.md`
3. **Browser MCP** (padre) — screenshots 390px + 1440px; checks manuales `L-V04`, `L-V08`

No declarar ⑨ hasta `authorized: true` (automático) + bugbot sin CRITICAL + screenshots guardados en `pipeline-runs/`.

- Screenshot **390px** + **1440px**
- Checklist `ui-ux-pro-max`: contraste, touch 44px, labels en forms, sin scroll horizontal
- Comparar sección por sección con doc de patrones (y capturas Phil si hay)
- Sketch underline verificado visualmente si existe

---

## ⑨ — Entregar

**Si Phil pidió deploy:**

```bash
cd "/Volumes/mac externo/Mac Externo/projects/<slug>"
vercel deploy --yes
# vercel deploy --prod --yes  # solo si confirma producción
```

**Si Phil pidió solo local (o no mencionó deploy):**

```bash
bun run dev -- --host
```

Reportar siempre:

- Ruta local del proyecto
- URL (Vercel o `http://localhost:4321/`)
- Stack: Astro
- Ruta del doc `design-patterns-<slug>.md`
- Tipografías y **en qué se diferencia** del website anterior (si aplica)

---

## Checklist pre-entrega (copiar y marcar)

**Gate 1+ completo:** usar `data/pipeline-runs/<slug>-validation.md` — criterios en `agent/context/pipeline-gates.md` § Gate 1+.

- [ ] Leído `website-feedback-log.md`
- [ ] Investigación 3+ referencias documentada
- [ ] `design-patterns-<slug>.md` creado **antes** del scaffold
- [ ] Tabla diferenciación vs proyecto anterior (si hay)
- [ ] Tipografía distinta al batch anterior
- [ ] Layout ≠ plantilla 3-cards genérica
- [ ] Imágenes Gemini únicas por slot
- [ ] `bun run build` OK
- [ ] Mobile + desktop verificados
- [ ] `prefers-reduced-motion`
- [ ] SketchUnderline validado (si aplica)
- [ ] Deploy solo si Phil lo pidió

---

## Migración landing → app

Si luego piden login, dashboard o API: nuevo repo Next.js o migración gradual; reutilizar tokens, copy e imágenes.

---

## Historial

| Proyecto | Industria | Dirección visual | Fecha |
|----------|-----------|------------------|-------|
| `lumen-vet` | Veterinaria | Behance bento (Next, pre-regla) | 2026-07-03 |
| `pitlane-moto` | Motos | Industrial oscuro + ámbar | 2026-07-03 |
| `petalo-floreria` | Florería | Editorial bento + masonry | 2026-07-03 |
| `miga-pasteleria` | Pastelería | Playful dark hero + scallop | 2026-07-03 |
| `fc-altamar` | Fútbol / club deportivo | Estadio hero + scoreboard + dorsales | 2026-07-03 |
| `suave-hogar` | Textiles / toallas / medias | Editorial crema + catálogo suave | 2026-07-03 |
| `altar-lena` | Restaurante fine dining | Editorial oscuro + stat strip + zig-zag | 2026-07-04 |

Al crear un website nuevo, **añadir fila** a esta tabla y usar la fila anterior en la tabla de diferenciación.
