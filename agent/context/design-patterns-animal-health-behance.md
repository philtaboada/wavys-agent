# Patrones de diseño — Animal Health (Behance)

**Referencia oficial:** [Animal Health — UX/UI for veterinary clinic](https://www.behance.net/gallery/173417931/Animal-Health-UXUI-for-veterinary-clinic) — Anastasia Sosikova

**Implementación de referencia:** `/Volumes/mac externo/Mac Externo/projects/lumen-vet`  
**Live:** https://lumen-vet.vercel.app

---

## Importancia (Phil — 2026-07-03)

Phil compartió **capturas completas** del diseño Behance y enfatizó que **estos diseños son importantes**. No son inspiración vaga: son la **fuente de verdad visual**.

**Regla permanente:**

1. Cuando Phil (o un brief) cite Behance, Figma o capturas → **replicar layout, tipografía, imágenes y detalles** antes que reinterpretar.
2. Validar **sección por sección** contra las capturas antes de entregar URL.
3. Guardar retro en `website-feedback-log.md`; consultar **este archivo** al codear.

---

## Lenguaje visual global

| Atributo | Valor |
|----------|-------|
| **Estilo** | Bento grid, mucho white space, esquinas muy redondeadas (`2rem` / `rounded-[2rem]`) |
| **Fondo** | Blanco `#ffffff` — **no** hero full-width oscuro ni color block |
| **Acentos** | Pastel: mint, rosa, sky, lavanda, lima, peach, amarillo |
| **Formas UI** | Pills (`border-radius: 9999px`) en botones, tags, search, badges |
| **Tono** | Profesional, cálido, friendly — emojis puntuales en copy (🏥 🐶 🐱 💊 ✉️) |
| **Fotografía** | Studio, mascotas mirando arriba o a cámara, fondo pastel sólido por card |

### Tokens CSS (lumen-vet)

```css
--health-lavender: #d4daf5;   /* CTA hero, cards "ver todos" */
--health-lime: #d8f4a6;       /* Botón "Book online" / Reservar */
--health-purple-bg: #9a93d4;  /* Fondo sección CTA email */
--health-mint: #dceede;
--health-rose: #f5dce4;
--health-sky: #dcecf8;
--health-footer: #2a2d38;     /* Footer esquinas superiores redondeadas */
```

---

## Tipografía

| Rol | Fuente | Uso |
|-----|--------|-----|
| **Display / H1 hero** | **Cormorant Garamond** (serif) | "Veterinary Clinic" / "Clínica Veterinaria" |
| **UI + body** | **Manrope** (sans geométrica) | Nav, labels, párrafos, badges, botones |
| **Labels servicios** | Manrope bold, **11px, UPPERCASE**, tracking wider | "THERAPY", "SURGERY"… |

**Prohibido en este estilo:** Syne, Geist/Inter por default, display font en números/stats.

### Subrayados — CRÍTICO (no usar CSS `text-decoration` en headlines)

| Contexto | Palabra | Estilo correcto | Estilo incorrecto |
|----------|---------|-----------------|-------------------|
| **Hero H1** | "Clinic" / "Veterinaria" | SVG doble trazo **lavanda** `#8fa8e0`, curvas orgánicas, ~3.5px | Línea recta fina `text-decoration: underline` |
| **Statement** | "comfortable" / "cómodos" | SVG doble trazo **negro**, mano alzada | `background: linear-gradient` plano |
| **CTA body** | "email form" | Subrayado fino negro simple | — |

**Componente:** `SketchUnderline` con variantes `hero` (lavanda, grande) y `statement` (negro, pequeño).

### Contrato de implementación (OBLIGATORIO — Phil 2026-07-03, 2ª vez)

| Regla | Correcto | Incorrecto |
|-------|----------|------------|
| **API** | `<SketchUnderline>palabra</SketchUnderline>` envuelve el texto | SVG suelto en `absolute` hermano del texto |
| **Posición SVG** | `absolute -bottom-2` (hero) / `-bottom-1` (statement); trazos en **tercio inferior** del viewBox | Trazos en y=5–8 de viewBox 12px → línea atraviesa letras |
| **Ancho** | `w-[106–108%] left-[-3%]` para cubrir palabra completa | `w-full` sin bleed → línea corta |
| **Altura SVG** | `h-[0.35em]` o `min-h` en em, `preserveAspectRatio="none"` | `height: 0.55rem` fijo desacoplado del font-size |
| **Espaciado** | `que{' '}` o espacio explícito antes del componente | Salto de línea HTML que colapsa → `quehablan` |
| **Line-height H1** | `leading-[1.12]` mínimo cuando hay underline | `leading-[1.06]` → clipping y solapamiento |
| **Validación** | Screenshot zoom hero + statement antes de entregar | Asumir que “hay SVG” = está bien |

**Referencia código:** `lumen-vet/src/components/SketchUnderline.tsx` (Next) — replicar lógica en `.astro`.

---

## Sección 1 — Navbar

```
[Animal Health          ]  [  ≡ Menu  ]  [ 🔍 Search        ]
 quality pet care
```

| Elemento | Patrón |
|----------|--------|
| Logo | Bold + subtítulo "quality pet care" en gris pequeño |
| Menu | **Un solo** botón pill centrado (grid 3 cols: logo \| menu \| search) |
| Search | Pill gris claro, icono + placeholder "Search" — solo desktop |

### Anti-patrón ❌

- **Doble menú:** botón "Menu" centrado + hamburger extra a la derecha en desktop.
- Solución: grid `grid-cols-[1fr_auto_1fr]`, un único `<button>` menu.

---

## Sección 2 — Hero (bento blanco)

Layout desktop — grid 12 columnas, **fondo blanco**:

```
┌─────────────────┬──────────┬────────────────────┐
│ Clínica         │ vet+perro│                    │
│ Veterinaria     │ (wide)   │   vet + gatito     │
│ (serif + sketch)│          │   (vertical grande)│
│ Trabajamos 24/7 │          │   + overlay cards  │
├────────┬────────┤          │                    │
│ gato   │ CTA    │          │                    │
│ circular│ lavanda│          │                    │
└────────┴────────┴──────────┴────────────────────┘
```

| Pieza | Detalle |
|-------|---------|
| H1 | Serif grande; segunda línea con `SketchUnderline variant="hero"` |
| Imagen pequeña | Horizontal, vet examinando perro |
| Imagen circular | Gato en fondo mint — **foto propia**, no recortar misma imagen de otra card |
| Imagen grande | Retrato vertical vet + gatito |
| Overlay cards | 2 cards blancas semitransparentes sobre foto grande: "CHECK UP", "VACCINATION CALENDAR" + flecha |
| CTA lavanda | "Sign up online now" + uppercase subtitle + botón blanco pill "Book online" |

### Anti-patrón ❌

- Hero azul/morado full-width (v1.3)
- Subrayado CSS roto en "Veterinaria"

---

## Sección 3 — Intro centrada

- Párrafo centrado con emojis integrados en el texto
- Botón pill outline: "More about us" / "Más sobre nosotros"

---

## Sección 4 — Services (bento 4×3)

**Grid desktop 4 columnas × 3 filas** — layout Behance:

| Celda | Contenido |
|-------|-----------|
| R1C1 | TERAPIA — gato gris perfil mirando arriba, mint |
| R1C2 | CIRUGÍA — tabby mirando arriba, rosa |
| R1C3 | DIAGNÓSTICO VISUAL — perro b/n, azul cielo |
| R2C1 | Bloque texto descriptivo (sin imagen) |
| R2C2 | LABORATORIO — beagle, amarillo/naranja |
| R2C3 | CARDIOLOGÍA — círculo azul vacío (abstract), fondo blanco |
| R2C4 | ONCOLOGÍA — caniche, verde lima |
| R3C1 | OFTALMOLOGÍA — gato gris de frente, azul |
| R3C2 | REHABILITACIÓN / NEUROLOGÍA — terrier, teal |
| R3C4 | "ALL SERVICES" — lavanda + pill "See all" + flecha |

### Reglas de imagen (Phil — crítico)

1. **Una mascota distinta por card** — nunca reutilizar la misma foto de gato en 4 cards.
2. Fondo pastel **coherente con el color de la card** (generar imagen ya con fondo en Gemini).
3. Badge blanco pill abajo-derecha: `"157 services"` / `"28 servicios"`.
4. Label siempre arriba-izquierda en MAYÚSCULAS.

### Prompt Gemini tipo servicio

```
Studio pet portrait [raza/descripción] [pose: looking upward / at camera / profile right],
solid soft [color] pastel background, veterinary [service] service card,
no text, no logo
```

Archivos referencia en lumen-vet: `svc-therapy.jpg`, `svc-surgery.jpg`, `svc-diagnostics.jpg`, etc.

---

## Sección 5 — Doctors (chat UI)

- Título: "Our doctors" / "Nuestros doctores"
- **Chat bubbles:** pregunta blanca con borde + respuesta mint alineada derecha
- Foto grande vet + mascota con tags pill overlay (`#therapist`, `#vaccination`)
- Mobile: barra lavanda "See all doctors"

---

## Sección 6 — Symptom checker

- Título con emojis perro/gato
- Círculo con foto perro a la izquierda
- Grid 3×4 botones síntoma (pill/rounded rect)
- Hover/click: botón activo en **lavanda**
- Texto descriptivo debajo + pill "Book online"

---

## Sección 7 — Statement

- Headline centrado grande con emoji 💊
- Palabra clave final ("comfortable" / "cómodos") con **`SketchUnderline variant="statement"`** — doble trazo negro manuscrito

---

## Sección 8 — Reviews

- Split 2 columnas
- **Izquierda:** card azul pastel alta, título "Reviews", foto gato en ángulo (bottom-right clip)
- **Derecha:** lista testimonios — avatar circular + nombre bold + texto gris

---

## Sección 9 — Knowledge base

- Título + subtítulo
- Card vertical featured: imagen gato + tag `#cat` + botón "Read all" sobre imagen
- Grid tags pill; tag activo en **lavanda**
- Botón outline "See more"

---

## Sección 10 — CTA email (Phil: "muy bonito")

**Patrón exacto Behance:**

```
┌────────────────────────────────────────────────── purple bg (#9a93d4)
│  ┌────────────────────────────────────────────┐
│  │ ⭕ perro nariz    → Using our email form ✉️ │  white card rounded
│  │   papel azul      Or online booking         │
│  │                   [ Book online ] lime pill │
│  └────────────────────────────────────────────┘
└──────────────────────────────────────────────────
```

| Elemento | Detalle |
|----------|---------|
| Fondo sección | Morado/lavanda saturado — **no** gris plano |
| Card interior | Blanca, `rounded-[2rem]`, padding generoso |
| Imagen | Círculo: **perro asomándose por hueco en papel azul** (`cta-dog-nose.jpg`) |
| Copy | Flecha → + "email form" subrayado + emoji ✉️ |
| Botón | Verde lima pill "Book online" |

### Anti-patrón ❌

- Fondo `bg-health-surface` gris sin card blanca
- Foto genérica de cachorro sin concepto "nariz en papel"

---

## Sección 11 — Footer

- Fondo `#2a2d38`, **`rounded-t-[3rem]`**
- Logo ANIMAL HEALTH + quality pet care
- Columnas: Navegación, Redes, Contacto (iconos + dirección + tel)

---

## Checklist fidelidad Behance (pre-deploy)

Usar **obligatoriamente** en sitios con referencia visual Phil:

- [ ] Navbar: un solo Menu, search solo desktop
- [ ] Hero: bento blanco, serif + sketch lavanda SVG (no CSS underline)
- [ ] Servicios: 4×3 grid, **imagen única por card**, badges servicios
- [ ] Cardiología: círculo abstracto azul
- [ ] Doctors: chat bubbles
- [ ] Statement: sketch negro en palabra final
- [ ] CTA: morado + card blanca + perro papel azul + botón lima
- [ ] Footer oscuro redondeado arriba
- [ ] Screenshots 390px + 1440px comparados mentalmente con capturas Phil

---

## Errores documentados (no repetir)

| Error | Corrección |
|-------|------------|
| Misma foto gato en 4+ cards servicios | 1 imagen Gemini única por servicio |
| `text-decoration` en hero | `SketchUnderline variant="hero"` |
| Doble menú navbar | Grid 3 cols, 1 botón |
| CTA gris plano | Purple bg + white card + cta-dog-nose |
| Hero color block azul | Bento blanco |
| Stats con Syne superpuestos | tabular-nums + sans en números |
| Reinterpretar Behance sin mirar capturas | Replicar sección por sección |

---

## Assets generados (lumen-vet)

| Archivo | Uso |
|---------|-----|
| `hero-vet-dog.jpg` | Hero imagen horizontal |
| `hero-kitten.jpg` | Hero retrato grande |
| `hero-cat-circle.jpg` | Hero círculo mint |
| `cta-dog-nose.jpg` | CTA perro + papel azul |
| `svc-therapy.jpg` … `svc-rehab.jpg` | Grid servicios (7 únicos) |
| `reviews-cat.jpg` | Card reseñas |

---

## Cuándo leer este archivo

- Skill `one_call_website` — fase 2 (brand) y fase 5 (build) si hay referencia Behance/Figma
- Cualquier pedido Phil de "hazlo como las fotos" / "muy similar al Behance"
- Antes de generar imágenes Gemini para landings veterinarias premium
- Al recibir feedback visual comparando capturas

**Relacionados:** `website-feedback-log.md`, `agent/skills/one_call_website/SKILL.md`, componentes en `lumen-vet/src/components/`.
