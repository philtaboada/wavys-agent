# Figma — Posts (social content)

Archivo **fuente de verdad** para diseño de posts Wavys. El agente debe leer este file antes de crear contenido visual.

## Archivo

| Campo | Valor |
|-------|--------|
| Nombre | **Posts** |
| File key | `59V65PuX0A872JOibvhh11` |
| URL | https://www.figma.com/design/59V65PuX0A872JOibvhh11/Posts |
| Página agente | **Agente** — guía viva, mes actual, templates |
| Guía escrita | `agent/context/wavys-visual-brand-guide.md` |

## Estado conexión

- [x] MCP Figma conectado
- [x] Acceso verificado al file *Posts*
- [x] Página **Agente** + guía `wavys-visual-brand-guide.md`

## Formatos en el file

| Tipo | Dimensiones | Ejemplos en Figma |
|------|-------------|-----------------|
| Instagram feed | 1080 × 1350 | `Instagram post - 3` … `- 17` |
| Facebook / LinkedIn | 1080 × 1080 | `Facebook post`, `Post … FB Y Linkedin` |
| Instagram Story | 1080 × 1920 | `Instagram story - 1` … |
| Pieza ventas (cuadrado) | 1080 × 1080 | `Pieza de ventas` |

## Design system (extraído de Figma)

### Tipografía

| Rol | Fuente | Peso | Tamaños típicos |
|-----|--------|------|-----------------|
| Headline principal | **Rubik** | SemiBold | 52px, tracking -0.52px |
| Subtítulo / bloque | Rubik | Medium | 40px, tracking -0.4px |
| Destacado gradiente | Rubik | SemiBold | 48px (“Agentes de IA”) |
| Bullets / cuerpo | Rubik | Medium | 32px, tracking -0.32px |
| CTA botón | Rubik | SemiBold | 32px, negro sobre gradiente |

### Colores

| Token | Hex / valor | Uso |
|-------|-------------|-----|
| Fondo exterior | gradient `#5ad2d0` → `#01fd91` | Borde / fondo del canvas |
| Card oscura | `#000908` | Contenedor principal, tabs |
| Texto claro | `#fdfdfd` / white | Copy sobre negro |
| Acento gradiente texto | `#01fd91` → `#5ad2d0` | “Agentes de IA”, highlights |
| CTA gradiente | `#5ad2d0` → `#01fd91` | Botón “Demo gratuita” |
| CTA texto | black | Sobre botón gradiente |

### Layout recurrente

- Card negra con **border-radius 30px** (contenedor) y **26px** (tabs, botón)
- **Logo Wavys** arriba derecha
- **Elemento 3D** (engranaje / tech) a la derecha, rotado ~-40°
- Lista con emojis + bullets triangulares verdes
- CTA abajo: “Demo gratuita | Escríbenos” (adaptar CTA por canal)

### Tono copy (alineado con posts existentes)

- Pregunta hook → beneficio IA → bullets concretos → CTA
- Español LatAm, B2B, WhatsApp / automatización / eficiencia
- Ver `agent/context/brand-channels.md` para CTA por canal

## Workflow del agente

1. **Leer Figma** — `get_metadata` / `get_design_context` del frame más cercano al canal y tema
2. **Copy** — borrador texto; Phil aprueba antes de publicar
3. **Visual** — opciones:
   - Duplicar/adaptar frame en Figma (MCP `use_figma`) si Phil quiere en canvas
   - Generar asset con `generate_image` (Gemini) respetando paleta y estilo
   - Remotion/remocn para video repurpose (TikTok/Reels)
4. **No publicar** sin OK explícito de Phil

## Frames de referencia

| Frame | Node ID | Uso |
|-------|---------|-----|
| Pieza de ventas | `1:5` | Template ventas / WhatsApp / IA |
| Instagram post - 3 | `5:12` | “¿Qué es Wavys?” |
| Instagram post - 6 | `5:45` | “Lleva la IA a tu negocio” |
| Post FB + LinkedIn | `165:137` | Formato dual 1080² |

## Herramientas relacionadas

- Figma MCP — diseño fuente
- `generate_image` — assets nuevos (Gemini lite)
- remocn — video social (`agent/context/remocn-video-ecosystem.md`)
