import { Context } from "@/types/type";
import { verifyAccessToken } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";


export const createContext = async (req: NextRequest): Promise<Context> => {
  try {
    const token = req.cookies.get("access_token")?.value;
    const setCookies: Context['setCookies'] = [];

    if (!token) return { req, res: new NextResponse(), setCookies };

    const { authorId, roleId, roleName } = await verifyAccessToken(token);
    return { req, res: new NextResponse(), authorId, roleId, roleName, setCookies };
  } catch {
    return { req, res: new NextResponse(), setCookies: [] };
  }
};