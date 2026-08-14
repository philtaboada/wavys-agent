# Gráficos de la página 08 — capturas reales

Todos son **recortes reales de Artificial Analysis**, capturados el **14 de agosto de 2026** con
Chrome headless (Playwright, viewport 1440 × 1150, `deviceScaleFactor: 2`).
No se redibujan, no se generan con IA y no se retocan: el recorte se hace por CSS en la página.

```bash
node radar-n1/scripts/capture-aa-charts.mjs             # vuelve a capturar
node radar-n1/scripts/capture-aa-charts.mjs --headings  # lista los bloques disponibles
```

| Archivo | Origen | Qué es | Uso en 08 |
|---|---|---|---|
| `aa-leaderboard.png` | `artificialanalysis.ai/leaderboards/models` | Tabla del LLM Leaderboard: cabecera + primeras filas | Colocado a ~1:1, recortado después de la columna *Latency* y **cortado antes de la fila de Kimi K3** (banned) |
| `aa-intelligence-vs-cost.png` | `artificialanalysis.ai/models` → *Intelligence Index vs. Cost per Intelligence Index Task* | Scatter con línea de Pareto y cuadrante verde | Colocado ancho completo, recortado el título para dejar leyenda, plot y ejes |
| `aa-intelligence-bars.png` | `artificialanalysis.ai/models` → *Highlights* | Fila de tres paneles: Intelligence, Speed, Cost per Task | Se coloca solo el panel **Cost per Task** (recorte lateral por CSS) |
| `aa-output-speed.png` | `artificialanalysis.ai/models` → *Output Speed* | Barras de tokens/s | Capturado como respaldo; **no** se usa en la página (08 ya lleva tres gráficos) |
| `aa-leaderboard-raw.png`, `aa-models-raw.png` | ambas URLs | Capturas de página completa | Solo referencia de contexto, no van a la revista |

## Reglas que cumple la página

- La tabla tipografiada de 08 usa el ranking bloqueado (Claude Opus 5 63 · Claude Fable 5 62 ·
  GPT-5.6 Sol 61 · Grok 4.6 61 nuevo · Qwen 3.8 Max 58 · DeepSeek V4 Flash 52). No se inventan
  posiciones ni se agregan modelos.
- **Kimi K3 no aparece**: el recorte del leaderboard corta antes de esa fila.
- **Gemini 3.7 Flash no tiene puesto en la tabla.** Aparece solo dentro de los gráficos reales de
  costo y del scatter, que es donde el propio benchmark lo pone.
- El benchmark de Artificial Analysis y la línea de Wavys van rotulados aparte: bloque
  *«Lo que leo yo — línea Wavys, no es el benchmark»* arriba, tabla *«Benchmark AA»* abajo.
- Ningún gráfico lleva tooltip abierto.
