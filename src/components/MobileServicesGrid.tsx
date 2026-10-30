import React from 'react';
import { DynamicIcon } from './DynamicIcon';
import { DynamicMenuItem } from '../types/cms';

export interface AppFeatureItem {
  id: string;
  title: string;
  slug: string;
  iconName: string;
  description: string;
  bgGradient?: string;
  borderColor?: string;
  textColor?: string;
  iconBg?: string;
  is_hidden?: boolean;
  order: number;
}

interface MobileServicesGridProps {
  items?: DynamicMenuItem[];
  onSelectService: (targetUrlOrSlug: string) => void;
}

export const MobileServicesGrid: React.FC<MobileServicesGridProps> = ({
  items = [],
  onSelectService,
}) => {
  // Filter active and sort
  const activeItems = items
    .filter((f) => f.is_active)
    .sort((a, b) => a.order - b.order);

  // Gradient helper based on color theme
  const getCardTheme = (colorTheme?: string) => {
    switch (colorTheme) {
      case 'teal':
        return {
          bg: 'from-teal-950/30 to-slate-900/60',
          border: 'border-teal-500/25 hover:border-teal-400/50',
          text: 'text-teal-400',
        };
      case 'amber':
        return {
          bg: 'from-amber-950/30 to-slate-900/60',
          border: 'border-[#F59E0B]/25 hover:border-[#F59E0B]/50',
          text: 'text-[#F59E0B]',
        };
      case 'indigo':
        return {
          bg: 'from-indigo-950/30 to-slate-900/60',
          border: 'border-indigo-500/25 hover:border-indigo-400/50',
          text: 'text-indigo-400',
        };
      case 'emerald':
        return {
          bg: 'from-emerald-950/30 to-slate-900/60',
          border: 'border-emerald-500/25 hover:border-emerald-400/50',
          text: 'text-emerald-400',
        };
      case 'cyan':
        return {
          bg: 'from-cyan-950/30 to-slate-900/60',
          border: 'border-cyan-500/25 hover:border-cyan-400/50',
          text: 'text-cyan-400',
        };
      case 'rose':
        return {
          bg: 'from-rose-950/30 to-slate-900/60',
          border: 'border-rose-500/25 hover:border-rose-400/50',
          text: 'text-rose-400',
        };
      default:
        return {
          bg: 'from-slate-900/40 to-slate-900/70',
          border: 'border-slate-800 hover:border-amber-500/40',
          text: 'text-slate-200',
        };
    }
  };

  if (activeItems.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
        هیچ خدمت فعالی برای نمایش در صفحه اصلی ثبت نشده است. (از پنل CMS فعال کنید)
      </div>
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#F59E0B] rounded-full" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-100">خدمات و سامانه‌های حقوقی</h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {activeItems.length} خدمت فعال
        </span>
      </div>

      {/* 3-Column Native Mobile Grid Layout */}
      <div className="grid grid-cols-3 gap-2.5">
        {activeItems.map((item) => {
          const theme = getCardTheme(item.color_theme);

          return (
            <button
              key={item.id}
              onClick={() => onSelectService(item.target_url || item.slug)}
              className={`p-3 rounded-2xl bg-gradient-to-b ${theme.bg} border ${theme.border} flex flex-col items-center text-center justify-between transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-lg group relative overflow-hidden min-h-[118px]`}
            >
              {/* Subtle accent glow */}
              <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-white/5 blur-sm pointer-events-none" />

              {/* Dynamic Icon */}
              <div className="my-1 transition-transform group-hover:scale-110">
                <DynamicIcon
                  name={item.icon_name}
                  style={item.icon_style}
                  colorTheme={item.color_theme}
                  className="w-5 h-5"
                />
              </div>

              {/* Title & Description */}
              <div className="w-full mt-1.5 space-y-0.5">
                <h4 className={`text-[11px] font-bold ${theme.text} leading-tight truncate`}>
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-[9px] text-slate-400 leading-tight line-clamp-1 opacity-80">
                    {item.description}
                  </p>
                )}
              </div>

              {item.badge_text && (
                <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded-full text-[8px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {item.badge_text}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
