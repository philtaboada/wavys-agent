import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const dataDir = resolve(import.meta.dirname, "..", "data");

export async function readJsonStore<T>(filename: string, fallback: T): Promise<T> {
  const path = resolve(dataDir, filename);
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonStore<T>(filename: string, value: T): Promise<string> {
  const path = resolve(dataDir, filename);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return path;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
