import "../lib/env.js";
import { listTools, runTool } from "../lib/tools/registry.js";

async function main() {
  const [, , toolName, rawInput] = process.argv;

  if (!toolName || toolName === "--list") {
    const tools = await listTools();
    console.log(JSON.stringify({ tools }, null, 2));
    return;
  }

  if (!rawInput) {
    throw new Error(`Usage: npm run tool -- ${toolName} '<json-input>'`);
  }

  const input = JSON.parse(rawInput) as unknown;
  const result = await runTool(toolName, input);
  console.log(JSON.stringify({ ok: true, result }, null, 2));
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
