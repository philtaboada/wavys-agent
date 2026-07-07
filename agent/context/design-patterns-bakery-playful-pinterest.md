# Patrones — Pastelería playful (Pinterest / createtoday)

**Fuentes:** createtoday bakery gallery — MARI (scalloped + doodles), Clyde's Donuts (dark hero + slab + orange highlight), Baked By K (circular rotating text, wavy ribbon), Sweet Crumbs Figma (blush + gold + chocolate)

**Regla crítica:** Si el proyecto anterior (florería) usó marquee/bento/sketch underline → **este NO puede repetirlos**.

## Dirección Miga v2 — "Sweet Spot"

| Elemento | Patrón | Prohibido (ya usado en Pétalo) |
|----------|--------|--------------------------------|
| Hero | Fondo chocolate oscuro full-bleed, foto producto superpuesta, headline SLAB con palabra en naranja | Hero crema + blob + sketch underline |
| Nav | Links horizontales simples, sin pill Menú centrado | Grid 3-col pill |
| Separadores | SVG ondas + cinta diagonal | Marquee horizontal |
| Productos | Tira 4 cols edge-to-edge + cards scalloped con doodles SVG | Bento 2×2 + masonry |
| Acento tipográfico | Slab + **script** (Caveat) en una palabra | Fraunces + sketch SVG |
| CTA | Sección split-color (blush \| cream) | Card blanca sobre fondo oscuro |
| Motion | Texto circular rotatorio (badge) | Marquee lineal |
| Footer | Onda superior playful, fondo blush | `rounded-t-[3rem]` sage |

## Tokens

```css
--miga-dark: #3d2314;
--miga-cream: #fff8e7;
--miga-blush: #fadadd;
--miga-orange: #e85d04;
--miga-gold: #d4af37;
--miga-chocolate: #6b4226;
```

## Tipografía

- **Archivo Black** — headlines slab
- **Caveat** — script accent
- **Source Sans 3** — body

## Checklist diferenciación

- [ ] Cero componentes copiados de `petalo-floreria`
- [ ] Sin Marquee, sin SketchUnderline, sin bento
- [ ] Hero oscuro ≠ hero claro
- [ ] Al menos 1: scallop, doodle, circular text, split section
