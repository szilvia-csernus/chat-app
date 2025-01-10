import { z } from "zod";
import zxcvbn from "zxcvbn";

export const newPasswordSchema = z
  .object({
    username: z.string().max(127).email(),
    password: z.string().max(71, { message: "Password too long." }),
    // .min(8, { message: "Password must be at least 8 characters." })
    // .regex(/[A-Z]/, {
    //   message: "Password must contain at least one uppercase letter.",
    // })
    // .regex(/[a-z]/, {
    //   message: "Password must contain at least one lowercase letter.",
    // })
    // .regex(/[0-9]/, { message: "Password must contain at least one number." })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Password must contain at least one special character.",
    // })
    confirmPassword: z.string().max(127),
  })
  .superRefine((data, ctx) => {
    // Check password strength using zxcvbn
    const result = zxcvbn(data.password);
    if (result.score < 4) {
      // Adjust the score threshold as needed
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password is too weak.",
      });
    }
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords don't match",
      });
    }
  });

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;
