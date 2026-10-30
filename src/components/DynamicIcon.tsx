import React from 'react';
import {
  Gavel,
  Users,
  Briefcase,
  BookOpen,
  MessageSquare,
  FileEdit,
  ShieldCheck,
  Scale,
  CreditCard,
  Inbox,
  Settings,
  Info,
  PhoneCall,
  Home,
  Folder,
  User,
  Landmark,
  Bell,
  FileText,
  Sparkles,
  Lock,
  Sliders,
  Calendar,
  Award,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  Compass,
  CheckCircle2,
  FileCheck,
  Layers,
  Search,
  Phone,
  Video,
  Database,
  Building,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { IconStyle } from '../types/cms';

interface DynamicIconProps {
  name: string;
  style?: IconStyle;
  colorTheme?: string;
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Gavel,
  Users,
  Briefcase,
  BookOpen,
  MessageSquare,
  FileEdit,
  ShieldCheck,
  Scale,
  CreditCard,
  Inbox,
  Settings,
  Info,
  PhoneCall,
  Home,
  Folder,
  User,
  Landmark,
  Bell,
  FileText,
  Sparkles,
  Lock,
  Sliders,
  Calendar,
  Award,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  Compass,
  CheckCircle2,
  FileCheck,
  Layers,
  Search,
  Phone,
  Video,
  Database,
  Building,
  KeyRound,
  ShieldAlert,
};

export const AVAILABLE_ICON_NAMES = Object.keys(ICON_MAP);

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  style = 'colored',
  colorTheme = 'amber',
  className = 'w-5 h-5',
}) => {
  // Normalize lookup (case insensitive match if possible)
  const normalizedKey = Object.keys(ICON_MAP).find(
    (k) => k.toLowerCase() === name.trim().toLowerCase()
  ) || 'FileText';

  const IconComponent = ICON_MAP[normalizedKey] || FileText;

  // Resolve color palette
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'teal':
        return {
          text: 'text-teal-400',
          bg: 'bg-teal-500/15',
          border: 'border-teal-500/30',
        };
      case 'indigo':
        return {
          text: 'text-indigo-400',
          bg: 'bg-indigo-500/15',
          border: 'border-indigo-500/30',
        };
      case 'cyan':
        return {
          text: 'text-cyan-400',
          bg: 'bg-cyan-500/15',
          border: 'border-cyan-500/30',
        };
      case 'emerald':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/30',
        };
      case 'purple':
        return {
          text: 'text-purple-400',
          bg: 'bg-purple-500/15',
          border: 'border-purple-500/30',
        };
      case 'rose':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/15',
          border: 'border-rose-500/30',
        };
      case 'amber':
      default:
        return {
          text: 'text-[#F59E0B]',
          bg: 'bg-[#F59E0B]/15',
          border: 'border-[#F59E0B]/30',
        };
    }
  };

  const themeColors = getThemeClasses(colorTheme);

  if (style === 'minimal') {
    return <IconComponent className={`${className} stroke-[1.75] text-slate-300`} />;
  }

  if (style === 'linear') {
    return <IconComponent className={`${className} stroke-[2] ${themeColors.text}`} />;
  }

  // Default 'colored' style: container with soft background & border
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl p-2 ${themeColors.bg} ${themeColors.border} border`}
    >
      <IconComponent className={`${className} stroke-[1.75] ${themeColors.text}`} />
    </div>
  );
};
