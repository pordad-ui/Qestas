import React from 'react';
import {
  Server,
  Database,
  Lock,
  ShieldCheck,
  Cpu,
  Key,
  X,
  CheckCircle2,
  FileCode,
  Layers,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Server className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>معماری امنیتی سامانه (Django + PostgreSQL Architecture)</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                  Django REST 5.1 & Postgres 16
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                طراحی امنیتی سیستم حقوقی بر پایه چارچوب جنگو با لایه امنیتی پایگاه داده پستگرس
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-300">
          {/* Top High Security Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Database className="w-4 h-4" />
                <span>PostgreSQL RLS</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                قوانین Row-Level Security پستگرس مانع دسترسی موکلین به پرونده‌های غیرمرتبط در سطح هسته دیتابیس می‌شود.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Lock className="w-4 h-4" />
                <span>رمزنگاری pgcrypto</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                فیلدهای حساس (شرح شکواییه، شماره شبا، کارت ملی) با الگوریتم AES-256 در جداول دیتابیس هش و رمزگذاری شده‌اند.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>DRF Token & RBAC</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                سطوح دسترسی تفکیک‌شده (موکل، وکیل، ناظر قضایی، سوپرادمین) بر اساس Django Group Permissions.
              </p>
            </div>
          </div>

          {/* Django Backend Module Structure */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>ساختار ماژولار اپلیکیشن‌های جنگو (Django Apps Hierarchy):</span>
            </h3>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] space-y-2 text-slate-300">
              <div className="text-amber-400 font-bold">dadgostar_backend/</div>
              <div className="pr-4 space-y-1.5">
                <div>├── <strong className="text-cyan-300">core_authentication/</strong> # مدیریت نقش‌ها (RBAC)، احراز هویت ثنا و ۲FA پیامکی</div>
                <div>├── <strong className="text-cyan-300">lawyer_registry/</strong> # تایید پروانه وکالت، تطبیق شماره شبا و امتیازات کانون</div>
                <div>├── <strong className="text-cyan-300">ai_legal_triage/</strong> # موتور هوشمند تریاژ و انطباق با قوانین جمهوری اسلامی ایران</div>
                <div>├── <strong className="text-cyan-300">case_management/</strong> # گردش کار ۱۶ رقمی پرونده‌ها، شعب دادرسی و ابلاغیه‌های ثنا</div>
                <div>├── <strong className="text-cyan-300">encrypted_consultations/</strong> # وب‌سوکت چت رمزنگاری شده و اتاق WebRTC امن</div>
                <div>├── <strong className="text-cyan-300">financial_shaparak/</strong> # درگاه پرداخت شاپرک، کیف پول امانی و تسویه پایا به شبا</div>
                <div>├── <strong className="text-cyan-300">sms_gateway/</strong> # وب‌سرویس پیامک مواعد ۲۰ روزه تجدیدنظرخواهی و اوقات دادگاه</div>
                <div>└── <strong className="text-cyan-300">legal_vault/</strong> # گاوصندوق ابری اسناد با ثبت اثر انگشت دیجیتال SHA-256</div>
              </div>
            </div>
          </div>

          {/* Database Schema Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>نمونه مدل امنیتی جنگو و پستگرس (Django ORM Model with Field Encryption):</span>
            </h3>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] overflow-x-auto text-slate-300 leading-relaxed" dir="ltr">
              <span className="text-purple-400">from</span> django.db <span className="text-purple-400">import</span> models<br/>
              <span className="text-purple-400">from</span> encrypted_model_fields.fields <span className="text-purple-400">import</span> EncryptedCharField, EncryptedTextField<br/><br/>
              <span className="text-blue-400">class</span> <span className="text-yellow-300">LegalCase</span>(models.Model):<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;case_number = models.CharField(max_length=16, unique=True, db_index=True) <span className="text-slate-500"># شماره ۱۶ رقمی ثنا</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;client = models.ForeignKey(<span className="text-emerald-300">'User'</span>, on_delete=models.PROTECT, related_name=<span className="text-emerald-300">'client_cases'</span>)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;assigned_lawyer = models.ForeignKey(<span className="text-emerald-300">'Lawyer'</span>, on_delete=models.SET_NULL, null=True)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;confidential_notes = EncryptedTextField() <span className="text-slate-500"># AES-256 암호화</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;court_branch = models.CharField(max_length=255)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;appeal_deadline = models.DateTimeField(null=True, blank=True)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;created_at = models.DateTimeField(auto_now_add=True)<br/><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">class</span> <span className="text-yellow-300">Meta</span>:<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;indexes = [models.Index(fields=[<span className="text-emerald-300">'case_number'</span>, <span className="text-emerald-300">'client'</span>])]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;db_table = <span className="text-emerald-300">'judicial_cases'</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            مطابق با الزامات مرکز آمار و فناوری اطلاعات قوه قضاییه
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer"
          >
            بستن راهنما
          </button>
        </div>
      </div>
    </div>
  );
};
