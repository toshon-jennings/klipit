#!/bin/sh
# Regenerate the Chrome Web Store images in store/ from store/src/*.html.
# Needs: the repo root served on :8777 (python3 -m http.server 8777), Google Chrome,
# ImageMagick (to flatten alpha), and network access for the sample favicons.
# Usage: store/render.sh [name ...]   e.g. store/render.sh screenshot-2-graph
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="${BASE:-http://localhost:8777/store/src}"
curl -sf -o /dev/null "$BASE/shot.html" || { echo "Serve the repo root on :8777 first." >&2; exit 1; }

# name  page  css-width css-height  device-scale
JOBS="screenshot-1-capture   shot.html?n=1        1024 640 1.25
screenshot-2-graph     shot.html?n=2        1024 640 1.25
screenshot-3-groups    shot.html?n=3        1024 640 1.25
screenshot-4-selection shot.html?n=4        1024 640 1.25
screenshot-5-local     shot.html?n=5        1024 640 1.25
promo-small            promo-small.html     440  280 1
promo-marquee          promo-marquee.html   1400 560 1"

echo "$JOBS" | while read -r name page w h scale; do
  [ $# -gt 0 ] && ! echo " $* " | grep -q " $name " && continue
  profile=$(mktemp -d)
  "$CHROME" --headless --user-data-dir="$profile" --hide-scrollbars \
    --force-device-scale-factor="$scale" --window-size="$w,$h" \
    --blink-settings=preferredColorScheme=1 --force-prefers-reduced-motion \
    --virtual-time-budget=30000 --screenshot="$name.png" "$BASE/$page" 2>/dev/null
  rm -rf "$profile"
  magick "$name.png" -background '#17544c' -alpha remove -alpha off "PNG24:$name.png"
  echo "$name.png $(sips -g pixelWidth -g pixelHeight -g hasAlpha "$name.png" | tail -3 | awk '{printf "%s ", $2}')"
done
