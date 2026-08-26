#!/usr/bin/env node
// RADAR N°2 — generador de escenas fotográficas.
//
// LOCK (Phil): único modelo permitido para foto de interiores.
//   modelo    gemini-3.1-flash-lite-image  (Nano Banana Lite)
//   endpoint  POST https://generativelanguage.googleapis.com/v1beta/interactions
//   header    x-goog-api-key
//   body      model + input + response_format {type:image, mime_type, aspect_ratio, image_size:1K}
// Prohibido cualquier otro generador (DALL-E, Flux, Midjourney, Grok, stock, Unsplash)
// y cualquier otro modelo Gemini.
//
// LOCK N°2: cero cara de Phil, cero cara de nadie, cero cyborg, cero retrato.
// El motivo del número es recepción / teléfono de escritorio / UNA silla vacía.
// Nada de café (Phil no toma café). Nada de interfaz legible ni texto pegado.
//
// Uso:
//   node radar-n2/scripts/gen-scenes.mjs             # genera lo que falta
//   node radar-n2/scripts/gen-scenes.mjs --force     # regenera todo
//   node radar-n2/scripts/gen-scenes.mjs escena-tapa.jpg

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const OUT_DIR = resolve(HERE, "..", "img");

const MODEL = "gemini-3.1-flash-lite-image";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const IMAGE_SIZE = "1K";

// Espina de estilo del N°2: documental, luz real, sin nadie en el cuadro.
const STYLE = [
  "Editorial documentary photograph for a print magazine, 35mm lens, natural available light,",
  "muted realistic colour, fine film grain, shallow depth of field,",
  "absolutely no people, no faces, no portraits, no hands, no bodies, nobody in frame,",
  "no text overlay, no captions, no watermark, no logos, no brand marks, no signage with words,",
  "no readable screen, no invented user interface, nothing added in post,",
  "real worn surfaces of a small working clinic or office, honest and unstyled",
].join(" ");

const NO_DRINK = "No coffee, no tea, no mug, no cup, no drink, no beverage, no ring stain.";

/** @type {{file:string, aspectRatio:string, page:string, prompt:string}[]} */
const SCENES = [
  {
    file: "escena-tapa.jpg",
    aspectRatio: "3:4",
    page: "01 · Tapa",
    prompt: `${STYLE}. Vertical 3:4 magazine cover photograph of a small clinic reception at 10 in the morning, shot straight on from chest height, wide enough that the room fills the whole frame. A grey laminate reception counter runs across the lower third. On the counter, sharp and unmistakable in the foreground, a black corded desk telephone with the handset resting on its cradle and one small amber message-waiting light glowing on the body of the phone. Behind and to the right of the counter, ONE single empty waiting chair — moulded plastic seat, thin metal legs — pulled slightly away from the wall, clearly unoccupied, catching a soft rectangle of daylight from a window out of frame to the left. Nobody in the room. Cool grey-green wall, a scuffed skirting board, a closed door in shadow at the back. Deep quiet. The telephone and the empty chair are the two subjects and both read instantly. Photorealistic, restrained, ink-dark shadows, no warmth of a hotel lobby, this is a working front desk. ${NO_DRINK}`,
  },
  {
    file: "escena-telefono.jpg",
    aspectRatio: "3:4",
    page: "04a · Apertura del tema",
    prompt: `${STYLE}. Vertical 3:4. Close low three-quarter view of a black corded desk telephone sitting on a reception counter, handset on the cradle, coiled cord falling off the edge of the counter, a single small amber or red message-waiting lamp lit on the phone body, the plastic scuffed and slightly yellowed from years of use. Behind the phone, thrown out of focus, the pale shape of ONE empty chair in a waiting area. Hard side light from a window on the left carving the phone out of the dark; the background falls to near black. The phone is heroic and slightly menacing, like an object in a still life. No display text, no keypad labels legible, no logos on the phone. ${NO_DRINK}`,
  },
  {
    file: "escena-silla.jpg",
    aspectRatio: "4:3",
    page: "04c · Casos",
    prompt: `${STYLE}. Horizontal 4:3. A clinic waiting area photographed from a low seated height: a row of moulded waiting chairs against a wall, and the one nearest the camera is empty and turned very slightly out of line, its seat catching hard window light while the rest of the row falls into shadow. Worn vinyl floor with scuff marks, a skirting board, the corner of a low table with a stack of blank paper forms. Nobody at all in the frame. Late morning, the appointment did not arrive. Quiet and factual, documentary, not staged, not a furniture catalogue. ${NO_DRINK}`,
  },
  {
    file: "escena-recepcion.jpg",
    aspectRatio: "4:3",
    page: "03 · Señal",
    prompt: `${STYLE}. Horizontal 4:3. The working side of a small practice front desk at 8 in the morning, shot from a low three-quarter angle behind the counter: a desktop monitor turned away so the screen is only a soft out-of-focus glow with no legible content, a corded desk telephone with the handset off to one side, a spiral notebook, a small tray of blank appointment slips, a stapler, a cable run taped down along the edge. Cold blue morning light from a window behind, dust in the air, the monitor glow the brightest thing in the frame. Nobody in the frame. Nothing legible anywhere. ${NO_DRINK}`,
  },
  {
    file: "escena-carta.jpg",
    aspectRatio: "1:1",
    page: "02 · Carta",
    prompt: `${STYLE}. Square 1:1. Top-down close view of a working desk at night: one printed sheet of paper with a short typed letter, the paper slightly curled, a ballpoint pen resting across it, a folded notebook, and at the top edge of the frame the base of a black desk telephone with its coiled cord crossing the paper. Warm single desk lamp from the left, deep soft shadow to the right, paper fibre visible. Quiet and hand-made. The typed text must be completely out of focus and unreadable. Nobody in the frame, no hands. ${NO_DRINK}`,
  },
  {
    file: "escena-agenda.jpg",
    aspectRatio: "16:9",
    page: "04b · Relato",
    prompt: `${STYLE}. Wide 16:9 macro band across a paper appointment book open on a reception counter: ruled time slots down the left, most lines filled in with ballpoint handwriting, and one slot in the middle of the frame conspicuously blank with a single pen stroke through it. The coiled cord of a desk telephone enters from the right edge, out of focus. Raking side light so the paper grain and the pen indentations show. Handwriting completely illegible, no readable words or numbers. Nobody in the frame, no hands. ${NO_DRINK}`,
  },
  {
    file: "escena-oficio.jpg",
    aspectRatio: "16:9",
    page: "05 · Más notas",
    prompt: `${STYLE}. Wide 16:9 low-contrast band, night: the corner of a small practice back office lit only by one screen out of frame — a desk telephone in silhouette, a keyboard, a stack of paper folders, a dental or medical instrument tray at the far right edge, everything reduced to edges and one cold highlight. Deep shadow across two thirds of the band. Nobody in the frame. No legible screen, no invented interface, no logos. ${NO_DRINK}`,
  },
  {
    file: "escena-cierre.jpg",
    aspectRatio: "3:4",
    page: "09 · Contratapa",
    prompt: `${STYLE}. Vertical 3:4. A small practice reception after closing, main lights off: the counter in the foreground with the desk telephone still on it, handset on the cradle, one small standby lamp glowing on the phone; behind the counter ONE empty chair pulled out at an angle, and the shutter or glass door half dark at the back. Cool blue night light from the street outside. Completely empty of people, end of the day, the day already decided. Quiet, honest, no logos, nothing legible. ${NO_DRINK}`,
  },
];

function loadKey() {
  if (process.env.GEMINI_API_KEY) return Promise.resolve(process.env.GEMINI_API_KEY.trim());
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

async function generate(scene, key) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      input: scene.prompt,
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
    console.log(
      `ok     ${scene.file}  ${scene.aspectRatio}  ${(bytes / 1024).toFixed(0)} KB  → ${scene.page}`,
    );
  } catch (error) {
    console.error(`FALLO  ${error.message}`);
    process.exitCode = 1;
  }
}
