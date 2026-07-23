# Wavys OS — Plan de software (específico)

**Fecha:** 2026-07-21  
**Producto:** SaaS multi-tenant chat-first · packs Tienda / Salón / Restaurante  
**Fuente de verdad producto:** resto de `data/wavys-os-brief/`  
**Validador obligatorio por fase:** [validador-fases.md](./validador-fases.md)  
**Repo app (a crear):** monorepo `wavys-os` (fuera o sibling de `wavys-agents`; brief vive aquí hasta migrar).

---

## 0. Objetivo del MVP (Definition of Done global)

Un dueño PYME, en ≤ 30 min:

1. Se registra (magic link).  
2. Elige pack (Tienda | Salón | Restaurante) + plan (Presence u Operate).  
3. Completa ContactProfile + BrandKit `min_ready`.  
4. Obtiene web en `{slug}.wavys.app` (runtime **B**).  
5. Tiene oferta inicial (seed o Excel) visible en la web vía API pública.  
6. Opera por chat (cambiar WhatsApp, precio, etc.) con créditos y roles correctos.

**Fuera de MVP:** packs no listados, dominio custom DNS, Culqi/Yape, Marketing video, WhatsApp OTP, multi-sede.

---

## 1. Stack fijo (no negociar en código)

| Capa | Tecnología |
|------|------------|
| Monorepo | pnpm / npm workspaces · Turborepo opcional |
| Panel + site runtime B | **Next.js** App Router · Tailwind · shadcn · TanStack Query/Table · Zustand · Phosphor · AI SDK |
| API | **NestJS** · Prisma · PostgreSQL 16 |
| Jobs | **Worker** Nest/Node · **BullMQ** · **Redis** |
| Storage | MinIO (dev) · **R2/S3** (prod) |
| IA | Vercel AI SDK + AI Gateway · Grok 4.5 (1ª web) · Gemini Flash Lite (chat) · Gemini image |
| Cobro | **Polar** webhooks |
| Auth | **Better Auth** (o Auth.js) · magic link · cookie httpOnly |
| Contenedores | Docker Compose: `web` · `api` · `worker` · `db` · `redis` · `minio` |

---

## 2. Estructura de monorepo (obligatoria)

```text
wavys-os/
├── apps/
│   ├── web/                 # Next: panel + chat + middleware sites B
│   ├── api/                 # NestJS HTTP
│   └── worker/              # BullMQ processors
├── packages/
│   ├── db/                  # Prisma schema, client, migrations
│   ├── shared/              # zod DTOs, pack defs, credit costs, enums
│   └── tsconfig/            # bases TS strict
├── docker-compose.yml
├── .env.example
└── README.md
```

### Dónde va cada cosa (anti-caos)

| Qué | Dónde | Prohibido |
|-----|--------|-----------|
| Schema Prisma | `packages/db` | Schema duplicado en api/web |
| PackDefinition, costos créditos, moldes IDs | `packages/shared` | Hardcode suelto en controllers |
| Tools del chat + `canExecute` | `apps/api` ChatModule / domain services | Lógica de negocio en React |
| UI tablas oferta | `apps/web` + fetch Nest | SQL desde Next |
| Generate website job | `apps/worker` | Bloquear request HTTP 2 min |
| Render público tenant | `apps/web` middleware host → moldes | Repo Astro por cliente |
| Polar webhook | `apps/api` BillingModule | Confiar en client sin firma |
| Tipos DTO | `packages/shared` zod → infer types | `any` en boundaries |

---

## 3. Fases de implementación

Cada fase **empieza y termina** con el [validador](./validador-fases.md).  
Sin `PASS` → no se inicia la siguiente.

---

### Fase 0 — Scaffold & infra local

**Meta:** repo corre en Compose; healthchecks verdes.

| Entrega | Detalle |
|---------|---------|
| Workspaces | `apps/*` + `packages/*` |
| Compose | web:3000, api:3001, worker, postgres, redis, minio |
| TS | `strict: true`, no `any` en packages |
| Lint/format | ESLint + Prettier (o Biome) en CI local |
| `.env.example` | Todas las keys documentadas |
| Health | `GET /health` api · web homepage stub |

**DoD:** `docker compose up` → api health 200 · db migrate dry-run ok.

**Docs:** `arquitectura-tecnica.md` §2–3.

---

### Fase 1 — Database & shared domain

**Meta:** Prisma = `schema-db.md` (revisado) + shared types.

| Entrega | Detalle |
|---------|---------|
| Prisma schema | Identity, auth tables, tenant, brand, contact, billing, credits, website B, offer, stock, CRM light |
| Migración inicial | SQL índices parciales (one owner, invite pending, stock XOR) |
| Seed | Pack configs en código (`shared`), no DB |
| Enums/zod | `PackId`, `PlanId`, `ModuleId`, `MembershipRole`, credit reasons |
| Client | `@wavys/db` exportado |

**DoD:** migrate apply limpio · seed opcional · tipos exportados sin drift.

**Docs:** `schema-db.md`, `modelo-dominio-nucleo.md`.

---

### Fase 2 — Auth & tenancy

**Meta:** magic link + owner membership + aislamiento.

| Entrega | Detalle |
|---------|---------|
| Better Auth | User, session cookie, verification |
| Signup atómico | User + Tenant + Membership(owner) + CreditBalance + BrandKit draft + Contact stub |
| Slug | Unique, sanitizado, conflicto → error tipado |
| Guards Nest | Session required · `TenantGuard` · role decorator |
| Invite | TenantInvite create/accept/revoke (owner) |
| lastTenantId | Resolución tenant en panel |

**DoD:** tests: cross-tenant 403 · un solo owner · staff no invite · invite expiry.

**Docs:** `auth-roles.md`.

---

### Fase 3 — Billing Polar + créditos

**Meta:** plan + créditos reales (sandbox).

| Entrega | Detalle |
|---------|---------|
| Products Polar | Presence / Operate / Scale + top-ups + Marketing addons |
| Webhook | Firma · `BillingEvent` idempotente · update `TenantSubscription` |
| CreditsService | `spend` / `grant` con `FOR UPDATE` + ledger + idempotencyKey |
| UsageCounter | regen web / mes, rate imágenes |
| Panel | ver plan, saldo, CTA upgrade |
| Chat tools | chequeo créditos antes de tools caras |

**DoD:** webhook duplicado = no-op · saldo insuficiente = error claro · grant mensual suma.

**Docs:** `cobro-polar.md`, `costos-creditos-precios.md`, `precios-soles-finales.md`.

---

### Fase 4 — BrandKit, Contact, Offer API

**Meta:** datos que alimentan web y panel.

| Entrega | Detalle |
|---------|---------|
| BrandKit CRUD | Gate `min_ready` calculado en service |
| ContactProfile CRUD | WhatsApp E.164 validado |
| Offer | categories, items, variants, slug por tenant |
| Import Excel job | worker + mapping pack (catalog/menu/service) |
| Public API | `GET /public/v1/:slug/offer` · `/contact` · `POST /leads` + rate limit |
| Panel tablas | TanStack Table oferta |

**DoD:** cambiar precio → public API refleja sin regen web · lead crea Lead.

**Docs:** `modelo-dominio-nucleo.md`, `explicaciones-dia2-api-presencia.md`.

---

### Fase 5 — Website runtime B + generate job

**Meta:** `{slug}.wavys.app` pinta molde + BrandKit + oferta live.

| Entrega | Detalle |
|---------|---------|
| Middleware | host → tenant slug |
| 5 moldes | Componentes sección (hero, offer, about, contact…) |
| `siteConfigJson` | Contrato § schema-db |
| Job `website.generate` | Grok 4.5 → SiteConfig + theme · imágenes Gemini → R2 |
| Gate | Bloquea si BrandKit ≠ min_ready |
| Preview/Publish | status machine draft→generating→preview→published\|failed |
| edit chico | Update BrandKit/siteConfig sin full regen |
| defaultHost | sync con slug |

**DoD:** tenant demo publicable · oferta/contacto binding live · no Astro por tenant.

**Docs:** `website-prompt-moldes.md`, arquitectura sites B.

---

### Fase 6 — Chat panel de mando + onboarding

**Meta:** onboarding guiado ejecutable.

| Entrega | Detalle |
|---------|---------|
| Chat UI | AI SDK stream · layout sidebar Phosphor |
| ChatModule | tools tipadas · `canExecute(role×plan×pack×credits×modules)` |
| Tools MVP | detect_pack, set_plan, upsert_contact, upsert_brand, generate_website, import_offer, enable_module, explain_plan, edit_contact… |
| Guiones | Soft copy de `guiones-chat-onboarding.md` |
| Upsell | Marketing / Operate en sidebar + chat |
| Model routing | Flash Lite chat · Grok solo generate |

**DoD:** happy path Tienda Presence end-to-end en staging · staff bloqueado en generate.

**Docs:** `mvp-onboarding-tienda-salon-resto.md`, `planes-entitlements-chat.md`, `guiones-chat-onboarding.md`.

---

### Fase 7 — Operate mínimo por pack

**Meta:** módulos E+I básicos post-Presence.

| Pack | Entregas mínimas |
|------|------------------|
| **Tienda** | StockLevel adjust · Order simple (estados) |
| **Salón** | Appointment + Resource básico (migración 2) |
| **Resto** | `isSoldOut` en menu · Order cocina light opcional |

Activación solo si plan Operate + flag módulo.  
Presence: chat explica y upsell; no activa.

**DoD:** un flujo Operate por pack en demo · tablas migración 2 aplicadas.

**Docs:** mapa + catálogo módulos + mvp packs.

---

### Fase 8 — Hardening & launch prep

| Entrega | Detalle |
|---------|---------|
| Wildcard DNS | `*.wavys.app` |
| Storage prod | R2 bucket + CORS |
| Observabilidad | Sentry · logs estructurados · cost tags Gateway |
| CI | lint · typecheck · test · migrate |
| Rate limits | auth, public leads, image gen |
| Legal | Términos / privacidad links (abogado antes de cobrar prod) |
| Runbook | Oncall Polar fail, Redis down, generate fail |

**DoD:** checklist launch PASS en validador Fase 8.

---

## 4. Módulos Nest (mapa de ownership)

```text
apps/api/src/
  auth/           # Better Auth bridge, guards
  tenants/        # Tenant, slug, membership, invites
  brand/          # BrandKit
  contact/        # ContactProfile
  offer/          # categories, items, variants, import trigger
  website/        # status, enqueue generate, siteConfig patch
  billing/        # Polar webhook, subscription
  credits/        # balance, ledger, spend/grant
  chat/           # orchestrator + tool registry
  public-api/     # slug routes
  storage/        # S3 client
  stock/          # Fase 7
  scheduling/     # Fase 7
  orders/         # Fase 7
  common/         # filters, prisma, redis, tenant context
```

**Regla:** un módulo de dominio = service + controller (si HTTP) + DTOs zod en `shared`.  
Chat tools llaman **services**, no Prisma directo desde el tool handler suelto.

---

## 5. Apps/web rutas

```text
app/
  (auth)/login/
  (auth)/accept-invite/
  (app)/layout.tsx          # sidebar
  (app)/chat/
  (app)/offer/
  (app)/stock/              # Operate
  (app)/schedule/           # Salón
  (app)/leads/
  (app)/settings/brand/
  (app)/settings/contact/
  (app)/settings/billing/
  (app)/settings/team/
  (site)/                   # runtime B por host (o middleware rewrite)
middleware.ts               # panel session + host tenant
```

---

## 6. Jobs worker

| Job name | Input | Output | Créditos |
|----------|-------|--------|----------|
| `website.generate` | tenantId, moldId? | siteConfig + status | alto (tabla costos) |
| `website.edit_partial` | tenantId, patch | siteConfig | medio/bajo |
| `offer.import_excel` | tenantId, assetId | counts | según filas |
| `image.generate` | tenantId, prompt, kind | MediaAsset | por imagen |

Estados job visibles en chat (poll). Fallo → `Website.lastError` / mensaje chat.

---

## 7. Entitlements (implementación)

```text
canExecute(tool):
  membership.active
  AND roleAllowed(tool, role)
  AND packAllows(module)
  AND planIncludes(module) OR addon
  AND credits.balance >= cost
  AND usageCounter < hardLimit
```

Una sola función en `packages/shared` o `Credits/EntitlementsService` — usada por Chat y por HTTP.

---

## 8. Orden de packs en código

1. Shared + Tienda (catalog) primero (más genérico).  
2. Restaurante (menu flags).  
3. Salón (scheduling migración 2).  

Onboarding chat soporta los 3 desde Fase 6; Operate profundo en Fase 7.

---

## 9. Ambientes

| Env | Uso |
|-----|-----|
| local | Compose + Polar sandbox + Gateway |
| staging | wildcard staging + R2 + Sentry |
| prod | cobro real solo post-legal |

---

## 10. Criterios de calidad transversales (siempre)

1. TypeScript strict · sin `any` en APIs públicas.  
2. Todo dato de negocio con `tenantId` validado.  
3. DTOs zod en boundary HTTP/chat.  
4. Transacciones en signup, spend créditos, accept invite, ownership transfer.  
5. Idempotencia Polar y ledger.  
6. Phosphor only en UI.  
7. Sites = runtime B.  
8. Tests de aislamiento tenant en cada fase que toque DB.  
9. No secrets en git.  
10. Español UX / inglés código.

---

## 11. Trazabilidad a briefs

| Fase | Docs |
|------|------|
| 0 | arquitectura-tecnica |
| 1 | schema-db, modelo-dominio |
| 2 | auth-roles |
| 3 | cobro-polar, costos, precios |
| 4 | dominio, explicaciones API |
| 5 | moldes, arquitectura B |
| 6 | mvp-onboarding, guiones, planes-chat |
| 7 | mapa, catálogo módulos |
| 8 | soporte-legal, dominios |

---

## 12. Qué no construir “de paso”

- Microservicios por módulo  
- Elasticsearch  
- Event sourcing  
- App móvil nativa  
- Multi-idioma i18n completo (locale `es-PE` basta)  
- Dominio custom en Fase 0–7  

---

*Ubicación:* `data/wavys-os-brief/plan-software-especifico.md`
