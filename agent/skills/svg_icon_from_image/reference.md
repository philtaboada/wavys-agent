# Referencia — Icon design / SVG (ampliado)

Complemento de `SKILL.md`. Leer solo si hace falta profundidad.

## Vocabulario visual (familia de íconos)

Un set debe compartir:

- Grosor de stroke (ej. 2 px a escala 24)
- Radio de esquina
- Cap: round | square | butt
- Join: round | miter | bevel
- Nivel de detalle homogéneo
- Safe area / padding

No mezclar un ícono ultra-minimal con otro hiperdetallado en el mismo sistema.

## Grid y safe area

Grids comunes: 16, 20, 24, 32, 48. UI: **24×24** es muy habitual.

El SVG puede ser 1000×1000; la grilla es **proporción**, no tamaño de archivo.

Dejar margen (safe area). El vacío también es forma.

## Bezier y nodos

- Preferir pocos nodos con handles largos y limpios
- Evitar densidades de puntos tipo “polyline disfrazada”
- Continuidad: C0 (tocan) → C1 (dirección) → C2 (curvatura); busca transiciones naturales
- Shapes (`circle`, `rect`, `ellipse`) > path único innecesario

## Booleanos y primitivas

Pensar en módulos:

- Nube = 3 círculos + rectángulo → union
- Operaciones: add, subtract, intersect, xor

Biblioteca reutilizable (puerta, rueda, lente…) acelera sets.

## Corrección óptica

- Cuadrado y círculo del “mismo” tamaño no pesan igual → ajustar
- Overshoot: curvas que cruzan ligeramente una baseline para verse alineadas
- Centro óptico ≠ centro matemático (mover si el peso visual lo pide)
- Stroke “igual” puede necesitar +0.2 óptico en zonas finas

## Color

1. Forma en B/N primero  
2. Luego 1–3 colores con relación (hue/sat/brightness)  
3. Probar en fondo claro y oscuro  

Monocromo / duotone suele bastar.

## Escala y variantes

Probar 512 → 256 → 128 → 64 → 48 → 32 → 24 → 16.

El detalle debe **depender del tamaño**:

| Tamaño | Qué conservar |
|--------|----------------|
| 128+ | Más rasgos secundarios |
| 24–32 | Identidad + 1–2 rasgos |
| 16 | Casi solo silueta |

## Tests adicionales

- **Blur:** ¿queda estructura o mancha?
- **Memoria:** ¿puedes redibujar el ícono de memoria?
- **Personalidad:** curvas vs ángulos cambian tono (amigable vs técnico)
- **Ritmo:** espacios entre ojos/elementos consistentes

## Limpieza y optimización SVG

Revisar: nodos duplicados, paths abiertos, transforms basura, IDs/metadatos, strokes inconsistentes, geometría redundante.

Objetivo: tan simple como sea posible **sin** perder identidad.

## Proceso profesional (mapa mental)

```
Referencia → Análisis → Silueta → Estilo/Grid/Peso
  → Formas grandes → Negativo → Curvas/Booleanos
  → Simplificar → Óptica → Color → Tests → Limpieza → Export
```

## Ejercicio de abstracción (entrenamiento)

Para un objeto: versiones con ~20, 10, 5, 3 formas, luego solo silueta. Comparar. El músculo clave es **abstracción visual**, no la herramienta.
