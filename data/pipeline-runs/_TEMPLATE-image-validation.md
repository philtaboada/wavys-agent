# Validación Gate 1+ — <asset-id> (imagen)

Pipeline padre: `<one_call_landing | video_production | social_design | presencia_brief | …>`  
Asset ID: `<asset-id>`  
Fecha: YYYY-MM-DD

---

## `image_generation` — JPG Gemini

| ID | ✅/❌ | Valor medido | Notas |
|----|-------|--------------|-------|
| IG-01 | | cwd: wavys-agents | |
| IG-02 | | | |
| IG-03 | | model: | |
| IG-04 | | ok: | |
| IG-05 | | path: | |
| IG-06 | | mime/ext: | |
| IG-07 | | bytes: | |
| IG-08 | | aspect: | |
| IG-09 | | prompt OK: | |
| IG-10 | | guía leída: | |
| IG-11 | | destino final: | |
| IG-12 | | referenciado en: | |
| IG-13 | | N/A o ref path: | |
| IG-14 | | N/A o fondo plano: | |
| IG-15 | | N/A | |
| IG-16 | | | |

### Comando ejecutado

```bash
cd "/Volumes/mac externo/Mac Externo/projects/wavys-agents"
npm run tool -- generate_image '{...}'
```

### JSON tool (pegar)

```json

```

---

## `image_cutout` — PNG (solo si rol = cutout)

| ID | ✅/❌ | Valor medido | Notas |
|----|-------|--------------|-------|
| IC-01 | | rol documentado: | |
| IC-02 | | base jpg: | |
| IC-03 | | IG critical OK: | |
| IC-04 | | cutout png: | |
| IC-05 | | hasAlpha: | |
| IC-06 | | | |
| IC-07 | | método: | |
| IC-08 | | compuesto en: | |
| IC-09 | | halo OK: | |
| IC-10 | | sujeto OK: | |
| IC-11 | | contraste OK: | |
| IC-12 | | N/A o ASSET-PLAN: | |
| IC-13 | | N/A o fallback: | |

**Sección cutout:** ☐ Aplica ☐ No aplica (full-bleed / background)

---

## Loops

| Intento | ID | Tier | Pipeline | Acción |
|---------|-----|------|----------|--------|
| 1 | | | | |

## Resumen

- **Solo JPG:** CRITICAL IG-* todos ✅ + ≥95% HIGH
- **Con cutout:** lo anterior + CRITICAL IC-* todos ✅ + ≥95% HIGH IC

**Asset autorizado:** ☐ Sí ☐ No — fecha:
