# Auditoría web — herramientas (Cursor + Browser Use)

Referencia rápida cuando Phil pide **investigar / auditar** un website de cliente o prospecto.

**Skill completo:** `agent/skills/website_audit/SKILL.md`

---

## Resumen

| Herramienta | Tipo | Mejor para |
|-------------|------|------------|
| **Cursor Browser MCP** | Integrado en Cursor (navigate, screenshot, click) | Informes con **screenshots**, UX visual, probar botones en el chat |
| **Browser Use CLI** | Python → CDP → Chrome (`browser-use`) | Muchos clientes, checklists repetibles, flujos largos, cloud/Chrome real |
| **curl / terminal** | HTML y headers | Peso de página, enlaces `#`, meta, placeholders sin render |

**Regla Wavys:** usar **Cursor Browser + informe** por defecto; **Browser Use** como complemento para profundidad o batch.

---

## ¿Browser Use es solo Python?

Sí. El agente ejecuta **bloques Python** vía CLI; no es un GUI separado.

```bash
uv tool install browser-use
browser-use <<'PY'
new_tab("https://ejemplo.com")
print(page_info())
PY
```

- Chrome **local** (sesiones, cookies) o **cloud** o CDP externo
- Docs: https://docs.browser-use.com/open-source/browser-use-cli
- Instalar skill agente: `browser-use skill install`

Cursor Browser **no** usa Python — es MCP nativo (más rápido para capturas en conversación).

---

## Flujo típico (Archi / panaderías / retail)

1. Abrir URL en **Cursor Browser** → screenshots desktop + móvil 390px
2. Clic en CTAs (Ordenar, Carrito, WhatsApp)
3. `curl` para HTML pesado / links muertos
4. *(Opcional)* `browser-use` si hay que repetir en N dominios
5. Informe markdown + `log_business_note` si es prospecto

---

## Instalación (Phil — 2026-07-03)

**Estado:** `browser-use` **0.13.3** instalado vía `uv` · skill en `~/.cursor/skills/browser-use/`

```bash
uv tool install --python 3.12 --upgrade --force browser-use
browser-use skill install
browser-use --version   # 0.13.3
```

### Browser en esta Mac

- **Google Chrome:** no instalado en `/Applications`
- **Brave:** sí — perfil CDP dedicado para automatización

**Arrancar CDP antes de auditar con browser-use:**

```bash
cd "/Volumes/mac externo/Mac Externo/projects/wavys-agents"
./scripts/start-browser-cdp.sh
export BU_CDP_URL=http://127.0.0.1:9223
export BH_DOMAIN_SKILLS=1   # activa domain skill wavys-website-audit
```

Domain skill: `~/.config/browser-harness/agent-workspace/domain-skills/wavys-website-audit/SKILL.md`

**Alternativa cloud** (sin Brave local): `browser-use auth login`

### Verificar

```bash
browser-use --doctor
BU_CDP_URL=http://127.0.0.1:9223 browser-use <<'PY'
new_tab("https://example.com")
wait_for_load()
print(page_info())
PY
```

Docs: https://docs.browser-use.com/open-source/browser-use-cli
