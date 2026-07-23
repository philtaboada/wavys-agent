# Skill — Wavys OS Phase Validator

Usar cuando Phil (o el agente) **inicia o cierra** una fase del build de Wavys OS, o pide “valida la fase”, “gate de calidad”, “¿podemos pasar a la siguiente fase?”.

## Docs obligatorios (leer siempre)

1. `data/wavys-os-brief/validador-fases.md` — checklist y reglas FAIL  
2. `data/wavys-os-brief/plan-software-especifico.md` — DoD de la fase N  
3. Briefs citados en el plan para esa fase (schema, auth, etc.)

## Protocolo

1. Identificar fase N y momento (`inicio` | `cierre`).  
2. Ejecutar estándares globales §2 del validador + checklist de la fase.  
3. Recoger **evidencia** (paths, comandos typecheck/test, snippets).  
4. Veredicto: `PASS` | `FAIL` | `BLOCKED`.  
5. Escribir log: `data/pipeline-runs/wavys-os-phase-<N>-validation.md`.  
6. Si **FAIL:** responder con la frase obligatoria del validador, listar hallazgos, **no** empezar la siguiente fase.  
7. Si **PASS:** confirmar que se puede continuar a N+1.  
8. Estándar alto: ante duda → FAIL.

## Herramientas

- Terminal: typecheck, lint, test, migrate status  
- Subagente `explore` si hay duda de capas  
- `bugbot` solo si Phil lo pide explícitamente  

## Prohibido

- Aprobar sin mirar código  
- Avanzar fase con typecheck roto o fuga tenant  
- Sustituir este gate por `validate_pipeline` de landings/marketing  

## Relacionado

- Onboarding producto (chat): `agent/skills/wavys_os_onboarding/SKILL.md`  
- Brief índice: `data/wavys-os-brief/`
