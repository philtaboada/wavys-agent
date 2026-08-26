# Design kit — diseño social determinista

Convierte un **brief estructurado** en un PNG on-brand. El layout, la tipografía
Rubik y los tokens de `agent/context/wavys-visual-brand-guide.md` viven en la
plantilla, no en el criterio de quien pide la pieza. El mismo brief produce
siempre el mismo resultado.

## Por qué existe

Los bots de marketing describían el diseño en prosa y una persona lo
interpretaba en Figma o Canva. Cada interpretación se desviaba un poco: otro
tamaño de titular, otro verde, otro margen. El kit elimina el paso de
interpretación: el bot entrega datos, el motor entrega la pieza.

## Montaje de un bot de Grok

Las instrucciones de cada bot se arman con **tres bloques, en este orden**:

1. `bots/CONTEXTO-WAVYS.md` — qué vende Wavys, a quién, links y CTAs válidos.
   Idéntico en los 6 bots.
2. `bots/CORE.md` — el contrato del brief y los límites. Idéntico en los 6 bots.
3. **Solo la sección de ese bot** dentro de `bots/roles.md`. Content Scout recibe
   la sección "Content Scout" y nada más; darle el archivo completo lo hace
   mezclar criterios de roles que no le tocan.

Los dos primeros son lo que hace que todos hablen el mismo idioma; el tercero es
lo que los diferencia.

## Uso

```bash
# Brief inline
npm run tool -- render_design '{"brief":{ ... }}'

# Brief guardado en archivo (recomendado)
npm run tool -- render_design '{"briefPath":"data/design-briefs/mi-pieza.json"}'
```

Salida por defecto: `data/design-out/<slug>-<ancho>x<alto>.png`.

## El contrato

Definido en `lib/design/brief.ts`. Versión pegable para los bots en
`bots/CORE.md`.

| Canal | Canvas |
|---|---|
| `linkedin` | 1080 × 1080 |
| `instagram` | 1080 × 1350 |
| `story` | 1080 × 1920 (reserva 260px arriba y 340px abajo para la UI de la app) |

Los límites de caracteres son el ancho real que soporta cada slot con Rubik en
su tamaño de marca. Un brief que se pasa se **rechaza** con el campo y el
excedente exacto, en vez de renderizar una pieza rota.

## Chequeos automáticos

Cada render verifica y reporta:

1. El contenido cabe dentro de la card sin cortarse.
2. El titular no desborda horizontalmente.
3. El titular conserva jerarquía (no bajó de 56px por exceso de texto).

Si alguno falla, el PNG se genera igual pero el reporte lo marca: sirve para
saber que hay que acortar el copy, no para publicar así.

## Assets generados

El kit compone; no dibuja. Cuando la pieza necesita un fondo, un objeto 3D o una
escena, se genera aparte con Gemini y se referencia:

```json
"asset": { "path": "data/generated-images/fondo-aurora.jpg", "placement": "background" }
```

- `background` — a sangre detrás de la card.
- `right` — objeto flotando a la derecha; la card cede ancho automáticamente.
- `bottom` — objeto abajo al centro.

Reglas de generación en `agent/context/image-cutout-pipeline.md` y en la
plantilla de prompt de `wavys-visual-brand-guide.md` §5. El asset **nunca**
lleva texto ni logo: eso lo pone el motor.

## Estructura

```
agent/design-kit/
  templates/template.html   Layout + tokens + auto-fit del titular
  fonts/                    Rubik variable (local, render offline y estable)
  bots/CONTEXTO-WAVYS.md    Negocio, ICP, dolores, CTAs — común a los 6 bots
  bots/CORE.md              Contrato del brief y límites — común a los 6 bots
  bots/roles.md             Criterio específico de cada bot (una sección por bot)
lib/design/brief.ts         Contrato y límites
lib/design/render.ts        Render y chequeos
agent/tools/render_design.ts
```

## Límites conocidos

- Tres familias visuales (`agente`, `ventas`, `editorial`) sobre un mismo
  esqueleto. No cubre carruseles multi-slide, la revista RADAR (1240×1754) ni
  los flyers de una hoja — esos van en `agent/flyer-kit/`.
- La tipografía es Rubik en todos los casos; la variante Inter para piezas
  "Tech Trends" de la guía §2.2 no está implementada.
- Cambiar tokens de marca se hace en `templates/template.html` y requiere OK de
  Phil, igual que en la guía visual.
