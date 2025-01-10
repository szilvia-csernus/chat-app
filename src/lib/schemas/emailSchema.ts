import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().max(127).email(),
});

export type EmailSchema = z.infer<typeof emailSchema>;
