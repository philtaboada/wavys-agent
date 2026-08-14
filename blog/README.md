# RADAR — blog de números

Cada número de **RADAR** (revista semanal de Wavys) vive en una carpeta acá.
No es el sitio SaaS ni el agente: es el archivo de la revista.

## Convención

```
blog/
  README.md
  YYYY-MM-DD-radar-nN/     # fecha del viernes de cierre
    README.md              # estado: publicado | borrador
    radar-nN.pdf           # PDF de imprenta / WhatsApp (solo si está publicado)
    index.html             # el número para leer en el navegador
    email.html             # HTML para Resend (no es un dump de las páginas)
    tapa.png               # portada LOCK de ese número
    pages/                 # HTML 1240×1754 + PNG de export + css/fonts/img/charts
```

Un número = **una carpeta**. No se mezclan semanas. No se reescribe un número ya publicado.

| Estado | Qué hay | Qué no hay |
|---|---|---|
| **Publicado** | PDF de 11 páginas, `index.html` de lectura, `email.html`, tapa LOCK, interiores copiados | Rediseño, copy nuevo, fotos regeneradas |
| **Borrador** | `index.html` andamio + README | Artículos inventados, tapa clonada, ranking inventado |

## Cómo se publica un número

1. El interior se maqueta en HTML/CSS a **1240 × 1754** (ver `radar-n1/` o `pages/` del número).
2. Se exportan PNG con Chrome headless (`pages/export-page.sh` o el script del interior).
3. La tapa llega **aprobada** (`tapa.png`). No se regenera la cara ni se redibuja el masthead. Si el PNG LOCK no está, se publica una placa tipográfica a 1240×1754 (sin cara) y se sustituye después.
4. Se arma el PDF: tapa + interiores, **11 páginas**, cada una 1240×1754.
5. Se escribe `index.html` (revista en la web) y `email.html` (Resend).
6. Se deja el slot del viernes siguiente como **borrador**, sin inventar la semana.

### PDF

Hipótesis de ensamblado (la que usamos en N°1): **img2pdf** de los PNG exportados + tapa ajustada.

```bash
# Desde la carpeta del número, después de tener tapa.png y pages/export/*.png
python3 -m img2pdf \
  --pagesize 1240x1754 \
  --imgsize 1240x1754 \
  pages/export/01-tapa.png \
  pages/export/02-carta-del-editor.png \
  pages/export/03-senal.png \
  pages/export/04a-tema-central-apertura.png \
  pages/export/04b-tema-central-relato.png \
  pages/export/04c-tema-central-casos.png \
  pages/export/04d-tema-central-cita-datos.png \
  pages/export/04e-tema-central-reglas.png \
  pages/export/05-mas-noticias.png \
  pages/export/08-tablero-ia.png \
  pages/export/09-contratapa.png \
  -o radar-n1.pdf
```

Si `tapa.png` no mide 1240×1754, se **encaja** (letterbox) sin recortar la cara. No se usa Pillow para quemar tipo sobre fotos.

Orden de páginas (N°1). No hay 06 ni 07; no se inventan:

1. tapa
2. 02-carta-del-editor
3. 03-senal
4. 04a-tema-central-apertura
5. 04b-tema-central-relato
6. 04c-tema-central-casos
7. 04d-tema-central-cita-datos
8. 04e-tema-central-reglas
9. 05-mas-noticias
10. 08-tablero-ia
11. 09-contratapa

### HTML de lectura (`index.html`)

Un solo documento. Tapa + secciones, copy del interior, tipografía de `radar.css`.
Es una revista en la web, no una landing.

### HTML de correo (`email.html`)

Segundo archivo, pensado para Resend: tablas, estilos inline, pocas imágenes bien puestas.
Rutas relativas a la carpeta del número. URLs reales. CTA: `https://cal.com/wavys-call/30min`.

## Números

| Carpeta | Número | Estado |
|---|---|---|
| [2026-08-14-radar-n1](./2026-08-14-radar-n1/) | N°1 · 10–14 ago 2026 | **Publicado** |
| [2026-08-21-radar-n2](./2026-08-21-radar-n2/) | N°2 · 17–21 ago 2026 | **Borrador de layout** — PDF para Phil, **no publicar** |
