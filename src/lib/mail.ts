import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);


export async function sendEmail(email: string, message: string) {
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
