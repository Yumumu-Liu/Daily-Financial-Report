"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function DCFWaterfall() {
  const [wacc, setWacc] = useState(8.5);
  const [tgr, setTgr] = useState(2.5);

  // Simplified DCF calculation mock
  const calculateDCF = () => {
    const fcf = [100, 110, 120, 130, 140]; // Year 1 to 5 FCF
    const discountFactors = fcf.map((_, i) => Math.pow(1 + wacc / 100, i + 1));
    const pvFcf = fcf.map((val, i) => val / discountFactors[i]);
    
    const terminalValue = (fcf[4] * (1 + tgr / 100)) / ((wacc - tgr) / 100);
    const pvTv = terminalValue / Math.pow(1 + wacc / 100, 5);

    const sumPvFcf = pvFcf.reduce((a, b) => a + b, 0);
    const enterpriseValue = sumPvFcf + pvTv;

    return {
      pvFcf: sumPvFcf,
      pvTv: pvTv,
      enterpriseValue
    };
  };

  const { pvFcf, pvTv, enterpriseValue } = calculateDCF();

  const data = [
    { name: "PV of FCF", value: parseFloat(pvFcf.toFixed(1)) },
    { name: "PV of TV", value: parseFloat(pvTv.toFixed(1)) },
    { name: "Implied EV", value: parseFloat(enterpriseValue.toFixed(1)) },
  ];

  return (
    <div className="bento-card flex flex-col h-full">
      <div className="bento-header">
        Interactive DCF Waterfall
      </div>
      <div className="bento-content flex flex-col md:flex-row h-full gap-6">
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-semibold text-slate-700">WACC (%)</label>
              <span className="text-sm font-mono text-finance-blue">{wacc.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="5" max="15" step="0.1" 
              value={wacc} 
              onChange={(e) => setWacc(parseFloat(e.target.value))}
              className="w-full accent-finance-blue"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-semibold text-slate-700">Terminal Growth Rate (%)</label>
              <span className="text-sm font-mono text-finance-blue">{tgr.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="5" step="0.1" 
              value={tgr} 
              onChange={(e) => setTgr(parseFloat(e.target.value))}
              className="w-full accent-finance-blue"
            />
          </div>
          <div className="pt-4 border-t border-finance-divider">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold uppercase text-slate-500">Enterprise Value</span>
              <span className="text-xl font-bold font-mono text-slate-900">${enterpriseValue.toFixed(0)}M</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 h-64 md:h-auto min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis hide domain={[0, 'dataMax + 500']} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: 0, border: '1px solid #E2E8F0', boxShadow: 'none' }} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 2 ? '#0052FF' : '#94A3B8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}