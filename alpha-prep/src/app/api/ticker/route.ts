import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new (YahooFinance as any)();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const symbols = ["^GSPC", "^TNX", "JPY=X", "EURUSD=X", "GC=F", "CL=F"];
    
    // Use yahoo-finance2 to fetch quotes, it handles cookies and crumbs automatically
    const quotes = await yahooFinance.quote(symbols) as any[];

    if (!quotes || quotes.length === 0) {
      throw new Error("No quotes returned from Yahoo Finance.");
    }
    
    // Format the results
    const results = quotes.map((q: any) => {
      let symbol = q.symbol;
      let price = q.regularMarketPrice?.toFixed(2) || "0.00";
      let change = q.regularMarketChange?.toFixed(2) || "0.00";
      let pct = ((q.regularMarketChangePercent || 0)).toFixed(2) + "%";
      
      // Formatting specific symbols
      if (symbol === "^GSPC") symbol = "S&P 500";
      if (symbol === "^TNX") {
        symbol = "10Y Treasury";
        price = q.regularMarketPrice?.toFixed(3) + "%";
        change = q.regularMarketChange?.toFixed(3);
      }
      if (symbol === "JPY=X") symbol = "USD/JPY";
      if (symbol === "EURUSD=X") {
        symbol = "EUR/USD";
        price = q.regularMarketPrice?.toFixed(4);
        change = q.regularMarketChange?.toFixed(4);
      }
      if (symbol === "GC=F") symbol = "GOLD";
      if (symbol === "CL=F") symbol = "WTI CRUDE";
      
      if (parseFloat(change) > 0 && !change.startsWith("+")) change = "+" + change;
      if (parseFloat(pct) > 0 && !pct.startsWith("+")) pct = "+" + pct;
      
      return { symbol, price, change, pct };
    });

    // Add SOFR manually (As SOFR is a rate published by NY Fed, it's not a live ticker on Yahoo)
    results.splice(2, 0, {
      symbol: "SOFR",
      price: "5.310%", 
      change: "0.000",
      pct: "0.00%"
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error fetching ticker data:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch data" }, { status: 500 });
  }
}
