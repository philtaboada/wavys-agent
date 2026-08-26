# Flyers IG — software wow · 2026-08-03

| # | Archivo | Noticia | Cutout |
|---|---------|---------|--------|
| 01 | `flyer-01-hack-hf-1080x1350.png` | Agente OpenAI → Hugging Face | `assets/hack-lock-cutout.png` |
| 02 | `flyer-02-minimax-h3-1080x1350.png` | MiniMax H3 video 2K | `assets/video-frame-cutout.png` |
| 03 | `flyer-03-qwen-1080x1350.png` | Qwen3.8-Max (hoy) | `assets/qwen-cube-cutout.png` |
| 04 | `flyer-04-opus5-1080x1350.png` | Claude Opus 5 | `assets/opus-trophy-cutout.png` |

**Pipeline:** Gemini (fondo blanco) → cutout PNG (`make-cutouts.ts`) → HTML Agente → PNG  
**Carpeta:** `data/content-drafts/ig-software-wow-flyers-2026-08-03/`

### Caption carrusel
```
Esta semana en software:

1. Un agente de IA hackeó Hugging Face
2. MiniMax H3 — video 2K con audio nativo
3. Qwen3.8-Max — 2.4T params (hoy)
4. Claude Opus 5 — #1 en agentes y coding

El stack se mueve cada 7 días.
Si construyes producto, hay que estar al día.
```

### Regenerar
```bash
cd "data/content-drafts/ig-software-wow-flyers-2026-08-03" && bun run generate-pngs.ts
```
