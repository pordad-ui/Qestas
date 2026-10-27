import React, { useState } from 'react';
import {
  Scale,
  Brain,
  Users,
  Briefcase,
  Video,
  Calendar,
  FolderLock,
  HelpCircle,
  BellRing,
  Wallet,
  ShieldCheck,
  Edit3,
  Server,
  UserCheck,
  LogOut,
  ChevronDown,
  Sliders,
  ExternalLink,
  BookOpen,
  Phone,
} from 'lucide-react';
import { User, UserRole, MenuItem, DynamicPage, CMSContent } from '../types/legal';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (userId: string) => void;
  allUsers: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCMS: () => void;
  onOpenArchitecture: () => void;
  onOpenTriage: () => void;
  smsCount: number;

  // Dynamic Navigation & Pages
  menus: MenuItem[];
  pages: DynamicPage[];
  onSelectPage: (page: DynamicPage) => void;
  cms?: CMSContent;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  allUsers,
  activeTab,
  setActiveTab,
  onOpenCMS,
  onOpenArchitecture,
  onOpenTriage,
  smsCount,
  menus,
  pages,
  onSelectPage,
  cms,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'client':
        return (
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            موکل
          </span>
        );
      case 'lawyer':
        return (
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
            وکیل پایه یک
          </span>
        );
      case 'admin':
        return (
          <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
            مدیر سیستم (SuperAdmin)
          </span>
        );
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'داشبورد من', icon: Briefcase },
    { id: 'lawyers', label: 'بانک وکلا', icon: Users },
    { id: 'cases', label: 'پیگیری پرونده', icon: Scale },
    { id: 'consultations', label: 'مشاوره و چت رمزنگاری', icon: Video },
    { id: 'calendar', label: 'تقویم دادگاه', icon: Calendar },
    { id: 'documents', label: 'گاوصندوق اسناد', icon: FolderLock },
    { id: 'qna', label: 'پرسش و پاسخ حقوقی', icon: HelpCircle },
    { id: 'sms', label: 'پیامک‌ها و مواعد', icon: BellRing, badge: smsCount },
  ];

  if (currentUser.role === 'lawyer') {
    navItems.splice(2, 0, { id: 'financial', label: 'داشبورد مالی و تسویه', icon: Wallet });
  }

  if (currentUser.role === 'admin') {
    navItems.push({
      id: 'master-admin',
      label: 'مدیریت جامع دادگستر',
      icon: Sliders,
    });
  }

  // Handle click on dynamic menu/submenu item
  const handleMenuTargetClick = (target: string) => {
    setOpenSubmenuId(null);
    if (target.startsWith('page:')) {
      const slug = target.replace('page:', '');
      const foundPage = pages.find((p) => p.slug === slug);
      if (foundPage) {
        onSelectPage(foundPage);
        return;
      }
    }

    if (target === 'triage-modal') {
      onOpenTriage();
      return;
    }

    // Default internal tab navigation
    setActiveTab(target);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top utility bar */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{cms?.announcementTicker || 'سامانه دادگستر مجهز به احراز هویت ثنا، نظارت کانون وکلا و تسویه امن شاپرک'}</span>
            </span>

            {/* Dynamic Custom Top Header Links */}
            {cms?.customLinks?.filter(l => l.isActive && l.category === 'header-top').map(link => (
              <a
                key={link.id}
                href={link.urlOrTarget}
                target={link.isExternal ? '_blank' : undefined}
                rel={link.isExternal ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (!link.isExternal && link.urlOrTarget.startsWith('#')) {
                    e.preventDefault();
                    const target = link.urlOrTarget.replace('#', '');
                    if (target === 'triage') onOpenTriage();
                    else setActiveTab(target);
                  } else if (!link.isExternal && link.urlOrTarget.startsWith('page:')) {
                    e.preventDefault();
                    const slug = link.urlOrTarget.replace('page:', '');
                    const foundP = pages.find(p => p.slug === slug);
                    if (foundP) onSelectPage(foundP);
                  }
                }}
                className="hidden lg:inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <span>{link.title}</span>
                {link.badge && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {cms?.contactEmergencyPhone && (
              <a
                href={`tel:${cms.contactEmergencyPhone.replace(/[^0-9]/g, '')}`}
                className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-amber-300 text-[11px] transition-colors"
                title={cms.contactEmergencyLabel || 'پشتیبانی فوری'}
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{cms.contactEmergencyLabel || 'پشتیبانی'}: {cms.contactEmergencyPhone}</span>
              </a>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('master-admin')}
                className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full transition-all cursor-pointer font-bold shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>کنسول مدیریت جامع (Master Admin)</span>
              </button>
            )}

            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="مشاهده معماری امنیتی جنگو و دیتابیس پستگرس"
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>معماری Django + Postgres</span>
            </button>

            <button
              onClick={onOpenCMS}
              className="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              title="ویرایش آنلاین محتوای سایت"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>CMS اختصاصی</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/60 px-2.5 py-0.5 rounded-full">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">کیف پول:</span>
              <span className="font-semibold text-emerald-400">
                {currentUser.walletBalance.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActiveTab('dashboard')}
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black bg-gradient-to-l from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                    {cms?.brandName || 'دادگستر'}
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/40">
                    وکالت برخط
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{cms?.brandTagline || 'سامانه جامع هوشمند حقوقی و وکالت برخط'}</p>
              </div>
            </div>

            {/* AI Triage Highlight Button */}
            <button
              onClick={onOpenTriage}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer mr-2"
            >
              <Brain className="w-4 h-4 animate-pulse text-slate-950" />
              <span>تریاژ هوشمند پرونده با AI</span>
              <span className="bg-slate-950/20 text-[10px] px-1.5 py-0.5 rounded text-slate-950 font-black">
                جدید
              </span>
            </button>
          </div>

          {/* Quick Persona Switcher / Current User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-amber-500/50"
              />
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-200">{currentUser.name}</span>
                  {getRoleBadge(currentUser.role)}
                </div>
                <span className="text-[10px] text-slate-400 block">{currentUser.phone}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
            </button>

            {/* Dropdown Menu for Persona Switching */}
            {showUserMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800 text-xs font-semibold text-slate-400">
                  تغییر نقش کاربری جهت تست و ارزیابی سیستم:
                </div>
                <div className="space-y-1 my-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-right text-xs transition-colors cursor-pointer ${
                        user.id === currentUser.id
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-[10px] text-slate-400">{user.email}</div>
                        </div>
                      </div>
                      {getRoleBadge(user.role)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Menus & Submenus Row (Constructed via Admin Menu Builder) */}
        {menus.filter((m) => m.isActive).length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-3 text-xs overflow-x-visible">
            <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 shrink-0">
              <BookOpen className="w-3 h-3 text-amber-400" />
              منوهای ناوبری سامانه:
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {menus
                .filter((m) => m.isActive)
                .map((menu) => {
                  const hasSubmenus = menu.submenus && menu.submenus.filter((s) => s.isActive).length > 0;
                  const isDropdownOpen = openSubmenuId === menu.id;

                  return (
                    <div key={menu.id} className="relative group">
                      <button
                        onClick={() => {
                          if (hasSubmenus) {
                            setOpenSubmenuId(isDropdownOpen ? null : menu.id);
                          } else {
                            handleMenuTargetClick(menu.targetTabOrSlug);
                          }
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                          isDropdownOpen
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span>{menu.title}</span>
                        {hasSubmenus && <ChevronDown className="w-3 h-3 text-slate-400" />}
                      </button>

                      {/* Dropdown for Submenus */}
                      {hasSubmenus && isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50">
                          {menu.submenus!
                            .filter((s) => s.isActive)
                            .map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => handleMenuTargetClick(sub.targetTabOrSlug)}
                                className="w-full text-right p-2 rounded-lg text-[11px] text-slate-200 hover:bg-slate-800 hover:text-amber-300 transition-colors flex items-center justify-between cursor-pointer"
                              >
                                <span>{sub.title}</span>
                                {sub.targetTabOrSlug.startsWith('page:') && (
                                  <ExternalLink className="w-3 h-3 text-slate-500" />
                                )}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Bottom Core Tab Buttons */}
        <nav className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 no-scrollbar text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? item.id === 'master-admin'
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                      : 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? item.id === 'master-admin'
                        ? 'text-white'
                        : 'text-slate-950'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
