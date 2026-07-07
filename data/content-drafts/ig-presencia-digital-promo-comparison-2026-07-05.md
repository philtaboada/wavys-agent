# Presencia Digital — Comparativa pipelines video

## HyperFrames v2 (editorial premium) — **VER ESTE**

**MP4:** `wavys-stories/videos/presencia-digital-promo/renders/presencia-digital-hyperframes-v2-2026-07-05.mp4`  
**55 s · 1080×1920 · 21.6 MB**

**Cambios v2 vs v1:**
- Sistema visual unificado: topbar `WAVYS · PRESENCIA` + capítulos 01–06 en todas las escenas
- Fotos campaña a pantalla completa (`slide-01-hero`, **`slide-04-fotos`**, `cover-tienda`, `slide-05-proceso`)
- Motion premium (power3/power4) — sin rebotes tipo cartoon ni emojis
- Narrativa conectada: problema → agencia tachada → solución verde → Presencia → Tienda → 12 meses → CTA
- Grain sutil + paleta landing (#082018, #EAF4EC, #16C684)
- UI carrito editorial (bordes 2px, mono) alineada a la landing

**v1 (descartar):** `presencia-digital-hyperframes-2026-07-05.mp4`

**Skills:** `heygen-com/hyperframes` → workflow `/product-launch-video`  
**Preset:** editorial-forest (colores landing capturados)  
**Imágenes:** slides campaña (`slide-01-hero`, `slide-04-fotos`, `cover-tienda`, `slide-05-proceso`, `slide-03-planes`) + screenshot landing + logo Wavys  
**Motion:** GSAP — kinetic type, stat slam, ken-burn, carrito pulse, timeline, crossfade entre escenas  
**Audio:** TTS Kokoro falló (sin HeyGen) — **video mudo**; añadir voz en CapCut o re-render con `HEYGEN_API_KEY`

**Proyecto editable:** `wavys-stories/videos/presencia-digital-promo/`  
Preview: `cd videos/presencia-digital-promo && npm run dev`

---

## Remotion (v1) — baseline

**MP4:** `wavys-stories/out/ig-presencia-digital-promo-2026-07-05.mp4`  
**55 s · 1080×1920 · 6.4 MB**

**Stack:** Remotion + GSAP manual en `PresenciaDigitalReel.tsx`  
**Imágenes:** 2 texturas Gemini + 1 screenshot + tipografía código  
**Audio:** mudo

---

## Caption IG (HyperFrames)

¿Vendes por WhatsApp pero en Google casi no te encuentran?

Presencia Digital: web profesional por suscripción — sin S/1.500+ de golpe.

✅ Presencia S/149/mes · landing + fotos · 5–7 días  
✅ Presencia Tienda S/229/mes · catálogo → WhatsApp · 0% comisión  
✅ 12 meses de servicio · después tú decides

👉 software.wavys-technologies.com/presencia-digital

T&C: 12 meses mínimo · activación S/450 / S/800 · contrato previo al pago.

#presenciadigital #pymes #Perú #wavys

---

## Qué pipeline gana (preliminar)

| Criterio | HyperFrames | Remotion |
|----------|-------------|----------|
| Fotos campaña reales | ✅ slides PDF/brief | ⚠️ parcial |
| Animaciones por beat | ✅ blueprints GSAP | ✅ manual |
| Edición no-code (Studio) | ✅ | ❌ |
| TTS + captions auto | ⚠️ requiere HeyGen | ❌ |
| Peso archivo | 20 MB | 6 MB |
| Velocidad iteración | Studio + HTML frames | Código TSX |

**Siguiente mejora HyperFrames:** voz (HeyGen o grabación Phil) + BGM + subtítulos karaoke.
