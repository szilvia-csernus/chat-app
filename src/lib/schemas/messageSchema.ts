import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .max(255, { message: "Content is too long" }),
});

export type MessageSchema = z.infer<typeof messageSchema>;
