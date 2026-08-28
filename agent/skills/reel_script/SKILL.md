# Skill — Guiones para reels (Wavys)

Usar cuando Phil pida **un guion** para grabar: reel de oferta, reel de noticia,
explicación de producto, opinión. Es el paso de **texto hablado**, antes de
cualquier render.

**No confundir:**

| Phil pide | Va a |
|---|---|
| "un guion", "qué digo en el video", "guiones para grabar" | **este skill** — subagente `guion` |
| "clips animados", "placas", "lower thirds" | `motion_kit` — subagente `motion` |
| "un video terminado con voz en off" | `video_production` (este skill cubre su Fase ②) |
| "un post", "un caption" | `content_production` |

Lectura previa obligatoria: `agent/context/founder-profile.md`,
`agent/context/content-feedback-log.md`, `agent/skills/content_craft/SKILL.md`
§ copy.

---

## Salida

Un solo archivo: `data/content-drafts/guiones/<slug>-YYYY-MM-DD.md`.

Trae **3 guiones** por defecto (ángulos distintos, no variaciones del mismo),
salvo que Phil pida otro número. Un guion que es el mismo con otras palabras no
cuenta como ángulo.

**El ángulo se mide por dos cosas: por dónde entra y a qué conclusión llega.** Si
dos guiones abren con la misma cifra o la misma idea, el set se lee repetido
aunque las tesis sean distintas. Y entre los tres debería haber **uno que entre
por una historia o un caso concreto, uno por un dato y uno por la contra**: es lo
que hace que el set sirva para probar en pauta. Tres lecturas del documento con
tres tesis distintas siguen siendo un solo registro.

Estructura del archivo en `references/plantilla.md`.

---

## Los cuatro modos

El modo se elige por lo que el guion tiene que lograr, y define el arco.

| Modo | Cuándo | Arco |
|---|---|---|
| `oferta` | Vender un servicio Wavys | Contexto → tensión → resolución → prueba → CTA (5 actos, `data/presencia-digital-brief/STORYTELLING-GUIA.md`) |
| `noticia` | Comentar un anuncio, lanzamiento o artículo | Qué pasó → por qué no es obvio → qué le cambia al negocio → el matiz que nadie dice → cierre |
| `educativo` | Enseñar a hacer algo | Promesa concreta → pasos → el error que todos cometen → cierre |
| `opinión` | Romper patrón, tesis contraria | Tesis → por qué la creencia común falla → el matiz honesto → qué hacer el lunes |

En `noticia` y `opinión` el CTA es conversacional ("cuéntame si ya lo probaste"),
no comercial. Meter "escríbeme al WhatsApp" en un reel de noticia quema el
formato.

---

## Reglas duras

### Duración = palabras ÷ 2.5

Phil habla español LatAm a ~150 palabras por minuto. **2.5 palabras por
segundo.** Un reel de 45 s son ~110 palabras de voz en off, no 200.

Los números se cuentan **como se pronuncian**: "116" son dos palabras (*ciento
dieciséis*), "2026" son tres. Un hook de doce palabras con una cifra adentro casi
siempre se pasa del techo.

Cada guion declara su conteo real: `≈112 palabras · ~45 s`. Si el conteo no
cuadra con la duración declarada dentro de ±15%, el guion está mal, no la regla.

Contar a mano tres guiones con sus versiones cortas es donde se cuela el error.
Cuenta la voz en off de un bloque así (excluye texto de pantalla y b-roll):

```bash
pbpaste | wc -w        # o: echo "<texto>" | wc -w
```

### El hook son 3 segundos

- Primera frase: **máximo 12 palabras**, y tiene que entenderse sin contexto.
- Prohibido abrir con: saludo, nombre de la marca, "hoy les voy a hablar de",
  "¿sabías que…?", una pregunta retórica sin filo.
- Todo guion trae **3 hooks alternos** al final para probar en pauta.

### Las cifras tienen dueño

Cada número que se dice en cámara va en la tabla de fuentes con medio, URL y
fecha. Si el dato lo da la empresa que lo anuncia, el guion lo dice en voz alta
("según la propia OpenAI"). **Cero cifras sin fuente**, cero redondeos que
inflan, cero "estudios dicen".

Eso vale también para la **urgencia**: "quedan meses, no años" dicho por quien
vende la solución no es un pronóstico neutral. O se nombra quién lo dice, o no se
dice.

### Comillas solo si es literal

Una frase entre comillas en el caption o en pantalla tiene que estar **verbatim**
en la fuente, verificada palabra por palabra. Si solo tienes la idea o una
versión en otra persona gramatical, quita las comillas y parafrasea. Una cita
entre comillas que no es literal es el peor error que puede tener el archivo.

### Tres cosas que la tabla de fuentes no cubre sola

| Caso | Cómo se maneja |
|---|---|
| **Una cita de otro contexto** | Una frase perfecta dicha sobre *otra* pieza o en otra fecha se puede usar, pero el guion tiene que decir sobre qué la dijo ("ya lo había dicho sobre OpenAI"), nunca colgarla del tema del reel |
| **Una ausencia** | Que la fuente *no* diga algo puede ser el mejor hallazgo del encargo. No es cifra y no tiene fila: va en Datos verificados marcada como leída de punta a punta, y en cámara se dice en primera persona ("leí la carta entera"), nunca como dato de un tercero |
| **Una lectura tuya** | Un cálculo o una inferencia propia se dice como opinión, no como hallazgo del documento |

### Un CTA, al final, suave

Uno solo. Al final. Sin presión. El teléfono y el link van en el texto de
pantalla y el caption, no repetidos tres veces en la voz.

### Español de LatAm, tuteo, frases cortas

Escribe como Phil habla: concreto, sin épica. Una línea larga seguida de una
corta. Sin emojis en la voz en off.

**Palabras vetadas:** revoluciona, disrumpe, game changer, "llegó para quedarse",
"en un mundo donde", "no te lo pierdas", "el futuro es hoy", "imagina por un
momento", "la herramienta definitiva".

### Qué línea de negocio habla — decidir antes de escribir

Phil tiene dos negocios y **no se mezclan en un mismo guion**. El guion declara
cuál habla en el encabezado del archivo.

| Línea | Sitio | Qué vende | Cuándo es esta |
|---|---|---|---|
| **Estudio (default)** | `software.wavys-technologies.com` — repo `theros-website` | Software y diseño a medida: webs, apps, sistemas internos, identidad digital | Siempre, salvo que Phil diga lo contrario |
| **SaaS CRM** | `wavys-technologies.com` | CRM conversacional y agentes de WhatsApp | **Solo** si Phil lo pide en ese mensaje |

**El default es el estudio.** No arrastres el discurso de WhatsApp, bots ni
automatización a un guion del estudio: ahí se vende software a medida, y el chat
aparece a lo sumo como síntoma del problema del cliente, nunca como la oferta.

Material real del estudio (no inventar nada fuera de esto):

| | |
|---|---|
| **Promesa** | "Software y diseño para quien ya opera" — dirección visual e ingeniería con la misma mano |
| **A quién** | Negocios **con tracción** en Perú y LatAm: corredurías, inmobiliarias, restaurantes, equipos comerciales con volumen |
| **A quién no** | Idea stage. El sitio lo dice: *"Si es tu primer experimento, no somos el partner"* |
| **Los tres dolores** | Web que no vende · Operación en parches · Sistemas a medias, sin dueño técnico |
| **Servicios** | Webs con narrativa · Apps que se usan · Sistemas internos · Identidad digital |
| **Proceso** | Diagnóstico (3–5 días) → Dirección (1–2 sem) → Construcción → Entrega. Cada fase deja entregable y punto de decisión |
| **Precio** | No hay cifras públicas. Plazos sí: landing 3–5 semanas, site 5–8, sistemas desde 8 |
| **Casos** | Junno, AgendaMesa, Inmobiliaria Fabre, JLH Corredores, La Alcoba |
| **CTA** | `https://cal.com/wavys-call/30min` — "Agendar llamada 30 min" |
| **Voz** | *"Cotizamos después de entender el cuello de botella"* · *"Seguimos o no. Sin teatro"* |

Detalle y reglas de diseño: `agent/context/design-patterns-wavys-software.md`.

### El ángulo

La pregunta nunca es "qué lanzaron", es **qué le cambia el lunes al negocio que
ya opera y cuyo digital lo está frenando**. Si un guion de noticia no responde
eso, es un resumen de prensa, no contenido de Wavys.

No forzarlo: si un tema no toca a ese negocio, el ángulo honesto es "esto no te
toca todavía, pero mira por qué importa".

---

## Las cinco pruebas (antes de entregar)

Aplicar a cada guion. Una sola que falle se corrige, no se entrega con nota.

| Prueba | Cómo | Falla si |
|---|---|---|
| **Primera línea** | Léela sola, sin el resto | No se entiende o no da ganas de quedarse |
| **¿Y qué?** | Pregúntalo después de cada toma | Una toma no cambia nada para quien mira |
| **Reemplazo de marca** | Cambia "Wavys" por "cualquier agencia" | Sigue funcionando igual → el guion no dice nada propio |
| **Conteo** | Palabras ÷ 2.5 vs duración declarada | Se desvía más de 15% |
| **Cifras** | Cada número contra la tabla de fuentes | Un número sin fila |
| **Hilo** | ¿El cierre contesta la pregunta que abrió el hook? | El CTA cambia de tema para pasar otra prueba |

La del reemplazo de marca es la que más guiones mata, y en modo `noticia` la
trampa es cerrar los tres igual: si los tres terminan con Phil autoinculpándose,
pasaste la prueba una vez y la copiaste dos. Al corregirla, cuida que el cierre
siga contestando lo que abrió el hook — es fácil ganar especificidad y perder el
hilo.

---

## El flujo

1. **Entender el encargo.** Modo, duración, plataforma, si hay URL o tema.
2. **Investigar** si es `noticia`: leer la fuente completa —no el titular— y
   mínimo 2 fuentes más para contraste. Guardar la tabla de fuentes.
3. **Elegir 3 ángulos distintos** y decir en una línea por qué cada uno.
4. **Escribir** el archivo con la plantilla.
5. **Aplicar las cinco pruebas** y corregir.
6. **Pasar por `guion-critico`** (readonly). Si dice "hay que corregir", corriges
   y vuelves a pasar. No se entrega un guion que el crítico rechazó.
7. **Reportar** a Phil: los tres ángulos, cuál grabar primero y por qué.

---

## Después de que Phil dé feedback

Añadir entrada en `agent/context/content-feedback-log.md` con qué pidió, qué no
funcionó, qué sí y la regla derivada. Es obligatorio: es lo que evita repetir el
mismo error en el siguiente guion.

---

## Changelog

| Fecha | Cambio |
|---|---|
| 2026-08-27 | Skill inicial: 4 modos, regla 2.5 palabras/seg, 5 pruebas, crítico readonly |
| 2026-08-27 | Estreno (carta ciberdefensa OpenAI): números se cuentan hablados; comillas solo verbatim; citas de otro contexto, ausencias y lecturas propias; prueba del hilo; cobertura historia/dato/contra del set |
