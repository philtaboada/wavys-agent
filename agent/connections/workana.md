# Workana (Arnold S)

Integración Playwright para postulación diaria.

## Cuenta

- Freelancer: **Arnold S** (no Phil / no Wavys en propuestas).
- Categoría búsqueda: IT / Programación.
- URL base: `https://www.workana.com/jobs?category=it-programming&language=xx&budget=500-1000,1000-3000,3000-5000,5000-&publication=any`

## Auth (storage state)

Workana no expone API pública de bids. Usamos **Playwright storage state** tras login manual.

### Opción A — secret env (recomendado en Cloud Agent)

1. En una máquina local con GUI:

```bash
npx tsx scripts/workana-export-session.ts
```

2. Login como Arnold S en la ventana.
3. El script escribe `data/workana-storage-state.json`.
4. Pegá el JSON completo en el secret del environment:

```
WORKANA_STORAGE_STATE_JSON=<contenido del archivo>
```

### Opción B — archivo local

```
WORKANA_STORAGE_STATE_PATH=/absolute/path/workana-storage-state.json
```

Default si no hay env: `data/workana-storage-state.json` (gitignored).

## Variables

| Var | Uso |
|-----|-----|
| `WORKANA_STORAGE_STATE_JSON` | JSON inline del storage state |
| `WORKANA_STORAGE_STATE_PATH` | Path al JSON |

## Sesión caducada

Si el tool detecta redirect a login → **parar** y pedir a Phil re-exportar el storage state. No inventar credenciales ni scrapear login.

## Selectores clave

- Listado: `#projects` / `.project-header` / `.project-body` / `.project-actions`
- Form bid: `#Amount`, `#BidDeliveryTime`, `#BidContent`
- Confirmación OK: texto **Mejorar propuesta**

## Tool

```bash
npm run tool -- workana_daily_bids '{"mode":"full","jobsPerDay":5}'
```

Skill: `agent/skills/workana_daily_bids/SKILL.md`
