# RADAR N°1 — interior

Interior completo de la revista semanal **RADAR** (Wavys), maquetado como secciones editoriales en
HTML/CSS que renderizan a **1240 × 1754 exactos** y se exportan a PNG con Chrome headless.

No es un sitio web ni un post de Instagram: cada archivo es una página de revista. Nada de este
folder toca el brand kit, el contexto del agente ni el código de la app.

## Mapa de páginas

| Archivo | Página | Sección | Personalidad visual |
|---|---|---|---|
| — | 01 | **Tapa — LOCK** | No está acá a propósito: la tapa N°1 ya está aprobada y no se rediseña ni se reemplaza. El interior respeta su idioma: masthead RADAR en tinta, teal `#5AD2D0` como único acento, superficies `#070604` / `#050608`, una palabra golpe por titular. |
| `02-carta-del-editor.html` | 02 | Carta del editor | **Papel.** Carta impresa: serif de lectura, sello de tinta, colofón en versalitas, foto que sangra por la izquierda. Cascada de tamaños *Esta semana → no vi → **más IA*** (la palabra golpe con resaltador teal). |
| `03-senal.html` | 03 | Señal (2 notas) | **Rápido, denso, una sola página.** Dos ejes cruzados: la nota A entra por la izquierda y su titular (`SE METIÓ / AL CORREO`) corta la única foto; la nota B es puro tipo, cursiva y teal, alineada a la derecha (`un silencio / y cuelgan`). |
| `04a-tema-central-apertura.html` | 04 | Tema central · apertura | **Foto grande.** Escena de chat + hoja + celular a sangre, la fecha `1 OCT 2026` en outline detrás del tipo, titular `deja de / regalar` y muy poco texto. |
| `04b-tema-central-relato.html` | 04 | Tema central · relato | **Lectura.** Banda de foto arriba cortada por `LA HOJA / ES EL SISTEMA`, riel de datos duros a la izquierda y una sola mancha de texto a la derecha. |
| `04c-tema-central-casos.html` | 04 | Tema central · casos | **Cuatro puertas.** Tres casos en columnas con numerales colgados; el cuarto vive dentro de la foto, que sangra por abajo. |
| `04d-tema-central-cita-datos.html` | 04 | Tema central · cita y datos | **Papel frío.** La cita grande arriba (no es un titular nuevo) y abajo solo hechos de Meta en línea de tiempo, en mono. Sin tarifas en soles. |
| `04e-tema-central-reglas.html` | 04 | Tema central · cierre | **Tres reglas.** Página sin foto: numerales enormes, la regla en grotesca, el matiz en serif, firma al pie. |
| `05-mas-noticias.html` | 05 | Más noticias (3 notas) | **Tres columnas en papel**, grilla al revés de 03, con banda de escena oscura al pie que sostiene las fuentes. Una voz tipográfica por nota: cursiva serif (`sin / API`), slab de negocio (`no es / otro chat`), cartel duro (`EL DEFAULT / ES SÍ`). |
| `08-tablero-ia.html` | 08 | Tablero de IA | **Dato tipo Bloomberg.** Tabla tipografiada del índice + **tres gráficos reales** recortados de Artificial Analysis. Benchmark AA y línea Wavys rotulados aparte. |
| `09-contratapa.html` | 09 | Contratapa | **Cierre.** Separada del tablero: escena de cierre a sangre, la última idea grande y un solo CTA de 30 minutos. |

Las páginas **06 (Special)** y **07 (AI Feature)** no existen en el N°1 y no se inventaron.

## Exportar PNG

```bash
bash radar-n1/export-page.sh                          # todas las páginas
bash radar-n1/export-page.sh 04a-tema-central-apertura.html
CHROME=chromium bash radar-n1/export-page.sh 09-contratapa.html
```

Los PNG salen en `radar-n1/export/` con el nombre de la página. El comando que corre por dentro es
exactamente el pedido:

```bash
google-chrome --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1240,1754 --screenshot=OUT.png file://PAGE.html
```

Para iterar rápido (Chrome headless a veces no cierra solo y el script lo mata a los 90 s) hay un
atajo con Playwright, mismas medidas, ~2 s por página, que además avisa si algo se sale de la caja:

```bash
node radar-n1/scripts/dev-shot.mjs                    # todas
node radar-n1/scripts/dev-shot.mjs 08-tablero-ia.html
```

## Estructura

```
radar-n1/
  02…09-*.html          una página por archivo, 1240×1754
  css/radar.css         sistema compartido: página, tinta, folios, grano, tratamiento de foto
  fonts/                webfonts self-hosted (el export no depende de red) + fonts.css
  img/                  7 escenas fotográficas — Gemini gemini-3.1-flash-lite-image
  charts/               capturas reales de artificialanalysis.ai + SOURCES.md
  export/               PNG exportados
  export-page.sh        export oficial con Chrome headless
  scripts/gen-scenes.mjs        generador de escenas (modelo/endpoint bloqueados)
  scripts/capture-aa-charts.mjs capturas de los gráficos reales
  scripts/fetch-fonts.sh        descarga de tipografías
  scripts/dev-shot.mjs          atajo de iteración + chequeo de desborde
  SCENES.md             qué prompt hizo cada foto y con qué API
```

## Tipografías

Self-hosted en `fonts/` para que el render sea igual en cualquier máquina
(`bash radar-n1/scripts/fetch-fonts.sh` las vuelve a bajar):

| Familia | Rol |
|---|---|
| **Archivo** (variable, `wght` + `wdth`) | masthead de interior, titulares condensados, folios, etiquetas |
| **Fraunces** (variable) | palabra golpe y numerales de display |
| **Playfair Display** | voz en cursiva (nota B de 03, `sin / API`, firmas) |
| **Spectral** | serif de lectura: carta, relato, casos |
| **Zilla Slab** | voz de negocio (Thrive, 05b) |
| **IBM Plex Mono** | tablero de datos, fechas, URLs, fuentes |

## Reglas que respeta el interior

- Una foto **colocada** por página como máximo: sangra, se recorta, pasa por detrás o cortada por el
  tipo. Nunca miniatura dentro de una columna, nunca texto quemado sobre la foto con Pillow.
- Fotografía: solo `gemini-3.1-flash-lite-image` (ver `SCENES.md`). Gráficos: solo capturas reales
  (ver `charts/SOURCES.md`).
- Un solo acento (`#5AD2D0`). El resto es tinta y papel.
- URLs reales impresas en la página, completas, en mono.
- Sin precios y sin geografía. El único CTA está en 09: `https://cal.com/wavys-call/30min`.
- Sin tarifas en soles del cambio de WhatsApp: Meta publica las tarifas de servicio el 1 de
  septiembre y la revista lo dice así.
