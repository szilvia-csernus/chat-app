import { z } from "zod";

export const loginCredentialsSchema = z.object({
  email: z.string().max(127).email(),
  password: z.string().max(127),
});

export type LoginCredentialsSchema = z.infer<typeof loginCredentialsSchema>;
