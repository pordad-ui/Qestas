import React, { useState } from 'react';
import {
  X,
  User,
  Scale,
  ShieldCheck,
  CreditCard,
  Upload,
  Lock,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  LogIn,
  UserPlus,
  KeyRound,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { UserRole, Lawyer } from '../types/legal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterLawyer: (newLawyer: Lawyer) => void;
  onLoginSuccess: (userId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onRegisterLawyer,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');

  // Login fields
  const [loginPhone, setLoginPhone] = useState('09121234567');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [otpCode, setOtpCode] = useState('');
  const [useOtp, setUseOtp] = useState(false);

  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [barAssociation, setBarAssociation] = useState('کانون وکلای دادگستری مرکز');
  const [specialty, setSpecialty] = useState('ملکی و سرقفلی');
  const [shebaNumber, setShebaNumber] = useState('IR');
  const [experienceYears, setExperienceYears] = useState(5);
  const [province, setProvince] = useState('تهران');
  const [city, setCity] = useState('تهران');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Submission feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) return;

    // Determine target user based on selected role or phone
    let targetUserId = 'user-client-1'; // Default client
    if (selectedRole === 'lawyer' || loginPhone.includes('8832')) {
      targetUserId = 'user-lawyer-1';
    } else if (selectedRole === 'admin') {
      targetUserId = 'user-admin-1';
    }

    setSuccessMessage('ورود به سامانه با موفقیت انجام شد. در حال انتقال به کارتابل...');
    setIsSubmitted(true);
    setTimeout(() => {
      onLoginSuccess(targetUserId);
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  // Handle Quick Login as Role
  const handleQuickLogin = (role: 'client' | 'lawyer' | 'admin') => {
    const roleMap: Record<string, string> = {
      client: 'user-client-1',
      lawyer: 'user-lawyer-1',
      admin: 'user-admin-1',
    };
    const userId = roleMap[role];
    setSuccessMessage(`ورود سریع به عنوان ${role === 'client' ? 'موکل' : role === 'lawyer' ? 'وکیل پایه یک' : 'مدیر سامانه'} تایید شد.`);
    setIsSubmitted(true);
    setTimeout(() => {
      onLoginSuccess(userId);
      setIsSubmitted(false);
      onClose();
    }, 900);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (selectedRole === 'lawyer') {
      const newLawyer: Lawyer = {
        id: `lawyer-${Date.now()}`,
        name: name.trim(),
        title: `وکیل پایه یک دادگستری - ${specialty}`,
        licenseNumber: licenseNumber || `${Math.floor(10000 + Math.random() * 90000)}/ک`,
        barAssociation,
        avatar: '/src/assets/images/client_profile_avatar_1793192628292.jpg',
        rating: 5.0,
        reviewCount: 0,
        experienceYears: Number(experienceYears) || 3,
        winRate: 92,
        city: city || 'تهران',
        address: `${province}، دفتر وکالت رسمی`,
        phone,
        email: email || 'lawyer@dadgostar.ir',
        shebaNumber: shebaNumber.startsWith('IR') ? shebaNumber : `IR${shebaNumber}`,
        specialties: [specialty, 'قراردادها'],
        bio: 'وکیل پایه یک دادگستری و عضو کانون وکلا، متعهد به دفاع از حقوق موکلین طبق موازین قانونی و اخلاق حرفه‌ای.',
        education: 'کارشناسی ارشد حقوق خصوصی',
        pricing: {
          phone15min: 300000,
          phone30min: 500000,
          textConsultation: 200000,
          videoConsultation: 750000,
          draftPetition: 1200000,
        },
        isVerified: false,
        verificationStatus: 'pending',
        isOnline: true,
        idCardDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        barLicenseDocUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
        photoDocUrl: '/src/assets/images/client_profile_avatar_1793192628292.jpg',
        reviews: [],
      };

      onRegisterLawyer(newLawyer);
      setSuccessMessage('ثبت‌نام اولیه وکیل با وضعیت «در انتظار تایید مدارک» ثبت شد. پیامک تایید پس از بررسی مدیر ارسال می‌گردد.');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2500);
    } else {
      // Client quick register
      setSuccessMessage('ثبت‌نام موکل با موفقیت تکمیل شد و حساب کاربری شما فعال گردید.');
      setIsSubmitted(true);
      setTimeout(() => {
        onLoginSuccess('user-client-1');
        setIsSubmitted(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in text-right">
      <div 
        className="relative w-full max-w-lg bg-[#0B1120] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-[#0B1120] to-amber-950/20 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{authMode === 'login' ? 'ورود به سامانه دادگستر' : 'ثبت‌نام و عضویت در سامانه'}</span>
                <span className="text-[10px] bg-[#F59E0B]/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  امنیت ثنا
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                پلتفرم خدمات حقوقی آنلاین متصل به سامانه عدل‌ایران
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setIsSubmitted(false);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'login'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md shadow-[#F59E0B]/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>ورود به حساب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setIsSubmitted(false);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'register'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md shadow-[#F59E0B]/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>ثبت‌نام جدید</span>
          </button>
        </div>

        {/* Role Selector Tabs (Client vs Lawyer) */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800/60 bg-slate-900/30">
          <span className="block text-[11px] text-slate-400 mb-1.5 font-medium">انتخاب سطح دسترسی:</span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedRole('client')}
              className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2.5 ${
                selectedRole === 'client'
                  ? 'bg-amber-500/15 border-[#F59E0B] text-amber-300 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <User className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-100">موکل (کاربر عادی)</div>
                <div className="text-[10px] text-slate-400">مشاوره و پیگیری پرونده</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('lawyer')}
              className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2.5 ${
                selectedRole === 'lawyer'
                  ? 'bg-amber-500/15 border-[#F59E0B] text-amber-300 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Award className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-100">وکیل دادگستری</div>
                <div className="text-[10px] text-slate-400">پروانه وکالت و مشاوره آنلاین</div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {isSubmitted ? (
            <div className="p-6 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">{successMessage}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                در حال بارگذاری داده‌های رمزنگاری شده...
              </p>
            </div>
          ) : authMode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  شماره تلفن همراه (ثبت‌شده در سامانه ثنا):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pr-4 pl-10 text-center font-mono text-slate-100 focus:outline-none focus:border-[#F59E0B]"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              {!useOtp ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-medium">کلمه عبور:</label>
                    <button
                      type="button"
                      onClick={() => setUseOtp(true)}
                      className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                    >
                      ورود با رمز یکبارمصرف پیامکی (OTP)
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="کلمه عبور"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pr-4 pl-10 text-slate-100 focus:outline-none focus:border-[#F59E0B]"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-medium">کد پیامک‌شده ۶ رقمی:</label>
                    <button
                      type="button"
                      onClick={() => setUseOtp(false)}
                      className="text-[10px] text-slate-400 hover:underline cursor-pointer"
                    >
                      ورود با کلمه عبور
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      dir="ltr"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="۱ ۲ ۳ ۴ ۵ ۶"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 text-center tracking-widest font-mono text-amber-400 font-bold focus:outline-none focus:border-[#F59E0B]"
                    />
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-12 bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-[#F59E0B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" />
                <span>ورود امن به سامانه</span>
              </button>

              {/* Quick Login One-Click Demo Accounts */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] text-slate-400 block">ورود سریع برای تست نقش‌ها:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('client')}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-[10px] font-medium text-slate-200 transition-colors cursor-pointer text-center"
                  >
                    موکل (علی رضایی)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('lawyer')}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-[10px] font-medium text-slate-200 transition-colors cursor-pointer text-center"
                  >
                    وکیل (دکتر تهرانی)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-[10px] font-medium text-slate-200 transition-colors cursor-pointer text-center"
                  >
                    مدیر سامانه (ادمین)
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: علیرضا موسوی"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">شماره همراه (ثبت در ثنا):</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center font-mono text-slate-100 focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">استان:</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="تهران"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">شهر:</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="تهران"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              {selectedRole === 'lawyer' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-300 mb-1">شماره پروانه وکالت:</label>
                      <input
                        type="text"
                        required
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="مثال: ۲۹۸۴۰/ک"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-[#F59E0B]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">تخصص اصلی:</label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-[#F59E0B] cursor-pointer"
                      >
                        <option value="ملکی و سرقفلی">ملکی و سرقفلی</option>
                        <option value="کیفری و جرایم اقتصادی">کیفری و جرایم اقتصادی</option>
                        <option value="خانواده و ارث">خانواده و ارث</option>
                        <option value="قراردادها و شرکت‌ها">قراردادها و شرکت‌ها</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">
                      شماره شبا رسمی وکیل (جهت تسویه آنلاین):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={shebaNumber}
                      onChange={(e) => setShebaNumber(e.target.value)}
                      placeholder="IR72017..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-center text-amber-300 font-bold focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  {/* Upload License Document */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
                      بارگذاری تصویر پروانه وکالت (الزامی):
                    </span>
                    <div className="border border-dashed border-amber-500/40 p-3 rounded-xl bg-slate-900/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">تصویر_پروانه_وکالت.jpg</span>
                      <span className="text-emerald-400 font-bold">پیوست شد ✓</span>
                    </div>
                    <p className="text-[10px] text-amber-400/90 leading-tight">
                      * پروانه وکالت پس از ارسال توسط ادمین در پایگاه داده اعتبارسنجی شده و وضعیت از pending به approved تغییر خواهد کرد.
                    </p>
                  </div>
                </>
              )}

              {/* Terms Checkbox with Valid Links */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="rounded text-[#F59E0B] focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-400 cursor-pointer">
                  قوانین و مقررات راه‌اندازی و حفظ محرمانگی سامانه دادگستر را می‌پذیرم.
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={!termsAccepted}
                className="w-full h-12 bg-[#F59E0B] hover:bg-[#d97706] disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-[#F59E0B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {selectedRole === 'lawyer'
                    ? 'ثبت‌نام و ارسال مدارک پروانه برای تایید مدیر'
                    : 'تکمیل ثبت‌نام موکل و ورود به سامانه'}
                </span>
              </button>
            </form>
          )}

          {/* Valid Official Links Section */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] text-slate-400 font-medium block">
              پیوندهای معتبر و درگاه‌های رسمی قضایی:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://sana.adliran.ir"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-[10px] text-slate-300 transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>سامانه ثنا (عدل‌ایران)</span>
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
              </a>

              <a
                href="https://adliran.ir"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-[10px] text-slate-300 transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Scale className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                  <span>درگاه قوه قضاییه</span>
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-[#F59E0B] shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <span>سامانه احراز هویت متمرکز دادگستر</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};
