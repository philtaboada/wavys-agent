# Wavys OS — Dominios

**Pregunta:** ¿subdominio automático o también dominio propio con DNS?

---

## 1. Decisión MVP

| Fase | Qué | Por qué |
|------|-----|---------|
| **MVP** | Solo **`{slug}.wavys.app`** (o `.wavys.pe`) | Cero fricción; onboarding en minutos |
| **Operate+** | Opción **dominio propio** (DNS) | Quien ya tiene marca/dominio |

**Recomendación:** empezar **solo subdominio**. Dominio custom en cuanto el checkout Polar + Operate estén estables.

El `slug` sale del nombre del negocio (sanitizado): `Ferretería El Tornillo` → `el-tornillo` (si choca, `el-tornillo-2`).

---

## 2. Subdominio (MVP)

1. Al fijar BrandKit / nombre → proponer slug.  
2. Usuario confirma.  
3. DNS wildcard `*.wavys.app` → panel/edge enruta por `Host` al tenant.  
4. SSL automático (Vercel/Cloudflare).

**Config Wavys (una vez):** wildcard DNS + certificado wildcard.  
**Usuario:** no configura nada.

---

## 3. Dominio propio (después)

Usuario compra/apunta `www.suempresa.com`:

| Paso usuario | Qué hace |
|--------------|----------|
| 1 | En chat: “Quiero usar midominio.com” |
| 2 | Sistema muestra: crea registro **CNAME** `www` → `cname.vercel-dns.com` (o el que diga el host) **o** A/AAAA según proveedor |
| 3 | Añade dominio en proyecto Vercel (API) |
| 4 | Espera propagación (minutos–48h) |
| 5 | Chat: “¿Ya apuntaste? Verificar” → check DNS → SSL |

**Complejidad:** soporte humano cuando DNS falla (TTL, proxy Cloudflare naranja, etc.). Por eso **no** en el primer MVP.

---

## 4. Resumen

- **Mejor para lanzar:** solo subdominio.  
- **Mejor a medio plazo:** subdominio default + custom DNS en Operate/Scale.  
- Nunca bloquear onboarding por DNS.

---

*Ubicación:* `data/wavys-os-brief/dominios.md`
