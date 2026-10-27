import React, { useState } from 'react';
import {
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
  Building,
  Eye,
  Award,
  AlertTriangle,
  Server,
  Lock,
} from 'lucide-react';
import { Lawyer } from '../types/legal';

interface AdminVerificationPanelProps {
  lawyers: Lawyer[];
  onApproveLawyer: (lawyerId: string) => void;
  onRejectLawyer: (lawyerId: string, reason: string) => void;
}

export const AdminVerificationPanel: React.FC<AdminVerificationPanelProps> = ({
  lawyers,
  onApproveLawyer,
  onRejectLawyer,
}) => {
  const [selectedLawyerId, setSelectedLawyerId] = useState(
    lawyers.find((l) => l.verificationStatus === 'pending')?.id || lawyers[0]?.id
  );
  const [inspectDocUrl, setInspectDocUrl] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('نقص در تاریخ انقضای تمدید پروانه وکالت در سامانه کانون');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const selectedLawyer = lawyers.find((l) => l.id === selectedLawyerId) || lawyers[0];

  const pendingLawyers = lawyers.filter((l) => l.verificationStatus === 'pending');
  const approvedLawyers = lawyers.filter((l) => l.verificationStatus === 'approved');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                پنل مدیریت و تایید هویت وکلای دادگستری (مدیر سیستم)
              </h2>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                سطح دسترسی: SuperAdmin
              </span>
            </div>
            <p className="text-xs text-slate-400">
              بررسی کارت ملی، عکس پرسنلی، اعتبار پروانه کانون وکلا، تطبیق شماره شبا و صدور مجوز فعالیت
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold">
            {pendingLawyers.length} وکیل در انتظار تایید مدارک
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Lawyers */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            لیست درخواست‌های وکالت:
          </h3>

          <div className="space-y-2">
            {lawyers.map((lawyer) => (
              <button
                key={lawyer.id}
                onClick={() => setSelectedLawyerId(lawyer.id)}
                className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedLawyer?.id === lawyer.id
                    ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={lawyer.avatar}
                    alt={lawyer.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold">{lawyer.name}</div>
                    <div className="text-[10px] text-slate-400">{lawyer.barAssociation.split('(')[0]}</div>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    lawyer.verificationStatus === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : lawyer.verificationStatus === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {lawyer.verificationStatus === 'approved'
                    ? 'تایید شده'
                    : lawyer.verificationStatus === 'pending'
                    ? 'در انتظار بررسی'
                    : 'رد شده'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Details & Document Inspection */}
        {selectedLawyer && (
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedLawyer.name}</span>
                  {selectedLawyer.verificationStatus === 'approved' ? (
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      پروانه فعال و تایید شده
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                      در انتظار بررسی مدارک
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedLawyer.title}</p>
              </div>

              {/* Action Buttons for Admin */}
              <div className="flex items-center gap-2">
                {selectedLawyer.verificationStatus !== 'approved' && (
                  <button
                    onClick={() => onApproveLawyer(selectedLawyer.id)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تایید پروانه و صدور نشان</span>
                  </button>
                )}

                <button
                  onClick={() => setShowRejectModal(true)}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>رد یا اعلام نقص مدرک</span>
                </button>
              </div>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400">شماره پروانه کانون وکلا:</span>
                <span className="font-mono text-amber-300 font-bold block text-sm">
                  {selectedLawyer.licenseNumber}
                </span>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400">شماره شبا رسمی واریز:</span>
                <span className="font-mono text-cyan-400 font-bold block text-xs" dir="ltr">
                  {selectedLawyer.shebaNumber}
                </span>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400">تلفن همراه وکیل:</span>
                <span className="font-mono text-slate-200 block text-xs">{selectedLawyer.phone}</span>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400">شهر و کانون استانی:</span>
                <span className="text-slate-200 block text-xs">
                  {selectedLawyer.city} - {selectedLawyer.barAssociation}
                </span>
              </div>
            </div>

            {/* Document Inspection Gallery */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                اسناد بارگذاری شده جهت راستی‌آزمایی:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Bar License */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>پروانه وکالت رسمی</span>
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden mt-2 border border-slate-700 bg-slate-900">
                      <img
                        src={selectedLawyer.barLicenseDocUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80'}
                        alt="پروانه وکالت"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setInspectDocUrl(
                        selectedLawyer.barLicenseDocUrl ||
                          'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer mt-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>بررسی بزرگنمایی</span>
                  </button>
                </div>

                {/* 2. National ID Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>کارت ملی هوشمند</span>
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden mt-2 border border-slate-700 bg-slate-900">
                      <img
                        src={selectedLawyer.idCardDocUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'}
                        alt="کارت ملی"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setInspectDocUrl(
                        selectedLawyer.idCardDocUrl ||
                          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer mt-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>بررسی بزرگنمایی</span>
                  </button>
                </div>

                {/* 3. Personnel Photo */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>عکس پرسنلی ۳*۴</span>
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden mt-2 border border-slate-700 bg-slate-900">
                      <img
                        src={selectedLawyer.photoDocUrl || selectedLawyer.avatar}
                        alt="عکس پرسنلی"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setInspectDocUrl(selectedLawyer.photoDocUrl || selectedLawyer.avatar)}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer mt-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>بررسی بزرگنمایی</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inspect Document Modal */}
      {inspectDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300">پیش‌نمایش تصویر مدرک ارسالی وکیل</span>
              <button
                onClick={() => setInspectDocUrl(null)}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
              <img src={inspectDocUrl} alt="Inspection" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>رد یا اعلام نقص مدرک به وکیل</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="text-slate-300 block font-semibold">دلیل رد یا نقص مدرک (به وکیل پیامک خواهد شد):</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onRejectLawyer(selectedLawyer.id, rejectReason);
                  setShowRejectModal(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
              >
                ثبت رد و ارسال پیامک نقص
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
