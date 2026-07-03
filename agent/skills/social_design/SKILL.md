# Skill — Diseño social (Figma Agente + Gemini creativo)

Parte del pipeline **`content_production`** — fases 5–6 para piezas **estáticas**.

Usar cuando la fase 3 elija post/carrusel cuadrado (no video).

## Antes de diseñar

1. `agent/context/wavys-visual-brand-guide.md` — invariantes, familia C, prompts Gemini
2. `agent/context/brand-channels.md` — canal y CTA
3. Figma **Posts → Agente** — frame referencia más cercano al tema
4. Familia **C Agente** por defecto (§4 guía)

## Flujo híbrido (obligatorio)

```
Figma (estructura + tipografía + logo)
    +
Gemini (assets visuales creativos cuando haga falta)
    =
Pieza final en Figma → export
```

### Paso a paso

1. **Duplicar** frame ref en página Agente (`use_figma`)
2. **Evaluar:** ¿necesita fondo/3D/escena que no está en el file? → **sí** → `generate_image`
3. **Prompt Gemini:** usar plantilla §5 de `wavys-visual-brand-guide.md`
   - Creativo, cinematic, glass, neón Wavys
   - **Sin texto ni logo** en la imagen (Rubik va en Figma)
   - Dejar espacio negativo para headline
4. **Importar** JPG a Figma → ajustar capas, copy, CTA, logo
5. **Creatividad:** variar composición; no clonar mecánicamente — inspirarse en `833:113`, `778:14`, `651:66`
6. Entregar frame Figma + copy canal + export bajo demanda
7. **No publicar** sin OK de Phil

## Gemini

```bash
npm run tool -- generate_image '{"prompt":"...","aspectRatio":"1:1","outputPath":"data/generated-images/nombre-descriptivo.jpg"}'
```

- Modelo: `gemini-3.1-flash-lite-image` only
- Ratios: `1:1` LinkedIn/FB · `5:4` o `4:3` IG feed · `9:16` story

## Borrador solo-Gemini

Solo si Phil pide “rápido sin Figma”. Aun así, avisar que tipografía/logo deben pulirse en Figma antes de publicar.

## Entregables

- Frame en Figma (fuente de verdad)
- Assets Gemini usados en `data/generated-images/` (referenciados)
- Copy para el canal
- Checklist §6 guía visual
