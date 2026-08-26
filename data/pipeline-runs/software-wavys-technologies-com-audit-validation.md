# Validación Gate 1+ — software.wavys-technologies.com (auditoría web)

Pipeline: `website_audit`  
URL: https://software.wavys-technologies.com/  
Industria: estudio diseño + software a medida  
Objetivo: pre-redesign (sitio propio Wavys)  
Fecha: 2026-08-12

---

## ① Contexto

| ID | ✅/❌ | Valor | Notas |
|----|-------|-------|-------|
| UA-C01 | ✅ | url: https://software.wavys-technologies.com/ | |
| UA-C02 | ✅ | industria: estudio software / implementación | |
| UA-C03 | ✅ | objetivo: pre-landing / pre-rediseño | |

## ② Cursor Browser

| ID | ✅/❌ | Evidencia | Notas |
|----|-------|-----------|-------|
| UA-B01 | ✅ | navigate OK | Brave CDP + browser-use (MCP Browser no listado en sesión) |
| UA-B02 | ✅ | hero desktop: `_preview-software-wavys/01-hero-desktop-1440.png` + `01b-hero-desktop-DARK.png` | Light default + dark forzado |
| UA-B03 | ✅ | sección: `04-servicios-desktop.png`, `02-trabajo-desktop.png`, `05-cifras-desktop.png` | |
| UA-B04 | ✅ | footer: `03-footer-desktop.png` | |
| UA-B05 | ✅ | mobile 390: `06-hero-mobile-390.png` | + trabajo/footer 390 |
| UA-B06 | ✅ | snapshot | links, dead `#`, CTAs Cal.com, sin wavys-os |

## ③ CTAs

| Prueba | Resultado | ✅/❌ |
|--------|-----------|-------|
| CTA principal | https://cal.com/wavys-call/30min — 200, distinto a Calendly oficial | ✅ |
| WhatsApp/tel | no visible | ✅ |
| Formulario | no existe (mailto + booking) | ✅ |
| Menú móvil | no hay hamburger; nav `display:none` | ✅ |

| ID | ✅/❌ | Notas |
|----|-------|-------|
| UA-T01 | ✅ | CTA documentado |
| UA-T02 | ✅ | no hay wa.me/tel |
| UA-T03 | ✅ | sin form POST |
| UA-T04 | ✅ | menú mobile ausente |
| UA-T05 | ✅ | ≥3 filas en informe |

## ④ Terminal

| ID | ✅/❌ | Valor | Notas |
|----|-------|-------|-------|
| UA-H01 | ✅ | http: 200 | Vercel HIT + CF |
| UA-H02 | ✅ | bytes: 64992 | |
| UA-H03 | ✅ | href# count: 2 | linkedin, instagram |
| UA-H04 | ✅ | placeholders 0 | |

## ⑤ Browser Use

| ID | ✅/❌ | Notas |
|----|-------|-------|
| UA-U01 | ✅ | capa B: Brave CDP 9223 + browser-use |
| UA-U02 | ✅ | screenshots en `_preview-software-wavys/` |

## ⑥ Informe

| Sección informe | ✅/❌ |
|-----------------|-------|
| 1. Resumen ejecutivo | ✅ |
| 2. Qué funciona / no | ✅ |
| 3. Diseño y UX | ✅ |
| 4. Técnico / SEO | ✅ |
| 5. Por qué cambiar | ✅ |
| 6. Recomendaciones | ✅ |
| 7. Oportunidad Wavys | ✅ |

| ID | ✅/❌ | Notas |
|----|-------|-------|
| UA-R01 | ✅ | 7/7 |
| UA-R02 | ✅ | español |
| UA-R03 | ✅ | ≥8 capturas |
| UA-R04 | ✅ | sitio propio — palanca OS + partners |
| UA-R05 | ✅ | quick vs rediseño |

## ⑦ Persistencia

| ID | ✅/❌ | Notas |
|----|-------|-------|
| UA-P01 | ✅ | N/A — no es prospecto (sitio Wavys) |
| UA-P02 | ✅ | no se envió propuesta |

## Anti-patrones

| ID | ✅/❌ |
|----|-------|
| UA-X01 | ✅ |
| UA-X02 | ✅ |
| UA-X03 | ✅ |

**Informe autorizado:** ☑ Sí
