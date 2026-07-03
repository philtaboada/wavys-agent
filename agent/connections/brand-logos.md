# Logos Wavys — assets oficiales

Fuente entregada por Phil en **`wavys-agents/assest/`** (export Figma).

**Obsoleto — no usar:** `new-logo.svg`, `wavys-logo.svg`, `logo.png` (“WAVYS TECHNOLOGY”), ni los PNG viejos de `theros-front/public/icons/` salvo que Phil diga lo contrario.

## Archivos canónicos

Ruta: `data/brand-assets/logos/`

| Archivo | Origen | Uso |
|---------|--------|-----|
| `isotipo.png` | `assest/Group 2.png` | Solo icono verde `#01FD91` → `#5AD2D0` |
| `logo-wavys-technologies.png` | `assest/Group 15.png` | Lockup **Wavys Technologies** — texto blanco, fondos oscuros |
| `logo-wavys-education.png` | `assest/Group 30.png` | Lockup **Wavys Education** — texto oscuro, fondos claros |

## Cuándo usar cada uno

| Contexto | Asset |
|----------|--------|
| Story / video / posts Agente (fondo `#070604`) | `logo-wavys-technologies.png` |
| Solo icono (watermark, favicon-like) | `isotipo.png` |
| Línea Education | `logo-wavys-education.png` |

## Video (Remotion)

- Componente: `wavys-stories/src/components/WavysLogoLockup.tsx` → `WavysLogo`
- Copias en: `wavys-stories/public/assets/`

```tsx
<WavysLogo variant="technologies" startFrame={360} width={500} />
```

## Actualizar desde Figma

1. Phil exporta a `wavys-agents/assest/`
2. Copiar a `data/brand-assets/logos/` (nombres arriba)
3. Sincronizar `wavys-stories/public/assets/`
4. Re-render si aplica
