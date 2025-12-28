import { NextResponse, NextRequest } from "next/server"; 
import { HmacSHA256 } from "crypto-js";

export async function generateBadge(anonId:string){
 const current_unix_time = Math.floor(Date.now() / 1000)
  const time_bucket = Math.floor(current_unix_time / Number(process.env.BUCKET_TIME))   
  const badge = HmacSHA256(anonId + time_bucket, process.env.SERVER_SECRET || '').toString();
  return badge
}

export async function GET(req: NextRequest) {
  const anonId = req.cookies.get("anon_id")?.value || ""; 
  const badge =  await generateBadge(anonId)
  return NextResponse.json({ status: 200, badge })
}