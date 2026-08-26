import { z } from "zod";
import { flyerSchema } from "../../lib/flyer/flyer.js";
import { renderFlyer } from "../../lib/flyer/render.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

const inputSchema = z
  .object({
    flyer: flyerSchema.optional(),
    flyerPath: z
      .string()
      .optional()
      .describe("Ruta a un flyer .json, ej. data/flyer-briefs/<slug>.json"),
    outputPath: z
      .string()
      .optional()
      .describe("Ruta PNG de salida. Default: data/flyer-out/<slug>-<layout>-<WxH>.png"),
  })
  .refine((v) => Boolean(v.flyer || v.flyerPath), {
    message: "Pasa 'flyer' o 'flyerPath'",
  });

export default {
  description:
    "Render a premium Wavys flyer (PNG + PDF for a4) from a structured content contract. Five layouts with distinct photo placement and typographic voice: cartel, revista, oferta, servicios, evento. Formats: a4 1240x1754, feed 1080x1350, cuadrado 1080x1080, story 1080x1920. Layout lives in agent/flyer-kit/templates, never per piece. Rejects placeholder copy, missing photos, overflow, dead space, demoted headlines, headline widows and content inside story safe areas. Draws a QR from cta.url.",
  inputSchema,
  async execute(input) {
    return renderFlyer(input);
  },
} satisfies ToolDefinition<
  z.infer<typeof inputSchema>,
  Awaited<ReturnType<typeof renderFlyer>>
>;
