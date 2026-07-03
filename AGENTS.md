# Wavys Agents

Agente de negocio inspirado en [eve](https://eve.dev/docs), pero **orquestado por Cursor** (no por el runtime de eve).

Cursor lee este proyecto, interpreta `agent/instructions.md`, carga skills bajo demanda y ejecuta tools vía terminal.

## Arranque rápido

1. Copia `.env.example` → `.env.local` y completa las APIs que uses.
2. Instala dependencias: `npm install`
3. Lista tools disponibles: `npm run tools`
4. En Cursor, pide tareas de negocio en lenguaje natural.

## Estructura (paridad con eve)

| Carpeta | Rol |
|---------|-----|
| `agent/instructions.md` | Identidad y reglas permanentes (como eve instructions) |
| `agent/skills/` | Procedimientos bajo demanda (como eve skills) |
| `agent/tools/` | Acciones tipadas ejecutables (como eve tools) |
| `agent/connections/` | Documentación de integraciones externas |
| `lib/` | Código compartido (clientes API, store, registry) |
| `data/` | Persistencia local (notas, recordatorios) |
| `.cursor/rules/` | Reglas para que Cursor opere el agente |

## Cómo ejecutar tools

Cursor debe invocar tools con JSON validado:

```bash
npm run tool -- send_email '{"to":["cliente@ejemplo.com"],"subject":"Seguimiento","body":"Hola..."}'
npm run tool -- create_reminder '{"title":"Llamar proveedor","dueAt":"2026-07-05T10:00:00-05:00"}'
npm run tool -- log_business_note '{"content":"El cliente prefiere facturación mensual","category":"clientes","tags":["facturacion"]}'
```

Listar tools:

```bash
npm run tools
```

## Flujo recomendado para Cursor

1. Leer `agent/instructions.md`.
2. Si la tarea encaja con un skill, leer ese `SKILL.md` primero.
3. Confirmar con el usuario acciones de escritura (email, recordatorios críticos).
4. Ejecutar el tool correspondiente y reportar el JSON de salida.
5. Si no existe tool, proponer crear uno en `agent/tools/` + integración en `lib/integrations/`.

## Agregar una integración nueva

1. Documentar credenciales en `agent/connections/<plataforma>.md`.
2. Crear cliente en `lib/integrations/<plataforma>.ts`.
3. Crear `agent/tools/<nombre>.ts` con `description`, `inputSchema` (zod) y `execute`.
4. El registry lo detecta automáticamente.
5. Añadir skill si el flujo es largo o repetitivo.

## Diferencia vs eve

- **eve**: loop del modelo + servidor HTTP + channels + sandbox.
- **wavys-agents**: Cursor es el loop; este repo define instrucciones, skills y tools ejecutables.

No se requiere `AI_GATEWAY_API_KEY` ni `eve dev` para operar desde Cursor.

Skills globales recomendados: `agent/context/recommended-skills.md`
