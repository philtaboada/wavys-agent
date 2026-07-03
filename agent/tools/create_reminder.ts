import { z } from "zod";
import { newId, nowIso, readJsonStore, writeJsonStore } from "../../lib/store.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

type Reminder = {
  id: string;
  title: string;
  dueAt: string;
  notes?: string;
  status: "pending" | "done" | "cancelled";
  createdAt: string;
};

const inputSchema = z.object({
  title: z.string().min(1),
  dueAt: z.string().datetime({ offset: true }),
  notes: z.string().optional(),
});

export default {
  description:
    "Create a business reminder stored locally in data/reminders.json until an external calendar API is connected.",
  inputSchema,
  async execute(input) {
    const reminders = await readJsonStore<Reminder[]>("reminders.json", []);
    const reminder: Reminder = {
      id: newId("rem"),
      title: input.title,
      dueAt: input.dueAt,
      notes: input.notes,
      status: "pending",
      createdAt: nowIso(),
    };

    reminders.push(reminder);
    const path = await writeJsonStore("reminders.json", reminders);

    return { reminder, path };
  },
} satisfies ToolDefinition<z.infer<typeof inputSchema>, { reminder: Reminder; path: string }>;
