"use client";

import { useState, useEffect } from "react";
import { Play, Square, Clock, Lightbulb } from "lucide-react";

export function MarketPitchGenerator() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [pitch, setPitch] = useState({ 
    outlook: "", 
    pricedIn: "", 
    structure: "", 
    risk: "" 
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const startPitch = () => {
    setIsActive(true);
    setTimeLeft(60);
    setPitch({ outlook: "", pricedIn: "", structure: "", risk: "" });
  };

  const stopPitch = () => {
    setIsActive(false);
  };

  const generateExample = () => {
    setPitch({
      outlook: "I have a bearish outlook on crude oil based on both the demand and supply side. Demand from major importers is slowing, while non-OPEC production is increasing.",
      pricedIn: "The put options on oil screen cheap and the option market does not seem to price in the bearish outlook. The volatility skew is relatively flat.",
      structure: "I think $90 is a support level for oil price, so I'd like to buy the 100-90 put spread. (Assuming current oil price is $100)",
      risk: "The total loss is strictly limited to the option premium paid ($1) while the maximum gain is $10 if oil falls below $90 by expiration."
    });
  };

  return (
    <div className="bento-card flex flex-col h-full">
      <div className="bento-header flex justify-between items-center">
        <span>60-Second Trade Pitch</span>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span className={`font-mono text-sm ${timeLeft <= 10 && isActive ? 'text-red-500 font-bold' : ''}`}>
            00:{timeLeft.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      
      <div className="bento-content flex-1 flex flex-col space-y-3 overflow-auto">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-slate-600">
            <strong>Prompt:</strong> What's the trade you like in the current market? Pitch it using the 4-step framework.
          </div>
          <button 
            onClick={generateExample}
            disabled={isActive}
            className="text-xs text-finance-blue hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ml-2"
          >
            <Lightbulb className="w-3 h-3" />
            Load Example
          </button>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">1. Market Outlook</label>
            <textarea 
              className="w-full border border-finance-divider p-2 text-sm focus:outline-none focus:border-finance-blue resize-none h-16 bg-slate-50"
              placeholder="What is your view? (e.g. Bearish outlook on crude oil due to supply/demand...)"
              disabled={!isActive && pitch.outlook === ""}
              value={pitch.outlook}
              onChange={(e) => setPitch({...pitch, outlook: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">2. Is it priced in?</label>
            <textarea 
              className="w-full border border-finance-divider p-2 text-sm focus:outline-none focus:border-finance-blue resize-none h-16 bg-slate-50"
              placeholder="Why will the market react? (e.g. Put options screen cheap, market doesn't price in the bearishness...)"
              disabled={!isActive && pitch.pricedIn === ""}
              value={pitch.pricedIn}
              onChange={(e) => setPitch({...pitch, pricedIn: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">3. Structure the Trade</label>
            <textarea 
              className="w-full border border-finance-divider p-2 text-sm focus:outline-none focus:border-finance-blue resize-none h-16 bg-slate-50"
              placeholder="How do you execute it? (e.g. Buy 3m 100-90 put spread...)"
              disabled={!isActive && pitch.structure === ""}
              value={pitch.structure}
              onChange={(e) => setPitch({...pitch, structure: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">4. What is the risk if I am wrong</label>
            <textarea 
              className="w-full border border-finance-divider p-2 text-sm focus:outline-none focus:border-finance-blue resize-none h-16 bg-slate-50"
              placeholder="How do you control risk? (e.g. Total loss is option premium, max gain is...)"
              disabled={!isActive && pitch.risk === ""}
              value={pitch.risk}
              onChange={(e) => setPitch({...pitch, risk: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          {!isActive ? (
            <button onClick={startPitch} className="btn-primary flex items-center space-x-1">
              <Play className="w-4 h-4" />
              <span>Start 60s Pitch</span>
            </button>
          ) : (
            <button onClick={stopPitch} className="bg-slate-800 text-white px-4 py-2 text-sm font-medium hover:bg-slate-700 transition-colors flex items-center space-x-1">
              <Square className="w-4 h-4" />
              <span>Submit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}