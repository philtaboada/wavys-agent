# Skill — Design kit (brief → PNG determinista)

Usar cuando llega un **brief de los bots de Grok** (Área de Marketing) o cuando
Phil pide una pieza social estándar y no hace falta composición libre en Figma.

**Documentación:** `agent/design-kit/README.md`
**Contrato:** `lib/design/brief.ts` · versión pegable en `agent/design-kit/bots/CORE.md`
**Instrucciones de los bots:** `CONTEXTO-WAVYS.md` → `CORE.md` → su sección de `roles.md`

## Cuándo este skill y cuándo `social_design`

| Situación | Ruta |
|---|---|
| Brief de bot, pieza estándar, volumen semanal | **Este skill** — render directo |
| Pieza hero, campaña, layout nuevo, carrusel | `social_design` — Figma Agente |
| Revista RADAR (1240×1754) | Pipeline propio de `blog/` |

El kit garantiza consistencia; Figma garantiza libertad. Para el flujo semanal
de los bots, consistencia gana.

## Pasos

1. **Guardar el brief** que entregó el bot en `data/design-briefs/<slug>.json`.
   Si vino como texto, extraer solo el bloque JSON.

2. **Renderizar:**

```bash
npm run tool -- render_design '{"briefPath":"data/design-briefs/<slug>.json"}'
```

3. **Leer los `checks` del resultado.** Los tres deben venir en `passed: true`.
   Si alguno falla, el problema es el copy, no el diseño: acortar el campo que
   señala el reporte y volver a renderizar. No editar la plantilla para que
   quepa un texto largo.

4. **Si el brief incluye `asset`** y la imagen no existe todavía, generarla
   antes con Gemini siguiendo `agent/context/image-cutout-pipeline.md`:

```bash
npm run tool -- generate_image '{"prompt":"...","aspectRatio":"4:3","outputPath":"data/generated-images/<nombre>.jpg"}'
```

5. **Revisar el PNG** con el ojo puesto en el mensaje, no en la marca: los
   tokens ya están garantizados. Verificar que el hook se entienda solo y que el
   CTA sea único.

6. **No publicar sin OK de Phil.**

## Si el brief viene mal

El error de validación nombra el campo y el excedente. Devolver al bot ese
mensaje literal: está entrenado con los mismos límites y corrige en una pasada.

Errores frecuentes:

| Síntoma | Causa |
|---|---|
| `hook.line1 supera 34 caracteres` | El bot escribió una frase completa como titular |
| `proof admite máximo 4 bullets` | Se listaron features en vez de pruebas |
| `slug debe ser kebab-case` | Acentos o mayúsculas en el slug |
| Titular bajó de 56px | Hook dentro del límite pero con palabras muy largas |

## No hacer

- No modificar `templates/template.html` para acomodar un brief puntual. Los
  tokens y el layout son compartidos; cambiarlos afecta a todas las piezas y
  requiere OK de Phil.
- No pedirle a Gemini la pieza terminada con texto. El asset es un ingrediente.
- No saltarse los `checks` porque "se ve bien igual".
