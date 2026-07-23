# Wavys OS — Arquitectura técnica

**Fecha:** 2026-07-21  
**Stack decidido (Phil):** Next.js · NestJS · PostgreSQL · todo en contenedores · AI SDK + Vercel AI Gateway  
**Producto:** ver brief en `data/wavys-os-brief/`

---

## 1. Vista general

```text
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│  Next.js    │────►│  NestJS API │────►│  PostgreSQL      │
│  Panel+Chat │     │  (dominio)  │     │  (Prisma/TypeORM)│
│  Sites?*    │     └──────┬──────┘     └──────────────────┘
└─────────────┘            │
                           ├── Redis (recomendado)
                           ├── Object storage (S3/R2/GCS)
                           ├── Vercel AI Gateway (+ AI SDK)
                           ├── Polar (webhooks cobro)
                           └── Queue worker (gen web / imports)
```

\*Sites públicos: **B confirmado** — un **runtime multi-tenant** (Next o app sites) que resuelve `{slug}.wavys.app` → BrandKit + `SiteConfig` + API oferta/contacto. El panel + chat viven en el mismo stack Next (ruta/app distinta).

---

## 2. Contenedores (Docker Compose)

| Servicio | Imagen / rol |
|----------|----------------|
| `web` | Next.js (panel, chat UI, BFF opcional) |
| `api` | NestJS (REST/tRPC, auth, tools del chat, Polar webhooks) |
| `worker` | NestJS o proceso node (colas: generate_website, import Excel, imágenes) |
| `db` | PostgreSQL 16 |
| `redis` | Redis 7 (ver §3) |
| `minio` (local) | S3-compatible para dev (opcional) |

Prod: mismo compose en VM/K8s, o `api`+`worker`+`db`+`redis` en cloud y `web` en Vercel (híbrido).  
**Phil pidió todo en contenedor** → plan A: **web + api + worker + db + redis (+ storage)** en Docker; Gateway/Polar siguen siendo SaaS externos.

---

## 3. ¿Hace falta Redis?

| Uso | ¿MVP sin Redis? | ¿Con Redis? |
|-----|-----------------|-------------|
| Sesiones / rate limit chat | Cookie JWT + PG | Mejor |
| Cola jobs (BullMQ): gen web, Excel, video | PG queue / sync (frágil) | **Sí, recomendado** |
| Cache API pública oferta/contacto | Cache corto en memoria | Mejor multi-instancia |
| Pub/sub “web lista” al chat | Polling | Nice |

**Recomendación:** **sí incluir Redis** desde el día 1 en compose.  
No es “otro producto de negocio”; es infra barata que evita colgar el Nest cuando Grok genera una web 60–120s.

Sin Redis en un prototipo local: se puede, pero no para prod.

---

## 4. Imágenes / archivos — S3 vs GCP

| Opción | Pros | Contras |
|--------|------|---------|
| **S3 / R2 (Cloudflare)** | Estándar, barato (R2 sin egress), SDK universal | Otra cuenta cloud |
| **GCS (GCP)** | Si ya viven en Google | Egress / IAM |
| **Vercel Blob** | Simple con Vercel | Menos “todo en contenedor” |
| **MinIO** | Local/dev idéntico a S3 | No prod sin HA |

**Recomendación:**

- **Prod:** **S3-compatible** — preferencia **Cloudflare R2** (costo) o **AWS S3**.  
- **Dev:** MinIO en Docker.  
- **API:** Nest sube con `@aws-sdk/client-s3`; URLs firmadas o públicas por tenant prefix `tenants/{tenantId}/...`.  
- Gemini `generate_image` → Nest guarda el JPEG en ese bucket → `logoUrl` / `imagesJson` en PG.

GCP Storage está bien si Phil ya tiene proyecto GCP; no es obligatorio. **No guardes blobs grandes en Postgres.**

---

## 5. IA (interno)

| Pieza | Uso |
|-------|-----|
| **Vercel AI SDK** (`ai`) | streamText, tools, en Nest (y/o Next para UI stream) |
| **Vercel AI Gateway** | Un solo secret `AI_GATEWAY_API_KEY`; modelos `xai/grok-4.5`, `google/gemini-3.1-flash-lite`, `google/gemini-3.1-flash-lite-image`, etc. |
| **Routing** | Website 1ª vez → Grok 4.5; chat/tools → Flash Lite; imágenes → `google/gemini-3.1-flash-lite-image` **vía Gateway** (no `GEMINI_API_KEY` en wavys-os) |
| **Tools del chat** | Definidas en Nest; el modelo las llama con permisos pack∩plan∩créditos |

Secrets: `AI_GATEWAY_API_KEY`, `POLAR_*`, `DATABASE_URL`, `REDIS_URL`, `S3_*`.  
Nota: `GEMINI_API_KEY` es solo del agente Cursor en `wavys-agents` (`generate_image`); **no** forma parte del SaaS wavys-os.

---

## 6. NestJS — módulos sugeridos

```text
AuthModule
TenantsModule
BrandKitModule / ContactModule
OfferModule (+ Import)
WebsiteModule (generate/edit + moldes)
BillingModule (Polar webhooks + entitlements)
CreditsModule
ChatModule (orquestación tools + stream)
StorageModule
PublicApiModule  // GET offer/contact, POST leads (sin auth tenant slug)
SchedulingModule / OrdersModule / StockModule  // Operate packs
```

DB access: **Prisma** (alineado a `schema-db.md`) o MikroORM (preferencia Nest del user — Prisma es más rápido para MVP schema ya escrito).

---

## 7. Next.js — qué lleva (stack UI rápido)

**Objetivo panel:** chat-first + sidebar de módulos + tablas CRUD simples. No un design system de 6 meses.

| Capa | Elección MVP | Por qué |
|------|--------------|---------|
| Framework | Next.js App Router | Panel + streaming chat |
| CSS | **Tailwind CSS** | Velocidad; utility-first |
| Componentes | **shadcn/ui** (Radix) | Sidebar, Dialog, Button, Form, Table listos |
| Tablas | **TanStack Table** + shadcn DataTable | Directo (no tabla HTML “después”) |
| Estado servidor (API Nest) | **TanStack Query** | Cache, refetch, loading de oferta/leads |
| Estado UI local | **Zustand** (ligero) | Sidebar abierto, módulo activo, draft del chat |
| Chat IA | **AI SDK** `useChat` / stream | Encaja con Gateway |
| Forms | **react-hook-form + zod** | Imports, BrandKit, contacto |
| Icons | **Phosphor** (`@phosphor-icons/react`) — decidido Phil | No Lucide; wrapper `components/icons.tsx` |

### Iconos — **Phosphor** (oficial)

**Decisión Phil:** `@phosphor-icons/react` en todo el panel.

- Peso default: `regular` (sidebar puede usar `duotone` suave si queda bien).  
- Import tree-shakeable por ícono.  
- Wrapper `components/icons.tsx` para no acoplar pantallas al vendor.  
- **No** Lucide / Heroicons.  
- SVG propios: solo si más adelante quieren branding extra en 4–5 módulos.

### Qué va en Zustand (sí)

- UI: sidebar collapsed, módulo seleccionado, modal upsell Marketing  
- Chat: mensajes en vuelo solo si hace falta (a menudo `useChat` basta)

### Qué NO va en Zustand

- Lista de productos, stock, leads → **TanStack Query** ↔ Nest  
- Sesión/user → cookie/JWT + server components o session provider  

### Estructura app (idea)

```text
app/
  (auth)/login
  (app)/
    layout.tsx      → sidebar shadcn
    chat/           → panel de mando
    offer/          → tabla productos
    stock/
    settings/brand/
    settings/billing/
```

### CSS

- **No** CSS Modules sueltos por defecto ni styled-components (más lento de iterar).  
- Tokens de marca del tenant (colores BrandKit) como CSS variables; panel preview y **site runtime B** leen la misma BrandKit / `SiteConfig`.

### Resumen

**Next + Tailwind + shadcn + TanStack Table/Query + Zustand + Phosphor + AI SDK chat.**

---

## 8. API pública (la del brief)

Base: `/public/v1/{tenantSlug}/`

| Método | Path | Auth |
|--------|------|------|
| GET | `/offer` | pública |
| GET | `/contact` | pública |
| POST | `/leads` | pública + rate limit (Redis) |

Sites generados consumen esto (binding).

---

## 9. Jobs asíncronos (worker)

| Job | Por qué async |
|-----|----------------|
| `website.generate` | 1–3 min, modelo potente |
| `offer.import_excel` | 500+ filas |
| `image.generate` | Gemini batch |
| `marketing.video` | después |

Cola: **BullMQ + Redis**. Chat hace poll o websocket “listo → preview URL”.

---

## 10. Estado planificación vs build

### Planificación producto — **cerrada** (suficiente para codear)
Mapa/rubros, dominio, módulos, planes/créditos, precios S/, Polar, auth roles, dominios subdominio, schema conceptual, MVP 3 packs + onboarding/guiones, moldes web, stack Docker/Next/Nest/PG/Redis/AI Gateway, **sites = B**.

### Sites — **B confirmado (Phil 2026-07-21)**

Un runtime multi-tenant: host → tenant → BrandKit + `SiteConfig` + API oferta/contacto.  
IA genera config/copy/imágenes, no un repo por cliente. A (proyecto por tenant) solo Scale / a medida después.

### Implementación — plan + validador

| Doc | Rol |
|-----|-----|
| [plan-software-especifico.md](./plan-software-especifico.md) | Fases 0–8, DoD, estructura monorepo, ownership Nest/Next |
| [validador-fases.md](./validador-fases.md) | Gate PASS/FAIL por fase (estándar alto; FAIL → re-revisar) |
| Skill | `agent/skills/wavys_os_phase_validator/SKILL.md` |

### Lo que falta ya es **código** (no más brief grande)

| # | Qué | Notas |
|---|-----|--------|
| 1 | **Scaffold monorepo** `apps/web` · `apps/api` · `apps/worker` · `packages/*` | Alta |
| 2 | **Prisma** real + migrate desde `schema-db.md` (+ `SiteConfig`) | Alta |
| 3 | **Docker Compose** + `.env.example` | Alta |
| 4 | **Storage prod** R2 (preferido) o GCS — cuenta + bucket | Alta (cuenta, no doc) |
| 5 | **Auth** implementar Better Auth + guards (`auth-roles.md` cerrado) | Alta |
| 6 | **Polar** products + webhooks | Alta |
| 7 | **Wildcard DNS** `*.wavys.app` | Alta (infra) |
| 8 | **Site runtime B** — 5 moldes + middleware slug | Alta (core producto) |
| 9 | **OpenAPI** pública offer/contact | Media |
| 10 | **CI/CD** + Sentry/logs | Media |
| 11 | **Legal** abogado antes de cobrar en prod | Bloqueo cobro real |
| 12 | Guiones día 2 más largos / Culqi | Opcional / fase 2 |

Detalle mínimo opcional (no bloquea scaffold): contrato JSON exacto de `SiteConfig` por molde.

---

## 11. Resumen recomendaciones infra

| Servicio | ¿Usar? |
|----------|--------|
| PostgreSQL | **Sí** (fuente de verdad) |
| Redis | **Sí** (colas + rate limit) |
| Object storage S3/R2 (o GCS) | **Sí** (logos, fotos, Gemini out) |
| MinIO | **Sí en local** |
| Vercel AI Gateway + AI SDK | **Sí** |
| Polar | **Sí** (cobro) |
| Elasticsearch / etc. | **No** MVP |

---

*Ubicación:* `data/wavys-os-brief/arquitectura-tecnica.md`
