"use client";

import { useState, useEffect } from "react";
import { Mic, Activity, AlertTriangle, ChevronRight, Play } from "lucide-react";
import sntData from "@/data/snt_questions.json";

const FIRMS = [
  { id: "GS", name: "Goldman Sachs", traits: "Culture / Spirit / Leadership" },
  { id: "CICC", name: "CICC", traits: "China Macro / Regulatory / A-Shares" },
  { id: "MS", name: "Morgan Stanley", traits: "Technical Rigor / M&A" },
  { id: "JPM", name: "J.P. Morgan", traits: "Market Making / Flow" }
];

export function MockInterview() {
  const [selectedFirm, setSelectedFirm] = useState("GS");
  const [isRecording, setIsRecording] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  
  // 题库状态
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const isPressureTest = correctStreak >= 3;
  const currentQuestion = sntData[currentQuestionIdx];

  const nextQuestion = () => {
    setCurrentQuestionIdx((prev) => (prev + 1) % sntData.length);
    setShowAnswer(false);
    setIsRecording(false);
  };

  const handleSimulateCorrect = () => {
    setCorrectStreak(prev => Math.min(prev + 1, 5));
    nextQuestion();
  };

  const handleSimulateWrong = () => {
    setCorrectStreak(0);
    nextQuestion();
  };

  return (
    <div className="bento-card flex flex-col h-full relative overflow-hidden">
      <div className={`bento-header flex justify-between items-center transition-colors ${isPressureTest ? 'bg-red-50 border-red-200 text-red-700' : ''}`}>
        <span>Firm DNA & Mock Interview</span>
        {isPressureTest && (
          <span className="flex items-center space-x-1 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>PRESSURE TEST ACTIVE</span>
          </span>
        )}
      </div>

      <div className="bento-content flex flex-col gap-4 flex-1 overflow-y-auto">
        {/* Firm Selection */}
        <div>
          <div className="flex space-x-2 mb-2 overflow-x-auto pb-1">
            {FIRMS.map(firm => (
              <button
                key={firm.id}
                onClick={() => setSelectedFirm(firm.id)}
                className={`px-3 py-1 text-xs font-semibold uppercase transition-colors border whitespace-nowrap ${
                  selectedFirm === firm.id 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white text-slate-500 border-finance-divider hover:bg-slate-50"
                }`}
              >
                {firm.id}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500">
            <strong>Focus Area:</strong> {FIRMS.find(f => f.id === selectedFirm)?.traits}
          </div>
        </div>

        {/* Question Display */}
        <div className="flex-1 border border-finance-divider rounded-sm p-4 bg-slate-50 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-finance-blue uppercase tracking-wider">
              {currentQuestion?.category || 'General'} Q{currentQuestionIdx + 1}
            </span>
            <div className="flex gap-1">
              {currentQuestion?.tags?.map(tag => (
                <span key={tag} className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {currentQuestion?.question}
          </h3>

          {showAnswer ? (
            <div className="mt-auto pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 italic">
                {currentQuestion?.answer}
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={handleSimulateWrong} className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50">
                  Failed
                </button>
                <button onClick={handleSimulateCorrect} className="px-3 py-1.5 text-xs font-medium bg-finance-blue text-white hover:bg-blue-700">
                  Nailed It
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-auto flex justify-center">
               <button 
                onClick={() => setShowAnswer(true)}
                className="flex items-center space-x-1 text-sm font-medium text-slate-500 hover:text-finance-blue"
              >
                <span>Reveal Suggested Answer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Adaptive Difficulty Mock Tracker */}
        <div className="flex items-center justify-between border-t border-finance-divider pt-3">
          <span className="text-xs font-medium text-slate-500 uppercase">Correct Streak:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step} 
                className={`w-6 h-1.5 ${step <= correctStreak ? (isPressureTest ? 'bg-red-500' : 'bg-finance-blue') : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Speech to Text UI */}
        <div className={`border p-3 flex items-center justify-between transition-colors ${
          isRecording ? 'border-finance-blue bg-blue-50/30' : 'border-finance-divider bg-slate-50'
        }`}>
          <div className="text-xs font-mono text-slate-500 flex items-center space-x-2">
            {isRecording ? (
              <>
                <Activity className="w-3 h-3 text-finance-blue animate-pulse" />
                <span className="text-finance-blue font-bold">Recording Answer...</span>
              </>
            ) : (
              <span>Practice with Audio</span>
            )}
          </div>
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-none transition-transform hover:scale-105 ${
              isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-900'
            }`}
          >
            {isRecording ? <div className="w-3 h-3 bg-white rounded-sm" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
}