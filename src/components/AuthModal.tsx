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
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [selectedRole, setSelectedRole] = useState<UserRole>('lawyer');

  // Lawyer Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [barAssociation, setBarAssociation] = useState('کانون وکلای دادگستری مرکز');
  const [specialty, setSpecialty] = useState('ملکی و سرقفلی');
  const [shebaNumber, setShebaNumber] = useState('IR');
  const [experienceYears, setExperienceYears] = useState(5);
  const [bio, setBio] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

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
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        reviewCount: 0,
        experienceYears: Number(experienceYears) || 3,
        winRate: 90,
        city: 'تهران',
        address: 'تهران، دفتر وکالت تعیینی',
        phone,
        email: email || 'lawyer@dadgostar.ir',
        shebaNumber: shebaNumber.startsWith('IR') ? shebaNumber : `IR${shebaNumber}`,
        specialties: [specialty, 'قراردادها'],
        bio: bio || 'وکیل پایه یک دادگستری متعهد به دفاع از حقوق موکلین طبق موازین قانونی و اخلاق حرفه‌ای.',
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
        photoDocUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        reviews: [],
      };

      onRegisterLawyer(newLawyer);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2500);
    } else {
      // Client quick register
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                ثبت‌نام و عضویت در سامانه جامع دادگستر
              </h2>
              <p className="text-xs text-slate-400">
                تفکیک سطوح دسترسی موکلین و وکلای پایه یک دادگستری
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50">
          <label className="block text-xs font-semibold text-slate-300 mb-2">نوع حساب کاربری:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('client')}
              className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 ${
                selectedRole === 'client'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <User className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-100">من موکل هستم</div>
                <div className="text-[10px] text-slate-400">دریافت مشاوره و پیگیری پرونده</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('lawyer')}
              className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 ${
                selectedRole === 'lawyer'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-100">من وکیل هستم</div>
                <div className="text-[10px] text-slate-400">ارائه خدمات، مشاوره و تنظیم اوراق</div>
              </div>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {isSubmitted ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">مدارک و اطلاعات شما با موفقیت دریافت شد</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                {selectedRole === 'lawyer'
                  ? 'اطلاعات پروانه وکالت و شماره شبا جهت احراز اصالت در کارتابل مدیر سیستم قرار گرفت. پس از تایید مدیر، نشان وکیل فعال خواهد شد.'
                  : 'حساب کاربری موکل با موفقیت ایجاد گردید.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: دکتر علیرضا رضوی"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {selectedRole === 'lawyer' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">شماره پروانه وکالت دادگستری:</label>
                      <input
                        type="text"
                        required
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="مثال: ۲۹۸۴۰/ک"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">مرجع صادرکننده پروانه:</label>
                      <select
                        value={barAssociation}
                        onChange={(e) => setBarAssociation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="کانون وکلای دادگستری مرکز">کانون وکلای دادگستری مرکز (تهران)</option>
                        <option value="مرکز وکلای قوه قضاییه">مرکز وکلای قوه قضاییه</option>
                        <option value="کانون وکلای اصفهان">کانون وکلای دادگستری اصفهان</option>
                        <option value="کانون وکلای خراسان">کانون وکلای دادگستری خراسان</option>
                        <option value="کانون وکلای فارس">کانون وکلای دادگستری فارس</option>
                      </select>
                    </div>
                  </div>

                  {/* Sheba Number */}
                  <div>
                    <label className="block text-slate-300 mb-1">
                      شماره شبا رسمی وکیل (جهت تسویه آنلاین واریزی‌ها):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={shebaNumber}
                      onChange={(e) => setShebaNumber(e.target.value)}
                      placeholder="IR..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-center text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Required Documents Upload for Lawyer */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>بارگذاری مدارک هویتی جهت تایید مدیر سیستم:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="border border-dashed border-slate-700 p-2.5 rounded-xl text-center space-y-1 bg-slate-900/60">
                        <span className="text-[11px] text-slate-300 block font-semibold">۱. تصویر کارت ملی</span>
                        <span className="text-[10px] text-emerald-400">ضمیمه شد ✓</span>
                      </div>

                      <div className="border border-dashed border-slate-700 p-2.5 rounded-xl text-center space-y-1 bg-slate-900/60">
                        <span className="text-[11px] text-slate-300 block font-semibold">۲. پروانه وکالت معتبر</span>
                        <span className="text-[10px] text-emerald-400">ضمیمه شد ✓</span>
                      </div>

                      <div className="border border-dashed border-slate-700 p-2.5 rounded-xl text-center space-y-1 bg-slate-900/60">
                        <span className="text-[11px] text-slate-300 block font-semibold">۳. عکس پرسنلی ۳*۴</span>
                        <span className="text-[10px] text-emerald-400">ضمیمه شد ✓</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {selectedRole === 'lawyer'
                    ? 'ثبت‌نام و ارسال مدارک برای تایید مدیر'
                    : 'تکمیل ثبت‌نام موکل و ورود به سامانه'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
