import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { optionalEnv, requireEnv } from "../env.js";

type EmailAttachmentInput = {
  path: string;
  filename?: string;
};

type SendEmailInput = {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  html?: boolean;
  attachments?: EmailAttachmentInput[];
};

type SendEmailResult = {
  provider: "resend";
  id: string;
  to: string[];
  subject: string;
};

export async function sendViaResend(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = requireEnv("RESEND_API_KEY");
  const from = optionalEnv("EMAIL_FROM") ?? "onboarding@resend.dev";
  const replyTo = optionalEnv("EMAIL_REPLY_TO");

  const attachments = input.attachments?.length
    ? await Promise.all(
        input.attachments.map(async (attachment) => {
          const absolute = resolve(process.cwd(), attachment.path);
          const content = await readFile(absolute);
          return {
            filename: attachment.filename ?? basename(absolute),
            content: content.toString("base64"),
          };
        }),
      )
    : undefined;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      ...(replyTo ? { reply_to: replyTo } : {}),
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      ...(attachments ? { attachments } : {}),
      ...(input.html ? { html: input.body } : { text: input.body }),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend error (${response.status}): ${detail}`);
  }

  const payload = (await response.json()) as { id: string };

  return {
    provider: "resend",
    id: payload.id,
    to: input.to,
    subject: input.subject,
  };
}
