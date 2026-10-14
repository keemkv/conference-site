import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendCertificateEmail(toEmail, fullName, pdfBytes) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: "Ваш сертификат участника конференции",
    text: `Здравствуйте, ${fullName}! Спасибо за участие в конференции. Ваш сертификат во вложении.`,
    attachments: [
      {
        filename: "certificate.pdf",
        content: Buffer.from(pdfBytes),
      },
    ],
  });
}
