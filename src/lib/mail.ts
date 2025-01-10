import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);


export async function sendOTPEmail(email: string, token: string) {
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not set");
  }

  return resend.emails.send({
    from: `NextJS AuthJS Prisma Template <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Your verification code is ${token}`,
    html: `
      <h2>The verification code you have requested is</h2>
      <h1>${token}</h1>
      <br>
      <p>If you didn't initiate this request, please ignore this email.</p>
    `,
  });
}
