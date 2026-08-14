# RADAR N°2 — BORRADOR

**No se publica.** Phil pidió ver el layout como PDF.

| | |
|---|---|
| Semana | 17–21 ago 2026 |
| Estado | **BORRADOR de layout** · no es el número cerrado |
| PDF | [`radar-n2-borrador.pdf`](./radar-n2-borrador.pdf) — 7 páginas, 1240×1754 |
| Tapa | [`tapa.png`](./tapa.png) — lock: chip llena el campo, masthead RADAR, punch OTRA VEZ / EXCEL |

## Páginas

| Archivo | Pág. | Grilla / voz |
|---|---|---|
| `01-tapa.html` → `tapa.png` | 01 | Lock. Objeto llena el campo. No se clona la cara cyborg del N°1. |
| `02-carta-del-editor.html` | 02 | Papel. Tipo ~90%. Punch **HOJA**. Primera persona, Lima, X → la hoja. |
| `03-senal.html` | 03 | Tinta. Tres notas, filetes, espina vertical. Sin foto, sin cards. |
| `04-apertura.html` | 04 | Type-first. La página es la hoja (celdas vacías). Titular sobre el corte. |
| `05-modulos.html` | 05 | Tres módulos desiguales, tres voces. Maps / Ficha / Agenda. |
| `08-data.html` | 08 | Un número a un metro: **21**. Tablero vacío a propósito. Sin ranking inventado. |
| `09-cierre.html` | 09 | Una palabra: **ABRE**. Cal + logo oficial. |

No hay 06 ni 07. No se inventaron.

## Qué no es este número

- No es el N°1 rediseñado.
- No toca páginas de `radar-n1/` ni de `blog/2026-08-14-radar-n1/`.
- No inventa noticias de la semana 17–21 (todavía no cierra).
- No inventa filas de Artificial Analysis ni precios en soles.
- Interiores type-first: no hubo `GEMINI_API_KEY` en este entorno; no se usó stock.

## Export

```bash
bash blog/2026-08-21-radar-n2/export-page.sh
python3 blog/2026-08-21-radar-n2/assemble-pdf.py
```

Sistema compartido: `css/radar.css` + `fonts/` (copia del N°1). Folio: **N°2 · BORRADOR · 17–21 AGO 2026**.
