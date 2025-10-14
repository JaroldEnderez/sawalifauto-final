import { NextResponse } from "next/server";
import { scrapeExclusive } from "@backend/scraper/exclusive";

export async function GET() {
  const articles = await scrapeExclusive();
  return NextResponse.json({ success: true, articles });
}
