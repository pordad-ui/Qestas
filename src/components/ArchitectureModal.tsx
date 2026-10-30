import React, { useState } from 'react';
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
  Copy,
  Check,
  Terminal,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'serializers' | 'views' | 'urls' | 'json'>('overview');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabId);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const modelsCode = `import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('شماره تلفن همراه الزامی است.')
        extra_fields.setdefault('is_active', True)
        user = self.model(phone_number=phone_number, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(phone_number, password, **extra_fields)

# 1. Custom User Model (Phone, Email, Password, Role)
class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('user', 'کاربر عادی (موکل)'),
        ('lawyer', 'وکیل دادگستری'),
        ('admin', 'مدیر سامانه (ادمین)'),
    )
    phone_regex = RegexValidator(regex=r'^09\\d{9}$', message='شماره همراه باید ۱۱ رقم باشد.')

    id = models.BigAutoField(primary_key=True)
    phone_number = models.CharField(max_length=11, unique=True, validators=[phone_regex], db_index=True)
    email = models.EmailField(max_length=255, unique=True, null=True, blank=True, db_index=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    province = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/%Y/%m/', blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user', db_index=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['first_name', 'last_name']

# 2. Lawyer Profile & Admin Verification
class LawyerProfile(models.Model):
    VERIFICATION_STATUS_CHOICES = (
        ('pending', 'در انتظار بررسی مدارک'),
        ('approved', 'تایید شده و فعال'),
        ('rejected', 'رد شده (نیازمند اصلاح مدارک)'),
    )
    sheba_regex = RegexValidator(regex=r'^IR\\d{24}$', message='شماره شبا باید با IR آغاز شود.')

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='lawyer_profile')
    license_number = models.CharField(max_length=50, unique=True)
    bar_association = models.CharField(max_length=150, default='کانون وکلای دادگستری مرکز')
    sheba_number = models.CharField(max_length=26, validators=[sheba_regex])
    specialties = models.JSONField(default=list, blank=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='pending', db_index=True)
    rejection_reason = models.TextField(blank=True, null=True) # دلیل رد مدارک جهت نمایش به وکیل
    verified_at = models.DateTimeField(blank=True, null=True)
    verified_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

# 3. Verification Documents (License & National ID)
class VerificationDocument(models.Model):
    DOC_TYPES = (
        ('law_license', 'تصویر پروانه وکالت'),
        ('national_id', 'تصویر کارت ملی هوشمند'),
        ('bar_card', 'کارت شناسایی کانون'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lawyer = models.ForeignKey(LawyerProfile, on_delete=models.CASCADE, related_name='verification_documents')
    document_type = models.CharField(max_length=30, choices=DOC_TYPES)
    document_file = models.FileField(upload_to='verification_docs/%Y/%m/')
    sha256_hash = models.CharField(max_length=64, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

# 4. Consultation Session (Text, Phone, Video)
class ConsultationSession(models.Model):
    SESSION_TYPES = (('text', 'مشاوره متنی'), ('phone', 'مشاوره تلفنی'), ('video', 'مشاوره تصویری'))
    STATUS_CHOICES = (('scheduled', 'برنامه‌ریزی شده'), ('in_progress', 'در حال برگزاری'), ('completed', 'خاتمه یافته'))

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_code = models.CharField(max_length=32, unique=True, db_index=True)
    client = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='client_consultations')
    lawyer = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='lawyer_consultations')
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES, default='text')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    scheduled_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    fee_amount = models.PositiveBigIntegerField(default=0)
    is_paid = models.BooleanField(default=False)
    room_token = models.CharField(max_length=128, blank=True, null=True)

# 5. Encrypted Messages & File Sharing (Encrypted at Rest)
class EncryptedMessage(models.Model):
    id = models.BigAutoField(primary_key=True)
    session = models.ForeignKey(ConsultationSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    encrypted_content = models.TextField() # AES-256 Ciphertext
    iv_nonce = models.CharField(max_length=64) # Cryptographic IV
    encrypted_attachment = models.FileField(upload_to='encrypted_attachments/%Y/%m/', blank=True, null=True)
    attachment_sha256 = models.CharField(max_length=64, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True, db_index=True)

# 6. Dynamic Menu (CMS Home Grid & Side Drawer with Soft Delete)
class DynamicMenu(models.Model):
    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True, allow_unicode=True)
    icon = models.CharField(max_length=60, default='Folder')
    target_url = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True) # Soft Delete / Hide toggle
    created_at = models.DateTimeField(auto_now_add=True)

# 7. Dynamic Text Management (Admin Editable UI Copy)
class DynamicText(models.Model):
    key = models.CharField(max_length=150, unique=True, db_index=True)
    value = models.TextField()
    category = models.CharField(max_length=50, default='general', db_index=True)
    updated_at = models.DateTimeField(auto_now=True)`;

  const serializersCode = `from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import (
    CustomUser, LawyerProfile, VerificationDocument,
    ConsultationSession, EncryptedMessage, DynamicMenu, DynamicText
)

# 1. User Registration (Auto-Approved)
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'email', 'province', 'city', 'profile_picture', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        return CustomUser.objects.create_user(password=password, role='user', **validated_data)

# 2. Lawyer Registration (Pending by default, uploads License & National ID)
class LawyerRegistrationSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    phone_number = serializers.CharField(max_length=11)
    license_number = serializers.CharField(max_length=50)
    sheba_number = serializers.CharField(max_length=26)
    license_image = serializers.FileField()
    national_id_image = serializers.FileField(required=False)

    def create(self, validated_data):
        # Creates CustomUser (role='lawyer') + LawyerProfile (status='pending')
        # + VerificationDocument with SHA-256 for License and National ID
        pass

# 3. Dynamic CMS Menu (Absolute CMS Control over Grids, Drawers, Bottom Nav)
class DynamicMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicMenu
        fields = [
            'id', 'location', 'title', 'slug', 'icon_name',
            'icon_style', 'color_theme', 'target_url', 'description',
            'badge_text', 'order', 'is_active'
        ]

# 4. Dynamic Text Manager (Zero Hardcoded Frontend UI)
class DynamicTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicText
        fields = ['id', 'key', 'value', 'category', 'description', 'updated_at']

# 5. Consultation & Encrypted Messages (AES-256 at rest)
class EncryptedMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EncryptedMessage
        fields = ['id', 'session', 'sender', 'encrypted_content', 'iv_nonce', 'encrypted_attachment', 'sent_at']`;

  const viewsCode = `from django.utils import timezone
from rest_framework import status, views, viewsets, permissions
from rest_framework.response import Response
from .models import CustomUser, LawyerProfile, DynamicMenu, ConsultationSession, EncryptedMessage
from .serializers import (
    UserRegistrationSerializer, LawyerRegistrationSerializer,
    LoginSerializer, LawyerDetailSerializer, LawyerRejectionSerializer,
    DynamicMenuSerializer, PublicDynamicMenuSerializer, EncryptedMessageSerializer
)

class IsPlatformAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.role == 'admin'))

# 1. Register User (Auto-Approved)
class UserRegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'success': True, 'user_id': user.id}, status=201)
        return Response({'success': False, 'errors': serializer.errors}, status=400)

# 2. Register Lawyer (Default: 'pending')
class LawyerRegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = LawyerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            lawyer = serializer.save()
            return Response({'success': True, 'message': 'در انتظار تایید مدیریت', 'status': 'pending'}, status=201)
        return Response({'success': False, 'errors': serializer.errors}, status=400)

# 3. Pending Lawyers List (Admin Review)
class PendingLawyersListView(views.APIView):
    permission_classes = [IsPlatformAdmin]
    def get(self, request):
        pending = LawyerProfile.objects.filter(verification_status='pending').order_by('-created_at')
        return Response({'count': pending.count(), 'results': LawyerDetailSerializer(pending, many=True).data})

# 4. Approve Lawyer (Admin)
class ApproveLawyerView(views.APIView):
    permission_classes = [IsPlatformAdmin]
    def post(self, request, lawyer_id):
        lawyer = LawyerProfile.objects.get(id=lawyer_id)
        lawyer.approve(admin_user=request.user)
        return Response({'success': True, 'message': 'وکیل با موفقیت تایید شد.'})

# 5. Reject Lawyer (Admin requires rejection_reason)
class RejectLawyerView(views.APIView):
    permission_classes = [IsPlatformAdmin]
    def post(self, request, lawyer_id):
        lawyer = LawyerProfile.objects.get(id=lawyer_id)
        serializer = LawyerRejectionSerializer(data=request.data)
        if serializer.is_valid():
            lawyer.reject(reason=serializer.validated_data['rejection_reason'], admin_user=request.user)
            return Response({'success': True, 'message': 'علت رد مدارک ثبت و ابلاغ شد.'})
        return Response(serializer.errors, status=400)

# 6. CMS Menus Soft Delete (Admin Toggle)
class ToggleMenuVisibilityView(views.APIView):
    permission_classes = [IsPlatformAdmin]
    def post(self, request, menu_id):
        menu = DynamicMenu.objects.get(id=menu_id)
        is_active = menu.toggle_visibility()
        return Response({'success': True, 'is_active': is_active})

# 7. Public Menus for Mobile App (Only Active Sections)
class PublicDynamicMenuListAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        active = DynamicMenu.objects.filter(is_active=True).order_by('order')
        return Response({'sections': PublicDynamicMenuSerializer(active, many=True).data})`;

  const urlsCode = `from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegisterView, LawyerRegisterView, LoginView,
    PendingLawyersListView, ApproveLawyerView, RejectLawyerView,
    AdminDynamicMenuViewSet, ToggleMenuVisibilityView, PublicDynamicMenuListAPIView,
    AdminDashboardSummaryAPIView
)

router = DefaultRouter()
router.register(r'admin/menus', AdminDynamicMenuViewSet, basename='admin-menus')

urlpatterns = [
    # Auth
    path('auth/register/user/', UserRegisterView.as_view(), name='register-user'),
    path('auth/register/lawyer/', LawyerRegisterView.as_view(), name='register-lawyer'),
    path('auth/login/', LoginView.as_view(), name='login'),
    # Lawyer Verification
    path('admin/lawyers/pending/', PendingLawyersListView.as_view(), name='pending-lawyers'),
    path('admin/lawyers/<int:lawyer_id>/approve/', ApproveLawyerView.as_view(), name='approve-lawyer'),
    path('admin/lawyers/<int:lawyer_id>/reject/', RejectLawyerView.as_view(), name='reject-lawyer'),
    # Dynamic CMS Menus
    path('', include(router.urls)),
    path('admin/menus/<int:menu_id>/toggle-visibility/', ToggleMenuVisibilityView.as_view(), name='menu-toggle'),
    path('mobile/menus/', PublicDynamicMenuListAPIView.as_view(), name='mobile-menus'),
    # Admin Dashboard
    path('admin/dashboard/', AdminDashboardSummaryAPIView.as_view(), name='admin-dashboard'),
]`;

  const jsonSample = `{
  "success": true,
  "stats": {
    "total_users": 1420,
    "regular_clients": 1180,
    "total_lawyers": 240,
    "pending_lawyers_count": 3,
    "approved_lawyers_count": 225,
    "rejected_lawyers_count": 12
  },
  "pending_lawyers": [
    {
      "id": 14,
      "first_name": "وحید",
      "last_name": "صابری",
      "phone_number": "09123456789",
      "province": "تهران",
      "city": "تهران",
      "sheba_number": "IR440180000000011223344556",
      "role": "lawyer",
      "verification_status": "pending",
      "rejection_reason": null,
      "license_image_url": "https://api.dadgostar.ir/media/lawyers/licenses/2026/10/license_14.jpg",
      "profile_picture_url": "https://api.dadgostar.ir/media/lawyers/avatars/2026/10/vahid_avatar.jpg",
      "date_joined": "2026-10-28 11:20:00"
    }
  ],
  "app_sections": [
    {
      "id": 1,
      "title": "خدمات حقوقی",
      "slug": "legal-services",
      "icon_name": "Briefcase",
      "route_target": "services",
      "order": 1,
      "is_hidden": false
    },
    {
      "id": 2,
      "title": "بانک وکلا",
      "slug": "lawyer-bank",
      "icon_name": "Users",
      "route_target": "lawyers",
      "order": 2,
      "is_hidden": false
    },
    {
      "id": 3,
      "title": "پیگیری دادرسی",
      "slug": "case-tracking",
      "icon_name": "Gavel",
      "route_target": "cases",
      "order": 3,
      "is_hidden": false
    },
    {
      "id": 4,
      "title": "بانک قوانین",
      "slug": "legal-laws",
      "icon_name": "BookOpen",
      "route_target": "laws",
      "order": 4,
      "is_hidden": false
    }
  ],
  "system_info": {
    "framework": "Django 5.1 & Django REST Framework 3.15",
    "database": "PostgreSQL 16 (pgcrypto + Row-Level Security)"
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center">
              <Server className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>معماری بک‌اند و اندپوئینت‌های جنگو (Django + PostgreSQL)</span>
                <span className="text-[10px] bg-[#F59E0B]/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  Django REST 5.1
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                مدل‌های دیتابیس، سیستم تایید وکلا، احراز هویت دوسطحی و مدیریت محتوای اپ موبایل
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#F59E0B] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            معماری امنیتی
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'models' ? 'bg-[#F59E0B] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مدل‌ها (models.py)
          </button>
          <button
            onClick={() => setActiveTab('serializers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'serializers' ? 'bg-[#F59E0B] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            سریالایزرها (serializers.py)
          </button>
          <button
            onClick={() => setActiveTab('views')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'views' ? 'bg-[#F59E0B] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ویوها (views.py)
          </button>
          <button
            onClick={() => setActiveTab('urls')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'urls' ? 'bg-[#F59E0B] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            روت‌ها (urls.py)
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'json' ? 'bg-[#F59E0B] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            پاسخ JSON داشبورد ادمین
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>تایید دو مرحله‌ای وکلا</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    وکلا پس از ثبت‌نام وضعیت <code>pending</code> دریافت کرده و تا تایید دستی مدیر اجازه ارائه خدمات ندارند.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Database className="w-4 h-4" />
                    <span>پایگاه داده PostgreSQL 16</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    جداول کاربران، پروفایل وکلا، تصاویر پروانه و منوهای اپلیکیشن با کلیدهای یکتا و شاخص‌های با سرعت بالا.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Layers className="w-4 h-4" />
                    <span>مدیریت منوها (Soft Delete)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    امکان مخفی کردن بخش‌های اپلیکیشن (مثل بانک وکلا) بدون حذف رکورد از دیتابیس توسط ادمین.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-200">مسیر فایل‌های ذخیره‌شده روی سرور:</h3>
                <ul className="space-y-1.5 text-[11px] font-mono text-slate-400" dir="ltr">
                  <li>📁 backend/models.py <span className="text-emerald-400">(User, Lawyer, AppMenu models)</span></li>
                  <li>📁 backend/serializers.py <span className="text-emerald-400">(DRF Serializers with validators)</span></li>
                  <li>📁 backend/views.py <span className="text-emerald-400">(Auth, Verification, CMS views)</span></li>
                  <li>📁 backend/urls.py <span className="text-emerald-400">(All RESTful endpoints)</span></li>
                  <li>📁 backend/admin.py <span className="text-emerald-400">(Django Admin with license image previews)</span></li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">backend/models.py</span>
                <button
                  onClick={() => handleCopy(modelsCode, 'models')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedTab === 'models' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'models' ? 'کپی شد' : 'کپی کد'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed max-h-[50vh]" dir="ltr">
                {modelsCode}
              </pre>
            </div>
          )}

          {activeTab === 'serializers' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">backend/serializers.py</span>
                <button
                  onClick={() => handleCopy(serializersCode, 'serializers')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedTab === 'serializers' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'serializers' ? 'کپی شد' : 'کپی کد'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed max-h-[50vh]" dir="ltr">
                {serializersCode}
              </pre>
            </div>
          )}

          {activeTab === 'views' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">backend/views.py</span>
                <button
                  onClick={() => handleCopy(viewsCode, 'views')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedTab === 'views' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'views' ? 'کپی شد' : 'کپی کد'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed max-h-[50vh]" dir="ltr">
                {viewsCode}
              </pre>
            </div>
          )}

          {activeTab === 'urls' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">backend/urls.py</span>
                <button
                  onClick={() => handleCopy(urlsCode, 'urls')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedTab === 'urls' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'urls' ? 'کپی شد' : 'کپی کد'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed max-h-[50vh]" dir="ltr">
                {urlsCode}
              </pre>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">GET /api/admin/dashboard/ Response</span>
                <button
                  onClick={() => handleCopy(jsonSample, 'json')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedTab === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'json' ? 'کپی شد' : 'کپی JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed max-h-[50vh]" dir="ltr">
                {jsonSample}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            تمام فایل‌های جنگو در دایرکتوری backend/ ایجاد و ذخیره شده‌اند.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
