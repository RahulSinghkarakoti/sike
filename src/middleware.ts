// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import { v4 as uuid } from "uuid";

export async function middleware(req: NextRequest) {
  // ✅ Read cookies from the request
  const anonId = req.cookies.get("anon_id");
  
  
  // Create response
  const res = NextResponse.next();
  
  // ✅ Set cookie on the response if it doesn't exist
  if (!anonId) {
    const newAnonId = uuid();
    res.cookies.set("anon_id", newAnonId, {
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }
  
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};