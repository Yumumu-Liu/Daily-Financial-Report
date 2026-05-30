"use client";

import { useEffect, useState } from "react";

const DEFAULT_TICKERS = [
  { symbol: "S&P 500", price: "Loading...", change: "", pct: "" },
  { symbol: "10Y Treasury", price: "Loading...", change: "", pct: "" },
  { symbol: "SOFR", price: "4.560%", change: "0.000", pct: "0.00%" },
  { symbol: "USD/JPY", price: "Loading...", change: "", pct: "" },
  { symbol: "EUR/USD", price: "Loading...", change: "", pct: "" },
  { symbol: "GOLD", price: "Loading...", change: "", pct: "" },
  { symbol: "WTI CRUDE", price: "Loading...", change: "", pct: "" },
];

export function MarketTicker() {
  const [offset, setOffset] = useState(0);
  const [tickers, setTickers] = useState(DEFAULT_TICKERS);

  useEffect(() => {
    // Fetch live data
    const fetchTickers = async () => {
      try {
        const res = await fetch("/api/ticker");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setTickers(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live tickers", err);
      }
    };

    fetchTickers();
    // Optional: Refresh every 60 seconds
    const interval = setInterval(fetchTickers, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      // Adjust speed here (higher divisor = slower)
      setOffset((elapsed / 30) % 1000);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full bg-slate-900 text-white overflow-hidden flex h-10 items-center text-sm border-b border-finance-divider">
      <div className="px-4 py-2 font-bold bg-finance-blue z-10 whitespace-nowrap h-full flex items-center shadow-[2px_0_5px_rgba(0,0,0,0.5)]">
        LIVE MARKET
      </div>
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <div
          className="flex whitespace-nowrap absolute"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {/* Duplicate the array to create seamless loop */}
          {[...tickers, ...tickers, ...tickers, ...tickers].map((ticker, i) => (
            <div key={i} className="flex items-center px-6 border-r border-slate-700">
              <span className="font-semibold mr-2">{ticker.symbol}</span>
              <span className="mr-2">{ticker.price}</span>
              {ticker.change && (
                <span
                  className={
                    ticker.change.startsWith("+")
                      ? "text-green-400"
                      : ticker.change.startsWith("-")
                      ? "text-red-400"
                      : "text-slate-400"
                  }
                >
                  {ticker.change} ({ticker.pct})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}