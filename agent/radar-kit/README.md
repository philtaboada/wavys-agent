# RADAR kit — render determinista de la revista

El bot escribe el contenido. El kit lo maqueta. Nadie más toca el diseño.

## Por qué existe

Las páginas de N°1 y N°2 se maquetaron a mano, con posiciones fijas
(`top: 1298px`). Se ven bien con *ese* texto exacto y se descolocan con
cualquier otro, así que no servían para la N°3. Cuando el bot tuvo que sacar
una edición nueva sin plantilla reutilizable, escribió su propio HTML: el texto
quedó apilado arriba y entre el 45% y el 70% de cada hoja salió en blanco.

Aquí el layout es elástico y vive en un solo sitio. El bot no puede romperlo
porque no lo toca.

## Uso

```bash
npm run tool -- render_issue '{"issuePath":"data/radar-issues/n2.json"}'
```

Salida en `data/radar-out/<slug>/`: un PNG de 1240×1754 por página y el PDF
completo.

## Voces tipográficas

Cada tipo de página tiene su titular. El mapa está en `VOICES.md`. El kit lo
aplica en `kit.css`; el agente escribe el título para esa voz. Reusar
`.t-section` / `.t-hed` como titular de página es un bug: produce la revista
con "la misma tipografía en todos los títulos".

## El contrato

`lib/radar/issue.ts`. Nueve tipos de página (`tapa`, `carta`, `notas`,
`tema-apertura`, `tema-texto`, `tema-casos`, `tema-reglas`, `tablero`,
`contratapa`), cada uno con sus campos y sus largos.

Los largos tienen mínimo **y** máximo. El máximo evita que el texto desborde;
el mínimo evita la media hoja vacía, que era el defecto real.

## Chequeos

El render falla —no avisa, falla— si encuentra:

| Chequeo | Qué caza |
|---|---|
| Texto de relleno | `lorem`, `TODO`, `gráfico vacío`, corchetes de marcador |
| Imágenes existen | Rutas a archivos que no están en el repo |
| Contenido cabe | Texto que desborda aun después del auto-ajuste |
| Página sin hueco muerto | Más de 260px vacíos antes del folio |

El auto-ajuste escala el bloque de contenido hasta un 88% para absorber la
variación normal de largo entre semanas. Por debajo de eso el texto quedaría
más chico que el resto de la revista, así que el chequeo lo reporta y el
contenido tiene que acortarse de verdad.

## Estructura

```
VOICES.md     mapa de titular por tipo de página
templates/
  radar.css   tokens, página, grano, velos, cabeza, folio
  kit.css     layout elástico + voz de cada tipo
  page.html   arma la página desde el contrato
fonts/        Archivo, Fraunces, Playfair, Spectral, Zilla, IBM Plex Mono
bots/
  REVISTA-WAVYS.md   bloque para el system prompt del bot
```

## Añadir un tipo de página

1. Un `z.object` con su `type` literal en `lib/radar/issue.ts`, dentro del
   `discriminatedUnion`.
2. Su bloque en el objeto `build` de `page.html`.
3. Su sección en `kit.css`. Que el aire sobrante lo absorba un elemento
   flexible —una foto, un `.stack__grow`— y no los espacios entre párrafos.
4. Su fila en la tabla de `bots/REVISTA-WAVYS.md`.

## Qué no va aquí

Los posts de redes usan `agent/design-kit/` y los flyers de una hoja
`agent/flyer-kit/`; cada uno es otro contrato y otro formato. Este kit es solo
la revista.

Las fuentes editoriales de `fonts/` las comparte el flyer kit por `@import`:
si mueves o renombras esta carpeta, se rompe `agent/flyer-kit/fonts/fonts.css`.
