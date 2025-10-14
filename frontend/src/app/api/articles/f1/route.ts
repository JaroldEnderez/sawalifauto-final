import { NextResponse } from "next/server";
import { scrapeF1 } from "@backend/scraper/f1";

export async function GET(){
    const articles = await scrapeF1()
    return NextResponse.json({success:true, articles})
}
