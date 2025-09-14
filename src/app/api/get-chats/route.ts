import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';


export async function POST(req:NextRequest){
    const userId=await req.cookies?.get('annon_id')?.value

    

} 