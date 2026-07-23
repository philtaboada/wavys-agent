# Wavys OS — Schema DB (Prisma-ready, review 2026-07-21)

**Estado:** listo para scaffold (revisado anti-rompimientos).  
**Alineado a:** dominio · auth · créditos · Polar · sites **B** (runtime).  
**ORM:** Prisma + PostgreSQL 16.

---

## 0. Hallazgos corregidos (por qué este schema)

| Riesgo | Antes | Ahora |
|--------|-------|--------|
| Magic link sin tablas | Solo `User` | `AuthAccount` + `AuthSession` + `AuthVerification` |
| Invite sin modelo | “crea invite” en texto | `TenantInvite` + Membership `invited`/`active` |
| Varios owners | Sin regla | Invariante app + índice parcial recomendado |
| Sites B | `deploymentRef` estilo A | `siteConfigJson` + binding; sin deploy por tenant |
| Créditos mensuales vs saldo | `periodKey` en balance mezclaba grant y top-up | Balance = saldo; grant/reset vía ledger + `UsageCounter` |
| Polar webhook duplicado | Nada | `BillingEvent` idempotente |
| Marketing add-on | Solo plan base | `marketingAddon` en subscription |
| Stock / variantes sin tenant | Queries frágiles | `tenantId` en StockLevel y OfferVariant |
| BrandKit incompleto vs dominio | Pocos campos | Campos `min_ready` + opcionales |
| URLs públicas | Sin slug item | `OfferItem.slug` único por tenant |
| Auditoría | Sin `updatedAt` | `createdAt`/`updatedAt` donde importa |
| Aislamiento | Solo nota | Índices `tenantId` + reglas §11 |

---

## 1. Prisma (núcleo MVP)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════
// Identity & auth
// ═══════════════════════════════════════════

model User {
  id               String    @id @default(cuid())
  email            String    @unique
  emailVerifiedAt  DateTime?
  name             String?
  imageUrl         String?
  /// Último tenant del panel (MVP: casi siempre 1)
  lastTenantId     String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  memberships      Membership[]
  accounts         AuthAccount[]
  sessions         AuthSession[]
  invitesSent      TenantInvite[] @relation("InviteSender")
  creditLedgers    CreditLedger[] @relation("LedgerActor")
}

/// Proveedor OAuth / credentials (compatible Better Auth / Auth.js)
model AuthAccount {
  id                String  @id @default(cuid())
  userId            String
  providerId        String  // credential | google | ...
  accountId         String  // subject del provider
  accessToken       String? @db.Text
  refreshToken      String? @db.Text
  accessTokenExpiresAt DateTime?
  idToken           String? @db.Text
  passwordHash      String? // solo si password; MVP magic-link → null
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([providerId, accountId])
  @@index([userId])
}

model AuthSession {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}

/// Magic link / OTP / email verify
model AuthVerification {
  id         String   @id @default(cuid())
  identifier String   // email
  value      String   // token o código hasheado
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  @@index([identifier])
}

model Tenant {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  packId       String   // shop | salon | restaurant | ...
  offerProfile String   // catalog | menu | service | room (dominante)
  status       String   // onboarding | active | suspended | deleted
  timezone     String   @default("America/Lima")
  locale       String   @default("es-PE")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  memberships   Membership[]
  invites       TenantInvite[]
  brandKit      BrandKit?
  contact       ContactProfile?
  subscription  TenantSubscription?
  website       Website?
  modules       TenantModuleFlag[]
  categories    OfferCategory[]
  items         OfferItem[]
  variants      OfferVariant[]
  stockLevels   StockLevel[]
  creditBalance CreditBalance?
  creditLedger  CreditLedger[]
  usageCounters UsageCounter[]
  billingEvents BillingEvent[]
  leads         Lead[]
  customers     Customer[]
  mediaAssets   MediaAsset[]
}

model Membership {
  id          String    @id @default(cuid())
  userId      String
  tenantId    String
  role        String    // owner | admin | staff | readonly
  status      String    @default("active") // invited | active | disabled
  invitedById String?
  invitedAt   DateTime?
  joinedAt    DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@unique([userId, tenantId])
  @@index([tenantId, role, status])
}

/// Invite antes de que exista User (o sin membership aún)
model TenantInvite {
  id          String    @id @default(cuid())
  tenantId    String
  email       String
  role        String    // staff | admin | readonly — NUNCA owner por invite
  tokenHash   String    @unique
  status      String    @default("pending") // pending | accepted | revoked | expired
  invitedById String
  expiresAt   DateTime
  acceptedAt  DateTime?
  createdAt   DateTime  @default(now())
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  invitedBy   User      @relation("InviteSender", fields: [invitedById], references: [id])
  @@index([tenantId, email])
  @@index([email, status])
}

// ═══════════════════════════════════════════
// Brand & contact
// ═══════════════════════════════════════════

model BrandKit {
  id              String   @id @default(cuid())
  tenantId        String   @unique
  displayName     String
  tagline         String?
  shortBio        String   @db.Text
  industryNotes   String?  @db.Text
  voiceTone       String
  voiceDo         String?  @db.Text
  voiceDont       String?  @db.Text
  primaryColor    String?
  secondaryColor  String?
  accentColor     String?
  backgroundTone  String?  // light | dark | warm | cool
  colorMode       String   @default("manual") // manual | auto_from_pack
  fontHeading     String?
  fontBody        String?
  logoUrl         String?
  logoDarkUrl     String?
  faviconUrl      String?
  ctaPreference   String?
  imageStyle      String?
  galleryJson     Json?    // [{ url, alt }]
  referenceUrlsJson Json?
  completeness    String   @default("draft") // draft | min_ready | rich
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model ContactProfile {
  id               String   @id @default(cuid())
  tenantId         String   @unique
  businessName     String
  phone            String?
  whatsapp         String   // E.164
  whatsappMessage  String?
  email            String?
  addressLine      String?
  city             String
  region           String?
  country          String   @default("PE")
  mapsUrl          String?
  lat              Float?
  lng              Float?
  hoursJson        Json?
  socialLinksJson  Json?
  formEnabled      Boolean  @default(true)
  formNotifyEmail  String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  tenant           Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

// ═══════════════════════════════════════════
// Billing, credits, modules
// ═══════════════════════════════════════════

model TenantSubscription {
  id                  String    @id @default(cuid())
  tenantId            String    @unique
  planId              String    // presence | operate | scale
  /// none | posts | pro
  marketingAddon      String    @default("none")
  status              String    // trial | active | past_due | canceled
  polarCustomerId     String?
  polarSubscriptionId String?
  polarMarketingSubId String?   // si Marketing es sub aparte
  periodStart         DateTime?
  periodEnd           DateTime?
  trialEndsAt         DateTime?
  cancelAtPeriodEnd   Boolean   @default(false)
  limitsJson          Json?     // snapshot límites del plan
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  tenant              Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@index([polarSubscriptionId])
  @@index([polarCustomerId])
}

model TenantModuleFlag {
  id        String   @id @default(cuid())
  tenantId  String
  moduleId  String
  enabledAt DateTime @default(now())
  enabledBy String   // chat | admin | polar | system
  source    String   @default("plan") // plan | addon | manual
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@unique([tenantId, moduleId])
}

/// Saldo actual (NO periodKey). Grants mensuales y top-ups → ledger.
model CreditBalance {
  id        String   @id @default(cuid())
  tenantId  String   @unique
  balance   Int      @default(0)
  updatedAt DateTime @updatedAt
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model CreditLedger {
  id             String   @id @default(cuid())
  tenantId       String
  delta          Int      // +grant / -spend
  balanceAfter   Int
  reason         String   // monthly_grant | topup | tool_spend | refund | adjust
  toolId         String?
  actorUserId    String?
  /// Evita doble cobro (jobId, polarEventId, etc.)
  idempotencyKey String?  @unique
  metaJson       Json?
  createdAt      DateTime @default(now())
  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  actor          User?    @relation("LedgerActor", fields: [actorUserId], references: [id])
  @@index([tenantId, createdAt])
}

/// Contadores de límites duros (regen web/mes, imágenes/hora, etc.)
model UsageCounter {
  id        String @id @default(cuid())
  tenantId  String
  key       String // website_regen | image_gen | ...
  periodKey String // 2026-07 | 2026-07-21T14 (hora)
  count     Int    @default(0)
  tenant    Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@unique([tenantId, key, periodKey])
}

/// Webhooks Polar (y futuros) — idempotencia
model BillingEvent {
  id          String   @id @default(cuid())
  tenantId    String?
  provider    String   // polar
  eventId     String   @unique // id del evento Polar
  eventType   String
  payloadJson Json
  processedAt DateTime?
  createdAt   DateTime @default(now())
  tenant      Tenant?  @relation(fields: [tenantId], references: [id], onDelete: SetNull)
  @@index([tenantId, eventType])
}

// ═══════════════════════════════════════════
// Website — runtime B
// ═══════════════════════════════════════════

model Website {
  id                   String    @id @default(cuid())
  tenantId             String    @unique
  status               String    // draft | generating | preview | published | failed
  moldId               String?   // 1..5
  masterPromptSnapshot String?   @db.Text
  defaultHost          String    // {slug}.wavys.app
  primaryDomain        String?   // null en MVP
  /// Config del runtime B (secciones, copy, tipografía, flags)
  siteConfigJson       Json?
  /// Tema aplicado en último generate (auditoría; BrandKit manda)
  themeSnapshotJson    Json?
  offerBindingJson     Json?     // { mode: live_api, listPath, ... }
  lastGeneratedAt      DateTime?
  publishedAt          DateTime?
  lastError            String?   @db.Text
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  tenant               Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@index([defaultHost])
}

model MediaAsset {
  id        String   @id @default(cuid())
  tenantId  String
  kind      String   // logo | hero | gallery | offer | generated
  url       String
  storageKey String
  mimeType  String?
  width     Int?
  height    Int?
  metaJson  Json?
  createdAt DateTime @default(now())
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@index([tenantId, kind])
}

// ═══════════════════════════════════════════
// Offer
// ═══════════════════════════════════════════

model OfferCategory {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  slug      String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  items     OfferItem[]
  @@unique([tenantId, slug])
  @@index([tenantId])
}

model OfferItem {
  id          String   @id @default(cuid())
  tenantId    String
  categoryId  String?
  profile     String   // catalog | menu | service | room
  name        String
  slug        String
  description String?  @db.Text
  basePrice   Decimal  @db.Decimal(12, 2)
  currency    String   @default("PEN")
  imagesJson  Json?
  isActive    Boolean  @default(true)
  isPublic    Boolean  @default(true)
  sortOrder   Int      @default(0)
  profileJson Json?    // CatalogProfile | MenuProfile | ServiceProfile | RoomProfile
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  category    OfferCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  variants    OfferVariant[]
  stockLevels StockLevel[]
  @@unique([tenantId, slug])
  @@index([tenantId, isPublic, isActive])
  @@index([tenantId, profile])
}

model OfferVariant {
  id            String   @id @default(cuid())
  tenantId      String
  offerItemId   String
  sku           String?
  optionsJson   Json
  priceOverride Decimal? @db.Decimal(12, 2)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  offerItem     OfferItem @relation(fields: [offerItemId], references: [id], onDelete: Cascade)
  stockLevels   StockLevel[]
  @@index([tenantId])
  @@index([offerItemId])
}

model StockLevel {
  id           String  @id @default(cuid())
  tenantId     String
  offerItemId  String?
  variantId    String?
  quantity     Int
  lowThreshold Int?
  updatedAt    DateTime @updatedAt
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  offerItem    OfferItem? @relation(fields: [offerItemId], references: [id], onDelete: Cascade)
  variant      OfferVariant? @relation(fields: [variantId], references: [id], onDelete: Cascade)
  @@index([tenantId])
  @@index([offerItemId])
  @@index([variantId])
}

// ═══════════════════════════════════════════
// CRM light (MVP)
// ═══════════════════════════════════════════

model Lead {
  id        String   @id @default(cuid())
  tenantId  String
  name      String?
  phone     String?
  email     String?
  message   String?  @db.Text
  source    String   // website_contact | chat | other
  status    String   @default("new")
  metaJson  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@index([tenantId, status, createdAt])
}

model Customer {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  phone     String?
  email     String?
  notes     String?  @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@index([tenantId])
  @@index([tenantId, phone])
}
```

---

## 2. SQL extra (fuera de Prisma o migration raw)

```sql
-- Un solo owner activo por tenant
CREATE UNIQUE INDEX membership_one_owner_per_tenant
  ON "Membership" ("tenantId")
  WHERE role = 'owner' AND status = 'active';

-- Un solo invite pending por email+tenant
CREATE UNIQUE INDEX tenant_invite_one_pending
  ON "TenantInvite" ("tenantId", email)
  WHERE status = 'pending';

-- Stock: exactamente item XOR variante (app + check)
ALTER TABLE "StockLevel"
  ADD CONSTRAINT stock_level_target_xor
  CHECK (
    ("offerItemId" IS NOT NULL AND "variantId" IS NULL)
    OR ("offerItemId" IS NULL AND "variantId" IS NOT NULL)
  );
```

---

## 3. `siteConfigJson` (contrato mínimo runtime B)

```json
{
  "moldId": "2",
  "version": 1,
  "sections": [
    { "id": "hero", "enabled": true, "headline": "...", "subhead": "..." },
    { "id": "offer", "enabled": true },
    { "id": "about", "enabled": true, "body": "..." },
    { "id": "contact", "enabled": true }
  ],
  "typography": { "heading": "auto", "body": "auto" },
  "flags": { "showPrices": true, "whatsappFab": true }
}
```

Regenerar web = reescribe `siteConfigJson` + `themeSnapshotJson`; **no** toca OfferItems ni ContactProfile.

---

## 4. Créditos — reglas que evitan bugs

1. **Gastar:** transacción `SELECT … FOR UPDATE` en `CreditBalance` → si `balance < cost` fail → insert ledger `delta=-cost` + `balanceAfter` → update balance.  
2. **Grant mensual / top-up Polar:** ledger `+N` con `idempotencyKey = polar:event:{id}`.  
3. **No** resetear balance a 0 al nuevo mes si hay top-ups no usados (o documentar política: grant suma, no reemplaza). **Política MVP:** grant mensual **suma**; límites duros van en `UsageCounter`.  
4. Tools caras siempre pasan por ledger; CRUD barato puede ser `delta=0` o sin fila.

---

## 5. Segunda migración (Operate, no bloquear MVP web)

Cuando toque Salón/Tienda Operate: `Appointment`, `Resource`, `Order`, `OrderLine`, `StockMovement`, `Payment`.  
Hasta entonces el chat guía y upsell; no inventar tablas a medias.

---

## 6. PackDefinition

Sigue siendo **config en código** (`packages/shared`), no tabla — evita drift de producto en DB.

---

## 7. Invariantes (app + DB)

1. Todo query de negocio filtra `tenantId` del membership activo.  
2. API pública resuelve por `slug` → tenant `active` (no `suspended`/`deleted`).  
3. Exactamente **un** `Membership` `owner`+`active` por tenant.  
4. Invite **nunca** crea rol `owner`.  
5. `generate_website` exige BrandKit `min_ready` + ContactProfile.whatsapp.  
6. Website runtime B lee BrandKit + Contact + Offer en vivo; `siteConfigJson` solo layout/copy.  
7. Polar webhook: insert `BillingEvent` primero; si `eventId` duplicado → no-op.  
8. Cambiar `slug` regenera `Website.defaultHost`; conflicto unique = error claro en chat.  
9. `OfferItem.profile` puede ≠ `Tenant.offerProfile` (ej. salón + shampoo catalog) si pack lo permite.  
10. Borrar tenant = soft `status=deleted` primero; hard delete solo admin Wavys.

---

*Ubicación:* `data/wavys-os-brief/schema-db.md`
