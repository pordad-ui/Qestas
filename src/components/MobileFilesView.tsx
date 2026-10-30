import React, { useState } from 'react';
import { LegalCase } from '../types/legal';
import { Search, FolderGit2, Calendar, MapPin, ChevronLeft, ShieldCheck, Filter } from 'lucide-react';

interface MobileFilesViewProps {
  cases: LegalCase[];
  onSelectCase: (c: LegalCase) => void;
  onOpenNewCaseTriage: () => void;
}

export const MobileFilesView: React.FC<MobileFilesViewProps> = ({
  cases,
  onSelectCase,
  onOpenNewCaseTriage,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = cases.filter((c) => {
    if (filter === 'active' && c.status === 'مختومه') return false;
    if (filter === 'closed' && c.status !== 'مختومه') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.includes(q) ||
        c.courtBranch.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 text-right">
      {/* Top Title & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">پرونده‌های من</h2>
          <span className="text-[11px] text-slate-400">سامانه متمرکز دادخواست‌ها و شکواییه‌ها</span>
        </div>
        <button
          onClick={onOpenNewCaseTriage}
          className="text-xs font-bold text-slate-950 bg-[#F59E0B] hover:bg-[#d97706] px-3.5 py-2 rounded-xl transition-colors shadow-md shadow-[#F59E0B]/20 cursor-pointer flex items-center gap-1.5"
        >
          <span>ثبت پرونده جدید</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجوی شماره پرونده یا عنوان..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-2.5 pr-10 pl-4 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#F59E0B]/60 transition-colors"
        />
        <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'all'
              ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          همه ({cases.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'active'
              ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          در جریان
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'closed'
              ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          مختومه
        </button>
      </div>

      {/* Cases List */}
      <div className="space-y-3 pt-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectCase(item)}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/80 hover:border-[#F59E0B]/40 transition-all cursor-pointer shadow-lg space-y-2.5 group"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full border border-[#F59E0B]/30 font-mono tabular-nums">
                {item.caseNumber}
              </span>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {item.status}
              </span>
            </div>

            <h3 className="text-xs font-bold text-slate-100 group-hover:text-[#F59E0B] transition-colors leading-snug">
              {item.title}
            </h3>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/50">
              <span className="flex items-center gap-1 truncate max-w-[200px]">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                {item.courtBranch}
              </span>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#F59E0B] transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
