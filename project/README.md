# Proyectos locales (cloud / entorno agente)

Espejo de la carpeta Mac:

```
/Volumes/mac externo/Mac Externo/projects/
```

En este entorno, los repos viven bajo `project/` dentro del workspace.

## wavys-agents

| Campo | Valor |
|-------|-------|
| Carpeta | `project/wavys-agents/` |
| Repo | https://github.com/philtaboada/wavys-agent |
| Uso | Agente de operaciones Wavys (ventas, email, notas, imágenes) |

### Clonar o actualizar

```bash
cd /workspace/project
git clone https://github.com/philtaboada/wavys-agent wavys-agents   # primera vez
cd wavys-agents && git pull origin main && npm install              # actualizar
```

### Configuración

```bash
cp .env.example .env.local   # completar GEMINI_API_KEY, RESEND_API_KEY, etc.
npm run tools
npm run tool -- log_business_note '{"content":"test","category":"ops"}'
```

### Nota

El clon en `project/wavys-agents/` está en `.gitignore` (repo git anidado). El workspace raíz (`/workspace`) es el mismo proyecto cuando Cursor abre este repo directamente.
