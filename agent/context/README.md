# Contexto del proyecto — índice

Lee estos archivos **al iniciar cualquier tarea** para Phil / Wavys.

| Archivo | Contenido |
|---------|-----------|
| [founder-profile.md](./founder-profile.md) | Quién es Phil, cómo trabaja, leads activos, cómo avanzar |
| [brand-channels.md](./brand-channels.md) | LinkedIn, TikTok, Instagram, webs, reglas de contenido |
| [business-plan.md](./business-plan.md) | Plan operativo completo (ventas, marketing, finanzas, etc.) |
| [recommended-skills.md](./recommended-skills.md) | Skills Cursor/Claude a instalar por área |
| [growth-focus-phil.md](./growth-focus-phil.md) | **Prioridad Phil:** poco tiempo, foco clientes |
| [campaigns/README.md](./campaigns/README.md) | **Campañas comerciales** — productos empaquetados (activa + retiradas) |
| [campaigns/wavys-os.md](./campaigns/wavys-os.md) | **Campaña activa:** Wavys OS — pricing, kit, demos |
| [campaigns/presencia-digital.md](./campaigns/presencia-digital.md) | **Retirada:** Presencia Digital (archivo; no vender) |
| [repos-map.md](./repos-map.md) | **Repos** en `/Volumes/mac externo/Mac Externo/projects/` |
| [remocn-video-ecosystem.md](./remocn-video-ecosystem.md) | **Video en código:** remocn, RemotionUI, Framecn, skills y quick start |
| [../connections/figma-posts.md](../connections/figma-posts.md) | **Posts sociales:** Figma *Posts* — tipografía, colores, formatos |
| [../connections/brand-logos.md](../connections/brand-logos.md) | **Logos oficiales** — isotipo + lockups (2026) |
| [wavys-visual-brand-guide.md](./wavys-visual-brand-guide.md) | **Guía Agente:** invariantes, creatividad mensual, workflow Figma |
| [content-feedback-log.md](./content-feedback-log.md) | **Retro Phil** — qué evitar/repetir en contenido |
| [pipeline-gates.md](./pipeline-gates.md) | **Gates completos** — Gate 0 + Gate 1+ en **11 pipelines** ✅ |
| [image-cutout-pipeline.md](./image-cutout-pipeline.md) | **Recorte fondo** — Gemini → PNG cutout para flyers, posts y video |
| [website-stack-rules.md](./website-stack-rules.md) | **Stack websites:** landing → Astro · sistema → Next.js · **pipeline cliente** |
| [website-feedback-log.md](./website-feedback-log.md) | **Retro Phil** — websites / landings / tipografía / UX / anti-slop |
| [website-audit-tools.md](./website-audit-tools.md) | **Auditar webs de clientes** — Cursor Browser (screenshots) + Browser Use CLI (Python/CDP) |
| [design-patterns-animal-health-behance.md](./design-patterns-animal-health-behance.md) | **Patrones UI** — referencia Behance Animal Health (veterinaria); leer si hay capturas o fidelidad visual |
| [design-patterns-florist-editorial-pinterest.md](./design-patterns-florist-editorial-pinterest.md) | **Patrones UI** — florería editorial (Pinterest / top florist sites); investigación obligatoria sin capturas |
| [design-patterns-bakery-editorial.md](./design-patterns-bakery-editorial.md) | *(obsoleto v1)* — reemplazado por playful Pinterest |
| [design-patterns-bakery-playful-pinterest.md](./design-patterns-bakery-playful-pinterest.md) | **Patrones UI** — pastelería playful (dark hero, scallop, circular text); **no clonar florería** |
| [design-patterns-football-club-sports.md](./design-patterns-football-club-sports.md) | **Patrones UI** — club de fútbol (scoreboard, dorsales, rayas kit); **no clonar pastelería** |
| [design-patterns-textiles-suave-hogar.md](./design-patterns-textiles-suave-hogar.md) | **Patrones UI** — textiles/toallas/medias (editorial crema, catálogo); **no clonar fc-altamar** |

## Skills del repo (procedimientos)

| Skill | Cuándo |
|-------|--------|
| `agent/skills/wavys_os_onboarding/SKILL.md` | **Onboarding Wavys OS** — Tienda / Salón / Restaurante (chat → pack → web → oferta → módulos) |
| `agent/skills/wavys_os_phase_validator/SKILL.md` | **Gates build** Wavys OS por fase |
| `agent/skills/wavys_os_campaign_validator/SKILL.md` | **Gate GTM** campaña OS (doc, kit, landing, CTA) |
| `agent/skills/one_call_landing/SKILL.md` | **Landing cliente** → Astro — **pipeline fijo:** investigar → doc patrones → build → validar |
| `agent/skills/one_call_website/SKILL.md` | **Sistema / app / automatización** → **Next.js** |
| `agent/skills/reference_ui_copy/SKILL.md` | Capturas Pinterest, Dribbble, Behance — copiar UI fiel |
| `agent/skills/website_audit/SKILL.md` | **Auditar website** cliente/prospecto — diseño, CTAs rotos, móvil, informe comercial |
| `agent/skills/video_production/SKILL.md` | **Video MP4/reels/promos** — investigación profunda → storytelling → plan visual → ejecutar → validación exhaustiva |

**Gates:** `agent/context/pipeline-gates.md` · índice `agent/pipelines/README.md` · subagentes `agent/pipelines/subagents.md` · **11 pipelines Gate 0 + Gate 1+ ✅**

## Datos vivos (runtime)

- `data/notes.json` — notas de negocio registradas
- `data/reminders.json` — recordatorios pendientes
- `agent/instructions.md` — reglas permanentes del agente

## Flujo al recibir una tarea de Phil

```
1. founder-profile.md       → quién es y qué priorizar
2. growth-focus-phil.md     → campaña / canal que manda ahora
3. campaigns/wavys-os.md     → marketing / demos / pricing PYME (PD retirada)
4. brand-channels.md        → si es contenido en redes
5. business-plan.md         → si es ventas/ops/estrategia general
6. data/*.json              → contexto reciente
7. agent/skills/            → procedimiento específico (`content_production`, `one_call_landing`, etc.)
8. recommended-skills       → skill global si hace falta redactar/mejorar
```
