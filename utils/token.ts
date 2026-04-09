import * as jose from "jose";
const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_TOKEN!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN!);


export type TokenPayload = {
  authorId: string;
  roleId: string;
  roleName: string;
  provider : string;
};

export const generateAccessToken = async (payload: TokenPayload): Promise<string> => {
  return new jose.SignJWT({ payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5d")
    .sign(ACCESS_SECRET);
};

export const generateRefreshToken = async (payload: TokenPayload): Promise<string> => {
  return new jose.SignJWT({ payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
};

export const verifyAccessToken = async (token: string): Promise<TokenPayload> => {
  const { payload: decoded } = await jose.jwtVerify(token, ACCESS_SECRET);
  return decoded.payload as TokenPayload;
};

export const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
  const { payload: decoded } = await jose.jwtVerify(token, REFRESH_SECRET);
  return decoded.payload as TokenPayload;
};

export const safeVerifyAccessToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const result = await verifyAccessToken(token);
    return result;
  } catch (err) {
    console.log("=== safeVerify error message:", (err as Error).message);
    return null;
  }
};
