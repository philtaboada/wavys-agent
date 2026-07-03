import { readdir } from "node:fs/promises";
import { basename, extname, resolve } from "node:path";
import type { ToolMeta } from "./types.js";

const toolsDir = resolve(import.meta.dirname, "../../agent/tools");

export async function listTools(): Promise<ToolMeta[]> {
  const files = await readdir(toolsDir);
  const metas: ToolMeta[] = [];

  for (const file of files.sort()) {
    if (extname(file) !== ".ts") continue;
    const name = basename(file, ".ts");
    const mod = await import(`../../agent/tools/${name}.js`);
    const tool = mod.default;
    metas.push({ name, description: tool.description });
  }

  return metas;
}

export async function runTool(name: string, input: unknown) {
  const mod = await import(`../../agent/tools/${name}.js`);
  const tool = mod.default;
  const parsed = tool.inputSchema.parse(input);
  return tool.execute(parsed);
}
