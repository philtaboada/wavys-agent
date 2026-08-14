#!/usr/bin/env node
// RADAR N°1 — generador de escenas fotográficas.
//
// LOCK (Phil, 14 ago 2026): único modelo permitido para foto de interiores.
//   modelo    gemini-3.1-flash-lite-image  (Nano Banana Lite)
//   endpoint  POST https://generativelanguage.googleapis.com/v1beta/interactions
//   header    x-goog-api-key
//   body      model + input + response_format {type:image, mime_type, aspect_ratio, image_size:1K}
// Prohibido cualquier otro generador (DALL-E, Flux, Midjourney, Grok, stock, Unsplash)
// y cualquier otro modelo Gemini. Prohibido inventar personas: estas escenas no
// llevan caras — objetos, manos, mostrador, papel.
//
// Uso:
//   node radar-n1/scripts/gen-scenes.mjs             # genera lo que falta
//   node radar-n1/scripts/gen-scenes.mjs --force     # regenera todo
//   node radar-n1/scripts/gen-scenes.mjs escena-correo.jpg
//
// La API key se lee de GEMINI_API_KEY o de .env.local en la raíz del repo.

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, resolve, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const OUT_DIR = resolve(HERE, "..", "img");

const MODEL = "gemini-3.1-flash-lite-image";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const IMAGE_SIZE = "1K";

// Espina de estilo común: documental, luz real, sin caras, sin texto pegado.
const STYLE = [
  "Editorial documentary photograph for a print magazine feature, 35mm lens, natural available light,",
  "muted realistic colour, fine film grain, shallow depth of field, no people's faces, no portraits,",
  "no text overlay, no captions, no watermark, no logos, no brand marks, nothing added in post,",
  "real worn surfaces of a small working business, honest and unstyled",
].join(" ");

/** @type {{file:string, aspectRatio:string, page:string, prompt:string}[]} */
const SCENES = [
  {
    file: "escena-carta.jpg",
    aspectRatio: "1:1",
    page: "02 · Editor's Note",
    prompt: `${STYLE}. Top-down close view of a working desk at night: one printed sheet of paper with a short typed letter, the paper slightly curled, a ballpoint pen resting across it, a folded notebook, a cooling cup of coffee with a ring stain, a pair of reading glasses at the edge. Warm single desk lamp from the left, deep soft shadow to the right, paper texture and fibre visible. Quiet, human, hand-made feeling. Text on the paper must be out of focus and unreadable.`,
  },
  {
    file: "escena-correo.jpg",
    aspectRatio: "4:3",
    page: "03 · Signal",
    prompt: `${STYLE}. A small business back-office desk at 8am, photographed from a low three-quarter angle: an open laptop turned slightly away so the screen shows only a soft glowing list of email rows, completely out of focus and unreadable, a mobile phone lying face-up next to it with a dim screen, a spiral notebook with pen, a mug. Cold blue morning light from a window behind, dust in the air. The laptop screen is the brightest thing in the frame. No readable interface, no fabricated app windows, nothing legible.`,
  },
  {
    file: "escena-chat-hoja.jpg",
    aspectRatio: "3:4",
    page: "04 · Tema central (apertura)",
    prompt: `${STYLE}. Vertical overhead-ish view of a delivery business counter, shot at a slight angle: a mobile phone lying face-up on a scratched laminate counter, its screen showing a long messaging conversation as soft blurred speech bubbles, unreadable; right next to the phone a handwritten paper order form on a small pad, ballpoint handwriting filling ruled lines and columns, a blue pen across it, a stack of more order slips held by a clip, a roll of packing tape at the corner. Fluorescent shop light mixed with daylight, honest clutter, no faces. The phone conversation and the paper form must sit side by side as the two subjects of the photograph. Nothing legible on the screen.`,
  },
  {
    file: "escena-hoja-estado.jpg",
    aspectRatio: "16:9",
    page: "04 · Tema central (relato)",
    prompt: `${STYLE}. Extreme close macro band across a printed spreadsheet on a desk: grid of ruled columns filled in by hand with ballpoint, some cells crossed out, some circled, the paper slightly wrinkled and coffee marked; the metal edge of a mobile phone enters the frame from the right, out of focus. Raking side light so the paper grain and the pen indentations are visible. No readable words, numbers illegible, no interface.`,
  },
  {
    file: "escena-mostrador.jpg",
    aspectRatio: "4:3",
    page: "04 · Tema central (casos)",
    prompt: `${STYLE}. The dispatch end of a small business counter: three or four cardboard parcels taped and stacked ready to go out, a paper order pad with handwriting, a mobile phone face-down on top of the pad, a marker pen, a roll of tape; a pair of hands only, from the wrist down, writing on the pad at the right edge of the frame. Afternoon window light, no face visible, no head, no portrait. Documentary and unstyled.`,
  },
  {
    file: "escena-browser.jpg",
    aspectRatio: "16:9",
    page: "05 · Más noticias",
    prompt: `${STYLE}. Wide low-contrast band: a laptop seen over the shoulder in a dark room, the screen showing a browser window with a bright page and a narrow vertical panel at its right side, everything soft and unreadable, screen light spilling onto the keyboard and onto a desk edge. Night, only screen light, no lamp. No legible interface, no fabricated app, no faces.`,
  },
  {
    file: "escena-cierre.jpg",
    aspectRatio: "3:4",
    page: "09 · Contratapa",
    prompt: `${STYLE}. Vertical frame of a small shop after closing: the counter in the foreground, shutter half down at the back, main lights off, one mobile phone left charging on the counter with its cable, screen dark, a stool, a paper pad. Cool blue night light from the street outside plus the faint glow of one small standby light. Empty, quiet, end of the day, no people at all.`,
  },
];

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  return readFile(resolve(ROOT, ".env.local"), "utf8")
    .then((raw) => {
      const line = raw.split(/\r?\n/).find((l) => l.startsWith("GEMINI_API_KEY="));
      if (!line) throw new Error("GEMINI_API_KEY ausente en .env.local");
      return line.slice("GEMINI_API_KEY=".length).trim();
    })
    .catch(() => {
      throw new Error(
        "Falta GEMINI_API_KEY (env o .env.local). No generes con otro modelo: deja el slot y anota el prompt en SCENES.md.",
      );
    });
}

function extractImage(payload) {
  const stack = [payload];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    if (node.type === "image" && typeof node.data === "string") return node.data;
    if (node.output_image?.data) return node.output_image.data;
    stack.push(...Object.values(node));
  }
  return undefined;
}

async function readReference(path) {
  const abs = resolve(ROOT, path);
  const buffer = await readFile(abs);
  const ext = extname(abs).toLowerCase();
  const mime_type =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
        ? "image/webp"
        : "image/png";
  return { type: "image", mime_type, data: buffer.toString("base64") };
}

async function generate(scene, key) {
  const input = scene.referenceImage
    ? [{ type: "text", text: scene.prompt }, await readReference(scene.referenceImage)]
    : scene.prompt;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      input,
      response_format: {
        type: "image",
        mime_type: "image/jpeg",
        aspect_ratio: scene.aspectRatio,
        image_size: IMAGE_SIZE,
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      `${scene.file}: HTTP ${response.status} ${payload?.error?.message ?? JSON.stringify(payload).slice(0, 300)}`,
    );
  }
  const data = extractImage(payload);
  if (!data) throw new Error(`${scene.file}: la respuesta no trajo imagen`);

  const buffer = Buffer.from(data, "base64");
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(resolve(OUT_DIR, scene.file), buffer);
  return buffer.byteLength;
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--")).map((a) => basename(a));

const key = await loadKey();
const queue = SCENES.filter((s) => only.length === 0 || only.includes(s.file));

for (const scene of queue) {
  const target = resolve(OUT_DIR, scene.file);
  if (!force) {
    const exists = await access(target).then(
      () => true,
      () => false,
    );
    if (exists) {
      console.log(`skip   ${scene.file} (ya existe, usa --force)`);
      continue;
    }
  }
  try {
    const bytes = await generate(scene, key);
    console.log(`ok     ${scene.file}  ${scene.aspectRatio}  ${(bytes / 1024).toFixed(0)} KB  → ${scene.page}`);
  } catch (error) {
    console.error(`FALLO  ${error.message}`);
    process.exitCode = 1;
  }
}
