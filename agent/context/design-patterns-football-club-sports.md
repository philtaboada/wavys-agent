# Patrones — Club de fútbol (Angel City / Bayer 04 / St Johnstone)

**Fuentes investigadas:**
1. [Angel City FC — Hermit Crabs case study](https://hermitcrabs.io/case-study/angelcity-website-redesign-development-scalable-hubspot-ecosystem) — grids modulares, CTAs tickets/membership upfront, tipografía bold + colores del club
2. [Bayer 04 — Layo Design](https://www.layo.design/projects/bayer-04) — rojo/negro alto contraste, fixtures y live scores surfaced, spacing limpio
3. [St Johnstone FC — RYSE](https://rysedigital.co.uk/portfolio/st-johnstone-fc-website/) — identidad fan-first, navegación clara, mobile-first
4. [Portland Thorns — Duet](https://www.duet.design/work/portland-thorns) — energía deportiva + layouts limpios, acceso rápido a calendario/plantilla

**Proyecto anterior del batch:** `miga-pasteleria` (playful dark chocolate, scallop, circular text, script Caveat)

## Tabla de diferenciación

| Patrón | Miga (anterior) | FC Altamar (este) |
|--------|-----------------|-------------------|
| Hero | Chocolate oscuro + fotos superpuestas pastel | Foto estadio full-bleed + overlay rayas diagonal (camiseta) + tarjeta próximo partido |
| Nav | Links simples bakery | Links + escudo SVG + CTA "Entradas" pill verde |
| Separadores | Scallop / ondas / circular text | Franja diagonal verde + líneas de campo (grass stripes) |
| Grid principal | Tira productos 4 cols scalloped | Plantilla con dorsales grandes + fixtures tipo scoreboard |
| Tipografía | Archivo Black + Caveat script | **Bebas Neue** + **IBM Plex Sans** |
| Acento color | Naranja / blush / gold bakery | Verde césped `#00a650` + navy `#0a1628` + gold `#c9a227` |
| Motion | Badge circular rotatorio | Hover lift en cards plantilla; sin marquee |
| Footer | Onda blush playful | Barra verde superior + navy sólido (sin rounded-t-[3rem]) |
| Prohibido | Marquee, bento, sketch underline, script accent | Chocolate, scallop, doodles, emoji ⚽ como logo |

## Marca demo

```
Nombre:     FC Altamar
Tagline:    "Pasión que juega en casa"
Ciudad:     Lima, Perú (demo)
CTA:        Comprar entradas / Unirse al club
Tono:       Energético, comunitario, profesional-amateur mix
```

## Tokens CSS

```css
--altamar-navy: #0a1628;
--altamar-navy-light: #142238;
--altamar-green: #00a650;
--altamar-green-dark: #008542;
--altamar-gold: #c9a227;
--altamar-white: #f8fafc;
--altamar-muted: #94a3b8;
--altamar-stripe: repeating-linear-gradient(
  90deg,
  #0d4d2a 0px,
  #0d4d2a 40px,
  #0a3d22 40px,
  #0a3d22 80px
);
```

## Tipografía

| Rol | Fuente | Por qué |
|-----|--------|---------|
| Display | **Bebas Neue** | Condensada deportiva, números de dorsal legibles |
| Body + stats | **IBM Plex Sans** | Precisa, tabular-nums en marcadores |

**Prohibido:** Archivo Black, Caveat, Fraunces, Oswald (pitlane), Inter/Geist defaults.

## Secciones (ASCII)

```
[NAV] escudo | Inicio Plantilla Calendario Noticias | [Entradas]

[HERO — full viewport]
  bg: foto estadio acción
  overlay: gradient navy + rayas diagonal verde 15deg
  left: H1 "FC ALTAMAR" + tagline + 2 CTAs
  right/bottom: MatchCard flotante (próximo partido, fecha, rival, botón)

[FIXTURES — fondo navy-light]
  H2 "Calendario"
  3-4 filas tipo scoreboard: fecha | equipos | marcador | estado
  scroll horizontal mobile

[SQUAD — fondo stripe grass subtle]
  H2 "Plantilla"
  grid 2x3 mobile / 3x4 desktop
  card: foto jugador + dorsal gigante Bebas + nombre + posición

[CLUB STORY — split 50/50]
  left: imagen entrenamiento
  right: historia del club, stats (.stat-value sans): fundación, títulos, socios

[NEWS — white]
  3 cards noticias horizontales con categoría pill

[JOIN CTA — verde full width]
  "Hazte socio" + beneficios bullets + form email UI

[FOOTER — navy]
  barra verde 4px top
  logo + links + redes + disclaimer demo
```

## Componentes previstos

| Archivo | Contenido |
|---------|-----------|
| `Navbar.astro` | Escudo SVG, nav anchors, CTA entradas |
| `Hero.astro` | Full-bleed + MatchCard |
| `Fixtures.astro` | Tabla/scoreboard partidos |
| `Squad.astro` | Grid plantilla dorsales |
| `ClubStory.astro` | Split historia + stats |
| `News.astro` | 3 cards noticias |
| `JoinCta.astro` | Formulario socio UI |
| `Footer.astro` | Contacto + disclaimer |

## Imágenes Gemini

| Asset | Ratio | Prompt mood |
|-------|-------|-------------|
| `hero.jpg` | 16:9 | Estadio nocturno, partido en acción, luces, verde césped |
| `training.jpg` | 16:9 | Entrenamiento equipo amateur profesional, Lima vibe |
| `player-1.jpg` | 4:3 | Jugador futbol acción, sin texto |
| `player-2.jpg` | 4:3 | Portero atajando |
| `player-3.jpg` | 4:3 | Celebración gol |
| `fans.jpg` | 16:9 | Aficionados en gradas con bufandas verdes |

## DO / DON'T

**DO:** scoreboard fixtures, dorsales grandes, rayas diagonal kit, escudo SVG geométrico, CTAs entradas/socios, mobile scoreboard scroll.

**DON'T:** marquee, bento pastel, sketch underline, scallop, chocolate palette, emoji logo, stats SaaS genéricos sin contexto fútbol.

## Checklist pre-entrega

- [ ] Doc creado antes de scaffold
- [ ] Tipografía Bebas + IBM Plex (≠ batch anterior)
- [ ] Layout ≠ miga/petalo/pitlane clone
- [ ] Imágenes únicas Gemini
- [ ] `bun run build` OK
- [ ] Mobile 390px + desktop 1440px
- [ ] `prefers-reduced-motion`
- [ ] Stats con `.stat-value` + tabular-nums
- [ ] Form labels con htmlFor/id
