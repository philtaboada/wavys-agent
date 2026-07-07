import { z } from "zod";
import {
  PIPELINES,
  validatePipeline,
} from "../../lib/pipeline-validation/index.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

const inputSchema = z.object({
  pipeline: z.enum(PIPELINES),
  slug: z.string().min(1),
  projectPath: z.string().optional(),
  patternsDocPath: z.string().optional(),
  imagePath: z.string().optional(),
  cutoutPath: z.string().optional(),
  htmlPath: z.string().optional(),
  pdfPath: z.string().optional(),
  copyPath: z.string().optional(),
  reportPath: z.string().optional(),
  videoDir: z.string().optional(),
  noteTag: z.string().optional(),
  stack: z.enum(["astro", "next"]).optional(),
  runBuild: z.boolean().optional().default(false),
  writeReport: z.boolean().optional().default(true),
  projectsRoot: z.string().optional(),
});

export default {
  description:
    "Run automated quality gates for a Wavys pipeline (Gate 1+). Writes a markdown report to data/pipeline-runs/ and returns pass/fail summary. Manual checks are listed but not auto-passed.",
  inputSchema,
  async execute(input) {
    return validatePipeline(input);
  },
} satisfies ToolDefinition<
  z.infer<typeof inputSchema>,
  Awaited<ReturnType<typeof validatePipeline>>
>;
