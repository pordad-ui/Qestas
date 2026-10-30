"""
=============================================================================
DADGOSTAR LEGAL PLATFORM - DJANGO URL ROUTING CONFIGURATION
=============================================================================
Routes:
1. /api/auth/*: User & Lawyer Registration, Login, Profile
2. /api/admin/lawyers/*: Pending lawyers list, Approval, Rejection
3. /api/admin/menus/* & /api/mobile/menus/*: Dynamic CMS Menus & Soft Delete
4. /api/admin/texts/* & /api/mobile/texts/*: Dynamic CMS Copy Management
5. /api/consultations/*: Encrypted sessions & messages
6. /api/admin/dashboard/: Aggregated admin metrics & pending audits
=============================================================================
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegisterView,
    LawyerRegisterView,
    LoginView,
    UserProfileView,
    PendingLawyersListView,
    ApproveLawyerView,
    RejectLawyerView,
    AllLawyersAdminListView,
    AdminDynamicMenuViewSet,
    ToggleMenuVisibilityView,
    PublicDynamicMenuListAPIView,
    AdminDynamicTextViewSet,
    PublicDynamicTextView,
    ConsultationSessionListCreateView,
    ConsultationSessionDetailView,
    EncryptedMessageListCreateView,
    AdminDashboardSummaryAPIView,
)

router = DefaultRouter()
router.register(r'admin/menus', AdminDynamicMenuViewSet, basename='admin-dynamic-menus')
router.register(r'admin/texts', AdminDynamicTextViewSet, basename='admin-dynamic-texts')

urlpatterns = [
    # -----------------------------------------------------------------------
    # 1. Authentication & Profile Endpoints
    # -----------------------------------------------------------------------
    path('auth/register/user/', UserRegisterView.as_view(), name='register-user'),
    path('auth/register/lawyer/', LawyerRegisterView.as_view(), name='register-lawyer'),
    path('auth/login/', LoginView.as_view(), name='api-login'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),

    # -----------------------------------------------------------------------
    # 2. Lawyer Verification Endpoints (Admin Only)
    # -----------------------------------------------------------------------
    path('admin/lawyers/pending/', PendingLawyersListView.as_view(), name='admin-lawyers-pending'),
    path('admin/lawyers/<int:lawyer_id>/approve/', ApproveLawyerView.as_view(), name='admin-lawyer-approve'),
    path('admin/lawyers/<int:lawyer_id>/reject/', RejectLawyerView.as_view(), name='admin-lawyer-reject'),
    path('admin/lawyers/', AllLawyersAdminListView.as_view(), name='admin-lawyers-all'),

    # -----------------------------------------------------------------------
    # 3. CMS & Content Management Endpoints (Admin & Public Mobile)
    # -----------------------------------------------------------------------
    path('', include(router.urls)),
    path('admin/menus/<int:menu_id>/toggle-visibility/', ToggleMenuVisibilityView.as_view(), name='admin-menu-toggle-direct'),
    path('mobile/menus/', PublicDynamicMenuListAPIView.as_view(), name='public-mobile-menus'),
    path('mobile/texts/', PublicDynamicTextView.as_view(), name='public-mobile-texts'),

    # -----------------------------------------------------------------------
    # 4. Encrypted Consultation & Messaging Endpoints
    # -----------------------------------------------------------------------
    path('consultations/', ConsultationSessionListCreateView.as_view(), name='consultation-list-create'),
    path('consultations/<uuid:session_id>/', ConsultationSessionDetailView.as_view(), name='consultation-detail'),
    path('consultations/<uuid:session_id>/messages/', EncryptedMessageListCreateView.as_view(), name='consultation-messages'),

    # -----------------------------------------------------------------------
    # 5. Comprehensive Admin Dashboard Data Endpoint
    # -----------------------------------------------------------------------
    path('admin/dashboard/', AdminDashboardSummaryAPIView.as_view(), name='admin-dashboard-summary'),
]
