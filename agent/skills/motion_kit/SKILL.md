# Skill — Motion kit (lista de contenidos → clips animados)

Usar cuando Phil pasa **una lista de contenidos** y quiere clips animados para
armar después un video más largo. También cuando pide una placa de nombre, un
número animado, un desfile de logos o una tanda de títulos para montar encima de
material grabado.

**Documentación:** `agent/motion-kit/README.md`
**Contrato:** `lib/motion/clip.ts` · versión pegable en `agent/motion-kit/bots/CORE.md`
**Tool:** `render_motion`

## Cuándo este skill y cuándo `video_production`

| Situación | Ruta |
|---|---|
| Lista de contenidos → clips sueltos que Phil monta | **Este skill** — render directo |
| Placas, títulos y lower thirds para montar sobre grabado | **Este skill** con `transparent: true` |
| Video promo terminado, con guion, VO y storyboard | `video_production` — pipeline de 6 fases |
| Pieza estática para redes | `design_kit` |

La diferencia real: acá **no hay guion ni voz en off**. Se entregan piezas de
montaje. Si Phil pide "un video sobre X", es `video_production`. Si pide
"animaciones sobre esta lista", es este skill.

## Pasos

1. **Convertir la lista en un arco.** Cada punto de la lista es un clip, pero el
   orden y el tipo de escena son decisión editorial:
   - Un punto que es una lista de cosas → **un** clip `bullets`, no cuatro.
   - Un punto con un número → `stat`, y el número va en `value`, no en el texto.
   - Empresas mencionadas → `logos`, con los logos reales.
   - Abrir con `kinetic` o `hook`; cerrar con `outro` solo si Phil quiere CTA.
   - Alternar tipos. Tres escenas iguales seguidas se sienten como una
     presentación, no como un video.

2. **Escribir el contrato** en `data/motion-reels/<slug>.json`. Si el contenido
   vino de un bot de Grok, extraer solo el bloque JSON.

3. **Verificar los assets antes de renderizar.** Recortes con alfa real, logos
   que se lean sobre oscuro, fotos de fondo. Lo que falte se genera primero:

```bash
npm run tool -- generate_image '{"prompt":"...","aspectRatio":"1:1","outputPath":"data/generated-images/<nombre>.png"}'
```

4. **Renderizar:**

```bash
npm run tool -- render_motion '{"reelPath":"data/motion-reels/<slug>.json"}'
```

5. **Leer los `checks`.** Todos tienen que venir en `passed: true`. Si alguno
   falla, el problema es el contenido: el reporte dice qué clip y qué campo.
   No editar la plantilla para que quepa un texto largo.

6. **Revisar las tiras de contactos**, no los posters. `NN-<id>-strip.png` son
   seis cuadros del clip en una imagen: ahí se ve si el movimiento tiene arco o
   si el texto aparece de golpe. El poster solo dice si la composición cierra.

7. **Iterar clip por clip** mientras se corrige, sin rehacer el reel:

```bash
npm run tool -- render_motion '{"reelPath":"...","only":["id-del-clip"]}'
```

8. **Entregar los clips sueltos y el `MANIFEST.json`.** El `reel.mp4` es un
   preview de ritmo, no la entrega: Phil monta con los archivos individuales y
   los timecodes acumulados del manifest.

## Decisiones que hay que tomar bien

| Duda | Regla |
|---|---|
| ¿`wide` o `reel`? | `wide` si el destino es un video de YouTube o una edición larga. `reel` solo si la pieza va sola a IG/TikTok |
| ¿`transparent`? | `true` cuando el clip va **encima** de otro material: placas, títulos, lower thirds. Sale `.mov` ProRes 4444 con alfa. Va por clip, así que un reel con fondo puede incluir una placa keyeable |
| ¿`fps`? | 30 salvo que el video final sea a 60. Duplicar fps duplica el tiempo de render y casi no se nota |
| ¿`exit: "hold"`? | En el último clip, si Phil va a poner algo encima o quiere congelar el cierre |
| ¿Foto de fondo? | Solo si aporta. Va desenfocada a propósito: si la imagen *es* el tema, va como `cutout`, no como fondo |

## Si el render falla o se ve mal

| Síntoma | Causa | Arreglo |
|---|---|---|
| `El contrato no valida: clip "x" · title: supera N caracteres` | Copy largo | Acortar. El mensaje nombra clip y campo |
| `Assets que no existen` | Ruta inventada o archivo sin generar | Corregir ruta o generar el asset |
| `Texto de relleno en el contrato` | Quedó un `TODO` o un `[placeholder]` | Escribir el copy real |
| `contenido dentro del cuadro` falla | Demasiados ítems para el formato | Quitar un ítem o partir en dos clips |
| `jerarquía tipográfica` falla | El display bajó de 34px para poder entrar | El texto es largo para ese formato |
| `recorte con fondo transparente` falla | El PNG tiene fondo pegado: su alfa nunca llega a cero | Rehacer el recorte. No alcanza con que "se vea recortado" |
| `imágenes a tamaño nativo` falla | El asset se dibuja más grande que su resolución | Regenerarlo más grande. Interpolado se ve blando en video |
| La placa no se puede montar sobre el video | Al `lower-third` le falta `"transparent": true` | Agregarlo en el clip |
| No apareció `reel.mp4` | El reel mezcla clips con y sin alfa | Es esperado: viene explicado en `notes` y los clips quedan sueltos |
| Un logo no aparece | Es tinta oscura sobre transparente | Usar la variante para fondo oscuro |
| El texto pelea con la foto de fondo | `blur` bajado a 0 | Volver al default o subir `dim` a 0.8 |
| El clip se siente apurado | `hold` corto | Subir `hold`, nunca tocar la animación |

## No hacer

- No editar `agent/motion-kit/templates/scene.html` para un contenido puntual.
  El movimiento es compartido: cambiarlo afecta a todos los clips y necesita OK
  de Phil.
- No escribir HTML ni CSS por reel. Si un contenido no entra en ningún tipo de
  escena, decirlo y proponer el tipo nuevo, no improvisar el layout.
- No inventar cifras para un `stat`. Sin `source` real, no va.
- No entregar el `reel.mp4` como si fuera la pieza final.
- No publicar nada sin OK de Phil.
