# RADAR N°1 — escenas fotográficas

**Lock de fotos (Phil, 14 ago 2026):** toda imagen fotográfica del interior se hace con Gemini,
el mismo API de la tapa N°1.

| Parámetro | Valor usado en las 7 escenas |
|---|---|
| Modelo | `gemini-3.1-flash-lite-image` (Nano Banana Lite) — **único permitido** |
| Endpoint | `POST https://generativelanguage.googleapis.com/v1beta/interactions` |
| Header | `x-goog-api-key` |
| Body | `model` + `input` + `response_format {type:image, mime_type:image/jpeg, aspect_ratio, image_size:1K}` |
| Script | `radar-n1/scripts/gen-scenes.mjs` (manifiesto + prompts versionados) |

Prohibido y **no usado**: DALL-E, Flux, Imagine, Grok image, Midjourney, Unsplash, banco de
imágenes, `GenerateImage` de Cursor y cualquier otro modelo Gemini (Pro, Veo, flash de texto,
embeddings). Ninguna escena inventa la cara de Phil ni ninguna otra persona: **las siete son de
objetos, mostrador, papel y manos**, sin retrato. La tapa es el único retrato: cara cyborg en `img/escena-tapa.jpg`.

`image_size: 2K` devuelve `404 not_found` con este modelo; el máximo real es `1K` (~1024 px en el
lado largo). Por eso las fotos se colocan con grano de impresión (`.grain` en `css/radar.css`) y
ninguna se amplía más de ~1.7×.

Regenerar (la key sale de `GEMINI_API_KEY` o de `.env.local`, que está gitignoreado):

```bash
node radar-n1/scripts/gen-scenes.mjs             # solo lo que falta
node radar-n1/scripts/gen-scenes.mjs --force     # todo de nuevo
node radar-n1/scripts/gen-scenes.mjs escena-correo.jpg
```

## Las escenas (v2 · oficio)

Las de WhatsApp/reparto (`escena-chat-hoja`, `escena-hoja-estado`, `escena-mostrador`, `escena-cierre`)
quedan en disco como archivo. El número v2 usa las de oficio.

| Archivo | Página | Formato | Escena |
|---|---|---|---|
| `img/escena-tapa.jpg` | 01 Tapa | 3:4 | Retrato editorial LOCK. Único retrato. No regenerar. |
| `img/escena-carta.jpg` | 02 Carta | 1:1 | Escritorio de noche: carta, lapicero, cuaderno. Sin café. |
| `img/escena-correo.jpg` | 03 Señal | 4:3 | Back-office a las 8am: laptop de correo, celular, cuaderno. |
| `img/escena-bot-pega.jpg` | 04a Apertura | 3:4 | Noche: pruebas de revista, lápiz rojo, laptop con glow. |
| `img/escena-bot-dia.jpg` | 04b Relato | 16:9 | Tarde: firmas de revista, cuaderno, celular con chat. |
| `img/escena-oficio.jpg` | 04c Oficio | 4:3 | Domingo: el número impreso abierto, luz de ventana. Sin café. |
| `img/escena-pruebas.jpg` | 04e Cierre tema | 16:9 | Macro de pruebas marcadas a lápiz rojo. |
| `img/escena-browser.jpg` | 05 Más noticias | 16:9 | Laptop de noche, navegador y panel. |
| `img/escena-lunes.jpg` | 09 Contratapa | 3:4 | Lunes: escritorio ya abierto, cuaderno. Sin café. |

## Archivo (v1, no se usan en v2)

`escena-chat-hoja.jpg` · `escena-hoja-estado.jpg` · `escena-mostrador.jpg` · `escena-cierre.jpg`

Los prompts completos están en `radar-n1/scripts/gen-scenes.mjs`. Si Phil quiere otra versión, se
cambia el prompt ahí y se corre el script con `--force`.

## Lo que NO es Gemini

Los gráficos de la página 08 son **capturas reales** de `artificialanalysis.ai`, no dibujos ni
imágenes generadas. Se toman con Chrome headless vía Playwright y quedan en `radar-n1/charts/`,
documentadas en `radar-n1/charts/SOURCES.md`. Se recortan por CSS (contenedor con `overflow:hidden`),
nunca se redibujan ni se retocan.
