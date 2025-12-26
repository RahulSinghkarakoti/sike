import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request, res: Response) {

    try {
        const anon_id = (req as any).cookies?.get('anon_id')?.value

        if (!anon_id) return NextResponse.json({ status: 400, message: 'User Id Not Found' })

        const { room_id } = await req?.json()

        //to do
        // check if current user is member of room 
        // return room messages (later be on paginated)

        const isMember = await prisma.userRoom.findFirst({
            where: {
                userId: anon_id,
                roomId: room_id
            }
        })

        if(!isMember){
            return NextResponse.json({status:404,message:'You Are Not The Member Of This Room'})
        }

        const messages=await prisma.message.findMany({
            where:{
                roomId:room_id
            }
        })

        return NextResponse.json({ status: 200, message: 'Message Fetched Successfully.',room_id,messages })

    } catch (error) {
        console.log(error)

    }
} 