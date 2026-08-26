# Step compliance — jlh-flujo-producto

Pipeline: `video_production`  
Fecha inicio: 2026-07-15  
Formato: explainer interno 16:9 (capacitación comercial JLH)

| Fase | Estado | Evidencia |
|------|--------|-----------|
| ① RESEARCH | ✅ | `videos/jlh-flujo-producto/RESEARCH.md` |
| ② SCRIPT | ✅ | `SCRIPT.md` |
| ③a STORYBOARD | ✅ | `STORYBOARD.md` (8 frames + blueprints) |
| ③b ASSETS | ✅ | Gemini `generate_image` ×8 → `assets/gen/*.jpg` |
| ④ Frames HF | ✅ | `compositions/frames/01–08.html` + `index.html` |
| ⑤ VALIDATION | 🟡 borrador | `VALIDATION.md` — falta lint + preview Phil |
| Render | ❌ | Solo post-OK revisión |

## Nota corrección

Primera intento usó Cursor `GenerateImage` (incorrecto). Corregido a tool Wavys:
`npm run tool -- generate_image` · modelo `gemini-3.1-flash-lite-image`.
