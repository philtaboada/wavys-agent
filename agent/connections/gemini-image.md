# Gemini — solo imágenes (Nano Banana)

Generación y edición de imágenes vía [Gemini Interactions API](https://ai.google.dev/gemini-api/docs/interactions/image-generation).

## Política estricta (Phil)

- **Solo** el modelo de imágenes: `gemini-3.1-flash-lite-image` (Nano Banana Lite).
- **Prohibido** usar esta API key para chat, texto, embeddings, búsqueda, Veo u otros modelos Gemini.
- La key vive en `.env.local` — nunca en commits, chat público ni issues.

## Variables (`.env.local`)

```env
GEMINI_API_KEY=
```

## Tool

`generate_image` — única acción expuesta.

```bash
# Text-to-image
npm run tool -- generate_image '{"prompt":"Minimal SaaS hero illustration, dark blue gradient, Wavys tech aesthetic","aspectRatio":"16:9"}'

# Cuadrado (social)
npm run tool -- generate_image '{"prompt":"LinkedIn cover for AI agency, clean B2B","aspectRatio":"1:1"}'

# Edición (image-to-image)
npm run tool -- generate_image '{"prompt":"Same layout but brand colors navy and teal","referenceImagePath":"data/generated-images/ref.png","aspectRatio":"16:9"}'
```

Salida por defecto: `data/generated-images/<timestamp>.jpg` (JPEG — único formato soportado por el modelo).

## Respuesta exitosa

```json
{
  "ok": true,
  "result": {
    "provider": "gemini",
    "model": "gemini-3.1-flash-lite-image",
    "path": "data/generated-images/....png",
    "mimeType": "image/png",
    "aspectRatio": "16:9",
    "bytes": 123456
  }
}
```

## Uso con posts sociales (híbrido Figma + Gemini)

Cuando el diseño en Figma Agente necesite un visual que no existe en el file:

1. Generar **asset sin texto** (fondo, 3D, escena) con `generate_image`
2. Importar JPG al frame en Figma
3. Tipografía, logo y CTA **siempre en Figma** (Rubik)

Ver plantilla de prompt en `agent/context/wavys-visual-brand-guide.md` §5.

## Uso con Remotion / remocn

1. Generar asset con `generate_image`
2. Importar en composición Remotion como `<Img src={staticFile('...')} />`
3. Combinar con componentes remocn (ver `agent/context/remocn-video-ecosystem.md`)

## Aspect ratios soportados

`1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `5:4`

## Errores frecuentes

| Error | Causa |
|-------|--------|
| `Missing GEMINI_API_KEY` | Falta `.env.local` |
| 403 / 401 | Key inválida o sin acceso al modelo |
| `returned no image` | Prompt bloqueado o respuesta sin imagen |

## Seguridad

- Imágenes incluyen marca de agua SynthID (Google).
- Si la key se expone, rotar en [Google AI Studio](https://aistudio.google.com/apikey).
