# Plan de negocio Wavys — referencia operativa

Documento vivo para Phil y para Cursor. Actualizar cuando cambien precios, ICP o procesos.

## Mapa de los dos negocios

| | wavys-technologies.com | software.wavys-technologies.com |
|--|------------------------|----------------------------------|
| **Qué vendes** | SaaS CRM conversacional + agentes IA | Implementación y automatización a medida |
| **A quién** | Empresa final con leads WhatsApp | Agencias, partners, proyectos custom |
| **Ticket** | Plan mensual (Starter → Enterprise) | Proyecto + retainer / % partner |
| **Entrega** | Onboarding producto ~14 días | Discovery → build → integración CRM |
| **Mensaje** | "Dejen de perder leads en WhatsApp" | "Complementen su oferta con IA que cierra" |

**Regla:** agencia que pide propuesta → Software/partner primero. Empresa con dolor operativo → SaaS Wavys.

### Campaña activa — Wavys OS

SaaS chat-first (packs Tienda / Salón / Restaurante). **Presencia Digital retirada** (paso previo; canibalizaba OS).

| | |
|--|--|
| Doc campaña | `agent/context/campaigns/wavys-os.md` |
| Kit ventas | `data/wavys-os-campaign-brief/` |
| Producto | `data/wavys-os-brief/` |
| Landing | retirada de software.wavys (redirige `/`) |
| CTA | https://calendly.com/philtaboada2julio |
| Pricing | Presence S/169 · Operate S/279 · Scale S/449 |

Ver `growth-focus-phil.md` para prioridad de tiempo Phil.

---

## 1. Marketing

### Canales prioritarios (orden)

1. **LinkedIn outbound** (ya funciona — caso Onza)
2. **Contenido corto** — antes/después, "lead perdido vs lead con owner", demo 60s WhatsApp
3. **Casos de éxito** — citas del sitio + mini historias cuando cierres
4. **Partners** — agencias como canal (Onza, similares LatAm marketing)
5. **Web / SEO** — páginas por dolor: calificación WhatsApp, reactivación leads, CRM conversacional

### ICP LinkedIn (agencias — como Onza)

- Agencias marketing digital, performance, growth LatAm
- 5–50 empleados, clientes B2B/B2C con WhatsApp
- Pain: clientes piden "automatización" y la agencia no tiene capacidad técnica profunda

### ICP LinkedIn (cliente final SaaS)

- Ventas/comercial con WhatsApp como canal principal
- Leads sin owner, respuesta >15 min, sin seguimiento sistemático
- Ya usan CRM (HubSpot, Pipedrive, etc.) o hojas de cálculo

### Cadencia contenido (mínimo viable)

- 3 posts/semana LinkedIn (1 caso, 1 tip, 1 demo/producto)
- 1 video corto/semana (pantalla Wavys o flujo WhatsApp)
- Repurpose: post → guion llamada → snippet propuesta

### Métricas marketing

- Mensajes enviados / semana
- Tasa respuesta LinkedIn
- Propuestas pedidas
- Llamadas agendadas
- CAC tiempo (horas por cierre)

---

## 2. Prospección y LinkedIn

### Secuencia mensaje (validada — variación Onza)

1. Saludo + observación específica de su empresa
2. Puente: trabajan con empresas que quieren crecer digitalmente
3. Oferta: automatización IA — captura, calificación, seguimiento WhatsApp → más reuniones/ventas
4. CTA suave: ¿te interesaría hablar unos minutos para ver si hay colaboración?

### Volumen objetivo

- Semana 1–4: 15–25 mensajes personalizados/semana
- Objetivo respuesta: 10–20%
- Objetivo propuesta/llamada: 2–5/mes al inicio

### Cuando responden (como Onza)

| Respuesta | Acción | Plazo |
|-----------|--------|-------|
| "Manda propuesta" | Email + PDF/Doc + CTA llamada | <24h |
| "Cuéntame más" | 3 bullets + link software.wavys + calendly | <12h |
| "No ahora" | Agradecer + recordatorio 60 días | mismo día |

---

## 3. Llamadas (discovery)

### Estructura 20–30 min

1. **Contexto** (3 min) — cómo conocieron Wavys, qué les interesó
2. **Dolor** (10 min) — volumen leads, canal WhatsApp, qué pasa hoy, CRM, equipo
3. **Visión** (5 min) — flujo ideal: captura → califica → agenda → CRM
4. **Fit** (5 min) — Quoter / ReActiva / 24/7 o implementación partner
5. **Next step** (5 min) — piloto, propuesta formal, fecha

### Preguntas clave

- ¿Cuántos leads WhatsApp/mes y qué % se enfrían?
- ¿Tiempo promedio primera respuesta?
- ¿CRM actual y quién hace seguimiento?
- ¿Decisor y presupuesto para automatización?
- (Agencia) ¿Cuántos clientes podrían necesitar esto en 6 meses?

### Objetivo de cada llamada

Un solo siguiente paso con fecha: propuesta enviada, piloto acordado, o descarte documentado.

---

## 4. Propuestas y correo

### Tipos de propuesta

**A. Partner agencia** (Onza)
- Modelo colaboración (referido / co-entrega / white-label)
- Qué gana su cliente y qué gana la agencia
- Piloto con 1 cliente + timeline
- Sin precios SaaS detallados hasta discovery con cliente final

**B. Cliente SaaS directo**
- Dolor → solución Wavys (producto específico)
- Alcance onboarding 14 días
- Plan recomendado + inversión mensual
- KPIs: tiempo respuesta, leads calificados, reuniones agendadas

### Checklist antes de enviar

- [ ] Email correcto y nombre contacto
- [ ] Propuesta adaptada (partner vs cliente)
- [ ] CTA claro: "¿Agendamos 20 min el [día]?"
- [ ] Registrado en notas + recordatorio follow-up 48h

---

## 5. Ventas y cierre

### Etapas CRM (manual en `data/` hasta integrar)

`prospecto → respondió → propuesta enviada → discovery → piloto → cliente → partner activo`

### Objeciones frecuentes

| Objeción | Respuesta |
|----------|-----------|
| "Es caro" | Costo de 1 lead perdido/mes vs plan Wavys |
| "Ya tenemos WhatsApp" | Diferencia: calificación + CRM + seguimiento automático |
| "Nuestros clientes no están listos" | Piloto 14 días, un flujo, medimos |
| (Agencia) "Compite con nosotros" | Ustedes venden estrategia; Wavys ejecuta capa IA |

### Cierre piloto recomendado

- 1 flujo (ej. calificación + agenda)
- 30 días medición
- Expansión a ReActiva o más flujos

---

## 6. Operaciones y entrega

- **Día 0–3:** accesos WhatsApp Business API, CRM, kickoff
- **Día 4–10:** flujo agente + pruebas
- **Día 11–14:** go-live + handoff humano documentado
- **Semanal:** revisión métricas con cliente

### KPIs entrega

- Tiempo primera respuesta
- % leads calificados
- Reuniones agendadas
- Conversaciones con owner en CRM

---

## 7. Seguimiento (retención y partners)

- Follow-up propuesta: **48h**, **5 días**, **14 días**
- Partner activo: touchpoint mensual — ¿nuevo cliente para piloto?
- Cliente SaaS: QBR trimestral — upsell flujos

---

## 8. Acción inmediata — Onza Marketing

1. Enviar propuesta hoy a `asesoria@onzamarketing.com`
2. Registrar en notas + reminder 48h
3. Mensaje LinkedIn corto: "Propuesta enviada al correo, quedo atento para agendar una llamada"
4. Preparar 1 página PDF: colaboración agencia + piloto

---

## 9. Cómo usa esto el agente Cursor

| Área | Skill / tool |
|------|----------------|
| Registrar leads | `log_business_note` |
| Recordatorios follow-up | `create_reminder` |
| Enviar propuestas | `send_email` + skill `sales_pipeline` |
| Contexto permanente | `agent/instructions.md` |
| Skills globales Cursor | `agent/context/recommended-skills.md` |

---

## Metas 90 días (sugeridas)

- 60+ outreach LinkedIn
- 8–12 conversaciones calificadas
- 4–6 propuestas enviadas
- 2 pilotos cerrados (1 partner + 1 cliente directo)
- 1 caso de éxito documentado para marketing

---

## 10. Finanzas y pricing

### SaaS (wavys-technologies.com) — referencia pública

| Plan | Conversaciones/mes | Usuarios | Uso típico |
|------|-------------------|----------|------------|
| Starter | 1,000 msg | 3 | Primer flujo, validación |
| Growth | 4,000 | 7 | Campañas + secuencias |
| Scale | 12,000 | 15 | Múltiples pipelines |
| Enterprise | 50,000 | 50 | Alto volumen |

Signup en app segura (`theros.click`). **No inventar precios en propuestas** sin confirmar plan vigente con Phil.

### Servicios / partners (software.wavys-technologies.com)

| Modelo | Cuándo | Estructura sugerida |
|--------|--------|---------------------|
| **Referido** | Agencia trae cliente | % comisión recurrente o one-time (definir: 10–20%) |
| **Co-entrega** | Agencia vende, Wavys implementa | Fee implementación + % o markup SaaS |
| **White-label** | Agencia revende como suyo | Retainer mensual + mínimo clientes |
| **Proyecto custom** | Integración a medida | Discovery pagado → SOW → hitos |

### Reglas financieras

- Piloto: cobrar algo simbólico o descuento 1er mes (evita "gratis = no prioritario").
- Términos: 50% inicio / 50% go-live para implementación; SaaS mensual anticipado.
- Facturación: definir entidad, moneda (USD vs local), método (transferencia, Stripe).
- **Unit economics a trackear:** CAC (horas × tarifa), LTV estimado, margen por plan, costo WhatsApp API/Meta.

---

## 11. Legal, contratos y compliance

### Documentos mínimos (crear antes de escalar)

- [ ] Contrato SaaS / Términos de servicio
- [ ] Anexo tratamiento de datos (WhatsApp = datos personales)
- [ ] NDA para partners
- [ ] SOW (Statement of Work) por proyecto custom
- [ ] Acuerdo de partner (comisión, marca, responsabilidades)
- [ ] Política de privacidad alineada a web + producto

### Compliance WhatsApp / Meta

- Solo API oficial (WhatsApp Business Platform), no hacks.
- Opt-in del usuario para mensajes proactivos.
- Plantillas aprobadas para outbound.
- Horarios y frecuencia de seguimiento (anti-spam).
- Handoff humano documentado cuando el usuario lo pida.

### IA y transparencia

- Disclosure cuando la ley o el cliente lo exijan ("estás hablando con un asistente").
- No prometer resultados garantizados en contratos.

---

## 12. Posicionamiento de las dos marcas

| Situación | Link principal | Mensaje |
|-----------|----------------|---------|
| Agencia / partner | software.wavys-technologies.com | "Implementamos / co-entregamos" |
| Cliente final B2B | wavys-technologies.com | "Producto + onboarding 14 días" |
| LinkedIn outbound agencia | Software + mención producto | Colaboración |
| Post educativo | wavys-technologies.com | Producto y casos de uso |

**Evitar confusión:** una sola firma en correos (`Phil Taboada · Wavys`) con el link que corresponda al tipo de lead.

---

## 13. Programa de partners (agencias)

### Niveles sugeridos

| Nivel | Requisito | Beneficio |
|-------|-----------|-----------|
| **Referido** | 1 intro calificada | Comisión por cierre |
| **Partner** | 2+ clientes/año | Co-branding, soporte prioritario implementación |
| **Strategic** | Volumen acordado | White-label, pricing especial, SLA |

### Onboarding partner (checklist)

- [ ] Acuerdo firmado (comisión + territorio si aplica)
- [ ] Demo interna para su equipo comercial
- [ ] 1 página "cómo vender Wavys a sus clientes"
- [ ] Contacto único implementación
- [ ] Primer cliente piloto identificado

---

## 14. Stack comercial (herramientas de Phil)

| Función | Herramienta sugerida | Estado |
|---------|---------------------|--------|
| Pipeline / CRM ventas | Notion, HubSpot free, o `data/leads.json` | Pendiente elegir |
| Calendario llamadas | Calendly / Google Calendar | Configurar link en propuestas |
| Propuestas | Google Docs → PDF | Crear 2 plantillas (partner + SaaS) |
| Correo | Resend + dominio propio | `.env.local` |
| LinkedIn | Manual + registro en notas | Activo |
| Recordatorios | `create_reminder` + Calendar | Parcial |
| Firma contratos | DocuSign / PDF manual | Pendiente |
| Métricas | Sheet semanal | Crear |

---

## 15. Calificación de leads (cuándo SÍ / NO)

### Calificar (seguir)

- Decisor o acceso directo en <2 saltos
- WhatsApp ya es canal de ventas
- Dolor medible (leads perdidos, sin seguimiento)
- Presupuesto o urgencia en 90 días
- (Agencia) ≥2 clientes potenciales en 6 meses

### Descalificar (archivar)

- Solo "curiosidad" sin proyecto
- Sin WhatsApp en el funnel
- Quieren solo chatbot genérico sin CRM
- Esperan 100% gratis sin piloto
- Industria/región fuera de alcance legal Meta

Registrar descarte en `log_business_note` con razón.

---

## 16. Customer success y retención

### Primeros 30 días post go-live

- Día 1: confirmar flujo activo + owner humano
- Día 7: revisar métricas iniciales
- Día 14: ajuste fino prompts / handoff
- Día 30: reporte ROI + propuesta expansión (ReActiva, otro flujo)

### Señales de churn

- Caída >30% conversaciones
- Cliente no responde QBR
- Quejas de calidad respuestas IA
- No usan CRM conectado

### Upsell natural

Quoter → ReActiva → 24/7 → más usuarios / plan superior.

---

## 17. Pre-venta técnica (checklist discovery)

Antes de prometer fechas, confirmar:

- [ ] ¿Tienen WhatsApp Business API o número compatible?
- [ ] ¿CRM y credenciales API disponibles?
- [ ] ¿Quién aprueba plantillas Meta?
- [ ] ¿Volumen mensual estimado (afecta plan)?
- [ ] ¿Idioma(s) del agente?
- [ ] ¿Integraciones: calendario, pagos, ERP?

Documentar respuestas en notas antes de la propuesta final.

---

## 18. Competencia y diferenciación

| Alternativa | Debilidad típica | Argumento Wavys |
|-------------|------------------|-----------------|
| Respuesta manual WhatsApp | Lento, sin owner | 24/7 + CRM + handoff |
| Chatbot básico | No califica ni cierra | Agentes con contexto comercial |
| Solo email marketing | No conversacional | WhatsApp-first LatAm |
| Agencia sin capa IA | No ejecutan automatización | Partner técnico de la agencia |

No atacar competidores por nombre en outreach; hablar del dolor.

---

## 19. Ritmo semanal del founder

| Día | Bloque | Actividad |
|-----|--------|-----------|
| Lun | 2h | Outreach LinkedIn + follow-ups |
| Mar | 2h | Llamadas discovery / partners |
| Mié | 1h | Contenido LinkedIn + 1 video |
| Jue | 2h | Propuestas + correos + cierres |
| Vie | 1h | Revisión pipeline + métricas semana |
| Diario | 30m | Revisar recordatorios + inbox |

**Regla:** no mezclar bloque outreach con entrega cliente el mismo bloque horario.

---

## 20. Plantillas pendientes de crear

- [ ] Propuesta partner (1 página PDF)
- [ ] Propuesta cliente SaaS (2–3 páginas)
- [ ] One-pager producto Quoter / ReActiva / 24/7
- [ ] Guion discovery 20 min
- [ ] Email follow-up 48h / 5d / 14d
- [ ] Solicitud testimonio post piloto exitoso
- [ ] Kickoff checklist cliente (Día 0)

---

## 21. Riesgos y mitigación

| Riesgo | Mitigación |
|--------|------------|
| Cambios políticas Meta/WhatsApp | Diversificar email + web chat; monitor oficial Meta |
| Dependencia de un partner (Onza) | Pipeline paralelo 10+ prospectos |
| Founder bottleneck | Documentar SOPs; contratar implementador tras 3 clientes |
| IA alucina en ventas | Guardrails, aprobación humana en cotizaciones |
| Marca dual confusa | Regla link (sección 12) en todo material |

---

## 22. Roadmap del agente wavys-agents (tools futuros)

| Tool | Para qué |
|------|----------|
| `update_lead_stage` | Mover leads en pipeline |
| `list_leads` | Ver pipeline activo |
| `draft_proposal` | Generar borrador partner/SaaS |
| `schedule_follow_up` | Secuencia automática 48h/5d/14d |
| Integración Calendly | Links en propuestas |
| Integración Gmail | Alternativa a Resend |

---

## Checklist maestro — ¿listo para escalar?

### Ventas
- [ ] 2 plantillas propuesta (partner + SaaS)
- [ ] Link Calendly en firma
- [ ] Pipeline visible (CRM o sheet)
- [ ] Guion discovery impreso

### Producto / entrega
- [ ] Checklist pre-venta técnica
- [ ] SOP onboarding 14 días
- [ ] Demo reproducible en 5 min

### Legal / finanzas
- [ ] Contrato SaaS o T&C publicados
- [ ] Modelo comisión partner definido
- [ ] Forma de cobro activa

### Marketing
- [ ] 3 posts LinkedIn programados
- [ ] 1 caso de éxito (aunque sea piloto interno)
- [ ] Página clara en cada web (CTA demo)

### Operaciones
- [ ] `.env.local` con email
- [ ] Ritmo semanal en calendario
- [ ] Revisión métricas viernes
