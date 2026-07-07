# Pipeline validation (`validate_pipeline`)

Tool automática para **Gate 1+** de los pipelines Wavys. Complementa el protocolo en `agent/context/pipeline-gates.md`.

## Uso

```bash
cd "/Volumes/mac externo/Mac Externo/projects/wavys-agents"
npm run tool -- validate_pipeline '{
  "pipeline": "one_call_landing",
  "slug": "miga-pasteleria",
  "runBuild": false
}'
```

## Parámetros

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| `pipeline` | ✅ | Uno de los 11 pipelines registrados |
| `slug` | ✅ | Identificador del proyecto/asset/lead |
| `projectPath` | web | Override ruta proyecto (default: `/projects/<slug>`) |
| `runBuild` | — | Si `true`, ejecuta `bun run build` en el proyecto |
| `writeReport` | — | Default `true` → escribe en `data/pipeline-runs/` |
| `imagePath` / `cutoutPath` | imagen | Rutas para `image_generation` / `image_cutout` |
| `htmlPath` / `pdfPath` | brief | Rutas para `presencia_brief` |
| `copyPath` | content/social | Ruta al copy markdown |
| `reportPath` | audit | Informe de auditoría existente |
| `videoDir` | video | Carpeta en `wavys-stories/videos/<slug>` |
| `noteTag` | sales | Tag para buscar en `data/notes.json` |

## Pipelines soportados

- `one_call_landing` — Astro landing
- `one_call_website` — Next.js site
- `reference_ui_copy` — Copia UI desde referencia
- `image_generation` / `image_cutout` — Assets Gemini + cutout PNG
- `content_production` / `social_design` — Copy y posts
- `video_production` — Docs en carpeta de video
- `website_audit` — Informe markdown
- `presencia_brief` — HTML/PDF brief
- `sales_pipeline` — Notas + gate manual SP-05

## Criterio de autorización

Igual que Gate final en `pipeline-gates.md`:

- **Todos CRITICAL ✅** (checks automáticos, no manuales)
- **≥95% HIGH ✅**
- Checks `manual: true` se listan en el reporte pero no bloquean `authorized` automáticamente

## Salida

JSON con `checks[]`, `summary`, `authorized`, `manualRemaining`, `reportPath`.

Reporte markdown en `data/pipeline-runs/<slug>-<tipo>-validation.md`.

## Implementación

- `lib/pipeline-validation/` — checks por pipeline
- `agent/tools/validate_pipeline.ts` — tool registrable
