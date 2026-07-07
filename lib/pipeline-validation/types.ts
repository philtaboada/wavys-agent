export type CheckTier = "CRITICAL" | "HIGH" | "MEDIUM";

export type CheckResult = {
  id: string;
  tier: CheckTier;
  pass: boolean;
  message: string;
  measured?: string;
  manual?: boolean;
};

export type ValidationSummary = {
  critical: { total: number; pass: number; fail: number };
  high: { total: number; pass: number; fail: number; pct: number };
  medium: { total: number; pass: number; fail: number; pct: number };
};

export type ValidationOutput = {
  pipeline: string;
  slug: string;
  checks: CheckResult[];
  summary: ValidationSummary;
  authorized: boolean;
  manualRemaining: string[];
  reportPath?: string;
};

export type ValidateContext = {
  repoRoot: string;
  projectsRoot: string;
  slug: string;
  runBuild: boolean;
  projectPath?: string;
  patternsDocPath?: string;
  imagePath?: string;
  cutoutPath?: string;
  htmlPath?: string;
  pdfPath?: string;
  copyPath?: string;
  reportPath?: string;
  videoDir?: string;
  noteTag?: string;
  stack?: "astro" | "next";
};
