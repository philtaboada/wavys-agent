# Wavys OS — Validador de campaña (GTM)

**Propósito:** gate estricto de la checklist comercial Wavys OS.  
**Estándar:** alto. Ante duda → **FAIL**.  
**Ejecutor:** agente Cursor / Phil.  
**Log:** `data/pipeline-runs/wavys-os-campaign-validation.md`  
**Skill:** `agent/skills/wavys_os_campaign_validator/SKILL.md`

---

## 0. Reglas (no negociables)

1. Verificar **archivos reales** y contenido (grep / read) — no aceptar “ya está” sin evidencia.  
2. Veredicto único: `PASS` | `FAIL` | `BLOCKED`.  
3. Cualquier ❌ en check **crítico** → FAIL.  
4. Presencia Digital como oferta activa en docs de campaña → FAIL automático.  
5. Precios inventados o PD (S/149 web+fotos como plan OS) → FAIL.  
6. Landing sin CTA operable → FAIL.  
7. Re-validar tras cada fix hasta PASS (o BLOCKED solo por dependencia externa explícita).

### Frase obligatoria si FAIL

> **VALIDACIÓN FALLIDA — Campaña Wavys OS.** No dar por cerrada la campaña. Corregir hallazgos y volver a ejecutar este validador.

---

## 1. Checklist (5 puntos)

### P1 — Doc de campaña `agent/context/campaigns/wavys-os.md`

| ID | Check | Crítico | Cómo verificar |
|----|-------|---------|----------------|
| P1.1 | Archivo existe | sí | path existe |
| P1.2 | **En una frase** (propuesta de valor) | sí | sección presente, ≥1 oración producto |
| P1.3 | Planes **S/169 · S/279 · S/449** | sí | Presence 169, Operate 279, Scale 449 en el doc |
| P1.4 | ICP packs **Tienda / Salón / Restaurante** | sí | tres packs nombrados |
| P1.5 | CTA primario documentado (URL) | sí | URL Calendly u otra explícita |
| P1.6 | Anti-confusión con Presencia Digital | sí | regla “no vender PD” / retirada |
| P1.7 | Landing path o URL documentada | sí | `/wavys-os` o URL prod |

### P2 — Kit `data/wavys-os-campaign-brief/`

| ID | Check | Crítico | Cómo verificar |
|----|-------|---------|----------------|
| P2.1 | `BRIEF-CLIENTE.md` existe y menciona Wavys OS + planes | sí | read + precios o link a pricing oficial |
| P2.2 | `MENSAJES-COMPARTIR.md` con WhatsApp + CTA | sí | Calendly o landing; **sin** ofertar PD |
| P2.3 | `PLAN-MARKETING-7-DIAS.md` con acciones día a día | sí | ≥5 días con acciones |
| P2.4 | Guía **contrato o demo** (`DEMO-CONTRATO.md` o equivalente) | sí | cómo agendar demo, qué promete, qué no cobrar aún |
| P2.5 | **PDF comercial** en kit o marketing (`Wavys-OS-*.pdf`) | sí | file exists; generado desde brief/flyer |
| P2.6 | `STORYTELLING-GUIA.md` sin precio en actos 1–3 | recomendado | read |
| P2.7 | Mensajes no linkean `/presencia-digital` como oferta | sí | grep FAIL si aparece como CTA activo |

### P3 — Landing `theros-website` `/wavys-os`

| ID | Check | Crítico | Cómo verificar |
|----|-------|---------|----------------|
| P3.1 | Ruta `app/wavys-os/page.tsx` (o equivalente) | sí | path |
| P3.2 | Metadata title/description Wavys OS | sí | read page |
| P3.3 | Hero: marca **Wavys OS** + 1 headline + 1 CTA | sí | componente |
| P3.4 | CTA apunta a decisión oficial (Calendly fase demos) | sí | href correcto |
| P3.5 | Precios oficiales o “desde” alineado a S/169+ | sí | no precios PD |
| P3.6 | Packs Tienda / Salón / Restaurante visibles | sí | copy |
| P3.7 | No vende Presencia Digital | sí | grep componentes |
| P3.8 | `next build` o typecheck sin error en ruta | sí | comando |
| P3.9 | Redirect `/presencia-digital` → home (no a OS obligatorio) | recomendado | next.config |

### P4 — Registro en README + instructions

| ID | Check | Crítico | Cómo verificar |
|----|-------|---------|----------------|
| P4.1 | `campaigns/README.md`: wavys-os = **activa** | sí | tabla |
| P4.2 | `campaigns/README.md`: presencia-digital = **retirada** (no paralela) | sí | no “activa” |
| P4.3 | `agent/instructions.md`: campaña activa = Wavys OS | sí | sección |
| P4.4 | `growth-focus-phil.md`: prioridad OS, no PD | sí | read |
| P4.5 | Relación vs PD = **sucesora / reemplazo**, no secundaria paralela | sí | wording |

### P5 — Decisión CTA (documentada)

| ID | Check | Crítico | Cómo verificar |
|----|-------|---------|----------------|
| P5.1 | CTA primario fase actual fijado por escrito | sí | en `wavys-os.md` § CTA |
| P5.2 | Explicita **qué no es** (waitlist / self-serve) ahora | sí | tabla decisión |
| P5.3 | Condición para desbloquear self-serve (Polar prod + legal) | sí | criterio escrito |
| P5.4 | Misma URL CTA en campaña + kit mensajes + landing | sí | URL idéntica |

---

## 2. Veredicto

| Resultado | Condición |
|-----------|-----------|
| **PASS** | Todos los críticos ✅ |
| **FAIL** | Cualquier crítico ❌ |
| **BLOCKED** | Impedimento externo (ej. dominio prod sin deploy) — documentar; no sustituye FAIL de contenido faltante en repo |

---

## 3. Matriz de severidad

| Severidad | Ejemplo | Efecto |
|-----------|---------|--------|
| CRÍTICO | sin landing, sin precios, PD aún activa, sin CTA | FAIL |
| MAYOR | PDF ausente, sin guía demo | FAIL |
| MENOR | storytelling corto | Warning; PASS si 0 críticos/mayores |

---

## 4. Anti-patrones = FAIL automático

- Campaña PD y OS ambas “activas”  
- CTA a `/presencia-digital`  
- Precio Presence OS ≠ S/169 (salvo promo documentada S/149 3 meses)  
- Landing genérica sin packs MVP  
- “Waitlist” como CTA primario sin decisión Phil escrita que lo reemplace  

---

*Ubicación:* `data/wavys-os-campaign-brief/validador-campana.md`
