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
objetos, mostrador, papel y manos**, sin retrato. La tapa/cara cyborg está LOCK y no se tocó.

`image_size: 2K` devuelve `404 not_found` con este modelo; el máximo real es `1K` (~1024 px en el
lado largo). Por eso las fotos se colocan con grano de impresión (`.grain` en `css/radar.css`) y
ninguna se amplía más de ~1.7×.

Regenerar (la key sale de `GEMINI_API_KEY` o de `.env.local`, que está gitignoreado):

```bash
node radar-n1/scripts/gen-scenes.mjs             # solo lo que falta
node radar-n1/scripts/gen-scenes.mjs --force     # todo de nuevo
node radar-n1/scripts/gen-scenes.mjs escena-correo.jpg
```

## Las siete escenas

Espina de estilo compartida (en el script, constante `STYLE`): fotografía documental editorial,
35 mm, luz disponible, color apagado, grano fino, foco corto, **sin caras, sin texto pegado, sin
logos, sin interfaz inventada**, superficies gastadas de un negocio que trabaja.

| Archivo | Página | Formato | Escena |
|---|---|---|---|
| `img/escena-carta.jpg` | 02 Carta | 1:1 | Escritorio de noche: carta impresa, lapicero, cuaderno de apuntes, taza con cerco de café, lentes. Luz de una sola lámpara. |
| `img/escena-correo.jpg` | 03 Señal | 4:3 | Back-office a las 8am: laptop con una lista de correo ilegible, celular boca arriba, cuaderno, taza. Luz fría de ventana. |
| `img/escena-chat-hoja.jpg` | 04a Apertura | 3:4 | Mostrador de reparto: celular con una conversación abierta **al lado** de la hoja de pedidos escrita a mano, lapicero, pila de papeletas, cinta. |
| `img/escena-hoja-estado.jpg` | 04b Relato | 16:9 | Macro de la hoja de control: columnas a mano, tachones, el canto del celular entrando en cuadro. |
| `img/escena-mostrador.jpg` | 04c Casos | 4:3 | Punta de despacho: paquetes listos, block de pedidos, celular boca abajo y unas manos anotando (solo manos). |
| `img/escena-browser.jpg` | 05 Más noticias | 16:9 | Banda nocturna: laptop con el navegador abierto y un panel al costado, todo desenfocado. |
| `img/escena-cierre.jpg` | 09 Contratapa | 3:4 | Negocio después de cerrar: mostrador vacío, reja a medio bajar, un celular cargando. Sin gente. |

Los prompts completos están en `radar-n1/scripts/gen-scenes.mjs`, en el arreglo `SCENES`, junto al
formato y la página de destino de cada uno. Si Phil quiere otra versión de una escena, se cambia el
prompt ahí y se corre el script con `--force`: no hay foto suelta sin prompt trazable.

## Lo que NO es Gemini

Los gráficos de la página 08 son **capturas reales** de `artificialanalysis.ai`, no dibujos ni
imágenes generadas. Se toman con Chrome headless vía Playwright y quedan en `radar-n1/charts/`,
documentadas en `radar-n1/charts/SOURCES.md`. Se recortan por CSS (contenedor con `overflow:hidden`),
nunca se redibujan ni se retocan.
