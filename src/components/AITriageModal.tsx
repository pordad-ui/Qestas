import React, { useState } from 'react';
import {
  Brain,
  X,
  Sparkles,
  ShieldAlert,
  FileText,
  BookOpen,
  Clock,
  TrendingUp,
  UserCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Send,
  Loader2,
} from 'lucide-react';
import { AITriageResult, Lawyer } from '../types/legal';

interface AITriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLawyerForBooking: (lawyerId: string) => void;
  lawyers: Lawyer[];
}

export const AITriageModal: React.FC<AITriageModalProps> = ({
  isOpen,
  onClose,
  onSelectLawyerForBooking,
  lawyers,
}) => {
  const [caseDescription, setCaseDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<AITriageResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleScenarios = [
    {
      title: 'چک برگشتی و توقیف اموال',
      text: 'یک فقره چک صیادی به مبلغ ۹۰۰ میلیون تومان به تاریخ سررسید ۱۰ روز پیش برگشت خورده و گواهی عدم پرداخت با کد رهگیری صادر شده است. شنیده‌ام صادرکننده قصد فرار از کشور یا واگذاری خودرو به نام همسرش را دارد. چطور می‌توانم سریعاً اموالش را توقیف کنم؟',
      category: 'حقوقی و چک',
    },
    {
      title: 'الزام به تنظیم سند ملک',
      text: 'آپارتمانی را با مبایعه‌نامه معتبر در دفتر املاک خریداری کرده و ۸۵ درصد مبلغ را تسویه نموده‌ام. تاریخ حضور در دفترخانه ۴۱۲ تهران فرارسیده اما فروشنده به بهانه افزایش قیمت حاضر به انتقال سند تک‌برگ و تحویل کلید نیست. گواهی عدم حضور هم گرفته‌ام.',
      category: 'ملکی و سرقفلی',
    },
    {
      title: 'مطالبه مهریه و تامین خواسته',
      text: 'قصد مطالبه مهریه خود به تعداد ۱۱۴ سکه تمام بهار آزادی را دارم. همسرم کارمند شرکت نفت بوده و یک واحد آپارتمان نیز دارد. می‌خواهم پیش از آنکه متوجه شود، حساب‌ها و ملک او را توقیف کنم تا نتواند سند را انتقال دهد.',
      category: 'خانواده',
    },
    {
      title: 'کلاهبرداری اینترنتی رمزارز',
      text: 'از طریق یک کانال تلگرام به درگاه بانکی هدایت شدم که مبلغ ۳۵۰ میلیون ریال از حسابم کسر و به حساب یک صرافی آنلاین برای خرید ارز دیجیتال تتر واریز شد. پیامک شاپرک را هم دارم.',
      category: 'کیفری',
    },
  ];

  const handleRunTriage = async (textToAnalyze?: string) => {
    const text = textToAnalyze || caseDescription;
    if (!text.trim()) {
      setErrorMsg('لطفاً شرح ماجرا یا سوال حقوقی خود را وارد نمایید.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: text,
          category: selectedCategory !== 'همه' ? selectedCategory : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('خطا در برقراری ارتباط با سامانه هوشمند');
      }

      const data: AITriageResult = await response.json();
      setTriageResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('امکان تحلیل آنلاین در این لحظه میسر نشد. لطفاً مجدداً تلاش فرمایید.');
    } finally {
      setIsLoading(false);
    }
  };

  // Find matching lawyer
  const matchingLawyer = lawyers.find(
    (l) =>
      triageResult &&
      l.specialties.some((s) => triageResult.category.includes(s) || s.includes(triageResult.category))
  ) || lawyers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Brain className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  سیستم تریاژ و تحلیل هوشمند پرونده‌های قضایی
                </h2>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  موتور Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                انطباق شرح واقعه با قوانین موضوعه جمهوری اسلامی ایران، مواد قانونی، ادله و برآورد زمان
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

        {/* Content Area */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Scenario Buttons */}
          <div>
            <div className="text-xs text-slate-400 mb-2 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>انتخاب سناریوهای آماده حقوقی جهت ارزیابی سریع:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCaseDescription(sc.text);
                    handleRunTriage(sc.text);
                  }}
                  className="text-right p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 transition-all text-xs cursor-pointer group"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-200 group-hover:text-amber-300">
                    <span>{sc.title}</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                      {sc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sc.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* User Input Text Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              شرح دقیق ماجرا، مفاد قرارداد یا دعوای حقوقی خود را بنویسید:
            </label>
            <div className="relative">
              <textarea
                rows={4}
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                placeholder="مثال: من سه ماه پیش ملکی را رهن کردم، اکنون صاحب‌خانه ودیعه من را پس نمی‌دهد و چک تضمین تخلیه را هم به اجرا گذاشته است. چکار کنم؟..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 leading-relaxed"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                حفظ محرمانگی طبق ماده ۴۸ قانون وکالت
              </span>
              <button
                onClick={() => handleRunTriage()}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال ارزیابی قوانین و مواد قضایی...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>تحلیل و صدور گزارش تریاژ</span>
                    <Send className="w-3.5 h-3.5 rotate-180" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Triage Results Display */}
          {triageResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>نتایج کارشناسی تریاژ هوشمند دادگستر</span>
                </h3>
                <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full font-bold">
                  فوریت: {triageResult.urgency}
                </span>
              </div>

              {/* Title & Summary */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-xs text-amber-400 font-bold">
                  عنوان تشخیص داده شده: {triageResult.legalTitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {triageResult.legalSummary}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    شاخه اصلی: {triageResult.category}
                  </span>
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    مدت تقریبی دادرسی: {triageResult.estimatedDurationMonths}
                  </span>
                </div>
              </div>

              {/* Grid: Legal Articles & Required Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Articles */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>مواد قانونی و مستندات قضایی مرتبط:</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {triageResult.relevantArticles.map((art, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                        <span className="text-amber-400 font-bold shrink-0">§</span>
                        <span>{art}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>ادله اثبات دعوا و مدارک لازم برای دادگاه:</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {triageResult.requiredDocuments.map((doc, i) => (
                      <li key={i} className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Progress & Next Actions */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    شانس موفقیت و استحکام حقوقی ادله:
                  </span>
                  <span className="text-sm font-black text-emerald-400">
                    %{triageResult.estimatedSuccessRate.toLocaleString('fa-IR')}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${triageResult.estimatedSuccessRate}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-400 mb-2">گام‌های قانونی توصیه شده:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {triageResult.nextActionSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl text-slate-300 border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matched Lawyer CTA */}
              {matchingLawyer && (
                <div className="bg-gradient-to-l from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={matchingLawyer.avatar}
                      alt={matchingLawyer.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/60"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-400 font-bold">وکیل پیشنهادی متخصص:</span>
                        <span className="text-sm font-bold text-white">{matchingLawyer.name}</span>
                      </div>
                      <p className="text-xs text-slate-300">{matchingLawyer.title}</p>
                      <p className="text-[11px] text-slate-400">
                        درصد موفقیت در پرونده‌های مشابه: {matchingLawyer.winRate}٪ | {matchingLawyer.experienceYears} سال سابقه وکالت
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectLawyerForBooking(matchingLawyer.id);
                    }}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>رزرو مشاوره فوری با {matchingLawyer.name}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
