#!/usr/bin/env bash
# Arranca Brave (Chromium) con CDP para browser-use CLI.
# Phil no tiene Google Chrome en /Applications; Brave sí.
set -euo pipefail

PORT="${BU_CDP_PORT:-9223}"
PROFILE="${BU_CDP_PROFILE:-$HOME/.config/browser-harness/brave-cdp-profile}"
PIDFILE="${PROFILE}/cdp.pid"
LOG="/tmp/browser-cdp-brave.log"
BRAVE="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
URL="http://127.0.0.1:${PORT}/json/version"

if [[ ! -x "$BRAVE" ]]; then
  echo "Error: Brave no encontrado en $BRAVE"
  echo "Alternativa: browser-use auth login  (cloud)"
  exit 1
fi

mkdir -p "$PROFILE"

# CDP ya responde
if curl -sf "$URL" >/dev/null 2>&1; then
  echo "CDP ya activo en puerto ${PORT}"
  echo "export BU_CDP_URL=http://127.0.0.1:${PORT}"
  exit 0
fi

# Matar instancia CDP previa huérfana
if [[ -f "$PIDFILE" ]]; then
  old_pid="$(cat "$PIDFILE" 2>/dev/null || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" 2>/dev/null; then
    kill "$old_pid" 2>/dev/null || true
    sleep 1
  fi
fi

nohup "$BRAVE" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE" \
  --no-first-run \
  --no-default-browser-check \
  "about:blank" \
  >>"$LOG" 2>&1 &
echo $! >"$PIDFILE"

for _ in $(seq 1 25); do
  if curl -sf "$URL" >/dev/null 2>&1; then
    echo "Brave CDP listo en puerto ${PORT} (pid $(cat "$PIDFILE"))"
    echo "export BU_CDP_URL=http://127.0.0.1:${PORT}"
    exit 0
  fi
  sleep 1
done

echo "Error: CDP no respondió. Ver $LOG"
exit 1
