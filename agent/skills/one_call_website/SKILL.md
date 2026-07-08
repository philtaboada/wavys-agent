# Skill — One-Call Website (Next.js — sistemas y apps)

Usar cuando Phil pida **sistema, app, plataforma, automatización, dashboard** o web con **lógica de negocio**, API, auth, multi-ruta compleja.

**Para landings de marketing (one-page):** usar **`one_call_landing`** (Astro) — ver `agent/context/website-stack-rules.md`.

**Raíz proyectos Phil:** `C:\Users\siste\Project` — `agent/context/projects-path.md`

**Referencia demo UI (Next):** `C:\Users\siste\Project\lumen-vet` (veterinaria — anterior a regla Astro)  
**Live:** https://lumen-vet.vercel.app

**Gate 0 (pasos):** `agent/context/pipeline-gates.md` § `one_call_website` — log en `data/pipeline-runs/<slug>-step-compliance.md`

**Gate 1+ (calidad):** mismo doc § Gate 1+ `one_call_website` — `data/pipeline-runs/<slug>-next-validation.md` (plantilla `_TEMPLATE-next-validation.md`)

---

## Objetivo

En **una sola sesión** entregar:

1. Proyecto **Next.js** en `/projects/<slug>/`
2. Branding + copy + imágenes (Gemini)
3. Animaciones (Framer Motion)
4. Secciones completas (no placeholder)
5. Deploy preview/producción en Vercel
6. URL lista para revisión

---

## Pipeline (8 fases)

```
① BRIEF → ② BRAND + TIPOGRAFÍA → ③ SCAFFOLD → ④ IMÁGENES → ⑤ BUILD → ⑤.5 VALIDAR UX → ⑥ DEPLOY → ⑦ ENTREGAR
```

**Leer siempre:** `agent/context/website-feedback-log.md` (retro Phil acumulada).

**Si Phil comparte capturas Behance/Figma/Pinterest/Dribbble:** leer **`agent/skills/reference_ui_copy/SKILL.md`** + **`screenshot-analyzer`** (global) → patrones → build.

**Antes de deploy:** leer **`ui-ux-pro-max`** (global) + fase 5.5 validación UX.

### Fase 1 — Brief (30 seg)

Extraer del mensaje de Phil:

| Campo | Ejemplo |
|-------|---------|
| **Industria** | Veterinaria, restaurante, abogados… |
| **Nombre marca** | Inventar si no hay (creativo, memorable, ES/LatAm) |
| **Tono** | Premium, playful, corporativo, artesanal |
| **Ciudad/mercado** | Lima, CDMX, global |
| **CTA principal** | Agendar cita, pedir demo, llamar, WhatsApp |
| **Secciones must-have** | Servicios, equipo, testimonios, contacto… |

Si falta algo → inferir con criterio (no bloquear).

### Fase 2 — Brand kit + tipografía (creativo)

Definir antes de codear:

```
Nombre:     Lumen Vet
Tagline:    "Cuidado que brilla en cada respiración"
Paleta:     deep #071612 · emerald #1a6b5c · mint #2dd4bf · glow #f5a962 · coral #ff7b54
Tipografías: Syne (display) + DM Sans (body)
Vibe:       Boutique, bioluminiscente, cálido, premium LatAm
```

**Regla anti-slop:** evitar purple-gradient-on-white, glass card genérica sin personalidad, copy simétrico tipo LLM.

#### Tipografía — obligatorio (Phil 2026-07-03)

**Nunca** usar defaults de create-next-app (Geist, Inter, Roboto, Arial) sin decisión consciente.

**Skills a consultar/instalar:**

| Skill | Comando | Para qué |
|-------|---------|----------|
| `web-typography` | `npx skills add wondelai/skills@web-typography -g -y` | Escalas, line-height, legibilidad |
| `ui-ux-pro-max` | Ya en Codex Phil | **57 font pairings** + UX guidelines |
| `font-pairing-suggester` | `npx skills add onewave-ai/claude-skills@font-pairing-suggester -g -y` | Par display+body por mood |

**Proceso (5 min):**

1. Elegir **tono** (premium / playful / corporativo / artesanal / clínico)
2. Consultar par display+body en `ui-ux-pro-max` o tabla abajo
3. Cargar vía `next/font/google` — **2 familias máximo** (display + body)
4. Mapear en `@theme`: `--font-display`, `--font-body`
5. Escalas: body ≥16px, H1 mobile `text-4xl`+ con `leading-[1.08]` mínimo, H1 desktop hasta `text-7xl`

**Pares recomendados por industria:**

| Industria | Display | Body | Por qué |
|-----------|---------|------|---------|
| Veterinaria premium | **Cormorant Garamond** + **Manrope** (Behance Animal Health) | Fraunces + Plus Jakarta | Ver `design-patterns-animal-health-behance.md` si Phil manda capturas |
| Veterinaria boutique (oscuro) | Fraunces, Literata | Plus Jakarta Sans, Nunito | Cálido — **NO Syne** (números se solapan) |
| Restaurante | Playfair Display | Lato | Sensorial, elegante |
| Abogados | Libre Baskerville | Source Sans 3 | Autoridad, legible |
| SaaS tech | Space Grotesk | IBM Plex Sans | Moderno, preciso |
| Estudio creativo | Clash/Outfit | Work Sans | Bold, contemporáneo |
| Salud/clínica | Sora | Inter *(excepción)* | Limpio, accesible |

**Prohibido:** Inter+Roboto, Geist sin motivo, más de 2 familias, body <14px, **display font en números/stats** (usar `.stat-value` + tabular-nums).

### Fase 3 — Scaffold

```bash
cd "C:/Users/siste/Project"
bunx create-next-app@latest <slug> --typescript --tailwind --eslint --app --src-dir --no-import-alias --turbopack --yes
cd <slug>
bun add framer-motion lucide-react
mkdir -p public/images src/components src/lib
```

**Stack fijo:**
- Next.js App Router
- Tailwind CSS 4
- Framer Motion (animaciones)
- Lucide (iconos)
- Bun (package manager)

### Fase 4 — Imágenes Gemini (obligatorio)

**Siempre** vía wavys-agents, **nunca** `GenerateImage` de Cursor.

```bash
cd "C:/Users/siste/Project/wavys-agents"
npm run tool -- generate_image '{"prompt":"...","aspectRatio":"16:9","outputPath":"/abs/path/public/images/hero.jpg"}'
```

**Set mínimo (6–7 imágenes):**

| Asset | Ratio | Uso |
|-------|-------|-----|
| `hero.jpg` | 16:9 | Hero principal |
| `service-*.jpg` ×3 | 4:3 | Cards servicios |
| `team.jpg` | 16:9 | Equipo |
| `testimonial-bg.jpg` | 16:9 | Fondo testimonios |
| `texture.jpg` | 1:1 | Decorativo / filosofía |

**Prompts:** fotorealista o artístico según vibe; **sin texto, sin logos**; incluir mood de la industria.

### Fase 5 — Build (estructura de componentes)

**Secciones estándar one-page:**

| Componente | Contenido |
|------------|-----------|
| `Navbar` | Logo, nav anchor, CTA, mobile menu animado |
| `Hero` | Headline + tagline, CTAs, stats, imagen parallax, partículas/huellas |
| `EmergencyBanner` | Solo si aplica (urgencias, promo limitada) |
| `Services` | Grid 6 cards con imagen + hover lift |
| `Stats` | Contadores animados (`useInView` + rAF) |
| `Philosophy` | Storytelling de marca + quote |
| `Team` | Foto grupal + cards individuales |
| `Testimonials` | Carousel con `AnimatePresence` |
| `Booking` | Formulario UI + estado success animado |
| `Footer` | Contacto, disclaimer demo si aplica |

**Animaciones mínimas:**
- Scroll reveal (`Reveal` + `useInView`)
- Stagger en grids
- Parallax hero (`useScroll` + `useTransform`)
- Hover scale en CTAs
- Carousel testimonios
- Contadores numéricos
- Floating decorative elements

**Archivos core:**
- `src/lib/motion.ts` — variants compartidos
- `src/components/Reveal.tsx` — wrapper scroll
- `src/app/globals.css` — tokens CSS + utilidades `.glass`, `.text-gradient`
- `src/app/layout.tsx` — fonts + metadata SEO + **`metadataBase`**

### Fase 5.5 — Validación UX (obligatoria antes de deploy)

**Gate:** no hacer `vercel deploy` hasta pasar este checklist. Phil lo exige explícitamente.

### Subagentes ⑤.5 (orden)

1. **`shell`** — `bun run build` + `validate_pipeline` (`one_call_website`, slug)
2. **`bugbot`** readonly — review vs feedback-log + gates W-T03, W-C02
3. **Browser MCP** (padre) — screenshots 390 + 1440; W-V04, nav mobile

Prompts: `agent/pipelines/subagents.md`

**Skills:** leer `ui-ux-pro-max` (Codex) para prioridades accesibilidad/interacción.

#### A. Build técnico

```bash
bun run build   # debe pasar sin errores TS
```

#### B. Auditoría visual (browser MCP)

| Viewport | Acción |
|----------|--------|
| **390×844** (mobile) | Navegar URL local o post-deploy; screenshot hero, servicios, formulario |
| **1440×900** (desktop) | Screenshot hero + nav completa |

**Comprobar en cada viewport:**

- [ ] Sin scroll horizontal (`body.scrollWidth <= innerWidth`)
- [ ] Hero: imagen visible above-the-fold en mobile (reordenar grid si hace falta)
- [ ] Tipografías cargadas (DevTools: `fontFamily` ≠ Arial/genérico)
- [ ] H1 no clippeado (line-height ≥1.08 en mobile)
- [ ] CTAs ≥44px altura (touch target)
- [ ] Form labels con `htmlFor` + `id`
- [ ] Focus visible en inputs/links
- [ ] Cards absolutas no desbordan viewport en mobile
- [ ] Imágenes cargan (no broken)
- [ ] Nav mobile (hamburger) abre/cierra

#### C. Checklist accesibilidad (prioridad ui-ux-pro-max)

| # | Check |
|---|-------|
| 1 | Contraste texto/fondo ≥4.5:1 |
| 2 | Jerarquía headings secuencial (h1→h2→h3) |
| 3 | Alt text en imágenes con significado |
| 4 | `prefers-reduced-motion` respetado |
| 5 | `metadataBase` en layout (OG URLs correctas) |

#### D. Reporte pre-entrega

Incluir en mensaje a Phil:

```
✅ Build OK
✅ Mobile 390px — [ok / fixes aplicados]
✅ Desktop 1440px — ok
✅ Tipografía: [Display + Body elegidas y por qué]
⚠️ Issues menores pendientes (si hay)
```

Si hay issue **Alta** → corregir y re-validar antes de deploy.

### Fase 6 — Deploy Vercel

```bash
cd "C:/Users/siste/Project/<slug>"
git init && git add -A && git commit -m "feat: <nombre> — website <industria>"
vercel deploy -y
```

- Preview por defecto (skill vercel-deploy)
- Producción solo si Phil lo pide explícitamente
- Reportar: URL deployment + alias si existe + inspector URL

### Fase 7 — Entregar a Phil

Incluir siempre:

- **URL live**
- **Ruta local** del proyecto
- **Nombre de marca** inventado + tagline
- **Qué secciones tiene**
- **Nota:** demo ficticia si no es cliente real
- **Próximos pasos opcionales:** dominio custom, form backend, CMS, multi-page

---

## Checklist pre-entrega

**Gate 1+ completo:** `data/pipeline-runs/<slug>-next-validation.md` — criterios en `agent/context/pipeline-gates.md` § Gate 1+ `one_call_website`.

- [ ] **Tipografía elegida conscientemente** (par display+body documentado)
- [ ] `bun run build` pasa sin errores
- [ ] **Fase 5.5 UX completada** (mobile + desktop verificados)
- [ ] Imágenes en `public/images/` (Gemini, .jpg)
- [ ] Mobile responsive (nav hamburger, grids colapsan, hero con imagen visible)
- [ ] Animaciones + `prefers-reduced-motion`
- [ ] Metadata SEO + `metadataBase` en `layout.tsx`
- [ ] Footer con disclaimer si es demo
- [ ] Retro guardada en `website-feedback-log.md` si Phil dio feedback
- [ ] Deploy URL funcional reportada

---

## Variaciones por industria

| Industria | Extra sections | Tono |
|-----------|----------------|------|
| Veterinaria | Urgencias 24h, tipos mascota en form | Cálido, confiable |
| Restaurante | Menú destacado, reservas, horarios | Sensorial, appetizing |
| Abogados | Áreas práctica, credenciales | Sobrio, autoridad |
| SaaS | Pricing, features, demo | Tech, limpio |
| Estudio creativo | Portfolio grid, casos | Bold, experimental |

---

## Lo que NO incluye (v1)

- Backend real (form → email/DB)
- CMS editable
- Multi-idioma
- Blog
- Analytics setup
- Dominio custom (Phil lo configura en Vercel Dashboard)

Proponer como fase 2 si Phil lo pide.

---

## Comando one-liner futuro (meta)

Cuando Phil diga algo como:

> "Crea **landing** para [negocio/industria]"

→ Leer **`one_call_landing`** (Astro).

> "Crea **sistema / app / plataforma** para …"

→ Leer **este skill** (Next.js).

---

## Historial de demos

| Proyecto | Industria | URL | Fecha |
|----------|-----------|-----|-------|
| `lumen-vet` | Veterinaria → **Animal Health** (Behance) | https://lumen-vet.vercel.app | 2026-07-03 |

---

## Dependencias del agente

- `wavys-agents` → `generate_image` (Gemini)
- `agent/context/website-feedback-log.md` → retro Phil
- `agent/context/design-patterns-animal-health-behance.md` → **patrones UI Behance** (cuando Phil manda capturas o pide fidelidad)
- `ui-ux-pro-max` (Codex) → validación UX + font pairings
- `web-typography` (opcional global) → escalas tipográficas
- Vercel CLI autenticado (`vercel deploy -y`)
- Bun instalado
- Browser MCP → screenshots validación 390px + 1440px
- Regla git Wavys: `git pull` solo en repos existentes Wavys, **no** en proyecto nuevo
