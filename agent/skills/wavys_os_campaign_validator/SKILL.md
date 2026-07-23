# Skill — Wavys OS Campaign Validator

Usar cuando Phil (o el agente) pida **validar la campaña** Wavys OS, “gate GTM”, “¿está lista la campaña?”, o antes/después de tocar kit/landing/CTA.

## Docs obligatorios

1. `data/wavys-os-campaign-brief/validador-campana.md` — checklist P1–P5  
2. `agent/context/campaigns/wavys-os.md`  
3. Kit `data/wavys-os-campaign-brief/`  
4. Landing en repo `theros-website` → `app/wavys-os/`

## Protocolo

1. Leer validador.  
2. Ejecutar **todos** los checks P1–P5 con evidencia (path, grep, comando).  
3. Veredicto: `PASS` | `FAIL` | `BLOCKED`.  
4. Escribir/actualizar `data/pipeline-runs/wavys-os-campaign-validation.md`.  
5. Si **FAIL:** frase obligatoria del validador + lista de hallazgos; **no** declarar campaña cerrada.  
6. Si Phil pide completar gaps → corregir y **re-validar**.  
7. Ante duda → FAIL.

## Prohibido

- Aprobar sin mirar `theros-website`  
- Tratar Presencia Digital como campaña paralela activa  
- Sustituir este gate por el validador de fases de código (`wavys_os_phase_validator`)

## Relacionado

- Campaña: `agent/context/campaigns/wavys-os.md`  
- Build producto: `agent/skills/wavys_os_phase_validator/SKILL.md`  
- Onboarding: `agent/skills/wavys_os_onboarding/SKILL.md`
