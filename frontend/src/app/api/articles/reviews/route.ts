import { NextResponse } from "next/server";
import { scrapeTopGear } from "@backend/scraper/topgear";

export async function GET(){
    const articles = await scrapeTopGear()
    return NextResponse.json({success:true, articles})
}
