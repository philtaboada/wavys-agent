import { z } from "zod";

export const PAGE = { width: 1240, height: 1754 } as const;

/**
 * Los máximos son el espacio real que cada bloque tiene en la página. Los
 * mínimos existen por la razón opuesta: una sección con dos frases deja media
 * hoja muerta, que fue justo lo que rompió la N°2 armada a mano.
 */
const text = (min: number, max: number, field: string) =>
  z
    .string()
    .trim()
    .min(min, `${field} necesita al menos ${min} caracteres o la página queda vacía`)
    .max(max, `${field} supera ${max} caracteres y no cabe`);

const source = z.object({
  outlet: text(2, 40, "fuente.outlet"),
  date: text(4, 20, "fuente.date"),
  url: z.url("la fuente necesita una URL real"),
});

const note = z.object({
  kicker: text(2, 40, "nota.kicker"),
  title: text(6, 46, "nota.title"),
  body: z.array(text(60, 420, "nota.body[]")).min(1).max(3),
  takeaway: text(20, 130, "nota.takeaway"),
  source,
});

const coverPage = z.object({
  type: z.literal("tapa"),
  overline: text(2, 24, "tapa.overline"),
  title: text(2, 22, "tapa.title"),
  dek: text(20, 110, "tapa.dek"),
  image: z.string().min(1),
  teasers: z
    .array(
      z.object({
        label: text(2, 18, "teaser.label"),
        text: text(6, 34, "teaser.text"),
      }),
    )
    .length(3, "la tapa lleva exactamente 3 adelantos"),
});

const letterPage = z.object({
  type: z.literal("carta"),
  steps: z
    .tuple([
      text(2, 22, "carta.steps[0]"),
      text(2, 18, "carta.steps[1]"),
      text(2, 16, "carta.steps[2]"),
    ])
    .describe("cascada tipográfica: chico, mediano, enorme"),
  dek: text(20, 120, "carta.dek"),
  body: z.array(text(120, 480, "carta.body[]")).min(3).max(4),
  image: z.string().min(1),
  caption: text(20, 120, "carta.caption"),
});

const notesPage = z.object({
  type: z.literal("notas"),
  section: text(2, 18, "notas.section"),
  standfirst: text(20, 120, "notas.standfirst"),
  notes: z.array(note).min(2).max(3),
  image: z.string().optional(),
});

const featureOpenPage = z.object({
  type: z.literal("tema-apertura"),
  stamp: text(2, 18, "tema.stamp").describe("fecha grande al fondo, ej. 19 AGO"),
  stampNote: text(10, 60, "tema.stampNote"),
  kicker: text(2, 40, "tema.kicker"),
  titleTop: text(2, 20, "tema.titleTop"),
  titleMain: text(2, 18, "tema.titleMain"),
  dek: text(40, 190, "tema.dek"),
  hint: text(20, 90, "tema.hint"),
  image: z.string().min(1),
});

const featureTextPage = z.object({
  type: z.literal("tema-texto"),
  kicker: text(2, 40, "tema.kicker"),
  title: text(6, 54, "tema.title"),
  columns: z.array(text(200, 900, "tema.columns[]")).min(2).max(3),
  pull: text(30, 130, "tema.pull").optional(),
  image: z.string().optional(),
});

const featureCasesPage = z.object({
  type: z.literal("tema-casos"),
  kicker: text(2, 40, "casos.kicker"),
  title: text(6, 30, "casos.title"),
  standfirst: text(30, 160, "casos.standfirst"),
  cases: z
    .array(
      z.object({
        label: text(2, 28, "caso.label"),
        title: text(6, 40, "caso.title"),
        body: text(90, 340, "caso.body"),
      }),
    )
    .min(3)
    .max(4),
  closer: z
    .object({
      label: text(2, 28, "cierre.label"),
      title: text(4, 26, "cierre.title"),
      body: text(60, 260, "cierre.body"),
      image: z.string().min(1),
    })
    .optional(),
});

const featureRulesPage = z.object({
  type: z.literal("tema-reglas"),
  kicker: text(2, 40, "reglas.kicker"),
  title: text(6, 40, "reglas.title"),
  rules: z
    .array(
      z.object({
        title: text(6, 44, "regla.title"),
        body: text(80, 320, "regla.body"),
      }),
    )
    .length(3, "el bloque de reglas lleva exactamente 3"),
  quote: text(30, 150, "reglas.quote"),
});

const boardPage = z.object({
  type: z.literal("tablero"),
  title: text(6, 30, "tablero.title"),
  reading: text(80, 400, "tablero.reading"),
  ranking: z
    .array(
      z.object({
        model: text(3, 44, "ranking.model"),
        score: z.number().int().min(0).max(100),
        badge: text(2, 12, "ranking.badge").optional(),
      }),
    )
    .min(5)
    .max(6),
  charts: z.array(z.string()).min(1, "el tablero necesita al menos un gráfico"),
  disclaimer: text(40, 260, "tablero.disclaimer"),
  source,
});

const backPage = z.object({
  type: z.literal("contratapa"),
  steps: z.tuple([text(2, 18, "cierre.steps[0]"), text(4, 24, "cierre.steps[1]")]),
  body: z.array(text(60, 320, "cierre.body[]")).min(2).max(3),
  ctaLabel: text(6, 60, "cierre.ctaLabel"),
  ctaUrl: z.url(),
  image: z.string().min(1),
});

export const pageSchema = z.discriminatedUnion("type", [
  coverPage,
  letterPage,
  notesPage,
  featureOpenPage,
  featureTextPage,
  featureCasesPage,
  featureRulesPage,
  boardPage,
  backPage,
]);

export const issueSchema = z.object({
  number: z.number().int().positive(),
  dateRange: text(8, 30, "dateRange"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug debe ser kebab-case"),
  pages: z
    .array(pageSchema)
    .min(4, "una edición necesita al menos tapa, un tema y cierre"),
});

export type Issue = z.infer<typeof issueSchema>;
export type Page = z.infer<typeof pageSchema>;

/** Texto de relleno que nunca debe llegar a un preview. */
export const PLACEHOLDER_PATTERNS = [
  /lorem ipsum/i,
  /\bTODO\b/,
  /\bTBD\b/,
  /gr[áa]fico vac[íi]o/i,
  /pendiente de (confirmar|fuente)/i,
  /\bXXX+\b/,
  /\[.{0,30}\]/,
];
