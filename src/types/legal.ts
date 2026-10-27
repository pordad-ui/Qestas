export type UserRole = 'client' | 'lawyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  nationalId?: string;
  walletBalance: number;
}

export interface LawyerServicePricing {
  phone15min: number;
  phone30min: number;
  textConsultation: number;
  videoConsultation: number;
  draftPetition: number;
}

export interface LawyerReview {
  id: string;
  clientName: string;
  rating: number; // 1 to 5
  date: string;
  caseType: string;
  comment: string;
  lawyerReply?: string;
}

export interface Lawyer {
  id: string;
  name: string;
  title: string; // e.g. وکیل پایه یک دادگستری و مشاور حقوقی
  licenseNumber: string; // شماره پروانه وکالت
  barAssociation: string; // کانون وکلای دادگستری مرکز / مرکز وکلا قوه قضاییه
  avatar: string;
  rating: number; // e.g. 4.9
  reviewCount: number;
  experienceYears: number;
  winRate: number; // e.g. 96
  city: string;
  address: string;
  phone: string;
  email: string;
  shebaNumber: string;
  nationalId?: string;
  specialties: string[]; // ملکی, کیفری, خانواده, قراردادها, شرکت‌ها
  bio: string;
  education: string;
  pricing: LawyerServicePricing;
  isVerified: boolean;
  verificationStatus: 'approved' | 'pending' | 'rejected';
  isOnline: boolean;
  idCardDocUrl?: string;
  barLicenseDocUrl?: string;
  photoDocUrl?: string;
  reviews: LawyerReview[];
}

export interface CaseDocument {
  id: string;
  caseId?: string;
  title: string;
  category: 'هویتی' | 'دادخواست' | 'قرارداد' | 'سند مالکیت' | 'فیش مالی' | 'ادله اثبات' | 'پروانه وکالت';
  fileSize: string;
  uploadDate: string;
  status: 'تایید شده' | 'در انتظار بررسی' | 'نیاز به اصلاح';
  uploaderRole: UserRole;
  isEncrypted: boolean;
  sha256Hash: string;
  fileUrl?: string;
}

export interface CaseMilestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  current: boolean;
  description: string;
  courtBranch?: string;
}

export interface LegalCase {
  id: string;
  caseNumber: string; // 16-digit e.g. 1403919000124851
  sanaTrackingCode: string;
  title: string;
  category: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  courtBranch: string; // e.g. شعبه ۱۰۴ دادگاه کیفری دو مجتمع قضایی شهید قدوسی
  judgeName: string;
  status: 'در حال رسیدگی' | 'تعیین وقت نظارت' | 'صدور دادنامه بدوی' | 'تجدیدنظرخواهی' | 'مختومه';
  startDate: string;
  nextCourtDate?: string;
  appealDeadline?: string;
  description: string;
  milestones: CaseMilestone[];
  notifications: {
    id: string;
    title: string;
    date: string;
    text: string;
    isRead: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface ConsultationSession {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  lawyerId: string;
  lawyerName: string;
  type: 'تلفنی' | 'متنی' | 'تصویری' | 'تنظیم دادخواست';
  durationMinutes: number;
  scheduledDate: string; // e.g. ۱۴۰۳/۰۸/۱۵
  scheduledTime: string; // e.g. ۱۶:۳۰
  fee: number;
  status: 'تایید شده' | 'در انتظار پرداخت' | 'در حال برگزاری' | 'پایان یافته' | 'لغو شده';
  meetingRoomId?: string;
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string; // شماره پیگیری شاپرک
  rrn: string; // شماره مرجع
  payerName: string;
  receiverName: string;
  amount: number; // تومان
  serviceTitle: string;
  date: string;
  status: 'موفق' | 'ناموفق' | 'در انتظار تایید';
  gateway: 'به‌پرداخت ملت' | 'سامان کیش' | 'زرین‌پال شاپرک';
  cardNumberMasked: string; // e.g. ۶۰۳۷-۹۹**-****-۴۴۵۲
}

export interface LegalQnAItem {
  id: string;
  title: string;
  question: string;
  authorName: string;
  category: string;
  date: string;
  views: number;
  answers: {
    id: string;
    lawyerId: string;
    lawyerName: string;
    lawyerAvatar: string;
    lawyerTitle: string;
    answer: string;
    date: string;
    upvotes: number;
    isVerifiedBest: boolean;
    relevantArticles?: string[];
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // Shamsi date string
  time: string;
  type: 'جلسه دادگاه' | 'مهلت تجدیدنظر' | 'مشاوره آنلاین' | 'تحویل لایحه';
  caseNumber?: string;
  location?: string;
  reminderMinutesBefore: number;
  isCompleted: boolean;
  notes?: string;
}

export interface SMSNotificationLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  recipientRole: UserRole;
  type: 'ابلاغیه ثنا' | 'یادآوری دادگاه' | 'مهلت قانونی' | 'تایید مشاوره' | 'پرداخت';
  message: string;
  timestamp: string;
  status: 'تحویل داده شده' | 'ارسال شده' | 'در صف مخابرات';
}

export interface AITriageResult {
  category: string;
  urgency: string;
  legalTitle: string;
  legalSummary: string;
  relevantArticles: string[];
  requiredDocuments: string[];
  estimatedSuccessRate: number;
  estimatedDurationMonths: string;
  recommendedSpecialty: string;
  nextActionSteps: string[];
}

export interface CMSContent {
  heroTitle: string;
  heroSubtitle: string;
  announcementTicker: string;
  consultationGuaranteeText: string;
  contactEmergencyPhone: string;
  faqs: { question: string; answer: string }[];
}

export interface PlatformCommissionSettings {
  defaultSiteSharePercent: number; // e.g. 10%
  defaultLawyerSharePercent: number; // e.g. 90%
  phoneSharePercent: number;
  videoSharePercent: number;
  textSharePercent: number;
  petitionSharePercent: number;
  vatTaxPercent: number; // e.g. 9%
  minimumPayoutAmount: number; // e.g. 1,000,000 Tomans
  autoPayoutThreshold: number; // e.g. 10,000,000 Tomans
  isSettlementActive: boolean;
}

export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  category: 'راهنمای حقوقی' | 'قوانین و مقررات' | 'تعرفه‌ها' | 'اطلاعیه عمومی';
  content: string;
  author: string;
  published: boolean;
  updatedAt: string;
  views: number;
}

export interface MenuItem {
  id: string;
  title: string;
  targetTabOrSlug: string; // e.g. 'cases', 'lawyers', or a custom page slug like 'page:legal-tariff'
  order: number;
  isActive: boolean;
  parentId?: string | null;
  submenus?: MenuItem[];
}

export interface AdminAssistant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  roleTitle: 'مدیر کل (SuperAdmin)' | 'دستیار حقوقی و احراز مدارک' | 'ناظر مالی و تسویه' | 'دستیار محتوا و منوها';
  accessLevel: 'full' | 'restricted';
  permissions: {
    canVerifyLawyers: boolean;
    canDeleteLawyers: boolean;
    canManageCommission: boolean;
    canManagePages: boolean;
    canManageMenus: boolean;
    canManageCases: boolean;
    canAccessFinancials: boolean;
  };
  isActive: boolean;
  lastLogin: string;
}

