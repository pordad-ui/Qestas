import React from 'react';
import {
  Scale,
  Users,
  Video,
  PhoneCall,
  Brain,
  Briefcase,
  Calendar,
  FolderLock,
  HelpCircle,
  BellRing,
  Wallet,
  ShieldCheck,
  BookOpen,
  FileText,
  Sliders,
  ExternalLink,
  Award,
  BookmarkCheck,
  CheckCircle2,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  Phone,
  Search,
} from 'lucide-react';

interface MenuIconProps {
  nameOrTarget?: string;
  className?: string;
}

export const MenuIcon: React.FC<MenuIconProps> = ({ nameOrTarget = '', className = 'w-4 h-4' }) => {
  const normalized = nameOrTarget.toLowerCase().trim();

  // Keyword / target mapping
  if (normalized.includes('triage') || normalized.includes('تریاژ') || normalized.includes('هوش مصنوعی') || normalized.includes('ai')) {
    return <Brain className={className} />;
  }
  if (normalized.includes('lawyer') || normalized.includes('وکل') || normalized.includes('وکالت') || normalized.includes('کانون')) {
    return <Users className={className} />;
  }
  if (normalized.includes('consultation') || normalized.includes('video') || normalized.includes('مشاوره') || normalized.includes('تصویری') || normalized.includes('چت')) {
    return <Video className={className} />;
  }
  if (normalized.includes('case') || normalized.includes('پرونده') || normalized.includes('دادرسی') || normalized.includes('ثنا') || normalized.includes('عدل ایران')) {
    return <Scale className={className} />;
  }
  if (normalized.includes('calendar') || normalized.includes('تقویم') || normalized.includes('مواعد') || normalized.includes('اوقات')) {
    return <Calendar className={className} />;
  }
  if (normalized.includes('document') || normalized.includes('vault') || normalized.includes('اسناد') || normalized.includes('گاوصندوق') || normalized.includes('اوراق')) {
    return <FolderLock className={className} />;
  }
  if (normalized.includes('qna') || normalized.includes('پرسش') || normalized.includes('پاسخ') || normalized.includes('تالار')) {
    return <HelpCircle className={className} />;
  }
  if (normalized.includes('sms') || normalized.includes('پیامک') || normalized.includes('هشدار') || normalized.includes('ابلاغیه')) {
    return <BellRing className={className} />;
  }
  if (normalized.includes('financial') || normalized.includes('مالی') || normalized.includes('کیف') || normalized.includes('تسویه') || normalized.includes('تعرفه')) {
    return <Wallet className={className} />;
  }
  if (normalized.includes('privacy') || normalized.includes('security') || normalized.includes('امنیت') || normalized.includes('محرمانگی') || normalized.includes('رمزنگاری')) {
    return <Lock className={className} />;
  }
  if (normalized.includes('petition') || normalized.includes('guide') || normalized.includes('دادخواست') || normalized.includes('شکواییه') || normalized.includes('لایحه') || normalized.includes('راهنما')) {
    return <FileCheck2 className={className} />;
  }
  if (normalized.includes('admin') || normalized.includes('مدیریت') || normalized.includes('کنسول') || normalized.includes('تنظیمات')) {
    return <Sliders className={className} />;
  }
  if (normalized.includes('knowledge') || normalized.includes('دانش') || normalized.includes('قوانین') || normalized.includes('حقوق')) {
    return <BookOpen className={className} />;
  }
  if (normalized.includes('phone') || normalized.includes('تماس') || normalized.includes('پشتیبانی') || normalized.includes('کشیک')) {
    return <PhoneCall className={className} />;
  }

  // Default fallback
  return <Layers className={className} />;
};
