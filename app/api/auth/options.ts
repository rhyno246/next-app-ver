// app/api/auth/options.ts  ← file mới
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/prisma/db";
import { providerConfig, roleType } from "@/Enum/enum";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user , account }) {
      try {
        const email = user.email;
        if (!email) return false;

        let author = await prisma.author.findUnique({
          where: { email },
          include: { role: true }
        });

        if (!author) {
          const defaultRole = await prisma.role.findUnique({
            where: { name: roleType.type_user }
          });
          if (!defaultRole) return false;

          author = await prisma.author.create({
            data: {
              email,
              firstName: user.name?.split(" ")[0] ?? "",
              lastName: user.name?.split(" ")[1] ?? "",
              image: user.image ?? null,
              password: "",
              roleId: defaultRole.id,
              provider: account?.provider ?? providerConfig.local_provider,
            },
            include: { role: true }
          });
        }else{
          if (account?.provider && account?.provider !== providerConfig.local_provider) {
            await prisma.author.update({
              where: { email },
              data: { provider:account.provider }
            });
          }
        }
        return true;
      } catch {
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const author = await prisma.author.findUnique({
          where: { email: user.email },
          include: { role: true }
        });
        if (author) {
          token.authorId = author.id;
          token.roleId = author.roleId;
          token.roleName = author.role.name;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.authorId = token.authorId as string;
      session.user.roleId = token.roleId as string;
      session.user.roleName = token.roleName as string;
      return session;
    },

    async redirect({ baseUrl , url }) {
      return `${baseUrl}/api/auth/set-jwt`;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};