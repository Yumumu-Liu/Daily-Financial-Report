"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import dailyIdeas from "@/data/daily_trade_ideas.json";

export function DailyTradeIdea() {
  // Reverse the array so the newest is first
  const ideas = [...dailyIdeas].reverse();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    if (currentIndex < ideas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentIdea = ideas[currentIndex];
  const isLatest = currentIndex === 0;

  return (
    <div className="bento-card w-full flex flex-col min-h-[300px]">
      <div className="bento-header flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Daily Trade Idea</span>
          {isLatest && <span className="bg-finance-blue text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-wider">NEW</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {currentIdea.date}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrevious} 
              disabled={currentIndex === ideas.length - 1}
              className="p-1 text-slate-400 hover:text-finance-blue disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNext} 
              disabled={currentIndex === 0}
              className="p-1 text-slate-400 hover:text-finance-blue disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 overflow-auto bg-white flex flex-col gap-4">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-xl font-bold text-finance-blue mb-1">{currentIdea.title}</h3>
          <p className="text-sm font-medium text-slate-600">{currentIdea.prompt}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-1">1. Market Outlook</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{currentIdea.outlook}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-1">2. Is it priced in?</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{currentIdea.pricedIn}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-1">3. Structure the Trade</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{currentIdea.structure}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-1">4. Risk</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{currentIdea.risk}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
