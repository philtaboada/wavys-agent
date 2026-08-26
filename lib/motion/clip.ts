import { z } from "zod";

/**
 * Un "reel" es una lista de clips independientes, no un video terminado. Cada
 * clip sale como archivo propio para que Phil los monte en un video más grande,
 * y opcionalmente se concatena en un preview de corrido.
 */
export const FORMATS = {
  wide: { width: 1920, height: 1080 },
  reel: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
} as const;

/**
 * Los máximos son el ancho real del slot en el formato más angosto (1080px) con
 * Rubik en su tamaño de marca. Los mínimos evitan lo contrario: una escena de
 * 4 segundos con dos palabras es tiempo muerto en el timeline.
 */
const text = (min: number, max: number, field: string) =>
  z
    .string()
    .trim()
    .min(min, `${field} necesita al menos ${min} caracteres`)
    .max(max, `${field} supera ${max} caracteres y no cabe en pantalla`);

const kebab = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "debe ser kebab-case en minúsculas");

const asset = z
  .string()
  .min(1)
  .describe("Ruta relativa al repo o absoluta. PNG con alfa para recortes.");

/**
 * Fondo fotográfico con deriva lenta. `dim` es cuánto se apaga para que el
 * texto siga siendo legible: sin eso, cualquier foto se come el titular.
 */
const background = z.object({
  image: asset,
  motion: z
    .enum(["zoom-in", "zoom-out", "pan-left", "pan-right", "still"])
    .default("zoom-in"),
  dim: z
    .number()
    .min(0)
    .max(0.95)
    .default(0.72)
    .describe("Cuánto se apaga la foto. Con texto encima, 0.75 o más."),
  blur: z
    .number()
    .min(0)
    .max(48)
    .default(8)
    .describe(
      "Desenfoque en px. Por defecto la foto es atmósfera, no contenido: sin esto cualquier detalle claro compite con el texto. Bajar a 0 solo si la imagen es el tema.",
    ),
});

/** Campos que comparten todas las escenas. */
const base = {
  id: kebab,
  /** Segundos de quietud una vez que todo entró: el tiempo de lectura real. */
  hold: z.number().min(0.4).max(8).default(1.6),
  /** `out` saca el contenido al final; `hold` congela el último frame. */
  exit: z.enum(["out", "hold"]).default("out"),
  background: background.optional(),
  /**
   * Sobrescribe el `transparent` del reel para este clip. Es lo que permite
   * tener en un mismo contrato las escenas con fondo y una `lower-third`
   * keyeable, que sin alfa no sirve para nada.
   */
  transparent: z.boolean().optional(),
};

/** Tipografía cinética: la lista de contenidos convertida en frases sueltas. */
const kineticScene = z.object({
  ...base,
  type: z.literal("kinetic"),
  eyebrow: text(2, 30, "kinetic.eyebrow").optional(),
  lines: z
    .array(text(1, 30, "kinetic.lines[]"))
    .min(1)
    .max(4)
    .describe("Una frase por línea. Envolver una palabra en *asteriscos* la pinta con el acento."),
  footnote: text(2, 60, "kinetic.footnote").optional(),
});

/** Placa de apertura: titular grande, cuerpo corto y un recorte opcional. */
const hookScene = z.object({
  ...base,
  type: z.literal("hook"),
  eyebrow: text(2, 30, "hook.eyebrow").optional(),
  title: text(3, 70, "hook.title"),
  body: text(20, 180, "hook.body").optional(),
  cta: text(2, 30, "hook.cta").optional(),
  cutout: asset.optional().describe("PNG con alfa que flota junto al texto."),
});

/** Lista que entra ítem por ítem: ideal para pasos, features o hallazgos. */
const bulletsScene = z.object({
  ...base,
  type: z.literal("bullets"),
  eyebrow: text(2, 30, "bullets.eyebrow").optional(),
  title: text(3, 50, "bullets.title").optional(),
  items: z
    .array(
      z.object({
        text: text(3, 54, "bullets.items[].text"),
        note: text(3, 70, "bullets.items[].note").optional(),
      }),
    )
    .min(2)
    .max(6),
});

/** Número grande con conteo animado. Si termina en % dibuja un arco. */
const statScene = z.object({
  ...base,
  type: z.literal("stat"),
  value: text(1, 10, "stat.value").describe("Ej. 87%, 3.2x, 12, $4.5M"),
  label: text(3, 60, "stat.label"),
  note: text(4, 90, "stat.note").optional(),
  source: text(2, 40, "stat.source").optional(),
});

/** Desfile de marcas: logos de empresas entrando en cascada. */
const logosScene = z.object({
  ...base,
  type: z.literal("logos"),
  eyebrow: text(2, 30, "logos.eyebrow").optional(),
  title: text(3, 50, "logos.title").optional(),
  logos: z
    .array(
      z.object({
        src: asset,
        label: text(2, 20, "logos.logos[].label").optional(),
      }),
    )
    .min(2)
    .max(8),
  layout: z.enum(["row", "grid"]).default("row"),
});

/** Recorte protagonista con deriva y texto al costado. */
const cutoutScene = z.object({
  ...base,
  type: z.literal("cutout"),
  image: asset,
  title: text(3, 60, "cutout.title").optional(),
  caption: text(4, 110, "cutout.caption").optional(),
  align: z.enum(["left", "right", "center"]).default("right"),
});

/** Cita con autor. */
const quoteScene = z.object({
  ...base,
  type: z.literal("quote"),
  quote: text(20, 220, "quote.quote"),
  author: text(2, 40, "quote.author"),
  role: text(2, 50, "quote.role").optional(),
  avatar: asset.optional(),
});

/** Placa inferior para montar encima de otro video. Usar con transparent: true. */
const lowerThirdScene = z.object({
  ...base,
  type: z.literal("lower-third"),
  title: text(2, 42, "lower-third.title"),
  subtitle: text(2, 54, "lower-third.subtitle").optional(),
  position: z
    .enum(["bottom-left", "bottom-center", "top-left"])
    .default("bottom-left"),
});

/** Antes / después en dos paneles. */
const compareScene = z.object({
  ...base,
  type: z.literal("compare"),
  title: text(3, 50, "compare.title").optional(),
  left: z.object({
    label: text(2, 22, "compare.left.label"),
    text: text(4, 90, "compare.left.text"),
  }),
  right: z.object({
    label: text(2, 22, "compare.right.label"),
    text: text(4, 90, "compare.right.text"),
  }),
  verdict: text(3, 60, "compare.verdict").optional(),
});

/** Cierre de marca con CTA. */
const outroScene = z.object({
  ...base,
  type: z.literal("outro"),
  title: text(3, 46, "outro.title").optional(),
  cta: text(3, 40, "outro.cta"),
  url: text(4, 50, "outro.url").optional(),
});

export const clipSchema = z.discriminatedUnion("type", [
  kineticScene,
  hookScene,
  bulletsScene,
  statScene,
  logosScene,
  cutoutScene,
  quoteScene,
  lowerThirdScene,
  compareScene,
  outroScene,
]);

export const reelSchema = z.object({
  slug: kebab,
  format: z.enum(["wide", "reel", "square", "portrait"]).default("wide"),
  fps: z.union([z.literal(24), z.literal(30), z.literal(60)]).default(30),
  theme: z.enum(["agente", "ventas", "editorial"]).default("agente"),
  /**
   * Fondo transparente. Sale `.mov` ProRes 4444 con alfa en vez de MP4, para
   * montar el clip encima de otro material sin recortar nada.
   */
  transparent: z.boolean().default(false),
  /**
   * `cut` deja el corte seco: es el default porque estos clips se montan
   * dentro de un video más largo y la transición la pone el editor. `fade`
   * entra y sale de negro, para el clip que se publica solo.
   */
  edges: z.enum(["fade", "cut"]).default("cut"),
  /** Pega todos los clips en un `reel.mp4` de corrido para revisar el ritmo. */
  concat: z.boolean().default(true),
  logo: z.boolean().default(true),
  clips: z.array(clipSchema).min(1).max(24),
});

export type Reel = z.infer<typeof reelSchema>;
export type Clip = z.infer<typeof clipSchema>;
export type Format = (typeof FORMATS)[keyof typeof FORMATS];

/** Texto de relleno que nunca debe llegar a un render. */
export const PLACEHOLDER_PATTERNS = [
  /lorem ipsum/i,
  /\bTODO\b/,
  /\bTBD\b/,
  /\bXXX+\b/,
  /pendiente de (confirmar|fuente)/i,
  /\[.{0,30}\]/,
];

/** Todas las rutas de assets que declara un clip, para validar antes de abrir el browser. */
export function clipAssets(clip: Clip): string[] {
  const out: string[] = [];
  if (clip.background) out.push(clip.background.image);
  if (clip.type === "hook" && clip.cutout) out.push(clip.cutout);
  if (clip.type === "cutout") out.push(clip.image);
  if (clip.type === "quote" && clip.avatar) out.push(clip.avatar);
  if (clip.type === "logos") out.push(...clip.logos.map((l) => l.src));
  return out;
}

/** Todo el texto visible de un clip, para el filtro de placeholders. */
export function clipStrings(clip: Clip): string[] {
  const out: string[] = [];
  const push = (v?: string) => {
    if (v) out.push(v);
  };

  switch (clip.type) {
    case "kinetic":
      push(clip.eyebrow);
      out.push(...clip.lines);
      push(clip.footnote);
      break;
    case "hook":
      push(clip.eyebrow);
      push(clip.title);
      push(clip.body);
      push(clip.cta);
      break;
    case "bullets":
      push(clip.eyebrow);
      push(clip.title);
      for (const item of clip.items) {
        push(item.text);
        push(item.note);
      }
      break;
    case "stat":
      push(clip.value);
      push(clip.label);
      push(clip.note);
      push(clip.source);
      break;
    case "logos":
      push(clip.eyebrow);
      push(clip.title);
      for (const l of clip.logos) push(l.label);
      break;
    case "cutout":
      push(clip.title);
      push(clip.caption);
      break;
    case "quote":
      push(clip.quote);
      push(clip.author);
      push(clip.role);
      break;
    case "lower-third":
      push(clip.title);
      push(clip.subtitle);
      break;
    case "compare":
      push(clip.title);
      push(clip.left.label);
      push(clip.left.text);
      push(clip.right.label);
      push(clip.right.text);
      push(clip.verdict);
      break;
    case "outro":
      push(clip.title);
      push(clip.cta);
      push(clip.url);
      break;
  }

  return out;
}
