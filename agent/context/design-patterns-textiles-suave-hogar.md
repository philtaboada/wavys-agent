# Patrones — Textiles / toallas / medias / ropa interior (v2 investigado)

**Fecha:** 2026-07-03 · **Proyecto:** `suave-hogar` · **Corrección:** v1 era plantilla IA (hero split + pills + grid + testimonios)

---

## Fuentes investigadas (nombradas — obligatorio citar)

| # | Referencia | URL | Qué copiamos |
|---|------------|-----|--------------|
| 1 | **Doua Socks** | [createtoday — Accessories](https://createtoday.io/examples?category=accessories&tag=ecommerce) | Hero lifestyle + tagline "Your Step. Your Story." · **marquee promo** horizontal · tonos tierra #f5f5f0 + burdeos |
| 2 | **Pacas** (calcetines alpaca) | [createtoday — Footwear Shopify](https://createtoday.io/examples?category=footwear&platform=shopify) | Headline sensorial MAYÚSCULAS · marquee de categorías perpetuo · texto hero **esquina inferior-izquierda**, no centrado |
| 3 | **Delicate Weaves** (textil artesanal) | [Case study Yana Harcourt](https://yanaharcourt.dev/Cachepot%20Shop/delicate-weaves.html) | **Verde profundo editorial** · grid asimétrico · cards desiguales · fotos en contexto real · premium sin cards blancas idénticas |
| 4 | **The Linen Works** | [Studio Noel](https://studionoel.co.uk/work/the-linen-works/) | Lookbook editorial · fondos tonales apagados · tipografía espaciada · producto + lifestyle mezclados |
| 5 | **Why Look West / Betasaurus masonry** | [Pinterest-style Shopify](https://www.betasaurus.com/pinterest-style-shopify-discovery-layouts) | Masonry discovery: producto + cita editorial + swatch textura en misma cuadrícula |
| 6 | **Kind Laundry** | [createtoday — Cleaning](https://createtoday.io/examples?category=cleaning-products) | Marquee certificaciones · prueba social cuantificada above-the-fold |

---

## v1 — Qué falló (Phil)

| Anti-patrón detectado | Presente en v1 |
|----------------------|----------------|
| Hero split 50/50 texto + collage | ✗ Sí |
| Pills categoría scroll horizontal | ✗ Sí |
| 4 cards categoría iguales | ✗ Sí |
| Grid productos + badges "Nuevo/Más vendido" | ✗ Sí |
| Trust 3 columnas iconos | ✗ Sí |
| 2 testimonios en cards | ✗ Sí |
| Formulario terracota genérico | ✗ Sí |
| Investigación solo citada en chat, no aplicada al layout | ✗ Sí |

**Prohibido repetir en v2:** cualquier componente de la lista anterior.

---

## Tabla diferenciación batch

| Patrón | fc-altamar | suave-hogar v1 (malo) | **suave-hogar v2** |
|--------|------------|----------------------|---------------------|
| Hero | Estadio oscuro + scoreboard | Split crema + collage | **Full-bleed lifestyle, copy bottom-left overlay** |
| Nav | Links + escudo deportivo | Links + CTA pill | **Minimal: logo + 2 acciones** |
| Promo | — | — | **Marquee horizontal** (Doua/Pacas) |
| Catálogo | Scoreboard | Grid 4 cols badges | **Masonry discovery** + carousel horizontal |
| Categorías | Plantilla dorsales | Pills + 4 cards | **Paneles split 2+2** (Reef/Lowa split-screen) |
| Paleta | Navy + verde césped | Crema + terracota genérico | **Verde bosque #1a2e26 + crema + burdeos** |
| Tipografía | Bebas + IBM Plex | Instrument | **Lora + Nunito Sans** |
| Footer | Barra verde | Charcoal plano | **Verde profundo + línea costura SVG** |

**No copiar de:** petalo (marquee floral, bento blob, sketch), miga (scallop, chocolate), fc-altamar (scoreboard).

---

## Marca

```
Nombre:     Suave Hogar
Tagline:    "Tu piel lo nota. Tu hogar también."
CTA:        Armar pedido · WhatsApp
Tono:       Premium accesible, sensorial, confianza local Lima
```

## Tokens

```css
--suave-forest: #1a2e26;
--suave-forest-light: #243d32;
--suave-cream: #f0ebe3;
--suave-cream-dark: #e4dcd2;
--suave-burgundy: #8b3a3a;
--suave-burgundy-light: #a44d4d;
--suave-sage: #6b7f6e;
--suave-ink: #1c1917;
--suave-muted: #6b6560;
```

## Tipografía

| Rol | Fuente | Por qué |
|-----|--------|---------|
| Display | **Lora** | Editorial textil / lino (Linen Works) |
| UI + precios | **Nunito Sans** | Suave, redondeada, legible en mobile |

Stats/precios: `.price-value` + tabular-nums — **nunca** Lora en números.

---

## Secciones v2 (ASCII)

```
[NAV minimal]
  Suave Hogar (Lora)                    [Catálogo] [WhatsApp]

[MARQUEE — forest bg, cream text]
  PACK 4 MEDIAS +1 GRATIS · ALGODÓN PIMA · ENVÍO LIMA 24H · CAMBIOS 7 DÍAS ·

[HERO full-bleed 85vh]
  img lifestyle baño/hogar edge-to-edge
  gradient bottom forest
  bottom-left: etiqueta · H1 sensorial · prueba social "4.9 · 320+ clientes"
  CTAs: Armar pedido | Ver lookbook

[CATEGORY SPLIT — cream bg]
  ┌──────────────┬──────────────┐
  │  TOALLAS     │   MEDIAS     │  ← paneles grandes click, foto + overlay
  ├──────┬───────┴──────┬───────┤
  │INTERIOR│            │BÁSICOS │
  └──────┴────────────┴───────┘

[MASONRY DISCOVERY — forest-light bg]
  grid 12 cols irregular:
  - celda producto alto 3/4
  - celda cita editorial ("El algodón bueno...")
  - celda swatch GSM 500
  - celda producto ancha
  - celda lifestyle

[CAROUSEL — cream]
  "Lo más pedido" — scroll horizontal, cards sin badges genéricos

[FABRIC STORY — split]
  macro textura + copy sensorial + lista beneficios

[CTA — forest full width]
  card blanca interior (Animal Health pattern) + WhatsApp + form mínimo

[FOOTER — forest]
  línea costura SVG top · horarios · redes
```

## Componentes

| Archivo | Rol |
|---------|-----|
| `Navbar.astro` | Minimal |
| `PromoMarquee.astro` | Ticker Doua/Pacas |
| `HeroFullBleed.astro` | Overlay bottom-left |
| `CategorySplit.astro` | Paneles 2+2 |
| `MasonryDiscovery.astro` | Grid asimétrico |
| `ProductCarousel.astro` | Scroll horizontal |
| `FabricStory.astro` | Textura + copy |
| `OrderCta.astro` | Card blanca sobre forest |
| `StitchDivider.astro` | SVG hilo |
| `Footer.astro` | |

## Imágenes (reutilizar Gemini existentes + 1 hero lifestyle nueva si hace falta)

## Checklist pre-entrega v2

- [ ] Doc actualizado ANTES de codear
- [ ] Cero hero split 50/50
- [ ] Cero pills categoría
- [ ] Cero grid 3 cards iguales
- [ ] Cero testimonios en 2 cards
- [ ] Marquee presente
- [ ] Masonry o grid asimétrico real
- [ ] Carousel horizontal
- [ ] Tipografía Lora + Nunito Sans
- [ ] build OK · mobile + desktop
