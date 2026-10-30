import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ShieldCheck, PhoneCall, Sparkles, Scale } from 'lucide-react';

interface Announcement {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  icon: 'shield' | 'phone' | 'ai';
  actionLabel: string;
  actionType: 'sana' | 'call' | 'triage';
}

interface MobileAnnouncementBannerProps {
  onOpenTriage: () => void;
  onOpenQuickCall: () => void;
  onOpenSana: () => void;
}

export const MobileAnnouncementBanner: React.FC<MobileAnnouncementBannerProps> = ({
  onOpenTriage,
  onOpenQuickCall,
  onOpenSana,
}) => {
  const announcements: Announcement[] = [
    {
      id: 'ann-1',
      tag: 'سامانه برخط ثنا ۲۴/۷',
      title: 'استعلام لحظه‌ای و ابلاغ الکترونیک عدل‌ایران',
      subtitle: 'مشاهده اوقات نظارت، اخطاریه‌های کارشناسی و دادنامه‌ها با رمز شخصی',
      accentColor: 'from-teal-900/40 via-slate-900 to-[#0F172A] border-teal-500/30 text-teal-300',
      badgeBg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
      badgeText: 'اتصال رسمی پایدار',
      icon: 'shield',
      actionLabel: 'مشاهده ابلاغیه‌ها',
      actionType: 'sana',
    },
    {
      id: 'ann-2',
      tag: 'مشاوره فوری تخصصی',
      title: 'اتصال مستقیم به وکلای پایه یک دادگستری',
      subtitle: 'مشاوره تلفنی و تصویری امن با ضمانت حفظ اسرار حرفه‌ای وکیل و موکل',
      accentColor: 'from-amber-950/40 via-slate-900 to-[#0F172A] border-[#F59E0B]/30 text-amber-300',
      badgeBg: 'bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]',
      badgeText: 'آماده پاسخگویی',
      icon: 'phone',
      actionLabel: 'تماس با وکیل آنلاین',
      actionType: 'call',
    },
    {
      id: 'ann-3',
      tag: 'تریاژ هوش مصنوعی',
      title: 'تحلیل خودکار شکواییه با موتور هوشمند قضایی',
      subtitle: 'استخراج مواد قانونی مرتبط، مدارک مورد نیاز و پیش‌بینی مدت زمان دادرسی',
      accentColor: 'from-cyan-950/40 via-slate-900 to-[#0F172A] border-cyan-500/30 text-cyan-300',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
      badgeText: 'موتور Gemini AI',
      icon: 'ai',
      actionLabel: 'شروع تریاژ هوشمند',
      actionType: 'triage',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const current = announcements[currentIndex];

  const handleAction = () => {
    if (current.actionType === 'triage') onOpenTriage();
    else if (current.actionType === 'call') onOpenQuickCall();
    else onOpenSana();
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Card Carousel Frame */}
      <div
        onClick={handleAction}
        className={`relative p-4 rounded-3xl bg-gradient-to-r ${current.accentColor} border shadow-xl transition-all duration-500 cursor-pointer overflow-hidden group`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Tag & Dot Indicator */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${current.badgeBg} flex items-center gap-1.5`}>
            {current.icon === 'shield' && <ShieldCheck className="w-3 h-3" />}
            {current.icon === 'phone' && <PhoneCall className="w-3 h-3" />}
            {current.icon === 'ai' && <Sparkles className="w-3 h-3" />}
            <span>{current.tag}</span>
          </span>

          <span className="text-[10px] text-slate-400 font-mono">
            {currentIndex + 1} / {announcements.length}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-3 text-right">
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
            {current.title}
          </h3>
          <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
            {current.subtitle}
          </p>
        </div>

        {/* Action Button & Next/Prev Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-[#F59E0B] flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
            <span>{current.actionLabel}</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </span>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {announcements.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-5 bg-[#F59E0B]' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
