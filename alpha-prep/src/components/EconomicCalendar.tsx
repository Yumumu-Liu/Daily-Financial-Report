"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type CalendarEvent = {
  title: string;
  country: string;
  date: string;
  time: string;
  impact: string;
  forecast: string;
  previous: string;
  actual: string;
};

export function EconomicCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch("/api/calendar");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        // Filter for high/medium impact events globally to ensure we always have data
        const highImpact = (data as CalendarEvent[]).filter(
          (e) => e.impact === "High" || e.impact === "Medium"
        ).slice(0, 15);
        setEvents(highImpact);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-orange-400";
      case "Low": return "bg-yellow-400";
      default: return "bg-slate-300";
    }
  };

  return (
    <div className="bento-card w-full flex flex-col h-full min-h-[400px]">
      <div className="bento-header flex justify-between items-center">
        <span>Economic Calendar (Key Events)</span>
        <span className="text-[10px] text-slate-400 normal-case">Real-time Macro Data</span>
      </div>
      <div className="flex-1 w-full bg-white overflow-x-auto overflow-y-auto relative">
        {loading ? (
          <div className="h-full flex items-center justify-center text-finance-blue">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Unable to load calendar data.
          </div>
        ) : events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No key events scheduled.
          </div>
        ) : (
          <table className="w-full text-[13px] text-left min-w-[500px]">
            <thead className="bg-slate-50 sticky top-0 border-b border-finance-divider z-10">
              <tr>
                <th className="px-3 py-2.5 font-semibold text-slate-500 w-20">Time</th>
                <th className="px-3 py-2.5 font-semibold text-slate-500 w-12">Cur.</th>
                <th className="px-3 py-2.5 font-semibold text-slate-500 w-12">Imp.</th>
                <th className="px-3 py-2.5 font-semibold text-slate-500">Event</th>
                <th className="px-3 py-2.5 font-semibold text-slate-500 text-right w-20">Actual</th>
                <th className="px-3 py-2.5 font-semibold text-slate-500 text-right w-20">Forecast</th>
                <th className="px-3 py-2.5 font-semibold text-slate-500 text-right w-20">Prev.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((ev, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 text-slate-900 font-medium whitespace-nowrap">
                    <span className="text-slate-500 mr-1.5 text-[11px]">{ev.date.substring(0, 5)}</span>
                    {ev.time}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-slate-700">{ev.country}</td>
                  <td className="px-3 py-2.5">
                    <div className={`w-2 h-2 rounded-full ${getImpactColor(ev.impact)}`} title={ev.impact} />
                  </td>
                  <td className="px-3 py-2.5 text-slate-900 truncate max-w-[180px]" title={ev.title}>
                    {ev.title}
                  </td>
                  <td className={`px-3 py-2.5 text-right font-medium ${ev.actual ? 'text-slate-900' : 'text-slate-400'}`}>
                    {ev.actual || '-'}
                  </td>
                  <td className="px-3 py-2.5 text-right text-slate-500">{ev.forecast || '-'}</td>
                  <td className="px-3 py-2.5 text-right text-slate-500">{ev.previous || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
