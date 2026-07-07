# Reglas de stack — websites Wavys (Phil)

**Decisión permanente — 2026-07-03** · actualizado 2026-07-03 (pipeline cliente)

Phil creará **muchas websites** de forma recurrente. El agente elige stack según **tipo de pedido**, no al azar.

---

## Regla principal

| Phil pide… | Stack | Skill |
|------------|-------|-------|
| **Landing** (marketing, one-page, clínica, restaurante, portfolio simple, capturas Pinterest/Dribbble/Behance) | **Astro** | `agent/skills/one_call_landing/SKILL.md` |
| **Sistema, app, automatización, dashboard, multi-página con lógica, integraciones API** | **Next.js** | `agent/skills/one_call_website/SKILL.md` |

### Palabras clave → Astro (landing)

- landing, sitio web, website, one-page, página de aterrizaje
- clínica, veterinaria, restaurante, pastelería, florería, estudio, abogados (solo presencia)
- “copia este diseño”, referencia visual, Behance, Dribbble, Pinterest
- demo para cliente, presencia digital, marketing

### Palabras clave → Next.js (sistema)

- sistema, plataforma, app, dashboard, panel, admin
- automatización, CRM, booking con backend, login, auth
- integración API, webhooks, base de datos, multi-ruta compleja
- SaaS, producto, portal cliente

### Si hay duda

- ¿Solo mostrar info + CTA + formulario UI? → **Astro**
- ¿Usuarios, datos persistentes, lógica de negocio? → **Next.js**

---

## Pipeline cliente (landings) — SIEMPRE IGUAL

Cuando Phil pida crear una website de cliente, seguir **`one_call_landing`** sin atajos:

```
Investigar → Doc patrones → Marca → Scaffold → Imágenes → Build → Validar → Entregar
```

| Paso | Obligatorio |
|------|-------------|
| Investigar 3+ referencias (Pinterest, createtoday, etc.) | Sí, aunque no haya pin |
| `design-patterns-<slug>.md` antes de codear | Sí |
| Diferenciarse del website anterior del batch | Sí |
| Deploy Vercel | Solo si Phil lo pide |
| `bun run dev` local | Si no pidió deploy |

Detalle completo: `agent/skills/one_call_landing/SKILL.md`

---

## Por qué

| | Astro (landing) | Next.js (sistema) |
|--|-----------------|-------------------|
| JS al cliente | Mínimo (HTML estático + islands) | Mayor (React) |
| Lighthouse | Excelente por defecto | Bueno; requiere cuidado |
| Referencias visuales | Componentes `.astro` + CSS | React + Tailwind (como lumen-vet) |
| Evolución | Migrar a Next si crece | Ya preparado para escalar |
| Deploy | Vercel, Netlify, Cloudflare | Vercel (stack Wavys) |

---

## Común a ambos

1. Leer `website-feedback-log.md` al inicio
2. Leer `reference_ui_copy` si hay capturas Phil
3. `screenshot-analyzer` → analizar referencia
4. Imágenes **Gemini** vía `wavys-agents` (`generate_image`)
5. Guardar patrones en `agent/context/design-patterns-<proyecto>.md` **antes** de codear
6. **Pre-entrega:** `ui-ux-pro-max` + validación 390px + 1440px
7. Retro en `website-feedback-log.md` cuando Phil dé feedback

---

## Proyectos existentes

| Proyecto | Stack | Nota |
|----------|-------|------|
| `lumen-vet` | Next.js | Demo Animal Health — anterior a regla Astro |
| `pitlane-moto` | Astro | Motos — industrial |
| `petalo-floreria` | Astro | Florería — editorial |
| `miga-pasteleria` | Astro | Pastelería — playful |

**Nuevas landings:** Astro + pipeline `one_call_landing`.

---

## Package manager

**Bun** en ambos stacks (`bun install`, `bun run build`).

Excepción: tools en `wavys-agents` siguen con `npm run tool`.
