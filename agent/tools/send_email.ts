import { z } from "zod";
import { sendViaResend } from "../../lib/integrations/email.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

const inputSchema = z.object({
  to: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  html: z.boolean().optional(),
  attachments: z
    .array(
      z.object({
        path: z.string().min(1),
        filename: z.string().optional(),
      }),
    )
    .optional(),
});

export default {
  description:
    "Send a business email through the configured provider (Resend). Requires RESEND_API_KEY and EMAIL_FROM in .env.local.",
  inputSchema,
  async execute(input) {
    return sendViaResend(input);
  },
} satisfies ToolDefinition<z.infer<typeof inputSchema>, Awaited<ReturnType<typeof sendViaResend>>>;
