import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const generateSlug = () => {
    return Math.random().toString(36).slice(-10)
}


export async function POST(req: Request, res: Response) {
    try {
        const annon_id = (req as any).cookies?.get("anon_id")?.value || null
        const body = await req.json()
        const roomName = body?.roomName
        const slug = generateSlug()

        const newRoom = await prisma.chatRoom.create({
            data: {
                name: roomName,
                slug,
                createdById: annon_id,
            }
        })

        await prisma.userRoom.create({
            data: {
                userId: annon_id,
                roomId: newRoom.id
            }
        })
        const response= prisma.chatRoom.findUnique({
            where: { id: newRoom.id },
            include: {
                createdBy: true,
                members: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return NextResponse.json({status:200,newRoom:newRoom})

    } catch (error) {
        console.log(error)
    }
}