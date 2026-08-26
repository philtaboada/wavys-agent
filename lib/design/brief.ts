import { z } from "zod";

/**
 * Los límites de caracteres no son estilísticos: son el ancho real que soporta
 * cada slot del canvas 1080px con Rubik en su tamaño de marca. Pasarse rompe el
 * layout, así que el brief se rechaza antes de renderizar.
 */
export const LIMITS = {
  eyebrow: 28,
  hookLine: 34,
  body: 130,
  proofItem: 46,
  proofCount: 4,
  ctaLabel: 26,
  footnote: 60,
} as const;

export const CANVAS = {
  linkedin: { width: 1080, height: 1080 },
  instagram: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;

const limited = (max: number, field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field} no puede ir vacío`)
    .max(max, `${field} supera ${max} caracteres y rompe el layout`);

export const briefSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug debe ser kebab-case en minúsculas"),
  channel: z.enum(["linkedin", "instagram", "story"]),
  family: z.enum(["agente", "ventas", "editorial"]).default("agente"),
  eyebrow: limited(LIMITS.eyebrow, "eyebrow").optional(),
  hook: z.object({
    line1: limited(LIMITS.hookLine, "hook.line1"),
    line2: limited(LIMITS.hookLine, "hook.line2").optional(),
  }),
  body: limited(LIMITS.body, "body").optional(),
  proof: z
    .array(limited(LIMITS.proofItem, "proof[]"))
    .max(LIMITS.proofCount, `proof admite máximo ${LIMITS.proofCount} bullets`)
    .optional(),
  cta: z.object({
    label: limited(LIMITS.ctaLabel, "cta.label"),
    style: z.enum(["button", "italic"]).default("button"),
  }),
  asset: z
    .object({
      path: z.string().min(1),
      placement: z.enum(["background", "right", "bottom"]).default("background"),
    })
    .optional(),
  logo: z.boolean().default(true),
  footnote: limited(LIMITS.footnote, "footnote").optional(),
});

export type Brief = z.infer<typeof briefSchema>;
export type Canvas = (typeof CANVAS)[keyof typeof CANVAS];
