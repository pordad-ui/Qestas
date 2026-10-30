import React from 'react';
import {
  X,
  ShieldCheck,
  ChevronLeft,
  LogIn,
  Sliders,
  Lock,
} from 'lucide-react';
import { User as UserType } from '../types/legal';
import { DynamicMenuItem } from '../types/cms';
import { DynamicIcon } from './DynamicIcon';

interface MobileSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  menuItems: DynamicMenuItem[];
  onNavigate: (targetUrl: string) => void;
  onOpenAuth: () => void;
  unreadCount?: number;
  t: (key: string, fallback?: string) => string;
}

export const MobileSideDrawer: React.FC<MobileSideDrawerProps> = ({
  isOpen,
  onClose,
  user,
  menuItems = [],
  onNavigate,
  onOpenAuth,
  unreadCount = 2,
  t,
}) => {
  if (!isOpen) return null;

  const activeItems = menuItems
    .filter((m) => m.is_active)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container (Slides from right in RTL) */}
      <div className="relative w-80 max-w-[85vw] h-full bg-[#0F172A] border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl z-10 text-right animate-slide-left">
        {/* Drawer Header with Close Button */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-xs font-bold text-slate-300">
              {t('drawer_header_title', 'منوی کاربری دادگستر')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile Header */}
        <div className="p-5 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-transparent space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar || '/src/assets/images/client_profile_avatar_1793192628292.jpg'}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#F59E0B]/60 ring-offset-2 ring-offset-[#0F172A]"
              />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[#0F172A] border border-[#F59E0B] flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-[#F59E0B]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 shrink-0">
                  {user.role === 'client' ? 'موکل' : user.role === 'lawyer' ? 'وکیل' : 'ادمین'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5" dir="ltr">
                {user.phone}
              </p>
              <span className="text-[10px] text-teal-400 font-medium block mt-1">
                {t('header_sana_status', 'احراز هویت ثنا: تایید شده ✓')}
              </span>
            </div>
          </div>

          {/* Quick Login / Switch Account Action */}
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-[11px] font-medium text-amber-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t('drawer_auth_btn', 'ثبت‌نام و ورود / تغییر کاربر')}</span>
          </button>
        </div>

        {/* Dynamic Navigation List (CMS-controlled side_drawer items) */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2 text-xs">
          {activeItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onClose();
                onNavigate(item.target_url);
              }}
              className="w-full p-3 rounded-2xl bg-slate-900/40 hover:bg-slate-850/80 border border-slate-800/60 hover:border-amber-500/30 flex items-center justify-between text-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <DynamicIcon
                  name={item.icon_name}
                  style={item.icon_style}
                  colorTheme={item.color_theme}
                  className="w-4 h-4"
                />
                <div className="text-right">
                  <span className="font-semibold block text-slate-200 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge_text && (
                  <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                    {item.badge_text}
                  </span>
                )}
                <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:-translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>

        {/* Security & Encryption Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <Lock className="w-3 h-3 text-teal-400" />
            <span>{t('drawer_security_badge', 'رمزنگاری پایدار AES-256 و پروتکل TLS 1.3')}</span>
          </div>
          <p className="text-[9px] text-slate-500">
            {t('app_slogan', 'سامانه هوشمند وکالت و عدالت الکترونیک')} · نسخه ۴.۲
          </p>
        </div>
      </div>
    </div>
  );
};
