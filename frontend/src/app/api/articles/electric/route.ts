import { NextResponse } from "next/server";
import { scrapeElectric } from "@backend/scraper/electric";

export async function GET() {
  const articles = await scrapeElectric();
  return NextResponse.json({ success: true, articles });
}
