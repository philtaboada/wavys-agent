# Resend

Envío de correo vía [Resend](https://resend.com). **Configurado** en `.env.local` (no se sube a git).

## Variables (`.env.local`)

```env
RESEND_API_KEY=re_...
EMAIL_FROM=Wavys <contact@wavys-technologies.com>
EMAIL_REPLY_TO=contact@wavys-technologies.com
```

El dominio `wavys-technologies.com` debe estar **verificado en Resend** para enviar desde `contact@...`.

**Política (Phil — no saltear):**
- Remitente único autorizado para correos Wavys: **`contact@wavys-technologies.com`**
- La API key en `.env.local` es la de **wavys-technologies.com**
- **No usar `@theros.click` ni otros dominios** para correos comerciales de Wavys salvo que Phil lo pida explícitamente en el chat

**Estado actual (validado 2026-07-01):**
- `wavys-technologies.com` — **verified**, sending **enabled**
- `EMAIL_FROM`: `Wavys <contact@wavys-technologies.com>`

**Si el envío falla por dominio no verificado:**
1. **Detener** — no reintentar con otro From/domino
2. Informar a Phil el error exacto de Resend
3. Phil decide: verificar DNS en [Resend → Domains](https://resend.com/domains) o enviar manualmente
4. Solo reenviar cuando Phil confirme la solución

## Enviar correo (Cursor / terminal)

Siempre mostrar borrador a Phil y pedir confirmación antes de ejecutar.

```bash
# Texto plano
npm run tool -- send_email '{"to":["cliente@ejemplo.com"],"subject":"Asunto","body":"Cuerpo del mensaje"}'

# Con copia
npm run tool -- send_email '{"to":["asesoria@onzamarketing.com"],"subject":"Propuesta colaboración Wavys","body":"...","cc":["contact@wavys-technologies.com"]}'

# HTML
npm run tool -- send_email '{"to":["..."],"subject":"...","body":"<p>Hola</p>","html":true}'
```

## Respuesta exitosa

```json
{
  "ok": true,
  "result": {
    "provider": "resend",
    "id": "uuid-del-envio",
    "to": ["..."],
    "subject": "..."
  }
}
```

Guardar el `id` en `log_business_note` para trazabilidad.

## Errores frecuentes

| Error | Causa |
|-------|--------|
| `Missing RESEND_API_KEY` | Falta `.env.local` |
| 403 / domain | Dominio no verificado en Resend |
| 422 validation | Email `from` o `to` inválido |

## Seguridad

- Nunca pegar la API key en chat, commits ni issues.
- Si se expuso, rotar en Resend Dashboard → API Keys.
