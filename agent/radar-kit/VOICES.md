# Voces tipográficas de RADAR

Cada tipo de página tiene **una sola voz de titular**, distinta de las demás.
El kit la aplica. El agente escribe el título *para* esa voz. Si dos páginas
siguen usando la misma Archivo condensada en caja alta, el kit está roto.

## El mapa

| Página | Voz del titular | Cómo se escribe el título |
|---|---|---|
| `tapa` | Fraunces 150, caja de frase | 2–3 palabras. No grites en mayúsculas. |
| `carta` | Cascada: Archivo chico → Spectral itálica → Fraunces enorme | El último step es la palabra más corta y más pesada. |
| `notas` Señal | Archivo condensada 76, caja alta | Una sola palabra de sección: "Señal". |
| `notas` Más | Playfair itálica 92, caja de frase | Una sola palabra: "Más". Nunca el mismo grito que Señal. |
| nota (titular de historia) | Archivo normal 40, caja de frase | Frase que se entiende sola. No la pongas en versales. |
| `tema-apertura` | Archivo liviano + Archivo condensada teal 138 | `titleMain` es 1–2 palabras. Ahí está el golpe. |
| `tema-texto` | Fraunces 68, caja de frase | Título de reportaje, no de afiche. "Domi, por dentro". |
| `tema-casos` | Zilla Slab 72, caja de frase | Dos palabras. No es un titular de noticia. |
| caso / cierre | Playfair itálica 31 | Cita o frase dicha, entre comillas si hace falta. |
| `tema-reglas` | Spectral itálica 64, caja de frase | Una frase hablada. "No es un chat más lindo". |
| `tablero` | IBM Plex Mono 52, versales | Etiqueta de dato. "Tablero de IA". |
| `contratapa` | Spectral itálica + Archivo condensada 124 | El segundo step es el remate. Corto. |

## Prohibido

- Reusar `.t-section` o `.t-hed` como titular de página. Esas clases son
  primitivas viejas; cada tipo tiene la suya.
- Escribir todos los títulos en caja alta "porque se ve editorial".
- Poner la misma foto, o la misma voz, en dos páginas del mismo número.

## Cómo se hojéa

Si alineas los diez titulares en una lista, tienen que verse como diez
instrumentos distintos, no como el mismo cartel en diez tamaños. Ese es el
test: léelos en voz alta y mira si todos suenan igual.
