"use client";

import { useState } from "react";
import { MarketTicker } from "@/components/MarketTicker";
import { MarketPitchGenerator } from "@/components/MarketPitchGenerator";
import { DCFWaterfall } from "@/components/DCFWaterfall";
import { LogicEngine } from "@/components/LogicEngine";
import { MockInterview } from "@/components/MockInterview";
import { SntLearningMode } from "@/components/SntLearningMode";
import { EconomicCalendar } from "@/components/EconomicCalendar";
import { DailyTradeIdea } from "@/components/DailyTradeIdea";

type Track = 'selection' | 'ibd' | 'snt';
type SntMode = 'selection' | 'learning' | 'mock';

export default function Home() {
  const [track, setTrack] = useState<Track>('selection');
  const [sntMode, setSntMode] = useState<SntMode>('selection');

  // 当切换 Track 时，重置子模式
  const handleSetTrack = (t: Track) => {
    setTrack(t);
    setSntMode('selection');
  };

  if (track === 'selection') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-finance-bg p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">AlphaPrep</h1>
            <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">
              Institutional Grade Interview Platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* IBD Selection Card */}
            <button 
              onClick={() => handleSetTrack('ibd')}
              className="bento-card p-8 text-left hover:border-finance-blue transition-colors group relative overflow-hidden h-full flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-finance-blue transform -translate-x-full group-hover:translate-x-0 transition-transform" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Investment Banking</h2>
                <p className="text-slate-500 text-sm mb-8">M&A, Coverage, Capital Markets</p>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-finance-blue"></div>
                    <span>Visual Valuation & DCF Models</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-finance-blue"></div>
                    <span>Technical Deep Dives</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-finance-blue"></div>
                    <span>Firm-Specific Mock Interviews</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 text-xs font-bold text-finance-blue uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                Select Track &rarr;
              </div>
            </button>

            {/* S&T Selection Card */}
            <button 
              onClick={() => handleSetTrack('snt')}
              className="bento-card p-8 text-left hover:border-finance-blue transition-colors group relative overflow-hidden h-full flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-finance-blue transform -translate-x-full group-hover:translate-x-0 transition-transform" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Sales & Trading</h2>
                <p className="text-slate-500 text-sm mb-8">Equities, FICC, Structuring</p>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-finance-blue"></div>
                    <span>Live Market Context</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-finance-blue"></div>
                    <span>60-Second Trade Pitch</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-finance-blue"></div>
                    <span>Market-Driven Mock Interviews</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 text-xs font-bold text-finance-blue uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                Select Track &rarr;
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-finance-bg">
      {/* Top Level Market Ticker - Only visible in S&T */}
      {track === 'snt' && <MarketTicker />}

      {/* Main Dashboard Container */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-6 flex justify-between items-end border-b border-finance-divider pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">AlphaPrep</h1>
            <p className="text-sm text-finance-blue font-bold uppercase tracking-wider mt-1">
              {track === 'ibd' ? 'IBD Track Active' : 'S&T Track Active'}
            </p>
          </div>
          <div className="flex space-x-4 items-center">
            {track === 'snt' && sntMode !== 'selection' && (
              <button 
                onClick={() => setSntMode('selection')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider transition-colors px-4 py-2"
              >
                &larr; Back to S&T Menu
              </button>
            )}
            <button 
              onClick={() => handleSetTrack('selection')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider transition-colors border border-finance-divider px-4 py-2 hover:bg-slate-50"
            >
              Exit Track
            </button>
          </div>
        </header>

        {/* S&T Mode Selection */}
        {track === 'snt' && sntMode === 'selection' && (
          <div className="flex flex-col w-full max-w-[1600px] mx-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Mode Selection Cards & Trade Idea (Takes 5 columns) */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                
                {/* Training Mode */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 h-7">Training Mode</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSntMode('learning')}
                      className="bento-card p-6 text-left hover:border-finance-blue transition-colors group relative overflow-hidden h-[180px] flex flex-col justify-center"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-finance-blue transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Learn Knowledge</h3>
                      <p className="text-sm text-slate-500">Master S&T chapters and take quizzes</p>
                      <div className="mt-4 text-xs font-bold text-finance-blue uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                        Start Learning &rarr;
                      </div>
                    </button>

                    <button 
                      onClick={() => setSntMode('mock')}
                      className="bento-card p-6 text-left hover:border-finance-blue transition-colors group relative overflow-hidden h-[180px] flex flex-col justify-center"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-finance-blue transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Mock Interview</h3>
                      <p className="text-sm text-slate-500">Live practice with Pitch and Q&A</p>
                      <div className="mt-4 text-xs font-bold text-finance-blue uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                        Start Mock &rarr;
                      </div>
                    </button>
                  </div>
                </div>

                {/* Daily Trade Idea */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Market Insights</h2>
                  <div className="w-full">
                    <DailyTradeIdea />
                  </div>
                </div>

              </div>

              {/* Right Column: Economic Calendar (Takes 7 columns) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-slate-900 mb-2 h-7">Market Events</h2>
                <div className="w-full h-full flex flex-col">
                  <EconomicCalendar />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* S&T Learning Mode */}
        {track === 'snt' && sntMode === 'learning' && (
          <SntLearningMode />
        )}

        {/* Bento Box Grid Layout - For IBD or S&T Mock Mode */}
        {(track === 'ibd' || (track === 'snt' && sntMode === 'mock')) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[350px]">
            
            {track === 'snt' && sntMode === 'mock' && (
              <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 row-span-2">
                <MarketPitchGenerator />
              </div>
            )}

            {track === 'ibd' && (
              <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 row-span-1">
                <DCFWaterfall />
              </div>
            )}

            {/* Logic Engine - Shared */}
            <div className="col-span-1 lg:col-span-1 xl:col-span-1 row-span-1">
              <LogicEngine />
            </div>

            {/* Firm DNA & Mock Interview - Shared */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1 row-span-1">
              <MockInterview />
            </div>

          </div>
        )}
      </div>
    </main>
  );
}