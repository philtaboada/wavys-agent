import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  validateAudit,
  validateBrief,
  validateContent,
  validateCutout,
  validateImage,
  validateLanding,
  validateNext,
  validateReference,
  validateSales,
  validateSocial,
  validateVideo,
} from "./checks.js";
import type { CheckResult, ValidateContext, ValidationOutput } from "./types.js";
import { formatReport, summarizeChecks } from "./utils.js";

export const PIPELINES = [
  "one_call_landing",
  "one_call_website",
  "reference_ui_copy",
  "image_generation",
  "image_cutout",
  "content_production",
  "social_design",
  "video_production",
  "website_audit",
  "presencia_brief",
  "sales_pipeline",
] as const;

export type PipelineName = (typeof PIPELINES)[number];

const DEFAULT_PROJECTS_ROOT = "/Volumes/mac externo/Mac Externo/projects";

export function resolveRepoRoot(): string {
  return resolve(import.meta.dirname, "../..");
}

export function resolveReportPath(
  repoRoot: string,
  pipeline: PipelineName,
  slug: string,
): string {
  const dir = join(repoRoot, "data/pipeline-runs");
  const suffix: Record<PipelineName, string> = {
    one_call_landing: "validation",
    one_call_website: "next-validation",
    reference_ui_copy: "reference-validation",
    image_generation: "image-validation",
    image_cutout: "image-validation",
    content_production: "content-validation",
    social_design: "social-validation",
    video_production: "video-validation",
    website_audit: "audit-validation",
    presencia_brief: "brief-validation",
    sales_pipeline: "sales-validation",
  };
  return join(dir, `${slug}-${suffix[pipeline]}.md`);
}

async function runChecks(
  pipeline: PipelineName,
  ctx: ValidateContext,
): Promise<CheckResult[]> {
  switch (pipeline) {
    case "one_call_landing":
      return validateLanding(ctx);
    case "one_call_website":
      return validateNext(ctx);
    case "reference_ui_copy":
      return validateReference(ctx);
    case "image_generation":
      return validateImage(ctx);
    case "image_cutout":
      return validateCutout(ctx);
    case "content_production":
      return validateContent(ctx);
    case "social_design":
      return validateSocial(ctx);
    case "video_production":
      return validateVideo(ctx);
    case "website_audit":
      return validateAudit(ctx);
    case "presencia_brief":
      return validateBrief(ctx);
    case "sales_pipeline":
      return validateSales(ctx);
    default:
      throw new Error(`Pipeline no soportado: ${pipeline}`);
  }
}

export type ValidatePipelineInput = Omit<
  ValidateContext,
  "repoRoot" | "projectsRoot"
> & {
  pipeline: PipelineName;
  projectsRoot?: string;
  writeReport?: boolean;
};

export async function validatePipeline(
  input: ValidatePipelineInput,
): Promise<ValidationOutput> {
  const repoRoot = resolveRepoRoot();
  const projectsRoot = input.projectsRoot ?? DEFAULT_PROJECTS_ROOT;
  const ctx: ValidateContext = {
    ...input,
    repoRoot,
    projectsRoot,
    runBuild: input.runBuild ?? false,
  };

  if (
    !ctx.projectPath &&
    ["one_call_landing", "one_call_website", "reference_ui_copy"].includes(
      input.pipeline,
    )
  ) {
    ctx.projectPath = join(projectsRoot, input.slug);
  }

  const checks = await runChecks(input.pipeline, ctx);
  const { summary, authorized, manualRemaining } = summarizeChecks(checks);

  const output: ValidationOutput = {
    pipeline: input.pipeline,
    slug: input.slug,
    checks,
    summary,
    authorized,
    manualRemaining,
  };

  if (input.writeReport !== false) {
    const reportPath =
      input.reportPath ?? resolveReportPath(repoRoot, input.pipeline, input.slug);
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, formatReport({ ...output, reportPath }), "utf8");
    output.reportPath = reportPath;
  }

  return output;
}
