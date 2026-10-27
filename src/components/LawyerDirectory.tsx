import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  Award,
  ShieldCheck,
  Phone,
  MessageSquare,
  Video,
  FileCheck2,
  MapPin,
  Briefcase,
  ChevronLeft,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { Lawyer } from '../types/legal';

interface LawyerDirectoryProps {
  lawyers: Lawyer[];
  onSelectLawyerForProfile: (lawyer: Lawyer) => void;
  onSelectLawyerForBooking: (lawyerId: string) => void;
  onStartChatWithLawyer: (lawyerId: string) => void;
  onQuickCall?: (lawyerId: string) => void;
  initialQuery?: string;
}

export const LawyerDirectory: React.FC<LawyerDirectoryProps> = ({
  lawyers,
  onSelectLawyerForProfile,
  onSelectLawyerForBooking,
  onStartChatWithLawyer,
  onQuickCall,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('همه');
  const [selectedCity, setSelectedCity] = useState<string>('همه');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'winRate' | 'fee'>('rating');
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);

  const specialtiesList = [
    'همه',
    'ملکی و سرقفلی',
    'کیفری و جرایم اقتصادی',
    'خانواده و طلاق توافقی',
    'قراردادهای تجاری',
    'شرکت‌ها و استارتاپ‌ها',
    'چک و اسناد تجاری',
  ];

  const citiesList = ['همه', 'تهران', 'اصفهان', 'مشهد', 'شیراز', 'تبریز'];

  const onlineLawyersCount = useMemo(() => {
    return lawyers.filter((l) => l.isOnline).length;
  }, [lawyers]);

  const filteredLawyers = useMemo(() => {
    return lawyers
      .filter((lawyer) => {
        const matchesQuery =
          !searchQuery.trim() ||
          lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lawyer.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          lawyer.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lawyer.city.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSpecialty =
          selectedSpecialty === 'همه' ||
          lawyer.specialties.some((s) => s.includes(selectedSpecialty) || selectedSpecialty.includes(s));

        const matchesCity = selectedCity === 'همه' || lawyer.city === selectedCity;

        const matchesOnline = !onlyOnline || lawyer.isOnline;

        return matchesQuery && matchesSpecialty && matchesCity && matchesOnline;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        if (sortBy === 'winRate') return b.winRate - a.winRate;
        if (sortBy === 'fee') return a.pricing.phone15min - b.pricing.phone15min;
        return 0;
      });
  }, [lawyers, searchQuery, selectedSpecialty, selectedCity, sortBy, onlyOnline]);

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام وکیل، تخصص، موضوع پرونده یا شهر..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-2xl py-3 pr-11 pl-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* City selector & Sort Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Only Online Toggle Button */}
            <button
              type="button"
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                onlyOnline
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>فقط وکلای آنلاین ({onlineLawyersCount})</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded-2xl text-xs">
              <MapPin className="w-4 h-4 text-amber-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                {citiesList.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-100">
                    شهر: {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded-2xl text-xs">
              <Filter className="w-4 h-4 text-cyan-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="rating" className="bg-slate-900 text-slate-100">مرتب‌سازی: بالاترین امتیاز کاربران</option>
                <option value="winRate" className="bg-slate-900 text-slate-100">مرتب‌سازی: بیشترین درصد پیروزی</option>
                <option value="experience" className="bg-slate-900 text-slate-100">مرتب‌سازی: بیشترین سال سابقه</option>
                <option value="fee" className="bg-slate-900 text-slate-100">مرتب‌سازی: کمترین هزینه مشاوره</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specialty filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 whitespace-nowrap pl-2">دسته‌بندی تخصص:</span>
          {specialtiesList.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Lawyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLawyers.map((lawyer) => (
          <div
            key={lawyer.id}
            className="lawyer-card bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between group"
          >
            <div>
              {/* Top Profile Header */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={lawyer.avatar}
                    alt={lawyer.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-amber-500/80 transition-colors shadow-md"
                  />
                  {lawyer.isVerified && (
                    <div className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow" title="پروانه وکالت تایید شده">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Online / Offline Status Dot Badge on Avatar */}
                  <div
                    className="absolute -top-1.5 -right-1.5 flex items-center justify-center"
                    title={lawyer.isOnline ? 'وکیل هم‌اکنون آنلاین و آماده مشاوره فوری است' : 'وکیل هم‌اکنون آفلاین است'}
                  >
                    {lawyer.isOnline ? (
                      <span className="relative flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900 shadow-md" />
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full h-3.5 w-3.5 bg-slate-500 border-2 border-slate-900 shadow-sm" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      onClick={() => onSelectLawyerForProfile(lawyer)}
                      className="text-sm font-bold text-slate-100 hover:text-amber-300 cursor-pointer transition-colors"
                    >
                      {lawyer.name}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{lawyer.title}</p>

                  {/* Star Rating Bar & Verified Reviews Count */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 bg-slate-950/70 border border-slate-800/80 px-2.5 py-1 rounded-xl">
                    <div className="flex items-center gap-0.5 text-amber-400" title={`امتیاز ${lawyer.rating.toFixed(1)} از ۵`}>
                      {[1, 2, 3, 4, 5].map((starIndex) => {
                        const isFull = starIndex <= Math.floor(lawyer.rating);
                        const isHalf = !isFull && starIndex <= Math.ceil(lawyer.rating) && lawyer.rating % 1 >= 0.3;
                        return (
                          <Star
                            key={starIndex}
                            className={`w-3.5 h-3.5 ${
                              isFull
                                ? 'fill-amber-400 text-amber-400'
                                : isHalf
                                ? 'fill-amber-400/50 text-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      {lawyer.rating.toFixed(1)} <span className="text-[10px] font-normal text-slate-400 font-sans">از ۵</span>
                    </span>
                    <span className="text-slate-700">•</span>
                    <span
                      onClick={() => onSelectLawyerForProfile(lawyer)}
                      className="text-[11px] text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      {lawyer.reviewCount > 0 ? `(${lawyer.reviewCount.toLocaleString('fa-IR')} نظر ثبت شده)` : '(بدون نظر)'}
                    </span>
                  </div>

                  {/* Online status chip */}
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {lawyer.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span>آنلاین • آماده مشاوره فوری</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-full">
                        <span className="inline-flex rounded-full h-2 w-2 bg-slate-500" />
                        <span>آفلاین • رزرو نوبت</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-cyan-400" />
                      {lawyer.experienceYears} سال سابقه
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      {lawyer.winRate}٪ پیروزی
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {lawyer.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* License and Bar badge */}
              <div className="mt-3 bg-slate-950/70 border border-slate-800/80 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>{lawyer.barAssociation}</span>
                <span className="font-mono text-amber-300 font-semibold">{lawyer.licenseNumber}</span>
              </div>

              {/* Specialties tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {lawyer.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                {lawyer.bio}
              </p>

              {/* Pricing breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">مشاوره تلفنی (۱۵ د):</span>
                  <span className="font-bold text-slate-200">
                    {lawyer.pricing.phone15min.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">مشاوره تصویری (۴۵ د):</span>
                  <span className="font-bold text-slate-200">
                    {lawyer.pricing.videoConsultation.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Call Button (Only for Online Lawyers - Direct Connect) */}
            {lawyer.isOnline && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => (onQuickCall ? onQuickCall(lawyer.id) : onStartChatWithLawyer(lawyer.id))}
                  className="quick-call-btn w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-2.5 px-3 rounded-2xl text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] border border-emerald-400/50"
                  title="اتصال مستقیم و آنی به اتاق مشاوره تصویری و صوتی با وکیل"
                >
                  <Phone className="w-4 h-4 text-slate-950 animate-bounce" />
                  <span>تماس فوری (اتصال مستقیم به اتاق مشاوره)</span>
                  <span className="relative flex h-2 w-2 mr-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950" />
                  </span>
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={() => onSelectLawyerForProfile(lawyer)}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                پروفایل و نظرات
              </button>

              <button
                onClick={() => onSelectLawyerForBooking(lawyer.id)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>رزرو نوبت</span>
              </button>

              <button
                onClick={() => onStartChatWithLawyer(lawyer.id)}
                className="p-2 bg-slate-800 hover:bg-slate-750 text-cyan-400 rounded-xl transition-colors cursor-pointer"
                title="چت متنی و ارسال مدارک"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">هیچ وکیلی با این مشخصات یافت نشد.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            لطفاً عبارت جستجو یا فیلترهای انتخابی تخصص و شهر را تغییر دهید.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('همه');
              setSelectedCity('همه');
            }}
            className="text-xs text-amber-400 hover:underline cursor-pointer pt-2 font-bold"
          >
            پاک کردن تمامی فیلترها
          </button>
        </div>
      )}
    </div>
  );
};
