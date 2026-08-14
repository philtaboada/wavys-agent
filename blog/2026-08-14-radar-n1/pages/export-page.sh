#!/usr/bin/env bash
# RADAR N°1 — export de páginas a PNG 1240×1754 con Chrome headless.
#
#   bash radar-n1/export-page.sh                 # exporta todas las páginas
#   bash radar-n1/export-page.sh 04a-main-apertura.html
#   CHROME=chromium bash radar-n1/export-page.sh 09-contratapa.html
#
# Los PNG salen en radar-n1/export/ con el mismo nombre de la página.

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$DIR/export"
CHROME="${CHROME:-google-chrome}"
command -v "$CHROME" >/dev/null 2>&1 || CHROME=google-chrome-stable

mkdir -p "$OUT"

if [ "$#" -gt 0 ]; then
  PAGES=("$@")
else
  PAGES=()
  while IFS= read -r f; do PAGES+=("$(basename "$f")"); done < <(ls "$DIR"/*.html | sort)
fi

for page in "${PAGES[@]}"; do
  name="$(basename "$page" .html)"
  # timeout: Chrome headless a veces no cierra solo después de escribir el PNG.
  timeout 90 "$CHROME" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --default-background-color=00000000 \
    --window-size=1240,1754 \
    --screenshot="$OUT/$name.png" \
    "file://$DIR/$name.html" >/dev/null 2>&1 || true
  size=$(node -e '
    const fs=require("fs");const b=fs.readFileSync(process.argv[1]);
    console.log(b.readUInt32BE(16)+"x"+b.readUInt32BE(20));
  ' "$OUT/$name.png" 2>/dev/null || echo "?")
  echo "$name.png  $size"
done
