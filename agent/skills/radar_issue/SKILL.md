---
name: radar_issue
description: Armar y renderizar una edición de RADAR (la revista semanal de Wavys) desde un contrato de contenido. Úsalo cuando Phil pida una edición nueva, corregir una existente o revisar por qué una página salió mal.
---

# RADAR — edición de la revista

## Cuándo

Para la revista RADAR (páginas de 1240×1754, PDF multipágina). Para posts de
redes, usa `agent/skills/design_kit/` en su lugar.

## Regla dura

**Nunca escribas HTML para una página de RADAR.** Ni tú ni el bot. El layout
vive en `agent/radar-kit/templates/` y se aplica solo. Escribir HTML a mano es
exactamente lo que produjo la N°2 con media hoja en blanco.

Si una página no se ve bien, el arreglo va en `kit.css` o en el contenido del
contrato, nunca en un HTML suelto por edición.

## Flujo

1. Lee `agent/radar-kit/README.md` y el contrato en `lib/radar/issue.ts`.
2. Escribe o edita el JSON de la edición en `data/radar-issues/<slug>.json`.
3. Renderiza:

```bash
npm run tool -- render_issue '{"issuePath":"data/radar-issues/n3.json"}'
```

4. **Mira las páginas.** Los chequeos cazan desbordes y huecos, no un mal
   ritmo editorial. Abre los PNG de `data/radar-out/<slug>/` y revísalos.
5. Reporta a Phil los chequeos que fallaron y las páginas que ajustaste.

## Errores y qué significan

| Mensaje | Qué hacer |
|---|---|
| `necesita al menos N caracteres` | El campo deja hueco. Amplía el contenido, no bajes el mínimo. |
| `supera N caracteres` | No cabe. Acorta el texto. |
| `desborda Npx incluso al 88%` | Demasiado contenido para esa página. Acorta o parte en dos páginas. |
| `Npx vacíos antes del folio` | Falta contenido o falta la foto de esa sección. |
| `relleno detectado` | Hay un marcador sin resolver. Complétalo con contenido real. |
| `no encontrado` | La imagen no existe. Genérala o corrige la ruta. |

## Imágenes

Las escenas van en `blog/<edición>/img/`. Si falta una, se genera con Gemini
según `.cursor/rules/gemini-image-only.mdc`: escenas de negocio real —mostrador,
escritorio, teléfono sobre la mesa—, nunca collages con texto encima.

Los gráficos del tablero son capturas reales de la fuente, en `charts/`. No se
dibujan ni se reciclan de otra edición: si no hay captura de la semana, la
sección lo dice en el texto.

## Instrucciones del bot

`agent/radar-kit/bots/REVISTA-WAVYS.md` es el bloque que va en el system prompt
del bot Revista Wavys, después de `CONTEXTO-WAVYS.md`. Si el bot vuelve a
entregar HTML o PDF, es que ese bloque no está puesto.
