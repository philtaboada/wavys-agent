# Website feedback log — Phil

Retroalimentación acumulada para **one-call websites** y landings. El agente debe leer esto al iniciar `one_call_website`.

---

## 2026-07-03 — Lumen Vet (veterinaria demo)

### Qué pidió
- Crear website completa veterinaria en una llamada (proyecto + Vercel + imágenes + animaciones)
- Documentar pipeline como skill futuro (`one_call_website`)
- **Registrar retroalimentación** en el repo

### Retro adicional (misma sesión)
| Tema | Feedback Phil |
|------|----------------|
| **Tipografía** | El agente debe **saber elegir tipografías** siempre — no improvisar ni usar defaults (Inter/Geist/Roboto) |
| **Validación UX** | **Siempre** validar que la UI/UX no esté rota antes de entregar (mobile + desktop) |

### Qué sí funcionó (Lumen Vet v1)
- Branding distintivo (Lumen Vet, paleta emerald/coral)
- Imágenes Gemini integradas
- Animaciones Framer Motion
- Deploy Vercel OK: https://lumen-vet.vercel.app
- Syne + DM Sans cargan correctamente (verificado en prod)

### Qué no funcionó / mejorar (auditoría UX 2026-07-03)
| Issue | Severidad | Detalle |
|-------|-----------|---------|
| Hero mobile sin imagen above-the-fold | Alta | En 390px solo se ve texto sobre fondo oscuro; imagen queda muy abajo |
| H1 line-height muy apretado en mobile | Media | 48px/49px line-height; riesgo de clipping visual |
| Sin `prefers-reduced-motion` | Media | Animaciones siempre activas |
| Labels formulario sin `htmlFor`/`id` | Media | Accesibilidad forms |
| Sin `metadataBase` | Baja | Warning en build OG URLs |
| Quote filosofía `-right-4` en mobile | Baja | Puede desbordar viewport |

### Reglas derivadas (permanentes)

1. **Tipografía obligatoria:** leer skill `one_call_website` § Tipografía + instalar/referenciar `web-typography` o `ui-ux-pro-max` (font pairings). Elegir par display+body **por industria/tono** antes de codear.
2. **Validación UX obligatoria:** fase 5.5 antes de deploy — build + screenshots mobile (390px) + desktop (1440px) + checklist accesibilidad/responsive. **No entregar URL sin pasar gate.**
3. **Guardar retro:** cada ronda de feedback Phil → entrada aquí + actualizar skill si aplica.

### Skills recomendados (tipografía + UX)

| Skill | Installs | Para qué |
|-------|----------|----------|
| `wondelai/skills@web-typography` | ~4.6K | Escalas tipográficas, pairing, legibilidad web |
| `onewave-ai/claude-skills@font-pairing-suggester` | ~355 | Sugerir pares display+body por mood |
| `nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max` | ~248K | 57 font pairings, 99 UX guidelines, audit UI |
| `mblode/agent-skills@typography-audit` | ~354 | Auditar tipografía post-build |

```bash
npx skills add wondelai/skills@web-typography -g -y
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max -g -y
```

### v1.1 — Fixes post-auditoría (2026-07-03)

| Fix | Estado |
|-----|--------|
| Hero mobile imagen above-the-fold | ✅ `flex-col-reverse` |
| H1 line-height mobile | ✅ `leading-[1.08]` |
| `prefers-reduced-motion` | ✅ globals.css |
| Form labels `htmlFor` | ✅ Booking |
| `metadataBase` | ✅ layout.tsx |
| Quote filosofía overflow mobile | ✅ relative en mobile |

Prod redeploy: https://lumen-vet.vercel.app

---

## 2026-07-03 — Tipografía Lumen Vet (Phil)

### Qué pidió
- Instalar `web-typography` skill
- La tipografía sigue fea — **no le gusta Syne**
- Stats rotos (números superpuestos en captura)

### Qué no funcionó
| Issue | Causa |
|-------|-------|
| Números 18,400 / 98% encimados | Syne ultra-ancha + `font-display` en contadores + grid 4 cols estrecho |
| Look general "feo" | Syne demasiado geométrica/tech para veterinaria boutique |

### Corrección aplicada (v1.2)
- **Display:** Fraunces (serif cálida, semibold en headings)
- **Body + números:** Plus Jakarta Sans con `tabular-nums`
- Clase `.stat-value` — **nunca** display font en métricas
- Stats grid: `grid-cols-2` mobile → `lg:grid-cols-4`, `min-w-0`

### Reglas derivadas
1. Leer `web-typography` skill antes de elegir fuentes
2. **Type for a moment** (Fraunces) solo en headlines; **type to live with** (Jakarta) en body y stats
3. Probar números largos (`18,400+`, `98%`) en viewport real antes de deploy

### Skill instalado
`wondelai/skills@web-typography` → `~/.agents/skills/web-typography`

---

## 2026-07-03 — Animal Health fidelidad Behance (Phil)

### Qué pidió
- Revisar capturas del diseño Behance original y que la web sea **muy similar**
- Referencia: [Animal Health UX/UI](https://www.behance.net/gallery/173417931/Animal-Health-UXUI-for-veterinary-clinic)

### Qué no funcionó (v1.3 anterior)
| Issue | Detalle |
|-------|---------|
| Hero azul full-width | Behance usa bento blanco con collage de imágenes |
| Sin serif en headline | "Veterinary Clinic" usa serif + subrayado sketch |
| Navbar incompleta | Faltaba "quality pet care", Menu pill, Search |
| Secciones faltantes | Symptom checker, chat doctores, knowledge base, footer oscuro redondeado |

### Corrección aplicada (v2 — Behance-faithful)
- **Tipografía:** Cormorant Garamond (headlines) + Manrope (UI/body)
- **Hero bento:** grid 12 cols, imagen circular mint, CTA lavanda, cards overlay CHECK UP / CALENDARIO
- **Secciones:** AboutIntro emojis, Services bento 3×3 uppercase + badges, Doctors chat bubbles, SymptomChecker, Statement, Reviews, KnowledgeBase tags, CTA lima, Footer `#2a2d38` rounded-top
- **Deploy:** https://lumen-vet.vercel.app

### Reglas derivadas
1. Cuando Phil comparte referencia visual (Behance/Figma), **replicar layout** (bento, pills, pastel cards) antes que reinterpretar
2. Hero claro sobre fondo blanco ≠ hero oscuro/color block — validar contra captura
3. Serif solo en display headline; sans en todo lo demás
4. **Patrones guardados:** `agent/context/design-patterns-animal-health-behance.md` — leer siempre que haya capturas Phil

---

## 2026-07-03 — Guardar patrones de diseño (Phil)

### Qué pidió
- Tras enviar **todas las fotos/capturas** del Behance, que el agente **guarde los patrones**
- Enfatizó: **esos diseños son importantes** — hay que entenderlos y aplicarlos

### Acción
- Creado `agent/context/design-patterns-animal-health-behance.md` — fuente de verdad visual sección por sección
- Enlazado desde `agent/context/README.md` y skill `one_call_website`

### Reglas derivadas
1. Referencia visual Phil = **documento de patrones**, no memoria de chat
2. Antes de entregar web con capturas: checklist fidelidad en ese archivo
3. Imágenes: **una mascota distinta por card**; subrayados hero = SVG lavanda, no CSS
4. CTA email: morado + card blanca + perro nariz en papel azul

---

## 2026-07-03 — Stack websites: Astro vs Next (Phil)

### Qué pidió
- **Landing** → Astro
- **Sistema / automatización** → Next.js
- Guardar regla — siempre pedirá crear websites

### Acción
- `agent/context/website-stack-rules.md`
- `agent/skills/one_call_landing/SKILL.md` (Astro)
- `one_call_website` enfocado en Next (sistemas)
- Regla en `agent/instructions.md`

### Reglas derivadas
1. Landing / website marketing = **Astro**
2. Sistema, app, dashboard, automatización = **Next.js**
3. `lumen-vet` = referencia UI Next (pre-regla)

---

## Plantilla (añadir entradas nuevas)

```markdown
## YYYY-MM-DD — [proyecto / industria]

### Qué pidió
### Qué no funcionó (UX / tipografía / visual)
### Qué sí funcionó
### Reglas derivadas
```

---

## 2026-07-03 — Pétalo Florería (demo sin capturas)

### Qué pidió
- Landing florería en local (sin deploy)
- Mejorar diseño: parecía muy IA / genérico
- Preguntó si se usó la guía; mejorar la guía si hace falta

### Qué no funcionó (v1)
| Issue | Detalle |
|-------|---------|
| Sin investigación previa | Se codeó directo plantilla hero split + 3 cards + formulario verde |
| Look "AI slop" | Cormorant+DM Sans, emoji ✿, stats SaaS, cards blancas repetidas |
| Guía incompleta | `one_call_landing` solo exigía referencia **si Phil mandaba capturas** |
| Sin doc patrones | No existía `design-patterns-florist-*.md` antes de codear |

### Corrección aplicada (v2 — editorial Pinterest)
- **Investigación:** createtoday florist examples, Lorena Eni, masonry templates
- **Doc:** `design-patterns-florist-editorial-pinterest.md`
- **Layout:** hero asimétrico 7/5, blob mask, bento servicios, masonry galería, marquee, statement con sketch underline
- **Tipografía:** Fraunces + Outfit (no repetir pares de otros demos)
- **Skill actualizado:** Fase 1.5 obligatoria — investigar aunque no haya pin

### Reglas derivadas
1. **Sin capturas Phil ≠ improvisar** — buscar 3+ referencias reales y documentar patrones **antes** de scaffold
2. Prohibido default "3 cards iguales + hero simétrico" en landings artesanales
3. Por industria: crear `design-patterns-<slug>.md` en cada website nueva
4. Actualizar `one_call_landing` cuando Phil reporte slop genérico

---

## 2026-07-03 — Pipeline fijo websites cliente (Phil)

### Qué pidió
- Siempre seguir la misma forma al crear website de cliente
- Actualizar la guía con todo lo aprendido (investigación, diferenciación, sketch, deploy condicional)

### Acción
- `one_call_landing/SKILL.md` reescrito — pipeline ⓪→⑨ con gates
- `website-stack-rules.md` — sección pipeline cliente
- `agent/instructions.md` — flujo obligatorio resumido
- `reference_ui_copy` — orden actualizado

### Reglas derivadas (permanentes)
1. **Mismo pipeline siempre:** investigar → doc patrones → build → validar → entregar
2. **Doc antes de scaffold** — sin excepción
3. **Diferenciación** vs website anterior del batch — tabla obligatoria
4. **Deploy** solo si Phil lo pide explícitamente
5. Añadir fila a historial en `one_call_landing` por cada proyecto nuevo

---

## 2026-07-03 — SketchUnderline roto (Pétalo, 2ª vez Phil)

### Qué pidió
- Las líneas del subrayado sketch no quedan bien (cruzan las letras, palabras pegadas)

### Qué no funcionó
| Issue | Causa |
|-------|-------|
| Línea atraviesa "hablan" | SVG posicionado con `-bottom-1` y trazos en mitad del viewBox (y=5–10 / 12) |
| `quehablan` sin espacio | Salto de línea HTML entre `que` y `<span>` colapsó el espacio |
| Patrón incorrecto | SVG como hermano absoluto, no componente que envuelve la palabra |
| 2ª repetición | Misma falla que en auditorías anteriores — reglas existían pero sin contrato técnico |

### Corrección aplicada
- `SketchUnderline.astro` reescrito: slot envuelve palabra, trazos en tercio inferior viewBox, `-bottom-2`, `w-[108%]`
- Hero: `Flores que{' '}<SketchUnderline>hablan</SketchUnderline>`, `leading-[1.12]`
- Contrato añadido en `design-patterns-animal-health-behance.md` + gate en `one_call_landing`

### Reglas derivadas (permanentes)
1. **SketchUnderline siempre envuelve children** — nunca SVG suelto al lado
2. Validar con **screenshot zoom** H1/statement antes de entregar
3. Copiar implementación de `lumen-vet/src/components/SketchUnderline.tsx` si hay duda
4. Entrada en checklist pre-deploy de **toda** landing con subrayado sketch

---

## 2026-07-03 — Miga pastelería clonaba florería (Phil)

### Qué pidió
- Diseño creativo distinto; buscar Pinterest/UX pastelería
- No repetir mismos patrones que Pétalo

### Qué no funcionó (v1 Miga)
- Mismo playbook: marquee, bento, sketch underline, navbar pill, hero asimétrico crema

### Corrección v2 — playful Pinterest
- Referencias: MARI scalloped, Clyde's dark hero + orange highlight, circular text, Good/goods script+slab
- Hero **oscuro** chocolate, fotos superpuestas, slab + naranja en "dulce"
- Tira productos edge-to-edge 4 cols
- Scalloped cards + doodles + badge circular rotatorio
- Split blush/cream para pedido
- Tipografía Archivo Black + Caveat + Source Sans 3
- Doc: `design-patterns-bakery-playful-pinterest.md`
- Regla skill: comparar con proyecto anterior del batch

### Reglas derivadas
1. **Misma sesión / batch** → prohibido reutilizar componentes del proyecto previo
2. Investigación debe nombrar qué **no** copiar del demo anterior
3. **Citar referencias en el doc no basta** — la tabla de diferenciación debe reflejarse en componentes reales (marquee, masonry, hero full-bleed, etc.)
4. Si el layout final sigue siendo hero split + pills + grid + testimonios → **rechazado**, rehacer

---

## 2026-07-03 — Suave Hogar v1 slop (Phil)

### Qué pidió
- Web negocio toallas, medias, ropa interior
- Reclamó: investigación no existió, mismo patrón de siempre

### Qué no funcionó (v1)
| Issue | Detalle |
|-------|---------|
| Investigación performativa | Doc creado pero layout = plantilla genérica |
| Hero split 50/50 + collage | Anti-patrón Pétalo v1 |
| Pills + 4 cards + grid badges + trust 3 cols + 2 testimonios | Plantilla e-commerce IA |
| Paleta crema+terracota sin dirección | Sin identidad vs batch |

### Corrección v2
- Referencias reales: Doua Socks, Pacas, Delicate Weaves, Linen Works, Betasaurus masonry
- Hero **full-bleed** overlay bottom-left
- **Marquee** promo
- **Paneles split** categorías (no pills)
- **Masonry discovery** + carousel horizontal
- Verde bosque editorial + Lora/Nunito Sans
- Doc reescrito: `design-patterns-textiles-suave-hogar.md`
