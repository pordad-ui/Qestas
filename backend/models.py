"""
=============================================================================
DADGOSTAR LEGAL PLATFORM - COMPLETE DATABASE MODELS (PostgreSQL + Django ORM)
=============================================================================
Architecture & Schema Specification:
1. CustomUserManager & CustomUser: Multi-role authentication (User, Lawyer, Admin)
   supporting Phone Number (primary), Email, and Password.
2. LawyerProfile: Extension model for lawyers with verification lifecycle
   ('pending', 'approved', 'rejected') and mandatory 'rejection_reason'.
3. VerificationDocument: Digital proof uploads (Law License Image, National ID Card Image,
   Bar ID Card) with cryptographic SHA-256 integrity hash.
4. ConsultationSession: Secure session tracking (Text chat, Direct Phone, WebRTC Video).
5. EncryptedMessage: End-to-end encrypted messaging & document storage at rest (AES-256).
6. DynamicMenu: Absolute CMS control over ALL UI navigation areas:
   - Home Screen Grid (3-column layout)
   - Side Drawer Menu (sliding from right)
   - Fixed Mobile Bottom Navigation Bar (4 icons)
   - Sub-Menus (horizontal scrollable chips/pills)
   - Secondary Tools Row
   Includes dynamic URL routing, icon names/styles, order, and is_active (Soft Delete).
7. DynamicText: Complete text manager (key-value table) for zero hardcoded frontend copy.
=============================================================================
"""

import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator
from django.utils import timezone


# ===========================================================================
# 1. CUSTOM USER MANAGER (Authentication via Phone Number & Email)
# ===========================================================================
class CustomUserManager(BaseUserManager):
    """
    Custom user manager supporting authentication via phone_number (primary)
    or email, with role differentiation (Regular User, Lawyer, Admin).
    """
    def create_user(self, phone_number, email=None, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('شماره تلفن همراه برای ثبت‌نام در سامانه الزامی است.')
        
        if email:
            email = self.normalize_email(email)
            
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'user')
        
        user = self.model(phone_number=phone_number, email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
            
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('مدیر ارشد باید دارای دسترسی is_staff=True باشد.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('مدیر ارشد باید دارای دسترسی is_superuser=True باشد.')

        return self.create_user(phone_number, email, password, **extra_fields)


# ===========================================================================
# 2. CUSTOM USER MODEL (Regular Users, Lawyers, and Admins)
# ===========================================================================
class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Base user model for all platform personas:
    - Regular User: Auto-approved upon registration (Auto-Approved).
    - Lawyer: Profile defaults to 'pending' verification by Admin.
    - Admin: Superuser / staff with full CMS and verification authority.
    """
    ROLE_CHOICES = (
        ('user', 'کاربر عادی (موکل)'),
        ('lawyer', 'وکیل دادگستری'),
        ('admin', 'مدیر سامانه (ادمین)'),
    )

    phone_regex = RegexValidator(
        regex=r'^09\d{9}$',
        message='شماره همراه باید ۱۱ رقم بوده و با ۰۹ آغاز گردد (الگو: ۰۹۱۲۳۴۵۶۷۸۹).'
    )

    id = models.BigAutoField(primary_key=True)
    phone_number = models.CharField(
        max_length=11,
        unique=True,
        validators=[phone_regex],
        db_index=True,
        verbose_name='شماره همراه (شناسه ورود اصلی)'
    )
    email = models.EmailField(
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        verbose_name='پست الکترونیک (ایمیل)'
    )
    first_name = models.CharField(max_length=150, verbose_name='نام')
    last_name = models.CharField(max_length=150, verbose_name='نام خانوادگی')
    province = models.CharField(max_length=100, blank=True, null=True, verbose_name='استان')
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name='شهر')
    profile_picture = models.ImageField(
        upload_to='profiles/%Y/%m/',
        blank=True,
        null=True,
        verbose_name='تصویر پرسنلی / آواتار'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='user',
        db_index=True,
        verbose_name='نقش در سامانه'
    )

    # System & Audit Flags
    is_active = models.BooleanField(default=True, verbose_name='حساب فعال است')
    is_staff = models.BooleanField(default=False, verbose_name='دسترسی به کارتابل مدیریت')
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ثبت‌نام')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ آخرین ویرایش')

    objects = CustomUserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'کاربر سامانه'
        verbose_name_plural = 'کاربران'
        db_table = 'legal_users'
        ordering = ['-date_joined']

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_regular_user(self):
        return self.role == 'user'

    @property
    def is_lawyer(self):
        return self.role == 'lawyer'

    @property
    def is_admin_user(self):
        return self.role == 'admin' or self.is_staff

    def __str__(self):
        return f"{self.full_name} ({self.phone_number}) - {self.get_role_display()}"


# Backward compatibility alias
User = CustomUser


# ===========================================================================
# 3. LAWYER PROFILE & VERIFICATION LIFECYCLE
# ===========================================================================
class LawyerProfile(models.Model):
    """
    Profile extension for Lawyers:
    - Status starts at 'pending' until an Admin audits the license and national ID.
    - If rejected, rejection_reason MUST be preserved and communicated to the lawyer.
    - Lawyer cannot access lawyer features until approved by Admin.
    """
    VERIFICATION_STATUS_CHOICES = (
        ('pending', 'در انتظار بررسی مدارک'),
        ('approved', 'تایید شده و فعال'),
        ('rejected', 'رد شده (نیازمند اصلاح مدارک)'),
    )

    sheba_regex = RegexValidator(
        regex=r'^IR\d{24}$',
        message='شماره شبا باید با IR شروع شده و ۲۴ رقم داشته باشد (الگو: IR440180...).'
    )

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='lawyer_profile',
        verbose_name='کاربر پایه'
    )
    license_number = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='شماره پروانه وکالت'
    )
    bar_association = models.CharField(
        max_length=150,
        default='کانون وکلای دادگستری مرکز',
        verbose_name='مرجع صادرکننده پروانه'
    )
    sheba_number = models.CharField(
        max_length=26,
        validators=[sheba_regex],
        verbose_name='شماره شبا رسمی وکیل'
    )
    specialties = models.JSONField(
        default=list,
        blank=True,
        verbose_name='حوزه‌های تخصصی (ملکی، کیفری، خانواده، شرکت‌ها)'
    )
    bio = models.TextField(
        blank=True,
        null=True,
        verbose_name='بیوگرافی و سوابق حرفه‌ای'
    )
    years_of_experience = models.PositiveIntegerField(
        default=3,
        verbose_name='سابقه وکالت (سال)'
    )

    # Verification Lifecycle & Administrative Audit
    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS_CHOICES,
        default='pending',
        db_index=True,
        verbose_name='وضعیت تایید احراز هویت'
    )
    rejection_reason = models.TextField(
        blank=True,
        null=True,
        verbose_name='علت دقیق رد مدارک توسط مدیر (ارسال و نمایش به وکیل)'
    )
    verified_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='تاریخ و زمان تایید یا رد'
    )
    verified_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_lawyers',
        verbose_name='مدیر بررسی‌کننده'
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ آخرین به‌روزرسانی')

    class Meta:
        verbose_name = 'پروفایل وکیل دادگستری'
        verbose_name_plural = 'پروفایل‌های وکلا'
        db_table = 'legal_lawyer_profiles'
        ordering = ['-created_at']

    @property
    def is_verified(self):
        return self.verification_status == 'approved'

    def approve(self, admin_user):
        """تایید صلاحیت وکیل و فعال‌سازی اختیارات کامل وکالت"""
        self.verification_status = 'approved'
        self.rejection_reason = None
        self.verified_at = timezone.now()
        self.verified_by = admin_user
        self.save(update_fields=['verification_status', 'rejection_reason', 'verified_at', 'verified_by', 'updated_at'])

    def reject(self, reason, admin_user):
        """رد مدارک با ثبت الزامی علت رد جهت نمایش و ارسال به وکیل"""
        self.verification_status = 'rejected'
        self.rejection_reason = reason
        self.verified_at = timezone.now()
        self.verified_by = admin_user
        self.save(update_fields=['verification_status', 'rejection_reason', 'verified_at', 'verified_by', 'updated_at'])

    def __str__(self):
        return f"وکیل {self.user.full_name} ({self.get_verification_status_display()})"


# Backward compatibility alias
Lawyer = LawyerProfile


# ===========================================================================
# 4. VERIFICATION DOCUMENTS (Law License Image & National ID Card Image)
# ===========================================================================
class VerificationDocument(models.Model):
    """
    Stores authenticated file uploads for lawyer compliance:
    - Law License Image (تصویر پروانه وکالت)
    - National ID Card Image (تصویر کارت ملی هوشمند)
    - Bar Association Membership Card (کارت شناسایی کانون)
    Includes SHA-256 fingerprint for tamper-proof judicial auditing.
    """
    DOC_TYPES = (
        ('law_license', 'تصویر پروانه وکالت دادگستری'),
        ('national_id', 'تصویر کارت ملی هوشمند'),
        ('bar_card', 'کارت شناسایی کانون / مرکز وکلا'),
        ('other', 'سایر مدارک اثباتی'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lawyer = models.ForeignKey(
        LawyerProfile,
        on_delete=models.CASCADE,
        related_name='verification_documents',
        verbose_name='وکیل مربوطه'
    )
    document_type = models.CharField(
        max_length=30,
        choices=DOC_TYPES,
        verbose_name='نوع مدرک'
    )
    document_file = models.FileField(
        upload_to='verification_docs/%Y/%m/',
        verbose_name='فایل بارگذاری‌شده'
    )
    sha256_hash = models.CharField(
        max_length=64,
        blank=True,
        null=True,
        verbose_name='اثر انگشت رمزنگاری‌شده (SHA-256 Hash)'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name='زمان بارگذاری')
    is_verified = models.BooleanField(default=False, verbose_name='اصالت مدرک تایید شده است')

    class Meta:
        verbose_name = 'سند احراز هویت وکیل'
        verbose_name_plural = 'اسناد احراز هویت وکلا'
        db_table = 'legal_verification_documents'
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.get_document_type_display()} - {self.lawyer.user.full_name}"


# ===========================================================================
# 5. ENCRYPTED CONSULTATION & MESSAGING (Encrypted at Rest)
# ===========================================================================
class ConsultationSession(models.Model):
    """
    Manages interactive consultations between a Regular User (Client) and an Approved Lawyer.
    Supported types: Text Chat, Phone Consultation, Video Conference.
    """
    SESSION_TYPES = (
        ('text', 'مشاوره متنی آنلاین'),
        ('phone', 'مشاوره تلفنی مستقیم'),
        ('video', 'جلسه دادرسی و مشاوره تصویری امن'),
    )

    STATUS_CHOICES = (
        ('scheduled', 'برنامه‌ریزی شده و در انتظار زمان مقرر'),
        ('in_progress', 'جلسه در حال برگزاری'),
        ('completed', 'مشاوره با موفقیت خاتمه یافت'),
        ('cancelled', 'لغو شده'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_code = models.CharField(
        max_length=32,
        unique=True,
        db_index=True,
        verbose_name='کد رهگیری جلسه مشاوره'
    )
    client = models.ForeignKey(
        CustomUser,
        on_delete=models.PROTECT,
        related_name='client_consultations',
        limit_choices_to={'role': 'user'},
        verbose_name='موکل'
    )
    lawyer = models.ForeignKey(
        CustomUser,
        on_delete=models.PROTECT,
        related_name='lawyer_consultations',
        limit_choices_to={'role': 'lawyer'},
        verbose_name='وکیل منتخب'
    )
    session_type = models.CharField(
        max_length=20,
        choices=SESSION_TYPES,
        default='text',
        verbose_name='نوع مشاوره'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled',
        db_index=True,
        verbose_name='وضعیت جلسه'
    )
    scheduled_at = models.DateTimeField(verbose_name='زمان شروع تعیین‌شده')
    duration_minutes = models.PositiveIntegerField(default=30, verbose_name='مدت زمان (دقیقه)')
    fee_amount = models.PositiveBigIntegerField(default=0, verbose_name='مبلغ حق‌المشاوره (تومان)')
    is_paid = models.BooleanField(default=False, verbose_name='پرداخت شده از درگاه شاپرک')
    
    # WebRTC & Cryptographic Room Token
    room_token = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        verbose_name='توکن اختصاصی اتاق امن WebRTC'
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ آخرین تغییر')

    class Meta:
        verbose_name = 'جلسه مشاوره حقوقی'
        verbose_name_plural = 'جلسات مشاوره حقوقی'
        db_table = 'legal_consultation_sessions'
        ordering = ['-scheduled_at']

    def can_access(self, user):
        """Security: Strictly restricts access to the participating Client, assigned Lawyer, or Superadmin."""
        if user.is_staff or user.role == 'admin':
            return True
        return user.id == self.client_id or user.id == self.lawyer_id

    def __str__(self):
        return f"{self.get_session_type_display()} | موکل: {self.client.full_name} - وکیل: {self.lawyer.full_name}"


class EncryptedMessage(models.Model):
    """
    Stores encrypted conversation messages and file attachments at rest:
    - Encrypted content: AES-256 ciphertext payload with cryptographic IV.
    - Encrypted attachment: Uploaded documents encrypted before disk persistence.
    - Security: Only the specific client and lawyer involved in the session can access.
    """
    id = models.BigAutoField(primary_key=True)
    session = models.ForeignKey(
        ConsultationSession,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='جلسه مشاوره مربوطه'
    )
    sender = models.ForeignKey(
        CustomUser,
        on_delete=models.PROTECT,
        related_name='sent_messages',
        verbose_name='ارسال‌کننده'
    )

    # Cryptographic Storage at Rest (AES-256)
    encrypted_content = models.TextField(
        verbose_name='متن پیام رمزنگاری‌شده (Ciphertext Payload)'
    )
    iv_nonce = models.CharField(
        max_length=64,
        verbose_name='بردار مقداردهی اولیه رمزنگاری (IV / Nonce)'
    )

    # Encrypted File Attachment
    encrypted_attachment = models.FileField(
        upload_to='encrypted_attachments/%Y/%m/',
        blank=True,
        null=True,
        verbose_name='فایل پیوست رمزنگاری‌شده در دیسک'
    )
    attachment_original_name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='نام اصلی فایل'
    )
    attachment_sha256 = models.CharField(
        max_length=64,
        blank=True,
        null=True,
        verbose_name='کد صحت فایل (SHA-256 Checksum)'
    )

    is_read = models.BooleanField(default=False, verbose_name='پیام خوانده شده است')
    sent_at = models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='زمان ارسال')
    read_at = models.DateTimeField(blank=True, null=True, verbose_name='زمان خوانده‌شدن')

    class Meta:
        verbose_name = 'پیام رمزنگاری‌شده'
        verbose_name_plural = 'پیام‌های رمزنگاری‌شده'
        db_table = 'legal_encrypted_messages'
        ordering = ['sent_at']

    def is_participant(self, user):
        """Security: Enforces participant-only access."""
        return self.session.can_access(user)

    def __str__(self):
        return f"پیام از {self.sender.full_name} در جلسه {self.session.session_code}"


# ===========================================================================
# 6. DYNAMIC CMS: MENUS & NAVIGATION (Absolute Control Over All App Areas)
# ===========================================================================
class DynamicMenu(models.Model):
    """
    Absolute CMS control over ALL UI navigation areas:
    1. 'home_grid': شبکه خدمات ۳ ستونه صفحه اصلی (Home Screen Grid)
    2. 'side_drawer': منوی کشویی جانبی بازشونده از راست (Side Drawer Menu)
    3. 'bottom_nav': نوار ناوبری ثابت پایین اپلیکیشن (Fixed Bottom Nav Bar)
    4. 'sub_menu': ردیف اسکرول‌شونده چیپس‌های زیرمنو (Sub-Menu Pills/Chips)
    5. 'secondary_tools': ردیف ابزارهای ثانویه منطقه شست (Thumb Zone Quick Tools)

    Capabilities:
    - Create, Edit, Reorder, and Soft Delete (Hide/Unhide via is_active)
    - Dynamic Routing: target_url accepts internal routes, query hash, or external judicial URLs.
    - Icon flexibility: icon_name supports Lucide, FontAwesome, IonIcons, or SVG names.
    - Style selection: linear minimal, solid, or colored rounded containers.
    - Visual badge text (e.g. 'جدید', '۲').
    """
    LOCATION_CHOICES = (
        ('home_grid', 'شبکه خدمات صفحه اصلی (گرید ۳ ستونه)'),
        ('side_drawer', 'منوی کشویی جانبی (Side Drawer)'),
        ('bottom_nav', 'نوار ناوبری ثابت پایین (Bottom Navigation Bar)'),
        ('sub_menu', 'زیرمنوهای چیپسی افقی (Sub-Menu Pills)'),
        ('secondary_tools', 'ابزارهای سریع منطقه شست (Thumb Zone Tools)'),
    )

    ICON_STYLE_CHOICES = (
        ('colored', 'رنگی با زمینه ملایم (Soft Colored Container)'),
        ('linear', 'خطی مینیمال (Minimal Linear)'),
        ('solid', 'توپر با کنتراست بالا (Solid High Contrast)'),
    )

    COLOR_THEME_CHOICES = (
        ('gold', 'طلایی لوکس عدلیه (#F59E0B)'),
        ('teal', 'سبز فیروزه‌ای دادگستری (#14B8A6)'),
        ('indigo', 'نیلی سازمانی (#6366F1)'),
        ('emerald', 'سبز زمردی (#10B981)'),
        ('cyan', 'آبی فیروزه‌ای روشن (#06B6D4)'),
        ('amber', 'کهربایی گرم (#D97706)'),
        ('slate', 'خاکستری تیره متالیک (#64748B)'),
    )

    id = models.BigAutoField(primary_key=True)
    location = models.CharField(
        max_length=30,
        choices=LOCATION_CHOICES,
        default='home_grid',
        db_index=True,
        verbose_name='محل قرارگیری در رابط کاربری اپلیکیشن'
    )
    title = models.CharField(
        max_length=120,
        verbose_name='عنوان منو / خدمت'
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        allow_unicode=True,
        verbose_name='شناسه یکتا (Slug)'
    )
    icon_name = models.CharField(
        max_length=80,
        default='Folder',
        verbose_name='نام آیکون (مانند: Gavel, Users, Briefcase, BookOpen, MessageSquare, Scale, Home, Landmark)'
    )
    icon_style = models.CharField(
        max_length=20,
        choices=ICON_STYLE_CHOICES,
        default='colored',
        verbose_name='سبک گرافیکی آیکون'
    )
    color_theme = models.CharField(
        max_length=20,
        choices=COLOR_THEME_CHOICES,
        default='gold',
        verbose_name='تم رنگی المان'
    )
    target_url = models.CharField(
        max_length=255,
        verbose_name='لینک / مسیر مسیریابی پویا در اپلیکیشن (مانند: #cases, #lawyers, /consultation, https://sana.adliran.ir)'
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='توضیح کوتاه زیر عنوان'
    )
    badge_text = models.CharField(
        max_length=30,
        blank=True,
        null=True,
        verbose_name='متن نشان برجسته (اختیاری، مانند: «جدید» یا «۲ پیام»)'
    )
    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name='ترتیب چینش در بخش مربوطه'
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name='فعال در اپلیکیشن (تغییر وضعیت جهت Soft Delete / Hide)'
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ آخرین تغییر')

    class Meta:
        verbose_name = 'منوی پویای اپلیکیشن (DynamicMenu CMS)'
        verbose_name_plural = 'مدیریت منوها و ناوبری (CMS)'
        db_table = 'legal_dynamic_menus'
        ordering = ['location', 'order', 'id']

    def toggle_visibility(self):
        """تغییر وضعیت نمایش (Soft Delete بدون از دست رفتن داده‌ها)"""
        self.is_active = not self.is_active
        self.save(update_fields=['is_active', 'updated_at'])
        return self.is_active

    def __str__(self):
        status = 'فعال' if self.is_active else 'مخفی (Soft-Deleted)'
        return f"[{self.get_location_display()}] {self.title} (ترتیب: {self.order} - {status})"


# Backward-compatible aliases for legacy imports
AppFeature = DynamicMenu
AppMenu = DynamicMenu


# ===========================================================================
# 7. DYNAMIC CMS: TEXT MANAGEMENT (Zero Hardcoded Frontend Copy)
# ===========================================================================
class DynamicText(models.Model):
    """
    Complete Text Manager: Enables Admin to edit EVERY text, label, placeholder,
    and title across the app via a key-value database table.
    The frontend acts as an empty shell that reads from this table.

    Key Examples:
    - 'app.title': 'دادگستر'
    - 'home.hero.title': 'پرونده فعال جاری (سامانه ثنا)'
    - 'home.hero.court': 'شعبه ۱۰۵ دادگاه عمومی حقوقی مجتمع شهید بهشتی'
    - 'home.services.header': 'خدمات و بخش‌های سامانه'
    - 'home.timeline.header': 'مراحل دادرسی پرونده'
    - 'bottom_nav.home.title': 'خانه'
    - 'bottom_nav.cases.title': 'پرونده‌ها'
    - 'bottom_nav.wallet.title': 'کیف پول'
    - 'bottom_nav.profile.title': 'پروفایل'
    - 'btn.view_case': 'مشاهده پرونده'
    - 'btn.ablaghieh': 'ابلاغیه‌ها'
    - 'drawer.title': 'سامانه هوشمند حقوقی دادگستر'
    """
    CATEGORY_CHOICES = (
        ('home', 'صفحه نخست و داشبورد'),
        ('bottom_nav', 'نوار ناوبری پایین'),
        ('side_drawer', 'منوی کشویی جانبی'),
        ('case_tracking', 'پیگیری پرونده و تایم‌لاین دادرسی'),
        ('buttons', 'عناوین دکمه‌ها و دکمه‌های شناور'),
        ('placeholders', 'متون راهنما و ورودی‌های فرم'),
        ('auth', 'احراز هویت، ورود و ثبت‌نام'),
        ('legal', 'قوانین و سلب مسئولیت حقوقی'),
        ('general', 'متون عمومی سامانه'),
    )

    id = models.BigAutoField(primary_key=True)
    key = models.CharField(
        max_length=150,
        unique=True,
        db_index=True,
        verbose_name='کلید متنی یکتا (مثال: home.hero.title یا btn.view_case)'
    )
    value = models.TextField(
        verbose_name='متن نمایشی قابل ویرایش توسط مدیر'
    )
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='general',
        db_index=True,
        verbose_name='دسته‌بندی متن'
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='توضیح محل استفاده در رابط کاربری'
    )
    updated_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_cms_texts',
        verbose_name='آخرین ویرایش‌کننده'
    )
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ آخرین ویرایش')

    class Meta:
        verbose_name = 'متن پویای سیستم (DynamicText CMS)'
        verbose_name_plural = 'مدیریت تمامی متون اپلیکیشن (CMS)'
        db_table = 'legal_dynamic_texts'
        ordering = ['category', 'key']

    def __str__(self):
        return f"[{self.category}] {self.key} : {self.value[:40]}..."
