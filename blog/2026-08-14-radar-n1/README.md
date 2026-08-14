# RADAR N°1 — publicado

**Estado:** LOCK. Número del 10–14 de agosto de 2026. No se rediseña, no se reescribe, no se regenera la tapa.

Revista semanal de Wavys. Interior aprobado por Phil (Opus 5).

**Tapa:** PNG cyborg CUESTA LOCK (~2.1 MB, 1240×1754). Phil 14 ago 2026.
No regenerar la cara. Si hay que rearmar el PDF: `python3 assemble-pdf.py`.

## Archivos

| Archivo | Qué es |
|---|---|
| `tapa.png` | Portada LOCK cyborg CUESTA, 1240×1754 (~2.1 MB). No regenerar. |
| `radar-n1.pdf` | 11 páginas a 1240×1754, para WhatsApp / imprenta. |
| `index.html` | El número para leer en el navegador. |
| `email.html` | HTML para Resend. Pocas imágenes, no un dump de 10 páginas. |
| `pages/` | Interior HTML/CSS + PNG de export. Copia de `radar-n1/`. |

## Orden del PDF

1. `tapa.png` → `pages/export/01-tapa.png` (encajada a 1240×1754, sin recortar la cara)
2. `02-carta-del-editor`
3. `03-senal`
4. `04a-tema-central-apertura`
5. `04b-tema-central-relato`
6. `04c-tema-central-casos`
7. `04d-tema-central-cita-datos`
8. `04e-tema-central-reglas`
9. `05-mas-noticias`
10. `08-tablero-ia`
11. `09-contratapa`

No hay páginas 06 ni 07.

## Re-armar el PDF

```bash
python3 assemble-pdf.py
```

Usa img2pdf sobre los 11 PNG. Si falta un PNG de interior, corre el export de Chrome en `pages/export-page.sh`.

## Correo

`email.html` usa rutas relativas (`tapa.png`, `pages/img/…`). Para Resend hay que hospedar esas imágenes o incrustarlas. Las URLs del número van completas y reales. CTA: https://cal.com/wavys-call/30min
