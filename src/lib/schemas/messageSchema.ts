import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Content is empty." })
    .max(500, {
      message: "Message is too long. Please break it up to smaller chunks.",
    }),
});

export type MessageSchema = z.infer<typeof messageSchema>;
