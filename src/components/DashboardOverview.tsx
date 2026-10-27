import React from 'react';
import {
  Brain,
  Scale,
  Calendar,
  Video,
  FileText,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  FolderLock,
  MessageSquare,
  Users,
  Wallet,
  Phone,
} from 'lucide-react';
import { User, LegalCase, ConsultationSession, CaseDocument, Lawyer, PaymentTransaction } from '../types/legal';

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

  // Client view
  if (isClient) {
    return (
      <div className="space-y-6">
        {/* Welcome Greeting & Quick AI CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white">
              سلام {currentUser.name} عزیز، به کارتابل قضایی و حقوقی دادگستر خوش آمدید
            </h2>
            <p className="text-xs text-slate-300">
              کد ملی: <span className="font-mono text-amber-300">{currentUser.nationalId}</span> | شماره پرونده فعال در ثنا: <span className="font-mono text-cyan-400">۱۴۰۳۹۱۹۰۰۰۱۲۴۸۵۱</span>
            </p>
          </div>

          <button
            onClick={onOpenTriage}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Brain className="w-5 h-5 text-slate-950 animate-pulse" />
            <span>تریاژ رایگان پرونده جدید با AI</span>
          </button>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateTab('cases')}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-4 shadow-xl cursor-pointer transition-all space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>پرونده‌های فعال:</span>
              <Scale className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{cases.length}</div>
            <span className="text-[10px] text-amber-300">در شعب حقوقی و کیفری</span>
          </div>

          <div
            onClick={() => onNavigateTab('consultations')}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-4 shadow-xl cursor-pointer transition-all space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>مشاوره‌های رزرو شده:</span>
              <Video className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400">{consultations.length}</div>
            <span className="text-[10px] text-slate-400">تصویری و تلفنی امن</span>
          </div>

          <div
            onClick={() => onNavigateTab('documents')}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-4 shadow-xl cursor-pointer transition-all space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>اسناد در گاوصندوق:</span>
              <FolderLock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{documents.length}</div>
            <span className="text-[10px] text-slate-400">رمزنگاری شده AES-256</span>
          </div>

          <div
            onClick={() => onNavigateTab('sms')}
            className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-3xl p-4 shadow-xl cursor-pointer transition-all space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>ابلاغیه‌های ثنا:</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400">۲</div>
            <span className="text-[10px] text-rose-400 font-bold">۱ ابلاغیه جدید رویت نشده</span>
          </div>
        </div>

        {/* Next Court Date Alert Banner */}
        <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                  جلسه دادرسی نزدیک دادگاه
                </span>
                <span className="text-xs font-mono text-slate-400">پرونده: ۱۴۰۳۹۱۹۰۰۰۱۲۴۸۵۱</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                جلسه رسیدگی شعبه ۱۰۵ دادگاه عمومی حقوقی شهید بهشتی تهران
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>تاریخ: ۱۰ آذر ۱۴۰۳ - ساعت ۱۰:۳۰ صبح (همراه با دکتر مریم تهرانی)</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('calendar')}
            className="bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            مشاهده در تقویم دادگاه
          </button>
        </div>

        {/* Active Cases & Upcoming Consultations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Cases Section */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>پرونده‌های در حال رسیدگی شما در مراجع قضایی:</span>
              </h3>
              <button
                onClick={() => onNavigateTab('cases')}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                مشاهده همه
              </button>
            </div>

            <div className="space-y-3">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigateTab('cases')}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{c.title}</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      {c.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                    <span>شماره: <strong className="font-mono text-slate-300">{c.caseNumber}</strong></span>
                    <span>وکیل: <strong className="text-amber-300">{c.lawyerName}</strong></span>
                    <span>مرجع: <strong className="text-slate-300">{c.courtBranch.split(' ')[1]} {c.courtBranch.split(' ')[2]}</strong></span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>پیشرفت مراحل دادرسی:</span>
                      <span className="font-bold text-emerald-400">مرحله ۳ از ۵</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-3/5 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultations Booked Section */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>جلسات مشاوره رزرو شده:</span>
              </h3>
              <button
                onClick={() => onNavigateTab('lawyers')}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                + رزرو جدید
              </button>
            </div>

            <div className="space-y-3">
              {consultations.map((cons) => (
                <div
                  key={cons.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{cons.lawyerName}</h4>
                      <p className="text-[10px] text-slate-400">{cons.type} ({cons.durationMinutes} دقیقه)</p>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      {cons.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900 p-2 rounded-xl">
                    <span className="flex items-center gap-1 font-mono text-cyan-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {cons.scheduledDate} - {cons.scheduledTime}
                    </span>
                    <span className="font-bold text-amber-400">
                      {cons.fee.toLocaleString('fa-IR')} ت
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigateTab('consultations')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-purple-400" />
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

  // Lawyer View
  if (isLawyer) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              میز کار وکالت {currentUser.name} (وکیل پایه یک کانون وکلای مرکز)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              پروانه: <span className="font-mono text-amber-300 font-bold">۲۹۸۴۱/ک</span> | شماره شبا فعال: <span className="font-mono text-cyan-400">IR580120...8901</span>
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('financial')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>مشاهده داشبورد مالی و تسویه</span>
          </button>
        </div>

        {/* Lawyer KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-1">
            <span className="text-xs text-slate-400">کل درآمد واریزی:</span>
            <div className="text-xl font-black text-emerald-400">۱۸,۵۰۰,۰۰۰ <span className="text-xs font-normal">ت</span></div>
            <span className="text-[10px] text-slate-500">موجودی آماده تسویه</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-1">
            <span className="text-xs text-slate-400">موکلین فعال:</span>
            <div className="text-xl font-black text-white">{cases.length + 4} <span className="text-xs font-normal">نفر</span></div>
            <span className="text-[10px] text-amber-400">۲ پرونده در انتظار لایحه</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-1">
            <span className="text-xs text-slate-400">جلسات دادگاه این ماه:</span>
            <div className="text-xl font-black text-cyan-400">۳ <span className="text-xs font-normal">جلسه</span></div>
            <span className="text-[10px] text-slate-400">شعبه ۱۰۵ و شعبه ۳ دادیاری</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-1">
            <span className="text-xs text-slate-400">امتیاز کاربران:</span>
            <div className="text-xl font-black text-amber-400">۴.۹۵ <span className="text-xs font-normal">از ۵</span></div>
            <span className="text-[10px] text-emerald-400">۱۴۸ نظر تایید شده</span>
          </div>
        </div>

        {/* Consultations Pending for Lawyer */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{c.clientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({c.clientPhone})</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    حق‌المشاوره پرداخت شده
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  موضوع: {c.notes}
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-mono text-cyan-300">
                    {c.scheduledDate} ساعت {c.scheduledTime}
                  </span>
                  <button
                    onClick={() => onNavigateTab('consultations')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
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

  // Admin View
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            میز کار مدیریت ارشد سامانه دادگستر (SuperAdmin Control)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            نظارت بر صحت سنجی پروانه وکلا، امنیت تراکنش‌های شاپرک و لاگ تریاژهای قضایی هوش مصنوعی
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('admin-verifications')}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xl shadow-purple-600/20 transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>بررسی مدارک هویتی وکلا</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">تعداد کل وکلای پلتفرم:</span>
          <div className="text-2xl font-black text-white">{lawyers.length} نفر</div>
          <span className="text-[10px] text-amber-300">۱ وکیل در انتظار تایید</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">تراکنش‌های موفق شاپرک:</span>
          <div className="text-2xl font-black text-emerald-400">۸۵,۴۰۰,۰۰۰ <span className="text-xs font-normal">ت</span></div>
          <span className="text-[10px] text-slate-400">سوییچ به‌پرداخت و سامان</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">پرونده‌های فعال سیستم:</span>
          <div className="text-2xl font-black text-cyan-400">{cases.length + 12}</div>
          <span className="text-[10px] text-slate-400">متصل به عدل ایران</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">وضعیت موتور Gemini AI:</span>
          <div className="text-lg font-black text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            عملیاتی و آماده
          </div>
          <span className="text-[10px] text-slate-400">مدل: gemini-3.8-flash</span>
        </div>
      </div>
    </div>
  );
};
