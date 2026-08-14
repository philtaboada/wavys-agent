#!/usr/bin/env bash
# RADAR N°2 — export 1240×1754 con Chrome headless.
#   bash export-page.sh
#   bash export-page.sh 02-carta-del-editor.html

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$DIR/export"
CHROME="${CHROME:-google-chrome}"
command -v "$CHROME" >/dev/null 2>&1 || CHROME=google-chrome-stable

mkdir -p "$OUT"

if [ "$#" -gt 0 ]; then
  PAGES=("$@")
else
  PAGES=(
    01-tapa.html
    02-carta-del-editor.html
    03-senal.html
    04-apertura.html
    05-modulos.html
    08-data.html
    09-cierre.html
  )
fi

for page in "${PAGES[@]}"; do
  name="$(basename "$page" .html)"
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
