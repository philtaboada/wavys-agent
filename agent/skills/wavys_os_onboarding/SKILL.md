# Skill — Wavys OS Onboarding (Tienda · Salón · Restaurante)

Usar cuando Phil (o el producto) pida **onboarding de un tenant** en Wavys OS: alta de empresa, detectar pack, contacto, generar web, sembrar oferta, activar módulos.

**MVP packs:** solo `shop` (Tienda) · `salon` (Salón) · `restaurant` (Restaurante).  
**Otros packs:** explicar que aún no están en MVP; ofrecer el más cercano.

**Doc fuente (leer siempre):** `data/wavys-os-brief/mvp-onboarding-tienda-salon-resto.md`  
**Guiones (textos exactos):** `data/wavys-os-brief/guiones-chat-onboarding.md`
**Dominio:** `data/wavys-os-brief/modelo-dominio-nucleo.md`  
**Planes / tools / créditos:** `data/wavys-os-brief/planes-entitlements-chat.md` · `costos-creditos-precios.md`  
**Módulos:** `data/wavys-os-brief/catalogo-modulos-submodulos.md`

**Website:** tras ContactProfile + BrandKit mínimo → skill `one_call_landing` (presencia) o `one_call_website` (si el site lleva catálogo/sistema). Modelo potente (default `xai/grok-4.5` vía Gateway) en la **primera** generación. Imágenes: `generate_image` (Gemini lite).

---

## Regla de oro

1. **Todo por chat** (panel de mando). No inventar pantallas ERP en el onboarding.  
2. **Onboarding = guía:** explicar en lenguaje simple antes de pedir datos; el usuario no conoce “módulos” ni “créditos”.  
3. **No generar la web** sin WhatsApp (o contacto mínimo) en `ContactProfile` ni BrandKit `min_ready`.  
4. **Avisar créditos** antes de `generate_website` e imágenes.  
5. **Pack ∩ Plan** antes de activar stock/citas/pedidos.  
6. Marketing = upsell en sidebar; **no** activarlo en onboarding salvo que Phil lo pida.  
7. Al final: **tour del sidebar** + **una misión fácil** para que practique.

---

## Pipeline obligatorio

```
⓪ CONTEXTO → ① REGISTRO/TENANT → ② PACK → ③ PLAN → ④ CONTACTO → ⑤ MARCA
→ ⑥ WEBSITE → ⑦ OFERTA → ⑧ MÓDULOS → ⑨ CIERRE
```

| Fase | Qué hacer | Gate (no avanzar sin esto) |
|------|-----------|----------------------------|
| ⓪ | Leer docs brief OS arriba + este skill | — |
| ① | Tenant + owner; `status=onboarding` | Tenant creado |
| ② | Detectar/confirmar pack MVP | `packId` + `offerProfile` |
| ③ | Presence u Operate + créditos | `TenantSubscription` |
| ④ | ContactProfile (WhatsApp obligatorio) | WhatsApp guardado |
| ⑤ | BrandKit hasta `min_ready` (bio, tono, color/auto, logo opcional) | `completeness >= min_ready` |
| ⑥ | Generar website (skill + binding oferta/contacto) | Preview URL o build local |
| ⑦ | Seed o Excel según rama pack | ≥ mínimo de items (ver § Done) |
| ⑧ | `module_enable` según plan ∩ pack | Flags OK |
| ⑨ | Resumen + sidebar + siguiente acción | Criterio Done del pack |

Log sugerido: `data/pipeline-runs/<slug>-os-onboarding.md` (pasos + pack + plan + créditos usados).

---

## ② Pack — detección

Mapear lenguaje del usuario:

| Señales | Pack | `offerProfile` |
|---------|------|----------------|
| productos, tienda, boutique, ferretería, stock, SKU | `shop` | `catalog` |
| corte, uñas, spa, barbería, citas, estilista | `salon` | `service` |
| menú, carta, platos, café, pastelería, delivery, cocina | `restaurant` | `menu` |

Confirmar siempre con el usuario antes de fijar.

---

## ⑤ BrandKit — obligatorio bien hecho

BrandKit alimenta la **primera website** y las ediciones. Contacto ≠ marca.

**Gate `min_ready`:** `displayName` + `shortBio` + `voiceTone` + color (o auto) + WhatsApp ya en ContactProfile.

Flujo chat:

1. Confirmar nombre de marca.  
2. Pedir bio 1–3 frases (no genérica: rubro + ciudad + diferencial).  
3. Tono de voz (dar 4 opciones + “otro”).  
4. Color o auto_from_pack.  
5. Logo upload o wordmark.  
6. CTA preferido según pack (catálogo / cita / WhatsApp / menú).  
7. Persistir BrandKit; set `completeness`.

**Al llamar generate_website:** pasar BrandKit + ContactProfile + pack + offerProfile como brief estructurado al skill `one_call_landing` / `one_call_website`.  
**Prohibido:** generar web con bio vacía inventando “tu negocio de confianza” genérico.

Si el usuario cambia marca después: `brand_upsert` → luego `edit_website` (no ignorar BrandKit).

---

## ④ Contacto — campos mínimos

Obligatorios: `businessName`, `whatsapp`, `city`.  
Recomendados: `addressLine`, `email`.  
Opcionales: horarios, redes, maps.

Formulario web futuro → leads (`source=website_contact`). En onboarding solo persistir perfil.

---

## ⑥ Website — moldes + un solo prompt

Doc: `data/wavys-os-brief/website-prompt-moldes.md`

1. Ofrecer **5 moldes** (clara / cálida / fuerte / elegante / todo foto) o camino libre.  
2. Si libre: pedir logo, fotos, sensación, “qué no quiere” → componer **un** prompt maestro.  
3. Confirmar créditos (~80).  
4. **Una** llamada `generate_website` (modelo potente) con BrandKit + ContactProfile + pack + molde/brief.  
5. Binding oferta + contacto.  
6. Cambios chicos → `edit_website`; otro estilo total → nuevo molde + generate (con aviso de créditos).

**Prohibido:** interrogatorio eterno de secciones una por una en la 1ª creación.

---

## ⑦ Oferta — ramas

### Tienda (`shop`)

- Excel (nombre, precio, categoría, sku?, stock?) **o** seed 8–12 productos.  
- Si Operate → ofrecer `stock`.

### Salón (`salon`)

- Dictado / Excel: nombre, precio, `durationMinutes`.  
- Seed 6–8 servicios tipicos si no tiene lista.  
- Si Operate → `scheduling` + 1 recurso (dueño).  
- Opcional: productos retail (`catalog`).

### Restaurante (`restaurant`)

- Excel / dictado / foto de carta (vision Flash Lite): categorías + platos.  
- Seed menú si hace falta.  
- Si Operate → pedidos + `isSoldOut`; opcional mesa / catering.

---

## ⑧ Módulos por plan

| Pack | Presence | Operate (añade) |
|------|----------|-----------------|
| Tienda | website, offer, import, leads | stock, orders, customers, money, reports |
| Salón | website, offer, leads | scheduling, customers, money, reports (+ stock/team) |
| Restaurante | website, offer, leads | stock, orders, customers, money, reports (+ mesa/cocina) |

---

## ⑨ Criterio Done

| Pack | Done |
|------|------|
| Tienda | Preview web + ≥5 productos públicos + WhatsApp |
| Salón | Preview web + ≥3 servicios con duración + WhatsApp (+ cita demo si Operate) |
| Restaurante | Preview web + ≥8 platos en categorías + WhatsApp |

Tiempo objetivo: ≤ 30 min.

---

## Tools / acciones (orden típico)

`detect_pack` → `explain_plan` / set subscription → `contact_upsert` → `brand_upsert` → `generate_website` → `offer_import_excel` \| `offer_create` (seed) → `module_enable` → `list_capabilities`.

Imágenes: `npm run tool -- generate_image '...'` (solo Gemini lite).

---

## Qué no hacer

- Onboardear Clínica/Hotel/B2B como pack nativo en MVP.  
- Activar `marketing` sin upsell explícito.  
- Generar web con modelo barato “porque sí” en la **primera** vez (usar potente).  
- Gastar créditos de regen sin avisar.  
- Clavar precios/productos solo en HTML sin DB de oferta.

---

## Handoff post-onboarding

Tras Done, sugerir según pack:

- Tienda: “Sube el Excel completo” / “Ajusta stock”  
- Salón: “Agenda una cita de prueba”  
- Restaurante: “Marca un plato agotado” / “Encargo de prueba”  

Marketing en sidebar: badge +S/79 o “usar créditos (alto consumo)”.
