# Patrones de diseño — Restaurante editorial oscuro (investigación web)

**Fuentes (2026-07-04):**
- [Maison Noir — GoSmartR](https://gosmartr.co.uk/work/maisonnoir) — tipografía revista, numerales romanos, stat strip de servicio
- [SEM Restaurant — Dot The I](https://www.dotthei.studio/project/sem-restaurant) — fondo oscuro + acento cálido, citas grandes, fotografía protagonista
- [Ingleside — Terris](https://terris.sg/portfolio/ingleside) — hero atmosférico cobre/ámbar, pilares con script accent
- [Haven — Holarara](https://www.holarara.com/work/haven-luxury-restaurant-homepage-design) — editorial cinematográfico, grotesk + serif
- [createtoday — Squarespace Restaurant](https://createtoday.io/examples?category=restaurant&platform=squarespace) — hero compacto 50–60vh, dual CTA, sin full-screen vacío

**Implementación:** `/Volumes/mac externo/Mac Externo/projects/altar-lena`

**Comparación batch (vs `taste-restaurante` — demo Taste Skill, misma sesión):**

| Patrón | taste-restaurante (Taste) | Este proyecto (pipeline Wavys) |
|--------|---------------------------|--------------------------------|
| Stack | Next.js + Framer Motion | **Astro** + CSS mínimo |
| Hero | Split 50/50 crema + glass card | **Full-bleed oscuro ~55vh** + overlay tipográfico |
| Nav | Links simples | Barra oscura + **pill Reservar** persistente |
| Marquee | Sí (kinetic band) | **No** — stat strip editorial horizontal |
| Tipografía | Playfair + Outfit | **Libre Baskerville + Source Sans 3** |
| Carta | Grid 2+1+1 cards overlay | **Zig-zag editorial** imagen/texto alternado |
| Motion | Magnetic buttons, loops infinitos | Scroll reveal CSS + `prefers-reduced-motion` |
| Imágenes | Picsum aleatorio | **Gemini** fotorealistas por slot |
| Filosofía | Lista numerada 01–03 | **Dos columnas revista** + numeral romano |
| Acento | Terracota `#b4533c` | **Cobre/ámbar `#c17f4a`** |
| Footer | Charcoal plano | Oscuro con **borde superior suave** |

---

## Brief

| Campo | Valor |
|-------|-------|
| Marca | **Altar de Lena** |
| Tipo | Fine dining / brasas, Lima |
| Tono | Cinematográfico, íntimo, literario |
| CTA | Reservar mesa |
| Deploy | Solo local (Phil no pidió Vercel) |

---

## Lenguaje visual

| Atributo | Valor |
|----------|-------|
| **Estructura** | Guest journey: impresión → datos de servicio → lectura → platos → reserva |
| **Fondo** | Carbón cálido `#141210` / superficie `#1f1b18` |
| **Acento** | Cobre `#c17f4a` (único, saturación <80%) |
| **Texto** | Crema `#f3ebe3`, muted `#9a8f84` |
| **Hero** | Full-bleed foto oscura, **compacto** (~55dvh), texto anclado abajo-izq |
| **Platos** | Zig-zag 3 ítems — nunca 3 cards iguales en fila |
| **Motion** | Fade-up on scroll (Intersection Observer o CSS), sin loops perpetuos |
| **CTA** | Pill cobre "Reservar mesa" en nav + hero + sección final |

## Tipografía

| Rol | Fuente | Por qué |
|-----|--------|---------|
| Display | **Libre Baskerville** | Serif sensorial editorial — distinta a Playfair (Taste) y Fraunces (florería) |
| Body + stats | **Source Sans 3** | Legible, `tabular-nums` en stat strip — no Outfit, no Plus Jakarta del batch reciente |

**Regla:** `.stat-value` siempre Source Sans, nunca display font.

## Secciones (ASCII)

```
[NAV] Logo izq · links centro · pill Reservar der
[HERO] ████████████████████ full-bleed imagen
       "Cocina de lena y sal" (abajo izq, crema)
       [Reservar] [Ver carta]
[STAT STRIP] 6 celdas: Cursos | Ticket | Vinos | Duración | Mesas | Servicio
[FILOSOFÍA I] Dos columnas prose — numeral romano "I" grande a la izq
[PLATOS] Zig-zag:
  [img grande] — texto der
  texto izq — [img]
  [img] — texto der
[CITA] Blockquote ancho completo — fondo surface
[RESERVA] Formulario labels arriba · card surface · fondo oscuro
[FOOTER] rounded-t-3xl · contacto · disclaimer demo
```

## Componentes previstos

| Archivo | Rol |
|---------|-----|
| `src/layouts/Layout.astro` | Fonts, meta, grain |
| `src/components/Navbar.astro` | Nav + pill CTA |
| `src/components/Hero.astro` | Full-bleed compact |
| `src/components/StatStrip.astro` | 6 celdas servicio |
| `src/components/Philosophy.astro` | Editorial II cols |
| `src/components/DishZigzag.astro` | 3 platos alternados |
| `src/components/QuoteBand.astro` | Cita SEM-style |
| `src/components/Reservation.astro` | Form + estados |
| `src/components/Footer.astro` | Pie redondeado |
| `src/styles/global.css` | Tokens |

## Imágenes Gemini (slots)

| Archivo | Ratio | Prompt mood |
|---------|-------|-------------|
| `hero.jpg` | 16:9 | Interior restaurante oscuro, velas, brasas, sin texto |
| `dish-lomo.jpg` | 4:3 | Lomo a la brasa emplatado, luz cálida |
| `dish-corvina.jpg` | 4:3 | Pescado en caldo, cerámica oscura |
| `dish-postre.jpg` | 4:3 | Postre artesanal, mesa madera |
| `ambient.jpg` | 16:9 | Mesa servida, copas, ambiente íntimo |

## DO / DON'T

**DO:** stat strip, hero compacto, zig-zag platos, numerales romanos, Gemini único por slot, labels form con `for`/`id`, touch 44px.

**DON'T:** marquee, bento, 3 cards blancas, Playfair+Outfit, picsum, Framer loops, purple gradient, stats en display font, hero 100vh centrado.

## Checklist pre-entrega

- [ ] Doc leído antes de codear
- [ ] Diferenciado de taste-restaurante en tabla
- [ ] `bun run build` OK
- [ ] Screenshots 390px + 1440px
- [ ] `prefers-reduced-motion`
- [ ] Sin deploy
