import React, { useState } from 'react';
import {
  BellRing,
  Smartphone,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Filter,
} from 'lucide-react';
import { SMSNotificationLog } from '../types/legal';

interface SMSNotificationsViewProps {
  logs: SMSNotificationLog[];
  onSendCustomSMS: (log: Omit<SMSNotificationLog, 'id' | 'timestamp' | 'status'>) => void;
  userPhone: string;
}

export const SMSNotificationsView: React.FC<SMSNotificationsViewProps> = ({
  logs,
  onSendCustomSMS,
  userPhone,
}) => {
  const [testPhone, setTestPhone] = useState(userPhone || '۰۹۱۲۳۴۵۶۷۸۹');
  const [testTemplate, setTestTemplate] = useState<'ابلاغیه ثنا' | 'یادآوری دادگاه' | 'مهلت قانونی'>('مهلت قانونی');
  const [testCustomText, setTestCustomText] = useState(
    'هشدار مهلت قانونی: موکل گرامی، مهلت تجدیدنظرخواهی در پرونده شعبه ۱۰۵ دادگاه بهشتی ۵ روز دیگر به پایان می‌رسد.'
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState(false);

  // Settings
  const [enableSanaAlerts, setEnableSanaAlerts] = useState(true);
  const [enableCourtReminders, setEnableCourtReminders] = useState(true);
  const [enableDeadlineCountdown, setEnableDeadlineCountdown] = useState(true);
  const [enablePaymentAlerts, setEnablePaymentAlerts] = useState(true);

  const handleSendTestSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim() || !testCustomText.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      onSendCustomSMS({
        recipientPhone: testPhone,
        recipientName: 'کاربر سامانه',
        recipientRole: 'client',
        type: testTemplate,
        message: testCustomText,
      });

      setIsSending(false);
      setSendSuccessMsg(true);
      setTimeout(() => setSendSuccessMsg(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <BellRing className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                سامانه هوشمند اطلاع‌رسانی پیامکی مواعد قانونی و ابلاغیه‌ها
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                متصل به سوییچ پیامک قضایی
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ارسال خودکار پیامک هشدار قبل از انقضای مهلت‌های قانونی (تجدیدنظر، واخواهی، کارشناسی) و وقت جلسات دادگاه
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-2xl text-xs text-slate-300">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>سرشماره رسمی: <strong className="font-mono text-amber-300">۹۸۱۰۰۰۲۲۴۴+</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SMS Log History */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              گزارش پیامک‌های ارسالی اخیر (لاگ‌های سرور):
            </h3>
            <span className="text-xs text-slate-400">{logs.length} پیامک ثبت شده</span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-md font-bold">
                      {log.type}
                    </span>
                    <span className="text-slate-300 font-medium">گیرنده: {log.recipientName}</span>
                    <span className="font-mono text-slate-400 text-[11px] dir-ltr">({log.recipientPhone})</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {log.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 font-sans">
                  {log.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Preferences & Test Dispatch */}
        <div className="lg:col-span-4 space-y-5">
          {/* Settings Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              تنظیمات هشدارهای خودکار:
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">ابلاغیه الکترونیک ثنا</div>
                  <div className="text-[10px] text-slate-400">ارسال فوری به محض ثبت در سامانه</div>
                </div>
                <button
                  onClick={() => setEnableSanaAlerts(!enableSanaAlerts)}
                  className="cursor-pointer text-amber-400"
                >
                  {enableSanaAlerts ? <ToggleRight className="w-7 h-7 text-emerald-400" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">یادآوری اوقات دادگاه</div>
                  <div className="text-[10px] text-slate-400">۴۸ ساعت و ۲ ساعت قبل از جلسه</div>
                </div>
                <button
                  onClick={() => setEnableCourtReminders(!enableCourtReminders)}
                  className="cursor-pointer text-amber-400"
                >
                  {enableCourtReminders ? <ToggleRight className="w-7 h-7 text-emerald-400" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">شمارش معکوس مواعد قانونی</div>
                  <div className="text-[10px] text-slate-400">هشدار ۱۰ روز و ۳ روز قبل از انقضا</div>
                </div>
                <button
                  onClick={() => setEnableDeadlineCountdown(!enableDeadlineCountdown)}
                  className="cursor-pointer text-amber-400"
                >
                  {enableDeadlineCountdown ? <ToggleRight className="w-7 h-7 text-emerald-400" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">تراکنش‌های مالی و تسویه</div>
                  <div className="text-[10px] text-slate-400">پیامک تایید پرداخت و شماره مرجع</div>
                </div>
                <button
                  onClick={() => setEnablePaymentAlerts(!enablePaymentAlerts)}
                  className="cursor-pointer text-amber-400"
                >
                  {enablePaymentAlerts ? <ToggleRight className="w-7 h-7 text-emerald-400" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test SMS Dispatcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              تست ارسال پیامک سیستمی:
            </h3>

            <form onSubmit={handleSendTestSMS} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">شماره موبایل گیرنده:</label>
                <input
                  type="text"
                  dir="ltr"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">قالب پیامک:</label>
                <select
                  value={testTemplate}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    setTestTemplate(t);
                    if (t === 'مهلت قانونی') {
                      setTestCustomText('هشدار مهلت قانونی: موکل گرامی، مهلت تجدیدنظرخواهی در پرونده شعبه ۱۰۵ ۵ روز دیگر به پایان می‌رسد.');
                    } else if (t === 'یادآوری دادگاه') {
                      setTestCustomText('یادآوری جلسه دادگاه: فردا ساعت ۱۰:۳۰ جلسه دادرسی شعبه ۱۰۵ دادگاه بهشتی برگزار خواهد شد. حضور با اصل مدارک الزامی است.');
                    } else {
                      setTestCustomText('ابلاغیه الکترونیکی جدید در سامانه عدل ایران صادر شد. جهت رویت به کارتابل دادگستر مراجعه فرمایید.');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="مهلت قانونی">هشدار انقضای مهلت قانونی (تجدیدنظرخواهی)</option>
                  <option value="یادآوری دادگاه">یادآوری وقت جلسه دادرسی</option>
                  <option value="ابلاغیه ثنا">صدور ابلاغیه جدید الکترونیک ثنا</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">متن پیامک ارسالی:</label>
                <textarea
                  rows={3}
                  value={testCustomText}
                  onChange={(e) => setTestCustomText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {sendSuccessMsg && (
                <div className="p-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs">
                  پیامک به سوییچ مخابرات تحویل و در لاگ ثبت شد.
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
                <span>{isSending ? 'در حال ارسال...' : 'ارسال فوری پیامک تست'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
