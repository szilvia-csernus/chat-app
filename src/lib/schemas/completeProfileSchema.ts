import { z } from "zod";
import { calculateAge } from "../utils";

export const profileSchema = z.object({
  name: z
    .string()
    .max(127, { message: "Name is too long." })
    .min(2, { message: "Name must be at least 2 characters." }),
  country: z
    .string()
    .max(127, { message: "Country name too long." })
    .min(2, { message: "Country must be at least 2 characters." }),
  gender: z.string().max(48),
  dateOfBirth: z
    .string()
    .max(48)
    .min(1, {
      message: "Date of birth is required",
    })
    .refine(
      (dateString) => {
        const age = calculateAge(dateString);
        return age >= 18;
      },
      { message: "You must be at least 18 years old to use this service." }
    ),
});

export const photoSchema = z.object({
  imageUrl: z.string(),
  cloudinaryImageId: z.string(),
});

export const completeProfileSchema = profileSchema.and(photoSchema);

export type ProfileSchema = z.infer<typeof profileSchema>;
export type PhotoSchema = z.infer<typeof photoSchema>;

export type CompleteProfileSchema = ProfileSchema & PhotoSchema;
