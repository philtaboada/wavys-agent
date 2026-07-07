# Pipeline — recorte de fondo (cutout) para flyers y video

**Cuándo leer:** al generar assets Gemini que deben **flotar** sobre otro fondo (flyer, Figma, HyperFrames, Remotion) — icono 3D, producto, mascota, objeto hero.

**Regla:** Gemini (`generate_image`) solo exporta **JPEG** — no transparencia nativa. Si el diseño necesita PNG sin fondo → seguir este pipeline **después** de generar la imagen.

**Gate 0 (pasos):** `agent/context/pipeline-gates.md` § `image_cutout` · Imagen base → `image_generation`

**Gate 1+ (calidad):** mismo doc § Gate 1+ `image_cutout` — sección cutout en `<asset-id>-image-validation.md`

---

## ¿Cuándo aplicar?

| Sí — quitar fondo | No — dejar asset completo |
|-------------------|---------------------------|
| Objeto/3D/icono sobre fondo de campaña distinto | Fondo aurora, hero full-bleed, textura ambiental |
| Producto flotando en flyer o story | Imagen va dentro de card/círculo con fondo integrado |
| Mascota u objeto hero en video (rol `cutout`) | Screenshot recortado a 9:16 (crop, no cutout) |
| Composición Figma: capa PNG sobre gradiente | Tipografía, logo, CTA (siempre en Figma/código) |

**Decisión en STORYBOARD / ASSET-PLAN / paso visual del flyer:** marcar rol `cutout` o `background` por asset.

**Persona sosteniendo celular con web:** una sola foto Gemini (manos en el marco + UI en pantalla). **No** superponer UI con HTML/CSS/sharp — se ve roto. El flyer solo añade tipografía/CTA encima.

---

## Flujo obligatorio (cuando haga falta cutout)

```
1. Gemini generate_image  →  JPG con fondo plano (blanco o chroma)
2. Quitar fondo           →  PNG transparente
3. Componer               →  Figma / HTML flyer / HF frame / Remotion
4. Validar                →  sin halo blanco, bordes limpios, contraste OK
```

### Paso 1 — Prompt Gemini (preparar para recorte)

Añadir al prompt del asset **solo cuando** se planea cutout:

```
Solid flat pure white background #FFFFFF, single subject centered,
generous padding around subject, no shadows on background,
no text, no logo, no watermark, crisp edges, isolated object.
```

Alternativa chroma (mejor para recorte automático):

```
Solid flat chroma green background #00FF00, single subject centered,
generous padding, no shadows, no text, no logo.
```

**Evitar:** fondos degradados, escenas complejas o múltiples objetos si el objetivo es cutout limpio.

### Paso 2 — Quitar fondo

**Orden de preferencia:**

| # | Método | Cuándo |
|---|--------|--------|
| 1 | Skill global `inference-sh/skills@background-removal` | Instalado en Phil — **default** |
| 2 | Tool futuro `remove_background` en wavys-agents | Cuando exista en `agent/tools/` |
| 3 | Composición sin cutout | Si el recorte sale mal — usar asset full-bleed o card con fondo pastel |

Instalar skill (una vez):

```bash
npx skills add inference-sh/skills@background-removal -g -y
```

Salida esperada: PNG en la misma carpeta del asset o `data/generated-images/<nombre>-cutout.png`.

### Paso 3 — Componer

| Destino | Acción |
|---------|--------|
| **Flyer HTML/PDF** | `<img src="...-cutout.png">` sobre gradiente o hero |
| **Figma Agente** | Importar PNG → capa sobre fondo glass/aurora |
| **Video HyperFrames** | Asset en `videos/<slug>/assets/`; rol `cutout` en `ASSET-PLAN.md` |
| **Remotion** | `staticFile('...cutout.png')` — ver `remotion-best-practices/rules/transparent-videos.md` si hace falta alpha en video |

### Paso 4 — Validar

- [ ] Bordes sin halo blanco/verde
- [ ] Sujeto no recortado (dedos, bordes del objeto)
- [ ] Contraste legible sobre el fondo final
- [ ] Archivo `-cutout.png` referenciado en entregables / `ASSET-PLAN.md`

---

## Integración por pipeline

| Pipeline | Dónde anotar rol cutout | Doc skill |
|----------|-------------------------|-----------|
| Posts / carruseles | Fase 5 visual | `agent/skills/social_design/SKILL.md` |
| Flyers / brief PDF | Al generar hero u objetos flotantes | `agent/skills/presencia_brief/SKILL.md` |
| Video promo/reel | Fase ③b `ASSET-PLAN.md` — columna `Acción` | `agent/skills/video_production/SKILL.md` |
| Contenido general | Fase 5–6 | `agent/skills/content_production/SKILL.md` |

---

## Pendiente (tool repo)

- [ ] `agent/tools/remove_background.ts` — wrapper local (rembg/sharp) para no depender solo del skill externo
- [ ] Documentar en `agent/connections/` cuando exista

---

## Referencias

- Gemini: `agent/connections/gemini-image.md`
- Guía visual: `agent/context/wavys-visual-brand-guide.md` §5
- Skill recomendado: `agent/context/recommended-skills.md` § Tier 2d
- Video roles: `agent/skills/video_production/SKILL.md` Fase ③b
