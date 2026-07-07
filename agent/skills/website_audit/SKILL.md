# Skill — Auditoría de website (cliente / prospecto)

Usar cuando Phil pida **analizar**, **auditar**, **revisar** o **investigar** el website de un cliente o prospecto: diseño, UX, botones rotos, móvil, SEO básico, o informe comercial antes de proponer rediseño.

**Complementa** (no reemplaza) `one_call_landing` — la auditoría es **antes** de vender/build; el landing es **después** de cerrar.

**Gate 0 (pasos):** `agent/context/pipeline-gates.md` § `website_audit`

**Gate 1+ (calidad):** mismo doc § Gate 1+ `website_audit` — `data/pipeline-runs/<dominio>-audit-validation.md` (plantilla `_TEMPLATE-audit-validation.md`)

---

## Herramientas — enfoque dual (obligatorio entender ambas)

Phil auditará **muchos clientes**. Usar **las dos capas** según el objetivo:

| Capa | Herramienta | Qué es | Cuándo usarla |
|------|-------------|--------|---------------|
| **A — Visual + informe** | **Cursor Browser MCP** (`cursor-ide-browser`) | Navegador integrado en Cursor: navigate, snapshot, screenshot, click, scroll, CDP limitado | **Siempre** en la primera pasada. Phil quiere **screenshots**, sensación de la página, informe legible, probar botones visibles |
| **B — Automatización profunda** | **Browser Use CLI** (`browser-use`) | CLI que ejecuta **Python** contra Chrome vía CDP (Browser Harness). Local Chrome, cloud o `BU_CDP_URL` | Checklists repetibles, muchos sitios, flujos largos (carrito, login), extracción masiva, menos tokens en sesiones largas |

**No elegir solo una:** A para el deliverable comercial (capturas + informe); B cuando haga falta profundidad, repetición o script reutilizable.

---

## ¿Browser Use es “solo Python”?

**Sí, la interfaz de control es Python** — pero no es “escribir un scraper a mano y olvidarse”:

```bash
uv tool install browser-use
browser-use <<'PY'
new_tab("https://ejemplo.com")
print(page_info())
PY
```

- El agente pasa bloques Python al CLI; el CLI habla **CDP directo** con Chrome.
- Modos: **Chrome local** (tabs, cookies, sesiones), **cloud** (`browser-use auth login` + `start_remote_daemon`), o CDP externo (`BU_CDP_URL`).
- Instalación skill para Cursor/Codex: `browser-use skill install`
- Docs: https://docs.browser-use.com/open-source/browser-use-cli
- Repo harness: https://github.com/browser-use/browser-harness

**Cursor Browser** no usa Python: son tools MCP de alto nivel (más rápido para informes, snapshots más pesados en tokens).

---

## Cuándo usar qué (decisión rápida)

```
Phil pide "analiza esta web" + informe + screenshots
  → Cursor Browser (A) — obligatorio

Mismo cliente, segunda pasada / 10 clientes en batch / probar checkout completo
  → Browser Use CLI (B) — además de A o en skill guardado

Phil quiere ver la página "como usuario" en el chat
  → Cursor Browser — screenshots en la respuesta

Extracción: todos los enlaces muertos, peso HTML, formularios rotos
  → curl + Browser Use CDP; Cursor Browser para confirmar visual

Propuesta comercial Wavys (Antes/Después)
  → Cursor Browser screenshots 390px + 1440px + informe markdown
```

---

## Pipeline de auditoría (Wavys)

```
① URL + contexto → ② Cursor Browser (explorar + screenshots) → ③ Pruebas manuales (CTAs)
→ ④ curl/HTML (peso, meta, enlaces #) → ⑤ [opcional] browser-use (checklist profundo)
→ ⑥ Informe → ⑦ log_business_note si es prospecto
```

### ① Contexto

- Industria del cliente (panadería, clínica, agencia…)
- Objetivo: ¿informe comercial? ¿previo a `one_call_landing`? ¿solo bugs?
- Leer si aplica: `agent/context/website-feedback-log.md`, `website-stack-rules.md`

### ② Cursor Browser — siempre para informes

**Subagente ②:** **`explore`** + Browser MCP — capturas y pruebas CTAs. Prompt: `agent/pipelines/subagents.md` § website_audit.

1. `browser_navigate` → URL (con y sin `#` si difiere)
2. Screenshot **hero** desktop
3. Scroll: productos, footer, formularios — screenshot por sección clave
4. Emular móvil (CDP `setDeviceMetricsOverride` ~390px) — screenshot; **reportar si layout roto**
5. Probar: menú, CTA principal, carrito, WhatsApp, búsqueda
6. Snapshot para listar botones/links interactivos

**Entregables visuales mínimos:** hero desktop, una sección de producto/servicio, footer, **móvil** (390px).

### ③ Checklist funcional (manual en browser)

| Prueba | Qué anotar |
|--------|------------|
| CTA principal (Ordenar, Contacto, etc.) | ¿Navega, `#`, o no hace nada? |
| Carrito / pedido | ¿Flujo claro o muerto en `#`? |
| Formulario contacto | ¿POST real o `get` a `#`? |
| Redes sociales | ¿URLs reales o `href="#"`? |
| Tel / WhatsApp | ¿`tel:` / `wa.me` correctos? |
| Imágenes rotas | Placeholders, alt vacío |
| Tabs / carruseles | ¿Cambian contenido? |

### ④ Terminal — complemento rápido

```bash
curl -sI "https://dominio.com/" | head -15
curl -s "https://dominio.com/" | wc -c
curl -s "https://dominio.com/" | grep -oE 'href="#"|JavaScript:void' | wc -l
```

Buscar placeholders de desarrollo: `\(\([a-zA-Z]+\)\)` en HTML.

### ⑤ Browser Use CLI — opcional / batch / profundo

Instalar una vez (Mac Phil):

```bash
uv tool install --python 3.12 --upgrade --force browser-use
browser-use skill install
```

**En la Mac de Phil (2026-07-03):** instalado ✅ · skill en `~/.cursor/skills/browser-use/`

**No hay Google Chrome** — usar Brave + script del repo:

```bash
./scripts/start-browser-cdp.sh
export BU_CDP_URL=http://127.0.0.1:9223
export BH_DOMAIN_SKILLS=1
```

Domain skill: `~/.config/browser-harness/agent-workspace/domain-skills/wavys-website-audit/`

Cloud alternativo: `browser-use auth login`

Ejemplo checklist reutilizable:

```bash
browser-use <<'PY'
new_tab("https://ejemplo.com")
info = page_info()
print(info)
# Ampliar: clicks, scroll, extraer links, screenshots a BH_HOME
PY
```

**Cloud** (agente sin GUI): `browser-use auth login` → `start_remote_daemon("audit-1")` → `BU_NAME=audit-1 browser-use <<'PY' ...`

Guardar scripts repetibles en domain skills del harness (ver docs browser-harness `agent-workspace/domain-skills/`).

### ⑥ Formato del informe (español)

**Subagente ⑥ (checker):** **`generalPurpose`** readonly redacta informe desde capturas + notas del explorador — **sin** haber navegado. Prompt: `agent/pipelines/subagents.md` § audit informe. El padre revisa y adjunta screenshots.

Entregar en markdown con:

1. **Resumen ejecutivo** (3–5 líneas)
2. **Qué funciona / qué no** (tabla botones y enlaces)
3. **Diseño y UX** (tipografía, CTAs inconsistentes, fotos, móvil)
4. **Técnico / SEO básico** (URLs, H1 múltiples, peso, caché)
5. **Por qué deberían cambiar** (ventas, confianza, competencia)
6. **Recomendaciones priorizadas** (quick wins vs rediseño)
7. **Oportunidad Wavys** (landing Astro, propuesta, demo)

Incluir **screenshots** de Cursor Browser cuando Phil pida ver la página o informe comercial.

### ⑦ Persistencia

Prospecto o cliente activo:

```bash
npm run tool -- log_business_note '{"content":"Auditoría web: [dominio] — [1 línea hallazgo clave]","category":"clientes","tags":["website-audit","prospecto"]}'
```

---

## Relación con otros skills

| Skill / doc | Relación |
|-------------|----------|
| `one_call_landing` | Auditoría **antes**; rediseño **después** |
| `reference_ui_copy` | Capturas Phil de referencia; auditoría es del sitio **actual** del cliente |
| `ui-ux-pro-max` | Checklist UX adicional post-screenshots |
| `website-feedback-log.md` | Patrones a evitar al proponer rediseño |
| `design-patterns-*.md` | Crear **después** de auditoría si Phil pide demo |

---

## Instalación Browser Use (referencia Phil)

| Comando | Uso |
|---------|-----|
| `uv tool install browser-use` | Instalar CLI |
| `browser-use --help` | Ayuda |
| `browser-use --doctor` | Diagnóstico conexión Chrome |
| `./scripts/start-browser-cdp.sh` | **Mac Phil:** arranca Brave CDP (no hay Chrome instalado) |
| `export BU_CDP_URL=http://127.0.0.1:9223` | Conectar browser-use al Brave CDP |
| `browser-use skill install` | Skill para agentes |
| `uvx browser-use` | One-off sin install global |
| `browser-use auth login` | Cloud browsers |

Docs: https://docs.browser-use.com/open-source/browser-use-cli

---

## Anti-patrones

- **Solo curl** sin abrir el sitio → pierdes móvil roto y percepción visual
- **Solo Browser Use** cuando Phil pide informe con capturas → usar Cursor Browser
- Informe sin probar CTAs principales
- No probar **390px** en sitios de retail / restaurante / pastelería
- Olvidar oportunidad comercial Wavys al final del informe
