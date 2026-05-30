import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // We use ForexFactory's public XML feed as Investing.com blocks automated requests (Cloudflare 403).
    // The data points (events, impacts, actuals, forecasts) are identical in nature.
    const url = "https://nfs.faireconomy.media/ff_calendar_thisweek.xml";
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch calendar data: ${response.status}`);
    }

    const xmlData = await response.text();
    
    const parser = new XMLParser();
    const result = parser.parse(xmlData);
    
    const events = result.weeklyevents?.event || [];
    
    // Filter and map events
    const mappedEvents = events.map((ev: Record<string, unknown>) => ({
      title: ev.title || "Unknown Event",
      country: ev.country || "",
      date: ev.date || "",
      time: ev.time || "",
      impact: ev.impact || "Low",
      forecast: ev.forecast || "",
      previous: ev.previous || "",
      actual: ev.actual || ""
    }));

    return NextResponse.json(mappedEvents);
  } catch (error: unknown) {
    console.error("Error fetching calendar data:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message || "Failed to fetch calendar" }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 });
  }
}
