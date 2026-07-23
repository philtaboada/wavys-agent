# Wavys OS — Validación campaña (GTM)

- Fecha: 2026-07-22
- Revisor: agente Cursor
- Momento: intento #2 (post-fix)
- Validador: `data/wavys-os-campaign-brief/validador-campana.md`
- Skill: `agent/skills/wavys_os_campaign_validator/SKILL.md`

## Veredicto

**PASS**

Warnings (no bloquean): deploy a prod de `theros-website` para que la URL pública responda; hasta entonces la ruta existe en repo + build OK.

## Checklist

| ID | Resultado | Evidencia |
|----|-----------|-----------|
| P1.1 | ✅ | `agent/context/campaigns/wavys-os.md` |
| P1.2 | ✅ | § En una frase |
| P1.3 | ✅ | S/169 · S/279 · S/449 |
| P1.4 | ✅ | Tienda / Salón / Restaurante |
| P1.5 | ✅ | Calendly documentado |
| P1.6 | ✅ | anti-PD / retirada |
| P1.7 | ✅ | URL `/wavys-os` en campaña |
| P2.1 | ✅ | `BRIEF-CLIENTE.md` |
| P2.2 | ✅ | `MENSAJES-COMPARTIR.md` + Calendly + landing |
| P2.3 | ✅ | `PLAN-MARKETING-7-DIAS.md` |
| P2.4 | ✅ | `DEMO-CONTRATO.md` |
| P2.5 | ✅ | `Wavys-OS-Brief.pdf` en kit |
| P2.6 | ✅ | `STORYTELLING-GUIA.md` |
| P2.7 | ✅ | sin CTA `/presencia-digital` en mensajes |
| P3.1 | ✅ | `theros-website/app/wavys-os/page.tsx` |
| P3.2 | ✅ | metadata Wavys OS |
| P3.3 | ✅ | hero marca + headline + CTA |
| P3.4 | ✅ | `CALENDLY_HREF` |
| P3.5 | ✅ | S/169 · S/279 · S/449 |
| P3.6 | ✅ | packs en landing |
| P3.7 | ✅ | no vende PD |
| P3.8 | ✅ | `npm run build` → route `/wavys-os` |
| P3.9 | ✅ | redirect PD → `/` |
| P4.1 | ✅ | README: wavys-os activa |
| P4.2 | ✅ | PD retirada (no paralela) |
| P4.3 | ✅ | `instructions.md` |
| P4.4 | ✅ | `growth-focus-phil.md` |
| P4.5 | ✅ | sucesora / reemplazo |
| P5.1 | ✅ | § Decisión CTA |
| P5.2 | ✅ | waitlist / self-serve no primarios ahora |
| P5.3 | ✅ | unlock = legal + Polar prod + DNS |
| P5.4 | ✅ | misma URL Calendly en campaña, mensajes, DEMO, landing |

## Hallazgos

Ningún crítico abierto.

## Acciones opcionales post-PASS

- [ ] Deploy `theros-website` main → verificar URL prod  
- [ ] Smoke visual mobile/desktop de `/wavys-os` en prod  

## Re-validación

- Intento #: 1 → **FAIL** (sin landing, sin DEMO-CONTRATO, CTA incompleto)  
- Intento #: 2 → **PASS**  
