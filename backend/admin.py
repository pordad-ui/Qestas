"""
=============================================================================
DADGOSTAR LEGAL PLATFORM - DJANGO DJANGO-ADMIN CONFIGURATION
=============================================================================
"""

from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import (
    CustomUser,
    LawyerProfile,
    VerificationDocument,
    ConsultationSession,
    EncryptedMessage,
    DynamicMenu,
    DynamicText,
)


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'full_name', 'email', 'role', 'province', 'city', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'province')
    search_fields = ('phone_number', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)


class VerificationDocumentInline(admin.TabularInline):
    model = VerificationDocument
    extra = 0
    readonly_fields = ('document_preview', 'sha256_hash', 'uploaded_at')

    def document_preview(self, obj):
        if obj.document_file:
            return format_html(
                '<a href="{}" target="_blank"><img src="{}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;" /></a>',
                obj.document_file.url,
                obj.document_file.url
            )
        return '-'
    document_preview.short_description = 'پیش‌نمایش سند'


@admin.register(LawyerProfile)
class LawyerProfileAdmin(admin.ModelAdmin):
    list_display = (
        'get_lawyer_name',
        'get_phone_number',
        'license_number',
        'verification_status_badge',
        'sheba_number',
        'created_at',
    )
    list_filter = ('verification_status', 'created_at')
    search_fields = ('user__first_name', 'user__last_name', 'user__phone_number', 'license_number', 'sheba_number')
    readonly_fields = ('created_at', 'updated_at', 'verified_at')
    inlines = [VerificationDocumentInline]
    actions = ['approve_selected_lawyers', 'mark_as_pending']

    def get_lawyer_name(self, obj):
        return obj.user.full_name
    get_lawyer_name.short_description = 'نام وکیل'

    def get_phone_number(self, obj):
        return obj.user.phone_number
    get_phone_number.short_description = 'شماره همراه'

    def verification_status_badge(self, obj):
        colors = {
            'approved': 'green',
            'pending': 'orange',
            'rejected': 'red',
        }
        color = colors.get(obj.verification_status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 10px; font-weight: bold;">{}</span>',
            color,
            obj.get_verification_status_display()
        )
    verification_status_badge.short_description = 'وضعیت احراز هویت'

    def approve_selected_lawyers(self, request, queryset):
        count = queryset.update(
            verification_status='approved',
            verified_at=timezone.now(),
            verified_by=request.user,
            rejection_reason=None
        )
        self.message_user(request, f'{count} وکیل با موفقیت تایید و حساب ایشان فعال گردید.')
    approve_selected_lawyers.short_description = 'تایید پروانه وکلای انتخاب شده'

    def mark_as_pending(self, request, queryset):
        count = queryset.update(verification_status='pending')
        self.message_user(request, f'{count} وکیل به وضعیت در انتظار بررسی بازگردانده شدند.')
    mark_as_pending.short_description = 'تغییر وضعیت به در انتظار بررسی'


@admin.register(VerificationDocument)
class VerificationDocumentAdmin(admin.ModelAdmin):
    list_display = ('lawyer', 'document_type', 'is_verified', 'uploaded_at', 'document_preview')
    list_filter = ('document_type', 'is_verified')

    def document_preview(self, obj):
        if obj.document_file:
            return format_html(
                '<a href="{}" target="_blank">مشاهده مدرک</a>',
                obj.document_file.url
            )
        return '-'
    document_preview.short_description = 'فایل پیوست'


@admin.register(ConsultationSession)
class ConsultationSessionAdmin(admin.ModelAdmin):
    list_display = ('session_code', 'client', 'lawyer', 'session_type', 'status', 'scheduled_at', 'is_paid')
    list_filter = ('session_type', 'status', 'is_paid')
    search_fields = ('session_code', 'client__phone_number', 'lawyer__phone_number')


@admin.register(EncryptedMessage)
class EncryptedMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'sender', 'is_read', 'sent_at')
    list_filter = ('is_read', 'sent_at')
    readonly_fields = ('encrypted_content', 'iv_nonce', 'attachment_sha256')


@admin.register(DynamicMenu)
class DynamicMenuAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'icon', 'order', 'status_badge', 'updated_at')
    list_editable = ('order',)
    list_filter = ('is_active',)
    search_fields = ('title', 'slug')
    actions = ['hide_selected_menus', 'show_selected_menus']

    def status_badge(self, obj):
        if not obj.is_active:
            return format_html('<span style="color: red; font-weight: bold;">● مخفی در اپلیکیشن (Soft Deleted)</span>')
        return format_html('<span style="color: green; font-weight: bold;">● فعال و قابل مشاهده</span>')
    status_badge.short_description = 'وضعیت انتشار در اپ'

    def hide_selected_menus(self, request, queryset):
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} منو در اپلیکیشن مخفی گردید.')
    hide_selected_menus.short_description = 'مخفی کردن بخش‌های انتخاب‌شده (Soft Delete)'

    def show_selected_menus(self, request, queryset):
        count = queryset.update(is_active=True)
        self.message_user(request, f'{count} منو فعال و در اپلیکیشن نمایان شد.')
    show_selected_menus.short_description = 'آشکارسازی بخش‌های انتخاب‌شده'


@admin.register(DynamicText)
class DynamicTextAdmin(admin.ModelAdmin):
    list_display = ('key', 'category', 'value_preview', 'updated_at')
    list_filter = ('category',)
    search_fields = ('key', 'value')

    def value_preview(self, obj):
        return obj.value[:50] + '...' if len(obj.value) > 50 else obj.value
    value_preview.short_description = 'متن'
