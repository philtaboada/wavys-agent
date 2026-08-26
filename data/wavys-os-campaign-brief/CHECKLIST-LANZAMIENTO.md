# Wavys OS — Checklist de lanzamiento

**Producto:** Wavys OS (packs Tienda · Salón · Restaurante)  
**Actualizado:** 2026-07-22  
**Uso:** marcar ítems al avanzar; no inventar “lanzado” si L3 no está cerrado.

Basado en skills investigados + gates del repo:

| Fuente | Rol |
|--------|-----|
| [`gtm-0-to-1-launch`](https://skills.sh/github/awesome-copilot/gtm-0-to-1-launch) | De producto a **primeros clientes** |
| [`launch-checklist`](https://skills.sh/buildgreatproducts/builder-os/launch-checklist) | De “corre en mi máquina” a **clientes en prod** |
| [`gtm-ai-gtm`](https://skills.sh/github/awesome-copilot/gtm-ai-gtm) | Posicionamiento GTM producto IA |
| `wavys_os_phase_validator` | Gates build F0–F8 |
| `wavys_os_campaign_validator` | Gate GTM campaña (doc + kit + landing) |
| `wavys_os_brief_validator` | Briefs pack PDF listos |
| `wavys_os_onboarding` | Flujo chat MVP |

**CTA fase actual:** demo Calendly → https://calendly.com/philtaboada2julio  
**Self-serve cobro:** solo tras L3 (legal + Polar prod + DNS).

---

## Cómo leer el estado

| Marca | Significado |
|-------|-------------|
| `[x]` | Hecho (evidencia en repo / log) |
| `[ ]` | Pendiente para lanzamiento |
| `~` | Parcial / documentado pero no live |

---

## L0 — Producto usable (build)

*Skill:* `wavys_os_phase_validator` · Log: `data/pipeline-runs/wavys-os-phase-*-validation.md`

- [x] Fases 0–8 en **PASS** (repo `wavys-os`)
- [x] Packs MVP: Tienda / Salón / Restaurante definidos
- [x] Pricing oficial: Presence S/169 · Operate S/279 · Scale S/449
- [x] Onboarding chat documentado (`wavys_os_onboarding`)
- [x] Observabilidad / rate limits / runbooks (F8)
- [ ] Smoke E2E en **staging/prod**: registro → pack → web `{slug}.wavys.app` → oferta en ≤30 min
- [ ] 1 misión real por pack (tienda stock/precio · salón cita · resto agotado) sin “vaporware” en demo

**Gate L0:** producto demuestra el loop en ambiente real, no solo en docs.

---

## L1 — Listo para clientes (prod técnico)

*Skill:* `builder-os@launch-checklist` · Docs ops en `wavys-os`

- [x] Stack / secrets documentados (`.env.example` / ops)
- [x] Polar elegido como MoR (`cobro-polar.md`) — no Stripe directo PE
- [x] Polar **sandbox** planes Presence / Operate / Scale (IDs en `cobro-polar.md` §2.1)
- [x] Smoke cobro sandbox E2E completo: pago tarjeta → webhook → plan + créditos en DB (2026-07-23)
- [ ] Polar sandbox add-ons + top-ups (Marketing Posts/Pro · Credits Mini/Medio/Mega)
- [ ] Polar **prod** + webhooks live (después de OK legal)
- [ ] DNS wildcard `*.wavys.app` **aplicado** en registrador (hoy: doc OK, DNS ~)
- [ ] App reachable en dominio prod (auth + chat + web tenant)
- [ ] Páginas `/legal/terms` y `/legal/privacy` publicadas con texto revisable
- [ ] Error tracking (Sentry) con `SENTRY_DSN` en prod
- [ ] Backups / restore DB documentado y probado una vez
- [ ] Secrets prod ≠ sandbox (Polar, Gemini, Redis, R2)

**Gate L1:** un cliente externo puede usar el producto sin VPN ni “máquina de Phil”.

---

## L2 — Campaña GTM (mensaje + assets)

*Skills:* `wavys_os_campaign_validator` · `wavys_os_brief_validator` · `gtm-ai-gtm`

### Posicionamiento (`gtm-ai-gtm`)

- [x] Una frase de valor (chat → web + operación)
- [x] ICP packs Tienda / Salón / Restaurante
- [x] Anti-canibalización: Presencia Digital **retirada**
- [x] CTA primario fijado (Calendly demos; no waitlist)

### Kit + landing (`wavys_os_campaign_validator`)

- [x] Doc campaña `agent/context/campaigns/wavys-os.md`
- [x] Kit: BRIEF · MENSAJES · STORYTELLING · PLAN 7 DÍAS · DEMO-CONTRATO
- [x] Landing `/wavys-os` en `theros-website` (build OK)
- [ ] Landing **deployed** en https://software.wavys-technologies.com/wavys-os (smoke prod)
- [x] Misma URL Calendly en campaña + kit + landing

### Briefs pack (`wavys_os_brief_validator`)

- [x] PDF Tienda / Salón / Restaurante con módulos + imágenes Gemini
- [x] Revisor pack en **PASS** (`wavys-os-pack-brief-validation.md`)
- [ ] Brief general `Wavys-OS-Brief.pdf` al mismo nivel visual (opcional)

**Gate L2:** puedes explicar, enviar PDF del pack y agendar demo sin improvisar precios/CTA.

---

## L3 — Soft launch cobro (unlock self-serve)

*Skills:* `launch-checklist` + `soporte-legal.md` · **bloquea** marketing de cobro automático

- [ ] Borradores Términos + Privacidad (IA OK)
- [ ] **OK abogado PE** (Ley 29733, MoR Polar, cancelación, limitación)
- [ ] Contador / facturación PE alineada a payouts Polar
- [ ] Polar products **prod** activos (montos = pricing oficial)
- [ ] Checkout end-to-end: plan → pago → entitlements
- [ ] DNS `*.wavys.app` + tenant web estable post-pago
- [ ] Copy comercial deja de decir “solo demo” y ofrece self-serve Presence (opcional Calendly enterprise)

**Gate L3:** se puede cobrar en prod sin riesgo legal/técnico consciente.  
Hasta entonces: **demos / design partners**, no Polar prod como CTA primario.

---

## L4 — Primeros clientes (`gtm-0-to-1-launch`)

*Skill:* `gtm-0-to-1-launch` · Plan: `PLAN-MARKETING-7-DIAS.md`

### Canal y outreach

- [ ] 25+ mensajes WhatsApp/IG/LinkedIn (`MENSAJES-COMPARTIR.md`)
- [ ] Lista ICP: ≥10 tiendas · ≥5 salones · ≥5 restaurantes (Huancayo/Lima/provincias)
- [ ] Referidos a William / JLH / Coophitel (1 intro > 20 cold)
- [ ] Landing prod + Calendly en bio / mensajes

### Demos / design partners

- [ ] Meta: **5–10 demos** agendadas (14–21 días)
- [ ] Cobertura packs: ≥1 Tienda + ≥1 Salón o Restaurante
- [ ] Cada demo: `DEMO-CONTRATO.md` + nota `log_business_note` tag `wavys-os`
- [ ] Feedback post-demo → backlog producto (1 doc o notas)

### Cierre blando (pre-L3)

- [ ] Piloto design partner con precio promo acordado **o** gratis acotado (Phil)
- [ ] No prometer: dominio custom, Yape/Culqi, video marketing, packs fuera MVP

**Gate L4:** hay conversaciones reales y al menos un pack validado con usuario externo.

---

## L5 — Medición (lanzamiento que se puede mejorar)

*Skill:* `gtm-0-to-1-launch` (loop métricas)

| Métrica | Meta lanzamiento | Estado |
|---------|------------------|--------|
| Registro → web lista | ≤30 min | [ ] medir en staging/prod |
| Demos agendadas | 5–10 / 14–21 días | [ ] |
| Respuestas outreach | ≥5 | [ ] |
| Design partners activos | ≥3 | [ ] |
| Pago Polar prod | solo post-L3 | [ ] bloqueado |
| Tiempo demo → “sí piloto” | trackear | [ ] |

Instrumentar (mínimo):

- [ ] Evento/analítica: registro, pack elegido, web ready, checkout started/paid
- [ ] Dashboard simple o sheet Phil (demos, pack, resultado)

**Gate L5:** sabes dónde se rompe el funnel (registro / web / pago).

---

## Orden recomendado (no saltar)

```text
L0 smoke real  →  L2 deploy landing  →  L4 demos
         ↘
          L1 Polar sandbox + DNS
                 ↘
                  L3 legal + Polar prod  →  self-serve + L5 pago
```

1. **Esta semana (lanzamiento demos):** L0 smoke + L2 deploy landing + L4 outreach.  
2. **En paralelo:** L1 Polar sandbox + DNS.  
3. **Antes de cobro público:** L3 completo.  
4. **Después:** L5 con pago en el funnel.

---

## Veredicto rápido

| Pregunta | Si falta… |
|----------|-----------|
| ¿Puedo agendar demos? | Cerrar L2 deploy + empezar L4 |
| ¿Puedo decir “lánzate solo y paga”? | Cerrar L3 |
| ¿Está “lanzado” Wavys OS? | L0 smoke + L2 live + ≥1 demo L4 hecha |

### Frase si aún no

> **Lanzamiento incompleto.** Completar checks abiertos de L0–L2 (demos) o L3 (cobro) antes de declarar launch.

---

## Comandos / skills al validar

```bash
# Campaña GTM
# → skill wavys_os_campaign_validator + data/wavys-os-campaign-brief/validador-campana.md

# Briefs pack
cd data/wavys-os-campaign-brief && bun run review-pack-briefs.ts

# Fases producto
# → skill wavys_os_phase_validator + data/wavys-os-brief/validador-fases.md
```

Instalar skills GTM investigados (si faltan en la máquina de Phil):

```bash
npx skills add github/awesome-copilot@gtm-0-to-1-launch -g -y
npx skills add buildgreatproducts/builder-os@launch-checklist -g -y
npx skills add github/awesome-copilot@gtm-ai-gtm -g -y
```

---

*Ubicación:* `data/wavys-os-campaign-brief/CHECKLIST-LANZAMIENTO.md`  
*Campaña:* `agent/context/campaigns/wavys-os.md`
