# Patrones de diseño — Wavys Software (estudio)

**Sitio:** https://software.wavys-technologies.com/  
**Repo:** `/Volumes/mac externo/Mac Externo/projects/theros-website`  
**Auditoría:** `data/pipeline-runs/software-wavys-technologies-com-audit.md`  
**Fecha investigación:** 2026-08-12  
**Estado:** rediseño en curso (2026-08-12) — Phil: **quitar Wavys OS del sitio** (“no sirve”)

---

## Posicionamiento (no mezclar)

| Capa | URL | Audiencia | Promesa | CTA |
|------|-----|-----------|---------|-----|
| **Studio (home)** | `/` | Agencias, partners, PYME con build custom | Diseño + software a medida | Calendly demo 30 min |
| **SaaS CRM** | wavys-technologies.com | Cliente final CRM | Agentes WhatsApp | Planes públicos |

El home **vende el estudio**. **Wavys OS no va en este sitio** (Phil 2026-08-12): `/wavys-os` redirige a `/`.

---

## Referencias reales (2025–2026)

| URL | Qué copiar | Qué no |
|-----|------------|--------|
| [metalab.com](https://metalab.com/) | Negro como lienzo, work-first, jerarquía por escala | Achromatic total (Wavys necesita `#01FD91`) |
| [studiofreight.com](https://studiofreight.com/) | Lista de proyectos con peso, motion físico | Brutalismo extremo para PYME LatAm |
| [anml.com](https://anml.com/) | Sitio = demo del método, nav corta, cases en video | Parecer SaaS genérico |
| [min.studio](https://min.studio/) | Copy de criterio (“own complexity”), no features | Frialdad excesiva |
| [ecloud.agency](https://ecloud.agency/) | LatAm real, work con tags Strategy/UX/Dev | Look blanco SaaS |
| [somoscuchillo.com](https://somoscuchillo.com/) | Portfolio como índice editorial | Cero propuesta comercial |
| [linear.app](https://linear.app/) | Lenguaje **solo** para la banda Wavys OS | Clonar Linear en todo el home |

---

## Decisiones (bloqueadas para el rediseño)

| Eje | Decisión |
|-----|----------|
| **Hero visual** | Cutout 3D glass-wave (Gemini + recorte) + WaveField Lima. Prueba de trabajo real en el bloque Trabajo, no diagrama de agentes ni cubo SaaS. |
| **Grid** | Editorial asimétrico + **work index**. Capacidades = paneles con peso distinto, no 4 cards iguales |
| **Motion** | **WebGL wave field** (shader + pointer) + GSAP clip-path en trabajo, magnetic CTA, cursor. `prefers-reduced-motion` apaga GPU. |
| **Tipo** | **Rubik** display + body (marca Agente). Serif solo si Phil lo pide; **nunca** Inter/Geist. Números en tabular-nums, no display |
| **Acento** | `#01FD91` + teal `#5AD2D0`. Sustituir `#2ee89a` actual |
| **Stack** | **Seguir en Next.js** (ya hay `/` + `/wavys-os` + deploy). No migrar a Astro en este rediseño |
| **Idioma** | Español LatAm (**tú**). Quitar vosotros (“entregáis”) |
| **Booking** | Brief 2026: **Cal.com** `https://cal.com/wavys-call/30min`. Un solo CTA. |
| **Email** | Solo `contact@wavys-technologies.com` |

---

## Arquitectura (brief 2026)

Fuente: `data/wavys-brief-website-2026.pdf`

**Nav (máx. 6):** Trabajo · Servicios · Inversión · Equipo + Agendar 30 min.

**Home (orden):** Hero → proof (Alcoba · Fabre · JLH) → problema → 4 servicios → sistemas → proceso (entregable/tiempo/decisión) → trabajo (sin Wavys corp) → inversión → equipo → FAQ → cierre.

**Páginas:** `/servicios` + 4 detalle · `/trabajo` + 3 casos · `/proceso` · `/equipo` · `/inversion` · `/agendar` · `/privacidad` · `/terminos` · 404.

**Sin product lane Wavys OS.**

---

## DON'T (anti-slop + hallazgos actuales)

1. No 4 cards idénticas con “ver detalle” sin destino
2. No marquee de keywords
3. No stats inventados (120+ / 98% / 3x)
4. No coordenadas Madrid (`40.4168 / 3.7038`) — Phil está en **Lima**
5. No `est. 2020` — empresa fundada **2023**
6. No `hola@wavystechnologies.com` (dominio incorrecto)
7. No Cal.com + Calendly a la vez
8. No `href="#"` en LinkedIn / Instagram
9. No “próximo slot: Q2 2026” (ya pasó)
10. No “si es tu primer experimento, no somos nosotros” en el mismo sitio que vende Wavys OS a PYME
11. No light-mode mint como primera impresión
12. No recortar el wordmark a “WA…” en 390px
13. No CSS/assets de Presencia Digital
14. No Three.js en bundle si no hay escena

---

## Copy núcleo (home)

**H1 dirección:** una línea de criterio, no poema de 4 líneas que se corta en viewport.

Ejemplo (a validar con Phil):  
“Software y diseño para negocios que ya no pueden operar sobre parches.”

**Sub:** WhatsApp-first / LatAm / misma mano diseño+código.  
**No abrir con precio. No abrir con “estudio digital est. 2020”.**

---

## Capturas de investigación

`data/pipeline-runs/_preview-software-wavys/`
