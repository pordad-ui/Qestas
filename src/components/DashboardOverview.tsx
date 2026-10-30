import React from 'react';
import {
  Brain,
  Scale,
  Calendar,
  Video,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FolderLock,
  Users,
  Wallet,
  PhoneCall,
  UserCheck,
  ArrowLeft,
  ChevronLeft,
  BellRing,
} from 'lucide-react';
import { User, LegalCase, ConsultationSession, CaseDocument, Lawyer, PaymentTransaction } from '../types/legal';
import { LegalScalesLogo } from './LegalScalesLogo';

interface DashboardOverviewProps {
  currentUser: User;
  cases: LegalCase[];
  consultations: ConsultationSession[];
  documents: CaseDocument[];
  lawyers: Lawyer[];
  transactions: PaymentTransaction[];
  onOpenTriage: () => void;
  onNavigateTab: (tab: string) => void;
  onJoinMeeting: (roomId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  cases,
  consultations,
  documents,
  lawyers,
  transactions,
  onOpenTriage,
  onNavigateTab,
  onJoinMeeting,
}) => {
  const isClient = currentUser.role === 'client';
  const isLawyer = currentUser.role === 'lawyer';
  const isAdmin = currentUser.role === 'admin';

  // ---------------------------------------------------------------------------
  // CLIENT WORKSPACE (Decluttered, Clio / Lawfully / Harvey AI benchmarked)
  // ---------------------------------------------------------------------------
  if (isClient) {
    return (
      <div className="space-y-6">
        {/* Welcome & Persona Summary Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-amber-500/30 flex items-center justify-center shrink-0">
              <LegalScalesLogo size="sm" variant="gold" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white">
                سلام {currentUser.name} گرامی، به کارتابل قضایی دادگستر خوش آمدید
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>کد ملی: <strong className="font-mono text-slate-200">{currentUser.nationalId}</strong></span>
                <span className="text-slate-600">·</span>
                <span>شماره پرونده در ثنا: <strong className="font-mono text-amber-300">۱۴۰۳۹۱۹۰۰۰۱۲۴۸۵۱</strong></span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-medium">احراز هویت شده</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={onOpenTriage}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Brain className="w-4 h-4 text-slate-950" />
              <span>تریاژ هوشمند پرونده جدید</span>
            </button>
            <button
              onClick={() => onNavigateTab('lawyers')}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>بانک وکلا</span>
            </button>
          </div>
        </div>

        {/* 4 Quiet Metric Tiles (Tabular numerals, uncluttered, anti-slop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div
            onClick={() => onNavigateTab('cases')}
            className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">پرونده‌های فعال</span>
              <Scale className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white font-mono tabular-nums">{cases.length}</div>
            <div className="text-[11px] text-slate-400">در شعب حقوقی و کیفری</div>
          </div>

          <div
            onClick={() => onNavigateTab('consultations')}
            className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">مشاوره‌های رزرو شده</span>
              <Video className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-cyan-400 font-mono tabular-nums">{consultations.length}</div>
            <div className="text-[11px] text-slate-400">تصویری و تلفنی امن</div>
          </div>

          <div
            onClick={() => onNavigateTab('documents')}
            className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">اسناد در گاوصندوق</span>
              <FolderLock className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">{documents.length}</div>
            <div className="text-[11px] text-slate-400">رمزنگاری شده AES-256</div>
          </div>

          <div
            onClick={() => onNavigateTab('sms')}
            className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">ابلاغیه‌های ثنا</span>
              <BellRing className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-purple-400 font-mono tabular-nums">۲</div>
            <div className="text-[11px] text-rose-400 font-medium">۱ ابلاغیه جدید رویت نشده</div>
          </div>
        </div>

        {/* Priority Court Date Alert (Clean, minimal, high-contrast) */}
        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300 font-bold">جلسه دادرسی نزدیک در دادگاه</span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-xs font-mono text-slate-400">پرونده: ۱۴۰۳۹۱۹۰۰۰۱۲۴۸۵۱</span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-0.5">
                رسیدگی شعبه ۱۰۵ دادگاه عمومی حقوقی شهید بهشتی تهران
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>۱۰ آذر ۱۴۰۳، ساعت ۱۰:۳۰ صبح (با همراهی دکتر مریم تهرانی)</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('calendar')}
            className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
          >
            مشاهده در تقویم دادگاه
          </button>
        </div>

        {/* 2-Column Clean Workspace: Active Cases & Scheduled Consultations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Cases Column */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>پرونده‌های فعال شما در مراجع قضایی</span>
              </h3>
              <button
                onClick={() => onNavigateTab('cases')}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>مشاهده پرونده‌ها</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigateTab('cases')}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 space-y-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{c.title}</span>
                    <span className="text-[10px] text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                      {c.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
                    <span>شماره: <strong className="font-mono text-slate-200">{c.caseNumber}</strong></span>
                    <span>وکیل: <strong className="text-amber-300">{c.lawyerName}</strong></span>
                    <span>مرجع: <strong className="text-slate-300">{c.courtBranch}</strong></span>
                  </div>

                  {/* Clean progress indicator */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>مراحل دادرسی:</span>
                      <span className="font-semibold text-emerald-400">مرحله ۳ از ۵ (در حال تبادل لوایح)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-3/5 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Consultations Column */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>جلسات مشاوره رزرو شده</span>
              </h3>
              <button
                onClick={() => onNavigateTab('lawyers')}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>+ رزرو وقت جدید</span>
              </button>
            </div>

            <div className="space-y-3">
              {consultations.map((cons) => (
                <div
                  key={cons.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{cons.lawyerName}</h4>
                      <p className="text-[11px] text-slate-400">{cons.type} ({cons.durationMinutes} دقیقه)</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {cons.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 px-3 py-2 rounded-xl">
                    <span className="flex items-center gap-1 font-mono text-cyan-300 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {cons.scheduledDate} - ساعت {cons.scheduledTime}
                    </span>
                    <span className="font-bold text-amber-400 font-mono tabular-nums text-xs">
                      {cons.fee.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigateTab('consultations')}
                    className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>ورود به اتاق جلسه و چت امن</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // LAWYER WORKSPACE
  // ---------------------------------------------------------------------------
  if (isLawyer) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-white">
              میز کار وکالت {currentUser.name} (وکیل پایه یک کانون وکلای مرکز)
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>پروانه: <strong className="font-mono text-amber-300">۲۹۸۴۱/ک</strong></span>
              <span className="text-slate-600">·</span>
              <span>شماره شبا: <strong className="font-mono text-cyan-400">IR580120...8901</strong></span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400">احراز هویت شده</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('financial')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>مشاهده داشبورد مالی و تسویه</span>
          </button>
        </div>

        {/* Lawyer KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-xs text-slate-400 font-medium">کل درآمد واریزی</span>
            <div className="text-xl font-black text-emerald-400 font-mono tabular-nums">۱۸,۵۰۰,۰۰۰ تومان</div>
            <span className="text-[11px] text-slate-500">موجودی آماده تسویه</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-xs text-slate-400 font-medium">موکلین فعال</span>
            <div className="text-xl font-black text-white font-mono tabular-nums">{cases.length + 4} نفر</div>
            <span className="text-[11px] text-amber-400">۲ پرونده در انتظار لایحه</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-xs text-slate-400 font-medium">جلسات دادگاه این ماه</span>
            <div className="text-xl font-black text-cyan-400 font-mono tabular-nums">۳ جلسه</div>
            <span className="text-[11px] text-slate-400">شعبه ۱۰۵ و شعبه ۳ دادیاری</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-xs text-slate-400 font-medium">امتیاز کاربران</span>
            <div className="text-xl font-black text-amber-400 font-mono tabular-nums">۴.۹۵ از ۵</div>
            <span className="text-[11px] text-emerald-400">۱۴۸ نظر تایید شده</span>
          </div>
        </div>

        {/* Consultations Pending for Lawyer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-300">
              نوبت‌های مشاوره مراجعین منتظر حضور شما:
            </h3>
            <button
              onClick={() => onNavigateTab('consultations')}
              className="text-xs text-amber-400 hover:underline cursor-pointer"
            >
              اتاق مشاوره تصویری و چت
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultations.map((c) => (
              <div
                key={c.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{c.clientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({c.clientPhone})</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    حق‌المشاوره پرداخت شده
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  موضوع: {c.notes}
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-mono text-cyan-300 text-[11px]">
                    {c.scheduledDate} ساعت {c.scheduledTime}
                  </span>
                  <button
                    onClick={() => onNavigateTab('consultations')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>ورود به اتاق جلسه</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ADMIN WORKSPACE
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-black text-white">
            میز کار مدیریت ارشد سامانه دادگستر (SuperAdmin Control)
          </h2>
          <p className="text-xs text-slate-400">
            نظارت بر احراز صلاحیت پروانه وکلا، امنیت تراکنش‌های شاپرک و لاگ تریاژهای قضایی هوش مصنوعی
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('master-admin')}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>کنسول مدیریت جامع دادگستر</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">کل وکلای سامانه</span>
          <div className="text-2xl font-black text-white font-mono tabular-nums">{lawyers.length} نفر</div>
          <span className="text-[11px] text-amber-300">۱ وکیل در انتظار تایید</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">تراکنش‌های موفق شاپرک</span>
          <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">۸۵,۴۰۰,۰۰۰ تومان</div>
          <span className="text-[11px] text-slate-500">سوییچ به‌پرداخت و سامان</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">پرونده‌های فعال سیستم</span>
          <div className="text-2xl font-black text-cyan-400 font-mono tabular-nums">{cases.length + 12}</div>
          <span className="text-[11px] text-slate-500">متصل به عدل ایران</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">وضعیت موتور Gemini AI</span>
          <div className="text-base font-black text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            عملیاتی و آماده
          </div>
          <span className="text-[11px] text-slate-500">مدل: gemini-3.8-flash</span>
        </div>
      </div>
    </div>
  );
};
