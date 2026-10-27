import React, { useState } from 'react';
import {
  Brain,
  Scale,
  ShieldCheck,
  Search,
  Sparkles,
  Award,
  PhoneCall,
  Clock,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { CMSContent } from '../types/legal';

interface HeroBannerProps {
  cms: CMSContent;
  onOpenTriage: () => void;
  onSearchLawyer: (query: string) => void;
  onGoToCases: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  cms,
  onOpenTriage,
  onSearchLawyer,
  onGoToCases,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchLawyer(searchInput.trim());
    }
  };

  const sampleKeywords = cms.popularSearchTags?.length > 0 
    ? cms.popularSearchTags 
    : ['چک صیادی', 'الزام به تنظیم سند', 'طلاق و مهریه', 'کلاهبرداری اینترنتی', 'تخلیه مستاجر'];

  const stats = cms.statsCards?.length > 0 ? cms.statsCards : [
    { id: 'stat-1', value: '۳۵۰+', label: 'وکیل پایه یک احراز هویت شده', color: 'amber' as const },
    { id: 'stat-2', value: '۹۸.۴٪', label: 'رضایت موکلین از مشاوره', color: 'emerald' as const },
    { id: 'stat-3', value: '۱۴,۲۰۰+', label: 'مشاوره و تریاژ موفق پرونده', color: 'cyan' as const },
    { id: 'stat-4', value: '۲۵۶-bit', label: 'رمزنگاری سرتاسری اسناد و ویدیو', color: 'purple' as const },
  ];

  const getStatColorClass = (color: string) => {
    switch (color) {
      case 'amber': return 'text-amber-400';
      case 'emerald': return 'text-emerald-400';
      case 'cyan': return 'text-cyan-400';
      case 'purple': return 'text-purple-400';
      case 'blue': return 'text-blue-400';
      case 'rose': return 'text-rose-400';
      default: return 'text-amber-400';
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 py-10 px-4">
      {/* Background glowing legal scales effect */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Announcement Ticker & Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-xs text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{cms.announcementTicker}</span>
          </div>
          {cms.heroBadge && (
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-full px-3 py-1 text-[11px] text-slate-300">
              <Award className="w-3 h-3 text-amber-400" />
              <span>{cms.heroBadge}</span>
            </span>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-5 text-right">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {cms.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {cms.heroSubtitle}
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={cms.heroSearchPlaceholder || 'جستجوی موضوع پرونده (مثلا: چک، الزام به سند، طلاق، کلاهبرداری) یا نام وکیل...'}
                className="w-full bg-slate-950/90 border border-slate-700 focus:border-amber-500 rounded-2xl py-3.5 pr-11 pl-28 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-xl"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                جستجو
              </button>
            </form>

            {/* Popular tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400">جستجوهای پرطرفدار:</span>
              {sampleKeywords.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSearchLawyer(tag)}
                  className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onOpenTriage}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
              >
                <Brain className="w-5 h-5 text-slate-950 animate-pulse" />
                <span>{cms.heroTriageButtonText || 'تریاژ رایگان پرونده با هوش مصنوعی'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToCases}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold px-5 py-3.5 rounded-2xl text-sm transition-colors cursor-pointer"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>{cms.heroTrackingButtonText || 'پیگیری پرونده در سامانه عدل ایران'}</span>
              </button>
            </div>
          </div>

          {/* AI Triage Card Visual Feature */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{cms.triageCardTitle || 'سامانه تریاژ حقوقی دادگستر'}</h3>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {cms.triageCardStatusText || 'موتور هوش مصنوعی آنلاین و آماده تحلیل'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                  {cms.triageCardLawYearBadge || 'قوانین ۱۴۰۳'}
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                  <div className="text-slate-400 mb-1 font-medium">قابلیت‌های تریاژ هوشمند:</div>
                  <ul className="space-y-1.5 text-slate-300">
                    {(cms.triageCardFeatures || [
                      'دسته‌بندی خودکار دعوا (کیفری، حقوقی، خانواده، ملکی، کار)',
                      'استخراج مواد قانونی حاکم (قانون مدنی، مجازات و آیین دادرسی)',
                      'تخمین ادله اثبات لازم، درصد موفقیت و مدت زمان تقریبی',
                      'معرفی وکیل متخصص با بالاترین آمار پیروزی مرتبط',
                    ]).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-slate-400 pt-1 text-[11px]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {cms.triageCardConfidentialityNotice || 'حفظ ۱۰۰٪ محرمانگی طبق اصل وکالت'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {cms.triageCardSpeedNotice || 'تحلیل در کمتر از ۱۰ ثانیه'}
                  </span>
                </div>

                <button
                  onClick={onOpenTriage}
                  className="w-full mt-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{cms.triageCardCtaText || 'تست آنلاین تریاژ با پرونده نمونه یا دلخواه'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-6 border-t border-slate-800/80">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <div className={`text-2xl font-black ${getStatColorClass(stat.color)}`}>{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
