# Flyer kit — render determinista de flyers premium

El agente escribe el contenido. El kit lo maqueta. Nadie compone a mano.

## Por qué existe

Un flyer es la pieza que más veces se pide y la que peor sale cuando la compone
un modelo de lenguaje: apila titular, párrafo, bullets y CTA de arriba hacia
abajo hasta que se le acaba el texto, y deja media hoja en blanco. Es
exactamente lo que pasó con la revista RADAR N°2 antes de tener kit, y en un
flyer se nota más porque es una sola página que el cliente mira entera de un
golpe.

Aquí el layout es elástico, vive en un solo sitio y el agente no lo toca.

## Uso

```bash
npm run tool -- render_flyer '{"flyerPath":"data/flyer-briefs/<slug>.json"}'
```

Salida en `data/flyer-out/`: el PNG y, en formato `a4`, también el PDF de una
hoja para imprimir o mandar por WhatsApp.

Hay un brief de ejemplo por layout en `data/flyer-briefs/ejemplo-*.json`.

## Los cinco layouts

Cada uno cambia dos cosas: **dónde va la foto** y **con qué voz titula**. El
mapa de voces está en `VOICES.md`.

| Layout | Foto | Para qué sirve | Elemento que domina |
|---|---|---|---|
| `cartel` | A sangre completa | Que se vea de lejos. Un mensaje, un dato | El titular |
| `revista` | Banda superior elástica | Servicio que hay que explicar antes de venderlo | La foto |
| `oferta` | A sangre con velo lateral | La pieza que se manda a vender: precio y beneficios | El precio |
| `servicios` | Banda inferior elástica | Qué hace el negocio, en 3 o 4 frentes | La rejilla |
| `evento` | A sangre con velo lateral | Taller, charla, demo, inauguración | La fecha |

## Formatos

| Formato | Píxeles | Notas |
|---|---|---|
| `a4` | 1240 × 1754 | Imprimible a 150dpi. **Genera PDF** |
| `feed` | 1080 × 1350 | Instagram feed |
| `cuadrado` | 1080 × 1080 | LinkedIn y Facebook |
| `story` | 1080 × 1920 | Reserva 260px arriba y 340px abajo para la interfaz de la app |

## El contrato

`lib/flyer/flyer.ts`. Los largos tienen mínimo **y** máximo:

- El **máximo** es el ancho real del slot con su tipografía de marca. Pasarse
  no aprieta un poco: parte el titular en cuatro líneas y mata la jerarquía.
- El **mínimo** evita la media hoja vacía, que es el defecto de verdad.

Los dos son duros: el render rechaza el brief y dice el campo y el excedente.

## Chequeos

El render falla —no avisa, falla— si encuentra:

| Chequeo | Qué caza |
|---|---|
| Sin texto de relleno | `lorem`, `TODO`, `tu texto aquí`, `S/ 0`, corchetes de marcador |
| La foto existe | Rutas a archivos que no están en el repo |
| El contenido cabe | Texto que desborda aun tras el auto-ajuste |
| Sin hueco muerto al pie | Aire entre el último bloque y el pie |
| Sin hueco muerto en medio | Aire entre dos bloques: anclar el último bloque al pie no arregla el hueco, lo traslada |
| El titular manda | Titular que bajó del piso de su formato por exceso de texto |
| Titular sin viuda | Una palabra corta sola en la última línea del titular |
| Párrafo sin viuda | Lo mismo en el dek, con más tolerancia: a cuerpo 88 una viuda de 9 caracteres canta, a cuerpo 22 apenas se nota |
| Zonas seguras | Contenido bajo la interfaz de la app en `story` |

**El umbral de hueco depende de qué haya detrás.** Sobre una foto a sangre el
aire es composición y se tolera hasta el 30% del alto; sobre fondo plano es una
pieza sin terminar y el límite baja al 12%. Medir los dos igual obliga a
rellenar de texto justo la zona que tiene que quedar limpia.

### Auto-ajuste, en dos pasos

1. **El titular baja de cuerpo primero**, hasta el máximo de líneas de su
   layout. Un titular de cuatro líneas ya perdió la jerarquía, y escalar toda
   la pieza por su culpa encoge también el cuerpo de texto.
2. **Después se escala el bloque entero**, hasta el 90%. Por debajo de eso el
   texto queda más chico que el de las otras piezas de la marca, así que el
   chequeo lo reporta y el contenido tiene que acortarse de verdad.

## Fotos

El kit compone; no dibuja. La foto se genera aparte con Gemini
(`.cursor/rules/gemini-image-only.mdc`) y se referencia por ruta. **La foto
nunca lleva texto ni logo**: eso lo pone el motor.

Las escenas son negocio real —mostrador, reparto, taller, escritorio de
noche—, nunca render corporativo de stock ni collage con texto encima.

## Estructura

```
VOICES.md               mapa de titular por layout
templates/
  base.css              lienzo, papel, tinta, foto, cabecera, pie, CTA, QR
  layouts.css           los cinco layouts
  flyer.html            arma la pieza desde el contrato y mide
fonts/fonts.css         cablea Rubik (design kit) + editoriales (radar kit)
lib/flyer/flyer.ts      contrato y límites
lib/flyer/render.ts     render, QR, PDF y chequeos
agent/tools/render_flyer.ts
```

Las fuentes no se duplican aquí a propósito: Rubik vive en `agent/design-kit/`
y las editoriales en `agent/radar-kit/`. Copiar los woff2 por kit es cómo se
acaba con dos Rubik distintas y piezas que no cuadran entre sí.

## Añadir un layout

1. Un `z.object` con su `layout` literal en `lib/flyer/flyer.ts`, dentro del
   `discriminatedUnion`.
2. Su bloque en el objeto `build` de `flyer.html`.
3. Su sección en `layouts.css`, con **un** elemento elástico que absorba el
   aire —una banda de foto o un `.grow`—, nunca dos: dos elásticos se reparten
   el hueco y aparece fondo plano entre bloques.
4. Su voz en `VOICES.md` y su fila en la tabla de arriba.
5. Si la foto va a sangre detrás del texto, añádelo a `BG_PHOTO_LAYOUTS`.

## Qué no va aquí

- Posts de redes de un solo bloque: `agent/design-kit/`.
- La revista RADAR: `agent/radar-kit/`.
- Carruseles de varias láminas: no está implementado.
