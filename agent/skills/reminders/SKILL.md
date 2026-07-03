---
description: Crear recordatorios, plazos y seguimientos del negocio.
---

# Recordatorios

Usa esta skill cuando el usuario mencione fechas, plazos, "recuérdame", seguimientos o tareas con deadline.

## Flujo

1. Extrae título claro y fecha/hora con zona horaria (ISO 8601).
2. Confirma la fecha interpretada con el usuario si fue ambigua ("el viernes", "mañana").
3. Ejecuta:

```bash
npm run tool -- create_reminder '{"title":"...","dueAt":"2026-07-05T10:00:00-05:00","notes":"..."}'
```

## Persistencia

Los recordatorios se guardan en `data/reminders.json`.

## Próximas integraciones

Cuando conectes Google Calendar, Notion o Slack, reemplaza o complementa este tool con la API correspondiente documentada en `agent/connections/`.
