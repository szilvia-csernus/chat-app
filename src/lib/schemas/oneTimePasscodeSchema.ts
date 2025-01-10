import { z } from "zod";

export const oneTimePasscodeSchema = z.object({
  oneTimePasscode: z.string().length(6),
});

export type OneTimePasscodeSchema = z.infer<typeof oneTimePasscodeSchema>;
