import { z } from "zod";

export const contactMeSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .max(127, { message: "Email is too long." })
    .min(1, { message: "Email is required." }),
  message: z
    .string()
    .min(1, { message: "Content is empty." })
    .max(500, {
      message: "Message is too long. Please break it up to smaller chunks.",
    }),
});

export type ContactMeSchema = z.infer<typeof contactMeSchema>;