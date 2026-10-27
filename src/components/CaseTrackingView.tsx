import React, { useState } from 'react';
import {
  Scale,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Bell,
  Eye,
  Plus,
  ShieldCheck,
  Hash,
} from 'lucide-react';
import { LegalCase, CaseDocument } from '../types/legal';

interface CaseTrackingViewProps {
  cases: LegalCase[];
  documents: CaseDocument[];
  onUploadDocument: (caseId: string) => void;
  currentUserRole: string;
}

export const CaseTrackingView: React.FC<CaseTrackingViewProps> = ({
  cases,
  documents,
  onUploadDocument,
  currentUserRole,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [searchCode, setSearchCode] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'notifications' | 'documents'>('timeline');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const caseDocs = documents.filter((d) => d.caseId === selectedCase?.id);

  return (
    <div className="space-y-6">
      {/* Top Search & Judicial Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  سیستم پیگیری برخط پرونده‌های قضایی (متصل به سامانه عدل ایران / ثنا)
                </h2>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  ثبت مکانیزه
                </span>
              </div>
              <p className="text-xs text-slate-400">
                مشاهده لحظه‌ای گردش کار پرونده در شعب دادگاه، ابلاغیه‌های قانونی، نظریات کارشناسی و مواعد اعتراض
              </p>
            </div>
          </div>

          {/* Quick Case Switcher Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">انتخاب پرونده:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.caseNumber} - {c.title.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedCase ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Detail Summary Card) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Case Overview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">وضعیت فعلی دادرسی:</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-bold">
                  {selectedCase.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white leading-snug">{selectedCase.title}</h3>
                <span className="text-xs text-slate-400 mt-1 block">دسته‌بندی: {selectedCase.category}</span>
              </div>

              {/* Case Numbers */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-amber-400" />
                    شماره پرونده ۱۶ رقمی:
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{selectedCase.caseNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    شناسه رهگیری ثنا:
                  </span>
                  <span className="font-mono text-slate-300">{selectedCase.sanaTrackingCode}</span>
                </div>
              </div>

              {/* Branch & Court info */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">مرجع قضایی رسیدگی‌کننده:</span>
                    <span className="font-medium text-slate-200">{selectedCase.courtBranch}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">مقام رسیدگی‌کننده:</span>
                    <span className="font-medium text-slate-200">{selectedCase.judgeName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">وقت بعدی رسیدگی / نظارت:</span>
                    <span className="font-bold text-amber-300">{selectedCase.nextCourtDate || 'تعیین نشده'}</span>
                  </div>
                </div>

                {selectedCase.appealDeadline && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>مهلت قانونی اعتراض: {selectedCase.appealDeadline}</span>
                  </div>
                )}
              </div>

              {/* Client & Lawyer */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">موکل (خواهان / شاکی):</span>
                  <span className="font-bold text-slate-200">{selectedCase.clientName}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">وکیل تعیینی:</span>
                  <span className="font-bold text-amber-300">{selectedCase.lawyerName}</span>
                </div>
              </div>

              {/* Case Description */}
              <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-300 font-bold block mb-1">موضوع و شرح دادخواست:</span>
                {selectedCase.description}
              </div>
            </div>
          </div>

          {/* Right Column (Tabs: Timeline, Sana Notifications, Documents) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tab navigation */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                مراحل و گردش کار قضایی ({selectedCase.milestones.length})
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'notifications'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>ابلاغیه‌های الکترونیکی ثنا</span>
                <span className="bg-slate-950/30 px-1.5 py-0.2 rounded-full text-[10px]">
                  {selectedCase.notifications.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                  activeTab === 'documents'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                اسناد و مدارک پرونده ({caseDocs.length})
              </button>
            </div>

            {/* Tab 1: Timeline Milestones */}
            {activeTab === 'timeline' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  گاه‌شمار قانونی و مراحل طی‌شده دادرسی:
                </h3>

                <div className="relative pr-6 border-r-2 border-slate-800 space-y-8">
                  {selectedCase.milestones.map((m, idx) => (
                    <div key={m.id} className="relative">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -right-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          m.completed
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : m.current
                            ? 'bg-amber-500 border-amber-300 text-slate-950 ring-4 ring-amber-500/20 animate-pulse'
                            : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        )}
                      </div>

                      {/* Content Box */}
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          m.current
                            ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5'
                            : m.completed
                            ? 'bg-slate-950/70 border-slate-800/80'
                            : 'bg-slate-950/30 border-slate-800/50 opacity-70'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                            <span>{m.title}</span>
                            {m.current && (
                              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                                مرحله کنونی
                              </span>
                            )}
                          </h4>
                          <span className="text-xs font-mono text-slate-400">{m.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mt-1">{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Sana Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ابلاغیه‌های واصله از درگاه خدمات الکترونیک قضایی (عدل ایران):
                  </h3>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    همگام با سامانه ثنا
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedCase.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-slate-100">{notif.title}</span>
                          {!notif.isRead && (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                              جدید / رویت‌نشده
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-slate-400">{notif.date}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{notif.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Documents */}
            {activeTab === 'documents' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    اسناد و مدارک ثبت شده در پرونده:
                  </h3>
                  <button
                    onClick={() => onUploadDocument(selectedCase.id)}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>بارگذاری مدرک جدید</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caseDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                            {doc.category}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">{doc.status}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-100 mt-2 line-clamp-1">{doc.title}</h4>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                          <span>حجم: {doc.fileSize}</span>
                          <span>تاریخ: {doc.uploadDate}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">
                          SHA256: {doc.sha256Hash.slice(0, 8)}...
                        </span>
                        <button
                          onClick={() => alert(`دانلود پیش‌نمایش مدرک: ${doc.title}`)}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[11px] cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>مشاهده سند</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {caseDocs.length === 0 && (
                    <p className="text-xs text-slate-500 text-center col-span-2 py-6">
                      هنوز سندی برای این پرونده بارگذاری نشده است.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
