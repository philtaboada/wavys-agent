import { z } from "zod";

/**
 * Formatos de flyer. `a4` es el imprimible (150dpi) y también el que mejor se
 * lee reenviado por WhatsApp; los otros tres son los canvas de marca de
 * `agent/context/wavys-visual-brand-guide.md` §2.4.
 *
 * `safeTop` / `safeBottom` son las bandas que tapa la interfaz de la app en
 * stories: nada de contenido entra ahí, y el render lo verifica.
 */
export const FORMAT = {
  a4: { width: 1240, height: 1754, safeTop: 0, safeBottom: 0, printable: true },
  feed: { width: 1080, height: 1350, safeTop: 0, safeBottom: 0, printable: false },
  cuadrado: { width: 1080, height: 1080, safeTop: 0, safeBottom: 0, printable: false },
  story: { width: 1080, height: 1920, safeTop: 260, safeBottom: 340, printable: false },
} as const;

export type FormatName = keyof typeof FORMAT;
export type Format = (typeof FORMAT)[FormatName];

/**
 * Los máximos son el ancho real que soporta cada slot con su tipografía de
 * marca: pasarse no "aprieta un poco", parte el titular en cuatro líneas y
 * mata la jerarquía. Los mínimos existen por el motivo inverso, que es el
 * error que ya rompió la revista N°2: una sección con dos frases deja media
 * hoja muerta y la pieza se lee como un borrador.
 */
const text = (min: number, max: number, field: string) =>
  z
    .string()
    .trim()
    .min(min, `${field} necesita al menos ${min} caracteres o el bloque queda vacío`)
    .max(max, `${field} supera ${max} caracteres y rompe la jerarquía`);

/** Un solo CTA por pieza — regla de la guía visual §3. */
const cta = z.object({
  label: text(6, 34, "cta.label"),
  url: z.url("cta.url debe ser una URL real: se imprime y se convierte en QR").optional(),
  note: text(6, 64, "cta.note").optional().describe("línea de apoyo bajo el botón"),
  qr: z.boolean().default(true).describe("dibuja el QR de cta.url; ignorado sin url"),
});

const contact = z
  .array(text(4, 34, "contact[]"))
  .min(1)
  .max(3, "más de 3 datos de contacto y la pieza se vuelve una tarjeta de visita")
  .optional();

const image = z.string().min(1, "el flyer sin foto no es un flyer, es un aviso");

/** Dato duro que domina la composición cuando lo hay. */
const stat = z
  .object({
    value: text(1, 8, "stat.value").describe("ej. 78%, 5 min, 10×"),
    label: text(6, 40, "stat.label"),
  })
  .optional();

/**
 * Todo lo que no depende del layout. Se reparte por spread en cada uno en vez
 * de con un `z.intersection`, porque la unión discriminada da el error en el
 * campo exacto y la intersección lo da en el objeto entero.
 */
const base = {
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug debe ser kebab-case"),
  format: z.enum(["a4", "feed", "cuadrado", "story"]).default("a4"),
  /** `oscuro` es la marca; `claro` es para imprimir sin gastar tóner. */
  paper: z.enum(["oscuro", "claro"]).default("oscuro"),
  accent: z.enum(["verde", "teal"]).default("verde"),
  brand: text(2, 30, "brand").default("Wavys Technologies"),
  logo: z.boolean().default(true),

  kicker: text(2, 26, "kicker"),
  cta,
  contact,
  image,
  footnote: text(8, 110, "footnote").optional().describe("condiciones, vigencia, aviso legal"),
};

/** Cartel: la foto manda y el titular es un golpe. Máximo impacto, mínimo texto. */
const posterLayout = z.object({
  layout: z.literal("cartel"),
  ...base,
  title: text(6, 42, "cartel.title"),
  titleAccent: text(2, 20, "cartel.titleAccent").optional().describe("segunda línea en acento"),
  dek: text(30, 150, "cartel.dek"),
  stat,
});

/** Revista: banda de foto arriba, cuerpo editorial abajo. Para servicios que hay que explicar. */
const editorialLayout = z.object({
  layout: z.literal("revista"),
  ...base,
  title: text(8, 58, "revista.title"),
  dek: text(40, 180, "revista.dek"),
  body: z.array(text(120, 420, "revista.body[]")).min(1).max(2),
  bullets: z.array(text(12, 62, "revista.bullets[]")).min(2).max(4).optional(),
});

/** Oferta: split vertical con precio. La pieza que se manda a vender. */
const offerLayout = z.object({
  layout: z.literal("oferta"),
  ...base,
  title: text(6, 40, "oferta.title"),
  dek: text(24, 130, "oferta.dek"),
  price: z
    .object({
      value: text(2, 14, "oferta.price.value").describe("ej. S/ 490, Desde $99"),
      note: text(4, 40, "oferta.price.note").describe("ej. al mes, por local, IGV incluido"),
      before: text(2, 14, "oferta.price.before").optional().describe("precio tachado"),
    })
    .optional(),
  bullets: z.array(text(10, 58, "oferta.bullets[]")).min(3).max(5),
});

/** Servicios: rejilla de lo que hace el negocio. Informativa, no promocional. */
const servicesLayout = z.object({
  layout: z.literal("servicios"),
  ...base,
  title: text(6, 46, "servicios.title"),
  dek: text(24, 150, "servicios.dek"),
  items: z
    .array(
      z.object({
        title: text(4, 30, "servicio.title"),
        body: text(60, 210, "servicio.body"),
      }),
    )
    .min(3)
    .max(4),
});

/** Evento: la fecha es el elemento dominante. Charla, taller, demo, inauguración. */
const eventLayout = z.object({
  layout: z.literal("evento"),
  ...base,
  title: text(6, 40, "evento.title"),
  dek: text(24, 150, "evento.dek"),
  date: z.object({
    big: text(2, 14, "evento.date.big").describe("ej. 12 SEP — va enorme"),
    note: text(6, 44, "evento.date.note").describe("ej. jueves, 7:00 p.m."),
  }),
  meta: z
    .array(
      z.object({
        label: text(2, 16, "meta.label"),
        value: text(3, 40, "meta.value"),
      }),
    )
    .min(2)
    .max(4),
});

export const flyerSchema = z.discriminatedUnion("layout", [
  posterLayout,
  editorialLayout,
  offerLayout,
  servicesLayout,
  eventLayout,
]);

export type Flyer = z.infer<typeof flyerSchema>;
export type LayoutName = Flyer["layout"];

/** Texto de relleno que nunca debe llegar a una pieza que ve un cliente. */
export const PLACEHOLDER_PATTERNS = [
  /lorem ipsum/i,
  /\bTODO\b/,
  /\bTBD\b/,
  /pendiente de (confirmar|definir|precio)/i,
  /tu (texto|titular|logo) aqu[íi]/i,
  /\bXXX+\b/,
  /\bS\/\s*0+\b/,
  /\[.{0,30}\]/,
];

/**
 * Piso de tamaño del titular por formato. Por debajo de esto el titular deja
 * de dominar la composición y la pieza se lee como un volante de fotocopia.
 */
export const MIN_TITLE_PX: Record<FormatName, number> = {
  a4: 62,
  feed: 58,
  cuadrado: 54,
  story: 62,
};

/**
 * Layouts con foto a sangre detrás del texto.
 *
 * La distinción importa para los chequeos de hueco: el aire sobre una foto es
 * composición y el aire sobre fondo plano es una pieza sin terminar. Medir los
 * dos con la misma regla obliga a rellenar de texto justo la zona que tiene
 * que quedar limpia, o deja pasar medio pliego negro.
 */
export const BG_PHOTO_LAYOUTS = new Set<LayoutName>(["cartel", "evento", "oferta"]);

/** Fracción del alto del lienzo tolerable como hueco, según qué haya detrás. */
export const GAP_LIMIT = {
  overPhoto: 0.3,
  overFlat: 0.12,
  betweenBlocksOverFlat: 0.09,
} as const;
