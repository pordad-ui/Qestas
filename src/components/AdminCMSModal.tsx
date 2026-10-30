import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  Ban,
  Eye,
  EyeOff,
  Edit2,
  Plus,
  Layers,
  Award,
  AlertTriangle,
  FileText,
  UserCheck,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { Lawyer } from '../types/legal';
import { AppFeatureItem } from './MobileServicesGrid';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyers: Lawyer[];
  onApproveLawyer: (lawyerId: string) => void;
  onRejectLawyer: (lawyerId: string, reason: string) => void;
  appFeatures: AppFeatureItem[];
  onToggleFeatureVisibility: (featureId: string) => void;
  onUpdateFeatureTitle: (featureId: string, newTitle: string) => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  lawyers,
  onApproveLawyer,
  onRejectLawyer,
  appFeatures,
  onToggleFeatureVisibility,
  onUpdateFeatureTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'lawyers' | 'features'>('lawyers');
  const [selectedLawyerForReject, setSelectedLawyerForReject] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [previewLicenseImage, setPreviewLicenseImage] = useState<string | null>(null);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  if (!isOpen) return null;

  const pendingLawyers = lawyers.filter((l) => l.verificationStatus === 'pending' || !l.isVerified);
  const approvedLawyers = lawyers.filter((l) => l.verificationStatus === 'approved' || l.isVerified);

  const handleConfirmReject = (lawyerId: string) => {
    if (!rejectionReason.trim()) {
      alert('لطفاً علت رد مدارک و پروانه وکالت را وارد فرمایید.');
      return;
    }
    onRejectLawyer(lawyerId, rejectionReason);
    setSelectedLawyerForReject(null);
    setRejectionReason('');
  };

  const handleSaveTitle = (featureId: string) => {
    if (editingTitle.trim()) {
      onUpdateFeatureTitle(featureId, editingTitle.trim());
    }
    setEditingFeatureId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in text-right">
      <div 
        className="relative w-full max-w-2xl bg-[#0B1120] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-[#0B1120] to-amber-950/20 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>پنل مدیریت و راهبری سامانه (Admin CMS)</span>
                <span className="text-[10px] bg-[#F59E0B]/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  مدیر ارشد
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                تایید پروانه وکلا و مدیریت منوهای اپلیکیشن (Soft Delete / Hide)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('lawyers')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'lawyers'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md shadow-[#F59E0B]/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>احراز هویت و تایید پروانه وکلا ({pendingLawyers.length} در انتظار)</span>
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'features'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md shadow-[#F59E0B]/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مدیریت بخش‌های اپلیکیشن (AppFeature CMS)</span>
          </button>
        </div>

        {/* Tab 1: Lawyer Verification System */}
        {activeTab === 'lawyers' && (
          <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
            <div className="flex items-center justify-between text-slate-400 pb-1">
              <span>لیست وکلای ثبت‌نام‌شده با وضعیت در انتظار بررسی (Pending):</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                {pendingLawyers.length} درخواست جدید
              </span>
            </div>

            {pendingLawyers.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-200">تمام پرونده‌های وکلا بررسی شده‌اند</h4>
                <p className="text-[11px] text-slate-400">هیچ وکیلی در وضعیت در انتظار بررسی وجود ندارد.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={lawyer.avatar || '/src/assets/images/client_profile_avatar_1793192628292.jpg'}
                          alt={lawyer.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-amber-500/40"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-100">{lawyer.name}</h4>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {lawyer.verificationStatus === 'pending' ? 'در انتظار بررسی' : 'در انتظار بررسی'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{lawyer.title}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            شماره تماس: {lawyer.phone} · شهر: {lawyer.city}
                          </span>
                        </div>
                      </div>

                      {/* License Image Thumbnail with Click-to-Preview */}
                      <button
                        onClick={() => setPreviewLicenseImage(lawyer.barLicenseDocUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>مشاهده پروانه وکالت</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">شماره شبا رسمی وکیل:</span>
                        <span className="text-amber-300 font-mono font-bold">{lawyer.shebaNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">شماره پروانه وکالت:</span>
                        <span className="text-slate-200 font-mono">{lawyer.licenseNumber}</span>
                      </div>
                    </div>

                    {/* Action Buttons: Approve vs Reject */}
                    {selectedLawyerForReject === lawyer.id ? (
                      <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 space-y-2">
                        <label className="text-[11px] font-bold text-red-300 block">
                          علت رد مدارک (جهت ارسال پیامک به وکیل):
                        </label>
                        <input
                          type="text"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="مثال: تصویر پروانه تار است یا شماره شبا با نام دارنده مطابقت ندارد..."
                          className="w-full bg-slate-950 border border-red-500/40 rounded-xl p-2 text-slate-100 text-xs focus:outline-none"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setSelectedLawyerForReject(null)}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] cursor-pointer"
                          >
                            انصراف
                          </button>
                          <button
                            onClick={() => handleConfirmReject(lawyer.id)}
                            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] cursor-pointer"
                          >
                            تایید رد مدارک
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-end pt-1">
                        <button
                          onClick={() => setSelectedLawyerForReject(lawyer.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>رد مدارک</span>
                        </button>
                        <button
                          onClick={() => onApproveLawyer(lawyer.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/20 cursor-pointer text-xs"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>تایید و فعال‌سازی حساب وکیل</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Content Management (AppFeature Soft Delete / Hide) */}
        {activeTab === 'features' && (
          <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
            <div className="flex items-center justify-between text-slate-400 pb-1">
              <span>مدیریت خدمات شبکه ۳ ستونه (امکان مخفی کردن بدون حذف داده):</span>
              <span className="text-[10px] text-teal-400 font-mono">AppFeature Soft Delete</span>
            </div>

            <div className="space-y-2.5">
              {appFeatures.map((feat) => (
                <div
                  key={feat.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    feat.is_hidden
                      ? 'bg-slate-950/60 border-slate-800/80 opacity-60'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${feat.iconBg} flex items-center justify-center shrink-0`}>
                      <span className="text-xs font-bold font-mono">#{feat.order}</span>
                    </div>

                    <div>
                      {editingFeatureId === feat.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="bg-slate-950 border border-amber-500 rounded-lg px-2 py-1 text-slate-100 text-xs"
                          />
                          <button
                            onClick={() => handleSaveTitle(feat.id)}
                            className="px-2 py-1 bg-amber-500 text-slate-950 rounded-lg font-bold text-[10px]"
                          >
                            ذخیره
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-100">{feat.title}</h4>
                          <button
                            onClick={() => {
                              setEditingFeatureId(feat.id);
                              setEditingTitle(feat.title);
                            }}
                            className="text-slate-500 hover:text-amber-400"
                            title="ویرایش عنوان"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-500 block">
                        شناسه: {feat.slug} · وضعیت: {feat.is_hidden ? 'مخفی شده از اپلیکیشن' : 'نمایان در گرید اصلی'}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Visibility (Soft Delete) Button */}
                  <button
                    onClick={() => onToggleFeatureVisibility(feat.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      feat.is_hidden
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {feat.is_hidden ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>نمایش مجدد</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>مخفی کردن (Hide)</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* License Preview Modal */}
        {previewLicenseImage && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90">
            <div className="relative max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">پیش‌نمایش پروانه وکالت بارگذاری‌شده:</span>
                <button
                  onClick={() => setPreviewLicenseImage(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <img
                src={previewLicenseImage}
                alt="پروانه وکالت"
                className="w-full h-64 object-cover rounded-xl border border-slate-800"
              />
              <button
                onClick={() => setPreviewLicenseImage(null)}
                className="w-full py-2 bg-slate-800 text-slate-200 text-xs rounded-xl"
              >
                بستن تصویر
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>تغییرات به صورت آنی در شبکه ۳ ستونه اپلیکیشن اعمال می‌شود.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium cursor-pointer transition-colors"
          >
            بستن پنل
          </button>
        </div>
      </div>
    </div>
  );
};
