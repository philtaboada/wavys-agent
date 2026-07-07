# Subagentes en pipelines Wavys

**Objetivo:** separar **maker** (hace el trabajo) de **checker** (verifica sin haberlo escrito). Complementa `validate_pipeline` y Browser MCP — no los reemplaza.

**Cómo invocar:** Cursor `Task` tool con el `subagent_type` indicado. Lanzar en **paralelo** cuando la fase no depende del resultado inmediato del padre.

---

## Reglas

| Regla | Detalle |
|-------|---------|
| Checker **una vez por fase** | No en cada micro-edito (costo compuesto) |
| Tras **3 loops** fallidos | Lanzar `bugbot` readonly sobre el diff y reportar a Phil |
| `validate_pipeline` siempre al final | Gate duro automático — checker LLM no sustituye CRITICAL |
| **Prohibido** subagente | `send_email`, deploy, publicar, cambiar precios del brief |
| Registrar en log | Tabla `## Subagentes` en `data/pipeline-runs/<slug>-step-compliance.md` |

```markdown
## Subagentes
| Fase | Tipo | Rol | Resultado |
|------|------|-----|-----------|
| ② | explore | research refs | 3 URLs + tabla patrones |
| ⑧ | bugbot | review código | lista FAIL + IDs gate |
```

---

## Índice por pipeline

| Pipeline | Fase | Subagente | Rol |
|----------|------|-----------|-----|
| `one_call_landing` | ② | `explore` | Investigación visual (3+ refs) |
| `one_call_landing` | ⑧ | `bugbot` + `shell` | Review código + `validate_pipeline` |
| `one_call_website` | ⑤.5 | `bugbot` + `shell` | Igual landing (Next.js) |
| `reference_ui_copy` | ② | `explore` | Análisis secciones desde capturas |
| `reference_ui_copy` | ⑥ | `bugbot` | Comparar build vs capturas Phil |
| `video_production` | ① | `explore` | RESEARCH profundo (8+ búsquedas) |
| `video_production` | ⑤ | `shell` + `bugbot` | hyperframes + review frames vs STORYBOARD |
| `content_production` | ① | `explore` | Tendencias + fuentes |
| `content_production` | ④ | `generalPurpose` | Review copy (filtro Wavys, anti-slop) |
| `website_audit` | ② | `explore` + Browser | Capturas + checklist CTAs |
| `website_audit` | ⑥ | `generalPurpose` | Informe desde capturas (checker) |
| `presencia_brief` | pre-entrega | `shell` | `validate_pipeline` presencia_brief |
| `sales_pipeline` | ③ | `generalPurpose` | Borrador propuesta (solo redactar) |

**Sin subagente:** `image_generation`, `image_cutout` (solo tools + gates).

---

## Prompts copy-paste

### `explore` — landing ② (investigación visual)

```
Repo: /Volumes/mac externo/Mac Externo/projects/wavys-agents
Pipeline: one_call_landing · Fase ②
Industria: <industria> · Slug: <slug> · Proyecto anterior en batch: <slug-anterior o "ninguno">

Busca 3+ referencias visuales reales (Pinterest, createtoday, Dribbble, Behance, sitios live).
Devuelve SOLO:
1. Tabla: URL | hero (claro/oscuro) | grid tipo | motion | tipografía mood
2. Tabla diferenciación vs proyecto anterior (mín. 4 filas — este proyecto DEBE diferir)
3. 4 respuestas: hero claro/oscuro, grid, motion, tipografía
4. Lista DON'T (anti-slop de website-feedback-log si aplica)

No codear. No crear archivos. Readonly.
```

### `explore` — video ① (RESEARCH)

```
Repo: wavys-stories/videos/<slug>/
Pipeline: video_production · Fase ①
Brief: <pegar brief Phil>
Duración/formato: <Xs · 9:16|16:9>

Investigación profunda — mínimo 8 búsquedas distintas, 10+ URLs citables.
Ejes: <listar 4-6 ejes del brief>
Devuelve borrador RESEARCH.md con: Hallazgos, Ángulo narrativo, Descartado (≥1), checklist 6/6.
Cada cifra con fuente URL. Prohibido inventar datos. Readonly — no escribir archivo; el padre guarda.
```

### `explore` — reference_ui_copy ②

```
Pipeline: reference_ui_copy · Fase ②
Capturas: <rutas o URLs Phil>
Stack destino: Astro landing | Next.js

Por cada captura, checklist: navbar, hero layout, grids, tipografía, colores hex, imágenes únicas, detalles (sketch underline, footer), interacción.
Devuelve tabla sección × observación + tokens hex (≥4) + hero layout tipado (bento/full bleed/split).
Readonly.
```

### `explore` — content ①

```
Pipeline: content_production · Fase ①
Tema: <tema>

WebSearch: tendencias + ángulo tech/software. Mínimo 2 queries distintas.
Devuelve: 3-5 bullets "qué pasa", 2-3 ángulos, fuentes URL por claim.
Readonly.
```

### `explore` — website_audit ②

```
URL: <url> · Industria: <industria>
Pipeline: website_audit · Fase ②

Usar Browser MCP: navigate, screenshots hero desktop, sección clave, footer, móvil 390px.
Probar CTA principal, WhatsApp/tel si visible. Listar links del snapshot.
Devuelve: rutas capturas + tabla pruebas CTA + problemas visibles móvil.
```

### `bugbot` — landing / next ⑧ / ⑤.5

```
Task description: Bugbot
Full Repository Path: /Volumes/mac externo/Mac Externo/projects/<slug>
Diff: branch changes
Change Description:
- Landing Astro (o Next.js) para <cliente>
Custom Instructions:
Revisar vs agent/context/design-patterns-<slug>.md y website-feedback-log.md.
Reportar FAIL contra IDs: L-T02/L-C03/L-G03 (landing) o W-T03/W-C02 (next).
Buscar: fonts prohibidas, placeholders, 3 cards blancas idénticas, sketch underline mal.
No auto-aprobar. Formato: ID | FAIL/PASS | evidencia.
readonly: true
```

### `bugbot` — reference_ui_copy ⑥

```
Task description: Bugbot
Full Repository Path: /Volumes/mac externo/Mac Externo/projects/<slug>
Diff: branch changes
Custom Instructions:
Comparar implementación vs capturas Phil en <rutas refs> y design-patterns doc.
Tabla sección × ✅/❌ (R-V02). CRITICAL: navbar doble, sketch fake CSS, imágenes recicladas.
readonly: true
```

### `bugbot` — video ⑤

```
Task description: Bugbot
Full Repository Path: /Volumes/mac externo/Mac Externo/projects/wavys-stories/videos/<slug>
Diff: uncommitted changes
Custom Instructions:
Comparar compositions/frames/*.html vs STORYBOARD.md (blueprint id, shot sequences, signature moves).
Reportar frames sin blueprint, template genérico BinanceLayer, front-load t=0.
Citar archivos y líneas. readonly: true
```

### `shell` — validate + build

```
Ejecutar en orden (parar si falla):
cd "/Volumes/mac externo/Mac Externo/projects/<slug>" && bun run build
cd "/Volumes/mac externo/Mac Externo/projects/wavys-agents" && npm run tool -- validate_pipeline '{"pipeline":"one_call_landing","slug":"<slug>","runBuild":false}'

Para video:
cd "/Volumes/mac externo/Mac Externo/projects/wavys-stories/videos/<slug>"
npx hyperframes lint && npx hyperframes validate && npx hyperframes inspect

Pegar salida JSON validate_pipeline y exit codes.
```

### `generalPurpose` — content copy review ④

```
Archivo: data/content-drafts/<slug>-copy.md
Leer: agent/context/content-feedback-log.md, brand-channels.md

Score 1-10 (brutal) en: filtro Wavys CP-F01, CTA canal, copy asimétrico CP-C06, URLs fuentes CP-C07, anti-slop.
Si algún criterio <8: lista fix ordenada por el más débil.
No reescribir — solo diagnóstico. Readonly.
```

### `generalPurpose` — audit informe ⑥

```
Checker separado — NO navegaste el sitio.
Inputs: capturas en <rutas> + notas del agente explorador.

Redacta informe markdown § website_audit: Resumen, funciona/no, diseño, técnico, por qué cambiar, recomendaciones, oportunidad Wavys.
Español PE. Sin suavizar problemas que veas en capturas.
```

### `generalPurpose` — sales borrador ③

```
Lead: <tipo partner|SaaS|caliente> · Empresa: <nombre>
Redactar borrador email (Para, Asunto, Cuerpo). From: contact@wavys-technologies.com
NO enviar. Alinear con sales_pipeline skill. Sin prometer integraciones no confirmadas.
```

---

## Flujo maker → checker (landing ejemplo)

```
Padre: ① brief → espera explore ② → ③ doc → ④–⑦ build
       → lanza shell (build + validate_pipeline)
       → lanza bugbot (review visual/código)
       → Browser MCP (L-V04, L-V08 manual)
       → si authorized + manual OK → ⑨ entregar
```

---

## Referencias

- Gates: `agent/context/pipeline-gates.md`
- Tool verify: `agent/connections/pipeline-validation.md`
- Índice pipelines: `agent/pipelines/README.md`
