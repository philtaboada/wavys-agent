---
name: flyer_design
description: Armar y renderizar un flyer premium de Wavys o de un cliente desde un contrato de contenido. Úsalo cuando Phil pida un flyer, un volante, un afiche, una pieza de oferta o promoción, una hoja de servicios o la pieza de un evento — para imprimir, para WhatsApp o para redes.
---

# Flyer — pieza de una hoja

## Cuándo

Para flyers y afiches de una hoja: `a4` imprimible, `feed`, `cuadrado` o
`story`. Para un post social de un solo bloque usa
`agent/skills/design_kit/`; para la revista, `agent/skills/radar_issue/`.

## Regla dura

**Nunca escribas HTML ni CSS para un flyer.** El layout vive en
`agent/flyer-kit/templates/` y se aplica solo. Tú escribes un JSON con el
contenido y el motor produce la pieza.

No es una preferencia de estilo. Un modelo de lenguaje que compone a mano apila
titular, párrafo, bullets y CTA hasta que se le acaba el texto, y deja media
hoja en blanco. Ya pasó con la revista RADAR N°2.

Si la pieza no se ve bien, el arreglo va en el contenido del contrato o en
`agent/flyer-kit/templates/layouts.css`. Nunca en un HTML por pieza.

## Flujo

1. Lee `agent/flyer-kit/VOICES.md` y `agent/flyer-kit/README.md`, y el contrato
   en `lib/flyer/flyer.ts`.
2. **Elige el layout por lo que domina la pieza**, no por gusto: si lo que
   manda es el precio es `oferta`; si es la fecha, `evento`; si hay que
   explicar antes de vender, `revista`. La tabla está en el README.
3. Escribe el JSON en `data/flyer-briefs/<slug>.json`. Hay un ejemplo por
   layout en esa misma carpeta.
4. Si falta la foto, genérala con Gemini antes de renderizar (abajo).
5. Renderiza:

```bash
npm run tool -- render_flyer '{"flyerPath":"data/flyer-briefs/<slug>.json"}'
```

6. **Mira la pieza.** Abre el PNG de `data/flyer-out/` con la herramienta de
   lectura de archivos y míralo de verdad. Los chequeos cazan desbordes,
   huecos y viudas; no cazan una pieza fea ni un titular flojo.
7. Corrige y vuelve a renderizar hasta que esté bien.
8. Pásala por el subagente `flyer-arte`. Si dice "hay que corregir", aplica y
   vuelve a renderizar antes de reportar.
9. Reporta a Phil: layout y formato elegidos, qué chequeos fallaron y qué
   hiciste, y la ruta del PNG y del PDF.

## Errores y qué significan

| Mensaje | Qué hacer |
|---|---|
| `necesita al menos N caracteres` | El campo deja hueco. Amplía el contenido; **nunca bajes el mínimo** para que pase |
| `supera N caracteres y rompe la jerarquía` | Acorta el texto |
| `desborda Npx incluso al 90%` | Demasiado contenido para el formato. Acorta o cambia a un layout con más sitio |
| `Npx vacíos antes del pie` | Falta contenido, un beneficio más, o el layout no es el adecuado para tan poco copy |
| `Npx vacíos entre dos bloques` | El aire cayó en medio sobre fondo plano. Suele ser que el layout tiene dos elementos elásticos compitiendo |
| `el titular bajó a Npx` | El titular es demasiado largo para dominar la pieza. Reescríbelo más corto |
| `queda solo en la última línea` | Viuda en el titular. Reescribe para que la última línea lleve dos palabras |
| `dentro de la franja que tapa la interfaz` | Contenido en la zona insegura de `story` |
| `no encontrado` | La foto no existe. Genérala o corrige la ruta |
| `relleno detectado` | Hay un marcador sin resolver. Complétalo con contenido real |

## Fotos

El kit compone; no dibuja. Genera la escena con Gemini según
`.cursor/rules/gemini-image-only.mdc` y guárdala en `data/generated-images/`:

```bash
npm run tool -- generate_image '{"prompt":"...","aspectRatio":"3:4","outputPath":"data/generated-images/flyer-<slug>.jpg"}'
```

Reglas de la escena:

- **Sin texto y sin logo.** El copy y la marca los pone el motor.
- Negocio real: mostrador, reparto, taller, escritorio de noche, teléfono sobre
  la mesa. Nunca render corporativo de stock ni collage.
- Deja aire donde va el texto: en `cartel` la mitad inferior, en `oferta` y
  `evento` el lado izquierdo.
- Relación de aspecto según el formato: `3:4` para `a4` y `feed`, `9:16` para
  `story`, `1:1` para `cuadrado`.

## Piezas de cliente

El kit está bloqueado a la marca Wavys (tokens de
`agent/context/wavys-visual-brand-guide.md`). Para una pieza de un cliente con
su propia paleta, **pregunta a Phil antes**: o se usa `paper: "claro"` y se
quita el logo con `logo: false`, o hace falta abrir el kit a tokens de cliente,
que es una decisión suya, no tuya.
