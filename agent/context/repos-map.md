# Mapa de repositorios — Phil / Wavys

Raíz de todos los proyectos:

```
/Volumes/mac externo/Mac Externo/projects/
```

**Entorno cloud (agente Cursor):** `/workspace/project/` — ver `project/README.md`. `wavys-agents` → `project/wavys-agents/`.

## Regla git (Phil)

Antes de **cualquier tarea de código** en un repo Wavys que Phil indique → **`git pull` primero**.

Solo aplica a los repos listados abajo como **Wavys core**, no a proyectos cliente aislados.

Cursor debe consultar este archivo antes de tocar código en otro repo.

---

## Empresa Wavys (core)

| Carpeta | Stack | Qué es | URL / notas |
|---------|-------|--------|-------------|
| **`theros-front`** | Next.js | **App SaaS CRM** — panel Wavys (agentes IA, inbox, admin) | Producto en `theros.click` / signup app |
| **`back-theros`** | NestJS | **Backend API** del SaaS — auth, DB, integraciones | Par de `theros-front` |
| **`wabys-blogsite`** | Next.js | **Web marketing SaaS** — `wavys-technologies.com` (blog, SEO, landings, agent workers) | `contact@wavys-technologies.com` en código |
| **`theros-website`** | Next.js | **Software a medida / estudio** — webs, apps, servicios custom | **`software.wavys-technologies.com`** ✓ confirmado Phil |
| **`wavys-agents`** | Cursor agent | **Operaciones negocio** — ventas, email, notas (este repo) | No es producto cliente |

### Relación entre webs

| URL pública | Repo probable |
|-------------|---------------|
| https://wavys-technologies.com/ | `wabys-blogsite` |
| https://software.wavys-technologies.com/ | `theros-website` ✓ |
| App SaaS (theros.click) | `theros-front` + `back-theros` |

### Corrección importante

- **`Website`** NO es la página de software a medida → es **`2YA!`** (landing app móvil, proyecto aparte).
- **`wabys-blogsite`** — nombre carpeta con typo (`wabys`); package: `wavys-blog-website`.

---

## Clientes / proyectos frecuentes (Phil)

| Carpeta | Notas |
|---------|-------|
| **JLH** | Cliente frecuente |
| **Website-jlh** / **mkt-jlh** | Web/marketing JLH |
| **coopitel-web** / **coophithel-api** | Cliente Coophitel |
| **fabre** | Proyecto cliente (confirmar con Phil) |

Otros en `/projects/` (no Wavys core): `control-obra`, `seace-app`, `trading`, `restaurantCode`, etc. — proyectos cliente o side projects.

---

## Infra / email relacionada

| Servicio | Repo / config |
|----------|---------------|
| Resend | `.env.local` en `wavys-agents`; dominio verificado: `theros.click` |
| Dominio app | `theros.click` |
| Dominio marketing | `wavys-technologies.com` |

---

## Cuándo abrir qué repo

| Tarea Phil pide | Repo |
|-----------------|------|
| Propuesta, email, ventas, LinkedIn | `wavys-agents` |
| Bug/feature CRM SaaS | `theros-front` + `back-theros` |
| Landing pricing / blog Wavys | `wabys-blogsite` |
| Página software a medida / portfolio studio | `theros-website` |
| App 2YA | `Website` |

---

## Comandos dev típicos

```bash
# SaaS front (puerto 3001)
cd theros-front && npm run dev

# Backend
cd back-theros && npm run start:dev

# Marketing wavys-technologies.com
cd wabys-blogsite && npm run dev

# Software a medida site
cd theros-website && npm run dev

# Agente negocio
cd wavys-agents && npm run tool -- ...
```

---

## Pendiente confirmar con Phil

- [x] `theros-website` → `software.wavys-technologies.com` ✓
- [ ] ¿`Website` (2YA) sigue activo o pausado?
- [ ] Mapeo carpeta → cliente para `fabre`, `client`, etc.
