# Auditoría — software.wavys-technologies.com

**Fecha:** 2026-08-12  
**URL:** https://software.wavys-technologies.com/  
**Repo:** `theros-website` (`/Volumes/mac externo/Mac Externo/projects/theros-website`)  
**Industria:** estudio de diseño + software a medida (Wavys Software)  
**Objetivo:** investigación previa a rediseño (no prospecto)  
**Capa visual:** Browser Use CLI + Brave CDP (Cursor Browser MCP no disponible en esta sesión)  
**Patrones rediseño:** `agent/context/design-patterns-wavys-software.md`

Capturas: `data/pipeline-runs/_preview-software-wavys/`

---

## 1. Resumen ejecutivo

El código vive en **`theros-website`**: Next.js 16, un home monolítico (`components/landing-page.tsx`, 1305 líneas) y una landing de producto (`/wavys-os`). Visualmente el home **parece estudio Awwwards** (tipo enorme, marquee, 4 cards, stats, pin horizontal), pero comercialmente está **desalineado con Wavys**: marca (Rubik / `#01FD91`), booking (Cal.com vs Calendly), email, ubicación, y la campaña activa **Wavys OS no aparece en el home**.

En un Mac con tema claro el sitio **abre en mint/crema**, no en el oscuro de marca. En 390px el logo se corta a “WA…”, no hay menú, y el H1 ocupa casi todo el fold. Hay CTAs muertos (LinkedIn/Instagram `#`), cifras difíciles de defender (120+ proyectos, 98%, 3x) y copy en vosotros con coordenadas de **Madrid** mientras el footer dice Lima y la empresa se fundó en **2023**.

El rediseño debe ser **work-first + product lane**, no otra plantilla de agencia con más motion.

---

## 2. Qué funciona / qué no

| Prueba | Resultado |
|--------|-----------|
| Home HTTP | **200** Vercel + Cloudflare, HTML prerender ~65 KB |
| `/wavys-os` | **200**, CTA Calendly OK |
| CTA principal home “Agendar llamada” | Navega a **https://cal.com/wavys-call/30min** (200) — **no es el Calendly oficial** |
| “ver trabajo” | `#trabajo` — ancla OK |
| FAQ accordion | Abre/cierra |
| Theme toggle | Funciona; **default = prefers-color-scheme** → light en muchos Mac |
| WhatsApp / tel | **No hay** |
| Formulario | **No hay** — solo mailto + booking externo |
| LinkedIn / Instagram footer | **`href="#"`** — muertos |
| Capacidades “ver detalle” | Hover sin destino |
| Menú mobile | **No existe** (`nav { display:none }` &lt; md). Solo logo truncado + Agendar |
| Link home → `/wavys-os` | **No existe** |
| Redirects PD | `/presencia-digital` y `/presencia-catalogo` → `/` (308) OK |

### Enlaces home (snapshot)

- Cal.com ×3 (nav, hero, CTA final)
- Anclas `#top` `#trabajo` `#servicios` `#proceso` `#faq`
- Demos: restaurant-code.vercel.app, inmobiliariafabre.com, wavys-technologies.com, jlhcorredoresdeseguros.com
- mailto ofuscado Cloudflare → `hola@wavystechnologies.com` (**dominio incorrecto**)
- `href="#"` ×2: linkedin, instagram

---

## 3. Diseño y UX

**Qué se ve bien:** dirección tipográfica ambiciosa, dark mode (cuando está activo) cercano a “studio 2026”, portfolio con casos reales (Alcoba, Fabre, JLH), `prefers-reduced-motion` en CSS, pin de proceso en desktop.

**Problemas:**

| Issue | Severidad | Evidencia |
|-------|-----------|-----------|
| Light mode default (mint) vs marca oscura | Alta | Captura `01-hero-desktop-1440.png` |
| H1 4 líneas se corta en 1440×900 | Alta | `01b-hero-desktop-DARK.png` |
| Logo “WA…” + sin nav en 390px | Alta | `06-hero-mobile-390.png` |
| 4 cards de capacidades idénticas | Alta | `04-servicios-desktop.png` — anti-slop del feedback-log |
| Stats 120+ / 98% / 3x / 7 | Alta | `05-cifras-desktop.png` — no hay fuente; Phil no documenta 120 proyectos |
| Coords Madrid + est. 2020 | Alta | Hero; founder = Lima, fundada 2023 |
| Marquee de keywords | Media | Decoración sin función |
| Custom cursor | Media | Ruido en desktop; oculto en touch (OK) |
| Copy vosotros (“entregáis”) | Media | Tono ES, mercado PE/LatAm |
| “Si es tu primer experimento, no somos nosotros” | Alta | Choca con Wavys OS (PYME) |
| CTA final “volver arriba” | Media | Debería ser email / OS |
| Slot “Q2 2026” | Alta | Hoy es ago 2026 (Q3) — `03-footer-desktop.png` |
| `/wavys-os` CTA “Demo registrada” | Media | Suena a estado, no a acción |
| Tipografía ≠ marca | Media | Space Grotesk + Manrope + Instrument Serif vs **Rubik** |
| Acento `#2ee89a` ≠ `#01FD91` | Media | tokens en `globals.css` |

---

## 4. Técnico / SEO

| Ítem | Hallazgo |
|------|----------|
| Stack | Next.js 16.2.1, React 19, Tailwind 4, GSAP (home), Three.js **en package.json y no usado** |
| HTML home | ~64 992 bytes |
| `href="#"` | 2 (redes) |
| Placeholders `((var))` | 0 |
| `metadataBase` | **Ausente** |
| `og:image` / canonical home | **Ausente** |
| Analytics | **Ninguno** |
| H1 accesible | “Diseño quevende.Software quesostiene.” (word-mask come espacios) |
| CSS muerto | ~580 líneas `.presencia-*` en `globals.css` |
| Assets huérfanos | `public/images/presencia/` + heroes Gemini ~16 MB |
| Bundle | Home ~679 KB JS (GSAP); OS más liviano |
| Cache | `x-vercel-cache: HIT`, age ~21 días en el momento del curl |

---

## 5. Por qué cambiar

Un prospecto (agencia u dueño PYME) llega a `software.wavys-technologies.com` y ve un **estudio genérico de Madrid** (coords, vosotros, est. 2020), cifras infladas y **cero Wavys OS**. El CTA lo manda a Cal.com, no al Calendly que usamos en campaña. El email del footer no es el dominio verificado de Resend. En móvil ni siquiera puede ir a Servicios/Trabajo desde el header.

Eso no convierte: no construye confianza LatAm, no empuja el producto activo, y no se siente la marca de los posts (oscuro + verde neón + Rubik).

---

## 6. Recomendaciones priorizadas

### Quick wins (1 sesión, sin rediseño visual)

1. Unificar CTA → Calendly Phil  
2. Email → `contact@wavys-technologies.com`  
3. LinkedIn + Instagram URLs reales  
4. Dark como default (ignorar `prefers-color-scheme` o persistir dark)  
5. Quitar coords Madrid, est. 2020, slot Q2 2026, stats inventados  
6. Link nav “Wavys OS” → `/wavys-os`  
7. Wordmark completo en 390px  
8. Quitar “ver detalle” o darle destino  

### Rediseño (siguiente fase — ver design-patterns)

1. Home work-first (índice editorial, no 4 cards)  
2. Tokens Rubik + `#01FD91` + canvas `#000908`  
3. Banda producto Wavys OS (no segundo negocio en el hero)  
4. Partir el monolito 1305 líneas en componentes  
5. Borrar Three.js, CSS Presencia, imágenes huérfanas  
6. `metadataBase`, OG image, analytics  
7. Español tú / Lima / 2023  

---

## 7. Oportunidad Wavys (este sitio es nuestro)

No es un prospecto: es la **vitrina del estudio**. El rediseño es palanca de ventas (partners + OS) y de coherencia de marca con posts/Figma Agente. No vender Presencia Digital. CTA OS = Calendly; CTA custom = misma Calendly con contexto distinto.

**Siguiente paso:** Phil confirma dirección (quick wins vs rediseño completo) → entonces `git pull` en `theros-website` y build según `design-patterns-wavys-software.md`.
