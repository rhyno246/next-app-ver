// types/next-auth.d.ts
import "next-auth";
import { Author } from "./type";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      authorId: string;
      roleId: string;
      roleName: string;
      author: Author;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    authorId: string;
    roleId: string;
    roleName: string;
    author: Author; 
  }
}