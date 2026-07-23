# Wavys OS — Explicaciones (día 2+, API, Presencia ↔ OS)

**Para:** Phil — lo que pediste aclarar antes de seguir.

---

## 1. ¿Qué son los “flujos día 2+”?

El **onboarding** es el día 1: crear cuenta, marca, web, primeros productos.

**Día 2+** = lo que pasa **después**, cuando ya usa el sistema solo:

| Situación | Qué hace el usuario | Qué hace el sistema |
|-----------|---------------------|---------------------|
| Editar web | “Cambia el título” / “más grande el botón” | `edit_website` (barato) |
| Excel grande | Sube 500 productos | `offer_import` + límites/créditos |
| Se acabaron créditos | Quiere otra imagen/web | Aviso → top-up o esperar mes |
| Marketing | Quiere flyer | Upsell add-on o créditos altos |
| Cambió WhatsApp | “Mi número nuevo es…” | Update ContactProfile → web se actualiza |

No es otra app: son **guiones y reglas** para cuando ya no está en onboarding.

*(Doc detallado de guiones día 2: se puede hacer después; la idea ya está clara.)*

---

## 2. ¿Qué es la “API oferta/contacto”?

La **website** no guarda los productos ni el WhatsApp “pegados” en el HTML para siempre.

Necesita un **endpoint** (API) del panel/backend, por ejemplo:

- `GET /api/public/{slug}/offer` → lista productos/menú/servicios públicos  
- `GET /api/public/{slug}/contact` → WhatsApp, dirección, horarios  
- `POST /api/public/{slug}/leads` → formulario “Escríbenos”

**En humano:** es el “tubo” por el que la web **pregunta a la base** qué mostrar.  
Sin eso, cada vez que cambias un precio tendrías que regenerar toda la web.

---

## 3. ¿Qué es “Presencia Digital ↔ OS”?

Hoy Wavys vende **Presencia Digital** (servicio: ustedes les arman la landing a mano, S/149…).

**Wavys OS** es el producto self-serve (chat + módulos).

Hay que decidir:

- ¿El cliente de Presencia Digital **migra** a OS?  
- ¿Siguen **dos productos** en paralelo?  
- ¿OS **reemplaza** poco a poco a Presencia?

No es técnico urgente; es **comercial**, para no confundir al mercado ni canibalizar mal.

**Propuesta simple:** Presencia Digital = entrega asistida por Wavys; OS = el cliente se auto-gestiona. Mismos precios ancla; path de upgrade “pásate a OS y edita por chat”.

---
