import { z } from "zod";
import { EmailSchema, emailSchema } from "./emailSchema";
import {
  OneTimePasscodeSchema,
  oneTimePasscodeSchema,
} from "./oneTimePasscodeSchema";
import { NewPasswordSchema, newPasswordSchema } from "./newPasswordSchema";

export const registerPasswordSchema = emailSchema
  .and(oneTimePasscodeSchema)
  .and(newPasswordSchema);

export type RegisterPasswordSchema = EmailSchema &
  OneTimePasscodeSchema &
  NewPasswordSchema;
