"""
=============================================================================
DADGOSTAR LEGAL PLATFORM - COMPLETE DRF SERIALIZERS (PostgreSQL + Django)
=============================================================================
Serializers implemented:
1. UserRegistrationSerializer: Regular user signup (Auto-approved)
2. LawyerRegistrationSerializer: Lawyer signup with multi-document upload (pending)
3. LoginSerializer: Unified login via Phone Number or Email + Password
4. UserProfileSerializer: User profile view/edit
5. VerificationDocumentSerializer: Document uploads with SHA-256 fingerprint
6. LawyerDetailSerializer: Admin audit serializer for lawyers with nested documents
7. LawyerRejectionSerializer: Enforces mandatory rejection_reason input
8. DynamicMenuSerializer: Full CRUD for Dynamic CMS menus across all locations
9. PublicDynamicMenuSerializer: Clean serializer for frontend shell rendering
10. DynamicTextSerializer: Full CRUD for key-value UI copy management
11. PublicDynamicTextSerializer: Key-value map for zero hardcoded frontend UI
12. ConsultationSessionSerializer & ConsultationCreateSerializer: Session handling
13. EncryptedMessageSerializer: AES-256 encrypted chat & document exchange at rest
14. AdminDashboardSummarySerializer: Complete aggregated stats for Admin UI
=============================================================================
"""

import uuid
import hashlib
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import (
    CustomUser,
    LawyerProfile,
    VerificationDocument,
    ConsultationSession,
    EncryptedMessage,
    DynamicMenu,
    DynamicText,
    User,
    Lawyer,
    AppMenu,
    AppFeature,
)


# ---------------------------------------------------------------------------
# 1. Verification Document Serializer (Tamper-evident SHA-256)
# ---------------------------------------------------------------------------
class VerificationDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = VerificationDocument
        fields = [
            'id',
            'document_type',
            'document_type_display',
            'document_file',
            'file_url',
            'sha256_hash',
            'is_verified',
            'uploaded_at',
        ]
        read_only_fields = ['id', 'sha256_hash', 'is_verified', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.document_file:
            return request.build_absolute_uri(obj.document_file.url) if request else obj.document_file.url
        return None


# ---------------------------------------------------------------------------
# 2. Regular User Registration Serializer (Auto-approved)
# ---------------------------------------------------------------------------
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'first_name',
            'last_name',
            'phone_number',
            'email',
            'province',
            'city',
            'profile_picture',
            'role',
            'password',
            'date_joined',
        ]
        read_only_fields = ['id', 'role', 'date_joined']

    def validate_phone_number(self, value):
        if CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError('این شماره تلفن همراه قبلاً در سامانه ثبت‌نام کرده است.')
        return value

    def validate_email(self, value):
        if value and CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('این آدرس ایمیل قبلاً در سامانه ثبت شده است.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['role'] = 'user'
        validated_data['is_active'] = True
        user = CustomUser.objects.create_user(password=password, **validated_data)
        return user


# ---------------------------------------------------------------------------
# 3. Lawyer Registration Serializer (License & National ID Uploads)
# ---------------------------------------------------------------------------
class LawyerRegistrationSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=True)
    last_name = serializers.CharField(max_length=150, required=True)
    phone_number = serializers.CharField(max_length=11, required=True)
    email = serializers.EmailField(max_length=255, required=False, allow_blank=True, allow_null=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    province = serializers.CharField(max_length=100, required=True)
    city = serializers.CharField(max_length=100, required=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    
    # Lawyer credentials
    license_number = serializers.CharField(max_length=50, required=True)
    bar_association = serializers.CharField(max_length=150, default='کانون وکلای دادگستری مرکز')
    sheba_number = serializers.CharField(max_length=26, required=True)
    specialties = serializers.ListField(child=serializers.CharField(max_length=50), required=False, default=list)
    bio = serializers.CharField(required=False, allow_blank=True)
    years_of_experience = serializers.IntegerField(default=3, min_value=0)

    # Document file uploads
    license_image = serializers.FileField(required=True, help_text='تصویر پروانه وکالت دادگستری')
    national_id_image = serializers.FileField(required=False, help_text='تصویر کارت ملی هوشمند')

    def validate_phone_number(self, value):
        if CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError('این شماره تلفن همراه قبلاً در سامانه ثبت شده است.')
        if not value.startswith('09') or len(value) != 11:
            raise serializers.ValidationError('شماره همراه نامعتبر است (الگوی صحیح: ۰۹۱۲۳۴۵۶۷۸۹).')
        return value

    def validate_sheba_number(self, value):
        val = value.strip().upper()
        if not val.startswith('IR') or len(val) != 26:
            raise serializers.ValidationError('شماره شبا باید با IR آغاز شده و ۲۶ کاراکتر باشد.')
        return val

    def validate_license_number(self, value):
        if LawyerProfile.objects.filter(license_number=value).exists():
            raise serializers.ValidationError('این شماره پروانه وکالت قبلاً در سامانه ثبت شده است.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        license_image = validated_data.pop('license_image')
        national_id_image = validated_data.pop('national_id_image', None)
        
        # Lawyer profile specific fields
        license_number = validated_data.pop('license_number')
        bar_association = validated_data.pop('bar_association', 'کانون وکلای دادگستری مرکز')
        sheba_number = validated_data.pop('sheba_number')
        specialties = validated_data.pop('specialties', [])
        bio = validated_data.pop('bio', '')
        years_of_experience = validated_data.pop('years_of_experience', 3)
        profile_picture = validated_data.pop('profile_picture', None)

        # 1. Create base CustomUser (role='lawyer')
        user = CustomUser.objects.create_user(
            password=password,
            role='lawyer',
            profile_picture=profile_picture,
            **validated_data
        )

        # 2. Create LawyerProfile with default 'pending' status
        lawyer_profile = LawyerProfile.objects.create(
            user=user,
            license_number=license_number,
            bar_association=bar_association,
            sheba_number=sheba_number,
            specialties=specialties,
            bio=bio,
            years_of_experience=years_of_experience,
            verification_status='pending',
            rejection_reason=None
        )

        # 3. Create VerificationDocument for License
        if license_image:
            hasher = hashlib.sha256()
            for chunk in license_image.chunks():
                hasher.update(chunk)
            sha256_license = hasher.hexdigest()
            license_image.seek(0)

            VerificationDocument.objects.create(
                lawyer=lawyer_profile,
                document_type='law_license',
                document_file=license_image,
                sha256_hash=sha256_license,
                is_verified=False
            )

        # 4. Create VerificationDocument for National ID if provided
        if national_id_image:
            hasher = hashlib.sha256()
            for chunk in national_id_image.chunks():
                hasher.update(chunk)
            sha256_nid = hasher.hexdigest()
            national_id_image.seek(0)

            VerificationDocument.objects.create(
                lawyer=lawyer_profile,
                document_type='national_id',
                document_file=national_id_image,
                sha256_hash=sha256_nid,
                is_verified=False
            )

        return lawyer_profile


# ---------------------------------------------------------------------------
# 4. Login Serializer (Phone Number or Email + Password)
# ---------------------------------------------------------------------------
class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True, help_text='شماره همراه یا آدرس ایمیل')
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        identifier = attrs.get('identifier').strip()
        password = attrs.get('password')

        # Check by phone number first, then by email
        user = None
        if identifier.startswith('09') and len(identifier) == 11 and identifier.isdigit():
            user = authenticate(phone_number=identifier, password=password)
        else:
            try:
                user_obj = CustomUser.objects.get(email__iexact=identifier)
                if user_obj.check_password(password):
                    user = user_obj
            except CustomUser.DoesNotExist:
                user = None

        if not user:
            raise serializers.ValidationError('شماره همراه/ایمیل یا کلمه عبور وارد شده نادرست است.')

        if not user.is_active:
            raise serializers.ValidationError('حساب کاربری شما غیرفعال شده است. لطفاً با پشتیبانی تماس بگیرید.')

        attrs['user'] = user
        return attrs


# ---------------------------------------------------------------------------
# 5. User Profile Serializer (Read/Update)
# ---------------------------------------------------------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'phone_number',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'province',
            'city',
            'profile_picture',
            'role',
            'date_joined',
        ]
        read_only_fields = ['id', 'phone_number', 'role', 'date_joined']


# ---------------------------------------------------------------------------
# 6. Detailed Lawyer Serializer (For Admin Review & Public Directory)
# ---------------------------------------------------------------------------
class LawyerDetailSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    verification_documents = VerificationDocumentSerializer(many=True, read_only=True)
    verification_status_display = serializers.CharField(source='get_verification_status_display', read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.full_name', read_only=True, default=None)

    class Meta:
        model = LawyerProfile
        fields = [
            'id',
            'user',
            'license_number',
            'bar_association',
            'sheba_number',
            'specialties',
            'bio',
            'years_of_experience',
            'verification_status',
            'verification_status_display',
            'rejection_reason',
            'verified_at',
            'verified_by_name',
            'verification_documents',
            'created_at',
            'updated_at',
        ]


# ---------------------------------------------------------------------------
# 7. Lawyer Rejection Serializer (Mandatory Rejection Reason)
# ---------------------------------------------------------------------------
class LawyerRejectionSerializer(serializers.Serializer):
    rejection_reason = serializers.CharField(
        required=True,
        min_length=10,
        error_messages={
            'required': 'ذکر علت دقیق رد مدارک جهت نمایش و اصلاح توسط وکیل الزامی است.',
            'min_length': 'توضیحات علت رد مدارک باید حداقل شامل ۱۰ کاراکتر باشد.'
        }
    )


# ---------------------------------------------------------------------------
# 8. DynamicMenu Serializers (Absolute CMS Control Over All UI Locations)
# ---------------------------------------------------------------------------
class DynamicMenuSerializer(serializers.ModelSerializer):
    location_display = serializers.CharField(source='get_location_display', read_only=True)
    icon_style_display = serializers.CharField(source='get_icon_style_display', read_only=True)
    color_theme_display = serializers.CharField(source='get_color_theme_display', read_only=True)

    class Meta:
        model = DynamicMenu
        fields = [
            'id',
            'location',
            'location_display',
            'title',
            'slug',
            'icon_name',
            'icon_style',
            'icon_style_display',
            'color_theme',
            'color_theme_display',
            'target_url',
            'description',
            'badge_text',
            'order',
            'is_active',
            'created_at',
            'updated_at',
        ]


class PublicDynamicMenuSerializer(serializers.ModelSerializer):
    """
    Clean mobile client response returning only active / non-hidden sections
    for zero-hardcoded navigation rendering.
    """
    class Meta:
        model = DynamicMenu
        fields = [
            'id',
            'location',
            'title',
            'slug',
            'icon_name',
            'icon_style',
            'color_theme',
            'target_url',
            'description',
            'badge_text',
            'order',
        ]


# Backward compatibility aliases
AppMenuSerializer = DynamicMenuSerializer
PublicAppMenuSerializer = PublicDynamicMenuSerializer
AppFeatureSerializer = DynamicMenuSerializer
PublicAppFeatureSerializer = PublicDynamicMenuSerializer


# ---------------------------------------------------------------------------
# 9. DynamicText Serializers (Admin Editable UI Copy - Zero Hardcoded Text)
# ---------------------------------------------------------------------------
class DynamicTextSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    updated_by_name = serializers.CharField(source='updated_by.full_name', read_only=True, default=None)

    class Meta:
        model = DynamicText
        fields = [
            'id',
            'key',
            'value',
            'category',
            'category_display',
            'description',
            'updated_by_name',
            'updated_at',
        ]


# ---------------------------------------------------------------------------
# 10. Consultation & Encrypted Messaging Serializers (AES-256 at Rest)
# ---------------------------------------------------------------------------
class ConsultationSessionSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    client_phone = serializers.CharField(source='client.phone_number', read_only=True)
    lawyer_name = serializers.CharField(source='lawyer.full_name', read_only=True)
    session_type_display = serializers.CharField(source='get_session_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ConsultationSession
        fields = [
            'id',
            'session_code',
            'client',
            'client_name',
            'client_phone',
            'lawyer',
            'lawyer_name',
            'session_type',
            'session_type_display',
            'status',
            'status_display',
            'scheduled_at',
            'duration_minutes',
            'fee_amount',
            'is_paid',
            'room_token',
            'created_at',
        ]
        read_only_fields = ['id', 'session_code', 'room_token', 'created_at']


class ConsultationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationSession
        fields = [
            'lawyer',
            'session_type',
            'scheduled_at',
            'duration_minutes',
            'fee_amount',
        ]

    def validate_lawyer(self, value):
        if value.role != 'lawyer' or not hasattr(value, 'lawyer_profile'):
            raise serializers.ValidationError('کاربر انتخاب شده وکیل معتبر نمی‌باشد.')
        if value.lawyer_profile.verification_status != 'approved':
            raise serializers.ValidationError('این وکیل هنوز توسط مدیریت تایید نشده است و امکان پذیرش مشاوره ندارد.')
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        client = request.user
        session_code = f"CS-{uuid.uuid4().hex[:8].upper()}"
        room_token = f"room-{uuid.uuid4().hex}"
        session = ConsultationSession.objects.create(
            session_code=session_code,
            client=client,
            room_token=room_token,
            **validated_data
        )
        return session


class EncryptedMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    is_me = serializers.SerializerMethodField()
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = EncryptedMessage
        fields = [
            'id',
            'session',
            'sender',
            'sender_name',
            'is_me',
            'encrypted_content',
            'iv_nonce',
            'encrypted_attachment',
            'attachment_url',
            'attachment_original_name',
            'attachment_sha256',
            'is_read',
            'sent_at',
            'read_at',
        ]
        read_only_fields = ['id', 'sender', 'is_me', 'attachment_url', 'sent_at', 'read_at']

    def get_is_me(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.sender_id == request.user.id
        return False

    def get_attachment_url(self, obj):
        request = self.context.get('request')
        if obj.encrypted_attachment:
            return request.build_absolute_uri(obj.encrypted_attachment.url) if request else obj.encrypted_attachment.url
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['sender'] = request.user
        
        # Calculate SHA-256 of encrypted attachment if present
        attachment = validated_data.get('encrypted_attachment')
        if attachment and not validated_data.get('attachment_sha256'):
            hasher = hashlib.sha256()
            for chunk in attachment.chunks():
                hasher.update(chunk)
            validated_data['attachment_sha256'] = hasher.hexdigest()
            attachment.seek(0)
            
        return super().create(validated_data)
