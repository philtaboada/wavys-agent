# Wavys — Guía visual Agente (viva)

> **Propósito:** Que el agente (Cursor + Figma + Gemini) cree posts y piezas visuales **creativas y actuales**, sin perder la identidad Wavys.  
> **Versión:** 2026-07 · Revisar cada trimestre o cuando cambie campaña/mascota/paleta.  
> **Figma:** página **Agente** en [Posts](https://www.figma.com/design/59V65PuX0A872JOibvhh11/Posts) — espejo visual de esta guía.

---

## 1. Filosofía (lo que NO cambia)

Wavys no es una plantilla rígida. Es un **sistema con personalidad**:

| Principio | Qué significa en práctica |
|-----------|---------------------------|
| **Tech humano** | IA potente, pero cercano (LatAm, consultivo, sin jerga vacía) |
| **Claridad > decoración** | Hook legible en 2 segundos; el adorno sirve al mensaje |
| **Oscuro + neón con intención** | Negro profundo + verde/cyan = confianza B2B + energía digital |
| **WhatsApp-first** | El dolor y la solución giran alrededor de conversaciones y leads |
| **Evolución controlada** | Cada mes puedes probar layouts, mascota, tendencias — **los tokens de §2 se respetan** |

**Regla de oro del agente:** Si dudas entre “creativo” y “marca”, prioriza legibilidad + tokens invariantes; la creatividad va en composición, copy e ilustración — no en cambiar colores base sin aviso.

---

## 2. Invariantes (conservar siempre)

Estos elementos **no se abandonan** salvo decisión explícita de Phil en esta guía (con fecha):

### 2.1 Color

| Token | Valor | Rol |
|-------|-------|-----|
| `surface-dark` | `#000908` | Cards clásicas (Pieza ventas) |
| `surface-agente` | `#070604` | Fondo base familia **Agente** (glass card) |
| `glass-card` | `rgba(0,0,0,0.2)` sobre gradiente | Contenedor central 924px, radius **40px** |
| `text-primary` | `#FDFDFD` / white | Titulares y cuerpo sobre oscuro |
| `accent-green` | `#01FD91` | Highlights, palabras clave, acentos |
| `accent-teal` | `#5AD2D0` | Segundo acento, gradientes |
| `gradient-brand` | `#5AD2D0` → `#01FD91` | Fondo exterior, CTAs, texto gradiente |
| `cta-text` | `#000000` | Texto sobre botón gradiente |

**Prohibido sin OK de Phil:** sustituir el verde neón por otro primario (p. ej. morado, rojo marca cliente).

### 2.2 Tipografía

| Rol | Familia | Pesos | Notas |
|-----|---------|-------|-------|
| Display / headlines | **Rubik** | **Bold**, SemiBold, Medium | Familia Agente: 72–87px, tracking **-7% a -10%** |
| Display stack | Rubik Bold | Línea 1 blanca + línea 2 `#01FD91` | Ej: “No respondiste…” / “PERDISTE LA VENTA” |
| Cierre italic | Rubik SemiBold Italic | 38px | Ej: “Tú cierra. Nosotros atendemos.” |
| Énfasis / tech news | Inter Bold | Solo piezas “Tech Trends” (Page 1) | Convive con Rubik |
| Cuerpo | Rubik | Regular / Medium | 28–32px, tracking ~-3% |

**Fallback agente:** Si Rubik no carga en Figma, usar Inter solo temporalmente y marcar frame con nota “⚠ revisar fuente”.

### 2.3 Logo y nombre

**Assets oficiales (Phil → `assest/`):** ver `agent/connections/brand-logos.md` y `data/brand-assets/logos/`.

| Archivo | Cuándo |
|---------|--------|
| `logo-wavys-technologies.png` | Lockup completo sobre fondo oscuro Agente |
| `isotipo.png` | Solo icono gradiente verde |
| `logo-wavys-education.png` | Línea Education, fondo claro |

- No distorsionar ni recolorear el isotipo.
- **No usar** logos viejos (SVG legacy, wordmark “WAVYS TECHNOLOGY”, exports viejos de theros-front).

### 2.4 Formatos (canvas)

| Canal | Px | Ratio |
|-------|-----|-------|
| LinkedIn / Facebook feed | 1080 × 1080 | 1:1 |
| Instagram feed | 1080 × 1350 | 4:5 |
| Instagram / TikTok story | 1080 × 1920 | 9:16 |
| LinkedIn artículo cover | 1200 × 627 | ~1.91:1 *(opcional, añadir cuando se use)* |

### 2.5 Estructura narrativa (copy + layout)

Patrón base **HBC** (Hook → Beneficio → Cierre):

1. **Hook** — pregunta o tensión (“¿Tu equipo pierde leads por WhatsApp?”)
2. **Beneficio** — qué hace Wavys en una línea (“Agentes de IA que califican 24/7”)
3. **Prueba** — 3–4 bullets con emoji o icono
4. **Cierre** — CTA único (Calendly, DM, demo, web)

---

## 3. Variables creativas (pueden cambiar por mes/campaña)

Documentar en Figma página **Agente → Bloque “Mes actual”** al inicio de cada mes.

| Dimensión | Ejemplos de variación | Límite |
|-----------|----------------------|--------|
| **Layout** | Ventas tab · **Agente glass** · Editorial Wavi · Stats 78%/5min · Carrusel | Mantener jerarquía HBC |
| **Mascota Wavi** | Con micrófono, saludando, solo icono | Solo en piezas marca/producto, no en white-label cliente |
| **Imagen 3D** | Engranaje, dashboard, WhatsApp abstracto | Paleta acorde a §2.1 |
| **Tipografía display secundaria** | Inter Bold italic “Tech Trends” | Solo línea editorial / noticias |
| **Densidad** | Más aire (LinkedIn) vs más texto (carrusel slide 2+) | Nunca &lt; 24px cuerpo en 1080 |
| **CTA copy** | “Agenda demo”, “Escríbenos”, “Comenta DEMO” | Un solo CTA por pieza |

### Plantilla “Mes actual” (copiar cada mes)

```markdown
## Mes: YYYY-MM
- Tema campaña:
- Layout preferido: [ ] Agente glass  [ ] Ventas  [ ] Editorial  [ ] Stats  [ ] Otro: ___
- Mascota Wavi: [ ] sí  [ ] no
- CTA principal:
- Referencia frame Figma:
- Notas:
```

---

## 4. Familias visuales (elegir una por pieza)

> **Prioridad Phil (2026-07):** Familia **C — Agente** en página [Agente](https://www.figma.com/design/59V65PuX0A872JOibvhh11/Posts?node-id=651-65). Familia A sigue válida para piezas tipo flyer.

### C — **Agente / glass card** ⭐ preferida

- **Página Figma:** `Agente` (no Page 1)
- **Look:** fondo `#070604` + **gradiente aurora** teal/verde abajo + card glass `rgba(0,0,0,0.2)` radius 40px
- **Tipo:** Rubik **Bold** grande; línea 2 en `#01FD91`; cuerpo 32px blanco
- **CTA:** botón sólido `#01FD91`, radius 20px, texto negro 32px — o cierre italic sin botón
- **Logo:** Wavys abajo (centro o izquierda)
- **Opcional:** **Wavi** 3D derecha, stats (78%, 5 min, 10×), paneles con líneas divisorias

| Frame referencia | Node | Uso |
|----------------|------|-----|
| Lo que la IA nos enseñó 4 | `833:113` | Tips / mindset IA, CTA “Síguenos” |
| No respondiste a tiempo. | `778:14` | Dolor velocidad + Wavi + cierre italic |
| Tu negocio está respondiendo | `651:66` | Stats + quote + automatización |
| Probamos agentes IA… GRATIS | `651:151` | Oferta / promo |
| Integración instantánea | `662:69` | Integraciones + métricas ROI |

**URL ejemplo (serie Agente):**  
https://www.figma.com/design/59V65PuX0A872JOibvhh11/Posts?node-id=833-113

**Cuándo:** LinkedIn, IG feed 1080×1350, carruseles, cultura + ventas — **default del agente**.

### A — **Ventas / producto** (clásica)

- Ref frame: `Pieza de ventas` (`1:5`)
- Gradiente exterior + card `#000908` + tab superior izquierda
- Engranaje 3D derecha
- Bullets + emoji + botón gradiente

**Cuándo:** LinkedIn outbound, WhatsApp, demos, pricing, agencias.

### B — **Editorial / tendencias** (opcional)

- Ref frame: `Post 7 de febrero - Facebook- linkedin` (`165:137`)
- Fondo ondas teal/verde, bloque inferior oscuro
- Wavi + logos partners si aplica
- Headline verde 44px + cuerpo 28px con highlights en `#01FD91`

**Cuándo:** noticias IA, comparativas, cultura dev — **no** mezclar con propuesta comercial dura en la misma imagen.

---

## 5. Workflow del agente (Figma + Gemini creativo)

```
1. Leer esta guía + brand-channels.md + frames referencia en Figma Agente
2. Duplicar frame base (familia C) en página Agente
3. ¿Falta visual único? → generate_image (Gemini) — fondos, 3D, texturas, escenas
4. Importar JPG a Figma + componer con Rubik, glass card, logo (tipografía SIEMPRE en Figma)
5. Ser creativo en composición, luz, metáforas visuales — respetar tokens §2
6. Copy ES → Phil aprueba → export PNG/JPG
7. Opcional: remocn para video
```

### Cuándo usar Gemini (`generate_image`)

| Generar con Gemini | NO generar (hacer en Figma) |
|--------------------|----------------------------|
| Fondos aurora / gradientes orgánicos | Titulares y cuerpo (Rubik exacta) |
| Iconos 3D glass (reloj, chat, WhatsApp abstracto) | Logo Wavys |
| Escenas mood (oficina, dashboard glow) | CTAs con copy final |
| Variaciones creativas de Wavi / mascota | Stats y números (78%, 5 min) |
| Texturas, partículas, luz neón ambiental | Layout final pixel-perfect |

**Creatividad:** no repetir el mismo layout aburrido. Probar ángulos, profundidad, glass, glow, split con Wavi, paneles con líneas — como los frames `833:113`, `778:14`, `651:66`. La marca es **oscura + neón + humano**, no corporate genérico.

### Plantilla de prompt Gemini (social Wavys)

Usar cuando haga falta un asset visual. **No pedir texto largo en la imagen** — el copy va en Figma.

```
Creative social media background asset for Wavys Technologies AI agency.
Style: dark premium tech #070604 base, aurora gradient teal #5AD2D0 to neon green #01FD91,
glassmorphism glow, subtle grain, cinematic lighting, 3D translucent glass elements.
Mood: [urgency / empowerment / integration / promo — según post].
Subject: [abstract WhatsApp chat bubbles / glowing clock / teal mascot drop shape / dashboard hologram].
No text, no logos, no watermarks. High-end B2B SaaS LatAm aesthetic. Bold and modern, not stock photo.
Aspect ratio [1:1 | 4:5 | 9:16]. Leave negative space [left | center] for typography overlay in Figma.
```

Ejemplo tool:

```bash
npm run tool -- generate_image '{"prompt":"Creative social background for Wavys AI agency. Dark #070604, aurora teal-to-neon-green gradient from bottom, glassmorphism particles, abstract 3D translucent chat bubbles floating, cinematic glow, no text no logo, bold modern B2B tech mood urgency, negative space left for headline","aspectRatio":"1:1","outputPath":"data/generated-images/bg-linkedin-urgency.jpg"}'
```

### Jerarquía de fuentes de verdad

1. **Figma Posts / página Agente** — composición final + tipografía  
2. **Esta guía** — reglas, tokens, creatividad dentro de marca  
3. **Gemini** — assets visuales cuando el frame lo necesite (híbrido, no reemplazo total)  
4. **`data/generated-images/`** — staging local (gitignored); importar a Figma y conservar o borrar  

---

## 6. Checklist antes de entregar a Phil

- [ ] Formato correcto (px)
- [ ] Colores §2.1 (muestra en Figma o inspección)
- [ ] Rubik en textos principales
- [ ] Hook visible sin zoom
- [ ] Un solo CTA
- [ ] Logo Wavys presente (si pieza corporativa)
- [ ] Ortografía ES revisada
- [ ] CTA alineado al canal (`brand-channels.md`)

---

## 7. Changelog (actualizar al cambiar reglas)

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-07-01 | Guía inicial + página Agente en Figma | Agente / Phil |
| 2026-07-01 | Familia **C Agente glass** + workflow **Gemini creativo** híbrido con Figma | Agente / Phil |

---

## 8. Enlaces

- Figma Agente: https://www.figma.com/design/59V65PuX0A872JOibvhh11/Posts?node-id=651-65
- Ref “La IA no te reemplaza”: https://www.figma.com/design/59V65PuX0A872JOibvhh11/Posts?node-id=833-113
- Canales: `agent/context/brand-channels.md`
- Conexión Figma: `agent/connections/figma-posts.md`
- Video: `agent/context/remocn-video-ecosystem.md`
