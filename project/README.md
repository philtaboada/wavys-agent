# Proyectos locales

## Windows (Phil — canónico)

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

## Cloud agent (este entorno)

```
/workspace/project/wavys-agents/
```

Clon local para el agente en la nube (en `.gitignore`).

```bash
cd /workspace/project/wavys-agents && git pull origin main && npm install
```

## Mac (histórico)

```
/Volumes/mac externo/Mac Externo/projects/
```
