import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: Request, res: Response) {
    try {


        const anon_id = (req as any).cookies?.get('anon_id')?.value

        if (!anon_id) return NextResponse.json({ status: 400, message: 'User Id Not Found' })

        const body = await req?.json()
        const roomSlug = body?.slug

        // todo
        // checck room exist or not
        // check is room locked?
        // if not  add user as a member of it
        // return respose

        const exist = await prisma.chatRoom.findFirst({
            where: {
                slug: roomSlug
            },
        })

        if (!exist) {
            return NextResponse.json({ status: 400, message: 'Room Not Found.' })
        } else if (exist.lock) {
            return NextResponse.json({ status: 400, message: 'Room Is Locked.' })
        }

        const alreadyMember = await prisma.userRoom.findFirst({
            where: {
                userId: anon_id,
                roomId: exist.id
            }
        })

        if (alreadyMember) {
            return NextResponse.json({ status: 400, message: 'Already Member Of This Room.' })
        }

        const newUserRoom = await prisma.userRoom.create({
            data: {
                userId: anon_id,
                roomId: exist.id,
            }
        })
        const chat = await prisma.chatRoom.findFirst({
            where: {
                id: exist.id,
            },
        })


        return NextResponse.json({ status: 201, message: 'Room Joined Successfully.',chat })

    } catch (error) {
        console.log(error)
    }
}