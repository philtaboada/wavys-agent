# Wavys OS — Moldes de prompt para crear website (1 disparo)

**Idea Phil:** no interrogar eterno. Hay **4–5 moldes** (“más o menos así quiero mi web”).  
Si no usa molde → se le piden datos + logo → se arma **un solo prompt** → se genera la web.  
Cambios chicos después por chat (`edit_website`), no regenerar todo.

**Entrada al generate:** BrandKit `min_ready` + ContactProfile + pack + molde (o brief libre).  
**Modelo:** potente (default Grok 4.5).  
**Skill build:** `one_call_landing` / `one_call_website`.

---

## 1. Flujo

```text
BrandKit + Contacto listos
        │
        ▼
 ¿Usas un molde de estilo? ──sí──► elige 1 de 5 ──► un solo prompt (molde+datos)
        │                                    │
        no                                   ▼
        │                         generate_website (1 vez)
        ▼                                    │
 pide: logo, fotos,        ◄─────────────────┘
 preferencias sueltas
        │
        ▼
 arma 1 prompt maestro → generate_website
        │
        ▼
 preview → cambios pequeños por chat
```

---

## 2. Los 5 moldes (estilo / intención)

Cada molde es un **esqueleto de prompt** + secciones típicas. El pack (tienda/salón/resto) rellena el contenido (catálogo/servicios/menú).

| ID | Nombre para el usuario | Sensación | Secciones base |
|----|------------------------|-----------|----------------|
| `mold_clear` | **Clara y directa** | Limpia, mucho aire, CTA WhatsApp obvio | Hero, oferta, nosotros corto, contacto |
| `mold_warm` | **Cálida y cercana** | Acogedora, local, fotos humanas | Hero story, oferta, historia, contacto |
| `mold_bold` | **Fuerte y llamativa** | Contraste alto, tipografía grande | Hero impactante, oferta grid, CTA sticky, contacto |
| `mold_elegant` | **Elegante / premium** | Serif o fino, poco ruido | Hero editorial, oferta selecta, trust, contacto |
| `mold_photo` | **Todo foto** | Imagen domina, texto mínimo | Full-bleed hero, galería, oferta, contacto |

**Regla:** el usuario elige por **nombre humano**, no por ID.

---

## 3. Texto del molde (lo que “quiere” cada uno)

Estos párrafos se concatenan con BrandKit + Contacto + pack en el **prompt maestro único**.

### `mold_clear` — Clara y directa

```text
Estilo: web clara y directa, mucho espacio en blanco, jerarquía simple, sin adornos de más.
Hero: nombre de marca grande, una frase, un CTA principal a WhatsApp (o el CTA del BrandKit).
Secciones: oferta/servicios/menú según pack (conectado a datos vivos), bloque corto “quiénes somos”, contacto con WhatsApp/dirección/mapa si hay.
Mobile-first. Tipografía legible. No cards innecesarias. No parecer plantilla genérica morada.
```

### `mold_warm` — Cálida y cercana

```text
Estilo: cálido y cercano, sensación de negocio de barrio de confianza; colores del BrandKit; fotos si hay.
Hero: historia corta del negocio + CTA amable a WhatsApp.
Secciones: oferta con tono humano, “nuestra historia”, contacto con horario si existe.
Copy cercano, no corporativo frío. Evitar stock photos genéricos si hay gallery del BrandKit.
```

### `mold_bold` — Fuerte y llamativa

```text
Estilo: bold, tipografía grande, contraste alto, ritmo energético.
Hero: claim corto potente + CTA claro.
Secciones: grilla de oferta destacada, prueba social simple si hay, contacto imposible de perder.
Sirve para negocios que quieren verse modernos y visibles en celular.
```

### `mold_elegant` — Elegante / premium

```text
Estilo: premium, editorial, pocos elementos, tipografía cuidada, márgenes generosos.
Hero: marca + una línea elegante; imagen o fondo sobrio.
Secciones: oferta selecta (no amontonar), confianza, contacto discreto pero completo.
Sin gritos visuales ni emojis. Ideal salones premium, boutiques, restos fine-casual.
```

### `mold_photo` — Todo foto

```text
Estilo: la imagen manda; texto mínimo; full-bleed donde se pueda.
Hero: foto dominante (gallery BrandKit o placeholder de calidad) + logo/nombre.
Secciones: galería, oferta ligera sobre foto o bandas, contacto.
Si no hay fotos del cliente, generar 2–4 assets Gemini coherentes con imageStyle del BrandKit (avisar créditos).
```

---

## 4. Camino sin molde

Si dice “ninguno / yo te digo”:

**Pedir (mínimo):**

1. ¿Logo? (sí → upload / no → wordmark)  
2. ¿Fotos del local o producto? (sí/no)  
3. ¿Más bien simple, cálida, fuerte, elegante o con muchas fotos? *(si aún no elige, mapear a un molde por debajo)*  
4. ¿Algo que **no** quieres? (ej. “nada oscuro”, “sin stock photos”)

Luego el sistema **compone un solo prompt maestro** = BrandKit + Contacto + pack + preferencias libres + (molde inferido o `mold_clear` por defecto).

---

## 5. Prompt maestro (plantilla única)

```text
PACK: {shop|salon|restaurant}
MOLD: {mold_id} + texto del molde
BRAND:
  displayName, tagline, shortBio, voiceTone, colors, logoUrl?, gallery?
CONTACT:
  whatsapp, city, address?, hours?, socials?
OFFER_BINDING:
  mostrar items públicos del tenant (catálogo|servicios|menú); no inventar precios fijos en HTML
CTA: {ctaPreference}
CONSTRAINTS:
  mobile-first; español; no inventar WhatsApp; no sección marketing; binding a ContactProfile y Offer
OUTPUT: website completa según skill one_call_* (un solo build de calidad)
```

**Una sola llamada** `generate_website` con ese prompt.  
No multi-paso de “ahora hero, ahora footer” en la creación inicial.

---

## 6. Después: cambios pequeños

| Pedido del usuario | Acción |
|--------------------|--------|
| “Cambia el color” / “acorta el hero” / “más grande el botón” | `edit_website` (barato, Flash Lite o regen parcial) |
| “Quiero otro estilo total” | Confirmar créditos → nuevo generate con **otro molde** |
| “Sube mi logo” | Update BrandKit → edit o regen header |

No regenerar full por un typo.

---

## 7. Guión corto (chat)

**BOT:**
> Para tu web te propongo **5 estilos**. Eliges uno y con tus datos de marca y WhatsApp la creo de una sola vez:
>
> 1) **Clara y directa**  
> 2) **Cálida y cercana**  
> 3) **Fuerte y llamativa**  
> 4) **Elegante / premium**  
> 5) **Todo foto**  
>
> ¿Cuál te late? Si ninguno, dime cómo la quieres y si tienes logo/fotos, y armo el pedido yo.

**USER:** “La 2” / “Ninguno, la quiero oscura y moderna, tengo logo”

**BOT:**
> Perfecto. Voy a crear tu web en **un solo paso** (~80 puntos). Los arreglos chicos los hacemos después hablando. ¿Dale?

---

## 8. DB (campos útiles)

En `Website` o BrandKit:

| Campo | Uso |
|-------|-----|
| `moldId` | Último molde usado |
| `masterPromptSnapshot` | Prompt maestro (debug / regen) |
| `generationMode` | `mold` \| `custom_single` |

---

*Ubicación:* `data/wavys-os-brief/website-prompt-moldes.md`
