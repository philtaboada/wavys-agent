# Skill — Brief comercial Presencia Digital / Presencia Tienda

**Usar siempre** cuando Phil pida un brief, PDF comercial, reescritura de `BRIEF-*.md` o `brief-presencia-*.html`.

**Gate 0 (pasos):** `agent/context/pipeline-gates.md` § `presencia_brief`

**Gate 1+ (calidad):** mismo doc § Gate 1+ `presencia_brief` — `data/pipeline-runs/<variant>-brief-validation.md` (plantilla `_TEMPLATE-brief-validation.md`)

---

## Regla madre

1. Leer **`data/presencia-digital-brief/STORYTELLING-GUIA.md`** — arco 5 actos, **sin precio hasta el final**.
2. Copiar **estructura visual** de `brief-presencia-digital.html` (CSS, cover, story box, quote-box, includes, steps, FAQ, CTA).
3. **Nunca** abrir con pricing, tablas de planes ni S/229 en portada.
4. Precios → **último capítulo antes de FAQ** (capítulo «Inversión»).
5. Regenerar PDF: `cd data/presencia-digital-brief && bun run generate-pdf.ts`

---

## Arco obligatorio (5 actos → capítulos PDF)

| Capítulo PDF | Acto | Contenido |
|--------------|------|-----------|
| Cover | Hook | Historia emocional, **sin precio** |
| 01 · Tu historia | Contexto + tensión | Story box + tabla pérdidas + quote |
| 02 · La resolución | Resolución | Qué es el servicio, includes grid, imagen |
| 03 · Suscripción | Modelo | 12 meses → luego opcional |
| 04 · (específico) | Detalle producto | Tienda: flujo WhatsApp / Landing: BYO fotos |
| 05 · Proceso y prueba | Prueba | 4 pasos + portafolio o credenciales |
| 06 · Inversión | Precio | **Solo aquí** el plan y S/ |
| 07 · FAQ | Objeciones | |
| CTA final | CTA suave | Sin presión, 5 minutos |

---

## Qué brief usar

| Cliente | Markdown | HTML → PDF |
|---------|----------|------------|
| Landing, servicios | `BRIEF-CLIENTE.md` | `brief-presencia-digital.html` |
| Catálogo, consulta WhatsApp | `BRIEF-CATALOGO-CLIENTE.md` | `brief-presencia-catalogo.html` |
| Tienda, carrito, retail | `BRIEF-TIENDA-CLIENTE.md` | `brief-presencia-tienda.html` |

---

## Assets visuales (flyer / PDF / slides)

Si el flyer o brief necesita **objetos flotantes** (icono, laptop, producto, 3D) sobre fondo de campaña:

1. Generar con Gemini (`generate_image`) — fondo **blanco plano** si habrá recorte
2. **Quitar fondo** → PNG transparente — pipeline: `agent/context/image-cutout-pipeline.md`
3. Componer en HTML flyer o Figma sobre gradiente mint/hero

**No cutout** cuando la imagen es hero full-bleed (como `flyer-hero-website-suscripcion.jpg`).

---

## Pre-entrega — subagente + gate

1. **`shell`** — `validate_pipeline` (`presencia_brief`, variant, `htmlPath`/`pdfPath`) — ver `agent/pipelines/subagents.md`
2. Checklist manual abajo (precio solo cap 06, story box, PDF mtime > HTML)

## Checklist antes de entregar

- [ ] ¿Cover sin precio?
- [ ] ¿Story box en capítulo 1?
- [ ] ¿Quote memorable?
- [ ] ¿Includes grid (6 ítems)?
- [ ] ¿Suscripción explicada antes de precio?
- [ ] ¿Imágenes slide (cover-story, slide-02, slide-05)?
- [ ] ¿PDF regenerado?

---

## Tono

- Español Perú, tú, consultivo
- Problema del PYME real (WhatsApp, Google, catálogo caótico)
- Wavys = suscripción accesible vs agencia landing S/1,500+ / e-commerce S/4,000–5,000+ de golpe
- CTA: *«Te explicamos en 5 minutos — sin compromiso»*
