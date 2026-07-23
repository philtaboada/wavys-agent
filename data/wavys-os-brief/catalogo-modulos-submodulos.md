# Wavys OS — Catálogo de módulos y submódulos

**Fecha:** 2026-07-21  
**Para:** Phil / Wavys  
**Idea:** Un solo sistema. Según el **pack** (negocio) + **plan**, se activan módulos. Cada módulo tiene **submódulos** (capacidades internas).

**Relacionado:** [planes-entitlements-chat.md](./planes-entitlements-chat.md) · [modelo-dominio-nucleo.md](./modelo-dominio-nucleo.md)

---

## 1. Cómo se muestra al usuario

```text
Sistema Wavys OS (un solo producto)
│
├─ Pack: Tienda          ← tipo de negocio
├─ Plan: Operate         ← qué pagó
│
└─ Módulos activos (menú / chat)
   ├─ Website
   ├─ Oferta (catálogo)
   │    ├─ Items
   │    ├─ Variantes
   │    ├─ Categorías
   │    └─ Importar Excel
   ├─ Inventario
   │    ├─ Niveles
   │    ├─ Movimientos
   │    └─ Alertas
   ├─ Pedidos
   ├─ Clientes / Leads
   └─ …
```

El chat dice: *“Tienes activos: Website, Oferta, Stock, Pedidos…”* y puede abrir/ejecutar submódulos.

---

## 2. Lista de módulos (15)

Estos son los **módulos de primer nivel** del sistema (IDs estables):

| # | `moduleId` | Nombre UI | Para qué |
|---|------------|-----------|----------|
| 1 | `website` | Website | Crear, editar, publicar la web |
| 2 | `offer` | Oferta | Lo que se vende (catálogo/menú/servicios/hab.) |
| 3 | `offer_import` | Importar oferta | Excel/CSV → oferta |
| 4 | `stock` | Inventario | Cantidades y movimientos |
| 5 | `scheduling` | Agenda | Citas / reservas / visitas |
| 6 | `orders` | Pedidos | Encargos y pedidos con estados |
| 7 | `quotes` | Cotizaciones | Cotizar → convertir a pedido |
| 8 | `crm_leads` | Leads | Quién escribió / interés |
| 9 | `crm_customers` | Clientes | Fichas e historial |
| 10 | `crm_agreements` | Acuerdos | Reuniones de acuerdo / pipeline |
| 11 | `ops_orders` | Órdenes ops | OT / cocina / housekeeping |
| 12 | `team` | Equipo | Staff, roles, asignación |
| 13 | `money` | Dinero | Señas, pagos, caja |
| 14 | `reports` | Reportes | Resúmenes simples |
| 15 | `automations` | Automatización | Recordatorios / WhatsApp IA (Scale) |
| 16 | `marketing` | Marketing creativo | Flyers, posts, video — **add-on / Scale+** |

**Nota:** `offer_import` puede mostrarse **dentro** de Oferta en la UI (submódulo), pero en entitlements es flag aparte (límites de import).

---

## 3. Submódulos por módulo

### 3.1 `website` — Website

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Generar | `website.generate` | Primera web con modelo potente (Grok 4.5…) |
| Editar | `website.edit` | Cambios por chat / skill |
| Publicar | `website.publish` | Dominio / go-live |
| Brand kit | `website.brand` | BrandKit completo → genera/edita web (gate `min_ready`) |
| Contacto | `website.contact` | ContactProfile (WhatsApp, form → lead) |
| Binding oferta | `website.offer_binding` | Web lee catálogo en vivo |

### 3.2 `offer` — Oferta

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Items | `offer.items` | CRUD de lo vendible |
| Categorías | `offer.categories` | Agrupar |
| Perfil catálogo | `offer.profile_catalog` | SKU, variantes (tienda/B2B) |
| Perfil menú | `offer.profile_menu` | Plato, agotado, alérgenos |
| Perfil servicio | `offer.profile_service` | Duración, profesional |
| Perfil habitación | `offer.profile_room` | Capacidad, tarifa/noche |
| Variantes | `offer.variants` | Talla/color/etc. |
| Visibilidad web | `offer.visibility` | `isPublic` / `isActive` |
| Importar | `offer.import` | (= módulo `offer_import`) |

El pack elige **qué perfiles** se muestran (tienda → catalog; salón → service).

### 3.3 `stock` — Inventario

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Niveles | `stock.levels` | Cantidad actual |
| Movimientos | `stock.movements` | Entrada / salida / ajuste |
| Alertas | `stock.alerts` | Stock bajo |
| Por variante | `stock.by_variant` | Stock a nivel SKU variante |

### 3.4 `scheduling` — Agenda

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Citas servicio | `scheduling.appointments` | Salón, clínica, pro, taller |
| Reservas | `scheduling.reservations` | Hotel (noche) / mesa |
| Visitas | `scheduling.visits` | B2B (visita comercial) |
| Recursos | `scheduling.resources` | Staff, box, mesa, habitación |
| Disponibilidad | `scheduling.availability` | Huecos / ocupación |
| Estados | `scheduling.status` | Confirmó / asistió / no-show |

### 3.5 `orders` — Pedidos

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Crear pedido | `orders.create` | Desde chat / web / panel |
| Líneas | `orders.lines` | Items + snapshot precio |
| Estados | `orders.status` | Recibido → prep → listo / enviado |
| Encargos | `orders.preorders` | Pedidos con fecha (pastelería) |

### 3.6 `quotes` — Cotizaciones

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Crear cotización | `quotes.create` | |
| Enviar / PDF | `quotes.send` | (v1 puede ser link/chat) |
| Convertir a pedido | `quotes.to_order` | |

### 3.7 `crm_leads` — Leads

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Bandeja | `leads.inbox` | Lista |
| Estados | `leads.status` | Nuevo / contactado / ganado / perdido |
| Origen | `leads.source` | Web, WhatsApp, chat |
| Captura web | `leads.capture_form` | Formulario del site |

### 3.8 `crm_customers` — Clientes

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Ficha | `customers.profile` | Datos |
| Historial | `customers.history` | Pedidos / citas / acuerdos |
| Activo ligado | `customers.asset` | Auto/equipo (taller) |

### 3.9 `crm_agreements` — Acuerdos

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Nota de reunión | `agreements.note` | Qué se habló |
| Próximo paso | `agreements.next_step` | |
| Pipeline | `agreements.pipeline` | Etapas simples |
| Relación oferta | `agreements.offer_links` | Items cotizados |

### 3.10 `ops_orders` — Órdenes operativas

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| OT taller | `ops.work_order` | Reparación + estados |
| Cocina | `ops.kitchen` | Estados de pedido cocina |
| Housekeeping | `ops.housekeeping` | Limpieza / check-in hotel |

(El pack muestra solo el submódulo que aplica; no los tres a la vez.)

### 3.11 `team` — Equipo

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Staff | `team.staff` | Personas |
| Roles | `team.roles` | owner/admin/staff |
| Asignación | `team.assign` | A cita / OT / pedido |
| Comisiones | `team.commission` | Salón (I) |

### 3.12 `money` — Dinero

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Señas | `money.deposits` | Anticipos |
| Pagos | `money.payments` | Registro simple |
| Caja del día | `money.cash_drawer` | Resumen diario |

### 3.13 `reports` — Reportes

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Ventas | `reports.sales` | |
| Stock | `reports.stock` | |
| Agenda | `reports.scheduling` | |
| Leads | `reports.leads` | |

### 3.14 `automations` — Automatización (Scale / después)

| Submódulo | `subId` | Qué hace |
|-----------|---------|----------|
| Recordatorios | `auto.reminders` | Cita mañana |
| Seguimiento lead | `auto.lead_followup` | |
| WhatsApp IA | `auto.whatsapp_ai` | Quoter/ReActiva (add-on) |

### 3.15 `marketing` — Marketing creativo (add-on / Scale+)

**Cómo entra al producto:** no en Presence ni en Operate base. Se vende como:

1. **Add-on** “Marketing” (+S/mes), o  
2. **Incluido en Scale** (o Scale+),  

Así el precio del cliente **sube** solo cuando quiere creatividades (flyers, posts, video).

| Submódulo | `subId` | Qué hace | Costo típico |
|-----------|---------|----------|--------------|
| Posts / flyers | `marketing.posts` | Diseño social (Figma + Gemini) | Créditos imagen + diseño |
| Variaciones creativas | `marketing.variants` | 3–5 versiones de un aviso | Créditos |
| Video / reel corto | `marketing.video` | Pipeline video (Remotion etc.) | Créditos altos / job |
| Brand kit creativo | `marketing.brand_kit` | Assets recurrentes de marca | Setup 1 vez |
| Calendario contenido | `marketing.calendar` | Plan semanal (v2.1) | Ligero |

**Reglas:**

- Chat solo ofrece marketing si `module marketing` está en entitlements.  
- Cada flyer/video **gasta créditos** (más caros que un CRUD).  
- Quien no lo contrata sigue en Operate barato (web + operación).  
- Quien lo activa paga **más suscripción** y/o **top-ups** de créditos creativos.

**Por qué así:** separa “sistema operativo del negocio” (Operate) de “agencia creativa en el chat” (Marketing). El margen de IA creativa va en el add-on, no contamina Presence.

---

## 4b. Sidebar del panel — cómo se siente

**Decisión Phil:** en el menú lateral salen **todos los módulos relevantes del negocio** (pack). No un menú vacío. Marketing se ve, pero como **opción de upgrade** con precio, para que quieran sumarlo.

```text
SIDEBAR (ej. Pack Tienda + Plan Operate)
│
├─ Website            ← activo
├─ Oferta             ← activo
├─ Inventario         ← activo
├─ Pedidos            ← activo
├─ Cotizaciones       ← activo
├─ Leads              ← activo
├─ Clientes           ← activo
├─ Dinero             ← activo
├─ Reportes           ← activo
│
├─ ─────────────────
├─ Marketing     [PRO] / [+ S/79]
│    “Flyers, posts y video con IA”
│    [ Agregar al plan ]
└─ …
```

### Estados de un ítem en el sidebar

| Estado | Cuándo | Cómo se ve | Al hacer clic |
|--------|--------|------------|---------------|
| **Activo** | Pack ∩ Plan lo permiten y está on | Ícono normal + nombre | Abre el módulo / chat con ese contexto |
| **Disponible (apagado)** | El plan lo permite pero aún no lo activó | Toggle / “Activar” | Chat: `module_enable` |
| **Upsell** | Existe en producto pero **no** en su plan (ej. Marketing) | Badge `PRO` o `+ S/79` · candado suave · copy tentador | Modal/chat: beneficio + precio + “Agregar al plan” |
| **Oculto** | No aplica al pack (ej. OT de taller en una tienda) | No aparece | — |

### Reglas UX Marketing (y otros add-ons)

1. **Siempre visible** en el sidebar si el pack podría usarlo (casi todos los rubros).  
2. No es un vacío: tiene preview (“Crea flyers y reels con tu marca”).  
3. Dos formas de desbloquear / usar:
   - **Add-on mensual** (+S/79 / +S/149) → módulo activo + cupo creativo del mes.  
   - **Créditos IA adicionales** (top-up) → puede generar creatividades **sin** add-on, pagando por uso.  
4. Antes de generar flyer/video, el chat/UI **avisa claro**:  
   *“Esto consume muchos créditos (ej. ~25–80). Te quedan X. ¿Continuar?”*  
5. CTA dual en el ítem Marketing:
   - [ Agregar al plan +S/79 ]  
   - [ Usar con mis créditos ] (si tiene saldo; si no → comprar top-up)  
6. Tras add-on: ítem **Activo** + submódulos.  
7. Sin add-on pero con créditos: puede ejecutar jobs creativos; el sidebar sigue mostrando el upsell (“Pasa a Marketing mensual y ahorra”).  
8. El resto de módulos del negocio se ven completos (sistema lleno, no trial pobre).

### Aviso de consumo (obligatorio en creatividades)

| Acción | Créditos orientativos | Copy de aviso |
|--------|----------------------|---------------|
| Flyer / post 1:1 | ~25–40 | “Alto consumo de créditos (imágenes + diseño)” |
| 3 variaciones | ~60–90 | “Varias piezas = más créditos” |
| Video / reel corto | ~80–150 | “Video consume muchos créditos; revisa tu saldo” |

Si el saldo no alcanza → no ejecuta; ofrece top-up o add-on mensual.

### Objetivo de sensación

- “Ya tengo mi negocio digital armado” (módulos operativos).  
- “Puedo crecer a creatividades cuando quiera” (Marketing tentador, no escondido).  
- El precio extra se entiende **antes** de gastar créditos de flyer/video.

| Pack | Módulos que típicamente se activan (E+I + plan Operate) |
|------|--------------------------------------------------------|
| **Tienda** | website, offer (catalog), offer_import, stock, orders, quotes, leads, customers, agreements*, money, reports |
| **Salón** | website, offer (service), offer_import, scheduling (citas), stock*, orders*, leads, customers, team, money, reports |
| **Resto** | website, offer (menu), offer_import, stock, orders, scheduling (mesa)*, agreements (catering)*, ops (cocina)*, leads, customers, money, reports |
| **Hotel** | website, offer (room), scheduling (noches), orders/reservas, customers, ops (housekeeping), money, reports, leads |
| **…** | según matriz Pack ∩ módulo |

\*si el plan y el pack lo permiten.

---

## 5. Reglas de producto

1. **Un sistema** → muchos módulos; no 8 apps distintas.  
2. El **pack** decide qué módulos *pueden* aparecer.  
3. El **plan** decide cuáles *están pagados*.  
4. Los **submódulos** se muestran según perfil (ej. oferta solo “variantes” en tienda).  
5. En UI/chat: módulo = sección; submódulo = acciones dentro.  
6. Entitlements en DB pueden ser a nivel módulo; submódulos se derivan del pack (más simple en v1).

---

## 6. Resumen

| Nivel | Cantidad | Ejemplo |
|-------|----------|---------|
| Sistema | 1 | Wavys OS |
| Módulos | **16** | `stock`, `offer`, `marketing` (add-on)… |
| Submódulos | ~55 | `stock.alerts`, `marketing.posts`… |

Sí: módulos + submódulos definidos. Se activan según pack + plan; **marketing** sube el precio como add-on.

---

*Ubicación:* `data/wavys-os-brief/catalogo-modulos-submodulos.md`
