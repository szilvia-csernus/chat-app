import { EmailSchema, emailSchema } from "./emailSchema";
import { OneTimePasscodeSchema, oneTimePasscodeSchema } from "./oneTimePasscodeSchema";


export const registerPasskeySchema = emailSchema.and(
  oneTimePasscodeSchema
);

export type RegisterPasskeySchema = EmailSchema & OneTimePasscodeSchema