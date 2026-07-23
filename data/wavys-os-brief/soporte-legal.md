# Wavys OS — Soporte humano + legal (mínimo MVP)

---

## 1. Soporte humano

| Nivel | Quién | Cuándo |
|-------|-------|--------|
| L0 | Chat OS | 90% dudas de uso, cambios, créditos |
| L1 | Phil / equipo Wavys | Chat no puede: DNS (luego), cobro Polar, bug, abuso |
| L2 | Técnico | Deploy, datos corruptos, seguridad |

**Escalado desde el chat:**  
Usuario: “hablar con humano” → crea ticket / email `contact@wavys-technologies.com` + nota en tenant + reminder.

**SLA blando MVP:** respuesta humana &lt; 24–48h días laborables (PE).

**No promete:** soporte telefónico 24/7 en Presence.

---

## 2. Legal mínimo (checklist — con abogado/contador)

| Pieza | Contenido mínimo |
|-------|------------------|
| **Términos de uso** | Qué es el SaaS, packs, créditos no reembolsables salvo ley, uso aceptable (no abuso IA) |
| **Privacidad** | Qué datos (contacto, oferta, leads), base legal, retención, encargados (Polar, Vercel, Gemini) |
| **Encargado / MoR** | Polar cobra como Merchant of Record; aclarar facturación |
| **WhatsApp** | Usuario responsable de cumplir políticas Meta al usar su número |
| **Contenido** | Usuario dueño de fotos/logo; licencia a Wavys para hostear/generar web |
| **Cancelación** | Fin de periodo; export de datos bajo pedido (CSV oferta/leads) |
| **Limitación** | Disponibilidad best-effort MVP; no responsabilidad por ventas perdidas del cliente |

**Acción:** borradores con IA OK; **revisión legal PE** antes de cobrar en prod.

---

## 3. Datos sensibles

- No loguear mensajes de chat con datos de tarjetas (Polar hosted checkout).  
- Aislar por `tenantId`.  
- Staff no ve otros tenants.

---

*Ubicación:* `data/wavys-os-brief/soporte-legal.md`
