// app/api/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const anonId = req.cookies.get("anon_id")?.value;
  if (!anonId) {
    return NextResponse.json({ error: "No anon_id cookie" }, { status: 400 });
  }

  await prisma.user.upsert({
    where: { id: anonId },
    update: { lastSeen: new Date() },
    create: { id: anonId },
  });

  return NextResponse.json({ ok: true, anonId });
}
