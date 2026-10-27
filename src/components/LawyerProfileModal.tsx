import React, { useState } from 'react';
import {
  X,
  Star,
  Award,
  ShieldCheck,
  Phone,
  Video,
  MessageSquare,
  FileText,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  Scale,
  Send,
  MessageCircle,
} from 'lucide-react';
import { Lawyer, LawyerReview } from '../types/legal';

interface LawyerProfileModalProps {
  lawyer: Lawyer | null;
  onClose: () => void;
  onBookConsultation: (lawyerId: string, serviceType?: string) => void;
  onStartChat: (lawyerId: string) => void;
  onAddReview: (lawyerId: string, review: Omit<LawyerReview, 'id'>) => void;
  currentUserRole: string;
}

export const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({
  lawyer,
  onClose,
  onBookConsultation,
  onStartChat,
  onAddReview,
  currentUserRole,
}) => {
  const [newRating, setNewRating] = useState(5);
  const [clientComment, setClientComment] = useState('');
  const [caseType, setCaseType] = useState('ملکی و قراردادها');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  if (!lawyer) return null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientComment.trim()) return;

    onAddReview(lawyer.id, {
      clientName: 'موکل سامانه (کاربر احراز شده)',
      rating: newRating,
      date: new Date().toLocaleDateString('fa-IR'),
      caseType,
      comment: clientComment.trim(),
    });

    setClientComment('');
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
            <div className="relative">
              <img
                src={lawyer.avatar}
                alt={lawyer.name}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-amber-500/80 shadow-2xl"
              />
              {lawyer.isVerified && (
                <div className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow" title="احراز هویت شده">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
              {/* Online / Offline Dot Indicator */}
              <div
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center"
                title={lawyer.isOnline ? 'وکیل آنلاین و آماده مشاوره فوری است' : 'وکیل آفلاین است'}
              >
                {lawyer.isOnline ? (
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900 shadow-md" />
                  </span>
                ) : (
                  <span className="inline-flex rounded-full h-4 w-4 bg-slate-500 border-2 border-slate-900 shadow-sm" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black text-white">{lawyer.name}</h2>
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{lawyer.rating.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400">({lawyer.reviewCount} نظر ثبت شده)</span>
                </div>
                {lawyer.isOnline ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    آنلاین • آماده مشاوره فوری
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                    <span className="inline-flex rounded-full h-2 w-2 bg-slate-500" />
                    آفلاین • رزرو نوبت
                  </span>
                )}
              </div>

              <p className="text-xs text-amber-400 font-medium">{lawyer.title}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  {lawyer.experienceYears} سال سابقه وکالت
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lawyer.winRate}٪ درصد آمار موفقیت
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {lawyer.city}
                </span>
              </div>

              <div className="pt-2 text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  {lawyer.barAssociation}
                </span>
                <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-amber-300 font-bold">
                  شماره پروانه: {lawyer.licenseNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Bio & Education */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">درباره و سوابق علمی وکیل:</h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {lawyer.bio}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{lawyer.education}</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">حوزه‌های تخصصی پذیرش پرونده:</h3>
            <div className="flex flex-wrap gap-2">
              {lawyer.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-xl font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Services & Pricing Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              تعرفه رسمی خدمات مشاوره و وکالت:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Phone 15min */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">مشاوره تلفنی فوری (۱۵ دقیقه)</div>
                    <div className="text-[11px] text-slate-400">پاسخ مستقیم و سریع وکیل</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-amber-400">
                    {lawyer.pricing.phone15min.toLocaleString('fa-IR')} ت
                  </div>
                  <button
                    onClick={() => onBookConsultation(lawyer.id, 'مشاوره تلفنی ۱۵ دقیقه')}
                    className="mt-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    رزرو وقت
                  </button>
                </div>
              </div>

              {/* Phone 30min */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">مشاوره تلفنی جامع (۳۰ دقیقه)</div>
                    <div className="text-[11px] text-slate-400">تحلیل فنی پرونده با ادله</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-amber-400">
                    {lawyer.pricing.phone30min.toLocaleString('fa-IR')} ت
                  </div>
                  <button
                    onClick={() => onBookConsultation(lawyer.id, 'مشاوره تلفنی ۳۰ دقیقه')}
                    className="mt-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    رزرو وقت
                  </button>
                </div>
              </div>

              {/* Video consultation */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">مشاوره تصویری امن (۴۵ دقیقه)</div>
                    <div className="text-[11px] text-slate-400">اتاق رمزنگاری شده E2EE</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-amber-400">
                    {lawyer.pricing.videoConsultation.toLocaleString('fa-IR')} ت
                  </div>
                  <button
                    onClick={() => onBookConsultation(lawyer.id, 'مشاوره تصویری ۴۵ دقیقه')}
                    className="mt-1 text-[10px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    رزرو وقت
                  </button>
                </div>
              </div>

              {/* Text consultation */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">مشاوره متنی ۲۴ ساعته</div>
                    <div className="text-[11px] text-slate-400">ارسال نامحدود اسناد و مدارک</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-amber-400">
                    {lawyer.pricing.textConsultation.toLocaleString('fa-IR')} ت
                  </div>
                  <button
                    onClick={() => onStartChat(lawyer.id)}
                    className="mt-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    شروع چت
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span>نظرات و امتیازات موکلین تایید شده ({lawyer.reviews.length}):</span>
              </h3>
            </div>

            <div className="space-y-3">
              {lawyer.reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{rev.clientName}</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        موکل احراز شده
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                      <span className="text-[10px] text-slate-400 mr-2">{rev.date}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-400/90">موضوع پرونده: {rev.caseType}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                  {rev.lawyerReply && (
                    <div className="bg-slate-900/90 border-r-2 border-amber-500 p-2.5 rounded-l-xl text-xs text-slate-400 mt-2">
                      <span className="font-bold text-slate-300 block mb-1">پاسخ وکیل:</span>
                      {rev.lawyerReply}
                    </div>
                  )}
                </div>
              ))}

              {lawyer.reviews.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">
                  هنوز نظری برای این وکیل ثبت نشده است. اولین نفری باشید که تجربه خود را ثبت می‌کنید.
                </p>
              )}
            </div>

            {/* Submit new review form */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-200">ثبت تجربه و امتیاز به عملکرد وکیل:</div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-400">امتیاز شما:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewRating(s)}
                      className="cursor-pointer p-0.5"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                placeholder="موضوع پرونده (مثلاً: دعاوی ملکی، چک، طلاق و...)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />

              <textarea
                rows={3}
                value={clientComment}
                onChange={(e) => setClientComment(e.target.value)}
                placeholder="توضیحات و نظر خود درباره تسلط حقوقی، اخلاق حرفه‌ای و پیگیری وکیل را بنویسید..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
              />

              {showReviewSuccess && (
                <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-center">
                  نظر شما با موفقیت ثبت شد و در پروفایل وکیل قرار گرفت.
                </div>
              )}

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
                <span>ارسال و ثبت نظر</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => onStartChat(lawyer.id)}
            className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>چت اختصاصی و ارسال مدارک</span>
          </button>

          <button
            onClick={() => onBookConsultation(lawyer.id)}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>رزرو نوبت مشاوره آنلاین</span>
          </button>
        </div>
      </div>
    </div>
  );
};
