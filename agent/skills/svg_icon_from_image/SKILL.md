---
name: svg-icon-from-image
description: >-
  Convierte una imagen/foto en un ícono SVG profesional por abstracción visual
  (identidad → silueta → formas mínimas), nunca por auto-trace. Usar cuando el
  usuario pida SVG, ícono vectorial, iconizar una foto, simplificar a silueta,
  o crear un icon desde imagen/referencia en Affinity u otro editor vectorial.
---

# Skill — De imagen a ícono SVG profesional

## Principio (no negociable)

Un buen ícono **no reproduce la foto**. Representa **lo mínimo** que hace que el cerebro reconozca el objeto.

```
MALO:  foto → auto-trace / miles de curvas / texturas → "SVG técnico"
BUENO: foto → observar → identidad → silueta → abstracción → pocas formas → SVG limpio
```

**Prohibido** como primer paso: auto-tracing, copiar texturas, pelo, arrugas, reflejos, sombras fotográficas, o dibujar ojos/detalles antes de la silueta.

---

## Cuándo aplicar

- “Haz un SVG / ícono de esta imagen”
- “Simplifica / iconiza esta foto”
- Trabajo en Affinity MCP creando vectores desde referencia
- Colección de íconos con lenguaje visual consistente

---

## Antes de dibujar (obligatorio)

Completa este bloque **en el chat** (o mentalmente si Phil pide “solo hazlo”) **antes** de crear geometría:

```markdown
## Análisis semántico
- Objeto:
- Identidad (3–6 rasgos que lo hacen reconocible):
- Silueta OK en negro? (sí/no + por qué):
- Características secundarias (opcionales):
- Ruido a eliminar (textura, sombra, detalle fino…):
- Estilo elegido: filled | outline | duotone | geometric | organic
- Grid / canvas: (ej. 24 conceptual → 1000px doc)
- Jerarquía 80/20 (qué 20% da el 80% del reconocimiento):
```

### Niveles de información

| Nivel | Qué es | Ícono pequeño | Ilustración |
|-------|--------|---------------|-------------|
| 1 Identidad | Silueta / rasgos semánticos | Máximo | Máximo |
| 2 Características | Ojos, asa, lente… | Pocas | Más |
| 3 Detalles | Costuras, botones… | Casi 0 | Algunos |
| 4 Decoración | Textura, reflejos… | **0** | Opcional |

Para ícono: **Nivel 1 completo · Nivel 2 selectivo · Nivel 3–4 = 0**.

---

## Pipeline de ejecución (orden fijo)

```
01 Referencia
02 Análisis semántico          ← bloque de arriba
03 Silueta negra (test mental o preview filled)
04 Definir estilo + grid + peso
05 Formas grandes (primitivas)
06 Espacio negativo
07 Características 80/20
08 Simplificar otra vez
09 Corrección óptica (centro, overshoot, peso)
10 Color (después de que la forma funcione)
11 Tests (silueta / tamaño / reconocimiento)
12 Limpieza vectorial
13 Export SVG solo si Phil lo pide
```

Nunca saltar de 01 → geometría detallada.

### Orden de construcción

1. Silueta / masas grandes  
2. Formas principales  
3. Formas secundarias  
4. Detalles (solo si el tamaño lo permite)  
5. Microdetalles (casi nunca en ícono)

**Nunca** empezar por ojos, bigotes, arrugas o textura.

---

## Cómo decidir qué dibujar

Pregunta clave: *¿Qué rasgos hacen decir “eso es un X”?*

| Objeto | Identidad (ejemplos) | Eliminar |
|--------|----------------------|----------|
| Elefante (frente) | Orejas grandes, trompa, colmillos | Arrugas, venas, uñas, piel |
| Gato | Orejas puntiagudas, cabeza, cola/postura | Pelo, bigotes finos, textura |
| Bici | Dos ruedas + cuadro + manillar | Tornillos, cadena completa, reflejos |
| Cámara | Cuerpo + lente circular | Tornillos, textura, botones |
| Taza | Cilindro + asa + borde | Reflejos, marca, imperfecciones |

**Test de silueta:** relleno negro. Si no se reconoce → arreglar silueta, no añadir detalle.

**Test 80/20:** el 80% del reconocimiento suele venir de ~20% de rasgos. Esos van primero y más grandes.

---

## Estilo y sistema visual

Decide **antes** de construir (no mezclar estilos en la misma pieza):

| Estilo | Uso |
|--------|-----|
| **Filled** | Íconos UI pequeños, máximo reconocimiento |
| **Outline** | Sistemas elegantes; más control de stroke |
| **Duotone** | Forma + acento |
| **Geometric** | Círculos/rectángulos/booleanos (design systems) |
| **Organic** | Animales, comida; curvas suaves, pocos nodos |

Si hay varios íconos, fijar: grid (24), stroke, cap/join, corner radius, padding/safe area, nivel de detalle.

---

## Construcción vectorial (reglas IA)

1. **Primitivas primero:** círculo + rectángulo + boolean > path de 50 nodos.  
2. **Mínimo de nodos** en Beziers; 2–3 puntos buenos > 20 malos.  
3. **Simetría** como base; romper solo por corrección óptica intencional.  
4. **Safe area:** no pegar al borde del canvas.  
5. **Espacio negativo** es forma (asa de taza, hueco de lente).  
6. **Relaciones, no píxeles sueltos:** proporciones (cabeza=1, orejas=0.35…).  
7. **Color al final:** primero B/N o un fill sólido.  
8. **Contraste:** colmillos/ojos deben leerse sobre el fill (no crema sobre crema).

### Corrección óptica (checklist corto)

- ¿Se siente centrado (centro óptico ≠ matemático)?  
- ¿Círculos/curvas necesitan overshoot respecto a líneas?  
- ¿Alguna parte pesa demasiado y desequilibra?

---

## Tests antes de dar por bueno

Ejecutar en orden:

1. **Silueta negra** — ¿se reconoce?  
2. **Blur / distancia** — ¿queda masa clara?  
3. **Tamaño** — mirar mentalmente a 64 → 32 → 24 → 16  
4. **Reconocimiento** — ¿se nombra el objeto correcto (no “animal genérico”)?  
5. **Categoría** — ¿no se confunde con otro (perro↔zorro)?  
6. **Limpieza** — sin nodos basura, strokes inconsistentes, capas decorativas

Si falla 1–4 → **simplificar o rehacer silueta**, no añadir detalle.

---

## Herramientas en este repo

### Affinity MCP (preferido para editar en app)

1. Leer `agent/connections/affinity.md`  
2. `affinity_status` → reachable  
3. `read_sdk_documentation_topic` con `preamble` antes de `execute_script`  
4. Crear con `Shape` / `PolyCurve` / `CurveBuilder` (pocas formas)  
5. `render_spread` para validar  
6. **Export SVG solo si Phil lo pide** (`FileExportOptions` preset `SVG (for export)`, Desktop)

### SVG en archivo

Si Phil pide archivo `.svg` sin Affinity: escribir SVG limpio (shapes/`path` mínimos, sin metadatos basura) en la ruta que indique.

---

## Anti-patrones (fallos típicos de IA)

| Malo | Por qué falla |
|------|----------------|
| Trace / muchas curvas de la foto | Es foto en formato vector, no ícono |
| Demasiados detalles “porque están en la imagen” | Ruido ≠ identidad |
| Colmillos/ojos del mismo tono que el fondo | Pierde jerarquía 80/20 |
| Empezar por microdetalle | Silueta rota → rehacer todo |
| Mezclar filled hiperdetallado + outline minimal en un set | Sin visual vocabulary |
| Diseño solo a 1000px sin pensar 24px | Muere en UI |
| “Listo” sin test de silueta | Falsa confianza |

---

## Checklist de entrega

- [ ] Análisis semántico hecho (identidad / ruido)  
- [ ] Silueta reconocible en negro  
- [ ] Solo rasgos 80/20; decoración = 0  
- [ ] Estilo declarado y consistente  
- [ ] Pocas formas / pocos nodos  
- [ ] Contraste OK (ojos, acentos)  
- [ ] Preview validado (`render_spread` o abrir SVG)  
- [ ] Export solo si se pidió  

---

## Referencia ampliada

Conceptos avanzados (Beziers C0/C1, booleanos, icon systems, optimización SVG): ver [reference.md](reference.md).
