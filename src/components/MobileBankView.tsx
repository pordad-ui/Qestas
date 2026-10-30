import React, { useState } from 'react';
import { PaymentTransaction, User } from '../types/legal';
import { Landmark, ArrowUpRight, ArrowDownLeft, Wallet, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

interface MobileBankViewProps {
  user: User;
  transactions: PaymentTransaction[];
  onChargeWallet: (amount: number) => void;
}

export const MobileBankView: React.FC<MobileBankViewProps> = ({
  user,
  transactions,
  onChargeWallet,
}) => {
  const [chargeAmount, setChargeAmount] = useState('۵۰۰,۰۰۰');

  return (
    <div className="space-y-4 text-right">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">کیف پول و امور مالی</h2>
          <span className="text-[11px] text-slate-400">حساب امانی شاپرک سامانه دادگستر</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[#F59E0B]">
          <Landmark className="w-4 h-4" />
        </div>
      </div>

      {/* Luxury Gold/Navy Balance Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-[#101b33] to-[#0B1120] border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-[#F59E0B]" />
            موجودی قابل برداشت
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            تضمین شتاب شاپرک
          </span>
        </div>

        <div>
          <div className="text-2xl font-black text-slate-100 tabular-nums font-mono">
            {(user.walletBalance || 4200000).toLocaleString('fa-IR')}
            <span className="text-xs font-normal text-amber-400 mr-1.5">تومان</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">شماره شبا متصل: IR720170000000098765432101</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={() => onChargeWallet(1000000)}
            className="py-2.5 px-3 rounded-xl bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 text-xs font-bold transition-all shadow-md shadow-[#F59E0B]/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>افزایش موجودی</span>
          </button>
          <button
            onClick={() => alert('درخواست تسویه پایا به شماره شبا بانک ملی شما با موفقیت ثبت گردید.')}
            className="py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            <span>تسویه به حساب</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200">تراکنش‌های اخیر</h3>
          <span className="text-[10px] text-slate-500">شاپرک / زرین‌پال</span>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 6).map((tx) => (
            <div
              key={tx.id}
              className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                  <CreditCard className="w-3.5 h-3.5 text-[#F59E0B]" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-200 truncate max-w-[170px]">
                    {tx.serviceTitle}
                  </h4>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {tx.date.split(' - ')[0]} · کد پیگیری {tx.transactionRef.slice(-6)}
                  </span>
                </div>
              </div>

              <div className="text-left">
                <span className="text-xs font-bold text-slate-100 font-mono tabular-nums block">
                  {tx.amount.toLocaleString('fa-IR')}
                </span>
                <span className="text-[9px] text-slate-400">تومان</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
