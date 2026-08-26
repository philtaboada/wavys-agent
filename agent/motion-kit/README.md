# Motion kit — clips animados desde un contrato

Convierte una **lista de contenidos** en clips de video animados, con la marca
Wavys resuelta de fábrica. Cada clip sale como archivo independiente para
montarlo dentro de un video más largo.

```
contrato .json  →  escena HTML + GSAP  →  frames PNG  →  ffmpeg  →  .mp4 / .mov
```

El movimiento vive en `templates/scene.html`. El contrato solo dice **qué**
aparece, nunca **cómo** se anima. Por eso dos renders del mismo contrato dan
archivos idénticos frame a frame.

| Pieza | Dónde |
|---|---|
| Contrato (fuente de verdad) | `lib/motion/clip.ts` |
| Motor de escenas y animación | `agent/motion-kit/templates/scene.html` |
| Renderer (frames + ffmpeg) | `lib/motion/render.ts` |
| Tool | `npm run tool -- render_motion` |
| Procedimiento | `agent/skills/motion_kit/SKILL.md` |
| Versión pegable para los bots | `agent/motion-kit/bots/CORE.md` |

## Uso

```bash
npm run tool -- render_motion '{"reelPath":"data/motion-reels/<slug>.json"}'
```

Opciones útiles mientras se itera:

| Campo | Para qué |
|---|---|
| `only: ["id-clip"]` | Rehace un solo clip en vez del reel completo |
| `keepFrames: true` | Deja los PNG por frame para inspeccionar o reencodar a mano |
| `webm: true` | Suma un WebM con alfa además del `.mov` |
| `outDir` | Cambia la carpeta de salida |

## Qué sale

En `data/motion-out/<slug>/`:

| Archivo | Qué es |
|---|---|
| `NN-<id>.mp4` | El clip. Con `transparent: true` sale `.mov` ProRes 4444 con alfa |
| `NN-<id>.png` | Cuadro de reposo, para elegir miniatura o revisar composición |
| `NN-<id>-strip.png` | Seis cuadros del clip en una imagen: muestra el arco del movimiento sin abrir el video |

Los dos archivos de revisión de un clip con alfa se componen sobre un damero
gris. Sobre negro un panel oscuro translúcido se desvanece y sobre blanco
aparece una caja que no existe en el diseño: en los dos casos el archivo deja de
servir para opinar. El alfa de verdad viaja en el `.mov`.
| `reel.mp4` | Todos los clips pegados, para revisar ritmo. No es la entrega. No se arma si el reel mezcla clips con y sin alfa: son códecs distintos |
| `MANIFEST.json` | Duración y **timecode acumulado** de cada clip: los puntos de corte del video largo |

## El reel

```json
{
  "slug": "radar-n3",
  "format": "wide",
  "fps": 30,
  "theme": "agente",
  "transparent": false,
  "edges": "cut",
  "concat": true,
  "logo": true,
  "clips": []
}
```

| Campo | Valores | Default |
|---|---|---|
| `format` | `wide` 1920×1080 · `reel` 1080×1920 · `square` 1080×1080 · `portrait` 1080×1350 | `wide` |
| `fps` | `24` · `30` · `60` | `30` |
| `theme` | `agente` · `ventas` · `editorial` | `agente` |
| `transparent` | Fondo con alfa para montar encima de otro material. Cada clip lo puede sobrescribir | `false` |
| `edges` | `cut` corte seco · `fade` entra y sale de negro | `cut` |
| `concat` | Pega los clips en `reel.mp4` | `true` |
| `logo` | Marca de agua discreta | `true` |

`fps` y formato mandan sobre el tiempo de render: 60 fps cuesta el doble que 30
y solo se nota en movimientos rápidos. Para hablar a cámara con placas encima,
30 alcanza.

## Campos de todos los clips

| Campo | Qué hace |
|---|---|
| `id` | kebab-case. Es el nombre del archivo, tiene que ser único |
| `hold` | Segundos de quietud después de que todo entró: el tiempo de lectura real. 0.4–8, default 1.6 |
| `exit` | `out` saca el contenido al final · `hold` congela el último cuadro |
| `background` | Foto de fondo con deriva lenta |
| `transparent` | Sobrescribe el del reel. Es lo que permite meter una `lower-third` con alfa en un reel con fondo |

La duración total no se declara: la calcula la plantilla sumando entrada +
`hold` + salida. Para alargar un clip se sube `hold`, no se toca la animación.

### `background`

```json
{ "image": "ruta/foto.jpg", "motion": "zoom-in", "dim": 0.72, "blur": 8 }
```

`motion`: `zoom-in` · `zoom-out` · `pan-left` · `pan-right` · `still`.

`dim` apaga la foto y `blur` la desenfoca. **Los dos vienen activados a
propósito**: una foto nítida y a pleno brillo detrás de un titular siempre gana
la pelea y el texto deja de leerse. Bajar `blur` a 0 solo cuando la imagen *es*
el tema, y en ese caso subir `dim` a 0.8.

### Acento de color

En cualquier titular, envolver una palabra en asteriscos la pinta con el verde
de marca:

```json
"title": "Tu WhatsApp ya es *un canal de ventas*"
```

Funciona pegado a la puntuación (`*dato*:`) y admite varias palabras.

## Los diez tipos de escena

| `type` | Para qué sirve | Animación |
|---|---|---|
| `kinetic` | Tipografía cinética. La frase que abre o cierra una idea | Palabras que suben tras una máscara, línea por línea. El texto **crece hasta llenar el cuadro** |
| `hook` | Placa de apertura de un tema | Titular enmascarado, cuerpo, botón y recorte que entra flotando |
| `bullets` | Lista de puntos, pasos o hallazgos | Cada ítem entra por izquierda con su punto; un riel se dibuja al costado |
| `stat` | Un número que sostiene el argumento | Conteo animado; si el valor lleva `%` se dibuja un arco |
| `logos` | Desfile de marcas de empresas | Fichas que entran en cascada desde el desenfoque y quedan flotando |
| `cutout` | Recorte protagonista con alfa | Revelado por barrido + deriva permanente |
| `quote` | Testimonio de cliente | Comilla que rebota, cita palabra por palabra, autor al final |
| `lower-third` | Placa de nombre para montar encima de otro video | Barrido lateral, entra y sale. **Siempre** con `"transparent": true` en el clip |
| `compare` | Antes / después | Paneles que entran de los costados, divisor que se dibuja, chapa "VS" |
| `outro` | Cierre de marca | Logo con pulso, CTA y dirección |

### Campos por tipo

```jsonc
// kinetic — una frase por línea; el corte de línea lo decidís vos
{ "id": "", "type": "kinetic", "eyebrow": "", "lines": ["", ""], "footnote": "" }

// hook
{ "id": "", "type": "hook", "eyebrow": "", "title": "", "body": "",
  "cta": "", "cutout": "ruta.png" }

// bullets
{ "id": "", "type": "bullets", "eyebrow": "", "title": "",
  "items": [{ "text": "", "note": "" }] }

// stat — value admite 87%, 3.2x, 12, $4.5M
{ "id": "", "type": "stat", "value": "", "label": "", "note": "", "source": "" }

// logos — layout: row | grid
{ "id": "", "type": "logos", "eyebrow": "", "title": "", "layout": "row",
  "logos": [{ "src": "ruta.svg", "label": "" }] }

// cutout — align: left | right | center
{ "id": "", "type": "cutout", "image": "ruta.png", "title": "",
  "caption": "", "align": "right" }

// quote
{ "id": "", "type": "quote", "quote": "", "author": "", "role": "",
  "avatar": "ruta.jpg" }

// lower-third — position: bottom-left | bottom-center | top-left
{ "id": "", "type": "lower-third", "transparent": true, "title": "",
  "subtitle": "", "position": "bottom-left" }

// compare
{ "id": "", "type": "compare", "title": "",
  "left":  { "label": "", "text": "" },
  "right": { "label": "", "text": "" },
  "verdict": "" }

// outro
{ "id": "", "type": "outro", "title": "", "cta": "", "url": "" }
```

Los límites de caracteres exactos están en `lib/motion/clip.ts` y el error de
validación siempre nombra el clip y el campo.

## Imágenes

| Uso | Qué necesita |
|---|---|
| `cutout`, `hook.cutout` | PNG **con canal alfa real**. Se mide antes de renderizar: si el alfa nunca llega a cero, el chequeo falla y nombra el archivo |
| `logos[].src` | SVG o PNG que se lea sobre fondo oscuro. Un logo en tinta negra desaparece |
| `background.image` | JPG. Va desenfocado, así que no hace falta que sea nítido |

Si falta un asset, el render se detiene antes de abrir el navegador y dice qué
clip lo pide. Para generarlos: `generate_image` (Gemini) y el recorte según
`agent/context/image-cutout-pipeline.md`.

## Los chequeos

Cada clip vuelve con sus verificaciones. Si alguna falla, el problema es el
contenido o el asset, no el diseño:

| Chequeo | Qué mira | Cómo se arregla |
|---|---|---|
| assets cargan | Ninguna imagen quedó rota | Corregir la ruta |
| contenido dentro del cuadro | El bloque entra en el alto | Quitar un ítem o acortar el copy |
| titulares sin corte | Ninguna línea se corta al ancho | Acortar la línea más larga |
| jerarquía tipográfica | El display no bajó de 34px | El texto es largo para el formato |
| duración editable | Entre 1.6 y 14 segundos | Ajustar `hold` o partir el clip |
| recorte con fondo transparente | El alfa del PNG llega a cero en algún píxel | Rehacer el recorte: ese archivo tiene fondo pegado |
| imágenes a tamaño nativo | Ninguna imagen se dibuja más grande que su resolución | Regenerar el asset más grande: interpolado se ve blando en video |

También rechaza el contrato entero, antes de renderizar, si encuentra texto de
relleno (`TODO`, `lorem ipsum`, `[algo entre corchetes]`) o ids repetidos.

Aparte de los chequeos, la salida puede traer `notes`: avisos que no son
defectos, como que el archivo pegado no se armó porque el reel mezcla clips con
y sin alfa.

## Cómo funciona el render

Lo que hace que el resultado sea reproducible:

1. La plantilla arma un timeline de GSAP **en pausa** y le saca el reloj global.
2. El renderer avanza a mano: `seek(frame / fps)` y captura. El resultado no
   depende de la velocidad de la máquina.
3. Nada se anima con CSS. Todo pasa por el timeline, así que cualquier cuadro es
   reproducible en cualquier orden.
4. Solo se animan `transform`, `opacity`, `filter` y `clip-path`: propiedades que
   no cambian el layout. Por eso la medición del texto sigue siendo válida
   durante todo el clip.
5. Las fuentes y las imágenes se cargan **antes** de construir la escena. Medir
   con la fuente del sistema y después cambiarla desplazaba todo.

La capa de ambiente (deriva de la aurora, flotación de los recortes, pulso del
logo) vive en un timeline aparte con repetición infinita, para que un loop no
infle la duración del clip.

## No hacer

- No editar `templates/scene.html` para acomodar un contenido puntual. El
  movimiento es compartido; cambiarlo afecta a todos los clips y necesita OK de
  Phil.
- No usar `reel.mp4` como entrega. Es un preview de ritmo; la entrega son los
  clips sueltos más el `MANIFEST.json`.
- No pedirle a Gemini el clip terminado con texto. El asset es un ingrediente.
- No subir `fps` a 60 para "que se vea mejor". Lo que se nota es el `hold`.
