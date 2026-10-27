import React, { useState } from 'react';
import {
  Header,
} from './components/Header';
import {
  HeroBanner,
} from './components/HeroBanner';
import {
  DashboardOverview,
} from './components/DashboardOverview';
import {
  LawyerDirectory,
} from './components/LawyerDirectory';
import {
  LawyerProfileModal,
} from './components/LawyerProfileModal';
import {
  BookingAndPaymentModal,
} from './components/BookingAndPaymentModal';
import {
  AITriageModal,
} from './components/AITriageModal';
import {
  CaseTrackingView,
} from './components/CaseTrackingView';
import {
  EncryptedChatAndVideo,
} from './components/EncryptedChatAndVideo';
import {
  SmartCalendarView,
} from './components/SmartCalendarView';
import {
  SMSNotificationsView,
} from './components/SMSNotificationsView';
import {
  DocumentVaultView,
} from './components/DocumentVaultView';
import {
  LegalQnAView,
} from './components/LegalQnAView';
import {
  LawyerFinancialDashboard,
} from './components/LawyerFinancialDashboard';
import {
  AdminVerificationPanel,
} from './components/AdminVerificationPanel';
import {
  MasterAdminManagementPanel,
} from './components/MasterAdminManagementPanel';
import {
  DynamicPageModal,
} from './components/DynamicPageModal';
import {
  CMSManagerModal,
} from './components/CMSManagerModal';
import {
  ArchitectureModal,
} from './components/ArchitectureModal';
import {
  AuthModal,
} from './components/AuthModal';

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
  INITIAL_CMS,
  INITIAL_COMMISSION_SETTINGS,
  INITIAL_PAGES,
  INITIAL_MENUS,
  INITIAL_ADMIN_ASSISTANTS,
} from './data/mockData';

import {
  User,
  Lawyer,
  LegalCase,
  CaseDocument,
  ConsultationSession,
  PaymentTransaction,
  LegalQnAItem,
  CalendarEvent,
  SMSNotificationLog,
  CMSContent,
  LawyerReview,
  PlatformCommissionSettings,
  DynamicPage,
  MenuItem,
  AdminAssistant,
  CustomAppLink,
} from './types/legal';

import {
  Scale,
  ShieldCheck,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Heart,
  Server,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  // Global State
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Starts as Client
  const [lawyers, setLawyers] = useState<Lawyer[]>(INITIAL_LAWYERS);
  const [cases, setCases] = useState<LegalCase[]>(INITIAL_CASES);
  const [documents, setDocuments] = useState<CaseDocument[]>(INITIAL_DOCUMENTS);
  const [consultations, setConsultations] = useState<ConsultationSession[]>(INITIAL_CONSULTATIONS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [qnaList, setQnaList] = useState<LegalQnAItem[]>(INITIAL_QNA);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [smsLogs, setSmsLogs] = useState<SMSNotificationLog[]>(INITIAL_SMS_LOGS);
  const [cms, setCms] = useState<CMSContent>(INITIAL_CMS);

  // Master Admin & Dynamic CMS States
  const [commissionSettings, setCommissionSettings] = useState<PlatformCommissionSettings>(
    INITIAL_COMMISSION_SETTINGS
  );
  const [pages, setPages] = useState<DynamicPage[]>(INITIAL_PAGES);
  const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);
  const [assistants, setAssistants] = useState<AdminAssistant[]>(INITIAL_ADMIN_ASSISTANTS);
  const [activeAssistant, setActiveAssistant] = useState<AdminAssistant>(INITIAL_ADMIN_ASSISTANTS[0]);
  const [selectedPageForModal, setSelectedPageForModal] = useState<DynamicPage | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal States
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedLawyerForProfile, setSelectedLawyerForProfile] = useState<Lawyer | null>(null);
  const [selectedLawyerForBooking, setSelectedLawyerForBooking] = useState<Lawyer | null>(null);
  const [bookingServiceType, setBookingServiceType] = useState<string>('مشاوره تصویری ۴۵ دقیقه');
  const [lawyerDirectoryQuery, setLawyerDirectoryQuery] = useState<string>('');
  const [activeCallLawyerId, setActiveCallLawyerId] = useState<string | null>(null);
  const [autoStartCall, setAutoStartCall] = useState<boolean>(false);

  // Persona switching
  const handleSwitchUser = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      // Adjust active tab if lawyer tab was active
      if (found.role !== 'lawyer' && activeTab === 'financial') {
        setActiveTab('dashboard');
      }
      if (found.role !== 'admin' && (activeTab === 'admin-verifications' || activeTab === 'master-admin')) {
        setActiveTab('dashboard');
      }
    }
  };

  // Payment Success Handler
  const handlePaymentSuccess = (consultation: ConsultationSession, transaction: PaymentTransaction) => {
    setConsultations((prev) => [consultation, ...prev]);
    setTransactions((prev) => [transaction, ...prev]);

    // Deduct or adjust wallet / transaction
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - transaction.amount),
    }));

    // Auto-generate SMS Confirmation Log
    const newSMS: SMSNotificationLog = {
      id: `sms-${Date.now()}`,
      recipientPhone: currentUser.phone,
      recipientName: currentUser.name,
      recipientRole: currentUser.role,
      type: 'تایید مشاوره',
      message: `موکل گرامی جناب ${currentUser.name}، وقت مشاوره حقوقی شما با ${consultation.lawyerName} برای تاریخ ${consultation.scheduledDate} ساعت ${consultation.scheduledTime} ثبت و هزینه پرداخت شد. کد پیگیری: ${transaction.transactionRef}`,
      timestamp: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR'),
      status: 'تحویل داده شده',
    };
    setSmsLogs((prev) => [newSMS, ...prev]);

    // Auto-add to calendar
    const newCalEvent: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: `مشاوره ${consultation.type} با ${consultation.lawyerName}`,
      date: consultation.scheduledDate,
      time: consultation.scheduledTime,
      type: 'مشاوره آنلاین',
      reminderMinutesBefore: 60,
      isCompleted: false,
      notes: `لینک اتاق اختصاصی: ${consultation.meetingRoomId}`,
    };
    setCalendarEvents((prev) => [newCalEvent, ...prev]);
  };

  // Add Lawyer Review
  const handleAddReview = (lawyerId: string, review: Omit<LawyerReview, 'id'>) => {
    setLawyers((prev) =>
      prev.map((lawyer) => {
        if (lawyer.id === lawyerId) {
          const newReview: LawyerReview = {
            id: `rev-${Date.now()}`,
            ...review,
          };
          const updatedReviews = [newReview, ...lawyer.reviews];
          const newRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...lawyer,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: Number(newRating.toFixed(2)),
          };
        }
        return lawyer;
      })
    );
  };

  // Add Case Document
  const handleUploadDocument = (doc: Omit<CaseDocument, 'id' | 'uploadDate'>) => {
    const newDoc: CaseDocument = {
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toLocaleDateString('fa-IR'),
      ...doc,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Add Calendar Event
  const handleAddCalendarEvent = (event: Omit<CalendarEvent, 'id' | 'isCompleted'>) => {
    const newEvent: CalendarEvent = {
      id: `cal-${Date.now()}`,
      isCompleted: false,
      ...event,
    };
    setCalendarEvents((prev) => [newEvent, ...prev]);
  };

  // Toggle Calendar Event Complete
  const handleToggleCalendarEvent = (eventId: string) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isCompleted: !e.isCompleted } : e))
    );
  };

  // Send Custom SMS
  const handleSendCustomSMS = (log: Omit<SMSNotificationLog, 'id' | 'timestamp' | 'status'>) => {
    const newLog: SMSNotificationLog = {
      id: `sms-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR'),
      status: 'تحویل داده شده',
      ...log,
    };
    setSmsLogs((prev) => [newLog, ...prev]);
  };

  // Add Legal Question
  const handleAskQuestion = (item: Omit<LegalQnAItem, 'id' | 'views' | 'answers'>) => {
    const newItem: LegalQnAItem = {
      id: `qna-${Date.now()}`,
      views: 1,
      answers: [],
      ...item,
    };
    setQnaList((prev) => [newItem, ...prev]);
  };

  // Add Lawyer Answer to Q&A
  const handleAddAnswer = (questionId: string, answerText: string, relevantArticles: string[]) => {
    setQnaList((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [
              ...q.answers,
              {
                id: `ans-${Date.now()}`,
                lawyerId: currentUser.id,
                lawyerName: currentUser.name,
                lawyerAvatar: currentUser.avatar,
                lawyerTitle: 'وکیل پایه یک دادگستری',
                answer: answerText,
                date: new Date().toLocaleDateString('fa-IR'),
                upvotes: 0,
                isVerifiedBest: true,
                relevantArticles,
              },
            ],
          };
        }
        return q;
      })
    );
  };

  // Admin Approve Lawyer
  const handleApproveLawyer = (lawyerId: string) => {
    setLawyers((prev) =>
      prev.map((l) =>
        l.id === lawyerId ? { ...l, isVerified: true, verificationStatus: 'approved' } : l
      )
    );
  };

  // Admin Reject Lawyer
  const handleRejectLawyer = (lawyerId: string, reason: string) => {
    setLawyers((prev) =>
      prev.map((l) =>
        l.id === lawyerId ? { ...l, isVerified: false, verificationStatus: 'rejected' } : l
      )
    );
    // Log SMS rejection to lawyer
    const targetLawyer = lawyers.find((l) => l.id === lawyerId);
    if (targetLawyer) {
      setSmsLogs((prev) => [
        {
          id: `sms-${Date.now()}`,
          recipientPhone: targetLawyer.phone,
          recipientName: targetLawyer.name,
          recipientRole: 'lawyer',
          type: 'مهلت قانونی',
          message: `همکار گرامی ${targetLawyer.name}، مدارک ارسالی شما به دلیل زیر توسط مدیر سامانه تایید نشد: ${reason}. لطفاً جهت اصلاح به کارتابل مراجعه فرمایید.`,
          timestamp: new Date().toLocaleDateString('fa-IR'),
          status: 'تحویل داده شده',
        },
        ...prev,
      ]);
    }
  };

  // Master Admin: Update Lawyer Details
  const handleUpdateLawyer = (updatedLawyer: Lawyer) => {
    setLawyers((prev) => prev.map((l) => (l.id === updatedLawyer.id ? updatedLawyer : l)));
  };

  // Master Admin: Delete Lawyer
  const handleDeleteLawyer = (lawyerId: string) => {
    setLawyers((prev) => prev.filter((l) => l.id !== lawyerId));
  };

  // Master Admin: Update Platform Commission Settings
  const handleUpdateCommissionSettings = (newSettings: PlatformCommissionSettings) => {
    setCommissionSettings(newSettings);
  };

  // Master Admin: Page Builder CRUD
  const handleCreatePage = (newPage: Omit<DynamicPage, 'id' | 'views' | 'updatedAt'>) => {
    const created: DynamicPage = {
      id: `page-${Date.now()}`,
      views: 0,
      updatedAt: new Date().toLocaleDateString('fa-IR'),
      ...newPage,
    };
    setPages((prev) => [created, ...prev]);
  };

  const handleUpdatePage = (updatedPage: DynamicPage) => {
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
  };

  const handleDeletePage = (pageId: string) => {
    setPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  // Master Admin: Menu Builder
  const handleUpdateMenus = (newMenus: MenuItem[]) => {
    setMenus(newMenus);
  };

  // Master Admin: RBAC Assistants Management
  const handleAddAssistant = (newAssistant: Omit<AdminAssistant, 'id' | 'lastLogin'>) => {
    const created: AdminAssistant = {
      id: `ast-${Date.now()}`,
      lastLogin: 'هم‌اکنون',
      ...newAssistant,
    };
    setAssistants((prev) => [...prev, created]);
  };

  const handleUpdateAssistant = (updatedAssistant: AdminAssistant) => {
    setAssistants((prev) => prev.map((a) => (a.id === updatedAssistant.id ? updatedAssistant : a)));
    if (activeAssistant.id === updatedAssistant.id) {
      setActiveAssistant(updatedAssistant);
    }
  };

  const handleDeleteAssistant = (assistantId: string) => {
    setAssistants((prev) => prev.filter((a) => a.id !== assistantId));
    if (activeAssistant.id === assistantId) {
      setActiveAssistant(assistants[0]);
    }
  };

  // Withdraw Request by Lawyer
  const handleWithdrawRequest = (amount: number, sheba: string) => {
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      transactionRef: `PAYA-${Math.floor(10000000 + Math.random() * 90000000)}`,
      rrn: String(Math.floor(100000000000 + Math.random() * 900000000000)),
      payerName: 'سامانه دادگستر (حساب امانی)',
      receiverName: currentUser.name,
      amount,
      serviceTitle: 'تسویه حواله پایا به شماره شبا وکیل',
      date: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR'),
      status: 'موفق',
      gateway: 'زرین‌پال شاپرک',
      cardNumberMasked: sheba,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Custom Link Click Handler (Internal vs External vs Dynamic Pages)
  const handleCustomLinkClick = (link: CustomAppLink) => {
    if (link.isExternal) {
      if (link.urlOrTarget.startsWith('tel:')) {
        window.location.href = link.urlOrTarget;
      } else {
        window.open(link.urlOrTarget, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (link.urlOrTarget.startsWith('#')) {
      const target = link.urlOrTarget.replace('#', '');
      if (target === 'triage') {
        setIsTriageOpen(true);
      } else {
        setActiveTab(target);
      }
      return;
    }

    if (link.urlOrTarget.startsWith('page:')) {
      const slug = link.urlOrTarget.replace('page:', '');
      const foundPage = pages.find((p) => p.slug === slug);
      if (foundPage) {
        setSelectedPageForModal(foundPage);
      }
      return;
    }

    if (link.urlOrTarget.startsWith('http')) {
      window.open(link.urlOrTarget, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCMS={() => setIsCMSOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenTriage={() => setIsTriageOpen(true)}
        smsCount={smsLogs.length}
        menus={menus}
        pages={pages}
        onSelectPage={(page) => setSelectedPageForModal(page)}
        cms={cms}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* If on Dashboard, show Hero Banner */}
        {activeTab === 'dashboard' && (
          <HeroBanner
            cms={cms}
            onOpenTriage={() => setIsTriageOpen(true)}
            onSearchLawyer={(query) => {
              setLawyerDirectoryQuery(query);
              setActiveTab('lawyers');
            }}
            onGoToCases={() => setActiveTab('cases')}
          />
        )}

        {/* Tab Content Area */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              currentUser={currentUser}
              cases={cases}
              consultations={consultations}
              documents={documents}
              lawyers={lawyers}
              transactions={transactions}
              onOpenTriage={() => setIsTriageOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onJoinMeeting={(roomId) => setActiveTab('consultations')}
            />
          )}

          {activeTab === 'lawyers' && (
            <LawyerDirectory
              lawyers={lawyers}
              onSelectLawyerForProfile={(lawyer) => setSelectedLawyerForProfile(lawyer)}
              onSelectLawyerForBooking={(lawyerId) => {
                const target = lawyers.find((l) => l.id === lawyerId) || null;
                setSelectedLawyerForBooking(target);
              }}
              onStartChatWithLawyer={(lawyerId) => {
                setActiveCallLawyerId(lawyerId);
                setAutoStartCall(false);
                setActiveTab('consultations');
              }}
              onQuickCall={(lawyerId) => {
                setActiveCallLawyerId(lawyerId);
                setAutoStartCall(true);
                setActiveTab('consultations');
              }}
              initialQuery={lawyerDirectoryQuery}
            />
          )}

          {activeTab === 'cases' && (
            <CaseTrackingView
              cases={cases}
              documents={documents}
              onUploadDocument={(caseId) => setActiveTab('documents')}
              currentUserRole={currentUser.role}
            />
          )}

          {activeTab === 'consultations' && (
            <EncryptedChatAndVideo
              currentUser={currentUser}
              lawyers={lawyers}
              initialLawyerId={activeCallLawyerId}
              autoStartCall={autoStartCall}
            />
          )}

          {activeTab === 'calendar' && (
            <SmartCalendarView
              events={calendarEvents}
              cases={cases}
              onAddEvent={handleAddCalendarEvent}
              onToggleComplete={handleToggleCalendarEvent}
              currentUserRole={currentUser.role}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentVaultView
              documents={documents}
              cases={cases}
              onUploadDocument={handleUploadDocument}
              currentUserRole={currentUser.role}
            />
          )}

          {activeTab === 'qna' && (
            <LegalQnAView
              qnaList={qnaList}
              onAskQuestion={handleAskQuestion}
              onAddAnswer={handleAddAnswer}
              currentUserRole={currentUser.role}
              currentUserName={currentUser.name}
            />
          )}

          {activeTab === 'sms' && (
            <SMSNotificationsView
              logs={smsLogs}
              onSendCustomSMS={handleSendCustomSMS}
              userPhone={currentUser.phone}
            />
          )}

          {activeTab === 'financial' && (
            <LawyerFinancialDashboard
              lawyer={lawyers[0]}
              transactions={transactions}
              onWithdrawRequest={handleWithdrawRequest}
            />
          )}

          {(activeTab === 'master-admin' || activeTab === 'admin-verifications') && (
            <MasterAdminManagementPanel
              lawyers={lawyers}
              onApproveLawyer={handleApproveLawyer}
              onRejectLawyer={handleRejectLawyer}
              onUpdateLawyer={handleUpdateLawyer}
              onDeleteLawyer={handleDeleteLawyer}
              commissionSettings={commissionSettings}
              onUpdateCommissionSettings={handleUpdateCommissionSettings}
              pages={pages}
              onCreatePage={handleCreatePage}
              onUpdatePage={handleUpdatePage}
              onDeletePage={handleDeletePage}
              onViewPagePreview={(page) => setSelectedPageForModal(page)}
              menus={menus}
              onUpdateMenus={handleUpdateMenus}
              assistants={assistants}
              onAddAssistant={handleAddAssistant}
              onUpdateAssistant={handleUpdateAssistant}
              onDeleteAssistant={handleDeleteAssistant}
              activeAssistant={activeAssistant}
              onSelectActiveAssistant={(ast) => setActiveAssistant(ast)}
              cms={cms}
              onUpdateCMS={(newCMS) => setCms(newCMS)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-xs text-slate-400 py-10 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Col 1: Identity & Mission */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-base font-black text-white">{cms.brandName || 'دادگستر'}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {cms.footerMissionText || 'پلتفرم تخصصی وکالت برخط، تریاژ هوشمند پرونده، مشاوره تصویری امن و پیگیری یکپارچه دادرسی الکترونیک در سراسر کشور.'}
              </p>
              <div className="pt-2 flex flex-col gap-1.5 text-[10px]">
                {cms.footerSecurityBadge1 && (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    {cms.footerSecurityBadge1}
                  </span>
                )}
                {cms.footerSecurityBadge2 && (
                  <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                    <Server className="w-3.5 h-3.5 shrink-0" />
                    {cms.footerSecurityBadge2}
                  </span>
                )}
              </div>
            </div>

            {/* Col 2: Services Links */}
            <div>
              <h4 className="text-slate-200 font-bold mb-2">خدمات و بخش‌ها:</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                {(cms.customLinks?.filter(l => l.isActive && l.category === 'footer-services') || []).map((link) => (
                  <li
                    key={link.id}
                    onClick={() => handleCustomLinkClick(link)}
                    className="hover:text-amber-400 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <span>{link.title}</span>
                    {link.badge && (
                      <span className="text-[9px] bg-slate-800 text-amber-300 border border-slate-700 px-1 rounded">
                        {link.badge}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Judicial Portals & Authorities */}
            <div>
              <h4 className="text-slate-200 font-bold mb-2">سامانه‌ها و مراجع قضایی:</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                {(cms.customLinks?.filter(l => l.isActive && l.category === 'footer-judicial') || []).map((link) => (
                  <li
                    key={link.id}
                    onClick={() => handleCustomLinkClick(link)}
                    className="hover:text-cyan-400 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <span>{link.title}</span>
                    {link.isExternal && <ExternalLink className="w-2.5 h-2.5 text-slate-500" />}
                    {link.badge && (
                      <span className="text-[9px] bg-slate-800 text-cyan-300 border border-slate-700 px-1 rounded">
                        {link.badge}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Quick Laws & 24/7 Support */}
            <div className="space-y-2.5">
              <h4 className="text-slate-200 font-bold">پشتیبانی و قوانین:</h4>
              <ul className="space-y-1 text-[11px] text-slate-400 pb-1">
                {(cms.customLinks?.filter(l => l.isActive && l.category === 'footer-quick') || []).map((link) => (
                  <li
                    key={link.id}
                    onClick={() => handleCustomLinkClick(link)}
                    className="hover:text-amber-400 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <span>• {link.title}</span>
                  </li>
                ))}
              </ul>
              {cms.contactEmergencyPhone && (
                <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                  {cms.contactEmergencyLabel ? `${cms.contactEmergencyLabel}: ` : ''}{cms.contactEmergencyPhone}
                </p>
              )}
              {cms.consultationGuaranteeText && (
                <p className="text-[10px] text-amber-400/90 leading-relaxed bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  {cms.consultationGuaranteeText}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <span>{cms.footerCopyrightText || '© کلیه حقوق مادی و معنوی برای سامانه جامع دادگستر محفوظ است.'}</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsArchitectureOpen(true)}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                مشخصات فنی و معماری سرور (جنگو + پستگرس)
              </button>
              <span>•</span>
              <button
                onClick={() => setIsCMSOpen(true)}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                مدیریت محتوای سایت (CMS)
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AITriageModal
        isOpen={isTriageOpen}
        onClose={() => setIsTriageOpen(false)}
        onSelectLawyerForBooking={(lawyerId) => {
          const target = lawyers.find((l) => l.id === lawyerId) || null;
          setSelectedLawyerForBooking(target);
        }}
        lawyers={lawyers}
      />

      <LawyerProfileModal
        lawyer={selectedLawyerForProfile}
        onClose={() => setSelectedLawyerForProfile(null)}
        onBookConsultation={(lawyerId, serviceType) => {
          setSelectedLawyerForProfile(null);
          const target = lawyers.find((l) => l.id === lawyerId) || null;
          if (serviceType) setBookingServiceType(serviceType);
          setSelectedLawyerForBooking(target);
        }}
        onStartChat={(lawyerId) => {
          setSelectedLawyerForProfile(null);
          setActiveTab('consultations');
        }}
        onAddReview={handleAddReview}
        currentUserRole={currentUser.role}
      />

      <BookingAndPaymentModal
        isOpen={Boolean(selectedLawyerForBooking)}
        onClose={() => setSelectedLawyerForBooking(null)}
        lawyer={selectedLawyerForBooking}
        initialServiceType={bookingServiceType}
        onPaymentSuccess={handlePaymentSuccess}
        clientName={currentUser.name}
        clientPhone={currentUser.phone}
      />

      <CMSManagerModal
        isOpen={isCMSOpen}
        onClose={() => setIsCMSOpen(false)}
        cms={cms}
        onSaveCMS={(newCMS) => setCms(newCMS)}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onRegisterLawyer={(newLawyer) => {
          setLawyers((prev) => [newLawyer, ...prev]);
        }}
        onLoginSuccess={(userId) => {
          handleSwitchUser(userId);
        }}
      />

      <DynamicPageModal
        page={selectedPageForModal}
        onClose={() => setSelectedPageForModal(null)}
      />
    </div>
  );
}
