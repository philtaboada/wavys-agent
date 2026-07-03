import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

for (const file of [".env.local", ".env"]) {
  const path = resolve(root, file);
  if (existsSync(path)) {
    config({ path });
    break;
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and set it.`);
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}
