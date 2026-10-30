import React from 'react';
import {
  Gavel,
  Users,
  Briefcase,
  BookOpen,
  MessageSquare,
  FileEdit,
  Sparkles,
  Scale,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

export interface AppFeatureItem {
  id: string;
  title: string;
  slug: string;
  iconName: string;
  description: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  iconBg: string;
  is_hidden: boolean;
  order: number;
}

export const DEFAULT_APP_FEATURES: AppFeatureItem[] = [
  {
    id: 'feat-1',
    title: 'پیگیری پرونده',
    slug: 'case-tracking',
    iconName: 'Gavel',
    description: 'استعلام شعب دادگاه و ثنا',
    bgGradient: 'from-teal-950/30 to-slate-900/60',
    borderColor: 'border-teal-500/25 hover:border-teal-400/50',
    textColor: 'text-teal-400',
    iconBg: 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
    is_hidden: false,
    order: 1,
  },
  {
    id: 'feat-2',
    title: 'بانک وکلا',
    slug: 'lawyer-bank',
    iconName: 'Users',
    description: 'وکلای پایه یک و کانون',
    bgGradient: 'from-amber-950/30 to-slate-900/60',
    borderColor: 'border-[#F59E0B]/25 hover:border-[#F59E0B]/50',
    textColor: 'text-[#F59E0B]',
    iconBg: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
    is_hidden: false,
    order: 2,
  },
  {
    id: 'feat-3',
    title: 'خدمات حقوقی',
    slug: 'legal-services',
    iconName: 'Briefcase',
    description: 'وکالت دعاوی ملکی و کیفری',
    bgGradient: 'from-indigo-950/30 to-slate-900/60',
    borderColor: 'border-indigo-500/25 hover:border-indigo-400/50',
    textColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    is_hidden: false,
    order: 3,
  },
  {
    id: 'feat-4',
    title: 'بانک قوانین',
    slug: 'law-database',
    iconName: 'BookOpen',
    description: 'قانون مدنی، مجازات و آیین دادرسی',
    bgGradient: 'from-emerald-950/30 to-slate-900/60',
    borderColor: 'border-emerald-500/25 hover:border-emerald-400/50',
    textColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    is_hidden: false,
    order: 4,
  },
  {
    id: 'feat-5',
    title: 'مشاوره آنلاین',
    slug: 'online-consultation',
    iconName: 'MessageSquare',
    description: 'چت و تماس تصویری امن',
    bgGradient: 'from-cyan-950/30 to-slate-900/60',
    borderColor: 'border-cyan-500/25 hover:border-cyan-400/50',
    textColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    is_hidden: false,
    order: 5,
  },
  {
    id: 'feat-6',
    title: 'تنظیم دادخواست',
    slug: 'drafting',
    iconName: 'FileEdit',
    description: 'شکواییه، لایحه و اظهارنامه',
    bgGradient: 'from-amber-900/20 to-slate-900/60',
    borderColor: 'border-amber-600/25 hover:border-amber-500/50',
    textColor: 'text-amber-300',
    iconBg: 'bg-amber-600/15 text-amber-300 border border-amber-600/30',
    is_hidden: false,
    order: 6,
  },
];

interface MobileServicesGridProps {
  features?: AppFeatureItem[];
  onSelectService: (slug: string) => void;
}

export const MobileServicesGrid: React.FC<MobileServicesGridProps> = ({
  features = DEFAULT_APP_FEATURES,
  onSelectService,
}) => {
  // Filter out soft-deleted / hidden features (PART 2 CMS Requirement)
  const activeFeatures = features
    .filter((f) => !f.is_hidden)
    .sort((a, b) => a.order - b.order);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Gavel':
        return <Gavel className="w-6 h-6 stroke-[1.75]" />;
      case 'Users':
        return <Users className="w-6 h-6 stroke-[1.75]" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 stroke-[1.75]" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 stroke-[1.75]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 stroke-[1.75]" />;
      case 'FileEdit':
      default:
        return <FileEdit className="w-6 h-6 stroke-[1.75]" />;
    }
  };

  return (
    <div className="space-y-3 text-right">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#F59E0B] rounded-full" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-100">خدمات و بخش‌های سامانه</h2>
        </div>
        <span className="text-[10px] text-slate-500">طرح شبکه‌ای ۳ ستونه</span>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {activeFeatures.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectService(item.slug)}
            className={`p-3 rounded-2xl bg-gradient-to-b ${item.bgGradient} border ${item.borderColor} flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-black/20 group relative overflow-hidden`}
          >
            {/* Rounded square icon container with soft colored background */}
            <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mb-2 shadow-sm transition-transform duration-200 group-hover:scale-110`}>
              {renderIcon(item.iconName)}
            </div>

            {/* Service Title */}
            <span className="text-[11px] sm:text-xs font-bold text-slate-200 group-hover:text-white transition-colors leading-tight line-clamp-1">
              {item.title}
            </span>

            {/* Sub-label */}
            <span className="text-[9px] text-slate-400 mt-0.5 line-clamp-1 font-normal">
              {item.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
