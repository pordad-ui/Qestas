import React from 'react';
import { User } from '../types/legal';
import { ShieldCheck, PhoneCall, Key, Users, Settings, LogOut, ChevronLeft, Award, FileCheck, LogIn, ExternalLink, Scale } from 'lucide-react';

interface MobileProfileViewProps {
  user: User;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
  onOpenArchitecture: () => void;
  onOpenCMS: () => void;
  onOpenAuth: () => void;
}

export const MobileProfileView: React.FC<MobileProfileViewProps> = ({
  user,
  allUsers,
  onSwitchUser,
  onOpenArchitecture,
  onOpenCMS,
  onOpenAuth,
}) => {
  return (
    <div className="space-y-4 text-right">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">پروفایل و احراز هویت</h2>
          <span className="text-[11px] text-slate-400">حساب کاربری و اتصال به سامانه ثنا</span>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-3 py-1.5 rounded-xl bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 text-xs font-bold transition-all shadow-md shadow-[#F59E0B]/20 flex items-center gap-1.5 cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>ورود / ثبت‌نام</span>
        </button>
      </div>

      {/* User Hero Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-[#0B1120] border border-slate-800 shadow-xl flex items-center gap-4">
        <div className="relative">
          <img
            src={user.avatar || '/src/assets/images/client_profile_avatar_1793192628292.jpg'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#F59E0B]/50 ring-offset-2 ring-offset-[#0B1120]"
          />
          <div className="absolute -bottom-1 -left-1 p-1 rounded-full bg-[#0B1120] border border-[#F59E0B]/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100">{user.name}</h3>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
              {user.role === 'client' ? 'موکل احراز شده' : user.role === 'lawyer' ? 'وکیل پایه یک' : 'مدیر سامانه'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">{user.phone}</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <FileCheck className="w-3 h-3" />
            احراز هویت رسمی ثنا تایید شده
          </p>
        </div>
      </div>

      {/* Primary Auth Action Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-[#F59E0B]/30 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-100 mb-0.5">عضویت یا ورود به عنوان وکیل / موکل</h4>
          <p className="text-[10px] text-slate-400">ثبت‌نام آنلاین با شماره موبایل و استعلام ثنا</p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 text-xs font-bold transition-all shadow-md shadow-[#F59E0B]/20 cursor-pointer flex items-center gap-1.5"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>ورود / ثبت‌نام</span>
        </button>
      </div>

      {/* Persona Switcher Section (Test Roles) */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
        <span className="text-xs font-bold text-slate-200 block">تغییر سریع کاربر فعال (جهت بررسی دسترسی‌ها):</span>
        <div className="grid grid-cols-3 gap-2">
          {allUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => onSwitchUser(u.id)}
              className={`py-2 px-2 rounded-xl text-[11px] font-medium transition-all truncate border ${
                u.id === user.id
                  ? 'bg-[#F59E0B] text-slate-950 font-bold border-[#F59E0B] shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700'
              }`}
            >
              {u.name.split(' ')[0]} ({u.role === 'client' ? 'موکل' : u.role === 'lawyer' ? 'وکیل' : 'ادمین'})
            </button>
          ))}
        </div>
      </div>

      {/* Menu Action List */}
      <div className="space-y-2 pt-1">
        <div 
          onClick={onOpenArchitecture}
          className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">معماری امنیتی و سرور (Django + PostgreSQL)</h4>
              <span className="text-[10px] text-slate-500">مشاهده مدل‌ها، لاجیک تایید و مسیرهای API</span>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </div>

        <div 
          onClick={onOpenCMS}
          className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[#F59E0B]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">مدیریت محتوا و منوهای اپ (CMS)</h4>
              <span className="text-[10px] text-slate-500">پیکربندی عناوین و مخفی‌سازی بخش‌ها</span>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">خط ویژه اورژانس حقوقی</h4>
              <span className="text-[10px] text-slate-500">۰۲۱-۸۸۳۲۰۰۱۱ (پاسخگویی شبانه‌روزی)</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            ۲۴/۷
          </span>
        </div>
      </div>

      {/* Valid External Judicial Links */}
      <div className="pt-2 border-t border-slate-800/60 space-y-2">
        <span className="text-[11px] font-bold text-slate-300 block">لینک‌های معتبر و رسمی قوه قضاییه:</span>
        <div className="grid grid-cols-2 gap-2">
          <a
            href="https://sana.adliran.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-xs text-slate-200 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-right">
                <span className="font-semibold block truncate">سامانه ثنا</span>
                <span className="text-[10px] text-slate-500">احراز هویت الکترونیک</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
          </a>

          <a
            href="https://adliran.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-xs text-slate-200 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Scale className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <div className="text-right">
                <span className="font-semibold block truncate">درگاه عدل‌ایران</span>
                <span className="text-[10px] text-slate-500">پیگیری رسمی دادگاه</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#F59E0B] shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
