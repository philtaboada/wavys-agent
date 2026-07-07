# Patrones de diseño — Florería editorial (Pinterest / top florist sites)

**Fuentes de investigación (2026-07-03):**
- [createtoday — 47 Best Florist Websites](https://createtoday.io/examples?category=florist)
- [createtoday — Squarespace Florist](https://createtoday.io/examples?category=florist&platform=squarespace)
- [Lorena Eni Flowers — editorial Shopify](https://omnycode.com/lorena-eni-flowers-custom-shopify-store/)
- [Bloom masonry florist template](https://www.rocket.new/templates/petals-flower-arrangements-landing-page-template)
- Paridad de método con `design-patterns-animal-health-behance.md`

**Implementación:** `/Volumes/mac externo/Mac Externo/projects/petalo-floreria`

---

## Importancia

**Sin capturas Phil ≠ improvisar.** Si no hay pin, el agente debe **investigar 3+ referencias reales** de la industria, documentar patrones aquí (o `design-patterns-<slug>.md`) y **solo entonces** codear.

**Anti-slop:** El layout “hero split + 3 cards iguales + formulario verde” es plantilla IA. Prohibido como default.

---

## Lenguaje visual global

| Atributo | Valor |
|----------|-------|
| **Estilo** | Editorial asimétrico, masonry, bento, mucho aire |
| **Fondo** | Crema cálida `#f7f4ef` — no blanco puro ni dark mode |
| **Acentos** | Mauve polvoriento, sage oscuro, butter, blush, terracotta |
| **Formas** | Blobs orgánicos, círculos/óvalos en fotos, pills en nav/CTA |
| **Movimiento** | Marquee horizontal (texto repetido), hover suave en cards |
| **Fotografía** | Lifestyle golden hour; cards con fondo pastel sólido cuando aplica |
| **Tono copy** | Transformación emocional (“de X a Y”), no catálogo de features |

### Tokens CSS

```css
--flor-cream: #f7f4ef;
--flor-cream-dark: #efe9e0;
--flor-ink: #2c2825;
--flor-mauve: #6b5a62;
--flor-sage: #3d4f44;
--flor-sage-light: #dce8e4;
--flor-blush: #f2ddd8;
--flor-butter: #f0e6c8;
--flor-terracotta: #c4785a;
--flor-dusty-rose: #b8a0a8;
```

---

## Tipografía

| Rol | Fuente | Uso |
|-----|--------|-----|
| **Display** | **Fraunces** (serif cálida) | H1 hero, citas, statements |
| **UI + body** | **Outfit** (sans geométrica) | Nav, labels, body, marquee |
| **Labels** | Outfit semibold, 11px UPPERCASE, tracking wide | "RAMOS", "EVENTOS" |

**Subrayado hero:** SVG sketch — ver contrato en `design-patterns-animal-health-behance.md` § Contrato de implementación. **Siempre** `<SketchUnderline>palabra</SketchUnderline>`.

**Prohibido:** Cormorant+DM Sans por default en florería (ya usado en vet demo), gradientes genéricos purple-pink, emoji ✿ como logo.

---

## Sección 1 — Navbar (grid 3 columnas)

```
[ Pétalo          ]  [  ≡ Menú  ]  [ Pedir flores 🔍 ]
 florería artesanal
```

| Elemento | Patrón |
|----------|--------|
| Logo | Serif + subtítulo gris pequeño |
| Centro | **Un** pill "Menú" (no links sueltos en desktop si referencia editorial) |
| Derecha | Pill CTA terracotta + opcional search pill |
| Mobile | `details/summary` — un solo menú |

---

## Sección 2 — Hero bento asimétrico

**NO:** split 50/50 simétrico con card flotante "Desde S/ 45".

**SÍ:** grid 12 cols, texto ~7 cols, visual ~5 cols.

```
┌─────────────────────────────┬──────────────┐
│ ETIQUETA PILL               │   ╭──────╮   │
│ H1 serif + sketch underline │   │ blob │   │
│ párrafo                     │   │ img  │   │
│ [CTA prim] [CTA sec]        │   ╰──────╯   │
│                             │  ┌────────┐  │
│                             │  │ card   │  │
│                             │  │ butter │  │
│                             │  └────────┘  │
└─────────────────────────────┴──────────────┘
```

- Imagen principal: `clip-path` blob u óvalo
- Card overlay pastel (butter/blush) con precio u oferta
- Badge pill "Entrega hoy" desplazado

---

## Sección 3 — Marquee

Banda full-width con texto repetido en scroll infinito CSS:

`ENVÍO HOY · FLORES DE TEMPORADA · RAMOS A MEDIDA · BODAS ·`

- Fondo sage o terracotta suave
- `prefers-reduced-motion`: texto estático

---

## Sección 4 — Servicios bento (no 3 cards iguales)

Grid irregular:

| Celda | Contenido |
|-------|-----------|
| 2×2 grande | Eventos / bodas — imagen lifestyle |
| 1×1 | Ramos — fondo blush + foto pequeña circular |
| 1×1 | Plantas — fondo sage-light |
| 1×2 vertical | Suscripción — copy + CTA |

Cada celda: fondo pastel distinto + label UPPERCASE 11px.

---

## Sección 5 — Galería masonry

2 columnas con `aspect-ratio` variado (4/5, 1/1, 3/4, 16/9).

- Una imagen por slot — **nunca repetir**
- Overlap opcional entre celdas (`-mt-8` en alternas)
- Precio en pill sobre imagen, no en card genérica

---

## Sección 6 — Statement + About

- Statement full-width: cita grande Fraunces italic + `SketchUnderline` en palabra clave
- About: foto circular del taller + grid 2×2 features con bordes suaves

---

## Sección 7 — CTA (color stacking)

Como Animal Health CTA:

- Fondo sage oscuro o mauve
- **Card blanca interior** con formulario
- No formulario partido verde/blanco plano

---

## Sección 8 — Footer

- Fondo `#3d4f44`
- `border-radius` superior grande (`rounded-t-[3rem]`)
- Links en crema, no footer gris plano

---

## Checklist pre-entrega (florería)

- [ ] Doc patrones creado **antes** de codear
- [ ] Hero asimétrico (no 50/50)
- [ ] Marquee o elemento editorial de movimiento
- [ ] Bento/masonry (no grid 3× idéntico)
- [ ] ≥1 forma orgánica (blob/círculo) en imágenes
- [ ] Sketch underline en H1 o statement — **validar screenshot** (no atraviesa letras)
- [ ] Imagen única por card
- [ ] Sin emoji como iconografía de marca
- [ ] `prefers-reduced-motion` en marquee

## Anti-patrones

1. Hero simétrico + stats en fila (plantilla SaaS)
2. Cards blancas con sombra `shadow-lg` repetidas ×6
3. Paleta rose/sage/cream sin investigar competencia
4. Saltar fase de referencia porque Phil no mandó pin
5. Tipografía ya usada en otro demo del mismo batch
