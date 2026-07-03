---
description: Enviar correos de negocio con confirmación previa del borrador.
---

# Enviar correo

Usa esta skill cuando el usuario pida enviar, redactar o programar un correo.

## Flujo

1. Redacta asunto y cuerpo en tono profesional de Wavys.
2. Muestra el borrador completo: **para, cc, asunto, cuerpo, y el `EMAIL_FROM` que está en `.env.local`**.
3. Pide confirmación explícita antes de enviar.
4. Si `send_email` falla (403 dominio, 422, etc.): **detener, informar a Phil, no usar otro dominio/remitente** hasta que él decida. Ver `.cursor/rules/email-sending.mdc`.
5. Ejecuta solo con la config de `.env.local` — **nunca override de `EMAIL_FROM` en terminal** salvo orden explícita de Phil en ese chat.
6. Ejecuta:

```bash
npm run tool -- send_email '{"to":["..."],"subject":"...","body":"..."}'
```

## Credenciales

- Resend configurado en `.env.local` (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`)
- Ver `agent/connections/resend.md`

## Ejemplos listos

**Propuesta partner (Onza):**
```bash
npm run tool -- send_email '{"to":["asesoria@onzamarketing.com"],"subject":"Propuesta de colaboración — Automatización IA WhatsApp (Wavys)","body":"Buen día,\n\n..."}'
```

**Follow-up 48h:**
```bash
npm run tool -- send_email '{"to":["..."],"subject":"Re: Propuesta Wavys — ¿ pudieron revisar?","body":"Hola,\n\nLes escribo para confirmar si recibieron la propuesta..."}'
```

## Errores comunes

- Si falta la API key, guía al usuario a copiar `.env.example` → `.env.local`.
- No envíes HTML salvo que el usuario lo pida; entonces usa `"html": true`.
- **Dominio no verificado:** avisar a Phil; opciones = verificar DNS en Resend o que Phil ajuste `.env.local`. **No enviar desde `@theros.click` ni otros dominios sin permiso explícito.**

## Regla de oro

Phil configuró Resend para **wavys-technologies.com** (`contact@wavys-technologies.com`). Si el envío no puede salir así, **no improvisar** — preguntar primero.
