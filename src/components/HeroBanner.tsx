import React, { useState } from 'react';
import {
  Brain,
  Search,
  Sparkles,
  Award,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { CMSContent } from '../types/legal';
import { LegalScalesLogo } from './LegalScalesLogo';

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
    { id: 'stat-2', value: '۹۸.۴٪', label: 'رضایت موکلین از کیفیت مشاوره', color: 'emerald' as const },
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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 pt-8 pb-12 px-4 sm:px-6">
      {/* Subtle judicial atmospheric illumination (inspired by Harvey AI & Clio) */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[32rem] h-[32rem] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-[28rem] h-[28rem] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Minimalist Announcement Header (Anti-slop: clean typography, no heavy pill sandwich) */}
        <div className="flex items-center gap-2 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-amber-400 font-medium">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{cms.announcementTicker}</span>
          </div>
          {cms.heroBadge && (
            <>
              <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
              <span className="hidden sm:inline text-slate-400">{cms.heroBadge}</span>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Hero Copy & Clear Actions */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.2] tracking-tight" style={{ textWrap: 'balance' }}>
              {cms.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {cms.heroSubtitle}
            </p>

            {/* Streamlined Legal Search Bar */}
            <div className="space-y-2.5 max-w-xl">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={cms.heroSearchPlaceholder || 'جستجوی موضوع دعوا (چک، ملک، طلاق، کلاهبرداری) یا نام وکیل...'}
                  className="w-full bg-slate-900/95 border border-slate-700/80 focus:border-amber-500/90 rounded-2xl py-3.5 pr-11 pl-28 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-xl transition-all"
                />
                <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                >
                  جستجو
                </button>
              </form>

              {/* Clean Popular Keywords (quiet text buttons, zero clutter) */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 text-[11px]">جستجوهای پرطرفدار:</span>
                {sampleKeywords.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onSearchLawyer(tag)}
                    className="text-[11px] text-slate-300 hover:text-amber-300 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onOpenTriage}
                className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Brain className="w-5 h-5 text-slate-950 shrink-0" />
                <span>{cms.heroTriageButtonText || 'تریاژ رایگان پرونده با هوش مصنوعی'}</span>
                <ArrowLeft className="w-4 h-4 mr-1 shrink-0" />
              </button>

              <button
                onClick={onGoToCases}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium px-5 py-3.5 rounded-2xl text-sm transition-all hover:border-slate-600 cursor-pointer"
              >
                <span>{cms.heroTrackingButtonText || 'پیگیری پرونده در سامانه عدل ایران'}</span>
              </button>
            </div>
          </div>

          {/* Prestige Judicial Scale & Trust Seal (International Legal Benchmark) */}
          <div className="lg:col-span-5">
            <div className="relative bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-700/70 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
              {/* Top Seal Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <LegalScalesLogo size="sm" variant="gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {cms.triageCardTitle || 'سامانه تریاژ حقوقی دادگستر'}
                    </h3>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      {cms.triageCardStatusText || 'موتور هوش مصنوعی آنلاین و آماده تحلیل'}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                  {cms.triageCardLawYearBadge || 'قوانین ۱۴۰۳'}
                </span>
              </div>

              {/* Big Centerpiece: Custom Scales of Justice Emblem */}
              <div className="my-5 flex flex-col items-center justify-center py-4 bg-slate-950/50 rounded-2xl border border-slate-800/60 relative group">
                <LegalScalesLogo size="xl" variant="gold" showRays interactive />
                <span className="text-xs font-semibold text-amber-200/90 mt-2">
                  ترازوی سنجش ادله و موازنه حقوقی
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  تطبیق بلادرنگ با قوانین مدنی، تجارت، کیفری و آیین دادرسی
                </span>
              </div>

              {/* Quiet Features List */}
              <div className="space-y-2 text-xs text-slate-300">
                {(cms.triageCardFeatures || [
                  'دسته‌بندی خودکار دعوا و تعیین شعبه صلاحیت‌دار',
                  'استخراج مواد قانونی حاکم و تحلیل ادله اثبات دعوا',
                  'تخمین شانس پیروزی و معرفی وکلای متخصص برگزیده',
                ]).slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="line-clamp-1">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Card Meta & Instant Action */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {cms.triageCardConfidentialityNotice || 'رمزنگاری و محرمانگی سوگند وکالت'}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {cms.triageCardSpeedNotice || 'تحلیل در کمتر از ۱۰ ثانیه'}
                </span>
              </div>

              <button
                onClick={onOpenTriage}
                className="w-full mt-4 bg-gradient-to-r from-amber-500/20 to-amber-500/10 hover:from-amber-500/30 hover:to-amber-500/20 text-amber-200 border border-amber-500/40 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{cms.triageCardCtaText || 'تست آنلاین تریاژ با پرونده نمونه یا دلخواه'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist Trust & Metrics Ribbon (Clio/Harvey AI Style: quiet dividers, no bloated card sprawl) */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800/80 text-center">
            {stats.map((stat, idx) => (
              <div key={stat.id || idx} className="py-3 px-4">
                <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums ${getStatColorClass(stat.color)}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
