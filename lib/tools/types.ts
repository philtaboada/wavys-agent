import type { ZodType } from "zod";

export type ToolDefinition<TInput, TOutput> = {
  description: string;
  inputSchema: ZodType<TInput>;
  execute: (input: TInput) => Promise<TOutput> | TOutput;
};

export type ToolMeta = {
  name: string;
  description: string;
};
