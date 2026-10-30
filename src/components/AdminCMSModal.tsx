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
  ChevronUp,
  ChevronDown,
  Trash2,
  Type,
  Code2,
  Search,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Lawyer } from '../types/legal';
import { DynamicMenuItem, DynamicTextItem, MenuLocation, IconStyle } from '../types/cms';
import { DynamicIcon, AVAILABLE_ICON_NAMES } from './DynamicIcon';
import { useCMS } from '../context/CMSContext';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyers: Lawyer[];
  onApproveLawyer: (lawyerId: string) => void;
  onRejectLawyer: (lawyerId: string, reason: string) => void;
  onOpenArchitecture?: () => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  lawyers,
  onApproveLawyer,
  onRejectLawyer,
  onOpenArchitecture,
}) => {
  const {
    menus,
    textItems,
    addMenu,
    updateMenu,
    toggleMenuVisibility,
    reorderMenu,
    deleteMenu,
    updateText,
    resetAllToDefaults,
  } = useCMS();

  // Active Tab: 'lawyers' | 'menus' | 'texts' | 'backend'
  const [activeTab, setActiveTab] = useState<'lawyers' | 'menus' | 'texts' | 'backend'>('lawyers');

  // Lawyer Verification State
  const [selectedLawyerForReject, setSelectedLawyerForReject] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [previewDocModal, setPreviewDocModal] = useState<{
    isOpen: boolean;
    title: string;
    imageUrl: string;
  } | null>(null);

  // Menus Management State
  const [menuLocationFilter, setMenuLocationFilter] = useState<string>('all');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

  // New Menu Form State
  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [newMenuLocation, setNewMenuLocation] = useState<MenuLocation>('home_grid');
  const [newMenuTargetUrl, setNewMenuTargetUrl] = useState('#cases');
  const [newMenuIconName, setNewMenuIconName] = useState('Gavel');
  const [newMenuIconStyle, setNewMenuIconStyle] = useState<IconStyle>('colored');
  const [newMenuColorTheme, setNewMenuColorTheme] = useState('amber');
  const [newMenuBadge, setNewMenuBadge] = useState('');
  const [newMenuDesc, setNewMenuDesc] = useState('');

  // Texts Management State
  const [textCategoryFilter, setTextCategoryFilter] = useState<string>('all');
  const [textSearchQuery, setTextSearchQuery] = useState('');

  if (!isOpen) return null;

  const pendingLawyers = lawyers.filter((l) => l.verificationStatus === 'pending' || !l.isVerified);
  const approvedLawyers = lawyers.filter((l) => l.verificationStatus === 'approved' || l.isVerified);
  const rejectedLawyers = lawyers.filter((l) => l.verificationStatus === 'rejected');

  const handleConfirmReject = (lawyerId: string) => {
    if (!rejectionReason.trim()) {
      alert('لطفاً دلیل رد پروانه یا نقص مدارک را وارد فرمایید.');
      return;
    }
    onRejectLawyer(lawyerId, rejectionReason.trim());
    setSelectedLawyerForReject(null);
    setRejectionReason('');
  };

  const handleCreateMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuTitle.trim()) return;

    addMenu({
      title: newMenuTitle.trim(),
      slug: newMenuTitle.trim().toLowerCase().replace(/\s+/g, '-'),
      location: newMenuLocation,
      target_url: newMenuTargetUrl.trim() || '#home',
      icon_name: newMenuIconName.trim() || 'FileText',
      icon_style: newMenuIconStyle,
      color_theme: newMenuColorTheme,
      badge_text: newMenuBadge.trim() || undefined,
      description: newMenuDesc.trim() || undefined,
      order: menus.filter((m) => m.location === newMenuLocation).length + 1,
      is_active: true,
    });

    setIsAddMenuOpen(false);
    setNewMenuTitle('');
    setNewMenuBadge('');
    setNewMenuDesc('');
  };

  const filteredMenus = menus.filter(
    (m) => menuLocationFilter === 'all' || m.location === menuLocationFilter
  );

  const filteredTexts = textItems.filter((item) => {
    const matchesCategory =
      textCategoryFilter === 'all' || item.category === textCategoryFilter;
    const matchesSearch =
      !textSearchQuery ||
      item.key.toLowerCase().includes(textSearchQuery.toLowerCase()) ||
      item.label.toLowerCase().includes(textSearchQuery.toLowerCase()) ||
      item.value.toLowerCase().includes(textSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in text-right">
      <div
        className="relative w-full max-w-3xl bg-[#0B1120] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-[#0B1120] to-amber-950/20 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>پنل جامع راهبری و مدیریت سیستم (Master Admin CMS)</span>
                <span className="text-[10px] bg-[#F59E0B]/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  مدیر ارشد
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                کنترل ۱۰۰٪ دینامیک محتوا، احراز هویت وکلا و مدیریت منوهای نرم‌افزار
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

        {/* 4 Navigation Tabs */}
        <div className="p-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('lawyers')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'lawyers'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md shadow-[#F59E0B]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>احراز هویت وکلا ({pendingLawyers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menus')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'menus'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md shadow-[#F59E0B]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مدیریت منوها و ناوبری ({menus.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'texts'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md shadow-[#F59E0B]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>مدیریت متون اپلیکیشن ({textItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backend')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'backend'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md shadow-[#F59E0B]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>کدهای بک‌اند جنگو</span>
          </button>
        </div>

        {/* TAB 1: Lawyer Verification */}
        {activeTab === 'lawyers' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
            <div className="flex items-center justify-between text-slate-400 pb-1">
              <span>لیست وکلای در انتظار بررسی مدارک پروانه وکالت و کارت ملی:</span>
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
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={lawyer.avatar || '/src/assets/images/client_profile_avatar_1793192628292.jpg'}
                          alt={lawyer.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-amber-500/40"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{lawyer.name}</h4>
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                              در انتظار تایید ادمین
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{lawyer.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono" dir="ltr">
                            {lawyer.phone} · {lawyer.email}
                          </p>
                        </div>
                      </div>

                      <div className="text-left font-mono text-[11px]">
                        <span className="text-slate-400 block text-[10px]">شماره پروانه:</span>
                        <span className="text-amber-400 font-bold">{lawyer.licenseNumber}</span>
                      </div>
                    </div>

                    {/* License and ID Card Preview Buttons */}
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDocModal({
                              isOpen: true,
                              title: `تصویر پروانه وکالت - ${lawyer.name}`,
                              imageUrl: lawyer.barLicenseDocUrl || lawyer.avatar,
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>مشاهده تصویر پروانه وکالت</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDocModal({
                              isOpen: true,
                              title: `تصویر کارت ملی - ${lawyer.name}`,
                              imageUrl: lawyer.idCardDocUrl || lawyer.avatar,
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-teal-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-teal-400" />
                          <span>مشاهده تصویر کارت ملی</span>
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        شبا: {lawyer.shebaNumber}
                      </span>
                    </div>

                    {/* Actions: Approve / Reject */}
                    {selectedLawyerForReject === lawyer.id ? (
                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2 animate-fade-in">
                        <label className="text-[11px] font-bold text-rose-300 block">
                          علت رد پروانه و مدارک (جهت اطلاع وکیل):
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="مثلاً: تصویر پروانه ارسالی ناخوانا است یا تاریخ اعتبار منقضی شده است..."
                          rows={2}
                          className="w-full bg-slate-950 border border-rose-500/40 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedLawyerForReject(null)}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] cursor-pointer"
                          >
                            انصراف
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmReject(lawyer.id)}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer"
                          >
                            ثبت رد و ارسال پیامک به وکیل
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setSelectedLawyerForReject(lawyer.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>رد با ذکر دلیل</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onApproveLawyer(lawyer.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>تایید پروانه و فعال‌سازی حساب</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Approved Lawyers Summary */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                وکلای تایید شده فعال در سیستم ({approvedLawyers.length} نفر):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {approvedLawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={lawyer.avatar}
                        alt={lawyer.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-slate-200 block truncate">
                          {lawyer.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {lawyer.licenseNumber}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
                      تایید شده ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Dynamic Menus Management */}
        {activeTab === 'menus' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
            {/* Action Bar & Location Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', title: 'همه منوها' },
                  { id: 'home_grid', title: 'شبکه اصلی (Home Grid)' },
                  { id: 'side_drawer', title: 'منوی کشویی (Drawer)' },
                  { id: 'bottom_nav', title: 'نوار پایین (Bottom Nav)' },
                  { id: 'sub_menu', title: 'چیپ‌های هدر' },
                  { id: 'secondary_tools', title: 'ابزارهای ثانویه' },
                ].map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setMenuLocationFilter(loc.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      menuLocationFilter === loc.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {loc.title}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddMenuOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن منوی جدید</span>
              </button>
            </div>

            {/* Add New Menu Modal/Drawer */}
            {isAddMenuOpen && (
              <form
                onSubmit={handleCreateMenuSubmit}
                className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3 animate-fade-in"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>ایجاد آیتم ناوبری / منوی جدید</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddMenuOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      عنوان آیتم:
                    </label>
                    <input
                      type="text"
                      value={newMenuTitle}
                      onChange={(e) => setNewMenuTitle(e.target.value)}
                      placeholder="مثلاً: استعلام پلاک ثبتی"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      موقعیت قرارگیری منو:
                    </label>
                    <select
                      value={newMenuLocation}
                      onChange={(e) => setNewMenuLocation(e.target.value as MenuLocation)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="home_grid">شبکه خدمات صفحه نخست (Home Grid)</option>
                      <option value="side_drawer">منوی کشویی جانبی (Side Drawer)</option>
                      <option value="bottom_nav">نوار ناوبری پایینی (Bottom Nav)</option>
                      <option value="sub_menu">چیپ‌های هدر (Sub Menus)</option>
                      <option value="secondary_tools">ردیف ابزارهای ثانویه</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      مسیر مقصد (Target URL / Route):
                    </label>
                    <input
                      type="text"
                      value={newMenuTargetUrl}
                      onChange={(e) => setNewMenuTargetUrl(e.target.value)}
                      placeholder="#cases, #lawyers, #consultation, #triage..."
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      dir="ltr"
                    />
                    <div className="flex flex-wrap gap-1 mt-1 text-[9px] text-amber-400">
                      {['#cases', '#lawyers', '#consultation', '#triage', '#documents', '#qna'].map(
                        (route) => (
                          <button
                            key={route}
                            type="button"
                            onClick={() => setNewMenuTargetUrl(route)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300"
                          >
                            {route}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      نام آیکون (Icon Name):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMenuIconName}
                        onChange={(e) => setNewMenuIconName(e.target.value)}
                        placeholder="Gavel, Users, Briefcase, FileText..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        dir="ltr"
                      />
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                        <DynamicIcon
                          name={newMenuIconName}
                          style={newMenuIconStyle}
                          colorTheme={newMenuColorTheme}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      استایل آیکون (Icon Style):
                    </label>
                    <select
                      value={newMenuIconStyle}
                      onChange={(e) => setNewMenuIconStyle(e.target.value as IconStyle)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="colored">رنگی با کادر نرم (Colored Container)</option>
                      <option value="linear">خطی ظریف (Linear Outline)</option>
                      <option value="minimal">مینیمال بدون کادر (Minimal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      تم رنگی (Color Theme):
                    </label>
                    <select
                      value={newMenuColorTheme}
                      onChange={(e) => setNewMenuColorTheme(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="amber">طلایی کهربایی (Amber)</option>
                      <option value="teal">سبز آبی کله‌غازی (Teal)</option>
                      <option value="indigo">نیلی (Indigo)</option>
                      <option value="cyan">آبی فیروزه‌ای (Cyan)</option>
                      <option value="emerald">سبز زمردی (Emerald)</option>
                      <option value="rose">زرشکی (Rose)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMenuOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    ذخیره و انتشار در اپلیکیشن
                  </button>
                </div>
              </form>
            )}

            {/* Menus List */}
            <div className="space-y-2">
              {filteredMenus.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    item.is_active
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <DynamicIcon
                      name={item.icon_name}
                      style={item.icon_style}
                      colorTheme={item.color_theme}
                      className="w-4 h-4 shrink-0"
                    />

                    <div className="min-w-0">
                      {editingMenuId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue={item.title}
                            onBlur={(e) => {
                              if (e.target.value.trim()) {
                                updateMenu(item.id, { title: e.target.value.trim() });
                              }
                              setEditingMenuId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            autoFocus
                            className="bg-slate-950 border border-amber-500 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-200 truncate">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => setEditingMenuId(item.id)}
                            className="text-slate-500 hover:text-amber-400 cursor-pointer"
                            title="ویرایش عنوان"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span className="bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                          {item.location}
                        </span>
                        <span className="text-amber-400 truncate">{item.target_url}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Soft Delete Toggle */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Reorder Buttons */}
                    <button
                      onClick={() => reorderMenu(item.id, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="حرکت به بالا"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => reorderMenu(item.id, 'down')}
                      disabled={index === filteredMenus.length - 1}
                      className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="حرکت به پایین"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Visibility (Soft Delete / Hide) */}
                    <button
                      onClick={() => toggleMenuVisibility(item.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        item.is_active
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                      title={item.is_active ? 'مخفی کردن از اپلیکیشن' : 'نمایش مجدد در اپلیکیشن'}
                    >
                      {item.is_active ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>فعال</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>مخفی (Soft Deleted)</span>
                        </>
                      )}
                    </button>

                    {/* Delete Permanently */}
                    <button
                      onClick={() => {
                        if (confirm(`آیا از حذف آیتم "${item.title}" اطمینان دارید؟`)) {
                          deleteMenu(item.id);
                        }
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                      title="حذف کامل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Dynamic Text Manager (Zero Hardcoded UI) */}
        {activeTab === 'texts' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
            {/* Search and Category Filter */}
            <div className="space-y-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={textSearchQuery}
                    onChange={(e) => setTextSearchQuery(e.target.value)}
                    placeholder="جستجو در کلیدها و متن‌های اپلیکیشن..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={resetAllToDefaults}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 flex items-center gap-1 cursor-pointer shrink-0"
                  title="بازنشانی به پیش‌فرض"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>ریست</span>
                </button>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', title: 'همه متون' },
                  { id: 'brand', title: 'برند و نام' },
                  { id: 'hero_card', title: 'هیرو کارت پرونده' },
                  { id: 'timeline', title: 'تایم‌لاین مراحل' },
                  { id: 'actions', title: 'دکمه‌های شناور' },
                  { id: 'bottom_nav', title: 'نوار پایین' },
                  { id: 'drawer', title: 'منوی کشویی' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTextCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      textCategoryFilter === cat.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Editable Text Keys */}
            <div className="space-y-3">
              {filteredTexts.map((item) => (
                <div
                  key={item.key}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{item.label}</span>
                      <span className="text-[10px] text-amber-400/90 font-mono" dir="ltr">
                        {item.key}
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                      {item.category}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => updateText(item.key, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-amber-500/50 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                  />
                  {item.description && (
                    <p className="text-[10px] text-slate-500">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Django Backend Reference */}
        {activeTab === 'backend' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">
                  معماری و ماژول‌های جنگو + پستگرس‌کیوال (Django + PostgreSQL)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  تمام مدل‌ها، سریالایزرها، ویوها و مسیرهای API با امنیت AES-256 پیاده‌سازی شده‌اند.
                </p>
              </div>
              {onOpenArchitecture && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenArchitecture();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>مشاهده پنل کامل معماری</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-mono text-xs font-bold block">
                  📁 backend/models.py
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  شامل مدل‌های CustomUser، LawyerProfile (همراه با تاییدیه پروانه و فیلد rejection_reason)،
                  VerificationDocument، ConsultationSession، EncryptedMessage (رمزنگاری AES-256)،
                  DynamicMenu و DynamicText.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-teal-400 font-mono text-xs font-bold block">
                  📁 backend/serializers.py
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  اعتبارسنجی ثبت‌نام موکل و وکیل، محاسبه هش یکتای SHA-256 مدارک، کنترل وضعیت احراز
                  هویت و سریالایزرهای اختصاصی CMS.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-mono text-xs font-bold block">
                  📁 backend/views.py
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  اندپوینت‌های تایید و رد وکیل (Approve/Reject)، مدیریت منوها با Soft Delete
                  (toggle_visibility)، بازیابی بدون هاردکد متون (PublicDynamicTextView) و جلسات رمزنگاری.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-indigo-400 font-mono text-xs font-bold block">
                  📁 backend/urls.py
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  مسیریابی روت‌های DRF و APIهای اختصاصی CMS و احراز هویت وکیل تحت پیشوند
                  /api/v1/dadgostar/.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>پایگاه داده PostgreSQL متصل و همگام با کلاینت</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            بستن پنل
          </button>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDocModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewDocModal(null)}
        >
          <div
            className="bg-[#0B1120] border border-slate-800 rounded-3xl p-4 max-w-lg w-full space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-white">{previewDocModal.title}</h4>
              <button
                onClick={() => setPreviewDocModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[260px]">
              <img
                src={previewDocModal.imageUrl}
                alt="سند و مدرک"
                className="max-h-[380px] w-auto object-contain"
              />
            </div>
            <p className="text-[10px] text-teal-400 text-center font-mono">
              هش یکپارچگی سند: SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
