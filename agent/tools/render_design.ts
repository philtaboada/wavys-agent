import { z } from "zod";
import { briefSchema } from "../../lib/design/brief.js";
import { renderDesign } from "../../lib/design/render.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

const inputSchema = z
  .object({
    brief: briefSchema.optional(),
    briefPath: z
      .string()
      .optional()
      .describe("Ruta a un brief .json, ej. data/design-briefs/<slug>.json"),
    outputPath: z
      .string()
      .optional()
      .describe(
        "Ruta PNG de salida. Default: data/design-out/<slug>-<WxH>.png",
      ),
  })
  .refine((v) => Boolean(v.brief || v.briefPath), {
    message: "Pasa 'brief' o 'briefPath'",
  });

export default {
  description:
    "Render a brand-locked social design (PNG) from a structured brief, inline or from a .json file. Layout, Rubik typography and Wavys tokens live in the template, so output is identical every run. Channels: linkedin 1080x1080, instagram 1080x1350, story 1080x1920. Rejects briefs whose copy overflows the canvas.",
  inputSchema,
  async execute(input) {
    return renderDesign(input);
  },
} satisfies ToolDefinition<
  z.infer<typeof inputSchema>,
  Awaited<ReturnType<typeof renderDesign>>
>;
