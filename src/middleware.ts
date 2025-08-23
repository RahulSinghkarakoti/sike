// src/middleware.ts
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export function middleware(req: Request) {
  const res = NextResponse.next();
  const cookies = (req as any).cookies || new Map();
  let anonId = cookies.get?.("anon_id");

  if (!anonId) {
    anonId = uuid();
    res.cookies.set("anon_id", anonId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
