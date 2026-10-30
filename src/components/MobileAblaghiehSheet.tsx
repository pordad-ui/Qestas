import React, { useState } from 'react';
import { X, Bell, ShieldCheck, CheckCircle2, AlertTriangle, Download, ExternalLink, Calendar } from 'lucide-react';

interface NoticeItem {
  id: string;
  title: string;
  branch: string;
  date: string;
  caseNumber: string;
  deadlineText: string;
  content: string;
  isRead: boolean;
  type: 'urgent' | 'info';
}

interface MobileAblaghiehSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAblaghiehSheet: React.FC<MobileAblaghiehSheetProps> = ({ isOpen, onClose }) => {
  const [notices, setNotices] = useState<NoticeItem[]>([
    {
      id: 'ab-1',
      title: 'ابلاغیه وقت رسیدگی و استماع شهادت شهود',
      branch: 'شعبه ۱۰۵ دادگاه عمومی حقوقی تهران',
      date: '۱۴۰۳/۰۸/۰۵ - ۱۱:۳۰',
      caseNumber: '۱۴۰۳۹۱۹۰۰۰۱۲۴۸۵۱',
      deadlineText: 'مهلت حضور: دوشنبه ۱۴ آبان ساعت ۱۰:۳۰',
      content: 'در خصوص دعوای الزام به تنظیم سند، وقت نظارت و استماع توضیحات طرفین پیرامون نظریه کارشناسی تعیین گردیده است. عدم حضور مانع از رسیدگی نخواهد بود.',
      isRead: false,
      type: 'urgent',
    },
    {
      id: 'ab-2',
      title: 'اخطاریه واریز دستمزد کارشناس رسمی دادگستری',
      branch: 'شعبه ۱۰۵ دادگاه عمومی حقوقی تهران',
      date: '۱۴۰۳/۰۸/۰۲ - ۰۹:۱۵',
      caseNumber: '۱۴۰۳۹۱۹۰۰۰۱۲۴۸۵۱',
      deadlineText: 'مهلت اقدام: ۷ روز پس از تاریخ رویت',
      content: 'مقرر است خواهان ظرف یک هفته پس از رویت این ابلاغیه، مبلغ علی‌الحساب کارشناسی را به شماره حساب سپرده دادگستری تودیع و فیش آن را به دفتر شعبه تسلیم نماید.',
      isRead: false,
      type: 'urgent',
    },
    {
      id: 'ab-3',
      title: 'گواهی صدور قرار تامین خواسته و توقیف پلاک ثبتی',
      branch: 'اداره ثبت اسناد و املاک منطقه ۱۰ تهران',
      date: '۱۴۰۳/۰۵/۲۲ - ۱۴:۱۰',
      caseNumber: '۱۴۰۳۹۱۹۰۰۰۱۲۴۸۵۱',
      deadlineText: 'قطعی و اجرا شده',
      content: 'به موجب دستور قضایی، نقل و انتقال پلاک ثبتی ۱۲۴۸/۶۷ تا تعیین تکلیف نهایی دعوا در دفتر املاک بازداشت گردید.',
      isRead: true,
      type: 'info',
    },
  ]);

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notices.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[440px] max-h-[85vh] bg-[#0B1120] border-t border-slate-800 rounded-t-[32px] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-full pt-3 pb-2 flex justify-center">
          <div className="w-12 h-1 bg-slate-700/80 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F59E0B]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100">کارتابل ابلاغیه‌های قضایی</h2>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-[#F59E0B] text-slate-950 font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} جدید
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">اتصال مستقیم به سامانه ثنا قوه قضاییه</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notices Feed */}
        <div className="p-5 overflow-y-auto space-y-4 text-right">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-4 rounded-2xl border transition-all ${
                notice.isRead
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  : 'bg-gradient-to-br from-slate-900/90 to-slate-850/90 border-[#F59E0B]/30 shadow-lg shadow-[#F59E0B]/5'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {!notice.isRead ? (
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <h3 className="text-xs font-bold text-slate-100 leading-snug">
                    {notice.title}
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono tabular-nums">
                  {notice.date.split(' - ')[0]}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 mb-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span>مرجع: {notice.branch}</span>
                  <span className="font-mono text-slate-400">پرونده: {notice.caseNumber.slice(-6)}</span>
                </div>
                <div className="text-amber-400/90 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#F59E0B]" />
                  <span>{notice.deadlineText}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40 mb-3">
                {notice.content}
              </p>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleMarkAsRead(notice.id)}
                  disabled={notice.isRead}
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    notice.isRead
                      ? 'text-emerald-400 bg-emerald-500/10 cursor-default'
                      : 'text-slate-950 bg-[#F59E0B] hover:bg-[#d97706] font-bold cursor-pointer'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{notice.isRead ? 'تایید رویت شد' : 'ثبت رویت رسمی'}</span>
                </button>

                <button
                  onClick={() => alert('نسخه چاپی دادنامه با مهر امنیتی رمزدار ثنا دانلود شد.')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>دانلود برگ ابلاغیه</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0B1120]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition-colors cursor-pointer"
          >
            بستن کارتابل
          </button>
        </div>
      </div>
    </div>
  );
};
