# Pipeline gates — cumplimiento de pasos y loops de calidad

**Regla madre:** Ningún entregable (website, video, imagen, post, brief, informe) se considera terminado sin pasar los gates en orden.

**Gate 0 (este doc):** ¿Se siguieron **todos los pasos** del pipeline correcto, en orden, sin saltos?
**Gate 1+ (por pipeline):** ¿Cada **salida** cumple criterios medibles de calidad? → ver § Gate 1+ abajo.

---

## Protocolo de loop (todos los pipelines)

```
Ejecutar fase N
    → Registrar evidencia (archivo, comando, screenshot, nota)
    → Gate 0: ¿completaste TODOS los pasos hasta N?
        → No → volver al primer paso faltante (no avanzar)
        → Sí → Gate 1+ cuando exista para esa salida
            → No → loop en la fase que produjo la salida (máx. 3 intentos)
            → Sí → siguiente fase
```

| Regla | Valor |
|-------|-------|
| Máx. loops por fase | **3** |
| Tras 3 fallos | Parar, reportar a Phil con log de fallos |
| Evidencia obligatoria | Archivo en disco, salida de comando, o entrada en log de corrida |
| Prohibido | Saltar fase porque "casi está", codear antes de investigar (landings/video), render sin validar |

### Subagentes (maker vs checker)

En fases marcadas en cada skill, el agente padre **delega** investigación o revisión a subagentes Cursor (`Task` tool). Prompts y tabla por pipeline: **`agent/pipelines/subagents.md`**.

| Momento | Subagente | Rol |
|---------|-----------|-----|
| Investigación (landing ②, video ①, content ①, audit ②) | `explore` | Research en paralelo — readonly |
| Pre-entrega código (landing ⑧, next ⑤.5, referencia ⑥, video ⑤) | `bugbot` readonly | Review vs doc patrones / STORYBOARD |
| Gates automáticos | `shell` | `bun run build`, `validate_pipeline`, `hyperframes lint` |
| Copy / informe | `generalPurpose` readonly | Checker que no escribió el borrador |

**Orden:** maker termina fase → checker (1×) → `validate_pipeline` si aplica → Browser MCP si manual → avanzar o loop (máx. 3).

**Prohibido:** subagente en `send_email`, deploy o publicar.

### Log de corrida (obligatorio en pipelines de producción)

Al iniciar website / video / imagen con cutout / post comercial, crear:

`data/pipeline-runs/<slug>-step-compliance.md`

Plantilla mínima:

```markdown
# Step compliance — <slug>
Pipeline: <nombre>
Inicio: YYYY-MM-DD

| Paso | Hecho | Evidencia |
|------|-------|-----------|
| ① … | ☐/✅ | ruta o comando |
| ② … | ☐/✅ | … |

## Loops
| Intento | Fase | Fallo | Acción |
|---------|------|-------|--------|

## Subagentes
| Fase | Tipo | Rol | Resultado |
|------|------|-----|-----------|
```

Actualizar **antes** de declarar entrega a Phil.

**Landings Astro:** además crear `data/pipeline-runs/<slug>-validation.md` (plantilla: `data/pipeline-runs/_TEMPLATE-landing-validation.md`).

**Videos:** además crear `data/pipeline-runs/<slug>-video-validation.md` (plantilla: `data/pipeline-runs/_TEMPLATE-video-validation.md`). Proyecto en `wavys-stories/videos/<slug>/`.

**Imágenes Gemini / cutout:** `data/pipeline-runs/<asset-id>-image-validation.md` (plantilla: `data/pipeline-runs/_TEMPLATE-image-validation.md`). `<asset-id>` = slug del asset o del proyecto padre + nombre (ej. `presencia-laptop-cutout`).

**Contenido social:** `data/pipeline-runs/<slug>-content-validation.md` (plantilla: `data/pipeline-runs/_TEMPLATE-content-validation.md`). Copy en `data/content-drafts/<slug>-copy.md`.

**Diseño social (Figma estático):** `data/pipeline-runs/<slug>-social-validation.md` (plantilla: `_TEMPLATE-social-validation.md`) — además de content-validation cuando fases 5–6 son estáticas.

**Sistema Next.js:** `data/pipeline-runs/<slug>-next-validation.md` (plantilla: `_TEMPLATE-next-validation.md`).

**Copia UI referencia:** `data/pipeline-runs/<slug>-reference-validation.md` (plantilla: `_TEMPLATE-reference-validation.md`) — encadena con landing o next.

**Auditoría web:** `data/pipeline-runs/<dominio>-audit-validation.md` (plantilla: `_TEMPLATE-audit-validation.md`).

**Brief Presencia:** `data/pipeline-runs/<variant>-brief-validation.md` (plantilla: `_TEMPLATE-brief-validation.md`).

**Ventas / propuesta:** `data/pipeline-runs/<lead>-sales-validation.md` (plantilla: `_TEMPLATE-sales-validation.md`).

---

## Elegir pipeline correcto (Gate 0 previo)

| Phil pide… | Pipeline | Skill |
|------------|----------|-------|
| Landing / website marketing one-page | `one_call_landing` | `agent/skills/one_call_landing/SKILL.md` |
| Sistema / app / dashboard | `one_call_website` | `agent/skills/one_call_website/SKILL.md` |
| Copiar pin / Behance / Dribbble | `reference_ui_copy` (+ landing o website) | `agent/skills/reference_ui_copy/SKILL.md` |
| Video / reel / promo MP4 | `video_production` | `agent/skills/video_production/SKILL.md` |
| Post / carrusel / copy social | `content_production` | `agent/skills/content_production/SKILL.md` |
| Pieza estática Figma+Gemini | `social_design` (dentro de content) | `agent/skills/social_design/SKILL.md` |
| Imagen Gemini (asset) | `image_generation` (sub-pipeline) | `agent/connections/gemini-image.md` |
| Objeto flotante / PNG transparente | `image_cutout` (sub-pipeline) | `agent/context/image-cutout-pipeline.md` |
| Auditar web cliente | `website_audit` | `agent/skills/website_audit/SKILL.md` |
| Brief PDF Presencia Digital | `presencia_brief` | `agent/skills/presencia_brief/SKILL.md` |
| Lead / propuesta / LinkedIn | `sales_pipeline` | `agent/skills/sales_pipeline/SKILL.md` |

Si el pedido es video → **no** usar solo `content_production`. Si es landing → **no** usar `one_call_website` salvo que sea sistema.

---

## Gate 0 — Checklists por pipeline

Marcar ✅ solo con evidencia. Si falta un paso → **loop** desde ese paso.

### `one_call_landing` (website Astro)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| ⓪ | Leer `website-feedback-log.md`, `website-stack-rules.md` | Mención en log o notas de sesión |
| ① | Brief: industria, nombre, tono, CTA, secciones, deploy sí/no | Tabla brief en log o mensaje a Phil |
| ② | Investigar 3+ referencias visuales | URLs o notas en log |
| ③ | `agent/context/design-patterns-<slug>.md` **antes** de scaffold | Archivo existe con timestamp anterior al repo |
| ④ | Tipografía + tokens + componentes desde el doc | Lista en doc o log |
| ⑤ | Scaffold Astro + Tailwind + Bun | `package.json` / `astro.config` en proyecto |
| ⑥ | Imágenes Gemini (una por slot) | Archivos en `public/` + registro `generate_image` |
| ⑦ | Build componentes fieles al doc | Código `.astro` en repo |
| ⑧ | `bun run build` exitoso + screenshots 390px y 1440px | exit 0 + capturas guardadas |
| ⑨ | Entregar URL o localhost; deploy solo si Phil pidió | URL reportada |

**Sub-pipelines si aplican:** `reference_ui_copy` (si hay capturas) · `image_generation` · `image_cutout`

---

### `one_call_website` (sistema Next.js)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| ① | Brief: industria, nombre, tono, secciones, deploy | Tabla brief |
| ② | Brand + tipografía + tokens | Tokens en código o doc |
| ③ | Scaffold Next.js en `/projects/<slug>/` | Repo creado |
| ④ | Imágenes Gemini por slot | `public/` + `generate_image` |
| ⑤ | Secciones completas (sin placeholder) | Código revisable |
| ⑤.5 | Validación UX (`ui-ux-pro-max`, `website-feedback-log`) | Checklist en log |
| ⑥ | Deploy Vercel (si aplica) | URL preview/prod |
| ⑦ | Entregar URL + resumen | Mensaje a Phil |

**Sub-pipelines si aplican:** `reference_ui_copy` · `image_generation` · `image_cutout`

---

### `reference_ui_copy` (referencia → código)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| ① | Recibir referencia (capturas o links) | Archivos o URLs en log |
| ② | Analizar por secciones (hero, nav, cards…) | Secciones listadas en doc patrones |
| ③ | Documentar patrones (`design-patterns-<slug>.md`) | Archivo guardado |
| ④ | Imágenes únicas Gemini (no stock genérico) | Assets generados |
| ⑤ | Build fiel al doc (landing o website) | Código + build |
| ⑥ | Validar vs capturas (layout, tipo, jerarquía) | Screenshots comparación |
| ⑦ | Entregar | URL o archivos |

**Siempre** encadena con `one_call_landing` o `one_call_website` — este pipeline no sustituye el scaffold.

---

### `video_production` (MP4 / reel / promo)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| ① | Investigación profunda | `videos/<slug>/RESEARCH.md` |
| ② | Guion + story-design | `videos/<slug>/SCRIPT.md` |
| ③a | Blueprints + storyboard | `STORYBOARD.md` con shot sequences |
| ③b | Plan y staging de assets | `ASSET-PLAN.md` + archivos en `assets/` |
| ④ | Frames HyperFrames (o Remotion si Phil pidió) | `compositions/frames/*.html` |
| ⑤ | Validación exhaustiva | `VALIDATION.md` completo |
| ⑥ | Render MP4 | `renders/*.mp4` **solo después** de ⑤ |
| ⑦ | Entrega paquete a Phil | RESEARCH, SCRIPT, MP4, VALIDATION, copy opcional |

**Sub-pipelines por asset:** `image_generation` · `image_cutout` (columna Acción en ASSET-PLAN)

---

### `content_production` (post / carrusel / copy)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| ① | Investigar tema | Brief 3–5 bullets en log o draft |
| ② | Filtrar Wavys (puente a negocio) | Gate explícito sí/no en log |
| ③ | Elegir formato (post, carrusel, story…) | Formato documentado |
| ④ | Guion + copy | `data/content-drafts/<slug>-copy.md` |
| ⑤ | Visual (Figma / Gemini / Remotion) | Archivo Figma export o asset |
| ⑥ | Generar pieza final | PNG/PDF/video según formato |
| ⑦ | Entregar a Phil (sin publicar sin OK) | Draft + caption |

**Si es video:** redirigir a `video_production` — no marcar ①–⑦ de content como completos.

**Si es estático con Figma:** también completar `social_design` Gate 0.

---

### `social_design` (Figma Agente + Gemini)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| 1 | Leer `wavys-visual-brand-guide.md` + `brand-channels.md` | — |
| 2 | Abrir frame referencia Figma Posts → Agente | Frame citado |
| 3 | Estructura + tipografía + logo en Figma | Archivo Figma |
| 4 | Gemini para assets creativos si hace falta | `generate_image` + rutas |
| 5 | Cutout si objeto flota sobre fondo | Ver `image_cutout` |
| 6 | Export pieza final | PNG/JPG en carpeta entregable |

---

### `image_generation` (sub-pipeline — toda imagen vía Gemini)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| 1 | Leer `agent/connections/gemini-image.md` + guía visual si aplica | — |
| 2 | Prompt: sin texto/logo/marco si va en contenedor; aspect ratio correcto | Prompt en log |
| 3 | Ejecutar `npm run tool -- generate_image` (modelo `gemini-3.1-flash-lite-image`) | Salida JSON tool + `.jpg` |
| 4 | Si cutout planeado → fondo blanco/chroma en prompt | Prompt documentado |
| 5 | Copiar a destino (`public/`, `assets/`, etc.) | Archivo en ruta final |
| 6 | Referenciar en composición (HTML, Figma, ASSET-PLAN) | Ruta en código o plan |

**Prohibido:** `GenerateImage` de Cursor.

---

### `image_cutout` (sub-pipeline — PNG transparente)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| 1 | Decisión documentada: rol `cutout` vs `background` | STORYBOARD / ASSET-PLAN / flyer brief |
| 2 | JPG Gemini con fondo plano | `-base.jpg` o similar |
| 3 | Quitar fondo (skill `background-removal` o tool futuro) | `-cutout.png` |
| 4 | Componer en destino (Figma / HTML / HF) | Capa en composición |
| 5 | Validar bordes, halo, contraste | Checklist §4 en `image-cutout-pipeline.md` |

---

### `website_audit` (informe comercial)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| ① | URL + contexto (industria, objetivo) | En informe |
| ② | Cursor Browser: explore + screenshots | Capturas hero, sección, footer, móvil 390px |
| ③ | Probar CTAs visibles (menú, WhatsApp, carrito…) | Resultado en informe |
| ④ | curl/HTML: meta, enlaces, peso básico | Notas en informe |
| ⑤ | [Opcional] browser-use profundo | Solo si aplica; documentar |
| ⑥ | Informe markdown entregable | Archivo o mensaje estructurado |
| ⑦ | `log_business_note` si prospecto | Entrada en `data/notes.json` |

---

### `presencia_brief` (PDF comercial)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| 1 | Leer `STORYTELLING-GUIA.md` | — |
| 2 | Elegir plantilla correcta (digital / tienda / catálogo) | HTML correcto |
| 3 | Arco 5 actos — **sin precio en cover** | HTML revisado |
| 4 | Capítulos 01–07 + CTA | Secciones presentes |
| 5 | Assets (slides, hero); cutout si objeto flotante | Imágenes referenciadas |
| 6 | Regenerar PDF (`bun run generate-pdf.ts` o script flyer) | PDF/PNG nuevo con mtime |
| 7 | Checklist pre-entrega del skill | Todos los ítems |

---

### `sales_pipeline` (comercial)

| # | Paso | Evidencia mínima |
|---|------|------------------|
| 1 | Clasificar lead (partner / SaaS / caliente) | Tipo en nota |
| 2 | Registrar con `log_business_note` | Entrada en notes |
| 3 | Redactar propuesta o respuesta según tipo | Borrador mostrado a Phil |
| 4 | Confirmación Phil antes de `send_email` | OK explícito |
| 5 | Enviar + reportar id Resend | Salida tool |
| 6 | `create_reminder` seguimiento 48h / 5d | Recordatorio creado |

---

## Gate 1+ — Criterios medibles por salida

Tras pasar Gate 0 de la fase, validar la **salida** con estos checks. Si falla → loop en la fase indicada (máx. 3 intentos).

**Severidad:**

| Tier | Comportamiento |
|------|----------------|
| **CRITICAL** | No entregar. Loop inmediato. |
| **HIGH** | Loop en fase productora. |
| **MEDIUM** | 1 reintento auto; si persiste → reportar a Phil. |

**Niveles de medición:** **A** = comando/script · **B** = grep/conteo/archivos · **C** = screenshot/revisión visual

---

### `one_call_landing` — Gate 1+ ✅

Registrar resultados en `data/pipeline-runs/<slug>-validation.md`.

#### Salida ① — Brief

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-B01 | Campos completos | 6/6 no vacíos | Tabla: industria, nombre, tono, CTA, secciones, deploy | HIGH | ① |
| L-B02 | Tipo landing | Astro, no sistema | Confirmación explícita en log | CRITICAL | Re-elegir pipeline |
| L-B03 | Secciones nombradas | ≥4 secciones | Contar ítems en lista de secciones del brief | HIGH | ① |

#### Salida ② — Investigación

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-I01 | Referencias | ≥3 fuentes | `grep -cE 'https?://'` en doc patrones o log | CRITICAL | ② |
| L-I02 | Decisiones layout | 4 respuestas | Doc: hero claro/oscuro, grid, motion, tipografía mood | HIGH | ② |
| L-I03 | Tabla diferenciación | ≥4 filas | Tabla markdown si hay proyecto anterior en batch | CRITICAL | ② |
| L-I04 | Patrones ≠ anterior | ≥3 filas distintas | Comparar columna "Este proyecto" vs anterior | CRITICAL | ② |

#### Salida ③ — `design-patterns-<slug>.md`

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-D01 | Doc antes de código | mtime doc < mtime `package.json` | `stat -f '%m'` o `stat -c '%Y'` | CRITICAL | ③ → rehacer scaffold |
| L-D02 | Secciones obligatorias | 7/7 | Fuentes, tokens, tipografía, secciones, DO/DON'T, componentes, checklist | HIGH | ③ |
| L-D03 | Tokens color | ≥4 hex/`--var` | Contar en doc | HIGH | ③ |
| L-D04 | Componentes previstos | ≥5 `.astro` listados | Contar en doc | HIGH | ③ |
| L-D05 | Anti-slop documentado | ≥2 DON'T | Menciona ítems de `website-feedback-log.md` | HIGH | ③ |

#### Salida ④ — Marca / tipografía

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-T01 | Par display + body | 2 familias | `grep` fonts en `Layout.astro` / CSS | HIGH | ④ |
| L-T02 | Sin fonts default | 0 hits | `grep -riE 'Inter|Roboto|Geist' src/` = 0 | CRITICAL | ④ |
| L-T03 | ≠ batch anterior | Par distinto | Comparar vs historial `one_call_landing` § Historial | CRITICAL | ④ |
| L-T04 | Stats sin display | 0 stats en display font | `grep` componentes métricas: sans + `tabular-nums` | HIGH | ④⑦ |

#### Salida ⑤ — Scaffold

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-S01 | Stack Astro | dep `astro` | `package.json` | CRITICAL | ⑤ |
| L-S02 | Tailwind | configurado | `@astrojs/tailwind` o tailwind en config | HIGH | ⑤ |
| L-S03 | Estructura | 4 paths | `pages/index.astro`, `layouts/`, `components/`, `styles/global.css` | HIGH | ⑤ |
| L-S04 | Un H1 | exactamente 1 | `grep -c '<h1'` en `src/pages/` | HIGH | ⑤⑦ |
| L-S05 | Reduced motion | presente | `grep prefers-reduced-motion global.css` | HIGH | ⑤⑦ |

#### Salida ⑥ — Imágenes Gemini

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-G01 | Tool Gemini | JSON tool | Salida `generate_image` en log | CRITICAL | ⑥ |
| L-G02 | Una por slot | imgs ≥ slots doc | Contar `public/images/*` vs slots en patrones | HIGH | ⑥ |
| L-G03 | Sin placeholder stock | 0 hits | `grep -riE 'picsum|placeholder|loremflickr|unsplash.com/random' src/` | CRITICAL | ⑥ |
| L-G04 | Formato JPEG | `.jpg` | `file public/images/*` | HIGH | ⑥ |
| L-G05 | Prompt compliance | `no text, no logo` | Cada prompt en log | HIGH | ⑥ |

#### Salida ⑦ — Build (código)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-C01 | Componentes del doc | ≥80% | Listados en doc vs `ls src/components/*.astro` | HIGH | ⑦ |
| L-C02 | Sin copia batch anterior | 0 nombres iguales | Diff nombres `.astro` vs proyecto anterior (excepto `Layout`) | CRITICAL | ⑦ |
| L-C03 | Sin placeholder copy | 0 hits | `grep -riE 'lorem ipsum|TODO|TBD|placeholder' src/` | CRITICAL | ⑦ |
| L-C04 | Tokens en CSS | vars del doc | `grep` hex/`--` de doc en `global.css` | HIGH | ⑦ |

#### Salida ⑧ — Validación UX

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-V01 | Build limpio | exit 0 | `cd <slug> && bun run build` | CRITICAL | ⑦⑧ |
| L-V02 | Screenshots | 2 archivos | `*-390.png` y `*-1440.png` en `pipeline-runs/` | CRITICAL | ⑧ |
| L-V03 | Viewport width | 390±2 / 1440±2 px | `file` o metadata imagen | HIGH | ⑧ |
| L-V04 | Sin scroll horizontal | true @390px | CDP: `scrollWidth <= clientWidth` | HIGH | ⑦⑧ |
| L-V05 | Touch CTA | ≥44px alto | CDP bounding box botón principal móvil | MEDIUM | ⑦⑧ |
| L-V06 | Form labels | pares id/for | `grep` inputs + labels en forms | HIGH | ⑦⑧ |
| L-V07 | Contraste CTA | ≥4.5:1 | Ratio manual o tool | MEDIUM | ⑦⑧ |
| L-V08 | Hero above fold | visual OK @390px | Screenshot: imagen/bloque hero en primer viewport | HIGH | ⑦⑧ |
| L-V09 | H1 line-height | ≥1.08 mobile | Computed style o inspección screenshot | HIGH | ⑦⑧ |
| L-V10 | SketchUnderline | contrato OK | Solo si doc lo pide: trazo tercio inferior, no cruza letras | HIGH | ⑦⑧ |
| L-V11 | Fidelidad doc | ≥90% secciones | Contar secciones doc vs implementadas en VALIDATION | HIGH | ⑦ |

#### Salida ⑨ — Entrega

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-E01 | URL responde | HTTP 200 | `curl -o /dev/null -w '%{http_code}'` localhost o Vercel | CRITICAL | ⑧⑨ |
| L-E02 | Deploy condicional | sin deploy si no pidió | Log: 0 `vercel deploy` si Phil no lo pidió | CRITICAL | ⑨ |
| L-E03 | Paquete reportado | 4 ítems | Repo + doc patrones + tipografías + diferenciación | HIGH | ⑨ |
| L-E04 | Historial skill | fila nueva | Tabla § Historial en `one_call_landing/SKILL.md` | HIGH | ⑨ |

#### Anti-slop transversal (cualquier fase post-⑦)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| L-A01 | No 3 cards blancas idénticas | ≤2 cards iguales en hero | Inspección componente hero | CRITICAL | ⑦ |
| L-A02 | No emoji logo | 0 emoji en nav marca | `grep` navbar | HIGH | ⑦ |
| L-A03 | No stats SaaS artesanal | 0 métricas genéricas | Si industria ≠ tech: sin "10k+ users" etc. | HIGH | ⑦④ |
| L-A04 | Investigación antes código | L-D01 | Igual L-D01 | CRITICAL | ②③ |

#### Comandos rápidos (copiar en validación)

```bash
SLUG=<slug>
PROJ="/Volumes/mac externo/Mac Externo/projects/$SLUG"
DOC="agent/context/design-patterns-$SLUG.md"

# L-D01 doc antes de código
test "$(stat -f '%m' "$DOC")" -lt "$(stat -f '%m' "$PROJ/package.json")" && echo OK || echo FAIL

# L-T02 fonts prohibidas
grep -riE 'Inter|Roboto|Geist' "$PROJ/src" && echo FAIL || echo OK

# L-G03 placeholders
grep -riE 'picsum|placeholder|loremflickr|unsplash.com/random' "$PROJ/src" && echo FAIL || echo OK

# L-V01 build
cd "$PROJ" && bun run build

# L-S04 un H1
grep -r '<h1' "$PROJ/src/pages" | wc -l
```

#### Gate final landing

**Entregar a Phil solo si:** Gate 0 completo + **todos los CRITICAL ✅** + **≥95% HIGH ✅** (MEDIUM documentados si fallan).

---

### `video_production` — Gate 1+ ✅

Proyecto: `wavys-stories/videos/<slug>/`  
Registrar en `data/pipeline-runs/<slug>-video-validation.md` + `VALIDATION.md` en el proyecto.

#### Salida ① — `RESEARCH.md`

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| V-R01 | Archivo existe | 1 | `videos/<slug>/RESEARCH.md` | CRITICAL | ① |
| V-R02 | Ejes investigación | ≥4 ejes | Contar bullets bajo `## Ejes investigados` | CRITICAL | ① |
| V-R03 | Fuentes citables | ≥10 URLs | `grep -cE 'https?://'` en RESEARCH.md | CRITICAL | ① |
| V-R04 | Búsquedas documentadas | ≥8 | Sección o checklist: queries distintas listadas | HIGH | ① |
| V-R05 | Ángulo narrativo | 1 párrafo | Sección `## Ángulo narrativo recomendado` no vacía | CRITICAL | ① |
| V-R06 | Puente visual | documentado | Sección mood/paleta/refs en RESEARCH | HIGH | ① |
| V-R07 | Descartado | ≥1 ítem | Sección `## Descartado` — qué no se usará y por qué | HIGH | ① |
| V-R08 | Checklist investigación | 6/6 ✅ | Checklist al final de RESEARCH.md | HIGH | ① |
| V-R09 | Cero datos inventados | 0 claims sin fuente | Cada cifra/quote enlazada a `Hallazgos` + URL | CRITICAL | ① |
| V-R10 | Referencias visuales | ≥2 | Links o rutas `research/screenshots/` | HIGH | ① |

#### Salida ② — `SCRIPT.md`

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| V-S01 | Archivo existe | 1 | `SCRIPT.md` | CRITICAL | ② |
| V-S02 | Logline | 1 frase | Bloque Logline presente | HIGH | ② |
| V-S03 | Arco 5 actos | 5 bloques | Acto 1–5 documentados (salvo excepción Phil) | CRITICAL | ② |
| V-S04 | Tabla timecode | ≥1 fila/segmento | Columnas: Seg, Acto, VO, Emoción, Ref investigación | CRITICAL | ② |
| V-S05 | Hook ≤3s | primer segmento | Primera fila timecode empieza en 0–3s con hook (no logo lento) | CRITICAL | ② |
| V-S06 | Cifras desde RESEARCH | 100% | Cada número en SCRIPT referencia § RESEARCH | CRITICAL | ② |
| V-S07 | story-design aplicado | explícito | Nota en SCRIPT o log: `story-design.md` leído | HIGH | ② |
| V-S08 | Gate Phil guion | OK o "sigue directo" | Mensaje Phil o nota en log antes de ③ | HIGH | ② |

#### Salida ③a — `STORYBOARD.md` + `frame.md`

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| V-ST01 | STORYBOARD existe | 1 | Archivo presente | CRITICAL | ③a |
| V-ST02 | Video direction | sección | `## Video direction` presente | CRITICAL | ③a |
| V-ST03 | Frames planificados | ≥8 o = segmentos guion | Contar frames vs duración (promo típica ≥8) | HIGH | ③a |
| V-ST04 | Blueprint por frame | 100% | Cada frame tiene `blueprint:` id válido del índice HF | CRITICAL | ③a |
| V-ST05 | Shot sequence time-coded | 100% frames | Cada frame: escenas `Scene N (0.0–Xs):` | CRITICAL | ③a |
| V-ST06 | Signature move | 100% frames | Campo signature move no vacío por frame | CRITICAL | ③a |
| V-ST07 | Blueprints distintos | ≥2 ids | Cuando roles difieren — no 1 template para todo | CRITICAL | ③a |
| V-ST08 | Sin front-load | 0 frames | Ningún frame con todo visible en t=0 (revisión STORYBOARD) | HIGH | ③a |
| V-ST09 | frame.md | 1 | Preset Wavys Agente o hyperframes-creative | HIGH | ③a |
| V-ST10 | visual-design leído | log | Referencia a `visual-design.md` en log o STORYBOARD | HIGH | ③a |

#### Salida ③b — `ASSET-PLAN.md` + assets

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| V-A01 | ASSET-PLAN existe | 1 | Archivo presente | CRITICAL | ③b |
| V-A02 | Fila por segmento | ≥ filas guion | Filas en tabla vs segmentos SCRIPT timecode | HIGH | ③b |
| V-A03 | Assets en disco | 100% planificados | Cada asset con ruta existe en `assets/` o URL local | CRITICAL | ③b |
| V-A04 | Cutouts PNG | 100% marcados | Filas `Acción=cutout` → `-cutout.png` existe | CRITICAL | ③b |
| V-A05 | Gemini assets | tool log | Filas Gemini: salida `generate_image` en log | HIGH | ③b |
| V-A06 | Sin placeholder | 0 | No `picsum`, `placeholder.com`, assets genéricos sin plan | CRITICAL | ③b |
| V-A07 | Gate ③ global | ③a+③b | STORYBOARD + ASSET-PLAN ambos ✅ antes de ④ | CRITICAL | ③a③b |

#### Salida ④ — Frames HyperFrames / Remotion

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| V-E01 | hyperframes.json | 1 | Config HF en proyecto | CRITICAL | ④ |
| V-E02 | HTML por frame | = frames STORYBOARD | `ls compositions/frames/*.html` count | CRITICAL | ④ |
| V-E03 | Sin template genérico | 0 | No `BinanceLayerScene` ni overlay foto+texto 38px único | CRITICAL | ④ |
| V-E04 | Blueprint implementado | por frame | Comentario GSAP cita rule id del blueprint | HIGH | ④ |
| V-E05 | Three/Lottie si plan | 100% | ASSET-PLAN tipo Three/Lottie → adapter en HTML | HIGH | ④ |
| V-E06 | lint en desarrollo | exit 0 | `npx hyperframes lint` antes de ⑤ | HIGH | ④ |
| V-E07 | Remotion solo si pedido | stack | Si Remotion: Phil lo pidió; STORYBOARD blueprints igual | CRITICAL | ④ |

#### Salida ⑤ — `VALIDATION.md` + QA

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| V-V01 | lint | exit 0 | `npx hyperframes lint` | CRITICAL | ④⑤ |
| V-V02 | validate | exit 0 | `npx hyperframes validate` | CRITICAL | ④⑤ |
| V-V03 | inspect | exit 0 | `npx hyperframes inspect` | CRITICAL | ④⑤ |
| V-V04 | snapshot | exit 0 + revisado | `npx hyperframes snapshot` + contact-sheet sin glitch | CRITICAL | ⑤ |
| V-V05 | Browser QA frames | 100% críticos | Tabla en VALIDATION: hook + CTA + midpoints | CRITICAL | ⑤ |
| V-V06 | Imágenes cargan | 0 rotas | QA: no 404, no img roto en frames | CRITICAL | ⑤ |
| V-V07 | Texto legible | 0 cortes | QA: safe area, sin solapamiento texto/imagen | CRITICAL | ⑤ |
| V-V08 | Viewport correcto | 1080×1920 o formato proyecto | Screenshots QA en dimensión target | HIGH | ⑤ |
| V-V09 | Safe zone social | OK | Margen inferior/superior IG/TikTok en hook y CTA | HIGH | ⑤ |
| V-V10 | VALIDATION.md completo | secciones | Comandos, QA visual, Fixes, Render autorizado | CRITICAL | ⑤ |
| V-V11 | Render autorizado | ✅ explícito | Línea `Render autorizado ✅ Sí` con fecha | CRITICAL | ⑤ |

#### Salida ⑥ — MP4 + entrega

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| V-D01 | MP4 post-validación | mtime mp4 > VALIDATION | `stat` MP4 posterior a autorización render | CRITICAL | ⑤⑥ |
| V-D02 | Sin render prematuro | orden | 0 render antes de V-V11 | CRITICAL | ⑤ |
| V-D03 | Paquete Phil | 4/4 mínimo | RESEARCH resumen, SCRIPT, MP4, VALIDATION | CRITICAL | ⑥ |
| V-D04 | Contact sheet | 1 | `snapshots/contact-sheet.jpg` con entrega | HIGH | ⑥ |
| V-D05 | Copy caption | si aplica | `data/content-drafts/<slug>-copy.md` | HIGH | ⑥ |
| V-D06 | OK Phil publicar | pendiente | No publicar hasta OK explícito | CRITICAL | ⑥ |

#### Anti-slop video (transversal)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| V-X01 | No investigación superficial | V-R03 + V-R04 | RESEARCH cumple mínimos | CRITICAL | ① |
| V-X02 | No guion sin fuentes | V-S06 | Stats traceables | CRITICAL | ② |
| V-X03 | No template único 8 frames | V-ST07 | Blueprints variados | CRITICAL | ③a④ |
| V-X04 | No MP4 sin QA | V-V11 + V-D02 | Render solo post-gate | CRITICAL | ⑤ |

#### Comandos rápidos (copiar en validación)

```bash
SLUG=<slug>
VID="/Volumes/mac externo/Mac Externo/projects/wavys-stories/videos/$SLUG"

# V-R03 fuentes
grep -cE 'https?://' "$VID/RESEARCH.md"

# V-E02 frames HTML
ls "$VID/compositions/frames/"*.html 2>/dev/null | wc -l

# V-V01–V-V04 (en orden — parar si falla)
cd "$VID"
npx hyperframes lint
npx hyperframes validate
npx hyperframes inspect
npx hyperframes snapshot

# V-D01 render después de gate
# npx hyperframes render --quality high --output renders/$SLUG-YYYY-MM-DD.mp4
```

#### Gate final video

**Entregar a Phil solo si:** Gate 0 completo + **todos los CRITICAL ✅** + **≥95% HIGH ✅** + **V-V11 Render autorizado ✅** antes de cualquier MP4.

---

### `image_generation` — Gate 1+ ✅

Sub-pipeline: toda imagen vía Gemini. Registrar en `data/pipeline-runs/<asset-id>-image-validation.md`.

#### Salida — JPG Gemini (`generate_image`)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| IG-01 | Tool correcta | wavys-agents | Comando desde `wavys-agents`: `npm run tool -- generate_image` | CRITICAL | Re-ejecutar tool |
| IG-02 | No Cursor GenerateImage | 0 | No usar tool integrada de Cursor | CRITICAL | Re-generar con Gemini |
| IG-03 | Modelo permitido | exacto | JSON `result.model` = `gemini-3.1-flash-lite-image` | CRITICAL | Re-ejecutar |
| IG-04 | Respuesta OK | `ok: true` | Salida JSON del tool | CRITICAL | Re-ejecutar / revisar prompt |
| IG-05 | Archivo existe | 1 | `result.path` en disco | CRITICAL | Re-ejecutar |
| IG-06 | Formato JPEG | `.jpg` | Extensión + `result.mimeType` = `image/jpeg` | CRITICAL | Renombrar/regenerar |
| IG-07 | Tamaño mínimo | ≥5 KB | `result.bytes` o `stat` archivo | HIGH | Prompt/reintento |
| IG-08 | Aspect ratio válido | enum | Uno de: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `5:4` | CRITICAL | Corregir param |
| IG-09 | Prompt sin texto/logo | presente | Prompt incluye `no text`, `no logo` (salvo brief explícito) | CRITICAL | Re-prompt |
| IG-10 | Contexto leído | si aplica | Social → `wavys-visual-brand-guide.md` §5; landing → slot en patrones | HIGH | Leer doc + regenerar |
| IG-11 | outputPath destino | ruta final | Si va a proyecto: copiado a `public/`, `assets/`, etc. | HIGH | Copiar |
| IG-12 | Referenciado | 1 ref | Ruta en HTML, Figma import, ASSET-PLAN o log padre | HIGH | Enlazar |
| IG-13 | image-to-image | ref existe | Si `referenceImagePath`: archivo local existe antes de tool | CRITICAL | Corregir path |
| IG-14 | Pre-cutout prompt | si cutout planeado | Fondo blanco `#FFFFFF` o chroma `#00FF00` en prompt | CRITICAL | Regenerar → cutout |
| IG-15 | Contenedor circular | si aplica | Prompt: sin marco/borde/círculo propio (regla user) | HIGH | Regenerar |
| IG-16 | Log sin secrets | 0 keys | No pegar `GEMINI_API_KEY` en logs/chat | CRITICAL | Redactar |

#### Comandos rápidos

```bash
ASSET="/path/to/output.jpg"

# IG-05 + IG-06 + IG-07
test -f "$ASSET" && file "$ASSET" && stat -f '%z bytes' "$ASSET"

# Tras tool — verificar model en JSON pegado en log
# "model": "gemini-3.1-flash-lite-image"
```

#### Gate final imagen (solo generación, sin cutout)

**Usar asset solo si:** Gate 0 `image_generation` + **todos CRITICAL IG-* ✅** + **≥95% HIGH ✅**.

---

### `image_cutout` — Gate 1+ ✅

Sub-pipeline: **después** de `image_generation` cuando rol = `cutout`. Mismo log `<asset-id>-image-validation.md` (sección cutout).

#### Salida — PNG transparente

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| IC-01 | Decisión documentada | rol=cutout | ASSET-PLAN / STORYBOARD / flyer brief / log | CRITICAL | Documentar o usar full-bleed |
| IC-02 | JPG base existe | 1 | Archivo `-base.jpg` o path en log IG | CRITICAL | ① image_generation |
| IC-03 | Gate IG previo | CRITICAL ✅ | Especialmente IG-14 si cutout | CRITICAL | Regenerar JPG |
| IC-04 | PNG cutout existe | 1 | `*-cutout.png` en carpeta acordada | CRITICAL | Paso 2 cutout |
| IC-05 | Canal alpha | RGBA | `file` → PNG con alpha / `sips -g hasAlpha` (macOS) | CRITICAL | Re-quitar fondo |
| IC-06 | Naming | convención | Sufijo `-cutout.png` o ruta en ASSET-PLAN | HIGH | Renombrar |
| IC-07 | Método bg removal | documentado | Skill `background-removal` o tool futuro en log | HIGH | Re-ejecutar removal |
| IC-08 | Composición | referenciado | HTML `<img>`, Figma layer, HF `assets/`, Remotion `staticFile` | CRITICAL | Paso 3 composición |
| IC-09 | Sin halo blanco/verde | visual OK | Inspección PNG sobre fondo oscuro (#333) | CRITICAL | Regenerar JPG o re-cut |
| IC-10 | Sujeto completo | visual OK | Dedos/bordes/objeto no recortados | CRITICAL | Re-cut / regenerar |
| IC-11 | Contraste final | legible | Cutout sobre fondo destino real (gradiente/hero) | HIGH | Ajustar composición |
| IC-12 | ASSET-PLAN sync | si video | Columna Acción = `cutout` + ruta PNG final | HIGH | Actualizar plan |
| IC-13 | Fallback documentado | si cutout mal | Log: full-bleed o card pastel — no entregar roto | HIGH | Aplicar fallback |

#### Comandos rápidos

```bash
CUTOUT="/path/to/asset-cutout.png"

# IC-04 + IC-05 (macOS)
test -f "$CUTOUT" && file "$CUTOUT" && sips -g hasAlpha "$CUTOUT"

# Contraste rápido — abrir cutout sobre #070604 en preview/browser
```

#### Gate final cutout

**Usar PNG solo si:** Gate 0 `image_cutout` + **image_generation CRITICAL ✅** + **todos CRITICAL IC-* ✅** + **≥95% HIGH ✅**.

**Si IC-09/IC-10 fallan tras 3 loops:** aplicar IC-13 (full-bleed) — no composición rota.

---

### `content_production` — Gate 1+ ✅

Posts, stories, carruseles, copy social. Registrar en `data/pipeline-runs/<slug>-content-validation.md`.  
Convención slug: `[canal]-[tema]-[YYYY-MM-DD]` (ej. `ig-presencia-digital-promo-2026-07-05`).

**Sub-pipelines si aplican:** `video_production` (MP4/reel) · `social_design` (estático Figma) · `image_generation` · `image_cutout`

#### Salida ① — Investigación

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| CP-R01 | Brief tendencia | 3–5 bullets | Sección en log o draft: “qué está pasando” | HIGH | ① |
| CP-R02 | Ángulos posibles | ≥2 | Lista de ángulos documentada | HIGH | ① |
| CP-R03 | Fuentes si hay datos | URL por claim | Cada stat/noticia con fuente (no inventar) | CRITICAL | ① |
| CP-R04 | Búsqueda real | ≥2 queries | Log de búsquedas distintas (no una sola) | HIGH | ① |

#### Salida ② — Filtro Wavys

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| CP-F01 | Gate Wavys | PASS explícito | Línea: “Pasa filtro Wavys: sí” + puente (WhatsApp/IA/leads) | CRITICAL | ② o proponer otro tema |
| CP-F02 | No forzar tema | si FAIL | Si no pasa: avisar Phil + alternativa — no publicar | CRITICAL | ② |
| CP-F03 | CTA hacia Wavys | presente | CTA suave o directo documentado | HIGH | ② |

#### Salida ③ — Formato

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| CP-FM01 | Formato elegido | 1 | Tabla formato (story, post, carrusel, copy-only…) | HIGH | ③ |
| CP-FM02 | Spec dimensiones | correctas | 1080×1920 story · 1080×1350 IG · 1080×1080 LI/FB | CRITICAL | ③ |
| CP-FM03 | Razón documentada | 1 línea | “Ángulo X → formato Y porque…” | HIGH | ③ |
| CP-FM04 | Video ≠ solo content | pipeline correcto | Reel/promo MP4 → **`video_production`** (no solo fases ①–⑦ content) | CRITICAL | Redirigir pipeline |
| CP-FM05 | Carrusel slides | 3–5 | Si carrusel: conteo slides planificado | HIGH | ③ |

#### Salida ④ — Guion + copy

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| CP-C01 | Archivo copy | 1 | `data/content-drafts/<slug>-copy.md` | CRITICAL | ④ |
| CP-C02 | Naming slug | convención | Nombre `[canal]-[tema]-[fecha]` | HIGH | Renombrar |
| CP-C03 | Caption | presente | 1–2 líneas + hashtags acotados en copy file | HIGH | ④ |
| CP-C04 | CTA canal | alineado | CTA según `brand-channels.md` | HIGH | ④ |
| CP-C05 | Guion 15s | si story corto | Tabla seg 0–3/3–8/8–12/12–15 si aplica | HIGH | ④ |
| CP-C06 | Copy asimétrico | no brochure | Frases cortas + punch — no bloque simétrico tag→headline→body | HIGH | ④ |
| CP-C07 | URLs fuentes | si noticias | URLs completas en copy file (`content-feedback-log`) | CRITICAL | ④ |

#### Salida ⑤ — Visual (plan + ejecución)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| CP-V01 | content-feedback-log | leído | Mención en log antes de visual | HIGH | ⑤ |
| CP-V02 | content_craft | leído | Checklist anti-slop antes de generar | CRITICAL | ⑤ |
| CP-V03 | Guía visual | leída | `wavys-visual-brand-guide.md` — Familia C Agente | HIGH | ⑤ |
| CP-V04 | Estático → Figma | frame ref | Frame Figma Posts → Agente citado o duplicado | HIGH | ⑤ |
| CP-V05 | Tipografía/logo en Figma | no en Gemini | Rubik + logo Wavys en Figma/código, no quemados en imagen | CRITICAL | ⑤⑥ |
| CP-V06 | Gemini sub-pipeline | si aplica | Gate 1+ `image_generation` ✅ por asset | CRITICAL | ⑤⑥ |
| CP-V07 | Cutout sub-pipeline | si aplica | Gate 1+ `image_cutout` ✅ | CRITICAL | ⑤⑥ |
| CP-V08 | Mezcla medios | ≥2 capas | Figma + screenshot y/o Gemini parcial (`content_craft`) | CRITICAL | ⑤ |
| CP-V09 | Gemini ≤40% visual | si usa Gemini | Mood/textura parcial — no hero 100% Gemini solo | CRITICAL | ⑤⑥ |
| CP-V10 | Screenshot noticia | si noticias | ≥1 screenshot real por noticia archivado | CRITICAL | ⑤ |
| CP-V11 | Sin plantilla IA | 0 patrones | No badges A/B/C, progress bar, “TECH NEWS” collage, flash verde | CRITICAL | ⑤⑥ |
| CP-V12 | Layouts variados | si multi-segmento | Layout distinto por slide/noticia | HIGH | ⑤⑥ |

#### Salida ⑥ — Generar (archivo final)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| CP-G01 | Archivo export | 1 | JPG/PNG/MP4 en ruta acordada | CRITICAL | ⑥ |
| CP-G02 | Dimensiones export | = CP-FM02 | `file` / metadata imagen o comp Remotion | CRITICAL | ⑥ |
| CP-G03 | MP4 post video gate | si video | `video_production` Gate 1+ + VALIDATION ✅ | CRITICAL | ⑥ |
| CP-G04 | Logo oficial | si logo | `data/brand-assets/logos/` — no inventar | HIGH | ⑥ |
| CP-G05 | Creatividad ≠ clone | visual | No clonar mecánicamente frame anterior del mes | HIGH | ⑥ |

#### Salida ⑦ — Entrega

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| CP-D01 | Paquete Phil | 5/5 | Resumen, formato, copy, archivos, checklist pub | CRITICAL | ⑦ |
| CP-D02 | Sin publicar | pendiente OK | 0 publicación hasta “publica” / “ok” de Phil | CRITICAL | — |
| CP-D03 | Link Figma | si estático | URL o node id frame entregado | HIGH | ⑦ |
| CP-D04 | log_business_note | si comercial | Entrada opcional con tag campaña | MEDIUM | ⑦ |

#### Anti-slop contenido (transversal)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| CP-X01 | No trending vacío | CP-F01 | Puente Wavys obligatorio | CRITICAL | ② |
| CP-X02 | No stats inventados | CP-R03 | Trazabilidad fuentes | CRITICAL | ①④ |
| CP-X03 | No reel generator look | CP-V11 | Patrones content-feedback-log | CRITICAL | ⑤⑥ |
| CP-X04 | No video sin pipeline | CP-FM04 | MP4 → video_production | CRITICAL | ③ |

#### Comandos rápidos

```bash
SLUG=ig-tema-2026-07-07
COPY="data/content-drafts/${SLUG}-copy.md"

# CP-C01
test -f "$COPY" && echo OK || echo FAIL

# CP-C07 URLs en copy
grep -cE 'https?://' "$COPY"

# CP-G02 dimensiones (macOS)
sips -g pixelWidth -g pixelHeight "path/to/export.jpg"
```

#### Gate final contenido

**Entregar a Phil solo si:** Gate 0 completo + **todos CRITICAL ✅** + **≥95% HIGH ✅** + **CP-D02** (sin publicar hasta OK).

**Si formato = MP4/reel:** además **`video_production` Gate 1+ completo**.

**Si pieza estática (post/carrusel):** además **`social_design` Gate 1+** — `data/pipeline-runs/<slug>-social-validation.md`.

---

### `social_design` — Gate 1+ ✅

Sub-pipeline de **`content_production`** fases 5–6 (piezas **estáticas** Figma + Gemini).  
Registrar en `data/pipeline-runs/<slug>-social-validation.md`.

**Pre-requisito:** `content_production` fases ①–④ Gate 1+ (mín. CP-F01, CP-FM02, CP-C01).

#### Salida — Frame Figma + export

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| SD-P01 | Padre content | CP críticos | CP-F01 ✅, CP-FM02 ✅, CP-C01 ✅ | CRITICAL | content ①–④ |
| SD-01 | Guía visual leída | 1 | `wavys-visual-brand-guide.md` — Familia C Agente | HIGH | Pre-diseño |
| SD-02 | Canales leídos | 1 | `brand-channels.md` — CTA canal | HIGH | Pre-diseño |
| SD-03 | Figma Posts | file correcto | File key `59V65PuX0A872JOibvhh11`, página **Agente** | CRITICAL | Paso 1 |
| SD-04 | Frame ref citado | node id | URL o id frame duplicado (ej. `833:113`, `778:14`, `651:66`) | HIGH | Paso 1 |
| SD-05 | Frame duplicado | 1 frame nuevo | Frame destino en Figma (no editar template original) | CRITICAL | Paso 1 |
| SD-06 | Rubik en Figma | 100% copy | Tipografía principal Rubik — no en JPG Gemini | CRITICAL | Paso 5 |
| SD-07 | Logo en Figma | si corporativo | Logo desde `data/brand-assets/logos/` — no quemado en Gemini | CRITICAL | Paso 5 |
| SD-08 | Evaluación Gemini | documentada | Sí/no: ¿fondo/3D faltaba en file? | HIGH | Paso 2 |
| SD-09 | Gemini gate | si generó | Gate 1+ `image_generation` ✅ por asset | CRITICAL | Paso 2 |
| SD-10 | Cutout gate | si flotante | Gate 1+ `image_cutout` ✅ | CRITICAL | Paso 3 |
| SD-11 | Sin texto en Gemini | prompt | `no text, no logo` en prompts Gemini | CRITICAL | Paso 4 |
| SD-12 | Espacio negativo | presente | Composición deja área para headline (guía §5) | HIGH | Paso 5 |
| SD-13 | Creatividad ≠ clone | variación | Layout no copia mecánica del frame ref | HIGH | Paso 5 |
| SD-14 | Tokens marca | §2.1 guía | Fondo `#070604`, acentos teal/neón — inspección Figma | HIGH | Paso 5 |
| SD-15 | Checklist guía §6 | 8/8 | Formato px, colores, Rubik, hook, 1 CTA, logo, ES, CTA canal | CRITICAL | Pre-entrega |
| SD-16 | Export dimensiones | = CP-FM02 | 1080×1080 / 1080×1350 / 1080×1920 según formato | CRITICAL | Paso 6 |
| SD-17 | Figma link entregado | URL + node | Link frame final a Phil | CRITICAL | Entrega |
| SD-18 | Assets referenciados | rutas | JPG/PNG Gemini listados en log o frame notes | HIGH | Entrega |
| SD-19 | Solo-Gemini excepción | si aplica | Phil pidió “rápido sin Figma” — aviso pulir en Figma antes de publicar | HIGH | — |
| SD-20 | No publicar | pendiente | Igual CP-D02 — OK Phil antes de publicar | CRITICAL | — |

#### Anti-slop social (transversal)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| SD-X01 | Figma fuente de verdad | 1 | Composición final en Figma, no solo JPG Gemini | CRITICAL | Pasos 1–5 |
| SD-X02 | Stats en Figma | 0 en Gemini | Números/78%/CTA copy solo en capas Figma | CRITICAL | Paso 5 |
| SD-X03 | Híbrido correcto | Figma+Gemini | Gemini = mood/asset; estructura en Figma | HIGH | Pasos 2–5 |

#### Comandos rápidos

```bash
EXPORT="path/to/export.png"

# SD-16 dimensiones
sips -g pixelWidth -g pixelHeight "$EXPORT"

# Verificar file Figma (manual)
# https://www.figma.com/design/59V65PuX0A872JOibvhh11/Posts
```

#### Gate final social

**Entregar frame/export solo si:** Gate 0 `social_design` + **SD-P01** + **todos CRITICAL ✅** + **≥95% HIGH ✅**.

Encadena con **`content_production` Gate 1+** para paquete completo a Phil.

---

### `one_call_website` — Gate 1+ ✅

Proyecto: `/Volumes/mac externo/Mac Externo/projects/<slug>/` (Next.js).  
Registrar en `data/pipeline-runs/<slug>-next-validation.md`.

**Sub-pipelines si aplican:** `reference_ui_copy` (capturas) · `image_generation` · `image_cutout`

#### Salida ① — Brief

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| W-B01 | Campos brief | ≥5/6 | industria, nombre, tono, mercado, CTA, secciones | HIGH | ① |
| W-B02 | Tipo sistema | Next.js | Confirmado: app/sistema/dashboard — **no** landing Astro | CRITICAL | Re-elegir pipeline |
| W-B03 | Secciones must-have | ≥4 | Lista explícita (servicios, contacto, etc.) | HIGH | ① |

#### Salida ② — Brand + tipografía

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| W-T01 | Brand kit documentado | 5 campos | nombre, tagline, paleta, tipografías, vibe en log | HIGH | ② |
| W-T02 | Par display + body | 2 familias | `next/font` en `layout.tsx` — máx. 2 | CRITICAL | ② |
| W-T03 | Sin defaults ciegos | 0 hits | `grep -riE 'Geist|Inter|Roboto|Arial' src/` sin justificación | CRITICAL | ② |
| W-T04 | Tokens CSS | ≥4 colores | Variables en `globals.css` | HIGH | ② |
| W-T05 | web-typography / ui-ux | consultado | Mención en log o doc | HIGH | ② |
| W-T06 | Stats sin display font | 0 | `.stat-value` o body + `tabular-nums` en métricas | HIGH | ②⑤ |
| W-T07 | Escalas tipográficas | mínimos | body ≥16px; H1 mobile `leading-[1.08]`+ | HIGH | ②⑤ |

#### Salida ③ — Scaffold Next.js

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| W-S01 | Stack Next | dep `next` | `package.json` | CRITICAL | ③ |
| W-S02 | App Router | `src/app` | Estructura App Router | CRITICAL | ③ |
| W-S03 | Tailwind | configurado | tailwind en proyecto | HIGH | ③ |
| W-S04 | Framer Motion | dep | `framer-motion` instalado | HIGH | ③ |
| W-S05 | Lucide | dep | `lucide-react` instalado | HIGH | ③ |
| W-S06 | Estructura dirs | 3 paths | `public/images`, `src/components`, `src/lib` | HIGH | ③ |
| W-S07 | motion.ts + Reveal | 2 files | `src/lib/motion.ts`, `src/components/Reveal.tsx` | HIGH | ⑤ |

#### Salida ④ — Imágenes Gemini

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| W-G01 | Set mínimo | ≥6 JPG | `public/images/*.jpg` count | CRITICAL | ④ |
| W-G02 | hero.jpg | 1 | Archivo existe 16:9 | CRITICAL | ④ |
| W-G03 | service images | ≥3 | `service-*.jpg` o equivalente | HIGH | ④ |
| W-G04 | Tool Gemini | gate IG | Gate 1+ `image_generation` ✅ por asset | CRITICAL | ④ |
| W-G05 | Sin placeholder | 0 | No picsum/placeholder en `src/` | CRITICAL | ④ |
| W-G06 | Prompt compliance | no text/logo | Cada prompt documentado | HIGH | ④ |

#### Salida ⑤ — Build (componentes)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| W-C01 | Secciones core | ≥6/10 | Navbar, Hero, Services, Stats, Testimonials, Footer mínimo | CRITICAL | ⑤ |
| W-C02 | Sin placeholder copy | 0 | No lorem/TODO/TBD en componentes | CRITICAL | ⑤ |
| W-C03 | Animaciones | ≥3 tipos | scroll reveal, hover, carousel/counter, etc. | HIGH | ⑤ |
| W-C04 | metadataBase | presente | `layout.tsx` metadataBase configurado | HIGH | ⑤ |
| W-C05 | reference_ui_copy | si capturas | `design-patterns-*.md` + fidelidad documentada | CRITICAL | ②⑤ |
| W-C06 | Un H1 | 1 | Single h1 en page principal | HIGH | ⑤ |

#### Salida ⑤.5 — Validación UX

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| W-V01 | Build limpio | exit 0 | `bun run build` | CRITICAL | ⑤ |
| W-V02 | Screenshots | 2 | `*-390.png` y `*-1440.png` en pipeline-runs | CRITICAL | ⑤.5 |
| W-V03 | Sin scroll horizontal | true @390 | CDP o inspección | HIGH | ⑤ |
| W-V04 | Hero mobile above fold | visual OK | Imagen/bloque hero en primer viewport 390px | CRITICAL | ⑤ |
| W-V05 | Fuentes cargadas | ≠ Arial | DevTools fontFamily en hero | HIGH | ⑤.5 |
| W-V06 | H1 line-height | ≥1.08 mobile | computed style | HIGH | ⑤ |
| W-V07 | Touch CTA | ≥44px | bounding box CTA principal móvil | MEDIUM | ⑤ |
| W-V08 | Form labels | pares id/for | grep forms | HIGH | ⑤ |
| W-V09 | prefers-reduced-motion | presente | `globals.css` | HIGH | ⑤ |
| W-V10 | Contraste | ≥4.5:1 | CTA/texto principal | MEDIUM | ⑤ |
| W-V11 | Alt en imágenes | significativas | img con alt no vacío | HIGH | ⑤ |
| W-V12 | Nav mobile | funciona | hamburger abre/cierra (browser QA) | HIGH | ⑤.5 |
| W-V13 | ui-ux-pro-max | leído | Mención en VALIDATION log | HIGH | ⑤.5 |

#### Salida ⑥ — Deploy

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| W-D01 | Deploy Vercel | URL 200 | `vercel deploy` + curl HTTP 200 | CRITICAL | ⑥ |
| W-D02 | Preview vs prod | condicional | `--prod` solo si Phil pidió producción | CRITICAL | ⑥ |
| W-D03 | Git commit | 1 | Repo inicializado + commit antes deploy | HIGH | ⑥ |
| W-D04 | Gate UX previo | W-V01+V-V02 | No deploy sin ⑤.5 | CRITICAL | ⑤.5 |

#### Salida ⑦ — Entrega

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| W-E01 | Paquete Phil | 5 ítems | URL live, ruta local, marca, secciones, nota demo | CRITICAL | ⑦ |
| W-E02 | Tipografías reportadas | par + razón | Mensaje a Phil | HIGH | ⑦ |
| W-E03 | Historial skill | fila | Tabla § Historial en `one_call_website/SKILL.md` | HIGH | ⑦ |
| W-E04 | Disclaimer demo | si ficticio | Footer o nota “demo ficticia” | HIGH | ⑦ |

#### Anti-slop Next (transversal)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| W-X01 | No purple gradient slop | visual | Inspección — personalidad de marca | HIGH | ②⑤ |
| W-X02 | No Syne en stats | W-T06 | Números no encimados | CRITICAL | ②⑤ |
| W-X03 | website-feedback-log | leído | Al inicio sesión | HIGH | ⓪ |
| W-X04 | Deploy post UX | W-D04 | Orden fases respetado | CRITICAL | ⑤.5⑥ |

#### Comandos rápidos

```bash
SLUG=<slug>
PROJ="/Volumes/mac externo/Mac Externo/projects/$SLUG"

# W-G01 imágenes
ls "$PROJ/public/images/"*.jpg 2>/dev/null | wc -l

# W-T03 fonts prohibidas
grep -riE 'Geist|Inter|Roboto' "$PROJ/src" && echo FAIL || echo OK

# W-V01 build
cd "$PROJ" && bun run build
```

#### Gate final Next.js

**Entregar a Phil solo si:** Gate 0 completo + **todos CRITICAL ✅** + **≥95% HIGH ✅** + **W-D04** (UX antes de deploy).

---

### `reference_ui_copy` — Gate 1+ ✅

Sub-pipeline cuando Phil manda **capturas / pins / Behance** y pide UI **replicada** (no solo inspirada).  
Registrar en `data/pipeline-runs/<slug>-reference-validation.md`.

**Encadena con:** `one_call_landing` o `one_call_website` — Gate 1+ del stack padre también ✅ antes de entregar.

#### Salida ① — Referencia recibida

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| R-R01 | Capturas o links | ≥1 | Archivos en disco o URLs en log | CRITICAL | ① |
| R-R02 | Viewports ref | desktop + mobile | Ambos si existen en fuente; si no, documentar gap | HIGH | ① |
| R-R03 | screenshot-analyzer | si capturas | Skill usado — features listadas en log o doc | HIGH | ② |
| R-R04 | Fuente identificada | 1 | Pinterest / Dribbble / Behance / Figma + link | HIGH | ① |

#### Salida ② — Análisis por secciones

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| R-A01 | Bloques analizados | ≥6/8 | Navbar, hero, grids, typo, color, imágenes, detalles, interacción | CRITICAL | ② |
| R-A02 | Hero layout tipado | explícito | bento / full bleed / split / asimétrico — en doc | CRITICAL | ② |
| R-A03 | Tokens hex | ≥4 | Colores por superficie anotados | HIGH | ② |
| R-A04 | Tipografía ref | documentada | Serif/sans, tamaños, MAYÚSCULAS en labels | HIGH | ② |
| R-A05 | Imágenes ref | contadas | Cuántas únicas exige la referencia | HIGH | ② |

#### Salida ③ — Doc patrones

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| R-D01 | Archivo patrones | 1 | `agent/context/design-patterns-<slug>-*.md` | CRITICAL | ③ |
| R-D02 | Antes de código | mtime | doc mtime < `package.json` del proyecto | CRITICAL | ③ |
| R-D03 | ASCII layout | presente | Secciones con layout descrito | HIGH | ③ |
| R-D04 | DO / DON'T | ≥3 each | Anti-patrones del skill incluidos | HIGH | ③ |
| R-D05 | Checklist pre-deploy | presente | Checklist fidelidad en doc | HIGH | ③ |
| R-D06 | Stack elegido | documentado | Astro landing vs Next sistema — `website-stack-rules` | CRITICAL | ③ |

#### Salida ④ — Imágenes únicas

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| R-I01 | Una por slot | 100% | Cada card/slot distinto JPG en `public/images/` | CRITICAL | ④ |
| R-I02 | Sin reciclaje | 0 dupes | Mismo archivo no referenciado en ≥2 cards | CRITICAL | ④ |
| R-I03 | Gemini gate | por asset | Gate 1+ `image_generation` ✅ | CRITICAL | ④ |
| R-I04 | Fondo pastel | si ref | Prompt incluye pastel cuando referencia lo tiene | HIGH | ④ |
| R-I05 | Nombres descriptivos | convención | `svc-*.jpg`, `hero-*.jpg` — no `image1.jpg` | HIGH | ④ |

#### Salida ⑤ — Build fiel

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| R-B01 | Layout vs ref | match | Hero tipo = doc (ej. bento blanco ≠ oscuro full-width) | CRITICAL | ⑤ |
| R-B02 | Navbar fiel | 1 menú | No doble hamburger / doble pill Menu | CRITICAL | ⑤ |
| R-B03 | SketchUnderline | contrato | Si ref: children wrapper, trazo tercio inferior, no cruza letras | CRITICAL | ⑤ |
| R-B04 | Grids explícitos | spans | Columnas/spans del doc implementados | HIGH | ⑤ |
| R-B05 | Tipografía ref | par elegido | Después de ver referencia — no Geist/Inter default | CRITICAL | ⑤ |
| R-B06 | Build padre | exit 0 | `bun run build` Astro o Next | CRITICAL | ⑤ |
| R-B07 | Secciones ref | ≥90% | Secciones del doc Behance/ref presentes en código | HIGH | ⑤ |

#### Salida ⑥ — Validar vs capturas Phil

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| R-V01 | Screenshots QA | 2 | 390px + 1440px guardados | CRITICAL | ⑥ |
| R-V02 | Comparación sección | checklist | Tabla sección × ✅/❌ vs capturas Phil | CRITICAL | ⑥ |
| R-V03 | Capturas archivadas | rutas | Paths refs Phil en validation log | HIGH | ⑥ |
| R-V04 | Sketch zoom | si aplica | Screenshot zoom H1 + underline | CRITICAL | ⑥ |
| R-V05 | ui-ux-pro-max | pre-deploy | Checklist UX si deploy | HIGH | ⑥ |
| R-V06 | Checklist doc patrones | 100% | Items pre-deploy del doc marcados | HIGH | ⑥ |

#### Salida ⑦ — Entrega

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| R-E01 | URL o localhost | 200 | Live URL o dev server reportado | CRITICAL | ⑦ |
| R-E02 | Doc patrones link | path | Ruta `design-patterns-*.md` a Phil | CRITICAL | ⑦ |
| R-E03 | Informe fidelidad | 1 | Qué se replicó + diferencias restantes | HIGH | ⑦ |
| R-E04 | Historial skill | fila | Tabla § Historial `reference_ui_copy/SKILL.md` | HIGH | ⑦ |
| R-E05 | Gate padre | L o W | `one_call_landing` o `one_call_website` Gate 1+ ✅ | CRITICAL | ⑦ |

#### Anti-patrones referencia (transversal)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| R-X01 | No reinterpretar | fidelidad | Layout doc = capturas, no “inspirado” | CRITICAL | ②⑤⑥ |
| R-X02 | No CSS sketch fake | 0 | Underline sketch = componente SketchUnderline, no border-bottom | CRITICAL | ⑤ |
| R-X03 | No entregar sin comparar | R-V02 | Comparación explícita antes de URL | CRITICAL | ⑥⑦ |
| R-X04 | website-feedback-log | leído | Al inicio | HIGH | ⓪ |

#### Comandos rápidos

```bash
SLUG=<slug>
DOC=$(ls agent/context/design-patterns-${SLUG}*.md 2>/dev/null | head -1)
PROJ="/Volumes/mac externo/Mac Externo/projects/$SLUG"

# R-D02 doc antes de código
test -f "$DOC" && test "$(stat -f '%m' "$DOC")" -lt "$(stat -f '%m' "$PROJ/package.json")" && echo OK

# R-I02 imágenes únicas (mismo basename en src)
# revisar manualmente refs en componentes
```

#### Gate final referencia

**Entregar solo si:** Gate 0 `reference_ui_copy` + **todos CRITICAL ✅** + **≥95% HIGH ✅** + **Gate 1+ padre (landing/next) ✅**.

---

### `website_audit` — Gate 1+ ✅

Registrar en `data/pipeline-runs/<dominio-slug>-audit-validation.md` (ej. `archi-panaderia-audit-validation.md`).

#### Salida ① — Contexto

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| UA-C01 | URL documentada | 1 | Dominio completo en informe | CRITICAL | ① |
| UA-C02 | Industria | 1 | Tipo negocio (retail, clínica…) | HIGH | ① |
| UA-C03 | Objetivo auditoría | 1 | Comercial / bugs / pre-landing | HIGH | ① |

#### Salida ② — Cursor Browser (capa A — obligatoria)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| UA-B01 | browser_navigate | OK | URL cargada sin error bloqueante | CRITICAL | ② |
| UA-B02 | Screenshot hero desktop | 1 | Archivo en log o adjunto | CRITICAL | ② |
| UA-B03 | Screenshot sección clave | ≥1 | Producto/servicio/menú | HIGH | ② |
| UA-B04 | Screenshot footer | 1 | Footer visible | HIGH | ② |
| UA-B05 | Screenshot móvil 390px | 1 | Viewport ~390px | CRITICAL | ② |
| UA-B06 | Snapshot interactivos | 1 | Lista links/botones del snapshot | HIGH | ② |

#### Salida ③ — Pruebas CTAs

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| UA-T01 | CTA principal probado | resultado | Navega / `#` / roto — documentado | CRITICAL | ③ |
| UA-T02 | WhatsApp/tel | si visible | `wa.me` / `tel:` correctos o anotado roto | HIGH | ③ |
| UA-T03 | Formulario contacto | si existe | POST real vs `#` | HIGH | ③ |
| UA-T04 | Menú mobile | si aplica | Abre/cierra o anotado | HIGH | ③ |
| UA-T05 | Tabla funcional | ≥3 filas | Pruebas en informe § qué funciona | CRITICAL | ③ |

#### Salida ④ — Terminal / HTML

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| UA-H01 | curl headers | ejecutado | Status code + notas | HIGH | ④ |
| UA-H02 | Peso HTML | bytes | `wc -c` documentado | MEDIUM | ④ |
| UA-H03 | Enlaces `#` | conteo | `href="#"` count en informe | HIGH | ④ |
| UA-H04 | Placeholders dev | 0 ideal | Patrones `((var))` anotados si hay | HIGH | ④ |

#### Salida ⑤ — Browser Use (opcional)

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| UA-U01 | Documentado | N/A o sí | Si se usó B: script/log; si no: “solo capa A” | HIGH | ⑤ |
| UA-U02 | No solo curl | capa A | Informe con screenshots Browser MCP | CRITICAL | ② |

#### Salida ⑥ — Informe

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| UA-R01 | Secciones informe | 7/7 | Resumen, funciona/no, diseño, técnico, por qué cambiar, recomendaciones, oportunidad Wavys | CRITICAL | ⑥ |
| UA-R02 | Español | 100% | Informe en español | CRITICAL | ⑥ |
| UA-R03 | Screenshots incluidos | ≥3 | Referencias a capturas en informe | CRITICAL | ⑥ |
| UA-R04 | Oportunidad Wavys | 1 párrafo | Presencia Digital / landing / propuesta | CRITICAL | ⑥ |
| UA-R05 | Priorización | quick vs rediseño | Recomendaciones tiered | HIGH | ⑥ |

#### Salida ⑦ — Persistencia

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| UA-P01 | log_business_note | si prospecto | Entrada en `data/notes.json` tag `website-audit` | HIGH | ⑦ |
| UA-P02 | Sin enviar propuesta | implícito | Auditoría ≠ propuesta sin OK Phil | CRITICAL | — |

#### Anti-patrones auditoría

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| UA-X01 | No solo curl | UA-U02 | Browser MCP usado | CRITICAL | ② |
| UA-X02 | Móvil retail | UA-B05 | 390px en retail/restaurante | CRITICAL | ② |
| UA-X03 | CTAs no probados | UA-T01 | CTA principal testeado | CRITICAL | ③ |

#### Gate final auditoría

**Entregar informe solo si:** Gate 0 + **todos CRITICAL ✅** + **≥95% HIGH ✅**.

---

### `presencia_brief` — Gate 1+ ✅

Registrar en `data/pipeline-runs/<variant>-brief-validation.md` (ej. `presencia-digital-brief-validation.md`).

#### Salida — Storytelling + HTML + PDF

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| PB-01 | STORYTELLING-GUIA leída | 1 | Mención en log | HIGH | Pre |
| PB-02 | Plantilla correcta | match | digital / tienda / catálogo según cliente | CRITICAL | Build |
| PB-03 | Cover sin precio | 0 S/ | grep HTML cover — sin S/149/S/229 en portada | CRITICAL | HTML |
| PB-04 | Arco 5 actos | cap 01–07 | Capítulos presentes en HTML | CRITICAL | HTML |
| PB-05 | Story box cap 1 | presente | Capítulo 01 con story box | CRITICAL | HTML |
| PB-06 | Quote memorable | presente | Quote-box en cap 1 o 2 | HIGH | HTML |
| PB-07 | Includes grid | 6 ítems | Grid 6 includes cap 2 | HIGH | HTML |
| PB-08 | Suscripción antes precio | orden | Cap 03 suscripción antes cap 06 inversión | CRITICAL | HTML |
| PB-09 | Precio solo cap 06 | 1 bloque | S/ solo en «Inversión» | CRITICAL | HTML |
| PB-10 | Precios oficiales | match campaña | S/149 · S/189 · S/199 o S/229 tienda — `campaigns/presencia-digital.md` | CRITICAL | HTML |
| PB-11 | FAQ cap 07 | presente | Sección FAQ | HIGH | HTML |
| PB-12 | CTA suave final | texto | “5 minutos — sin compromiso” o equivalente | HIGH | HTML |
| PB-13 | Tono Perú tú | revisión | Español PE consultivo | HIGH | Copy |
| PB-14 | PDF regenerado | mtime | `bun run generate-pdf.ts` post-cambios | CRITICAL | Export |
| PB-15 | Imágenes slides | refs | cover-story, slide-02, slide-05 si aplica | HIGH | HTML |
| PB-16 | Cutout gate | si flotante | Gate 1+ `image_cutout` ✅ | CRITICAL | Assets |
| PB-17 | Markdown sync | si editó MD | `BRIEF-*-CLIENTE.md` alineado con HTML | HIGH | Copy |

#### Gate final brief

**Entregar PDF solo si:** Gate 0 + **todos CRITICAL ✅** + **≥95% HIGH ✅** + **PB-14** PDF nuevo.

---

### `sales_pipeline` — Gate 1+ ✅

Registrar en `data/pipeline-runs/<lead-slug>-sales-validation.md` (ej. `onza-partner-sales-validation.md`).

#### Salida — Lead → propuesta → seguimiento

| ID | Criterio | Umbral | Cómo medir | Tier | Si falla → |
|----|----------|--------|------------|------|------------|
| SP-01 | Clasificación lead | 1 tipo | partner / SaaS / caliente documentado | CRITICAL | ① |
| SP-02 | Oferta alineada | match | Partner→colaboración; SaaS→Quoter/ReActiva; no genérico | CRITICAL | ② |
| SP-03 | log_business_note | 1 | Entrada en notes con tags | CRITICAL | ② |
| SP-04 | Borrador completo | 4 campos | Para, Asunto, Cuerpo, From configurado mostrado a Phil | CRITICAL | ③ |
| SP-05 | OK Phil email | explícito | “envía” / “manda” antes de `send_email` | CRITICAL | ④ |
| SP-06 | From oficial | config | `contact@wavys-technologies.com` — regla email-sending | CRITICAL | ④ |
| SP-07 | send_email exitoso | id Resend | JSON tool con id | CRITICAL | ⑤ |
| SP-08 | Reporte post-envío | 3 datos | id Resend, destinatario, From real | CRITICAL | ⑤ |
| SP-09 | create_reminder | 48h o 5d | Recordatorio seguimiento creado | HIGH | ⑥ |
| SP-10 | Propuesta <24h | si caliente | Timestamp pedido vs envío | HIGH | ③ |
| SP-11 | No integraciones falsas | 0 claims | No prometer stack no confirmado | CRITICAL | ② |
| SP-12 | Resend fail stop | si 403/422 | Parar + avisar Phil — no otro dominio | CRITICAL | ④ |

#### Gate final ventas

**Enviar correo solo si:** Gate 0 + **SP-05 OK Phil** + **todos CRITICAL ✅**.

**Prohibido:** enviar sin borrador mostrado; workaround silencioso de dominio.

---

## Gate 1+ — índice completo

| Pipeline | Estado | Log |
|----------|--------|-----|
| `one_call_landing` | ✅ | `<slug>-validation.md` |
| `one_call_website` | ✅ | `<slug>-next-validation.md` |
| `reference_ui_copy` | ✅ | `<slug>-reference-validation.md` |
| `video_production` | ✅ | `<slug>-video-validation.md` |
| `content_production` | ✅ | `<slug>-content-validation.md` |
| `social_design` | ✅ | `<slug>-social-validation.md` |
| `image_generation` | ✅ | `<asset-id>-image-validation.md` |
| `image_cutout` | ✅ | (misma plantilla imagen) |
| `website_audit` | ✅ | `<dominio>-audit-validation.md` |
| `presencia_brief` | ✅ | `<variant>-brief-validation.md` |
| `sales_pipeline` | ✅ | `<lead>-sales-validation.md` |

---

## Tool automática — `validate_pipeline`

Después de completar Gate 0 y los checks manuales que aplique, ejecutar:

```bash
cd "/Volumes/mac externo/Mac Externo/projects/wavys-agents"
npm run tool -- validate_pipeline '{
  "pipeline": "one_call_landing",
  "slug": "<slug>",
  "runBuild": false
}'
```

- Escribe reporte en `data/pipeline-runs/<slug>-*-validation.md`
- Retorna `authorized: true` solo si **CRITICAL 100%** + **HIGH ≥95%** (checks automáticos)
- Checks browser/visual quedan en `manualRemaining`
- Docs: `agent/connections/pipeline-validation.md`

---

## Referencias

- Índice skills: `agent/context/README.md`
- Stack websites: `agent/context/website-stack-rules.md`
- Instrucciones agente: `agent/instructions.md`
