# Wavys OS — Validador de fases (código + plan)

**Propósito:** gate de calidad **obligatorio** al **iniciar** y al **cerrar** cada fase del [plan de software](./plan-software-especifico.md).  
**Estándar:** alto. Ante duda → **FAIL**. No se avanza de fase con FAIL.  
**Ejecutor:** agente Cursor / humano revisor.  
**Log por fase:** `data/pipeline-runs/wavys-os-phase-<N>-validation.md`

---

## 0. Reglas del validador (no negociables)

1. **Leer primero** este doc + el plan de la fase + briefs citados.  
2. **Inspeccionar código real** (diff, archivos, tests) — no aceptar “ya está” sin evidencia.  
3. Veredicto único: `PASS` | `FAIL` | `BLOCKED`.  
4. **`FAIL`:** listar hallazgos con archivo/línea o path · **pedir revisión de nuevo** · **prohibido** empezar la siguiente fase.  
5. **`BLOCKED`:** falta dependencia externa (cuenta Polar, DNS, legal) — no es atajo de calidad.  
6. **`PASS`:** todos los checks críticos ✅ y ningún crítico abierto. Warnings menores documentados.  
7. Si el código **diverge del plan** sin decisión Phil escrita → **FAIL** (actualizar plan o revertir código).  
8. Tipado, arquitectura Nest/Next, DB y tenant isolation son **críticos** (un fallo = FAIL).  
9. Re-validar tras cada fix hasta PASS.  
10. No “aprobar parcial” una fase crítica (1–6).

### Frase obligatoria si FAIL

> **VALIDACIÓN FALLIDA — Fase N.** No continuar. Corregir los hallazgos listados y volver a ejecutar este validador.

---

## 1. Cómo ejecutar (protocolo)

```text
A. Inicio de fase N
   → Checklist "Entrada" §3 + estándares globales §2
   → Si FAIL: no codear la fase; arreglar deuda previa

B. Durante la fase
   → Mantener alineación al plan-software-especifico.md § fase N

C. Cierre de fase N
   → Checklist "Salida" de la fase + globales §2 + DoD del plan
   → Escribir log en data/pipeline-runs/wavys-os-phase-N-validation.md
   → Solo con PASS → Fase N+1
```

### Subagentes recomendados (Cursor)

| Momento | Subagente | Uso |
|---------|-----------|-----|
| Cierre | `shell` | typecheck, test, lint, migrate status |
| Cierre | `bugbot` (si Phil pide) | review diff readonly |
| Duda arquitectura | `explore` | ubicar capas / fugas tenant |

---

## 2. Estándares globales (todas las fases)

Marcar cada ítem: ✅ / ❌ / N/A.

### 2.1 Plan y arquitectura

| # | Check | Crítico |
|---|-------|---------|
| G1 | La entrega de la fase coincide con `plan-software-especifico.md` | sí |
| G2 | Sites siguen runtime **B** (no proyecto Astro/Next por tenant) | sí |
| G3 | Stack fijo respetado (Nest · Next · Prisma · Redis · BullMQ · Phosphor · Polar) | sí |
| G4 | Funciones de negocio en Nest services / worker — no en componentes React | sí |
| G5 | Pack/plan/créditos/moldes en `packages/shared` o DB según brief — sin magic strings duplicados | sí |
| G6 | Desviaciones documentadas y aprobadas por Phil | sí |

### 2.2 TypeScript y tipado

| # | Check | Crítico |
|---|-------|---------|
| T1 | `strict: true` en tsconfig de apps/packages | sí |
| T2 | Sin `any` en controllers, services, tools chat, DTOs públicos | sí |
| T3 | Boundaries HTTP/chat validan con **zod** (shared) | sí |
| T4 | Tipos Prisma no se escapan crudos al frontend sin DTO | sí |
| T5 | Return types explícitos en funciones públicas de services | sí |
| T6 | Enums/unions de dominio (`PackId`, `PlanId`, roles) tipados — no `string` libre en APIs nuevas | sí |

### 2.3 NestJS / capas

| # | Check | Crítico |
|---|-------|---------|
| N1 | Módulo correcto según mapa del plan (§4) | sí |
| N2 | Controllers delgados; lógica en services | sí |
| N3 | Prisma solo vía repositorio/service inyectado — no query suelta en tool handler | sí |
| N4 | Filtros de excepción globales; errores tipados al cliente | recomendado |
| N5 | Un export claro por archivo de dominio donde aplique convención del repo | recomendado |
| N6 | Chat tools llaman services existentes — no reimplementan reglas | sí |

### 2.4 Database

| # | Check | Crítico |
|---|-------|---------|
| D1 | Schema alineado a `schema-db.md` (o migration que lo actualice + doc sync) | sí |
| D2 | Índices / unique parciales (owner, invite pending, stock XOR) presentes cuando toca | sí |
| D3 | `tenantId` en tablas de negocio + queries filtradas | sí |
| D4 | Transacciones en signup, credit spend, invite accept | sí |
| D5 | Ledger créditos con `idempotencyKey` / `balanceAfter` | sí (desde F3) |
| D6 | Migraciones versionadas; no editar migration ya aplicada en prod | sí |
| D7 | No blobs grandes en PG (usar R2/MinIO) | sí |

### 2.5 Auth, seguridad, multi-tenant

| # | Check | Crítico |
|---|-------|---------|
| S1 | Cookie sesión httpOnly; no token en localStorage | sí |
| S2 | Guard: todo endpoint panel exige membership active | sí |
| S3 | Test o prueba manual: user A no lee datos tenant B | sí |
| S4 | Public API solo por slug; no confía body.tenantId | sí |
| S5 | Roles: staff no gasta créditos caros / no cambia plan | sí (desde F2/F6) |
| S6 | Polar webhook verifica firma + BillingEvent idempotente | sí (desde F3) |
| S7 | Secrets solo env; `.env` no commiteado | sí |

### 2.6 Frontend (cuando la fase toca web)

| # | Check | Crítico |
|---|-------|---------|
| F1 | Iconos **Phosphor** only | sí |
| F2 | Server state = TanStack Query; UI local = Zustand (no mezclar listas en Zustand) | sí |
| F3 | Forms con RHF + zod donde hay formularios | recomendado |
| F4 | shadcn/Tailwind; sin CSS Modules sueltos innecesarios | recomendado |
| F5 | Site B: middleware host → BrandKit + siteConfig + API oferta | sí (desde F5) |

### 2.7 Calidad operativa

| # | Check | Crítico |
|---|-------|---------|
| O1 | `pnpm/npm` typecheck PASS | sí |
| O2 | Lint PASS (o warnings justificados) | sí |
| O3 | Tests de la fase PASS | sí |
| O4 | Compose / servicios requeridos documentados y arrancables | sí |
| O5 | README o notas de fase actualizadas si cambió el how-to | recomendado |

**Umbral:** cualquier ❌ en check **crítico** → veredicto **FAIL**.

---

## 3. Checklists por fase

### Fase 0 — Scaffold

**Entrada:** plan § Fase 0 leído · carpeta monorepo decidida.

| Check salida | Crítico |
|--------------|---------|
| Estructura `apps/web|api|worker` + `packages/db|shared` | sí |
| Docker Compose con db+redis(+minio) | sí |
| Health API | sí |
| `.env.example` completo | sí |
| TS strict en packages | sí |
| No código de negocio prematuro caótico | recomendado |

---

### Fase 1 — DB & shared

**Entrada:** Fase 0 PASS · `schema-db.md` vigente.

| Check salida | Crítico |
|--------------|---------|
| Prisma refleja identity/auth/tenant/brand/contact/billing/credits/website B/offer/CRM | sí |
| `siteConfigJson` (no deploymentRef por tenant) | sí |
| CreditBalance sin periodKey incorrecto; ledger completo | sí |
| SQL índices one-owner / invite / stock XOR | sí |
| `packages/shared`: PackId, PlanId, ModuleId, credit costs | sí |
| Migrate apply limpio en Compose | sí |

---

### Fase 2 — Auth & tenancy

**Entrada:** Fase 1 PASS · `auth-roles.md`.

| Check salida | Crítico |
|--------------|---------|
| Magic link end-to-end local | sí |
| Signup atómico User+Tenant+Membership owner | sí |
| Índice / regla un solo owner | sí |
| TenantGuard + cross-tenant test FAIL acceso | sí |
| Invite create/accept/revoke | sí |
| Invite no puede rol owner | sí |
| Cookie httpOnly | sí |

---

### Fase 3 — Polar & créditos

**Entrada:** Fase 2 PASS · sandbox Polar.

| Check salida | Crítico |
|--------------|---------|
| Webhook firma + BillingEvent unique eventId | sí |
| Subscription status sync | sí |
| spend con FOR UPDATE + ledger | sí |
| Doble webhook no duplica créditos | sí |
| marketingAddon field usado si aplica | sí |
| UsageCounter hard limits | sí |
| Staff no compra plan (API) | sí |

---

### Fase 4 — Brand, Contact, Offer, Public API

**Entrada:** Fase 3 PASS (o créditos stub solo si Phil autoriza — documentar).

| Check salida | Crítico |
|--------------|---------|
| BrandKit `min_ready` gate en service | sí |
| Contact whatsapp validado | sí |
| Offer slug unique por tenant | sí |
| Public GET offer/contact filtra isPublic&&isActive | sí |
| POST leads + rate limit | sí |
| Import Excel encola worker (no bloquea HTTP) | sí |
| Cambiar precio visible en public sin regen | sí |

---

### Fase 5 — Site runtime B + generate

**Entrada:** Fase 4 PASS · `AI_GATEWAY_API_KEY` (Gemini incluido en Gateway).

| Check salida | Crítico |
|--------------|---------|
| Middleware host → tenant | sí |
| ≥1 molde renderiza hero+offer+contact | sí |
| Generate job async (worker) | sí |
| Bloqueo generate si BrandKit draft | sí |
| Status machine + lastError | sí |
| Imágenes a R2/MinIO no PG | sí |
| Cero repos generados por tenant | sí |
| Preview URL / slug.wavys.app local (hosts) | sí |

---

### Fase 6 — Chat + onboarding

**Entrada:** Fase 5 PASS · guiones.

| Check salida | Crítico |
|--------------|---------|
| `canExecute` único para tools | sí |
| Happy path Tienda Presence E2E | sí |
| Staff blocked en generate_website | sí |
| Model routing: Flash Lite chat / Grok generate | sí |
| Upsell Operate/Marketing sin activar gratis | sí |
| Onboarding explica (guía) no solo ejecuta | recomendado |
| Phosphor sidebar | sí |

---

### Fase 7 — Operate packs

**Entrada:** Fase 6 PASS · migración 2.

| Check salida | Crítico |
|--------------|---------|
| Tienda: stock adjust con tenantId | sí |
| Salón: appointment no cruza tenants | sí |
| Resto: soldOut refleja en public offer | sí |
| Presence no activa Operate modules | sí |
| Cita ≠ Agreement (sin mezclar modelos) | sí |

---

### Fase 8 — Hardening

**Entrada:** Fase 7 PASS · infra prod/staging.

| Check salida | Crítico |
|--------------|---------|
| Wildcard DNS documentado/configurado | sí |
| Sentry o equivalente | sí |
| CI typecheck+test | sí |
| Rate limits auth/public/images | sí |
| Legal links (o BLOCKED hasta abogado) | sí* |
| Runbook fallos Polar/Redis/generate | recomendado |

\*Cobro prod real sin legal → **BLOCKED**, no PASS de launch.

---

## 4. Plantilla de log (copiar por fase)

Crear: `data/pipeline-runs/wavys-os-phase-<N>-validation.md`

```markdown
# Wavys OS — Validación Fase <N>

- Fecha:
- Revisor (agente/humano):
- Git SHA / branch:
- Momento: inicio | cierre

## Veredicto

**PASS | FAIL | BLOCKED**

## Estándares globales (§2)

| ID | Resultado | Nota |
|----|-----------|------|
| G1 | ✅/❌ | |
| T1 | | |
| … | | |

## Checklist fase

| Check | Resultado | Evidencia (path/test) |
|-------|-----------|------------------------|
| | | |

## Hallazgos (obligatorio si FAIL)

1. [CRÍTICO] …
2. …

## Acciones requeridas

- [ ] …

## Re-validación

- Intento #:
- Tras fixes → veredicto:
```

---

## 5. Matriz de severidad

| Severidad | Ejemplos | Efecto |
|-----------|----------|--------|
| **CRÍTICO** | fuga tenant, any en API, sites tipo A, spend sin ledger, webhook sin idempotencia | FAIL |
| **MAYOR** | lógica en React, DTO sin zod, índice DB faltante | FAIL |
| **MENOR** | naming inconsistente, README corto | Warning; PASS solo si 0 críticos/mayores |
| **BLOQUEO EXT** | sin cuenta Polar / sin abogado | BLOCKED |

---

## 6. Anti-patrones = FAIL automático

- `as any` / `@ts-ignore` en código nuevo de dominio  
- `tenantId` tomado del client sin membership check  
- Generate website síncrono en request HTTP  
- Lucide/Heroicons en panel  
- Créditos decrementados sin fila ledger  
- Schema Prisma distinto del brief sin actualizar `schema-db.md`  
- “Dejamos el test de aislamiento para después” en fases 2+  
- Aprobar fase con typecheck roto  

---

## 7. Relación con otros validadores Wavys

Este validador es del **producto OS** (build).  
Pipelines de marketing/web en `wavys-agents` (`validate_pipeline`, Gate 0/1+) **no sustituyen** este doc.  
Cuando el OS tenga tool CI propia, puede envolver typecheck/test; el juicio de arquitectura sigue siendo esta checklist.

---

## 8. Skill / uso en Cursor

Al empezar o cerrar una fase, el agente debe:

1. Leer `plan-software-especifico.md` § fase.  
2. Leer este validador.  
3. Ejecutar checks con evidencia.  
4. Escribir el log.  
5. Si FAIL → detener y pedir corrección.  
6. Si PASS → continuar.

Skill Cursor: `agent/skills/wavys_os_phase_validator/SKILL.md`.

---

*Ubicación:* `data/wavys-os-brief/validador-fases.md`
