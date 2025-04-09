"use server";

import { CreateEmailResponse, Resend } from "resend"; 

const resend = new Resend(process.env.RESEND_KEY);

type Props = {
  email: string;
  message: string;
}

export async function sendEmail({email, message}: Props): Promise<CreateEmailResponse> {
  if (!process.env.RESEND_KEY) {
    throw new Error("Missing Resend API key");
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not set");
  }

  return resend.emails.send({
    from: `Chat APP <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `New contact form submission`,
    html: `
      <h2>New message from ${email}</h2>
      <br>
      <div>${message}</div>
    `,
  });
}
