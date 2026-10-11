#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${FAMILY_STORY_VAULT_PORT:-4314}"
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser)"
mkdir -p screenshots dist
if [[ ! -f dist/family-story-vault.html ]]; then python3 build.py; fi
if ! ss -ltn | grep -q "127.0.0.1:$PORT "; then
  nohup python3 server.py > /tmp/family-story-vault-$PORT.log 2>&1 &
  sleep 1
fi
shot() {
  local url="$1" out="$2" size="$3"; shift 3 || true
  local prof; prof="$(mktemp -d /tmp/fsvshot.XXXX)"
  timeout 25 "$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --run-all-compositor-stages-before-draw --virtual-time-budget=28000 \
    --window-size="$size" --user-data-dir="$prof" --screenshot="$out" "$@" "$url" >/dev/null 2>&1
  rm -rf "$prof"; echo "  $out ($(wc -c < "$out") bytes)"
}
U="http://127.0.0.1:$PORT"
shot "file://$PWD/dist/family-story-vault.html#stories" screenshots/00-best-home.png 1440,1100
shot "$U/#stories" screenshots/00-desktop-stories.png 1440,1000
shot "$U/#timeline" screenshots/01-timeline.png 1440,1100
shot "$U/#tree" screenshots/02-tree.png 1440,1100
shot "$U/#tell" screenshots/03-tell.png 1440,1100
shot "$U/#about" screenshots/04-about.png 1440,1000
shot "$U/#stories" screenshots/05-phone.png 390,844 --user-agent="Mozilla/5.0 (iPhone)"
echo "screenshots done"
