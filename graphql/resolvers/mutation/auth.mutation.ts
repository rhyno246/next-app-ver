import { prisma } from "@/prisma/db";
import { Context, ForgetPasswordInput, LoginInput, ResetPasswordInput } from "@/types/type";
import { sendResetPasswordEmail } from "@/utils/mailer";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/utils/token";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";

export const AuthMutation = {
    loginAuth : async(_:unknown , args : {
        data : LoginInput
    }, context : Context) => {
        const { email, password } = args.data;
        const author = await prisma.author.findUnique({
            where : { email },
            include: { role: true } // join thêm bảng role vô
        });
          
        if (!author || !author.password) throw new Error("Invalid credentials");
        const validPass = await bcrypt.compare(password, author.password);
        if(!validPass) throw new Error("Opps ! wrong email or password ");
        const accessToken = await generateAccessToken({ 
            authorId : author.id,
            roleId : author.roleId,
            roleName : author.role.name,
            provider : author.provider
        });
        const refreshToken = await generateRefreshToken({
            authorId: author.id,
            roleId: author.role.id,
            roleName: author.role.name,
            provider : author.provider
        });
        context.setCookies.push({
            name: "access_token",
            value: accessToken,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 5 * 24 * 60 * 60,
                path: "/",
            }
        });
        context.setCookies.push({
            name: "refresh_token", 
            value: refreshToken,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60,
                path: "/",
            }
        });
          return { user : author, accessToken, refreshToken, message: "Login successful" };
    },
    logout : async(_: unknown, __: unknown) => {
        const cookieStore = await cookies();
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");
        return "Logged out successfully";
    },
    
    refreshToken: async(_: unknown, __: unknown, context : Context) => {
        const token = context.req.cookies.get("refresh_token")?.value;
        if (!token) throw new Error("No refresh token");
        const { authorId, roleId, roleName, provider } = await verifyRefreshToken(token);
        const author = await prisma.author.findUnique({
            where: { id: authorId } , 
            include : {role : true} 
        });
        if (!author) {
            throw new Error("Invalid refresh token");
        }
        const newAccessToken = await generateAccessToken({ authorId, roleId, roleName , provider });
        const newRefreshToken = await generateRefreshToken({ authorId, roleId, roleName , provider });
        context.setCookies.push({
            name: "access_token",
            value: newAccessToken,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 5 * 24 * 60 * 60,
                path: "/",
            }
        });
        context.setCookies.push({
            name: "refresh_token",
            value: newRefreshToken,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60,
                path: "/",
            }
        });
        return { 
            user : author, 
            accessToken: newAccessToken,    
            refreshToken: newRefreshToken, 
            message: "Token refreshed" 
        };
    },
    forgetPassword: async(_: unknown, args : {
        data : ForgetPasswordInput
    }) => {
        console.log("args:", args.data);
        const { email } = args.data;
        const author = await prisma.author.findUnique({
            where : { email },
        });
        if (!author) throw new Error("Email not found");
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); //15p 
        await prisma.author.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });
        await sendResetPasswordEmail(email, resetToken);
        return { message: "Reset password email sent" };
    },
    resetPassword: async (_: unknown, args: { data: ResetPasswordInput }) => {
        const { token, newPassword } = args.data;

        const author = await prisma.author.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!author) throw new Error("Invalid or expired token");

        const hashed = await bcrypt.hash(newPassword, 10);

        await prisma.author.update({
            where: { id: author.id },
            data: {
                password: hashed,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return { message: "Password reset successfully" };
    }
}