"use client";

import React, { useMemo } from 'react';

interface HeatmapProps {
  dates: string[];
  onToggleDate?: (date: string) => void;
}

export default function Heatmap({ dates, onToggleDate }: HeatmapProps) {
  const { weeks, monthLabels, currentYear } = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const data = [];
    const months: { label: string; weekIndex: number }[] = [];
    
    // Start exactly on January 1st of the current year
    const startDate = new Date(currentYear, 0, 1);
    // Align to the start of that week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let current = new Date(startDate);
    let lastMonth = -1;

    const endDate = new Date(currentYear, 11, 31);
    
    let i = 0;
    while (current <= endDate || current.getDay() !== 0) {
      // Use LOCAL date components (not toISOString which converts to UTC)
      // This ensures IST (+5:30) users get correct dates matching getTodayStr()
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      const dStr = `${y}-${m}-${d}`;
      const weekIndex = Math.floor(i / 7);
      
      if (current.getFullYear() === currentYear && current.getMonth() !== lastMonth) {
        months.push({ 
          label: current.toLocaleString('default', { month: 'short' }), 
          weekIndex: weekIndex
        });
        lastMonth = current.getMonth();
      }

      data.push({
        date: dStr,
        count: dates.includes(dStr) ? 1 : 0,
        isFuture: current > today,
        isCurrentYear: current.getFullYear() === currentYear
      });
      
      current.setDate(current.getDate() + 1);
      i++;
    }
    return { weeks: data, monthLabels: months, currentYear };
  }, [dates]);

  return (
    <div className="w-full bg-surface rounded-[2.5rem] p-5 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2.5 rounded-2xl text-black shadow-[0_0_30px_rgba(194,255,0,0.4)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">{currentYear} CONSISTENCY</h3>
        </div>
        <div className="inline-block self-start sm:self-center text-xs font-black text-black uppercase tracking-[0.2em] bg-primary px-6 py-2 rounded-full shadow-[0_4_20px_rgba(194,255,0,0.3)]">
          FULL YEAR
        </div>
      </div>

      <div className="relative group">
        <div className="overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          <div className="grid grid-cols-[min-content_repeat(53,min-content)] gap-x-1.5 sm:gap-x-2.5 px-2 min-w-max">
            
            {/* Header Row: Month Labels */}
            <div /> 
            {Array.from({ length: 53 }).map((_, weekIdx) => {
              const month = monthLabels.find(m => m.weekIndex === weekIdx);
              return (
                <div key={weekIdx} className="h-8 relative">
                  {month && (
                    <span className="absolute left-0 bottom-2 text-[11px] font-black text-white uppercase whitespace-nowrap tracking-tighter">
                      {month.label}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Grid Body: Day Labels + Squares */}
            <div className="grid grid-rows-7 gap-y-2 sm:gap-y-2.5 pr-6 text-[10px] font-black uppercase">
              <div className="text-white/40 h-4 flex items-center">Sun</div>
              <div className="text-white h-4 flex items-center">Mon</div>
              <div className="text-white/40 h-4 flex items-center">Tue</div>
              <div className="text-white h-4 flex items-center">Wed</div>
              <div className="text-white/40 h-4 flex items-center">Thu</div>
              <div className="text-white h-4 flex items-center">Fri</div>
              <div className="text-white/40 h-4 flex items-center">Sat</div>
            </div>

            {/* The individual Squares */}
            {Array.from({ length: 53 }).map((_, weekIdx) => (
              <div key={weekIdx} className="grid grid-rows-7 gap-y-2 sm:gap-y-2.5">
                {weeks.slice(weekIdx * 7, weekIdx * 7 + 7).map((item, idx) => {
                  const isCrushed = item.count > 0;
                  return (
                    <div 
                      key={idx}
                      title={item.date}
                      onClick={() => onToggleDate?.(item.date)}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-[3px] transition-all duration-300 border cursor-pointer ${
                        !item.isCurrentYear 
                          ? 'opacity-0 pointer-events-none border-transparent' 
                          : isCrushed 
                            ? 'bg-primary border-primary shadow-[0_0_5px_rgba(194,255,0,0.6)]' 
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:scale-110 hover:border-white/20'
                      } ${item.isFuture && !isCrushed ? 'opacity-10' : 'opacity-100'}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-surface via-surface/80 to-transparent pointer-events-none sm:hidden" />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 pt-10 border-t-2 border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
          <p className="text-xs font-black text-white uppercase tracking-widest hidden sm:block">
            TAP SQUARES TO BACKFILL PROGRESS • TOTAL DISCIPLINE
          </p>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-white/5 border border-white/10 rounded-[3px]" />
            <span className="text-xs font-black text-white/40 uppercase tracking-widest">REST</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-primary rounded-[3px] shadow-[0_0_15px_rgba(194,255,0,0.5)]" />
            <span className="text-xs font-black text-primary uppercase tracking-widest">CRUSHED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
