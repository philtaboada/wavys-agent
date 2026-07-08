# Rutas de proyectos — Phil

Phil trabaja en **dos entornos** con el mismo repo:

| Dónde | Para qué | Raíz |
|-------|----------|------|
| **Local (Windows)** | Día a día en tu PC — Cursor, tools, landings, `.env.local` | `C:\Users\siste\Project` |
| **Nube (Cloud Agent)** | Tareas desde el móvil / sin abrir la PC — mismo agente vía GitHub | `/workspace` + `/workspace/project/` |

**Regla:** el código y la documentación del agente viven en **Git** (`github.com/philtaboada/wavys-agent`). Local y nube comparten `main` vía `git pull` / `git push`. Lo que no va al repo (`.env.local`, `data/notes.json`, `data/reminders.json`) **no se sincroniza solo** — cada entorno tiene su copia.

---

**Raíz canónica (Windows):** Phil siempre trabaja localmente en:

```
C:\Users\siste\Project
```

Todos los repos Wavys y clientes viven como subcarpetas ahí (mismo layout que antes en Mac).

## Ejemplos

| Repo | Ruta Windows |
|------|----------------|
| **wavys-agents** (este agente) | `C:\Users\siste\Project\wavys-agents` |
| theros-front | `C:\Users\siste\Project\theros-front` |
| back-theros | `C:\Users\siste\Project\back-theros` |
| wabys-blogsite | `C:\Users\siste\Project\wabys-blogsite` |
| theros-website | `C:\Users\siste\Project\theros-website` |
| wavys-stories | `C:\Users\siste\Project\wavys-stories` |
| Landings cliente | `C:\Users\siste\Project\<slug>` |

## Flujo local + nube

### Empezar en local (tu PC)

```powershell
cd C:\Users\siste\Project
git clone https://github.com/philtaboada/wavys-agent wavys-agents
cd wavys-agents
copy .env.example .env.local   # APIs: Resend, Gemini, etc.
npm install
```

Abre `C:\Users\siste\Project\wavys-agents` en **Cursor Desktop** → trabajas como siempre.

### Trabajar en la nube

1. Abre el repo en **Cursor Cloud Agent** (o desde el móvil).
2. El agente corre en `/workspace` (mismo código, `git pull` al arrancar).
3. Otros repos cliente pueden clonarse en `/workspace/project/<slug>` si hace falta.

### Mantener sincronizado

| Qué | Cómo |
|-----|------|
| Código, skills, docs | `git commit` + `git push` (local o nube) → `git pull` en el otro |
| `.env.local` | Copiar manualmente o rellenar en cada máquina (no va a Git) |
| Notas / recordatorios (`data/*.json`) | Por ahora locales; si quieres compartir, `log_business_note` en el entorno que uses |

**Antes de codear en cualquier entorno:** `git pull` en el repo Wavys que toques.

---

## Otras máquinas

| Entorno | Raíz |
|---------|------|
| **Windows (Phil)** | `C:\Users\siste\Project` |
| Mac externo (histórico) | `/Volumes/mac externo/Mac Externo/projects/` |
| Cloud agent | `/workspace/project/` |

## Comandos típicos (Windows — PowerShell o Git Bash)

```powershell
cd C:\Users\siste\Project\wavys-agents
git pull
npm run tool -- log_business_note '{"content":"...","category":"ops"}'
```

```powershell
cd C:\Users\siste\Project\wavys-agents
npm run tool -- generate_image '{"prompt":"...","aspectRatio":"1:1","outputPath":"C:\\Users\\siste\\Project\\mi-landing\\public\\images\\hero.jpg"}'
```

## Variable de entorno (opcional)

En `.env.local` del agente:

```
PROJECTS_ROOT=C:\Users\siste\Project
```

`validate_pipeline` y scripts de captura usan `lib/projects-root.ts` (env → OS → fallback).

## Resumen rápido

- **Local:** `C:\Users\siste\Project\wavys-agents` — tu setup principal
- **Nube:** `/workspace` — mismo repo, Cloud Agent
- **Sync:** Git entre los dos; `.env.local` aparte en cada lado
