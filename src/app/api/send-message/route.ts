import { cookies } from 'next/headers';
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'; 

export async function POST(req: Request, res: Response) {
    try {
        const user_id = (req as any).cookies?.get('anon_id')?.value

        if (!user_id) return NextResponse.json({ status: 400, message: 'User Id Not Found',user_id })

        const { roomId, text } = await req?.json()

        //check if member of room
        //make a message entry , return

        const isMember = await prisma.userRoom.findFirst({
            where: {
                roomId: roomId,
                userId: user_id
            }
        })

        if (!isMember) return NextResponse.json({ status: 400, message: 'You Are Not The Member Of This Room' })

        const message = await prisma.message.create({
            data: {
                roomId: roomId,
                senderId: user_id,
                text: text.trim()
            }
        })
        
        
        return NextResponse.json({status:200,message:'Message sent successfull.',newMessage:message})

    }  catch (err: any) {
    console.error("send-message error:", err)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 