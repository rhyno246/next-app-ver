// app/api/auth/set-jwt/route.ts
import { getServerSession } from "next-auth";
import { generateAccessToken, generateRefreshToken } from "@/utils/token";
import { NextResponse } from "next/server";
import { authOptions } from "../options";
import { prisma } from "@/prisma/db";
import { providerConfig } from "@/Enum/enum";

export async function GET(req: Request) {
  const baseUrl = new URL(req.url).origin;
  const session = await getServerSession(authOptions);

  if (!session?.user?.authorId) {
    return NextResponse.redirect(new URL("/login?error=unauthorized", baseUrl));
  }

  const { authorId, roleId, roleName } = session.user;

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: { role: true }
  });

  if (!author) {
    return NextResponse.redirect(new URL("/login?error=unauthorized", baseUrl));
  }

  // ✅ await generate tokens
  const accessToken = await generateAccessToken({ authorId, roleId, roleName , provider : providerConfig.google_provider });
  const refreshToken = await generateRefreshToken({ authorId, roleId, roleName , provider : providerConfig.google_provider });

  const callbackUrl = new URL("/auth/callback", baseUrl);
  callbackUrl.searchParams.set("author", JSON.stringify(author));

  const response = NextResponse.redirect(callbackUrl);

  // ✅ set string vào cookie, không phải Promise
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15,
    path: "/",
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}