# Pipelines — índice de gates

Los procedimientos viven en `agent/skills/`. Este directorio centraliza **validación, loops y subagentes**.

| Doc | Contenido |
|-----|-----------|
| [../context/pipeline-gates.md](../context/pipeline-gates.md) | **Gate 0 + Gate 1+** — todos los pipelines ✅ |
| [subagents.md](./subagents.md) | **Maker vs checker** — qué fases usan `explore` / `bugbot` / `shell` |

## Logs de corrida

- Gate 0: `data/pipeline-runs/<slug>-step-compliance.md`
- Gate 1+: ver tabla en `pipeline-gates.md` § índice completo

Plantillas en `data/pipeline-runs/_TEMPLATE-*.md`

## Estado — Gate 1+

| Pipeline | Gate 0 | Gate 1+ |
|----------|--------|---------|
| `one_call_landing` | ✅ | ✅ |
| `one_call_website` | ✅ | ✅ |
| `reference_ui_copy` | ✅ | ✅ |
| `video_production` | ✅ | ✅ |
| `content_production` | ✅ | ✅ |
| `social_design` | ✅ | ✅ |
| `image_generation` | ✅ | ✅ |
| `image_cutout` | ✅ | ✅ |
| `website_audit` | ✅ | ✅ |
| `presencia_brief` | ✅ | ✅ |
| `sales_pipeline` | ✅ | ✅ |
