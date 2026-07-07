# Campañas comerciales — Wavys Software

Productos y ofertas empaquetadas con **landing, pricing, kit de ventas y plan de marketing**. Una fila por campaña; el agente lee la campaña **activa** cuando Phil pide marketing, mensajes, contratos o cierre de ese producto.

## Campaña activa

| Slug | Producto | Landing | Doc | Kit (`data/`) |
|------|----------|---------|-----|---------------|
| **presencia-digital** | Presencia Digital | [software.wavys-technologies.com/presencia-digital](https://software.wavys-technologies.com/presencia-digital) | [presencia-digital.md](./presencia-digital.md) | `data/presencia-digital-brief/` |

**Regla:** si Phil habla de «Presencia Digital», landings con fotos, S/149/mes o marketing Huancayo/Lima PYME → leer **`presencia-digital.md`** antes de improvisar.

## Próximas campañas (placeholder)

| Slug | Estado | Notas |
|------|--------|-------|
| *(vacío)* | — | Agregar fila aquí al lanzar la siguiente oferta |

## Cómo agregar una campaña nueva

1. **Contexto** — `agent/context/campaigns/<slug>.md` (producto, pricing, ICP, flujo agente).
2. **Kit operativo** — `data/<slug>-brief/` (brief, mensajes, contrato, assets, PDF).
3. **Landing** — repo `theros-website` (ruta pública en software.wavys-technologies.com).
4. **Índice** — fila en la tabla de arriba; marcar como activa.
5. **Instrucciones** — actualizar `agent/instructions.md` (sección Campañas activas).
6. **Prioridad** — si reemplaza foco comercial, actualizar `growth-focus-phil.md`.

## Flujo agente

```
Phil pide marketing / mensajes / contrato / clientes de una campaña
  → campaigns/README.md (¿cuál campaña?)
  → campaigns/<slug>.md (reglas + pricing + enlaces)
  → data/<slug>-brief/ (copy, PDF, slides, contrato)
  → log_business_note + create_reminder al cerrar lead
```

## Relación con otros docs

| Doc | Rol |
|-----|-----|
| `business-plan.md` | Estrategia general (SaaS + Software + partners) |
| `growth-focus-phil.md` | Prioridad de tiempo Phil (qué campaña manda ahora) |
| `website-stack-rules.md` | Stack de entrega (Presencia Digital → Astro vía `one_call_landing`) |
| `brand-channels.md` | Canales donde publicar (IG, LI, WhatsApp) |
