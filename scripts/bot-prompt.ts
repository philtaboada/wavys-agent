/**
 * Arma las instrucciones de un bot de Grok del Área de Marketing.
 *
 * Concatena los tres bloques en el orden del montaje documentado en
 * agent/design-kit/README.md: contexto de negocio, contrato del brief y
 * únicamente la sección de ese bot dentro de roles.md.
 *
 *   npm run bot -- content-scout
 *   npm run bot            (lista los bots disponibles)
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BOTS_DIR = resolve(ROOT, "agent/design-kit/bots");

const read = (file: string) => readFileSync(resolve(BOTS_DIR, file), "utf8");

/** Quita el título y la nota en blockquote que sólo sirven dentro del repo. */
function stripRepoHeader(markdown: string): string {
  const lines = markdown.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    const isNoise =
      line === "" || line === "---" || line.startsWith(">") || line.startsWith("# ");
    if (!isNoise) break;
    i += 1;
  }
  return lines.slice(i).join("\n").trim();
}

function listRoles(roles: string): string[] {
  return roles
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.slice(3).trim());
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function extractRole(roles: string, slug: string): { title: string; body: string } {
  const lines = roles.split("\n");
  const headings = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.startsWith("## "));

  const match = headings.find(({ line }) => slugify(line.slice(3)) === slug);
  if (!match) {
    const available = listRoles(roles)
      .map((title) => `  ${slugify(title).padEnd(20)} ${title}`)
      .join("\n");
    throw new Error(`No existe el bot "${slug}".\n\nDisponibles:\n${available}`);
  }

  const next = headings.find(({ index }) => index > match.index);
  const body = lines
    .slice(match.index, next ? next.index : lines.length)
    .join("\n")
    .replace(/\n+---\s*$/, "")
    .trim();

  return { title: lines[match.index].slice(3).trim(), body };
}

function copyToClipboard(text: string): boolean {
  try {
    execFileSync("pbcopy", { input: text });
    return true;
  } catch {
    return false;
  }
}

const roles = read("roles.md");
const slug = process.argv[2];

if (!slug) {
  console.error("Uso: npm run bot -- <bot>\n\nBots disponibles:");
  for (const title of listRoles(roles)) {
    console.error(`  ${slugify(title).padEnd(20)} ${title}`);
  }
  process.exit(1);
}

const role = extractRole(roles, slug);

const prompt = [
  stripRepoHeader(read("CONTEXTO-WAVYS.md")),
  stripRepoHeader(read("CORE.md")),
  role.body,
].join("\n\n---\n\n");

process.stdout.write(`${prompt}\n`);

const copied = copyToClipboard(prompt);
const words = prompt.split(/\s+/).length;

console.error(
  `\n[${role.title}] ${prompt.length} caracteres · ~${words} palabras` +
    (copied ? " · copiado al portapapeles" : " · pbcopy no disponible, copia de arriba"),
);
