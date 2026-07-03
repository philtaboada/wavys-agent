# Integraciones

Documenta aquí cada plataforma externa. Los tools en `agent/tools/` consumen clientes en `lib/integrations/`.

## Activas

| Plataforma | Tool | Variables |
|------------|------|-----------|
| Resend | `send_email` | `RESEND_API_KEY`, `EMAIL_FROM` |
| Gemini (imágenes) | `generate_image` | `GEMINI_API_KEY` — solo `gemini-3.1-flash-lite-image` |
| Figma | MCP Cursor (`figma` / `figma-desktop`) | OAuth o Figma desktop — ver `figma-posts.md` |

## Locales (sin API externa)

| Store | Archivo | Tool |
|-------|---------|------|
| Recordatorios | `data/reminders.json` | `create_reminder` |
| Notas | `data/notes.json` | `log_business_note` |

## Próximas

Añade un archivo por plataforma, por ejemplo:

- `gmail.md` — Google Workspace / gws CLI
- `slack.md` — Slack bot
- `notion.md` — CRM o wiki

Cada doc debe incluir: credenciales, scopes, límites, y ejemplo de uso.
