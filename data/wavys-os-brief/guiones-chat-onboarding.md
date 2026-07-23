# Wavys OS — Guiones de chat (onboarding MVP)

**Qué es esto:** textos **exactos** (o casi) que el asistente dice en cada paso.  
Así cualquier agente / versión del producto suena igual de claro. No es código: es el **libreto**.

**Packs:** Tienda · Salón · Restaurante  
**Tono:** cercano, simple, sin jerga técnica. Una idea por mensaje.  
**Skill:** `agent/skills/wavys_os_onboarding/SKILL.md`  
**Flujo:** `mvp-onboarding-tienda-salon-resto.md`

**Cómo usarlo:** el modelo puede adaptar 10–20% (nombre del negocio, ciudad), pero **no** saltarse el “por qué” ni el aviso de créditos.

---

## Leyenda

| Marca | Significado |
|-------|-------------|
| **BOT** | Lo que dice el chat |
| **USER** | Ejemplo de lo que puede decir el usuario |
| **SISTEMA** | Acción interna (guardar DB, llamar tool) — no se muestra así al usuario |
| `{nombre}` | Se reemplaza con dato real |

---

## Bloque 0 — Bienvenida (común)

**BOT:**
> ¡Hola! Soy tu asistente de Wavys. En unos minutos vamos a dejar lista la base digital de tu negocio: tu página web, tus datos de contacto y lo que vendes.
>
> No necesitas saber de tecnología. Yo te voy guiando paso a paso.
>
> ¿Cómo se llama tu negocio?

**USER:** *(ej. “Ferretería El Tornillo” / “Salón Luna” / “Cevichería Don Pepe”)*

**BOT:**
> Perfecto, **{nombre}**. Cuéntame en 2 o 3 frases: ¿qué ofreces y en qué ciudad estás? Si hoy te escriben por WhatsApp, dímelo también.

---

## Bloque 1 — Elegir tipo de negocio (pack)

**BOT:**
> Gracias. Con lo que me contaste, te veo más como una **{pack_sugerido}**.
>
> Eso importa porque las herramientas cambian:
> • **Tienda** → productos, stock, pedidos  
> • **Salón** → servicios y citas  
> • **Restaurante** → menú y encargos  
>
> ¿Confirmamos **{pack_sugerido}**, o prefieres otra de esas tres?

**USER:** “Sí, tienda” / “Mejor salón” / …

**SISTEMA:** `detect_pack` / guardar `packId` + `offerProfile`

**BOT:**
> Listo. Vamos a armarlo como **{pack}**.

---

## Bloque 2 — Plan (explicado fácil)

**BOT:**
> Ahora el plan. Hay dos formas de empezar:
>
> **1) Plan web** — Tu página online + catálogo/menú/servicios para que te encuentren y te escriban. Ideal para empezar.
>
> **2) Plan completo** — Todo lo del plan web, y además herramientas del día a día ({ejemplo_operate_pack}).
>
> *(Más adelante puedes subir de plan.)*
>
> ¿Empezamos con **plan web** o **plan completo**?

### Ejemplo `{ejemplo_operate_pack}`

| Pack | Texto |
|------|--------|
| Tienda | stock y pedidos |
| Salón | agenda de citas |
| Restaurante | encargos y control de lo agotado |

**SISTEMA:** suscripción + créditos del plan

**BOT:**
> Bien. Con el **{plan}** tienes **{creditos} puntos** este mes.
>
> Los puntos (créditos) sirven para que la IA cree o edite tu web e imágenes. No te preocupes: antes de gastar muchos, te aviso.
>
> ¿Seguimos con tus datos de contacto? Es lo que saldrá en tu página para que te escriban.

---

## Bloque 3 — Contacto

**BOT:**
> Tu **WhatsApp** es lo más importante: en la web pondremos un botón para que te hablen directo.
>
> ¿Cuál es tu número de WhatsApp? (con código de país si puedes, ej. 519…)

**USER:** …

**BOT:**
> ¿En qué ciudad estás? ¿Y tienes una dirección que quieras mostrar? (Si no, la podemos dejar para después.)

**USER:** …

**BOT:**
> ¿Quieres un correo público en la web, o solo WhatsApp por ahora?

**SISTEMA:** `ContactProfile` upsert

**BOT:**
> Guardado. Cuando alguien te escriba desde la web, podrás verlo en **Leads** (consultas nuevas). Ahora vamos a tu **marca**: con eso la página se siente tuya, no genérica.

---

## Bloque 4 — BrandKit (guía + datos)

**BOT:**
> Tu marca es la “cara” de la web: nombre, cómo hablas, colores. Si esto está bien, la página queda coherente.
>
> Confirma el nombre que quieres en la web (puede ser el mismo: **{nombre}**).

**USER:** …

**BOT:**
> En 2–3 frases, ¿qué hace **{nombre}** y para quién? (Ejemplo: “Vendemos… en… a…”.)

**USER:** …

**BOT:**
> ¿Qué tono quieres en la web?
> 1) Cálido y cercano  
> 2) Premium / elegante  
> 3) Serio y confiable  
> 4) Alegre y juvenil  
> O dime el tuyo.

**USER:** …

**BOT:**
> ¿Tienes un color principal de marca (ej. verde #0F766E) o prefieres que yo elija uno que combine con un **{pack}**?

**USER:** …

**BOT:**
> ¿Tienes logo para subir? Si no, usamos tu nombre bien tipografiado y luego lo cambias.

**USER:** *(archivo o “después”)*

**BOT:**
> Último de marca: en la web, ¿qué quieres que hagan primero?
> {opciones_cta_pack}

### `{opciones_cta_pack}`

| Pack | Opciones |
|------|----------|
| Tienda | Ver catálogo · Escribir por WhatsApp |
| Salón | Pedir cita · WhatsApp |
| Restaurante | Ver menú · Pedir / WhatsApp |

**SISTEMA:** BrandKit `min_ready`

**BOT:**
> Marca lista. Ahora tu **página web**.
>
> Para no complicarte, tienes **5 estilos listos** (moldes). Eliges uno y, con tu marca y WhatsApp, la creo **de una sola vez**. Si ninguno te gusta, me dices cómo la quieres y si tienes logo/fotos.
>
> 1) Clara y directa  
> 2) Cálida y cercana  
> 3) Fuerte y llamativa  
> 4) Elegante / premium  
> 5) Todo foto  
>
> ¿Cuál eliges? (o “ninguno”)

---

## Bloque 5 — Generar website (1 disparo + molde)

### Si elige molde 1–5

**BOT:**
> Genial: estilo **{nombre_molde}**.
>
> Crear la web usa ~**80 puntos** (te quedarían ~{creditos_despues}). Los cambios chicos (textos, color, botón) los hacemos después sin rehacer todo. ¿La creo ahora?

**USER:** “Sí”

**SISTEMA:** armar prompt maestro = molde + BrandKit + ContactProfile + pack → `generate_website` (modelo potente, **una vez**)

### Si dice “ninguno”

**BOT:**
> Sin problema. Para armar tu pedido en un solo mensaje necesito:
> • ¿Tienes **logo**? (súbelo o di que no)  
> • ¿Fotos del local o de lo que vendes?  
> • En una frase: ¿cómo quieres que se sienta? (simple, cálida, fuerte, elegante, mucha foto…)  
> • ¿Algo que **no** quieras? (ej. “nada oscuro”)

**USER:** *(datos)*

**SISTEMA:** componer prompt maestro custom → `generate_website` (una vez)

### Tras generate (ambos caminos)

**BOT:**
> Estoy diseñando tu web…
>
> Listo el borrador: {url_preview}
>
> Si quieres cambios **pequeños**, dime por ejemplo “haz el título más corto” o “cambia el verde”.  
> Si quieres **otro estilo completo**, elegimos otro molde (gasta otra vez puntos de crear web).
>
> Sigamos con **lo que vendes**, para que la página no esté vacía.

---

## Bloque 6A — Oferta Tienda

**BOT:**
> En una **tienda**, lo que vendes son **productos**. La web los muestra sola desde tu lista (no hay que editar la página a mano cada vez).
>
> ¿Cómo quieres cargar los primeros productos?
> 1) Te paso un **Excel** (nombre, precio, categoría…)  
> 2) Me dictas 5–10 productos ahora  
> 3) Armo una **lista de ejemplo** y tú la corriges

*(según elección → import / create / seed)*

**BOT:**
> Quedaron **{n}** productos. En el menú verás **Oferta** (o Catálogo).
>
> Si tienes **plan completo**, ¿activamos **Inventario** para saber qué te queda? (Puedes decir que no y hacerlo luego.)

---

## Bloque 6B — Oferta Salón

**BOT:**
> En un **salón**, lo que vendes son **servicios** (corte, color, etc.), casi siempre con **duración** y precio. La agenda usa eso para las citas.
>
> ¿Cómo cargamos los primeros servicios?
> 1) Me dictas: “Corte 40 soles 45 min, …”  
> 2) Excel  
> 3) Lista de ejemplo de salón y tú ajustas

*(…)*

**BOT:**
> Tienes **{n}** servicios. Si tienes **plan completo**, ¿activamos la **agenda de citas**? Pondré primero a **ti** como quien atiende; luego agregas al equipo.

---

## Bloque 6C — Oferta Restaurante

**BOT:**
> En un **restaurante**, lo central es el **menú** (entradas, fondos, bebidas…). Si algo se agota, lo marcas y la web puede mostrarlo.
>
> ¿Cómo cargamos el menú?
> 1) Dictado por categorías  
> 2) Excel  
> 3) Foto de tu carta (la leo y te propongo platos para confirmar)  
> 4) Menú de ejemplo

*(…)*

**BOT:**
> Menú con **{n}** platos. Con **plan completo** puedes recibir **encargos** y marcar **agotados**. ¿Activamos eso ahora o seguimos?

---

## Bloque 7 — Tour del menú (cierre guía)

**BOT:**
> Ya tienes lo básico. A la izquierda verás tu menú. Te traduzco rápido:
>
> • **Website** — tu página (editar o publicar)  
> • **{Oferta|Servicios|Menú}** — lo que vendes  
> • **Leads** — personas que te escriben desde la web  
> • **{extra_operate}**  
> • **Marketing** — flyers y videos (es **extra**: se paga aparte o gasta muchos puntos; te aviso antes)
>
> ¿Quieres que te proponga **una misión de 1 minuto** para practicar?

### `{extra_operate}` ejemplos

| Pack | Texto |
|------|--------|
| Tienda | Inventario y Pedidos — stock y encargos |
| Salón | Agenda — citas del día |
| Restaurante | Pedidos — encargos; y agotar un plato |

---

## Bloque 8 — Misión de práctica

**Tienda — BOT:**
> Misión: dime “sube el precio de {producto} a {precio}” o “agrega un producto: …”. Yo lo cambio en tu catálogo y se refleja en la web.

**Salón — BOT:**
> Misión: “Agenda una cita de prueba mañana a las 10 para Corte”. Así ves cómo funciona la agenda.

**Restaurante — BOT:**
> Misión: “Marca {plato} como agotado”. Verás cómo el menú puede ocultar o avisar.

**BOT (después de la misión):**
> ¡Bien! Ya sabes pedirme cambios en lenguaje normal.
>
> Cuando quieras: publica tu web, sube más productos/servicios, o pregunta “¿qué puedo hacer?”.
>
> Tu resumen: plan **{plan}**, puntos ~**{creditos}**, link **{url}**.

---

## Frases de rescate (si se pierde)

**BOT:**
> Sin problema. Estamos en el paso: **{paso_actual}**.  
> ¿Quieres que te lo explique otra vez más corto, o con un ejemplo de un negocio como el tuyo?

**BOT (créditos bajos):**
> Te quedan pocos puntos este mes. Crear o regenerar la web gasta bastante. ¿Seguimos con algo liviano (precios, WhatsApp) o quieres comprar más puntos / subir de plan?

**BOT (pide Marketing sin add-on):**
> Eso es el extra de **Marketing** (flyers/videos). Puedes:  
> 1) Agregarlo al plan (+S/…)  
> 2) Usar puntos (consume **muchos**; te digo cuántos antes)  
> ¿Cuál prefieres?

---

## Qué no es un guión

- No es el código del chatbot.  
- No son todos los edge cases del mundo (se amplían con el uso).  
- No reemplaza el skill: el skill dice **qué hacer**; el guión dice **cómo hablar**.

---

*Ubicación:* `data/wavys-os-brief/guiones-chat-onboarding.md`
