# Página 08 · de dónde salió cada número

Nada de esta página se inventó. Todo se capturó de la lista pública de
Artificial Analysis con Chromium headless el **21 de agosto de 2026**
(`capturedAt: 2026-08-22T03:31:56Z` UTC, que en Lima es el 21 a las 22:31).

Script: `radar-n2/scripts/capture-aa-charts.mjs`

## Capturas

| Archivo | Qué es | URL |
|---|---|---|
| `aa-leaderboard.png` | Tabla del LLM Leaderboard, recortada al bloque de la tabla | https://artificialanalysis.ai/leaderboards/models |
| `aa-leaderboard-raw.png` | La misma tabla, sin recortar (respaldo) | idem |
| `aa-intelligence-bars.png` | Bloque *Highlights*: Intelligence · Speed · Cost per Task | https://artificialanalysis.ai/models |
| `aa-output-speed.png` | Gráfico *Output Speed* (tokens por segundo) | idem |
| `aa-intelligence-vs-cost.png` | Dispersión inteligencia vs costo (no se usó en la página) | idem |
| `aa-price.png` | Gráfico de precio (no se usó en la página) | idem |
| `leaderboard.json` | Volcado de la tabla en texto, con `url` y `capturedAt` | idem |

Las tres capturas que entran a la página se recortan **por CSS**
(`overflow: hidden` + offset del `<img>`), nunca reescribiendo el archivo. El
PNG que está en el repo es el que salió del navegador.

## Tabla tipografiada de la página

La tabla de la página 08 es la misma data de `leaderboard.json`, compuesta con
la tipografía del número. Regla: **una fila por casa, la mejor variante**. Los
números van tal cual, con coma decimal a la peruana en la columna de segundos.

| # | Modelo | Casa | Índice | US$/tarea | Tokens/s | Primer trozo (s) |
|---|---|---|---|---|---|---|
| 01 | Claude Opus 5 (max) | Anthropic | 63 | $2.34 | 61 | 42,96 |
| 02 | Claude Fable 5 (with fallback) | Anthropic | 62 | $3.14 | 71 | 122,03 |
| 03 | GPT-5.6 Sol (max) | OpenAI | 61 | $1.23 | 73 | 105,75 |
| 04 | Grok 4.6 (high) | SpaceXAI | 61 | $0.84 | 70 | 51,53 |
| 05 | GLM-5.3 (max) | Z AI | 60 | $0.68 | 95 | 1,89 |
| 06 | Qwen3.8 Max | Alibaba | 58 | $1.13 | 45 | 2,57 |
| 07 | Gemini 3.7 Flash (high) | Google | 56 | $0.40 | 399 | 15,42 |

La barra de la última columna mide el **primer trozo**, no el puesto: escala
lineal sobre el máximo de la tabla (122,03 s de Claude Fable 5).

## Exclusiones

- **Kimi K3 (max)** aparece en la lista de Artificial Analysis pero no entra al
  Radar, igual que en el N°1. Se recortó también del gráfico de *Output Speed*
  (el corte por CSS termina antes de su barra).
- Las variantes repetidas de una misma casa (Claude Opus 5 xhigh / high, etc.)
  se dejan fuera de la tabla tipografiada para que cada fila sea una casa. En la
  captura real sí se ven, y eso está bien: es la prueba de la fuente.

## Lo que es lectura y no dato

El bloque **"Lo que leo yo"** está rotulado como línea de Wavys, no como parte
del benchmark. Los dos números que cita (42,96 s de Claude Opus 5 y 1,89 s de
GLM-5.3) sí salen de la tabla capturada. El índice de inteligencia es de
terceros y la página lo dice al pie: *"Índice de terceros. No es de Wavys."*
