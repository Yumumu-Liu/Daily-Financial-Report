"use client";

import { useState, useEffect, useMemo } from "react";
import { Zap, CheckCircle2 } from "lucide-react";
import sntData from "@/data/snt_questions.json";

export function LogicEngine() {
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [daysToOffer, setDaysToOffer] = useState<number | null>(null);

  // 从真实数据中动态聚合标签和统计信息
  const tagStats = useMemo(() => {
    const stats: Record<string, { total: number, mastered: boolean }> = {};
    
    sntData.forEach(q => {
      // 聚合所有有效 tag
      q.tags.forEach(tag => {
        if (!stats[tag]) stats[tag] = { total: 0, mastered: false };
        stats[tag].total += 1;
      });
      // 将 category 也作为大类 tag 展示
      const catTag = `#${q.category.replace(/\s+/g, '')}`;
      if (!stats[catTag]) stats[catTag] = { total: 0, mastered: false };
      stats[catTag].total += 1;
    });

    // 将对象转为数组并按题目数量排序，模拟掌握状态 (这里随机模拟几个为掌握)
    return Object.entries(stats)
      .map(([label, data], index) => ({
        id: label,
        label: label,
        count: data.total,
        // 伪造：每隔三个标记为掌握状态
        mastered: index % 3 === 0 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12); // 只展示前 12 个高频标签
  }, []);

  useEffect(() => {
    if (!interviewDate) return;
    const target = new Date(interviewDate);
    const today = new Date();
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 3600 * 24));
    setDaysToOffer(diff > 0 ? diff : 0);
  }, [interviewDate]);

  const isCramMode = daysToOffer !== null && daysToOffer <= 7;

  return (
    <div className="bento-card flex flex-col h-full">
      <div className="bento-header flex justify-between items-center">
        <span>Logic Engine & Knowledge Graph</span>
        {isCramMode && (
          <span className="flex items-center text-orange-500 space-x-1 font-bold animate-pulse">
            <Zap className="w-4 h-4" />
            <span>CRAM MODE ON</span>
          </span>
        )}
      </div>
      <div className="bento-content flex flex-col gap-6 flex-1">
        
        {/* Countdown & Intensity */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Target Interview Date</label>
          <div className="flex items-center space-x-4">
            <input 
              type="date" 
              className="border border-finance-divider p-2 text-sm focus:outline-none focus:border-finance-blue"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
            {daysToOffer !== null && (
              <div className="flex flex-col">
                <span className="text-2xl font-mono font-bold leading-none">{daysToOffer}</span>
                <span className="text-[10px] uppercase text-slate-500 font-semibold">Days to Offer</span>
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Graph Tags */}
        <div className="flex-1 border-t border-finance-divider pt-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase">Knowledge Nodes</label>
            <span className="text-xs font-mono text-finance-blue font-bold">Total S&T Qs: {sntData.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagStats.map(tag => (
              <div 
                key={tag.id}
                className={`px-3 py-1.5 text-xs font-medium flex items-center space-x-1 transition-all ${
                  tag.mastered 
                    ? "bg-finance-blue text-white border border-finance-blue" 
                    : "bg-slate-50 text-slate-500 border border-slate-200"
                }`}
                title={`${tag.count} questions available`}
              >
                <span>{tag.label} <span className="opacity-70 text-[10px]">({tag.count})</span></span>
                {tag.mastered && <CheckCircle2 className="w-3 h-3" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}