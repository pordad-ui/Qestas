import React, { useState } from 'react';
import {
  Edit3,
  X,
  Save,
  CheckCircle2,
  Sparkles,
  Phone,
  HelpCircle,
  Plus,
  Trash2,
  Globe,
} from 'lucide-react';
import { CMSContent } from '../types/legal';

interface CMSManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cms: CMSContent;
  onSaveCMS: (newCMS: CMSContent) => void;
}

export const CMSManagerModal: React.FC<CMSManagerModalProps> = ({
  isOpen,
  onClose,
  cms,
  onSaveCMS,
}) => {
  const [formData, setFormData] = useState<CMSContent>({ ...cms });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCMS(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          question: 'سوال حقوقی جدید شما؟',
          answer: 'پاسخ و توضیحات مربوط به این سوال را اینجا بنویسید.',
        },
      ],
    }));
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const handleDeleteFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>سیستم مدیریت محتوای اختصاصی وب‌سایت (CMS دادگستر)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  تغییر فوری متون
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                ویرایش سریع متون صفحه اصلی، شعار تبلیغاتی، اعلانات فوری، سوالات متداول و تلفن‌های ضروری
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto text-xs flex-1">
          {/* Hero Headline */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-semibold">
              عنوان اصلی صفحه نخست (Hero Title):
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Hero Subtitle */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-semibold">
              شرح زیرعنوان و بیانیه ماموریت پلتفرم (Hero Subtitle):
            </label>
            <textarea
              rows={2}
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {/* Announcement Ticker */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>متن نوار اعلانات فوری (Ticker Announcement):</span>
            </label>
            <input
              type="text"
              value={formData.announcementTicker}
              onChange={(e) => setFormData({ ...formData, announcementTicker: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Guarantee and Emergency Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">متن ضمانت بازگشت وجه مشاوره:</label>
              <textarea
                rows={2}
                value={formData.consultationGuaranteeText}
                onChange={(e) => setFormData({ ...formData, consultationGuaranteeText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>شماره تماس فوریت‌های حقوقی:</span>
              </label>
              <input
                type="text"
                value={formData.contactEmergencyPhone}
                onChange={(e) => setFormData({ ...formData, contactEmergencyPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* FAQ Editor */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>مدیریت سوالات متداول کاربران (FAQ):</span>
              </label>
              <button
                type="button"
                onClick={handleAddFaq}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 cursor-pointer text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن سوال جدید</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                      placeholder="متن پرسش..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2 font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(index)}
                      className="p-2 text-rose-400 hover:bg-slate-900 rounded-xl cursor-pointer"
                      title="حذف این سوال"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                    placeholder="متن پاسخ..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-300 focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              تغییرات با موفقیت در کل سامانه اعمال گردید!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              تغییرات فوراً بر روی تمامی صفحات و ماژول‌ها منتشر می‌شوند.
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer text-xs"
            >
              انصراف
            </button>
            <button
              onClick={handleSave}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره و انتشار تغییرات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
