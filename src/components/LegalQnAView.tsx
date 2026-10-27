import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  CheckCircle2,
  ThumbsUp,
  Plus,
  Eye,
  Calendar,
  X,
  Send,
  BookOpen,
  ShieldCheck,
  Scale,
  Sparkles,
} from 'lucide-react';
import { LegalQnAItem, UserRole } from '../types/legal';

interface LegalQnAViewProps {
  qnaList: LegalQnAItem[];
  onAskQuestion: (item: Omit<LegalQnAItem, 'id' | 'views' | 'answers'>) => void;
  onAddAnswer: (questionId: string, answerText: string, relevantArticles: string[]) => void;
  currentUserRole: UserRole;
  currentUserName: string;
}

export const LegalQnAView: React.FC<LegalQnAViewProps> = ({
  qnaList,
  onAskQuestion,
  onAddAnswer,
  currentUserRole,
  currentUserName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [showAskModal, setShowAskModal] = useState(false);
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);

  // Ask Question Form
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('ملکی و سرقفلی');

  // Answer Form
  const [answerText, setAnswerText] = useState('');
  const [articlesText, setArticlesText] = useState('ماده ۲۱۹ قانون مدنی، ماده ۱۰ قانون مدنی');

  const categories = ['همه', 'ملکی و سرقفلی', 'کیفری و چک', 'خانواده و طلاق', 'قراردادها', 'کار و تامین اجتماعی'];

  const filteredQnA = qnaList.filter((item) => {
    const matchesQuery =
      !searchQuery.trim() ||
      item.title.includes(searchQuery) ||
      item.question.includes(searchQuery) ||
      item.answers.some((a) => a.answer.includes(searchQuery));

    const matchesCat = selectedCategory === 'همه' || item.category.includes(selectedCategory);

    return matchesQuery && matchesCat;
  });

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim()) return;

    onAskQuestion({
      title: newTitle.trim(),
      question: newQuestion.trim(),
      authorName: currentUserName || 'کاربر سامانه',
      category: newCategory,
      date: new Date().toLocaleDateString('fa-IR'),
    });

    setShowAskModal(false);
    setNewTitle('');
    setNewQuestion('');
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringQuestionId || !answerText.trim()) return;

    const articlesArray = articlesText
      .split('،')
      .map((s) => s.trim())
      .filter(Boolean);

    onAddAnswer(answeringQuestionId, answerText.trim(), articlesArray);
    setAnsweringQuestionId(null);
    setAnswerText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                تالار پرسش و پاسخ تخصصی حقوقی (پاسخ‌های تایید شده وکلای مجرب)
              </h2>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                مشاوره همگانی رایگان
              </span>
            </div>
            <p className="text-xs text-slate-400">
              طرح سوالات حقوقی و مشاهده پاسخ‌های مستند به مواد قانونی توسط وکلای پایه یک دادگستری
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>طرح سوال حقوقی جدید</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در سوالات و مواد قانونی..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pr-10 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {filteredQnA.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-750 transition-colors"
          >
            {/* Question Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-md font-bold">
                    {item.category}
                  </span>
                  <span>طرح شده توسط: {item.authorName}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {item.views} بازدید
                  </span>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white mt-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                {item.question}
              </p>
            </div>

            {/* Answers Section */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                <span>پاسخ‌های ثبت شده توسط وکلای دادگستری ({item.answers.length}):</span>
                {currentUserRole === 'lawyer' && (
                  <button
                    onClick={() => setAnsweringQuestionId(item.id)}
                    className="text-amber-400 hover:underline cursor-pointer text-[11px] font-bold"
                  >
                    + ارسال پاسخ تخصصی به این سوال
                  </button>
                )}
              </div>

              {item.answers.map((ans) => (
                <div
                  key={ans.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={ans.lawyerAvatar}
                        alt={ans.lawyerName}
                        className="w-10 h-10 rounded-xl object-cover border border-amber-500/50"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100">{ans.lawyerName}</span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            پاسخ تایید شده وکیل
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{ans.lawyerTitle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert('رای مثبت شما به این پاسخ ثبت گردید.')}
                        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                        <span>{ans.upvotes}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {ans.answer}
                  </p>

                  {/* Cited Articles */}
                  {ans.relevantArticles && ans.relevantArticles.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        مستندات قانونی استنادی:
                      </span>
                      {ans.relevantArticles.map((art, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-900 border border-slate-700 text-amber-300 px-2 py-0.5 rounded-md"
                        >
                          § {art}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {item.answers.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-3 bg-slate-950/40 rounded-xl">
                  هنوز پاسخی برای این سوال ثبت نشده است. وکلای مجرب در حال بررسی می‌باشند.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>طرح سوال حقوقی در سامانه دادگستر</span>
              </h3>
              <button onClick={() => setShowAskModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">عنوان خلاصه سوال:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: آیا می‌توان چک صیادی را بدون ثبت در سامانه پیچک نقد کرد؟"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">دسته‌بندی موضوعی:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="ملکی و سرقفلی">ملکی و سرقفلی</option>
                  <option value="کیفری و چک">کیفری و چک</option>
                  <option value="خانواده و طلاق">خانواده، مهریه و طلاق</option>
                  <option value="قراردادها">قراردادها و مطالبات مالی</option>
                  <option value="کار و تامین اجتماعی">کارگری و کارفرمایی</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">شرح دقیق واقعه و سوال حقوقی:</label>
                <textarea
                  rows={4}
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="جزئیات و سوال خود را کامل توضیح دهید تا وکلای مجرب بهترین پاسخ را بدهند..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  انتشار عمومی سوال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Answer Modal for Lawyers */}
      {answeringQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>ارسال پاسخ وکیل پایه یک</span>
              </h3>
              <button onClick={() => setAnsweringQuestionId(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAnswerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">پاسخ تحلیلی و مستدل حقوقی:</label>
                <textarea
                  rows={5}
                  required
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="پاسخ را با استناد به موازین قانونی و رویه قضایی بنویسید..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">مواد قانونی مرتبط (با کاما یا ویرگول جدا کنید):</label>
                <input
                  type="text"
                  value={articlesText}
                  onChange={(e) => setArticlesText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAnsweringQuestionId(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  ثبت پاسخ رسمی وکیل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
