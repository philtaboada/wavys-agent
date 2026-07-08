# Proyectos — local + nube

Phil usa **dos entornos** con el mismo agente:

| Entorno | Ruta wavys-agents |
|---------|-------------------|
| **Local (Windows)** | `C:\Users\siste\Project\wavys-agents` |
| **Nube (Cloud Agent)** | `/workspace` (repo principal) o `/workspace/project/wavys-agents/` |

Detalle completo: `agent/context/projects-path.md`

## Windows (local — principal)

```
C:\Users\siste\Project
```

**wavys-agents:** `C:\Users\siste\Project\wavys-agents`

Ver `agent/context/projects-path.md` para todos los repos y comandos.

### Clonar o actualizar (Windows)

```powershell
cd C:\Users\siste\Project
git clone https://github.com/philtaboada/wavys-agent wavys-agents
cd wavys-agents
git pull origin main
npm install
copy .env.example .env.local
```

## Cloud agent (nube — además de local)

El mismo repo se puede abrir en **Cursor Cloud Agent**. El workspace raíz es `/workspace`.

```bash
cd /workspace && git pull origin main
npm run tools
```

Clon espejo (otros repos junto al agente): `/workspace/project/wavys-agents/` — en `.gitignore`.

```bash
cd /workspace/project/wavys-agents && git pull origin main && npm install
```

**Sync con tu PC:** push desde local o nube → `git pull` en el otro. `.env.local` no viaja por Git.

## Mac (histórico)

```
/Volumes/mac externo/Mac Externo/projects/
```
