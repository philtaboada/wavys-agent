import { z } from "zod";
import { reelSchema } from "../../lib/motion/clip.js";
import { renderMotion } from "../../lib/motion/render.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

const inputSchema = z
  .object({
    reel: reelSchema.optional(),
    reelPath: z
      .string()
      .optional()
      .describe("Ruta a un reel .json, ej. data/motion-reels/<slug>.json"),
    outDir: z
      .string()
      .optional()
      .describe("Carpeta de salida. Default: data/motion-out/<slug>"),
    only: z
      .array(z.string())
      .optional()
      .describe("Ids de clip a renderizar. Para iterar uno sin rehacer el reel."),
    keepFrames: z
      .boolean()
      .optional()
      .describe("Conserva los PNG por frame para inspección o reencode manual."),
    webm: z
      .boolean()
      .optional()
      .describe("Suma un WebM con alfa además del .mov (solo con transparent)."),
  })
  .refine((v) => Boolean(v.reel || v.reelPath), {
    message: "Pasa 'reel' o 'reelPath'",
  });

export default {
  description:
    "Render animated video clips (MP4, or ProRes 4444 .mov with alpha) from a structured content contract. Each clip is an independent file plus poster and 6-frame contact strip, meant to be cut into a longer video; MANIFEST.json carries cumulative timecodes. Ten scene types: kinetic type, hook, bullets, stat with count-up, logo parade, cutout reveal, quote, lower third, compare, outro. Animation lives in the GSAP template, so output is frame-identical every run. Rejects placeholder copy, missing assets and text that overflows the frame.",
  inputSchema,
  async execute(input) {
    return renderMotion(input);
  },
} satisfies ToolDefinition<
  z.infer<typeof inputSchema>,
  Awaited<ReturnType<typeof renderMotion>>
>;
