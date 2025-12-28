// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuid } from 'uuid';
import sha256 from 'crypto-js/sha256';
import { HmacSHA256 } from 'crypto-js';

const SECRET = process.env.SERVER_SECRET!;

function badgeOK(anonId: string, badge: string, now = Date.now()) {
  const bucket = Math.floor(now / 1000 /  Number(process.env.BUCKET_TIME));
  const expect = HmacSHA256(anonId + bucket, SECRET).toString();
  if (badge === expect) return true;
  const expectPrev = HmacSHA256(anonId + (bucket - 1), SECRET).toString();
  return badge === expectPrev;
}

export async function middleware(req: NextRequest) {
  /* ---------- 1.  protect write endpoints ---------- */
  if (req.nextUrl.pathname.startsWith('/api/send')) {
    const anonId = req.cookies.get('anon_id')?.value || '';
    const badge  = req.headers.get('x-badge') || '';
    if (!badgeOK(anonId, badge)) {
      return NextResponse.json({ code: 'stale_badge' }, { status: 403 });
    }
  }

  /* ---------- 2.  existing cookie boot-strap ---------- */
  const res = NextResponse.next();
  if (!req.cookies.get('anon_id')) {
    const id = uuid();
    res.cookies.set('anon_id', id, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
    const fp = sha256(id).toString().substring(0, 10);
    res.cookies.set('fp', fp, {        // readable by JS
      httpOnly: false,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};