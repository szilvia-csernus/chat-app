import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
