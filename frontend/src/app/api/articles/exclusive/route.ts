import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Use your deployed Render backend URL here
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scraper/exclusive`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching exclusive articles:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
  }
}
