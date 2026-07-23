# Wavys OS — Auth y roles (revisado anti-rompimientos)

**Estado:** arquitectura lista para implementar.  
**Schema:** `schema-db.md` (`User`, `Auth*`, `Membership`, `TenantInvite`).  
**Fecha review:** 2026-07-21.

---

## 0. Hallazgos corregidos

| Riesgo | Fix |
|--------|-----|
| Magic link sin persistencia | `AuthVerification` + `AuthSession` |
| Invite “en el aire” | `TenantInvite` (token hasheado, expiry) |
| Staff se auto-promueve a owner | Invite roles ≠ owner; transfer ownership solo owner explícito |
| Varios owners | Índice único parcial + regla app |
| JWT en localStorage | Cookie **httpOnly** + Secure + SameSite |
| Chat sin rol | Tools chequean `Membership.role` + plan |
| Public API con sesión panel | Pública = slug; panel = session |
| Multi-tenant futuro | `lastTenantId` + header/cookie `X-Tenant-Id` |

---

## 1. Método de entrada

| Método | MVP | Nota |
|--------|-----|------|
| Email + **magic link** | **Sí** | Link de un solo uso, TTL 15–30 min |
| Email + OTP 6 dígitos | Alternativa misma infra | Mismo `AuthVerification` |
| Google OAuth | Fase cercana | `AuthAccount.providerId=google` |
| Password | **No** MVP | Evita resets y leaks |
| WhatsApp OTP | Después | ICP PYME |

**Stack recomendado (decisión de implementación):**  
**Better Auth** (o Auth.js) en Nest/Next con adapter Prisma sobre las tablas `User` / `AuthAccount` / `AuthSession` / `AuthVerification`.  
No reinventar crypto de tokens.

Sesión panel: cookie httpOnly → `AuthSession.token`.  
API Nest valida sesión (BFF Next o cookie compartida en mismo sitio).

---

## 2. Roles

| Rol | `role` | MVP | Puede |
|-----|--------|-----|--------|
| **Dueño** | `owner` | sí | Todo: plan, créditos, BrandKit, publish, invites, Marketing, borrar datos |
| **Admin** | `admin` | no (después) | Operar módulos / oferta / web chica; no cancelar sub ni transferir ownership |
| **Empleado** | `staff` | sí | Oferta, stock, citas, pedidos, leads (según módulos); no créditos caros ni plan |
| **Solo lectura** | `readonly` | no (después) | Ver; no editar |

**MVP real:** solo `owner` + `staff`.

### Invariantes de rol

1. Exactamente **un** owner `active` por tenant.  
2. Signup crea User + Tenant + Membership(`owner`) en **una transacción**.  
3. Invite **no** puede pedir rol `owner`.  
4. Transferir ownership: owner A → B (B ya membership) en transacción; A baja a `admin` o `staff`.  
5. `disabled` membership = sin acceso; no borrar histórico.

---

## 3. Permisos por acción (MVP)

| Acción | owner | staff |
|--------|-------|-------|
| Onboarding / BrandKit / Contacto | sí | no |
| `generate_website` / regen full | sí | no |
| `edit_website` chico (copy/color vía BrandKit+siteConfig) | sí | opcional (flag después) |
| Import Excel / oferta CRUD | sí | sí |
| Stock / citas / pedidos | sí | sí |
| Ver / gestionar leads | sí | sí |
| Publicar site (`published`) | sí | no |
| Comprar créditos / cambiar plan / Marketing | sí | no |
| Invitar / revocar usuarios | sí | no |
| Ver saldo créditos | sí | sí (solo lectura) |
| Gastar créditos (tools caras) | sí | **no** |

Chat staff pide regen web:

> Solo el dueño puede usar puntos para crear o regenerar la web. Pídele a {ownerName}.

Implementación: `canExecute(tool, { role, plan, credits, moduleFlags })` en Nest — una sola puerta.

---

## 4. Modelo de identidad (DB)

```text
User 1──* AuthAccount
User 1──* AuthSession
User 1──* Membership *──1 Tenant
Tenant 1──* TenantInvite
AuthVerification (por email, sin FK user hasta canje)
```

Detalle tablas: [schema-db.md](./schema-db.md).

`Membership` campos clave: `role`, `status` (`invited`|`active`|`disabled`), `invitedById`, `joinedAt`.

---

## 5. Flujos

### 5.1 Signup (dueño)

```text
1. Email → magic link
2. Verify → User (emailVerifiedAt)
3. Chat/panel: nombre negocio → Tenant(slug, pack?, status=onboarding)
4. Membership(owner, active)
5. CreditBalance(0) + TenantSubscription(trial|chosen) según producto
6. BrandKit draft + ContactProfile parcial
```

**Rompimiento evitado:** no crear Tenant sin Membership owner.  
**Rompimiento evitado:** slug unique conflict → pedir otro en chat.

### 5.2 Login

Magic link → sesión. Si varios tenants (después): picker; MVP asume 1 y set `lastTenantId`.

### 5.3 Invitar empleado

```text
1. Owner: email + role=staff
2. TenantInvite(pending, tokenHash, expiresAt ≤ 7d)
3. Email link /api/auth/accept-invite?token=
4. Si no User → magic link primero (mismo email)
5. Transacción: Invite=accepted + Membership(staff, active)
6. Si ya membership active → error “ya es miembro”
```

**Seguridad:** guardar solo **hash** del token; un uso; revocable.

### 5.4 Revocar

Owner → Membership `disabled` + invalidar sesiones de ese user **solo** si política lo pide (MVP: basta membership disabled en cada request).

---

## 6. Resolución de tenant en cada request

| Superficie | Cómo |
|------------|------|
| Panel / chat API | Sesión → `lastTenantId` o header `X-Tenant-Id` ∈ memberships active |
| Site público B | Host `slug.wavys.app` → `Tenant.slug` (sin sesión) |
| API pública offer/contact/leads | Path `/api/public/:slug/...` |

**Nunca** confiar en `tenantId` del body del cliente sin cruzar membership.

Staff/owner suspendido (`Tenant.status=suspended`): panel read-only o bloqueo con mensaje Polar `past_due`.

---

## 7. Límites de usuarios (plan)

Según precios: Presence ~2 usuarios (owner+1). Enforce en `createInvite`:

`count(memberships active|invited) < plan.maxUsers`.

---

## 8. Seguridad mínima

- Rate limit magic link / invite por email+IP (Redis).  
- Tokens invite/verification: random 32+ bytes, store SHA-256.  
- CORS panel estricto; API pública lead con rate limit + honeypot.  
- Logs de auth sin tokens en claro.  
- CSRF: SameSite=Lax/Strict en cookie sesión.

---

## 9. Qué no es auth

| Concepto | Dónde |
|----------|--------|
| Pack / plan / módulos | `Tenant` + `TenantSubscription` + flags |
| Staff operativo de salón (peluquero en agenda) | Módulo `team` / Resource (migración 2) ≠ Membership |
| Cliente final de la tienda | `Customer` / Lead — no hace login al panel |

No mezclar “empleado del salón en la agenda” con “usuario del panel” hasta Team module; v1 puede ser el mismo email a mano.

---

## 10. Checklist implementación

- [ ] Better Auth (o Auth.js) + tablas Prisma auth  
- [ ] Signup atómico User+Tenant+Membership owner  
- [ ] Índice un owner por tenant  
- [ ] Invites + accept flow  
- [ ] `canExecute` central (rol × plan × créditos)  
- [ ] Cookie sesión + guard Nest  
- [ ] Tests: cross-tenant 403, staff no gasta créditos, invite expiry  

---

*Ubicación:* `data/wavys-os-brief/auth-roles.md`
