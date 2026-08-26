# Affinity Studio — MCP (diseño)

Conector local para **Affinity by Canva** (Photo / Designer / Publisher unificado). No confundir con Affinity CRM (`affinity.co`).

## Qué es

Affinity 3+ incluye un servidor MCP embebido (loopback). Cursor no habla ese SSE de forma nativa como Claude Desktop, así que usamos el bridge:

| Pieza | Rol |
|-------|-----|
| Affinity app | MCP nativo en `http://localhost:6767/sse` |
| `affinity-mcp-bridge` (npm) | Traduce SSE → stdio para Cursor |
| `~/.cursor/mcp.json` → `affinity` | Arranca el bridge con `npx` |

Docs oficiales: [AI Connector setup](https://www.affinity.studio/help/ai-connector-setup/)  
Bridge: [andre-carbajal/affinity-mcp-bridge](https://github.com/andre-carbajal/affinity-mcp-bridge)

## Setup en Affinity (obligatorio)

1. Abre **Affinity.app**.
2. **Affinity → Settings → Model Context Protocol**.
3. Activa **Enable Affinity MCP** (o “Enable MCP server”).
4. Si vas a abrir/guardar archivos vía SDK, activa también acceso a **Desktop** si aparece.
5. **Reinicia Affinity**.
6. Comprueba que el puerto escucha: `lsof -nP -iTCP:6767 -sTCP:LISTEN`.

Sin Affinity abierto + MCP enabled, el bridge arranca pero `affinity_status` reportará no reachable.

## Config Cursor

Ya registrado en `~/.cursor/mcp.json`:

```json
"affinity": {
  "command": "npx",
  "args": ["-y", "affinity-mcp-bridge"],
  "env": {
    "AFFINITY_MCP_SSE_URL": "http://localhost:6767/sse"
  }
}
```

Tras editar `mcp.json`: recarga MCPs en **Cursor Settings → Tools & MCP**, o reinicia Cursor.

## Verificación

En el chat del agente:

> Usa la tool `affinity_status` y dime si Affinity está reachable.

Esperado: Affinity reachable, tools de script/SDK/render disponibles según versión.

## Requisitos

- Affinity by Canva **3.2+** en `/Applications/Affinity.app`
- Node.js 20+
- Affinity corriendo en la misma máquina

## Capacidades típicas (vía tools del MCP de Affinity)

Dependen de la versión de Affinity; el bridge las reexpone:

- Estado / health del conector
- Documentación del SDK
- Ejecutar scripts en el documento abierto
- Render de spreads o selección (preview visual)
- Librería de scripts

## Troubleshooting

| Síntoma | Qué hacer |
|---------|-----------|
| `affinity_status` no reachable | Affinity abierto + MCP enabled + reinicio |
| Puerto 6767 ocupado | `lsof -nP -iTCP:6767 -sTCP:LISTEN` — no forzar `127.0.0.1` si Affinity escucha en `::1` |
| Bridge no arranca | `node -v` ≥ 20; probar `npx -y affinity-mcp-bridge` en terminal |
| Tools no aparecen en Cursor | Recargar MCP / reiniciar Cursor |

## Notas Wavys

- Usar Affinity para edición local de assets (print, photo, vector).
- Posts sociales / design system siguen en Figma (`figma-posts.md`) salvo que Phil pida trabajo en Affinity.
- No hay API key: todo es local loopback.
- **Ícono SVG desde foto:** seguir `agent/skills/svg_icon_from_image/SKILL.md` (análisis → silueta → formas mínimas; no auto-trace).
