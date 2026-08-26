#!/usr/bin/env bash
# RADAR N°2 — descarga las webfonts a radar-n2/fonts/ y escribe fonts/fonts.css.
# Self-hosted a propósito: el export con Chrome headless no debe depender de red.
#
#   bash radar-n2/scripts/fetch-fonts.sh
#
# Ninguna familia se repite del N°1 (Archivo / Fraunces / Playfair / Spectral /
# Zilla Slab / IBM Plex Mono). El N°2 tiene otra voz:
#   Martian Mono          mono ancho variable — masthead RADAR, etiquetas, folios
#   Bodoni Moda           didone variable — palabra 70 (BUZÓN, vacía, silla)
#   Instrument Sans       grotesca variable — decks, why it matters, cifras
#   Newsreader            serif de lectura variable — carta y cuerpo del tema
#   Instrument Serif      serif display + cursiva — pull quotes y firma
#   Bricolage Grotesque   grotesca ancha variable — voz de "más notas"
#   JetBrains Mono        mono de datos — tablero, fechas, URLs

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FONTS="$DIR/fonts"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

mkdir -p "$FONTS"
: > "$FONTS/fonts.css"

declare -a QUERIES=(
  "Martian+Mono:wdth,wght@75..112.5,100..800"
  "Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900"
  "Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700"
  "Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800"
  "Instrument+Serif:ital@0;1"
  "Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800"
  "JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400"
)

for q in "${QUERIES[@]}"; do
  name="${q%%:*}"
  echo "→ $name"
  css=$(curl -sS --compressed -A "$UA" "https://fonts.googleapis.com/css2?family=${q}&display=block")
  while read -r url; do
    [ -z "$url" ] && continue
    file="$(basename "${url%%\?*}")"
    if [ ! -f "$FONTS/$file" ]; then
      curl -sS -A "$UA" "$url" -o "$FONTS/$file"
    fi
    css="${css//$url/$file}"
  done <<< "$(printf '%s' "$css" | grep -o 'https://fonts.gstatic.com/[^)]*\.woff2' | sort -u)"
  printf '/* %s */\n%s\n\n' "$name" "$css" >> "$FONTS/fonts.css"
done

echo
echo "woff2 descargados: $(ls -1 "$FONTS"/*.woff2 | wc -l)"
du -sh "$FONTS"
