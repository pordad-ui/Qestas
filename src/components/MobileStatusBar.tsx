import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  const [time, setTime] = useState('۰۹:۴۱');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      // Format in Persian digits
      const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      const formatted = `${hours}:${minutes}`.replace(/[0-9]/g, (w) => farsiDigits[+w]);
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-11 px-6 flex items-center justify-between text-xs text-slate-300 select-none z-40 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 border-b border-slate-900/60">
      {/* Time */}
      <span className="font-semibold tracking-wide text-[13px] text-slate-200 tabular-nums">
        {time}
      </span>

      {/* Dynamic Island / Camera Pill */}
      <div className="w-24 h-4 bg-slate-950 rounded-full border border-slate-800/80 flex items-center justify-center gap-1.5 shadow-inner">
        <div className="w-2 h-2 rounded-full bg-slate-800" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
      </div>

      {/* Connectivity Icons */}
      <div className="flex items-center gap-1.5 text-slate-300">
        <span className="text-[10px] font-bold text-[#F59E0B] tracking-tight">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <BatteryMedium className="w-4 h-4 text-emerald-400" />
      </div>
    </div>
  );
};
