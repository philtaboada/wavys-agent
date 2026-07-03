import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { requireEnv } from "../env.js";

/** Único modelo permitido — generación/edición de imágenes (Nano Banana). */
export const GEMINI_IMAGE_MODEL = "gemini-3.1-flash-lite-image" as const;

const INTERACTIONS_URL =
  "https://generativelanguage.googleapis.com/v1beta/interactions";

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4", "5:4"] as const;

export type GeminiAspectRatio = (typeof ASPECT_RATIOS)[number];

type GenerateImageInput = {
  prompt: string;
  outputPath?: string;
  aspectRatio?: GeminiAspectRatio;
  referenceImagePath?: string;
};

type GenerateImageResult = {
  provider: "gemini";
  model: typeof GEMINI_IMAGE_MODEL;
  path: string;
  mimeType: "image/jpeg";
  aspectRatio: GeminiAspectRatio;
  bytes: number;
};

type InteractionResponse = {
  output_image?: {
    data?: string;
    mime_type?: string;
  };
  steps?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      data?: string;
      mime_type?: string;
    }>;
  }>;
  error?: { message?: string };
};

function extractImageData(payload: InteractionResponse): string | undefined {
  if (payload.output_image?.data) {
    return payload.output_image.data;
  }

  for (const step of payload.steps ?? []) {
    for (const block of step.content ?? []) {
      if (block.type === "image" && block.data) {
        return block.data;
      }
    }
  }

  return undefined;
}

function defaultOutputPath(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return resolve(process.cwd(), "data", "generated-images", `${stamp}.jpg`);
}

async function readReferenceImage(
  referenceImagePath: string,
): Promise<{ data: string; mime_type: string }> {
  const absolute = resolve(process.cwd(), referenceImagePath);
  const buffer = await readFile(absolute);
  const ext = basename(absolute).split(".").pop()?.toLowerCase();
  const mime_type =
    ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "webp"
        ? "image/webp"
        : "image/png";

  return {
    data: buffer.toString("base64"),
    mime_type,
  };
}

export async function generateGeminiImage(
  input: GenerateImageInput,
): Promise<GenerateImageResult> {
  const apiKey = requireEnv("GEMINI_API_KEY");
  const mimeType = "image/jpeg" as const;
  const aspectRatio = input.aspectRatio ?? "16:9";
  const outputPath = input.outputPath ?? defaultOutputPath();

  if (input.aspectRatio && !ASPECT_RATIOS.includes(input.aspectRatio)) {
    throw new Error(
      `Invalid aspectRatio. Allowed: ${ASPECT_RATIOS.join(", ")}`,
    );
  }

  const inputPayload: unknown = input.referenceImagePath
    ? [
        { type: "text", text: input.prompt },
        {
          type: "image",
          ...(await readReferenceImage(input.referenceImagePath)),
        },
      ]
    : input.prompt;

  const response = await fetch(INTERACTIONS_URL, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GEMINI_IMAGE_MODEL,
      input: inputPayload,
      response_format: {
        type: "image",
        mime_type: mimeType,
        aspect_ratio: aspectRatio,
      },
    }),
  });

  const payload = (await response.json()) as InteractionResponse;

  if (!response.ok) {
    const detail =
      payload.error?.message ?? JSON.stringify(payload).slice(0, 500);
    throw new Error(`Gemini image error (${response.status}): ${detail}`);
  }

  const imageData = extractImageData(payload);
  if (!imageData) {
    throw new Error(
      "Gemini returned no image. Check prompt or API access for gemini-3.1-flash-lite-image.",
    );
  }

  const buffer = Buffer.from(imageData, "base64");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buffer);

  return {
    provider: "gemini",
    model: GEMINI_IMAGE_MODEL,
    path: outputPath,
    mimeType,
    aspectRatio,
    bytes: buffer.byteLength,
  };
}
