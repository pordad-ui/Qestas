import React from 'react';
import { LegalCase, Lawyer } from '../types/legal';
import { X, Gavel, Calendar, MapPin, User, FileText, ShieldCheck, Share2, Download, Phone } from 'lucide-react';

interface MobileCaseDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  legalCase: LegalCase | null;
  lawyer?: Lawyer | null;
  onQuickCallLawyer?: (lawyerId: string) => void;
  onViewDocuments?: () => void;
}

export const MobileCaseDetailsSheet: React.FC<MobileCaseDetailsSheetProps> = ({
  isOpen,
  onClose,
  legalCase,
  lawyer,
  onQuickCallLawyer,
  onViewDocuments,
}) => {
  if (!isOpen || !legalCase) return null;

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
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">جزئیات پرونده قضایی</h2>
              <span className="text-[11px] text-slate-400">سامانه الکترونیک عدل‌ایران</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-right">
          {/* Status & Case ID Banner */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">وضعیت دادرسی:</span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                {legalCase.status}
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block mb-0.5">شماره پرونده:</span>
              <span className="text-xs font-mono font-bold text-slate-100 tabular-nums">
                {legalCase.caseNumber}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-100 leading-snug">
              {legalCase.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {legalCase.description}
            </p>
          </div>

          {/* Key Judicial Metadata */}
          <div className="space-y-3 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                مرجع رسیدگی‌کننده
              </span>
              <span className="text-slate-200 font-medium">{legalCase.courtBranch}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                موعد جلسه بعدی
              </span>
              <span className="text-amber-300 font-semibold">{legalCase.nextCourtDate || 'تعیین وقت نظارت'}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                کد رهگیری ثنا
              </span>
              <span className="text-slate-300 font-mono tabular-nums">{legalCase.sanaTrackingCode}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                ریاست محترم شعبه
              </span>
              <span className="text-slate-200">{legalCase.judgeName}</span>
            </div>
          </div>

          {/* Assigned Lawyer Card */}
          {lawyer && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={lawyer.avatar}
                  alt={lawyer.name}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-100">{lawyer.name}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      وکیل منتخب
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{lawyer.title}</span>
                </div>
              </div>

              {onQuickCallLawyer && (
                <button
                  onClick={() => onQuickCallLawyer(lawyer.id)}
                  className="p-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 transition-colors shadow-md shadow-[#F59E0B]/20 cursor-pointer"
                  title="تماس فوری با وکیل"
                >
                  <Phone className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                if (onViewDocuments) onViewDocuments();
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#F59E0B]" />
              <span>پیوست‌ها و اسناد (۴)</span>
            </button>
            <button
              onClick={() => alert('لینک پیگیری رمزدار برای سامانه ثنا کپی شد.')}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>اشتراک‌گذاری امن</span>
            </button>
          </div>
        </div>

        {/* Fixed Footer Close */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0B1120]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition-colors cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
