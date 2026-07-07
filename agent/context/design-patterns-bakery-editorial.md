# Patrones de diseño — Pastelería editorial (investigación web)

**Fuentes (2026-07-03):**
- [createtoday — Squarespace Bakery](https://createtoday.io/examples?category=bakery&platform=squarespace)
- [Rocket — Crust / Tarte pastry template](https://www.rocket.new/templates/tarte-signature-pastry-shop-landing-page-template)
- [Hostbento — Artisanal Pantry magazine](https://hostbento.com/templates/organic-food-brand-magazine-website-template)

**Implementación:** `/Volumes/mac externo/Mac Externo/projects/miga-pasteleria`

---

## Lenguaje visual

| Atributo | Valor |
|----------|-------|
| **Estructura** | "Gallery walk" — cada scroll = sala distinta (hero → vitrina → proceso → pedido) |
| **Fondo** | Crema pergamino `#FFF8F0` / `#F7F0E6` — cálido, no blanco frío |
| **Acentos** | Chocolate `#5C3D2E`, rhubarb `#8B2252`, mantequilla `#F0D9A8` |
| **Hero** | Asimétrico 45/55; foto lifestyle o overhead moody |
| **Productos** | Bento mármol + círculos ~150px para categorías |
| **Movimiento** | Marquee menú ("CROISSANTS · TORTAS · …") |
| **CTA fijo** | Pill sticky "Pedir para retiro" en mobile |

## Tipografía

| Rol | Fuente | Nota |
|-----|--------|------|
| Display | **Libre Baskerville** | Serif cálida — **no** repetir Fraunces (florería) |
| Body | **Plus Jakarta Sans** | Legible, stats y UI |

## SketchUnderline

Seguir contrato en `design-patterns-animal-health-behance.md`: envolver palabra, trazos en tercio inferior viewBox.

## Secciones

1. Navbar 3-col (logo | Menú pill | Pedir)
2. Hero asimétrico + sketch en palabra clave
3. Marquee productos
4. Vitrina bento (tortas, croissants, galletas)
5. Menú circular (cards redondas)
6. Proceso / horno artesanal
7. Statement cita
8. Testimonios offset
9. CTA card blanca sobre fondo chocolate
10. Footer `rounded-t-[3rem]` chocolate

## Anti-patrones

- Grid 3 cards blancas idénticas
- Paleta pink-genérica cupcake
- Fraunces+Outfit (ya usado en Pétalo)
- Sketch SVG mal posicionado

## Checklist

- [ ] Doc leído antes de codear
- [ ] Hero ≠ 50/50 centrado
- [ ] Marquee presente
- [ ] Bento o masonry productos
- [ ] SketchUnderline con children
- [ ] Imagen única por slot
