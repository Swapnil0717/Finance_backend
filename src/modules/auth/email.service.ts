import nodemailer from "nodemailer";
import { env } from "../../config/env";


const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const baseTemplate = (title: string, content: string) => `
  <div style="font-family: Arial, sans-serif; max-width:600px;margin:auto;">
    <h2>${title}</h2>
    <p>${content}</p>
    <hr/>
    <p style="font-size:12px;color:#888;">
      If you did not request this, please ignore this email.
    </p>
  </div>
`;

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"Finance App" <${env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const link = `${env.APP_URL}/verify-email?token=${token}`;

  const html = baseTemplate(
    "Verify Your Email",
    `Please verify your email by clicking the link below:<br/><br/>
     <a href="${link}">${link}</a>`
  );

  await sendEmail(email, "Verify Your Email", html);
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const link = `${env.APP_URL}/reset-password?token=${token}`;

  const html = baseTemplate(
    "Reset Your Password",
    `Click below to reset your password:<br/><br/>
     <a href="${link}">${link}</a>`
  );

  await sendEmail(email, "Reset Password", html);
};