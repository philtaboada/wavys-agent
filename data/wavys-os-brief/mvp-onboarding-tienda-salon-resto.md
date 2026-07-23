# Wavys OS — MVP packs + Onboarding (Tienda · Salón · Restaurante)

**Fecha:** 2026-07-21  
**Para:** Phil / Wavys  
**Decisión:** MVP = **Tienda**, **Salón**, **Restaurante**. El resto de packs después.  
**Skill Cursor (ejecutar el flujo):** `agent/skills/wavys_os_onboarding/SKILL.md`  
**Doc fuente:** este archivo.

---

## 1. Alcance MVP

| Pack | Oferta | Módulos E+I foco (con plan Operate) |
|------|--------|-------------------------------------|
| **Tienda** | `catalog` (+ variantes) | website, offer, import, stock, orders, quotes*, leads, customers, money, reports |
| **Salón** | `service` (+ retail opcional) | website, offer, import, scheduling (citas), stock*, orders*, leads, customers, team*, money, reports |
| **Restaurante** | `menu` | website, offer, import, stock, orders, scheduling (mesa)*, agreements (catering)*, ops cocina*, leads, customers, money, reports |

\*según plan; Presence solo website + offer + leads.

**Fuera del MVP de packs:** Clínica, Hotel, Pro, Taller, B2B (misma arquitectura; se encienden después).

---

## 2. Onboarding — idea

Todo por **chat**. Una secuencia común + **rama según pack**.

El onboarding **también es la guía del usuario**: muchas PYMEs no saben qué es un “módulo”, “créditos” o “pack”. Cada paso debe **explicar en lenguaje simple**, mostrar por qué importa, y solo entonces pedir datos o ejecutar.

```text
Registro → Chat onboarding (guía + ejecución)
    │
    ├─ 1. Quién eres / negocio
    ├─ 2. Detectar o confirmar pack (Tienda | Salón | Restaurante)
    ├─ 3. Plan (Presence u Operate) + créditos (explicados)
    ├─ 4. ContactProfile (WhatsApp, etc.)
    ├─ 5. BrandKit (por qué importa para la web)
    ├─ 6. Generar website (modelo potente)
    ├─ 7. Seed oferta O import Excel
    ├─ 8. Activar módulos del pack (según plan) + tour corto
    └─ 9. “Listo” + sidebar + cómo seguir solo
```

**Objetivo:** en &lt; 20–30 min el dueño tiene web publicada (o preview) + oferta empezada + contacto real **y entiende** qué tiene y cómo seguir.

---

## 2b. Onboarding = guía del usuario (pedagogía)

El dueño no es developer. El chat debe **enseñar mientras configura**.

### Principios

1. **Una idea por mensaje** — no un muro de opciones.  
2. **Por qué antes del qué** — “Tu WhatsApp va en la web para que te escriban; ¿cuál es?”  
3. **Palabras humanas** — decir “tu carta / tus productos / tus servicios”, no solo “OfferItem”.  
4. **Mostrar el resultado** — link preview, captura mental: “Así se verá el botón”.  
5. **Glosario en contexto** — la primera vez que salga “créditos”: una frase; no un manual.  
6. **Siguiente paso siempre** — al cerrar cada fase: “Ahora X”.  
7. **Tour del sidebar al final** — 4–5 ítems: qué es cada uno en su negocio.  
8. **“¿No entiendo?”** — el chat ofrece repetir más simple o un ejemplo.

### Mini-glosario (cómo lo dice el chat)

| Interno | Cómo se lo dices al usuario |
|---------|------------------------------|
| Pack | “Tipo de negocio (tienda, salón o restaurante)” |
| Plan Presence / Operate | “Plan web” / “Plan completo (web + operación)” |
| Créditos | “Puntos para que la IA cree la web o imágenes; se renuevan cada mes” |
| BrandKit | “La cara de tu marca: nombre, colores, cómo hablas” |
| Módulo Stock | “Inventario: saber qué te queda” |
| Módulo Scheduling | “Agenda de citas” |
| Marketing add-on | “Extra para flyers y videos (cuesta aparte o muchos puntos)” |

### Script de guía por fase (resumen)

| Fase | Explica | Luego pide / hace |
|------|---------|-------------------|
| Pack | “Según eso te armo herramientas distintas” | Confirmar Tienda/Salón/Resto |
| Plan | “Presence = verte online; Operate = también pedidos/stock/citas” | Elegir plan |
| Créditos | “Crear la web gasta puntos; te digo cuántos antes” | OK |
| Contacto | “Esto sale en tu web para que te escriban” | WhatsApp… |
| BrandKit | “Con esto la web se parece a tu negocio, no a una plantilla” | Bio, tono, color |
| Website | “Voy a diseñar tu página; tarda un poco y usa ~80 puntos” | Confirmar → generate |
| Oferta | “Lo que vendes vive aquí; la web lo muestra sola” | Excel o lista |
| Módulos | “En el menú de la izquierda verás…” | Tour 60 s |
| Cierre | “Ya puedes solo: cambia WhatsApp diciéndome…; sube Excel…” | 1 misión fácil |

### Misión post-onboarding (para que practique)

| Pack | Primera misión guiada |
|------|------------------------|
| Tienda | “Cambia el precio de un producto” o “Sube 3 más” |
| Salón | “Agenda una cita de prueba contigo” |
| Restaurante | “Marca un plato como agotado” |

---

## 3. Flujo común (pasos 1–5 y 9)

### Paso 0 — Registro

- Email / Google / WhatsApp OTP (a definir en auth).  
- Crea `User` + `Tenant` vacío (`status=onboarding`).

### Paso 1 — Prompt del negocio

Chat:

> “Cuéntame tu negocio en 2–3 frases: qué vendes, en qué ciudad, y cómo te escriben hoy (WhatsApp, local…).”

El agente extrae: nombre, rubro candidato, ciudad, tono.

### Paso 2 — Confirmar pack

Chat muestra 3 tarjetas (o detecta y pide OK):

| Opción | Copy corto |
|--------|------------|
| **Tienda** | Productos, stock, pedidos |
| **Salón** | Servicios, citas, agenda |
| **Restaurante** | Menú, encargos, cocina |

Usuario confirma → `tenant.packId` + `offerProfile` (`catalog` | `service` | `menu`).

Si el texto no encaja en los 3: “Por ahora el MVP cubre Tienda, Salón o Restaurante. ¿Cuál se acerca más?”

### Paso 3 — Plan

> “Para empezar: **Presence** (web + catálogo/menú/servicios) u **Operate** (también stock/citas/pedidos).”

- Guarda `TenantSubscription`.  
- Asigna créditos del plan.  
- No activa Marketing (solo upsell en sidebar).

### Paso 4 — ContactProfile (obligatorio mínimo)

Pide en bloque o uno a uno:

| Campo | Obligatorio onboarding |
|-------|------------------------|
| Nombre comercial | Sí |
| WhatsApp | Sí (PYME) |
| Ciudad | Sí |
| Teléfono | No |
| Email público | No |
| Dirección | Recomendado |
| Horario | No (puede después) |
| Instagram | No |

Guarda `ContactProfile`. Sin WhatsApp no publica CTAs inventados.

### Paso 5 — BrandKit (crítico — no es opcional “de mentira”)

Sin BrandKit en `min_ready` **no** se genera la web (o solo con warning explícito de Phil/dueño).

Chat pide / confirma:

1. **Nombre de marca** (displayName)  
2. **Bio corta** (qué eres, para quién, ciudad)  
3. **Tono** (cálido / premium / serio / alegre…)  
4. **Color principal** o “elige tú según el rubro”  
5. **Logo** (upload) o “seguimos con el nombre escrito”  
6. CTA preferido (WhatsApp / ver menú / pedir cita)

Guardar `BrandKit` con `completeness=min_ready` o `rich`.  
Luego el generate **inyecta** estos campos al skill de website.

### Paso 9 — Cierre común

Chat resume:

- Link preview / dominio `slug.wavys.app`  
- Pack + plan + créditos restantes  
- Módulos activos en sidebar  
- Marketing visible como **+S/79** / créditos  
- Siguiente acción sugerida según pack (ver ramas)

---

## 4. Rama Tienda (pasos 6–8)

### 6 — Website (moldes → 1 disparo)

Ver `data/wavys-os-brief/website-prompt-moldes.md`.

1. Usuario elige **1 de 5 moldes** de estilo, o “ninguno” (entonces pedimos logo/fotos/preferencias).  
2. Se arma **un solo prompt maestro** (molde + BrandKit + ContactProfile + pack).  
3. `generate_website` **una vez** (modelo potente).  
4. Cambios pequeños después por chat; regen full solo si cambia de molde/estilo total.

### 7 — Oferta

Chat ofrece **A o B**:

| Opción | Acción |
|--------|--------|
| **A. Excel** | `offer_import_excel` — columnas: nombre, precio, categoría, sku?, stock? |
| **B. Semilla** | IA propone 8–12 productos de ejemplo → usuario edita |

Luego: “¿Activamos inventario?” (si Operate) → `module_enable(stock)`.

### 8 — Módulos

| Presence | Operate |
|----------|---------|
| website, offer, import, leads | + stock, orders, customers, money, reports (+ quotes si quiere) |

**Cierre Tienda:** “Sube más productos o dime: crea un pedido de prueba.”

---

## 5. Rama Salón (pasos 6–8)

### 6 — Website

Igual que Tienda: **molde 1–5 o brief libre → un solo generate**.  
Secciones del pack: hero, servicios (binding), equipo opcional, contacto / pedir cita.

### 7 — Oferta (servicios)

| Opción | Acción |
|--------|--------|
| **A. Lista rápida** | Usuario dicta: “Corte 40, Tinte 80, Barba 25” → `offer_create` × N con `durationMinutes` |
| **B. Excel** | nombre, precio, duración_min |
| **C. Semilla** | 6–8 servicios típicos del rubro |

Si Operate: “¿Activamos la agenda de citas?” → `scheduling` + recursos (al menos 1 staff = el dueño).

Retail (shampoo): “¿También vendes productos?” → items `catalog` extra (opcional).

### 8 — Módulos

| Presence | Operate |
|----------|---------|
| website, offer, leads | + scheduling, customers, money, reports (+ stock/team si aplica) |

**Cierre Salón:** “Agenda tu primera cita de prueba” o “Invita a tu estilista (equipo).”

---

## 6. Rama Restaurante (pasos 6–8)

### 6 — Website

Igual: **molde o brief → un solo generate**.  
Secciones del pack: hero, menú (binding + agotado), horarios, ubicación, WhatsApp.

### 7 — Oferta (menú)

| Opción | Acción |
|--------|--------|
| **A. Excel / foto de carta** | Import o vision (Flash Lite) → platos |
| **B. Dictado** | “Entradas: … Fondos: …” |
| **C. Semilla** | Menú ejemplo por tipo (café / resto / pastelería) |

Operate: stock de insumos o al menos `isSoldOut` + pedidos/encargos.  
Opcional: “¿Tomas reservas de mesa?” → `scheduling.reservations`.  
Opcional: “¿Haces catering?” → `crm_agreements`.

### 8 — Módulos

| Presence | Operate |
|----------|---------|
| website, offer, leads | + stock, orders, customers, money, reports (+ mesa / cocina / catering) |

**Cierre Restaurante:** “Marca un plato como agotado” o “Recibe un encargo de prueba.”

---

## 7. Qué se crea en DB (checklist onboarding)

| Entidad | Cuándo |
|---------|--------|
| User, Tenant, Membership (owner) | Registro |
| Pack + offerProfile | Paso 2 |
| TenantSubscription + créditos | Paso 3 |
| ContactProfile | Paso 4 |
| BrandKit | Paso 5 |
| Website + offerBinding + contact binding | Paso 6 |
| OfferCategory + OfferItems (+ profiles) | Paso 7 |
| TenantModuleFlag[] | Paso 8 |
| StaffMember (Salón, 1 recurso) | Paso 8 Operate |
| UsageCounter / CreditLedger | Cada tool cara |

---

## 8. Créditos en onboarding (orden de magnitud)

| Acción | Créditos ≈ |
|--------|------------|
| Chat guía | bajo |
| Generar website | ~80 |
| 6–8 imágenes Gemini (si pide) | ~18–24 |
| Import Excel | ~15–40 |
| Seed oferta | ~10 |

Presence (~150 créditos) aguanta **1 web + seed + poco más**.  
Operate (~400) aguanta web + import + pruebas.

Avisar antes de generar web: “Esto usará ~80 créditos. Te quedan X.”

---

## 9. Mensajes tipo (tono + guía)

- Cercano, peruano/neutro, sin jerga ERP.  
- Siempre: **explicar → confirmar → ejecutar → mostrar resultado (link)**.  
- Si no entiende: ofrecer ejemplo del rubro (tienda de ropa / salón en Miraflores / cevichería).  
- Si falta plan: “Eso está en el plan completo; ¿lo activamos o seguimos solo con la web?”  
- Nunca asumir que sabe qué es un módulo: mostrarlo en el sidebar con una frase.

---

## 10. Criterio “onboarding OK” (MVP)

| Pack | Done cuando… |
|------|----------------|
| **Tienda** | Web preview + ≥5 productos públicos + WhatsApp en contacto (+ stock on si Operate) |
| **Salón** | Web preview + ≥3 servicios con duración + WhatsApp (+ 1 cita posible si Operate) |
| **Restaurante** | Web preview + ≥8 platos en categorías + WhatsApp (+ 1 encargo o agotado demo si Operate) |

**También done de guía:** el usuario puede repetir en una frase qué es su plan, dónde está el WhatsApp, y una cosa que puede pedir al chat mañana.

Tiempo objetivo: **≤ 30 min** con dueño atento.

---

## 11. Qué falta en planificación (antes del software)

| # | Tema | Estado |
|---|------|--------|
| 1 | Guiones onboarding | Hecho |
| 2 | Día 2+ / API / Presencia↔OS (explicado) | [explicaciones-dia2-api-presencia.md](./explicaciones-dia2-api-presencia.md) |
| 3 | Auth + roles | [auth-roles.md](./auth-roles.md) |
| 4 | Cobro Polar (no Stripe PE) | [cobro-polar.md](./cobro-polar.md) |
| 5 | Dominios (MVP subdominio) | [dominios.md](./dominios.md) |
| 6 | Schema DB | [schema-db.md](./schema-db.md) |
| 7 | Precios S/ | [precios-soles-finales.md](./precios-soles-finales.md) — **confirmado Phil** (169 / 279 / 449) |
| 8 | Soporte + legal | [soporte-legal.md](./soporte-legal.md) |
| 9 | Arquitectura técnica Next/Nest/PG/Docker | [arquitectura-tecnica.md](./arquitectura-tecnica.md) |
| 10 | Sites runtime **B** (confirmado) | [arquitectura-tecnica.md](./arquitectura-tecnica.md) §10 |

**Planificación MVP: cerrada.** Siguiente = codear según:

- [plan-software-especifico.md](./plan-software-especifico.md)  
- [validador-fases.md](./validador-fases.md) (gate obligatorio por fase)

---

*Ubicación:* `data/wavys-os-brief/mvp-onboarding-tienda-salon-resto.md`
