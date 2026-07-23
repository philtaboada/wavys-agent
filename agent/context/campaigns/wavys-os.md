# Campaña: Wavys OS

**Estado:** activa · **Desde:** 2026-07-22 · **Marca:** Wavys Technologies (producto SaaS)  
**Sucede a:** Presencia Digital *(retirada — no vender; evitamos canibalización)*

| Campo | Valor |
|-------|-------|
| **Producto** | SaaS chat-first · packs Tienda / Salón / Restaurante |
| **Landing** | https://software.wavys-technologies.com/wavys-os · repo `theros-website` `/wavys-os` |
| **CTA primario** | Demo registrada → https://calendly.com/philtaboada2julio |
| **Email** | contact@wavys-technologies.com |
| **Kit operativo** | `data/wavys-os-campaign-brief/` |
| **Brief producto (build)** | `data/wavys-os-brief/` |
| **Onboarding** | skill `wavys_os_onboarding` |
| **Herencia PD** | Storytelling 5 actos, WhatsApp-first, ICP PYME PE, plan 7 días — adaptados a OS |

---

## En una frase

**Wavys OS** es el sistema operativo del negocio: se abre el chat y de ahí nacen web, oferta, citas, stock y pedidos — packs Tienda, Salón o Restaurante.

**No es** un servicio de “te hacemos la web a mano” (eso era Presencia Digital). El dueño se configura en ≤30 min por chat.

---

## Regla anti-canibalización

| Prohibido | Obligatorio |
|-----------|-------------|
| Vender “Presencia Digital”, “Presencia Tienda”, “Presencia Catálogo” | Hablar solo de **Wavys OS** (Presence / Operate / Scale) |
| Prometer entrega Astro/manual tipo agencia como producto | Prometer onboarding chat + subdominio `{slug}.wavys.app` |
| Usar precios PD (S/149 landing+fotos) | Usar precios OS oficiales abajo |
| Empujar a `/presencia-digital` | CTA demo Calendly + landing `/wavys-os` |

Kit histórico PD (`data/presencia-digital-brief/`) = **archivo de ideas**, no oferta activa.

---

## Decisión CTA (oficial — no improvisar)

| Fase | CTA primario | No usar como primario |
|------|--------------|------------------------|
| **Ahora (demos / design partners)** | **Demo Calendly** `https://calendly.com/philtaboada2julio` | Waitlist, checkout Polar, “regístrate solo” |
| **Soft launch cobro** | Calendly **o** self-serve Polar Presence | Waitlist genérica |
| **Post-legal + Polar prod + DNS** | Self-serve signup + checkout Polar; Calendly = enterprise / partners | Prometer self-serve antes de unlock |

**Unlock self-serve (los tres):** (1) OK legal Términos/Privacidad · (2) Polar products prod · (3) DNS `*.wavys.app` + app reachable.  
**Waitlist:** descartada como CTA primario — queremos conversación y packs MVP cubiertos.  
**Misma URL** en campaña, `MENSAJES-COMPARTIR.md`, `DEMO-CONTRATO.md` y botón landing.

---

## Planes (pricing oficial — no inventar)

Fuente: `data/wavys-os-brief/precios-soles-finales.md` (confirmado Phil 2026-07-21).

| Plan | Precio / mes | Créditos IA | Ideal para |
|------|--------------|-------------|------------|
| **Presence** | **S/169** | 150 | Web + oferta + leads + subdominio |
| **Operate** | **S/279** | 400 | Presence + stock / citas / pedidos del pack |
| **Scale** | **S/449** | 1000 | Operate + automations + prioridad gen. web |

Promo lanzamiento (opcional, 3 meses): Presence **S/149** · Operate **S/249**.

**Add-ons:** Marketing Posts +S/89 · Marketing Pro +S/149.  
**Cobro:** Polar (prod bloqueado hasta OK legal). Ver `cobro-polar.md`.

**Regla copy:** valor y narrativa primero; **no abrir con precio**.

---

## ICP

Dueños PYME Perú (Huancayo + Lima / provincias) que hoy viven en WhatsApp + Excel / redes:

| Pack MVP | Señales |
|----------|---------|
| **Tienda** | Catálogo, stock, pedidos WhatsApp |
| **Salón** | Citas, servicios, agenda |
| **Restaurante** | Carta, platos agotados, pedidos |

**No confundir con:** lead partner/agencia → `business-plan.md`; SaaS CRM Quoter/ReActiva → wavys-technologies.com/planes.

---

## Cómo funciona (línea de producto — mensaje)

```
Registro (magic link)
  → Chat onboarding (guía + ejecución)
  → Pack (Tienda | Salón | Restaurante) + plan
  → Contacto + marca
  → Web en {slug}.wavys.app
  → Oferta visible
  → Opera por chat (créditos + roles)
```

Detalle: `data/wavys-os-brief/mvp-onboarding-tienda-salon-resto.md`.

---

## Kit operativo (`data/wavys-os-campaign-brief/`)

| Archivo | Cuándo usarlo |
|---------|---------------|
| `BRIEF-CLIENTE.md` | Explicación comercial OS |
| `MENSAJES-COMPARTIR.md` | Copy WhatsApp, LinkedIn, IG |
| `STORYTELLING-GUIA.md` | Arco 5 actos — sin precio al inicio |
| `PLAN-MARKETING-7-DIAS.md` | Acciones día a día · demos / design partners |
| `DEMO-CONTRATO.md` | Guía demo + mini-acuerdo design partner |
| `Wavys-OS-Brief.pdf` | PDF comercial (flyer) para enviar |
| `validador-campana.md` | Gate GTM estricto P1–P5 |
| Assets flyer/infografía | `data/wavys-os-brief/marketing/` |

---

## Qué hacer cuando Phil pide…

| Tarea | Acción |
|-------|--------|
| Mensaje WhatsApp / LinkedIn / IG | `MENSAJES-COMPARTIR.md` |
| Brief / explicación al cliente | `BRIEF-CLIENTE.md` + flyer PDF |
| Demo | Calendly + log `wavys-os` |
| Onboarding tenant | skill `wavys_os_onboarding` |
| Build producto | `data/wavys-os-brief/` + `wavys_os_phase_validator` |
| Registrar lead | `log_business_note` tag `wavys-os` |

---

## Canales (mismo orden que funcionó en PD)

1. WhatsApp directo (Maps + red personal)  
2. Referidos (William, JLH, Coophitel)  
3. Partners Huancayo (mensaje OS, no PD)  
4. Meta Ads geo local (cuando landing OS live)  
5. LinkedIn — partners B2B en paralelo  

---

## Métricas campaña (fase demos)

| Métrica | Meta 14–21 días |
|---------|-----------------|
| Demos / design partners agendados | 5–10 |
| Packs cubiertos | ≥1 Tienda, ≥1 Salón o Resto |
| Mensajes enviados | 25+ |
| Respuestas | 5+ |
| Pagos Polar prod | 0 hasta OK legal |

---

## Pendiente Phil

- [x] Landing pública `/wavys-os` en `theros-website`
- [ ] Deploy landing a prod (si CI no auto-deploy)
- [ ] Polar sandbox productos reales
- [ ] Soft launch cobro + DNS `*.wavys.app`
- [ ] Revisar copy mensajes antes de blast masivo
- [ ] Contrato / Términos OS (post-legal)

---

*Ubicación:* `agent/context/campaigns/wavys-os.md`
