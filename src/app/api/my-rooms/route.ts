import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest,res:NextResponse) {
    const anon_id  = req.cookies?.get('anon_id')?.value
    console.log(anon_id)
    const chatRooms = await prisma.chatRoom.findMany({
        where: {
            OR:[
                {createdById:anon_id},
                {members:{some:{userId:anon_id}}}
            ]
        },
        include:{
            members:true,
            messages:true
        }
    })
    console.log(chatRooms)

    return NextResponse.json({status:200,message:'room fethced',rooms:chatRooms})
} 