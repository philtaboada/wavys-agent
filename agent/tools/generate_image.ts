import { z } from "zod";
import { generateGeminiImage } from "../../lib/integrations/gemini-image.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

const inputSchema = z.object({
  prompt: z.string().min(1),
  outputPath: z.string().optional(),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4", "5:4"]).optional(),
  referenceImagePath: z
    .string()
    .optional()
    .describe("Ruta local para edición image-to-image (mismo modelo)"),
});

export default {
  description:
    "Generate creative visual assets with Gemini gemini-3.1-flash-lite-image (backgrounds, 3D, scenes for social posts). Requires GEMINI_API_KEY. Compose final design in Figma Agente; use this for images without text. Saves to data/generated-images/.",
  inputSchema,
  async execute(input) {
    return generateGeminiImage(input);
  },
} satisfies ToolDefinition<
  z.infer<typeof inputSchema>,
  Awaited<ReturnType<typeof generateGeminiImage>>
>;
