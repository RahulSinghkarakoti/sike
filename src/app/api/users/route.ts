// app/api/users/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
    const users = await prisma.user.findMany(); // SELECT * FROM User
    return Response.json(users);
}

export async function POST(req: Request) {
    const body = await req.json();
    const user = await prisma.user.create({
        data: {
            nickname: body.name,
        },
    });
    return Response.json(user);
}