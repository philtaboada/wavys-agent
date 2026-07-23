# Campañas comerciales — Wavys

Productos empaquetados con **doc de campaña, pricing, kit de ventas y plan de marketing**. Una fila por campaña; el agente lee la campaña **activa** cuando Phil pide marketing, mensajes, contratos o cierre.

## Campaña activa

| Slug | Producto | Landing | Doc | Kit (`data/`) |
|------|----------|---------|-----|---------------|
| **wavys-os** | Wavys OS (SaaS chat-first) | *pendiente* `/wavys-os` | [wavys-os.md](./wavys-os.md) | `data/wavys-os-campaign-brief/` + producto `data/wavys-os-brief/` |

**Regla:** marketing, demos, mensajes o pricing de sistema PYME → leer **`wavys-os.md`** antes de improvisar. **No vender Presencia Digital.**

## Retiradas (no vender)

| Slug | Estado | Notas |
|------|--------|-------|
| [presencia-digital](./presencia-digital.md) | **Retirada** 2026-07-22 | Paso previo a Wavys OS; canibalizaba. Kit en `data/presencia-digital-brief/` = archivo de ideas. Landings web eliminadas. |

## Cómo agregar / cambiar campaña

1. **Contexto** — `agent/context/campaigns/<slug>.md`
2. **Kit operativo** — `data/<slug>-campaign-brief/` o equivalente
3. **Landing** — repo `theros-website` si aplica
4. **Índice** — esta tabla + `agent/instructions.md` + `growth-focus-phil.md`

## Flujo agente

```
Phil pide marketing / mensajes / demo / clientes
  → campaigns/README.md (¿cuál campaña activa?)
  → campaigns/wavys-os.md
  → data/wavys-os-campaign-brief/
  → log_business_note tag wavys-os
```

## Relación con otros docs

| Doc | Rol |
|-----|-----|
| `business-plan.md` | Estrategia general |
| `growth-focus-phil.md` | Prioridad de tiempo Phil |
| `data/wavys-os-brief/` | Producto / build (no kit de venta) |
| `brand-channels.md` | Canales donde publicar |
