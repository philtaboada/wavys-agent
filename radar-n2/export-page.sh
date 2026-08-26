#!/usr/bin/env bash
# RADAR N°2 — export de páginas a PNG 1240×1754 con Chrome headless.
#
#   bash radar-n2/export-page.sh                 # exporta todas las páginas
#   bash radar-n2/export-page.sh 04a-tema-central-apertura.html
#   CHROME="/ruta/a/chrome" bash radar-n2/export-page.sh 09-contratapa.html
#
# Los PNG salen en radar-n2/export/ con el mismo nombre de la página.
# El comando que corre por dentro es el pedido:
#   chrome --headless=new --disable-gpu --hide-scrollbars \
#          --window-size=1240,1754 --screenshot=OUT.png file://PAGE.html

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$DIR/export"

# Busca un Chrome de la familia Chromium. En esta Mac no hay Chrome instalado en
# /Applications, así que cae al Chrome for Testing que trae Playwright.
pick_chrome() {
  if [ -n "${CHROME:-}" ] && [ -x "$CHROME" ]; then echo "$CHROME"; return; fi
  if [ -n "${CHROME:-}" ] && command -v "$CHROME" >/dev/null 2>&1; then command -v "$CHROME"; return; fi
  for c in google-chrome google-chrome-stable chromium chromium-browser; do
    if command -v "$c" >/dev/null 2>&1; then command -v "$c"; return; fi
  done
  for p in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "$HOME/Library/Caches/ms-playwright"/chromium-*/chrome-mac-arm64/"Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" \
    "$HOME/Library/Caches/ms-playwright"/chromium-*/chrome-mac/"Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" \
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"; do
    [ -x "$p" ] && { echo "$p"; return; }
  done
  echo "No encontré un Chrome headless. Exporta CHROME=/ruta/al/binario." >&2
  exit 1
}

BIN="$(pick_chrome)"
mkdir -p "$OUT"
PROFILE="$(mktemp -d "${TMPDIR:-/tmp}/radar-n2-chrome.XXXXXX")"
trap 'rm -rf "$PROFILE"' EXIT
echo "chrome: $BIN"

if [ "$#" -gt 0 ]; then
  PAGES=("$@")
else
  PAGES=()
  while IFS= read -r f; do PAGES+=("$(basename "$f")"); done < <(ls "$DIR"/*.html | sort)
fi

for page in "${PAGES[@]}"; do
  name="$(basename "$page" .html)"
  rm -f "$OUT/$name.png"
  # Chrome headless no siempre cierra solo después de escribir el PNG y macOS no
  # trae `timeout`: se lanza en background y se corta en cuanto el archivo dejó
  # de crecer (o a los 45 s, como red de seguridad).
  # --password-store=basic + --use-mock-keychain: sin esto Chrome for Testing
  # abre el diálogo del llavero de macOS y el export se queda esperando.
  # El perfil va a un temporal para no tocar nada del Chrome del usuario.
  "$BIN" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --user-data-dir="$PROFILE" \
    --password-store=basic \
    --use-mock-keychain \
    --no-first-run \
    --no-default-browser-check \
    --disable-extensions \
    --disable-sync \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --default-background-color=00000000 \
    --window-size=1240,1754 \
    --screenshot="$OUT/$name.png" \
    "file://$DIR/$name.html" >/dev/null 2>&1 &
  pid=$!

  prev=-1
  for _ in $(seq 1 90); do
    kill -0 "$pid" 2>/dev/null || break
    if [ -f "$OUT/$name.png" ]; then
      cur=$(wc -c < "$OUT/$name.png" | tr -d ' ')
      # Dos lecturas iguales y no vacías: el PNG ya terminó de escribirse.
      if [ "$cur" = "$prev" ] && [ "$cur" -gt 1000 ]; then break; fi
      prev="$cur"
    fi
    sleep 0.5
  done
  kill -9 "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true

  size=$(node -e '
    const fs=require("fs");const b=fs.readFileSync(process.argv[1]);
    console.log(b.readUInt32BE(16)+"x"+b.readUInt32BE(20));
  ' "$OUT/$name.png" 2>/dev/null || echo "?")
  echo "$name.png  $size"
done
