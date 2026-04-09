import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Reset Password",
        html: `
            <h2>Reset Password</h2>
            <p>Click link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Link expires in 15 minutes.</p>
        `,
    });
};