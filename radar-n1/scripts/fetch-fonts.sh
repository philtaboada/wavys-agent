#!/usr/bin/env bash
# RADAR N°1 — descarga las webfonts a radar-n1/fonts/ y escribe fonts/fonts.css.
# Self-hosted a propósito: el export con Chrome headless no debe depender de red.
#
#   bash radar-n1/scripts/fetch-fonts.sh
#
# Familias y para qué sirven en la revista:
#   Archivo            grotesca variable (wght + wdth) — masthead, titulares, folios, labels
#   Fraunces           serif display variable — palabra golpe (70) y contratapa
#   Playfair Display   serif italic — voz "nota B" y notas en cursiva
#   Spectral           serif de lectura — carta del editor y cuerpo del tema central
#   Zilla Slab         slab tipo bookman — nota de negocio (05b)
#   IBM Plex Mono      mono — tablero de datos (08)

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FONTS="$DIR/fonts"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

mkdir -p "$FONTS"
: > "$FONTS/fonts.css"

declare -a QUERIES=(
  "Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900"
  "Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1"
  "Playfair+Display:ital,wght@0,400..900;1,400..900"
  "Spectral:ital,wght@0,300;0,400;0,600;0,800;1,300;1,400;1,600"
  "Zilla+Slab:ital,wght@0,400;0,600;0,700;1,400;1,600"
  "IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400"
)

for q in "${QUERIES[@]}"; do
  name="${q%%:*}"
  echo "→ $name"
  css=$(curl -sS --compressed -A "$UA" "https://fonts.googleapis.com/css2?family=${q}&display=block")
  # Descarga cada woff2 y reescribe la url a la ruta local.
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
