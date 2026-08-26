# Escenas del N°2 · qué se generó y con qué reglas

Las ocho fotos de `img/` se generaron con **`gemini-3.1-flash-lite-image`**
(Nano Banana Lite), el único generador permitido para foto de interiores en este
repo. Script: `radar-n2/scripts/gen-scenes.mjs`.

```bash
node radar-n2/scripts/gen-scenes.mjs            # genera lo que falte
node radar-n2/scripts/gen-scenes.mjs --force    # regenera todo
node radar-n2/scripts/gen-scenes.mjs escena-tapa.jpg
```

## Lo que está prohibido en este número

- **Cero cara.** De Phil o de cualquiera. Cero retrato, cero manos, cero cuerpo.
- **Cero cyborg**, cero robot, cero mano de metal, cero "IA" ilustrada.
- **Cero interfaz legible.** Ninguna pantalla con texto, ningún dashboard
  inventado, ninguna letra pegada en post.
- **Cero café.** Ni taza, ni mancha de taza: Phil no toma café.
- **Cero logo** y cero cartel con palabras dentro del cuadro.
- Nada de stock ni de otro generador (DALL·E, Flux, Midjourney, Grok, Unsplash).

## Espina de estilo compartida

> Editorial documentary photograph for a print magazine, 35mm lens, natural
> available light, muted realistic colour, fine film grain, shallow depth of
> field, absolutely no people, no faces, no portraits, no hands, no bodies,
> nobody in frame, no text overlay, no captions, no watermark, no logos, no
> brand marks, no signage with words, no readable screen, no invented user
> interface, nothing added in post, real worn surfaces of a small working clinic
> or office, honest and unstyled.

El motivo del número es uno y se repite en las ocho: **recepción · teléfono de
escritorio · UNA silla vacía.**

## Las ocho escenas

| Archivo | Formato | Página | Qué hay en el cuadro |
|---|---|---|---|
| `escena-tapa.jpg` | 3:4 | 01 · Tapa | Recepción a las 10 de la mañana. Mostrador, teléfono negro con la luz ámbar de recado prendida, UNA silla de espera vacía corrida de la pared. |
| `escena-carta.jpg` | 1:1 | 02 · Carta | Escritorio de noche desde arriba: una hoja escrita, lapicero cruzado, la base del teléfono y el cable espiralado sobre el papel. Texto fuera de foco. |
| `escena-recepcion.jpg` | 4:3 | 03 · Señal | El lado de trabajo del mostrador a las 8 a.m.: monitor girado (solo resplandor, nada legible), teléfono, cuaderno, bandeja de papeletas en blanco. |
| `escena-telefono.jpg` | 3:4 | 04a · Apertura | Primer plano bajo del teléfono, luz de recado prendida, cable cayendo del mostrador; al fondo desenfocada, UNA silla vacía. |
| `escena-agenda.jpg` | 16:9 | 04b · Relato | Macro de la agenda de papel: casi todos los casilleros escritos y uno en blanco, tachado con una raya. Letra ilegible a propósito. |
| `escena-silla.jpg` | 4:3 | 04c · Casos | Sala de espera desde la altura del asiento: la silla más cercana, vacía y salida de fila, con luz dura de ventana. |
| `escena-oficio.jpg` | 16:9 | 05 · Más notas | Trasoficina de noche, iluminada solo por una pantalla fuera de cuadro: teléfono en silueta, teclado, folders, bandeja de instrumentos. |
| `escena-cierre.jpg` | 3:4 | 09 · Contratapa | La recepción después de cerrar: luz de standby en el teléfono, UNA silla vacía en ángulo, la puerta de vidrio azul al fondo. |

Los prompts completos, palabra por palabra, están en el arreglo `SCENES` de
`scripts/gen-scenes.mjs`. Ahí es donde se editan: no se retoca el JPG.

## Cómo entran a la página

Las fotos entran a sangre o en ventana, siempre recortadas por CSS
(`object-fit: cover` + `object-position`), con un velo de gradiente cuando hay
texto encima. Ningún JPG se abrió en un editor de imagen: lo que está en `img/`
es lo que devolvió el modelo.
