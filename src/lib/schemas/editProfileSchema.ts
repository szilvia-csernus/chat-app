import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string()
    .max(127, { message: "Name is too long." })
    .min(2, { message: "Name must be at least 2 characters." }),
  country: z
    .string()
    .max(127, { message: "Country name too long." })
    .min(2, { message: "Country must be at least 2 characters." }),
});


export type EditProfileSchema = z.infer<typeof editProfileSchema>;

