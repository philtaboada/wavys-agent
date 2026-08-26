# Skill — Wavys OS Pack Brief Validator

Usar cuando Phil pida **validar briefs pack**, “revisa los briefs”, “¿están listos los PDFs de Tienda/Salón/Restaurante?”, o **antes de entregar** cualquier `Wavys-OS-Brief-*.pdf` de pack.

## Docs obligatorios

1. `data/wavys-os-campaign-brief/validador-brief-pack.md` — checks B1–B5  
2. HTMLs: `brief-tienda.html`, `brief-salon.html`, `brief-restaurante.html`  
3. CSS: `brief-pack-styles.css`  
4. Assets: `data/wavys-os-campaign-brief/assets/packs/`  
5. Precios fuente: `data/wavys-os-brief/precios-soles-finales.md`

## Protocolo

1. Leer el validador.  
2. Ejecutar **todos** los checks B1–B5 con evidencia (grep, paths, screenshots de `.page`).  
3. Veredicto: `PASS` | `FAIL` | `BLOCKED`.  
4. Escribir/actualizar `data/pipeline-runs/wavys-os-pack-brief-validation.md`.  
5. Si **FAIL:** frase obligatoria del validador + hallazgos; **no** declarar briefs listos ni abrir como entrega.  
6. Corregir gaps → regenerar PDFs → **re-validar**.  
7. Ante duda → FAIL.

## Imágenes

- Nuevas con `npm run tool -- generate_image` (solo `gemini-3.1-flash-lite-image`).  
- Recorte: `agent/context/image-cutout-pipeline.md` o crop con sharp a ratio del frame.  
- **Prohibido** reutilizar `phone-cutout.png` / `store-cutout.png` genéricos entre packs.

## Prohibido

- Entregar PDFs sin PASS  
- Aprobar con assets genéricos del kit compartidos entre verticales  
- Sustituir este gate por `wavys_os_campaign_validator` o `wavys_os_phase_validator`

## Relacionado

- Campaña: `agent/context/campaigns/wavys-os.md`  
- Kit: `data/wavys-os-campaign-brief/`  
- Generador: `generate-pack-briefs.ts`
