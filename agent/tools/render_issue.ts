import { z } from "zod";
import { issueSchema } from "../../lib/radar/issue.js";
import { renderIssue } from "../../lib/radar/render.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

const inputSchema = z
  .object({
    issue: issueSchema.optional(),
    issuePath: z
      .string()
      .optional()
      .describe("Ruta a un issue .json, ej. data/radar-issues/n3.json"),
    outDir: z
      .string()
      .optional()
      .describe("Carpeta de salida. Default: data/radar-out/<slug>"),
  })
  .refine((v) => Boolean(v.issue || v.issuePath), {
    message: "Pasa 'issue' o 'issuePath'",
  });

export default {
  description:
    "Render a full RADAR issue (1240x1754 pages + multi-page PDF) from a structured content contract. Layout lives in elastic templates over radar.css, so pages fill the sheet regardless of text length. Rejects placeholder text, missing images, overflow and half-empty pages.",
  inputSchema,
  async execute(input) {
    return renderIssue(input);
  },
} satisfies ToolDefinition<
  z.infer<typeof inputSchema>,
  Awaited<ReturnType<typeof renderIssue>>
>;
