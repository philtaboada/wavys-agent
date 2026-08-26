#!/usr/bin/env bash
# Genera los assets de marca de Content Studio con Gemini (Nano Banana).
# Tokens: agent/context/wavys-visual-brand-guide.md §2.1 y plantilla de prompt §5.
set -u

OUT="/Volumes/mac externo/Mac Externo/projects/content-studio/public/brand"
BASE="Style: dark premium tech #070604 base, aurora gradient teal #5AD2D0 to neon green #01FD91, glassmorphism glow, subtle grain, cinematic lighting, 3D translucent glass elements. No text, no letters, no logos, no watermarks, no UI screenshots. High-end B2B SaaS LatAm aesthetic, bold and modern, not stock photo."

gen() {
  local name="$1" ratio="$2" prompt="$3"
  echo "==> generating $name ($ratio)"
  npm run --silent tool -- generate_image "$(node -e '
    const [prompt, aspectRatio, outputPath] = process.argv.slice(1);
    process.stdout.write(JSON.stringify({ prompt, aspectRatio, outputPath }));
  ' "$prompt" "$ratio" "$OUT/$name")" || echo "!! failed: $name"
}

gen "auth-aurora.jpg" "3:4" \
  "Creative vertical background asset for a content creation studio app. $BASE Subject: flowing translucent glass wave ribbons rising from the bottom, soft aurora bloom, floating light particles. Mood: focused creative flow. Leave negative space in the center for typography overlay."

gen "hero-dashboard.jpg" "16:9" \
  "Creative wide banner background asset for an editorial content pipeline dashboard. $BASE Subject: abstract horizontal flow of connected glass panels and light trails moving left to right, like a production pipeline, depth of field. Mood: momentum and clarity. Leave negative space on the left for a headline overlay."

gen "empty-ideas.jpg" "1:1" \
  "Isolated 3D object render on dark background. $BASE Subject: a single translucent glass lightbulb with neon green glow inside, floating, soft reflections, centered composition, generous dark negative space around it. Mood: spark of an idea."

gen "empty-content.jpg" "1:1" \
  "Isolated 3D object render on dark background. $BASE Subject: a stack of floating translucent glass document sheets with neon green edge lighting, slight rotation, centered composition, generous dark negative space around it. Mood: writing and drafting."

gen "empty-assets.jpg" "1:1" \
  "Isolated 3D object render on dark background. $BASE Subject: floating translucent glass layered folder and media shapes with neon green rim light, centered composition, generous dark negative space around it. Mood: organized media library."

echo "==> done"
ls -la "$OUT"
