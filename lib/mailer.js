import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, 
    },
});

export async function sendEmail({ email, subject, text }) {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
}