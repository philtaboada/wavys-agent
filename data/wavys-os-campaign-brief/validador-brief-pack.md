# Validador — Briefs pack MVP (Tienda · Salón · Restaurante)

Gate **obligatorio** antes de entregar PDFs a Phil o a un prospecto.

**Skill:** `agent/skills/wavys_os_brief_validator/SKILL.md`  
**Log:** `data/pipeline-runs/wavys-os-pack-brief-validation.md`  
**Regenerar PDFs:** `bun run generate-pack-briefs.ts`

Veredicto: `PASS` | `FAIL` | `BLOCKED`.  
Si **FAIL:** no abrir PDFs al usuario como “listos”; corregir y re-validar.

---

## Packs en alcance

| Pack | HTML | PDF |
|------|------|-----|
| Tienda | `brief-tienda.html` | `Wavys-OS-Brief-Tienda.pdf` |
| Salón | `brief-salon.html` | `Wavys-OS-Brief-Salon.pdf` |
| Restaurante | `brief-restaurante.html` | `Wavys-OS-Brief-Restaurante.pdf` |

---

## B1 — Identidad y copy (por pack)

| ID | Check | Evidencia |
|----|-------|-----------|
| B1-01 | Portada dice **Wavys OS** + pill del pack correcto | HTML |
| B1-02 | Headline único por pack (no copy genérico compartido) | Diff entre HTMLs |
| B1-03 | Problema / antes-después específico del vertical | HTML p.2 |
| B1-04 | CTA Calendly = `https://calendly.com/philtaboada2julio` | grep |
| B1-05 | Email = `contact@wavys-technologies.com` | grep |
| B1-06 | Precios: Plan web **S/169**, Plan completo **S/279**, Scale **S/449** | HTML |
| B1-07 | Sin precio en el primer H1 de portada | HTML |
| B1-08 | Estética alineada a landing producto (`#f5f5f7`, accent `#0071e3`, CTA negro pill) — **no** theros dark-green | CSS |

## B2 — Módulos (crítico)

| ID | Check | Evidencia |
|----|-------|-----------|
| B2-01 | Página de módulos con **Plan web** y **Plan completo** separados | HTML |
| B2-02 | Tienda completo: Stock, Pedidos, Cotizaciones (explícitos) | HTML |
| B2-03 | Salón completo: Agenda / citas + Clientes (explícitos) | HTML |
| B2-04 | Restaurante completo: Pedidos + Agotados (explícitos) | HTML |
| B2-05 | Plan web incluye Website + Oferta (catálogo/servicios/menú) + Leads/WhatsApp | HTML |
| B2-06 | Módulos del pack A no aparecen como promesa principal del pack B | Diff |

## B3 — Imágenes (crítico — no reutilizar basura)

| ID | Check | Evidencia |
|----|-------|-----------|
| B3-01 | Cada pack usa assets **propios** bajo `assets/packs/<pack>/` | paths en HTML |
| B3-02 | **Prohibido** en packs: `phone-cutout.png`, `store-cutout.png`, `hero.png`, `hero-unified.png` (assets genéricos del kit) | grep HTML |
| B3-03 | Cover + CTA (mín. 2 imágenes distintas por pack) | HTML |
| B3-04 | Origen Gemini: JPG fuente en `data/generated-images/` o registro en validation log | paths / log |
| B3-05 | Recorte/encuadre: sujeto centrado, sin texto Gemini, sin logo inventado | screenshot QA |
| B3-06 | Cutout o crop: bordes limpios, sin halo verde/blanco grosero | screenshot |
| B3-07 | Imagen de Tienda ≠ Salón ≠ Restaurante (hash/path distintos) | ls + HTML |

## B4 — Layout / encuadre (visual QA)

| ID | Check | Evidencia |
|----|-------|-----------|
| B4-01 | Sin solapamiento de tipografía (line-height ≥ 1.28 en H1/H2) | CSS + screenshot |
| B4-02 | Márgenes ≥ ~10mm; nada pegado al borde A4 | screenshot |
| B4-03 | Frame de imagen con `object-fit` coherente (contain cutout / cover escena) | CSS |
| B4-04 | 4 páginas por brief (±1 OK si CTA no se corta) | PDF page count |
| B4-05 | Preview portada + módulos sin “vacío muerto” ni overcrowding | screenshot |

## B5 — Entrega

| ID | Check | Evidencia |
|----|-------|-----------|
| B5-01 | PDFs regenerados **después** del último cambio HTML/CSS/assets | mtime |
| B5-02 | Log de validación escrito con veredicto | `wavys-os-pack-brief-validation.md` |
| B5-03 | Solo si PASS: abrir PDFs / declararlos listos a Phil | — |

---

## Frase obligatoria si FAIL

> **Los briefs pack no están listos para entrega.** Hallazgos: …

## Frase si PASS

> **Briefs pack MVP: PASS.** Listos para WhatsApp/email/demo.
