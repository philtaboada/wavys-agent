---
description: Capturar decisiones, contexto de clientes y notas operativas del negocio.
---

# Notas de negocio

Usa esta skill cuando el usuario comparta contexto que deba recordarse en futuras sesiones: preferencias de clientes, decisiones, procesos, acuerdos.

## Flujo

1. Resume en una frase qué vas a guardar.
2. Elige categoría (`clientes`, `operaciones`, `finanzas`, `producto`, `general`).
3. Añade tags cortos si ayudan a buscar después.
4. Ejecuta:

```bash
npm run tool -- log_business_note '{"content":"...","category":"clientes","tags":["facturacion"]}'
```

## Cuándo usar

- El usuario dice "recuerda que...", "anota que...", "para la próxima vez..."
- Tras una decisión importante en la conversación
- Antes de cerrar un hilo con contexto útil

## Consultar notas

Lee `data/notes.json` cuando necesites contexto previo.
