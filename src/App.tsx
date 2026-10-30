import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Home,
  Briefcase,
  Landmark,
  User,
  Gavel,
  Check,
  Calendar,
  Sparkles,
  Phone,
  FileText,
  CreditCard,
  Sliders,
  LogIn,
  ChevronLeft,
  Lock,
  BookOpen,
} from 'lucide-react';

import { MobileStatusBar } from './components/MobileStatusBar';
import { MobileSideDrawer } from './components/MobileSideDrawer';
import { MobileAnnouncementBanner } from './components/MobileAnnouncementBanner';
import { MobileServicesGrid, AppFeatureItem, DEFAULT_APP_FEATURES } from './components/MobileServicesGrid';
import { MobileCaseDetailsSheet } from './components/MobileCaseDetailsSheet';
import { MobileAblaghiehSheet } from './components/MobileAblaghiehSheet';
import { MobileFilesView } from './components/MobileFilesView';
import { MobileBankView } from './components/MobileBankView';
import { MobileProfileView } from './components/MobileProfileView';
import { LegalScalesLogo } from './components/LegalScalesLogo';
import { AdminCMSModal } from './components/AdminCMSModal';
import { EncryptedChatAndVideo } from './components/EncryptedChatAndVideo';

// Existing functional modals
import { AuthModal } from './components/AuthModal';
import { AITriageModal } from './components/AITriageModal';
import { LawyerDirectory } from './components/LawyerDirectory';
import { LawyerProfileModal } from './components/LawyerProfileModal';
import { BookingAndPaymentModal } from './components/BookingAndPaymentModal';
import { DocumentVaultView } from './components/DocumentVaultView';
import { SmartCalendarView } from './components/SmartCalendarView';
import { LegalQnAView } from './components/LegalQnAView';
import { ArchitectureModal } from './components/ArchitectureModal';

import {
  INITIAL_USERS,
  INITIAL_LAWYERS,
  INITIAL_CASES,
  INITIAL_DOCUMENTS,
  INITIAL_CONSULTATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_QNA,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_SMS_LOGS,
} from './data/mockData';

import {
  User as UserType,
  Lawyer,
  LegalCase,
  CaseDocument,
  ConsultationSession,
  PaymentTransaction,
  LegalQnAItem,
  CalendarEvent,
  SMSNotificationLog,
} from './types/legal';

export default function App() {
  // Global Data State
  const [allUsers, setAllUsers] = useState<UserType[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserType>(INITIAL_USERS[0]);
  const [lawyers, setLawyers] = useState<Lawyer[]>(INITIAL_LAWYERS);
  const [cases, setCases] = useState<LegalCase[]>(INITIAL_CASES);
  const [documents, setDocuments] = useState<CaseDocument[]>(INITIAL_DOCUMENTS);
  const [consultations, setConsultations] = useState<ConsultationSession[]>(INITIAL_CONSULTATIONS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [smsLogs, setSmsLogs] = useState<SMSNotificationLog[]>(INITIAL_SMS_LOGS);
  const [qnaList, setQnaList] = useState<LegalQnAItem[]>(INITIAL_QNA);

  // AppFeature CMS State (Soft Delete / Hide Toggle)
  const [appFeatures, setAppFeatures] = useState<AppFeatureItem[]>(() => {
    try {
      const saved = localStorage.getItem('dadgostar_app_features_v3');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_APP_FEATURES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dadgostar_app_features_v3', JSON.stringify(appFeatures));
    } catch {}
  }, [appFeatures]);

  // Active Bottom Navigation Tab: 'home' | 'cases' | 'wallet' | 'profile'
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'cases' | 'wallet' | 'profile'>('home');

  // Drawer & Modal States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminCMSOpen, setIsAdminCMSOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCaseDetailsOpen, setIsCaseDetailsOpen] = useState(false);
  const [isAblaghiehOpen, setIsAblaghiehOpen] = useState(false);
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [isLawyersDirectoryOpen, setIsLawyersDirectoryOpen] = useState(false);
  const [isDocumentsVaultOpen, setIsDocumentsVaultOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isQnAOpen, setIsQnAOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isEncryptedConsultationOpen, setIsEncryptedConsultationOpen] = useState(false);
  const [selectedLawyerForProfile, setSelectedLawyerForProfile] = useState<Lawyer | null>(null);
  const [selectedLawyerForBooking, setSelectedLawyerForBooking] = useState<Lawyer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSubMenuPill, setActiveSubMenuPill] = useState<string>('همه');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Current Featured Case
  const currentCase = cases[0];
  const assignedLawyer = lawyers.find((l) => l.id === currentCase?.lawyerId) || lawyers[0];

  // Lawyer Approval Handler (Admin CMS)
  const handleApproveLawyer = (lawyerId: string) => {
    setLawyers((prev) =>
      prev.map((l) =>
        l.id === lawyerId ? { ...l, isVerified: true, verificationStatus: 'approved' } : l
      )
    );
    showToast('پروانه وکالت با موفقیت تایید گردید و دسترسی وکیل به سامانه فعال شد.');
  };

  // Lawyer Rejection Handler (Admin CMS with reason)
  const handleRejectLawyer = (lawyerId: string, reason: string) => {
    setLawyers((prev) =>
      prev.map((l) =>
        l.id === lawyerId
          ? { ...l, isVerified: false, verificationStatus: 'rejected', rejection_reason: reason }
          : l
      )
    );
    const newSMS: SMSNotificationLog = {
      id: `sms-${Date.now()}`,
      recipientPhone: '۰۹۱۲۳۴۵۶۷۸۹',
      recipientName: 'وکیل متقاضی',
      recipientRole: 'lawyer',
      type: 'مهلت قانونی',
      message: `همکار گرامی، مدارک پروانه وکالت شما به دلیل زیر تایید نگردید: ${reason}. لطفاً جهت ویرایش اقدام فرمایید.`,
      timestamp: new Date().toLocaleDateString('fa-IR'),
      status: 'تحویل داده شده',
    };
    setSmsLogs((prev) => [newSMS, ...prev]);
    showToast('رد مدارک وکیل در سیستم ثبت و پیامک با ذکر دلیل به ایشان ارسال شد.');
  };

  // Toggle Feature Visibility (Soft Delete / Hide)
  const handleToggleFeatureVisibility = (featureId: string) => {
    setAppFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, is_hidden: !f.is_hidden } : f))
    );
    showToast('وضعیت انتشار بخش در اپلیکیشن بروزرسانی شد.');
  };

  // Update Feature Title
  const handleUpdateFeatureTitle = (featureId: string, newTitle: string) => {
    setAppFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, title: newTitle } : f))
    );
    showToast('عنوان خدمت بروزرسانی شد.');
  };

  // Grid Service Selection
  const handleSelectService = (slug: string) => {
    switch (slug) {
      case 'case-tracking':
        setIsCaseDetailsOpen(true);
        break;
      case 'lawyer-bank':
        setIsLawyersDirectoryOpen(true);
        break;
      case 'legal-services':
        setIsTriageOpen(true);
        break;
      case 'law-database':
        setIsQnAOpen(true);
        break;
      case 'online-consultation':
        setIsEncryptedConsultationOpen(true);
        break;
      case 'drafting':
        setIsDocumentsVaultOpen(true);
        break;
      default:
        setIsTriageOpen(true);
    }
  };

  // Payment Handler
  const handlePaymentSuccess = (consultation: ConsultationSession, transaction: PaymentTransaction) => {
    setConsultations((prev) => [consultation, ...prev]);
    setTransactions((prev) => [transaction, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - transaction.amount),
    }));
    showToast('حق‌المشاوره با موفقیت پرداخت و جلسه ثبت گردید.');
  };

  // Charge Wallet
  const handleChargeWallet = (amount: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: (prev.walletBalance || 0) + amount,
    }));
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      transactionRef: `SHAPARAK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      rrn: String(Math.floor(100000000000 + Math.random() * 900000000000)),
      payerName: currentUser.name,
      receiverName: 'کیف پول کاربری دادگستر',
      amount,
      serviceTitle: 'افزایش اعتبار آنلاین از درگاه شاپرک',
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'موفق',
      gateway: 'زرین‌پال شاپرک',
      cardNumberMasked: '۵۰۲۲-۲۹**-****-۶۱۷۴',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`مبلغ ${amount.toLocaleString('fa-IR')} تومان به کیف پول شما افزوده شد.`);
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex justify-center selection:bg-[#F59E0B]/30 selection:text-[#F59E0B] font-sans antialiased">
      {/* Native Mobile Screen Shell */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#0B1120] text-slate-100 flex flex-col relative shadow-[0_0_60px_rgba(0,0,0,0.8)] border-x border-slate-800/40">
        
        {/* Native Mobile Status Bar */}
        <MobileStatusBar />

        {/* 1. TOP APP BAR */}
        <header className="h-14 px-4 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-11 z-30 flex items-center justify-between">
          {/* Left Slot: Hamburger menu icon */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="منوی اصلی"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsAdminCMSOpen(true)}
              className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
              title="پنل مدیریت CMS"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Center Slot: App Logo & Brand */}
          <div className="flex items-center gap-2">
            <LegalScalesLogo size="xs" variant="gold" />
            <span className="text-sm font-black tracking-tight text-white">دادگستر</span>
          </div>

          {/* Right Slot: Notification & Profile icons */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => setIsAblaghiehOpen(true)}
              className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer relative"
              title="ابلاغیه‌های قضایی"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F59E0B]" />
            </button>

            {/* Profile Avatar */}
            <div
              onClick={() => setActiveNavTab('profile')}
              className="relative cursor-pointer group"
              title="پروفایل کاربری"
            >
              <img
                src="/src/assets/images/client_profile_avatar_1793192628292.jpg"
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#F59E0B]/60 ring-offset-1 ring-offset-[#0B1120] group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0B1120]" />
            </div>
          </div>
        </header>

        {/* In-app Toast Banner */}
        {toastMessage && (
          <div className="mx-4 mt-2 p-2.5 rounded-xl bg-amber-500/15 border border-[#F59E0B]/40 text-amber-300 text-xs flex items-center justify-between shadow-lg animate-fade-in z-20">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-amber-400 font-bold px-1.5">×</button>
          </div>
        )}

        {/* 1. SUB-MENUS: Horizontal Scrollable Row of Pills/Chips */}
        <div className="px-4 pt-2.5 pb-1 border-b border-slate-800/60 bg-[#0B1120]/60 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {[
              { id: 'all', title: 'همه', action: () => setActiveSubMenuPill('همه') },
              { id: 'services', title: 'خدمات حقوقی', action: () => { setActiveSubMenuPill('خدمات حقوقی'); setIsTriageOpen(true); } },
              { id: 'lawyers', title: 'بانک وکلا', action: () => { setActiveSubMenuPill('بانک وکلا'); setIsLawyersDirectoryOpen(true); } },
              { id: 'cases', title: 'پیگیری دادرسی', action: () => { setActiveSubMenuPill('پیگیری دادرسی'); setIsCaseDetailsOpen(true); } },
              { id: 'laws', title: 'بانک قوانین', action: () => { setActiveSubMenuPill('بانک قوانین'); setIsQnAOpen(true); } },
              { id: 'consult', title: 'مشاوره آنلاین', action: () => { setActiveSubMenuPill('مشاوره آنلاین'); setIsEncryptedConsultationOpen(true); } },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={pill.action}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeSubMenuPill === pill.title
                    ? 'bg-[#F59E0B] text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {pill.title}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Tab Body */}
        {activeNavTab === 'home' && (
          <div className="flex-1 flex flex-col pb-44 overflow-y-auto no-scrollbar space-y-4 p-4 text-right">
            
            {/* 2. HORIZONTAL BANNER (Swipeable Carousel) */}
            <MobileAnnouncementBanner
              onOpenTriage={() => setIsTriageOpen(true)}
              onOpenQuickCall={() => {
                const onlineLawyer = lawyers.find((l) => l.isOnline) || lawyers[0];
                setSelectedLawyerForBooking(onlineLawyer);
              }}
              onOpenSana={() => setIsAblaghiehOpen(true)}
            />

            {/* 3. SERVICES GRID (3-Column Grid Layout) */}
            <MobileServicesGrid
              features={appFeatures}
              onSelectService={handleSelectService}
            />

            {/* 2. HERO CARD: Current Active Case Card (Glassmorphism + Floating Gold Chip) */}
            <section className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-400 rounded-full" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100">پرونده فعال جاری (سامانه ثنا)</h3>
                </div>
                <button
                  onClick={() => setIsCaseDetailsOpen(true)}
                  className="text-[11px] text-[#F59E0B] font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <span>جزییات کامل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div
                onClick={() => setIsCaseDetailsOpen(true)}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0e172a]/70 to-[#0B1120]/90 border border-slate-800 hover:border-teal-500/30 transition-all cursor-pointer shadow-lg space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-[#F59E0B] text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-sm font-mono tabular-nums">
                    پرونده: ۱۴۰۳-۹۸۲۱
                  </span>
                  <span className="text-[11px] font-semibold text-teal-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    {currentCase?.status || 'در حال رسیدگی'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors leading-snug">
                      {currentCase?.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">{currentCase?.courtBranch}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] shrink-0">
                    <Gavel className="w-4 h-4" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>موعد جلسه بعدی دادرسی:</span>
                  <span className="text-amber-300 font-semibold">دوشنبه ۱۴ آبان · ساعت ۱۰:۳۰</span>
                </div>
              </div>
            </section>

            {/* 3. TIMELINE (Case Steps) - Minimal Thin Lines and Small Icons */}
            <section className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#F59E0B] rounded-full" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100">مراحل دادرسی پرونده</h3>
                </div>
                <span className="text-[10px] text-amber-400/90 font-mono">شعبه ۱۰۵ حقوقی</span>
              </div>

              <div className="relative pr-2 space-y-3">
                {/* Step 1: ثبت دادخواست (completed green check) */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 z-10 text-emerald-400">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">ثبت دادخواست و پرداخت هزینه دادرسی</span>
                      <span className="text-[10px] text-slate-500">۱۵ مهر</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">دادخواست از طریق سامانه خدمات قضایی ثبت شد.</p>
                  </div>
                </div>

                {/* Thin connecting line */}
                <div className="absolute right-[11px] top-4 w-0.5 h-8 bg-emerald-500/30 -z-0" />

                {/* Step 2: توزیع به شعبه (completed green check) */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 z-10 text-emerald-400">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">توزیع به شعبه ۱۰۵ حقوقی</span>
                      <span className="text-[10px] text-slate-500">۲۰ مهر</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">پرونده به ریاست شعبه ارجاع گردید.</p>
                  </div>
                </div>

                {/* Thin connecting line */}
                <div className="absolute right-[11px] top-[54px] w-0.5 h-8 bg-amber-500/40 -z-0" />

                {/* Step 3: ارجاع به کارشناس (yellow circle in-progress) */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shrink-0 z-10">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">ارجاع به کارشناس رسمی دادگستری</span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/20 font-bold">در حال اقدام</span>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-0.5">کارشناس منتخب در حال تهیه نظریه کارشناسی ملکی است.</p>
                  </div>
                </div>

                {/* Thin connecting line */}
                <div className="absolute right-[11px] top-[102px] w-0.5 h-8 bg-slate-800 -z-0" />

                {/* Step 4: رسیدگی در شعبه (pending gray circle) */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10 text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">رسیدگی در شعبه و صدور رای</span>
                      <span className="text-[10px] text-slate-600">موعد: ۱۴ آبان</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">جلسه دادرسی در وقت مقرر برگزار خواهد شد.</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* 'پرونده‌ها' (Cases) Tab View */}
        {activeNavTab === 'cases' && (
          <div className="flex-1 p-4 pb-44 overflow-y-auto no-scrollbar">
            <MobileFilesView
              cases={cases}
              onSelectCase={(c) => setIsCaseDetailsOpen(true)}
              onOpenNewCaseTriage={() => setIsTriageOpen(true)}
            />
          </div>
        )}

        {/* 'کیف پول' (Wallet) Tab View */}
        {activeNavTab === 'wallet' && (
          <div className="flex-1 p-4 pb-44 overflow-y-auto no-scrollbar">
            <MobileBankView
              user={currentUser}
              transactions={transactions}
              onChargeWallet={handleChargeWallet}
            />
          </div>
        )}

        {/* 'پروفایل' (Profile) Tab View */}
        {activeNavTab === 'profile' && (
          <div className="flex-1 p-4 pb-44 overflow-y-auto no-scrollbar">
            <MobileProfileView
              user={currentUser}
              allUsers={allUsers}
              onSwitchUser={(id) => {
                const found = allUsers.find((u) => u.id === id);
                if (found) setCurrentUser(found);
              }}
              onOpenArchitecture={() => setIsArchitectureOpen(true)}
              onOpenCMS={() => setIsAdminCMSOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </div>
        )}

        {/* 4. BOTTOM NAV & ACTIONS (Thumb Zone) */}
        {/* Horizontal scrollable secondary tools row */}
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 px-3 pointer-events-none">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto py-1">
            <button
              onClick={() => setIsDocumentsVaultOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 whitespace-nowrap flex items-center gap-1 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <FileText className="w-3 h-3 text-teal-400" />
              <span>اسناد و مدارک</span>
            </button>
            <button
              onClick={() => setIsTriageOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 whitespace-nowrap flex items-center gap-1 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>تریاژ هوشمند</span>
            </button>
            <button
              onClick={() => setIsEncryptedConsultationOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 whitespace-nowrap flex items-center gap-1 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>مشاوره رمزنگاری</span>
            </button>
            <button
              onClick={() => setIsQnAOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 whitespace-nowrap flex items-center gap-1 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <BookOpen className="w-3 h-3 text-indigo-400" />
              <span>بانک قوانین</span>
            </button>
          </div>
        </div>

        {/* Two prominent floating action buttons side-by-side just above bottom bar */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 px-3 pointer-events-none">
          <div className="grid grid-cols-2 gap-2 pointer-events-auto">
            {/* Solid Gold Button: 'مشاهده پرونده' */}
            <button
              onClick={() => setIsCaseDetailsOpen(true)}
              className="py-2.5 px-3 rounded-2xl bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-xl shadow-amber-500/25 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Briefcase className="w-4 h-4 stroke-[2.5]" />
              <span>مشاهده پرونده</span>
            </button>

            {/* Dark Glass Button: 'ابلاغیه‌ها' */}
            <button
              onClick={() => setIsAblaghiehOpen(true)}
              className="py-2.5 px-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xl backdrop-blur-xl transition-all cursor-pointer active:scale-[0.98] relative"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>ابلاغیه‌ها</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-2 right-3" />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-3" />
            </button>
          </div>
        </div>

        {/* 4. BOTTOM NAVIGATION BAR (Home, Cases, Wallet, Profile) */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-3 pb-3 pt-1 pointer-events-none">
          <nav className="h-16 bg-[#0F172A]/95 backdrop-blur-2xl border border-slate-800/80 rounded-2xl grid grid-cols-4 items-center px-1 shadow-2xl pointer-events-auto">
            {/* 1. خانه (Home) */}
            <button
              onClick={() => setActiveNavTab('home')}
              className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                activeNavTab === 'home' ? 'text-[#F59E0B]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">خانه</span>
            </button>

            {/* 2. پرونده‌ها (Cases) */}
            <button
              onClick={() => setActiveNavTab('cases')}
              className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                activeNavTab === 'cases' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">پرونده‌ها</span>
            </button>

            {/* 3. کیف پول (Wallet) */}
            <button
              onClick={() => setActiveNavTab('wallet')}
              className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                activeNavTab === 'wallet' ? 'text-[#F59E0B]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Landmark className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">کیف پول</span>
            </button>

            {/* 4. پروفایل (Profile) */}
            <button
              onClick={() => setActiveNavTab('profile')}
              className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                activeNavTab === 'profile' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">پروفایل</span>
            </button>
          </nav>
        </div>

      </div>

      {/* Side Drawer Menu (Slides from right) */}
      <MobileSideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={currentUser}
        onOpenTransactions={() => setActiveNavTab('wallet')}
        onOpenInbox={() => setIsAblaghiehOpen(true)}
        onOpenSettings={() => setIsAdminCMSOpen(true)}
        onOpenAbout={() => setIsArchitectureOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        unreadCount={2}
      />

      {/* Admin Panel (CMS) Modal */}
      <AdminCMSModal
        isOpen={isAdminCMSOpen}
        onClose={() => setIsAdminCMSOpen(false)}
        lawyers={lawyers}
        onApproveLawyer={handleApproveLawyer}
        onRejectLawyer={handleRejectLawyer}
        appFeatures={appFeatures}
        onToggleFeatureVisibility={handleToggleFeatureVisibility}
        onUpdateFeatureTitle={handleUpdateFeatureTitle}
      />

      {/* Full Case Details Bottom Sheet */}
      <MobileCaseDetailsSheet
        isOpen={isCaseDetailsOpen}
        onClose={() => setIsCaseDetailsOpen(false)}
        legalCase={currentCase}
        lawyer={assignedLawyer}
        onQuickCallLawyer={(id) => {
          setIsCaseDetailsOpen(false);
          setIsLawyersDirectoryOpen(true);
        }}
        onViewDocuments={() => {
          setIsCaseDetailsOpen(false);
          setIsDocumentsVaultOpen(true);
        }}
      />

      {/* Ablaghieh / Notifications Bottom Sheet */}
      <MobileAblaghiehSheet
        isOpen={isAblaghiehOpen}
        onClose={() => setIsAblaghiehOpen(false)}
      />

      {/* Auth Modal with Valid Links */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onRegisterLawyer={(newLawyer) => {
          setLawyers((prev) => [newLawyer, ...prev]);
        }}
        onLoginSuccess={(userId) => {
          const found = allUsers.find((u) => u.id === userId);
          if (found) setCurrentUser(found);
        }}
      />

      {/* AI Triage Modal */}
      <AITriageModal
        isOpen={isTriageOpen}
        onClose={() => setIsTriageOpen(false)}
        lawyers={lawyers}
        onSelectLawyerForBooking={(lawyerId) => {
          setIsTriageOpen(false);
          const target = lawyers.find((l) => l.id === lawyerId) || null;
          setSelectedLawyerForBooking(target);
        }}
      />

      {/* Lawyers Directory Modal */}
      {isLawyersDirectoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] bg-[#0B1120] border border-slate-800 rounded-3xl overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">بانک وکلای متخصص دادگستر</h3>
              <button
                onClick={() => setIsLawyersDirectoryOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                بستن
              </button>
            </div>
            <LawyerDirectory
              lawyers={lawyers}
              onSelectLawyerForProfile={(lawyer) => {
                setSelectedLawyerForProfile(lawyer);
              }}
              onSelectLawyerForBooking={(lawyerId) => {
                const target = lawyers.find((l) => l.id === lawyerId) || null;
                setSelectedLawyerForBooking(target);
              }}
              onStartChatWithLawyer={(lawyerId) => {
                setIsLawyersDirectoryOpen(false);
                setIsEncryptedConsultationOpen(true);
              }}
              onQuickCall={(lawyerId) => {
                setIsLawyersDirectoryOpen(false);
                const target = lawyers.find((l) => l.id === lawyerId) || null;
                setSelectedLawyerForBooking(target);
              }}
            />
          </div>
        </div>
      )}

      {/* Lawyer Profile Modal */}
      <LawyerProfileModal
        lawyer={selectedLawyerForProfile}
        onClose={() => setSelectedLawyerForProfile(null)}
        onBookConsultation={(lawyerId) => {
          setSelectedLawyerForProfile(null);
          const target = lawyers.find((l) => l.id === lawyerId) || null;
          setSelectedLawyerForBooking(target);
        }}
        onStartChat={() => {
          setSelectedLawyerForProfile(null);
          setIsEncryptedConsultationOpen(true);
        }}
        onAddReview={(lawyerId, review) => {
          setLawyers((prev) =>
            prev.map((l) => (l.id === lawyerId ? { ...l, reviewCount: l.reviewCount + 1 } : l))
          );
        }}
        currentUserRole={currentUser.role}
      />

      {/* Booking & Payment Modal */}
      <BookingAndPaymentModal
        isOpen={Boolean(selectedLawyerForBooking)}
        onClose={() => setSelectedLawyerForBooking(null)}
        lawyer={selectedLawyerForBooking}
        initialServiceType="مشاوره تلفنی ۳۰ دقیقه"
        onPaymentSuccess={handlePaymentSuccess}
        clientName={currentUser.name}
        clientPhone={currentUser.phone}
      />

      {/* Document Vault Modal */}
      {isDocumentsVaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] bg-[#0B1120] border border-slate-800 rounded-3xl overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">اسناد، مدارک و تنظیم دادخواست</h3>
              <button
                onClick={() => setIsDocumentsVaultOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                بستن
              </button>
            </div>
            <DocumentVaultView
              documents={documents}
              cases={cases}
              onUploadDocument={(doc) => {
                const newDoc: CaseDocument = {
                  id: `doc-${Date.now()}`,
                  uploadDate: new Date().toLocaleDateString('fa-IR'),
                  ...doc,
                };
                setDocuments((prev) => [newDoc, ...prev]);
              }}
              currentUserRole={currentUser.role}
            />
          </div>
        </div>
      )}

      {/* Legal Q&A Modal */}
      {isQnAOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] bg-[#0B1120] border border-slate-800 rounded-3xl overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">بانک قوانین و پرسش و پاسخ قضایی</h3>
              <button
                onClick={() => setIsQnAOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                بستن
              </button>
            </div>
            <LegalQnAView
              qnaList={qnaList}
              onAskQuestion={(item) => {
                const newItem: LegalQnAItem = {
                  id: `qna-${Date.now()}`,
                  views: 1,
                  answers: [],
                  ...item,
                };
                setQnaList((prev) => [newItem, ...prev]);
              }}
              onAddAnswer={(qId, text, articles) => {
                setQnaList((prev) =>
                  prev.map((q) =>
                    q.id === qId
                      ? {
                          ...q,
                          answers: [
                            ...q.answers,
                            {
                              id: `ans-${Date.now()}`,
                              lawyerId: currentUser.id,
                              lawyerName: currentUser.name,
                              lawyerAvatar: currentUser.avatar,
                              lawyerTitle: 'وکیل دادگستری',
                              answer: text,
                              date: new Date().toLocaleDateString('fa-IR'),
                              upvotes: 0,
                              isVerifiedBest: true,
                              relevantArticles: articles,
                            },
                          ],
                        }
                      : q
                  )
                );
              }}
              currentUserRole={currentUser.role}
              currentUserName={currentUser.name}
            />
          </div>
        </div>
      )}

      {/* Architecture & Django Backend Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Encrypted Consultation & Secure Chat Modal (PART 2 Integration) */}
      {isEncryptedConsultationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in text-right">
          <div className="relative w-full max-w-lg bg-[#0B1120] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-4 bg-slate-950/90 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span>جلسه مشاوره امن و چت رمزنگاری‌شده (AES-256)</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    رمزنگاری در حالت سکون (At Rest) بر اساس مدل‌های جنگو
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEncryptedConsultationOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EncryptedChatAndVideo
                currentUser={currentUser}
                lawyers={lawyers}
                initialLawyerId={assignedLawyer.id}
                autoStartCall={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
