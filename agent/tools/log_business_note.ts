import { z } from "zod";
import { newId, nowIso, readJsonStore, writeJsonStore } from "../../lib/store.js";
import type { ToolDefinition } from "../../lib/tools/types.js";

type BusinessNote = {
  id: string;
  category: string;
  content: string;
  tags: string[];
  createdAt: string;
};

const inputSchema = z.object({
  content: z.string().min(1),
  category: z.string().min(1).default("general"),
  tags: z.array(z.string()).default([]),
});

export default {
  description:
    "Persist a business note or decision in data/notes.json so future sessions can recall context.",
  inputSchema,
  async execute(input) {
    const notes = await readJsonStore<BusinessNote[]>("notes.json", []);
    const note: BusinessNote = {
      id: newId("note"),
      category: input.category,
      content: input.content,
      tags: input.tags,
      createdAt: nowIso(),
    };

    notes.push(note);
    const path = await writeJsonStore("notes.json", notes);

    return { note, path };
  },
} satisfies ToolDefinition<z.infer<typeof inputSchema>, { note: BusinessNote; path: string }>;
