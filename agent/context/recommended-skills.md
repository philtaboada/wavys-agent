# Skills recomendados para Wavys

Mapa de skills (Cursor / Claude / Codex) alineados con `business-plan.md`.
Catálogo: https://skills.sh/

## Cómo instalar

```bash
# Global (disponible en todos tus proyectos Cursor)
npx skills add <owner/repo@skill> -g -y

# Solo en wavys-agents
cd wavys-agents && npx skills add <owner/repo@skill> -y
```

Con bun (alternativa):

```bash
bunx skills add <owner/repo@skill> -g -y
```

---

## Tier 1 — Instalar ya (impacto directo en ventas Wavys)

| Skill | Para qué | Área del plan |
|-------|----------|---------------|
| `coreyhaines31/marketingskills@sales-enablement` | Materiales ventas, objeciones, enablement | §5 Ventas |
| `coreyhaines31/marketingskills@cold-email` | Correos fríos y follow-ups (Onza, agencias) | §2 Prospección, §4 Propuestas |
| `coreyhaines31/marketingskills@email-sequence` | Secuencias 48h / 5d / 14d post-propuesta | §7 Seguimiento |
| `claude-office-skills/skills@proposal-writer` | Propuestas partner + SaaS en PDF/doc | §4, §8 Onza |
| `refoundai/lenny-skills@partnership-bd` | Estructura acuerdos con agencias | §13 Partners |
| `refoundai/lenny-skills@sales-qualification` | Calificar leads (SÍ/NO) | §15 Calificación |
| `anthropics/knowledge-work-plugins@compose-outreach` | Mensajes LinkedIn personalizados | §2 LinkedIn |

```bash
npx skills add coreyhaines31/marketingskills@sales-enablement -g -y
npx skills add coreyhaines31/marketingskills@cold-email -g -y
npx skills add coreyhaines31/marketingskills@email-sequence -g -y
npx skills add claude-office-skills/skills@proposal-writer -g -y
npx skills add refoundai/lenny-skills@partnership-bd -g -y
npx skills add refoundai/lenny-skills@sales-qualification -g -y
npx skills add anthropics/knowledge-work-plugins@compose-outreach -g -y
```

---

## Tier 2b — UI/UX y copiar referencias visuales (Pinterest, Dribbble, Behance)

**No existe** un skill global que copie pins/shots tal cual. Los llamados `pinterest-ui-skills` / `dribbble-ui-skills` construyen UI **estilo app Pinterest/Dribbble**, no tu moodboard.

| Recurso | Para qué |
|---------|----------|
| **`agent/skills/reference_ui_copy/SKILL.md`** (repo Wavys) | Pipeline: capturas Phil → patrones → build fiel → validar |
| `design-patterns-*.md` en `agent/context/` | Fuente de verdad por proyecto (ej. Animal Health) |
| `nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max` | Auditoría UX, tipografías, contraste (~248K installs) |
| `wondelai/skills@web-typography` | Escalas y legibilidad |
| `notedit/happy-skills@screenshot-analyzer` | Análisis multi-agent de screenshot (opcional, pre-build) |

```bash
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max -g -y
npx skills add wondelai/skills@web-typography -g -y
# opcional:
npx skills add notedit/happy-skills@screenshot-analyzer -g -y
```

**Instalados en Phil (2026-07-03):** `ui-ux-pro-max` ✅ · `screenshot-analyzer` ✅ · `web-typography` ✅

**Flujo Phil:** capturas → `reference_ui_copy` → patrones → **`one_call_landing`** (landing Astro) o **`one_call_website`** (sistema Next)

---

## Tier 2d — Recorte de fondo (flyers, posts, video)

Cuando un asset Gemini (objeto, icono 3D, producto) debe **flotar** sobre otro fondo — no es full-bleed.

| Recurso | Para qué |
|---------|----------|
| **`agent/context/image-cutout-pipeline.md`** | Pipeline Wavys: Gemini fondo blanco → PNG transparente → Figma/flyer/HF |
| `inference-sh/skills@background-removal` | Skill global para quitar fondo (instalar una vez) |

```bash
npx skills add inference-sh/skills@background-removal -g -y
```

**Integrado en:** `social_design`, `presencia_brief`, `content_production`, `video_production` (Fase ③b).

**Pendiente repo:** tool `remove_background` en `agent/tools/` — ver checklist en pipeline doc.

---

## Tier 2c — Auditoría web de clientes (investigar URL)

**Skill repo:** `agent/skills/website_audit/SKILL.md` · **Referencia:** `agent/context/website-audit-tools.md`

| Herramienta | Para qué |
|-------------|----------|
| **Cursor Browser MCP** (integrado) | Screenshots, UX visual, probar botones — **siempre** en informes |
| **Browser Use CLI** (`browser-use`) | Python → CDP; batch, checklists repetibles, cloud Chrome |
| **`curl`** | Peso HTML, enlaces `#`, meta, placeholders dev |

Browser Use **no reemplaza** Cursor Browser para capturas en el chat. Se **complementan**.

```bash
# Instalar una vez (Mac)
uv tool install --python 3.12 --upgrade --force browser-use
browser-use skill install
browser-use --doctor
```

Docs: https://docs.browser-use.com/open-source/browser-use-cli

**Flujo Phil:** URL cliente → Cursor Browser (informe + screenshots 390/1440) → opcional `browser-use` si batch → `log_business_note`

---

## Tier 2 — Marketing y contenido

| Skill | Para qué | Área del plan |
|-------|----------|---------------|
| `coreyhaines31/marketingskills@copywriting` | Web, propuestas, mensajes | §1 Marketing |
| `coreyhaines31/marketingskills@content-strategy` | Plan 3 posts/semana | §1 Cadencia |
| `kostja94/marketing-skills@linkedin-posts` | Posts LinkedIn B2B | §1 LinkedIn |
| `codex/skills/trendingcontent` | Contenido trending ES/EN | §1 Contenido |
| `codex/skills/paid-ads` | Meta/LinkedIn ads B2B LatAm | §1 (cuando escales paid) |
| `github/awesome-copilot@gtm-ai-gtm` | GTM para producto IA | Posicionamiento SaaS |
| `github/awesome-copilot@gtm-partnership-architecture` | Arquitectura canal partner | §13 |

```bash
npx skills add coreyhaines31/marketingskills@copywriting -g -y
npx skills add kostja94/marketing-skills@linkedin-posts -g -y
npx skills add github/awesome-copilot@gtm-ai-gtm -g -y
```

---

## Tier 3 — Operaciones diarias (ejecución real)

### Ya los tienes instalados — úsalos

Están en `~/.claude/skills/` y Cursor los expone como agent skills:

| Skill local | Uso Wavys |
|-------------|-----------|
| `persona-sales-ops` | Pipeline deals, llamadas, comms cliente |
| `persona-exec-assistant` | Agenda, prioridades, ritmo semanal |
| `persona-content-creator` | Posts y contenido |
| `gws-gmail-send` / `gws-gmail-triage` | Enviar propuesta Onza, triage inbox |
| `gws-gmail-reply` | Follow-ups en hilo |
| `gws-calendar-insert` | Agendar discovery 20 min |
| `gws-workflow-meeting-prep` | Prep llamada Onza / discovery |
| `gws-workflow-email-to-task` | Email → tarea seguimiento |
| `gws-workflow-weekly-digest` | Revisión pipeline viernes |
| `gws-sheets-append` / `gws-sheets-read` | CRM en Sheet hasta integrar tool |
| `gws-docs-write` | Propuesta en Google Doc → PDF |
| `recipe-draft-email-from-doc` | Borrador email desde doc propuesta |

**Requisito:** CLI `gws` configurado con Google Workspace.

### Instalar si usas WhatsApp producto (Wavys core)

| Skill | Para qué |
|-------|----------|
| `gokapso/agent-skills@integrate-whatsapp` | Integraciones WhatsApp API |
| `gokapso/agent-skills@automate-whatsapp` | Automatización flujos |
| `claude-office-skills/skills@whatsapp-automation` | Workflows WhatsApp genéricos |

```bash
npx skills add gokapso/agent-skills@integrate-whatsapp -g -y
```

---

## Campaña Presencia Digital (brief + storytelling)

Instalar cuando reescribas brief, mensajes o landing con narrativa de venta:

| Skill | Installs | Para qué |
|-------|----------|----------|
| `rampstackco/claude-skills@creative-brief` | ~95 | Estructurar brief comercial (problema → entregable) |
| `louisblythe/salesskills@storytelling` | ~151 | Historias y casos en ventas — hacer beneficios concretos |
| `gtmagents/gtm-agents@brand-narrative-playbook` | ~64 | Arco narrativo: contexto → tensión → resolución → prueba → CTA |
| `coreyhaines31/marketingskills@copywriting` | — | Copy landing, emails, mensajes (ya en Tier 2) |
| `thatrebeccarae/claude-marketing@copywriting-frameworks` | ~47 | Frameworks PAS/AIDA para ads y sales pages |

```bash
npx skills add rampstackco/claude-skills@creative-brief -g -y
npx skills add louisblythe/salesskills@storytelling -g -y
npx skills add gtmagents/gtm-agents@brand-narrative-playbook -g -y
npx skills add thatrebeccarae/claude-marketing@copywriting-frameworks -g -y
```

Guía interna campaña: `data/presencia-digital-brief/STORYTELLING-GUIA.md`  
Skill brief comercial: `agent/skills/presencia_brief/SKILL.md`

**Evitar para este caso:** `anthropics/knowledge-work-plugins@sales-brief` — está orientado a análisis PayPal/QuickBooks, no brief comercial PYME.

---

| Skill | Para qué | Área del plan |
|-------|----------|---------------|
| `phuryn/pm-skills@business-model` | Refinar 2 marcas + pricing | §10 Finanzas |
| `deanpeters/product-manager-skills@business-health-diagnostic` | Salud del negocio trimestral | Checklist maestro |
| `github/awesome-copilot@gtm-technical-product-pricing` | Pricing SaaS técnico | §10 |
| `alirezarezvani/claude-skills@business-growth-skills` | Crecimiento early-stage | Metas 90 días |

---

## Skills del propio proyecto wavys-agents

Estos viven en `agent/skills/` y Cursor los lee en contexto del repo:

| Skill | Cuándo |
|-------|--------|
| `one_call_landing` | **Landing** marketing → Astro |
| `one_call_website` | **Sistema / app** → Next.js |
| `reference_ui_copy` | Capturas Pinterest, Dribbble, Behance |
| `sales_pipeline` | LinkedIn, propuestas, Onza |
| `email` | Envío con `send_email` tool |
| `reminders` | Plazos y follow-ups |
| `business_notes` | Contexto persistente |
| `svg_icon_from_image` | Foto/imagen → ícono SVG por abstracción (no auto-trace); Affinity MCP |

No compiten con skills globales: los globales **redactan/mejoran**; los del proyecto **ejecutan** (`npm run tool`).

---

## Matriz: área del plan → skill

| Área | Skill global | Skill proyecto / tool |
|------|--------------|---------------------|
| LinkedIn outbound | `compose-outreach`, `cold-email` | `sales_pipeline` |
| Propuesta partner | `proposal-writer`, `partnership-bd` | `send_email`, `gws-docs-write` |
| Follow-up | `email-sequence` | `create_reminder` |
| Discovery call | `meeting-prep`, `sales-qualification` | `log_business_note` |
| Pipeline CRM | `persona-sales-ops`, `gws-sheets` | `data/notes.json` (hasta tool CRM) |
| Contenido LinkedIn | `linkedin-posts`, `copywriting` | `persona-content-creator` |
| Ritmo semanal | `persona-exec-assistant`, `weekly-digest` | `create_reminder` |
| WhatsApp producto | `integrate-whatsapp` | entrega Wavys SaaS |
| Legal/compliance | — | revisión humana obligatoria |

---

## Stack recomendado mínimo (Phil solo founder)

**7 globales + gws + proyecto:**

1. `sales-enablement`
2. `cold-email`
3. `proposal-writer`
4. `partnership-bd`
5. `compose-outreach`
6. `sales-qualification`
7. `linkedin-posts`

**+ activar:** `persona-sales-ops`, `gws-gmail-send`, `gws-workflow-meeting-prep`

**+ repo:** `wavys-agents` con tools y `business-plan.md`

---

## Buscar más skills

```bash
npx skills find <keyword>
```

Keywords útiles: `sales`, `outreach`, `proposal`, `partner`, `gtm`, `email`, `linkedin`, `crm`, `whatsapp`.

---

## Notas

- Skills de **marketing** redactan; no envían correos solos. Siempre confirma antes de `send_email` o `gws gmail +send`.
- Skills **gws** requieren OAuth Google configurado.
- Skills **Resend** no existen como skill dedicado; usa tool `send_email` del proyecto.
- Evita instalar 30 skills a la vez; empieza Tier 1 y añade según fricción real.
