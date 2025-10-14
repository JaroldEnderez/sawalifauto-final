import { NextResponse } from "next/server";
import { scrapeIndustry } from "@backend/scraper/industry";

export async function GET(){
    const articles = await scrapeIndustry()
    return NextResponse.json({success:true, articles})
}
