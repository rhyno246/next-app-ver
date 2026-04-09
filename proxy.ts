import { NextResponse  } from "next/server";
import type { NextRequest  } from "next/server";
import { safeVerifyAccessToken } from "./utils/token";
import { roleType } from "./Enum/enum";

export async function proxy(req : NextRequest) {
    
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;
    const pathname = req.nextUrl.pathname;
    //  // Những route cần bảo vệ
    const protectedRoutes = ["/profile"];
    const authRoutes = ["/signin" , "/signup"];
    const adminRoutes = ["/admin"];

    if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
        const payload = await safeVerifyAccessToken(accessToken);
        if (!payload) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
        if (payload.roleName !== roleType.type_admin) {
            return NextResponse.redirect(new URL("/profile", req.url));
        }
    }


    if(authRoutes.some((route) => pathname.startsWith(route)) && accessToken) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }
    
    if(protectedRoutes.some((route) => pathname.startsWith(route)) && !accessToken) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if(!accessToken && refreshToken){
        const response = await fetch(`${req.nextUrl.origin}/api/graphql`, {
            method: "POST",
            headers: {
                Cookie: `refresh_token=${refreshToken};`,
            },
            body: JSON.stringify({
                query: `
                    mutation RefreshToken {
                        refreshToken {
                            accessToken
                            refreshToken
                            message
                        }
                    }
                `,
            })
        });
        const data = await response.json();
        if(!data){
            return NextResponse.redirect(new URL("/signin", req.url));
        }

        const result = data?.data?.refreshToken;
        if (result?.accessToken && result?.refreshToken) {
            const redirectUrl  = new URL(pathname, req.url);
            const res = NextResponse.redirect(redirectUrl);
            res.cookies.set("access_token", result.accessToken, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 5 * 24 * 60 * 60,
                path: '/'
            });

            res.cookies.set("refresh_token", result.refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60,
                path: '/'
            });
            
            return res;
        }
    }
    return NextResponse.next();
}


export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // chỉ loại trừ /api/*, _next/*,favicon.ico là không matcher
};
