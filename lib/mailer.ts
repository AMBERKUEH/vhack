// lib/mailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,  // fixes self-signed certificate error
    family: 4,                  // fixes IPv6 timeout
  },
} as nodemailer.TransportOptions);

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  await transporter.sendMail({
    from: `"Compliance Copilot" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}