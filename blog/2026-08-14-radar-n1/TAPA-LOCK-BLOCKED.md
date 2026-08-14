# Tapa N°1 LOCK — bloqueada (esta corrida)

**Fecha:** 2026-08-14  
**Agente:** `bc-2d91ba2b-5b52-4ff6-958c-7504c29bcb8f` (Tapa RADAR N1 cyborg CUESTA)

## Qué se pidió

Sustituir la placa tipográfica en `tapa.png` (~242 KB) por el PNG LOCK cyborg CUESTA (Phil, ~2 MB, 1240×1754) adjunto al launch, reconstruir `radar-n1.pdf` página 1, y abrir PR.

## Qué pasó

El adjunto **no llegó como bytes** a esta VM. El sistema solo entregó una descripción de visión del cover (cara cyborg, masthead RADAR, punch DE PRONTO / CUESTA, teasers, 1240×1754).

Buscado sin éxito:

- `/opt/cursor/artifacts` (vacío)
- `/cursor/stores/self/artifacts` (vacío)
- `/tmp`, uploads, attachments, media caches
- historial git de `tapa.png` (solo existe el blob de 242485 B)
- transcripts de corridas previas (mismo fallo: descripción sin binario)

## Estado actual (sin inventar tapa)

| Archivo | Estado |
|---------|--------|
| `tapa.png` | Sigue siendo la **placa tipográfica** (~242 KB). No se tocó. |
| `pages/export/01-tapa.png` | Misma placa. |
| `radar-n1.pdf` | Página 1 = placa. Interiores intactos. |
| N°2 / copy / ranking / CUESTA wording | Sin cambios. |

**Prohibido en esta corrida (y cumplido):** regenerar con modelo de imagen, redibujar, Pillow/HTML compose, o sustituir con otro cover.

## Qué necesita Phil

1. Dejar el PNG LOCK real (~2 MB) en esta máquina, p. ej.:
   - `blog/2026-08-14-radar-n1/tapa.png`, o
   - `/opt/cursor/artifacts/tapa.png`
2. Re-lanzar el agente (o pedir que copie bytes → `tapa.png` + `pages/export/01-tapa.png` + `radar-n1/export/01-tapa.png` si aplica → `python3 assemble-pdf.py`).

Hecho cuando `tapa.png` pese ~2 MB (no ~242 KB) y la página 1 del PDF sea ese cover.
