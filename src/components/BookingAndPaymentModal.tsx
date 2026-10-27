import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  Phone,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  Receipt,
  Printer,
  Smartphone,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Lawyer, ConsultationSession, PaymentTransaction } from '../types/legal';

interface BookingAndPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyer: Lawyer | null;
  initialServiceType?: string;
  onPaymentSuccess: (consultation: ConsultationSession, transaction: PaymentTransaction) => void;
  clientName: string;
  clientPhone: string;
}

export const BookingAndPaymentModal: React.FC<BookingAndPaymentModalProps> = ({
  isOpen,
  onClose,
  lawyer,
  initialServiceType = 'مشاوره تصویری ۴۵ دقیقه',
  onPaymentSuccess,
  clientName,
  clientPhone,
}) => {
  const [step, setStep] = useState<'service' | 'gateway' | 'success'>('service');
  const [selectedService, setSelectedService] = useState(initialServiceType);
  const [selectedDate, setSelectedDate] = useState('۱۴۰۳/۰۸/۲۲');
  const [selectedTime, setSelectedTime] = useState('۱۷:۳۰');
  const [caseSubject, setCaseSubject] = useState('');
  
  // Card Gateway state
  const [cardNumber, setCardNumber] = useState('۶۰۳۷-۹۹۱۸-۴۴۲۱-۸۹۲۰');
  const [cvv2, setCvv2] = useState('۴۲۸');
  const [expMonth, setExpMonth] = useState('۰۹');
  const [expYear, setExpYear] = useState('۰۶');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(120);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<{ rrn: string; refId: string; date: string } | null>(null);

  useEffect(() => {
    let interval: any;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  if (!isOpen || !lawyer) return null;

  const getServiceFee = (service: string): number => {
    switch (service) {
      case 'مشاوره تلفنی ۱۵ دقیقه':
        return lawyer.pricing.phone15min;
      case 'مشاوره تلفنی ۳۰ دقیقه':
        return lawyer.pricing.phone30min;
      case 'مشاوره تصویری ۴۵ دقیقه':
        return lawyer.pricing.videoConsultation;
      case 'مشاوره متنی ۲۴ ساعته':
        return lawyer.pricing.textConsultation;
      case 'تنظیم دادخواست یا شکواییه':
        return lawyer.pricing.draftPetition;
      default:
        return lawyer.pricing.videoConsultation;
    }
  };

  const currentFee = getServiceFee(selectedService);

  const availableDates = [
    { label: 'سه‌شنبه ۲۲ آبان', value: '۱۴۰۳/۰۸/۲۲' },
    { label: 'چهارشنبه ۲۳ آبان', value: '۱۴۰۳/۰۸/۲۳' },
    { label: 'شنبه ۲۶ آبان', value: '۱۴۰۳/۰۸/۲۶' },
    { label: 'یکشنبه ۲۷ آبان', value: '۱۴۰۳/۰۸/۲۷' },
  ];

  const availableSlots = ['۱۶:۰۰', '۱۷:۳۰', '۱۹:۰۰', '۲۰:۳۰'];

  const handleRequestOtp = () => {
    setOtpSent(true);
    setOtpTimer(120);
    setOtpCode('۴۹۸۲۱'); // Simulated OTP auto-fill for frictionless testing
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const rrn = String(Math.floor(100000000000 + Math.random() * 900000000000));
      const refId = `SHP-${Date.now()}`;
      const nowFa = new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR');

      const receipt = { rrn, refId, date: nowFa };
      setLastReceipt(receipt);

      const consultation: ConsultationSession = {
        id: `cons-${Date.now()}`,
        clientId: 'user-client-1',
        clientName: clientName || 'علی رضایی',
        clientPhone: clientPhone || '۰۹۱۲۳۴۵۶۷۸۹',
        lawyerId: lawyer.id,
        lawyerName: lawyer.name,
        type: selectedService.includes('تصویری')
          ? 'تصویری'
          : selectedService.includes('تلفنی')
          ? 'تلفنی'
          : selectedService.includes('دادخواست')
          ? 'تنظیم دادخواست'
          : 'متنی',
        durationMinutes: selectedService.includes('۱۵') ? 15 : selectedService.includes('۳۰') ? 30 : 45,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        fee: currentFee,
        status: 'تایید شده',
        meetingRoomId: `ROOM-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: caseSubject || 'مشاوره پیرامون پرونده حقوقی',
      };

      const transaction: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        transactionRef: refId,
        rrn,
        payerName: clientName || 'علی رضایی',
        receiverName: lawyer.name,
        amount: currentFee,
        serviceTitle: selectedService,
        date: nowFa,
        status: 'موفق',
        gateway: 'به‌پرداخت ملت',
        cardNumberMasked: cardNumber.slice(0, 7) + '**-****-' + cardNumber.slice(-4),
      };

      onPaymentSuccess(consultation, transaction);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {step === 'service' && `رزرو نوبت مشاوره با ${lawyer.name}`}
                {step === 'gateway' && 'درگاه امن پرداخت الکترونیک شاپرک (شتاب)'}
                {step === 'success' && 'رسید تایید و پرداخت مشاوره'}
              </h2>
              <p className="text-xs text-slate-400">
                {step === 'service' && lawyer.title}
                {step === 'gateway' && 'اتصال رمزنگاری‌شده ۲۵۶ بیتی به سوییچ پرداخت ملی'}
                {step === 'success' && 'نوبت شما با موفقیت ثبت و پیامک تایید ارسال شد'}
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

        {/* Step 1: Select Service & Time */}
        {step === 'service' && (
          <div className="p-6 space-y-5">
            {/* Service Options */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">انتخاب نوع خدمت حقوقی:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'مشاوره تصویری ۴۵ دقیقه',
                    title: 'مشاوره تصویری امن (۴۵ د)',
                    desc: 'اتاق اختصاصی رمزنگاری‌شده',
                    icon: Video,
                    fee: lawyer.pricing.videoConsultation,
                  },
                  {
                    id: 'مشاوره تلفنی ۳۰ دقیقه',
                    title: 'مشاوره تلفنی (۳۰ د)',
                    desc: 'مکالمه امن تلفنی با وکیل',
                    icon: Phone,
                    fee: lawyer.pricing.phone30min,
                  },
                  {
                    id: 'مشاوره تلفنی ۱۵ دقیقه',
                    title: 'مشاوره تلفنی فوری (۱۵ د)',
                    desc: 'پاسخ به سوالات اضطراری',
                    icon: Phone,
                    fee: lawyer.pricing.phone15min,
                  },
                  {
                    id: 'تنظیم دادخواست یا شکواییه',
                    title: 'تنظیم اوراق قضایی',
                    desc: 'لایحه، دادخواست یا اظهارنامه',
                    icon: FileText,
                    fee: lawyer.pricing.draftPetition,
                  },
                ].map((s) => {
                  const Icon = s.icon;
                  const isSelected = selectedService === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s.id)}
                      className={`p-3.5 rounded-2xl text-right transition-all border flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">{s.title}</div>
                          <div className="text-[10px] text-slate-400">{s.desc}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-amber-400">
                        {s.fee.toLocaleString('fa-IR')} ت
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date and Time Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>انتخاب تاریخ جلسه:</span>
                </label>
                <div className="space-y-1.5">
                  {availableDates.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
                      className={`w-full p-2.5 rounded-xl text-xs text-right border transition-all cursor-pointer ${
                        selectedDate === d.value
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ساعت پیشنهادی:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2.5 rounded-xl text-xs text-center border font-semibold transition-all cursor-pointer ${
                        selectedTime === slot
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      ساعت {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Case Subject */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                موضوع و خلاصه پرونده جهت مطالعه پیش از جلسه توسط وکیل:
              </label>
              <textarea
                rows={2}
                value={caseSubject}
                onChange={(e) => setCaseSubject(e.target.value)}
                placeholder="مثلاً: مطالبه وجه چک برگشتی و الزام خوانده به خسارت تاخیر..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Price Summary & Pay Button */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>مبلغ حق‌المشاوره رسمی:</span>
                <span>{currentFee.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>کارمزد سوییچ امن شاپرک و ضمانت بازگشت وجه:</span>
                <span className="text-emerald-400 font-medium">رایگان (تحت پوشش پلتفرم)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-sm text-amber-300">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-base font-black">{currentFee.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>

            <button
              onClick={() => setStep('gateway')}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>انتقال به درگاه امن شاپرک و نهایی‌سازی</span>
            </button>
          </div>
        )}

        {/* Step 2: Simulated Shaparak Payment Gateway */}
        {step === 'gateway' && (
          <div className="p-6 space-y-5">
            {/* Shaparak Branded Banner */}
            <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">شبکه الکترونیکی پرداخت کارت (شاپرک)</div>
                  <div className="text-[10px] text-slate-400">پذیرنده: سامانه جامع حقوقی و وکالت دادگستر</div>
                </div>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">مبلغ تراکنش:</span>
                <span className="text-sm font-black text-emerald-400">{currentFee.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>

            {/* Card Inputs */}
            <div className="space-y-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl p-5">
              {/* Card Number */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">شماره کارت ۱۶ رقمی شتاب:</label>
                <input
                  type="text"
                  dir="ltr"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-center font-mono text-sm tracking-wider text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* CVV2 and Exp Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">کد شناسایی دوم (CVV2):</label>
                  <input
                    type="password"
                    dir="ltr"
                    maxLength={4}
                    value={cvv2}
                    onChange={(e) => setCvv2(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-center font-mono text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">تاریخ انقضا (ماه / سال):</label>
                  <div className="flex items-center gap-1" dir="ltr">
                    <input
                      type="text"
                      maxLength={2}
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value)}
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-center font-mono text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-slate-500">/</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value)}
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-center font-mono text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* OTP Code */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">رمز پویا (یک‌بار مصرف پیامکی):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="کد پیامک شده"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-center font-mono text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {otpSent ? `ارسال مجدد (${otpTimer} ثانیه)` : 'دریافت رمز پویا'}
                  </button>
                </div>
                {otpSent && (
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>رمز پویا پیامک و به صورت خودکار درج شد.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gateway Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('service')}
                className="w-1/3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                انصراف و بازگشت
              </button>

              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-2/3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>در حال تایید با سوییچ بانکی...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-950" />
                    <span>پرداخت {currentFee.toLocaleString('fa-IR')} تومان</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Receipt */}
        {step === 'success' && lastReceipt && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">پرداخت و ثبت نوبت با موفقیت انجام شد</h3>
              <p className="text-xs text-slate-400 mt-1">
                اطلاعات جلسه و لینک اختصاصی اتاق مشاوره به شماره همراه شما پیامک شد.
              </p>
            </div>

            {/* Printable Digital Receipt */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-right space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">شماره مرجع بانکی (RRN):</span>
                <span className="text-amber-400 font-bold">{lastReceipt.rrn}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">کد پیگیری شاپرک:</span>
                <span className="text-slate-200">{lastReceipt.refId}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">وکیل مشاور:</span>
                <span className="text-slate-100 font-bold font-sans">{lawyer.name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">نوع خدمت:</span>
                <span className="text-slate-100 font-sans">{selectedService}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">زمان جلسه:</span>
                <span className="text-cyan-400 font-bold font-sans">
                  {selectedDate} - ساعت {selectedTime}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 font-sans">مبلغ پرداختی:</span>
                <span className="text-emerald-400 font-bold font-sans text-sm">
                  {currentFee.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                مشاهده در میز کار و نوبت‌ها
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
