import { z } from 'zod';

export const DungeonMasterResponseSchema = z.object({
  headline: z.string(),
  narration: z.array(z.string()),
  prompt: z.string(),
  options: z.array(z.object({ description: z.string(), roll: z.boolean() })),
});
