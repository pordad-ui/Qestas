import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Building,
  CheckCircle2,
  Clock,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { PaymentTransaction, Lawyer } from '../types/legal';

interface LawyerFinancialDashboardProps {
  lawyer: Lawyer;
  transactions: PaymentTransaction[];
  onWithdrawRequest: (amount: number, sheba: string) => void;
}

export const LawyerFinancialDashboard: React.FC<LawyerFinancialDashboardProps> = ({
  lawyer,
  transactions,
  onWithdrawRequest,
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('۵۰۰۰۰۰۰');
  const [settlementSuccess, setSettlementSuccess] = useState(false);

  // Financial Stats calculation
  const totalEarned = transactions
    .filter((t) => t.status === 'موفق')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const withdrawableBalance = Math.max(0, totalEarned - 15200000); // remaining balance
  const platformFee = Math.round(totalEarned * 0.08); // 8% platform fee

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(withdrawAmount.replace(/[^\d]/g, ''));
    if (!numeric || numeric < 500000) return;

    onWithdrawRequest(numeric, lawyer.shebaNumber);
    setSettlementSuccess(true);
    setTimeout(() => {
      setSettlementSuccess(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              داشبورد جامع مدیریت مالی، درآمد و تسویه حساب وکلا
            </h2>
            <p className="text-xs text-slate-400">
              مدیریت واریزی‌های حق‌المشاوره، گزارش‌گیری آماری و انتقال وجه به شماره شبا رسمی
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>درخواست تسویه حساب به شماره شبا</span>
        </button>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>درآمد کل واریزی (ناخالص):</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {totalEarned.toLocaleString('fa-IR')}
            <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span>+۲۴٪ نسبت به ماه گذشته</span>
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>موجودی آماده تسویه:</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {withdrawableBalance.toLocaleString('fa-IR')}
            <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
          </div>
          <span className="text-[11px] text-slate-400">واریز از طریق پایا ظرف ۱۲ ساعت</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>تعداد جلسات مشاوره:</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400">
            {transactions.length + 8}
            <span className="text-xs font-normal text-slate-400 mr-1.5">جلسه</span>
          </div>
          <span className="text-[11px] text-slate-400">میانگین امتیاز ۴.۹۵ از ۵</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>کارمزد پلتفرم و مالیات:</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-300">
            {platformFee.toLocaleString('fa-IR')}
            <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
          </div>
          <span className="text-[11px] text-slate-400">نرخ کارمزد ۸٪ توافقی کانون وکلا</span>
        </div>
      </div>

      {/* Visual Chart Simulation & Sheba Bank Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Bars */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>نمودار رشد درآمد ماهانه وکلای پایه یک (۱۴۰۳):</span>
            </h3>
            <span className="text-xs text-slate-400">بر حسب میلیون تومان</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-4 pt-6 px-2">
            {[
              { month: 'اردیبهشت', amount: 8.5, height: '40%' },
              { month: 'خرداد', amount: 11.2, height: '52%' },
              { month: 'تیر', amount: 14.0, height: '65%' },
              { month: 'مرداد', amount: 12.8, height: '60%' },
              { month: 'شهریور', amount: 16.4, height: '78%' },
              { month: 'مهر', amount: 18.2, height: '88%' },
              { month: 'آبان (جاری)', amount: 21.0, height: '100%', isCurrent: true },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-400 transition-colors">
                  {bar.amount}م
                </span>
                <div
                  className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 ${
                    bar.isCurrent
                      ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-800 group-hover:bg-slate-700'
                  }`}
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] text-slate-400 text-center whitespace-nowrap">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank & Sheba Registered Info */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>مشخصات حساب بانکی و شبا تایید شده:</span>
            </h3>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 block">بانک مقصد:</span>
                <span className="text-xs font-bold text-slate-100">بانک ملت - شعبه مرکزی</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">نام صاحب حساب:</span>
                <span className="text-xs font-bold text-slate-100">{lawyer.name}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">شماره شبا (تایید شده توسط ادمین):</span>
                <span className="text-xs font-mono text-amber-300 font-bold block mt-1" dir="ltr">
                  {lawyer.shebaNumber}
                </span>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-4 h-4" />
                <span>حساب بانکی تایید شده و فعال در شاپرک</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
          >
            تغییر شماره شبا یا درخواست تسویه
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            ریز تراکنش‌ها و دریافتی‌های حق‌المشاوره:
          </h3>
          <button
            onClick={() => alert('دانلود فایل اکسل گزارش مالی و فیش‌های مالیاتی')}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:underline cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>خروجی اکسل / PDF گزارش مالی</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-3">کد پیگیری شاپرک</th>
                <th className="py-3 px-3">شرح خدمت</th>
                <th className="py-3 px-3">پرداخت‌کننده</th>
                <th className="py-3 px-3">مبلغ (تومان)</th>
                <th className="py-3 px-3">تاریخ و زمان</th>
                <th className="py-3 px-3">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-cyan-400">{tx.transactionRef}</td>
                  <td className="py-3 px-3 font-semibold">{tx.serviceTitle}</td>
                  <td className="py-3 px-3">{tx.payerName}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    {tx.amount.toLocaleString('fa-IR')}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{tx.date}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sheba Settlement Request Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              <span>درخواست تسویه حساب به شماره شبا رسمی</span>
            </h3>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">مبلغ درخواستی تسویه (تومان):</label>
                <input
                  type="text"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-bold text-sm focus:outline-none focus:border-amber-500 text-center"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                <div className="text-slate-400">واریز به شماره شبا ثبت شده وکیل:</div>
                <div className="font-mono text-amber-300 font-bold" dir="ltr">
                  {lawyer.shebaNumber}
                </div>
                <div className="text-slate-500 text-[10px]">
                  تسویه از طریق حواله پایا بانک مرکزی در اولین سیکل اداری انجام می‌پذیرد.
                </div>
              </div>

              {settlementSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center text-xs">
                  درخواست تسویه با موفقیت ثبت شد و به حسابداری مالی ارسال گردید.
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  تایید و ارسال درخواست تسویه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
