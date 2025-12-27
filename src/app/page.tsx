import Hero from "@/components/Hero";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import MyRoomPage from "@/components/MyRoomPage";
import { ChatProvider } from "@/context/ChatContext";

export default async function Home() {
    const cookieStore = await cookies();
  const anonId = cookieStore.get("anon_id")?.value;

  if (anonId) {
    await prisma.user.upsert({
      where: { id: anonId },
      update: { lastSeen: new Date() },
      create: { id: anonId },
    });
  }

  return (
    <>
     <ChatProvider>
        <MyRoomPage />
      </ChatProvider>
    </>
  );
}
