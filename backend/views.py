"""
=============================================================================
DADGOSTAR LEGAL PLATFORM - DJANGO REST FRAMEWORK API VIEWS & CONTROLLERS
=============================================================================
Endpoints implemented:
1. User & Lawyer Authentication (Register, Login, Profile)
2. Admin Lawyer Verification (Pending list, Approve, Reject with mandatory reason)
3. Dynamic CMS Management (DynamicMenu across all locations with Soft Delete toggle & reorder)
4. Dynamic Text Management (Key-Value CMS copy for zero hardcoded frontend UI)
5. Encrypted Consultation & Messaging (Participant access checks, AES-256 ciphertext & files)
6. Admin Dashboard Metrics (Aggregated stats, pending audits with documents, and CMS state)
=============================================================================
"""

from django.utils import timezone
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import status, views, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

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
)
from .serializers import (
    UserRegistrationSerializer,
    LawyerRegistrationSerializer,
    LoginSerializer,
    UserProfileSerializer,
    LawyerDetailSerializer,
    LawyerRejectionSerializer,
    DynamicMenuSerializer,
    PublicDynamicMenuSerializer,
    DynamicTextSerializer,
    ConsultationSessionSerializer,
    ConsultationCreateSerializer,
    EncryptedMessageSerializer,
)


# ---------------------------------------------------------------------------
# Helper: Permission Class for Admin / Staff Only
# ---------------------------------------------------------------------------
class IsPlatformAdmin(permissions.BasePermission):
    """Restricts access to authenticated superusers or staff/admin roles."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or request.user.role == 'admin')
        )


# ===========================================================================
# 1. AUTHENTICATION & PROFILE VIEWS
# ===========================================================================

class UserRegisterView(views.APIView):
    """
    POST /api/auth/register/user/
    Registers a regular user (client / موکل).
    Status: Auto-approved immediately upon signup.
    """
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    'success': True,
                    'message': 'ثبت‌نام شما با موفقیت انجام شد و حساب کاربری موکل فعال گردید.',
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'name': user.full_name,
                        'phone_number': user.phone_number,
                        'email': user.email,
                        'role': user.role,
                        'province': user.province,
                        'city': user.city,
                        'is_active': user.is_active,
                    }
                },
                status=status.HTTP_201_CREATED
            )
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LawyerRegisterView(views.APIView):
    """
    POST /api/auth/register/lawyer/
    Registers a lawyer with law license image and national ID image.
    Status: Defaults to 'pending'. Lawyer CANNOT access lawyer features until Admin approval.
    """
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = LawyerRegistrationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            lawyer_profile = serializer.save()
            user = lawyer_profile.user
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    'success': True,
                    'message': (
                        'ثبت‌نام اولیه وکیل با موفقیت ثبت شد. '
                        'مدارک شما در وضعیت «در انتظار بررسی» قرار گرفت و پس از تایید مدیریت سامانه، دسترسی به پنل وکالت فعال خواهد شد.'
                    ),
                    'token': token.key,
                    'lawyer': {
                        'id': lawyer_profile.id,
                        'name': user.full_name,
                        'phone_number': user.phone_number,
                        'email': user.email,
                        'license_number': lawyer_profile.license_number,
                        'verification_status': lawyer_profile.verification_status,
                        'sheba_number': lawyer_profile.sheba_number,
                    }
                },
                status=status.HTTP_201_CREATED
            )
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    """
    POST /api/auth/login/
    Unified authentication by Phone Number or Email + Password.
    Returns Token, User object, and verification status warnings for lawyers.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)

            response_data = {
                'success': True,
                'token': token.key,
                'user': {
                    'id': user.id,
                    'name': user.full_name,
                    'phone_number': user.phone_number,
                    'email': user.email,
                    'role': user.role,
                    'is_staff': user.is_staff,
                }
            }

            # If user is a lawyer, check verification status and include warnings
            if user.role == 'lawyer' and hasattr(user, 'lawyer_profile'):
                lawyer = user.lawyer_profile
                response_data['lawyer_profile'] = {
                    'id': lawyer.id,
                    'verification_status': lawyer.verification_status,
                    'license_number': lawyer.license_number,
                    'sheba_number': lawyer.sheba_number,
                }
                if lawyer.verification_status == 'pending':
                    response_data['warning'] = 'مدارک شما در حال بررسی توسط مدیر است. امکان ارائه مشاوره تا تایید نهایی مقدور نیست.'
                elif lawyer.verification_status == 'rejected':
                    response_data['warning'] = f'مدارک شما تایید نشد. علت رد: {lawyer.rejection_reason}'

            return Response(response_data, status=status.HTTP_200_OK)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(views.APIView):
    """
    GET /api/auth/profile/
    PUT /api/auth/profile/
    Retrieve or update currently logged in user profile.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user, context={'request': request})
        return Response({'success': True, 'profile': serializer.data})

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'profile': serializer.data})
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# ===========================================================================
# 2. ADMIN LAWYER VERIFICATION SYSTEM
# ===========================================================================

class PendingLawyersListView(views.APIView):
    """
    GET /api/admin/lawyers/pending/
    Returns list of all lawyers currently in 'pending' status along with uploaded
    license and national ID documents for admin examination.
    """
    permission_classes = [IsPlatformAdmin]

    def get(self, request, *args, **kwargs):
        pending_lawyers = LawyerProfile.objects.filter(verification_status='pending').select_related('user').prefetch_related('verification_documents').order_by('-created_at')
        serializer = LawyerDetailSerializer(pending_lawyers, many=True, context={'request': request})
        return Response(
            {
                'success': True,
                'count': pending_lawyers.count(),
                'results': serializer.data
            },
            status=status.HTTP_200_OK
        )


class ApproveLawyerView(views.APIView):
    """
    POST /api/admin/lawyers/<int:lawyer_id>/approve/
    Approves a lawyer's credentials:
    - Sets verification_status='approved'
    - Clears any previous rejection_reason
    - Sets verified_at and verified_by
    - Marks verification documents as verified
    """
    permission_classes = [IsPlatformAdmin]

    def post(self, request, lawyer_id, *args, **kwargs):
        lawyer = get_object_or_404(LawyerProfile, id=lawyer_id)
        lawyer.approve(admin_user=request.user)

        # Mark uploaded documents as verified
        lawyer.verification_documents.all().update(is_verified=True)

        return Response(
            {
                'success': True,
                'message': f'وکیل {lawyer.user.full_name} با موفقیت تایید و دسترسی‌های کامل وکالت فعال گردید.',
                'lawyer_id': lawyer.id,
                'verification_status': lawyer.verification_status,
                'verified_at': lawyer.verified_at,
            },
            status=status.HTTP_200_OK
        )


class RejectLawyerView(views.APIView):
    """
    POST /api/admin/lawyers/<int:lawyer_id>/reject/
    Rejects a lawyer's credentials:
    - Requires mandatory 'rejection_reason'
    - Saves reason to DB and prepares notice to lawyer
    - Sets verification_status='rejected'
    """
    permission_classes = [IsPlatformAdmin]

    def post(self, request, lawyer_id, *args, **kwargs):
        lawyer = get_object_or_404(LawyerProfile, id=lawyer_id)
        serializer = LawyerRejectionSerializer(data=request.data)
        if serializer.is_valid():
            reason = serializer.validated_data['rejection_reason']
            lawyer.reject(reason=reason, admin_user=request.user)

            return Response(
                {
                    'success': True,
                    'message': 'رد مدارک با ثبت علت با موفقیت انجام شد و پیام به وکیل ابلاغ گردید.',
                    'lawyer_id': lawyer.id,
                    'verification_status': lawyer.verification_status,
                    'rejection_reason': lawyer.rejection_reason,
                    'verified_at': lawyer.verified_at,
                },
                status=status.HTTP_200_OK
            )
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class AllLawyersAdminListView(views.APIView):
    """
    GET /api/admin/lawyers/
    Lists lawyers filtered by status (?status=pending|approved|rejected).
    """
    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        status_filter = request.query_params.get('status')
        queryset = LawyerProfile.objects.select_related('user').prefetch_related('verification_documents').all()
        if status_filter:
            queryset = queryset.filter(verification_status=status_filter)

        serializer = LawyerDetailSerializer(queryset.order_by('-created_at'), many=True, context={'request': request})
        return Response({'success': True, 'count': queryset.count(), 'results': serializer.data})


# ===========================================================================
# 3. DYNAMIC CMS: MENUS & NAVIGATION (Absolute Control Over All App Areas)
# ===========================================================================

class PublicDynamicMenuListAPIView(views.APIView):
    """
    GET /api/mobile/menus/
    Client mobile endpoint returning only active menus (is_active=True).
    Optional query parameter: ?location=home_grid | side_drawer | bottom_nav | sub_menu | secondary_tools
    If no location is specified, returns a categorized dictionary with all locations
    so the frontend renders every navigation area dynamically.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        location = request.query_params.get('location')
        active_menus = DynamicMenu.objects.filter(is_active=True).order_by('order', 'id')

        if location:
            active_menus = active_menus.filter(location=location)
            serializer = PublicDynamicMenuSerializer(active_menus, many=True, context={'request': request})
            return Response(
                {
                    'success': True,
                    'location': location,
                    'count': active_menus.count(),
                    'items': serializer.data
                },
                status=status.HTTP_200_OK
            )

        # Return grouped locations for complete zero-hardcode frontend hydration
        locations_data = {
            'home_grid': PublicDynamicMenuSerializer(active_menus.filter(location='home_grid'), many=True).data,
            'side_drawer': PublicDynamicMenuSerializer(active_menus.filter(location='side_drawer'), many=True).data,
            'bottom_nav': PublicDynamicMenuSerializer(active_menus.filter(location='bottom_nav'), many=True).data,
            'sub_menu': PublicDynamicMenuSerializer(active_menus.filter(location='sub_menu'), many=True).data,
            'secondary_tools': PublicDynamicMenuSerializer(active_menus.filter(location='secondary_tools'), many=True).data,
        }

        return Response(
            {
                'success': True,
                'total_active': active_menus.count(),
                'locations': locations_data
            },
            status=status.HTTP_200_OK
        )


class AdminDynamicMenuViewSet(viewsets.ModelViewSet):
    """
    Full CRUD API for Admin CMS to manage app sections/menus across all locations:
    - Create new menu (title, location, icon_name, icon_style, color_theme, target_url, order)
    - Update and reorder
    - Toggle visibility (Soft Delete / Hide)
    """
    permission_classes = [IsPlatformAdmin]
    queryset = DynamicMenu.objects.all().order_by('location', 'order', 'id')
    serializer_class = DynamicMenuSerializer

    @action(detail=True, methods=['post'], url_path='toggle-visibility')
    def toggle_visibility(self, request, pk=None):
        menu = self.get_object()
        new_status = menu.toggle_visibility()
        status_label = 'فعال و نمایان در اپلیکیشن' if new_status else 'مخفی (Soft-Deleted)'
        return Response(
            {
                'success': True,
                'message': f'وضعیت منوی «{menu.title}» به «{status_label}» تغییر یافت.',
                'menu_id': menu.id,
                'location': menu.location,
                'is_active': menu.is_active,
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], url_path='reorder')
    def reorder(self, request):
        """
        POST /api/admin/menus/reorder/
        Accepts [{ "id": 1, "order": 1 }, { "id": 2, "order": 2 }, ...]
        """
        orders = request.data.get('orders', [])
        for item in orders:
            menu_id = item.get('id')
            new_order = item.get('order')
            if menu_id is not None and new_order is not None:
                DynamicMenu.objects.filter(id=menu_id).update(order=new_order)
        return Response({'success': True, 'message': 'ترتیب چینش منوها با موفقیت بروز شد.'})


class ToggleMenuVisibilityView(views.APIView):
    """
    POST /api/admin/menus/<int:menu_id>/toggle-visibility/
    Direct endpoint for quick soft delete/unhide toggle in Admin Panel.
    """
    permission_classes = [IsPlatformAdmin]

    def post(self, request, menu_id, *args, **kwargs):
        menu = get_object_or_404(DynamicMenu, id=menu_id)
        new_status = menu.toggle_visibility()
        return Response(
            {
                'success': True,
                'menu_id': menu.id,
                'title': menu.title,
                'location': menu.location,
                'is_active': new_status,
                'message': f'وضعیت «{menu.title}» بروز شد.'
            },
            status=status.HTTP_200_OK
        )


# ===========================================================================
# 4. DYNAMIC CMS: TEXT MANAGEMENT (Zero Hardcoded Frontend Copy)
# ===========================================================================

class PublicDynamicTextView(views.APIView):
    """
    GET /api/mobile/texts/
    Returns key-value map of dynamic UI texts for frontend display.
    Frontend acts as an empty shell that hydrates all text from this endpoint.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        texts = DynamicText.objects.all()
        # Flat dictionary map for direct lookup: texts[key]
        flat_map = {item.key: item.value for item in texts}

        # Also group by category
        categories = {}
        for item in texts:
            categories.setdefault(item.category, {})[item.key] = item.value

        return Response({
            'success': True,
            'count': texts.count(),
            'texts': flat_map,
            'categories': categories,
        })


class AdminDynamicTextViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD ViewSet for managing UI texts across the app.
    Enables Admin to edit titles, button labels, placeholders, and copy.
    """
    permission_classes = [IsPlatformAdmin]
    queryset = DynamicText.objects.all().order_by('category', 'key')
    serializer_class = DynamicTextSerializer

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


# ===========================================================================
# 5. ENCRYPTED CONSULTATION & MESSAGING VIEWS
# ===========================================================================

class ConsultationSessionListCreateView(views.APIView):
    """
    GET /api/consultations/ -> Lists sessions for current user (as client or lawyer)
    POST /api/consultations/ -> Book a new consultation session
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_staff or user.role == 'admin':
            sessions = ConsultationSession.objects.all().order_by('-scheduled_at')
        elif user.role == 'lawyer':
            sessions = ConsultationSession.objects.filter(lawyer=user).order_by('-scheduled_at')
        else:
            sessions = ConsultationSession.objects.filter(client=user).order_by('-scheduled_at')

        serializer = ConsultationSessionSerializer(sessions, many=True, context={'request': request})
        return Response({'success': True, 'results': serializer.data})

    def post(self, request):
        serializer = ConsultationCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            session = serializer.save()
            out_serializer = ConsultationSessionSerializer(session, context={'request': request})
            return Response({'success': True, 'session': out_serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ConsultationSessionDetailView(views.APIView):
    """
    GET /api/consultations/<uuid:session_id>/
    Security: Access is strictly checked via session.can_access(user).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(ConsultationSession, id=session_id)
        if not session.can_access(request.user):
            return Response({'success': False, 'detail': 'دسترسی غیرمجاز به این جلسه مشاوره.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ConsultationSessionSerializer(session, context={'request': request})
        return Response({'success': True, 'session': serializer.data})


class EncryptedMessageListCreateView(views.APIView):
    """
    GET /api/consultations/<uuid:session_id>/messages/
    POST /api/consultations/<uuid:session_id>/messages/
    End-to-End Encrypted Messaging and file exchange:
    - Encrypted content + IV stored at rest.
    - Only participating Client and Lawyer can read or post messages.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, session_id):
        session = get_object_or_404(ConsultationSession, id=session_id)
        if not session.can_access(request.user):
            return Response({'success': False, 'detail': 'دسترسی غیرمجاز.'}, status=status.HTTP_403_FORBIDDEN)

        messages = session.messages.all().order_by('sent_at')
        serializer = EncryptedMessageSerializer(messages, many=True, context={'request': request})
        return Response({'success': True, 'messages': serializer.data})

    def post(self, request, session_id):
        session = get_object_or_404(ConsultationSession, id=session_id)
        if not session.can_access(request.user):
            return Response({'success': False, 'detail': 'دسترسی غیرمجاز.'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['session'] = session.id
        serializer = EncryptedMessageSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            msg = serializer.save()
            return Response({'success': True, 'message': EncryptedMessageSerializer(msg, context={'request': request}).data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# ===========================================================================
# 6. ADMIN DASHBOARD METRICS & SUMMARY
# ===========================================================================

class AdminDashboardSummaryAPIView(views.APIView):
    """
    GET /api/admin/dashboard/
    Provides the complete JSON structure for the Admin Panel Dashboard:
    - Total Users
    - Total Pending Lawyers
    - List of Pending Lawyers with their uploaded verification document URLs
    - Active vs Hidden App sections broken down by location
    - Dynamic text count and total consultations
    """
    permission_classes = [IsPlatformAdmin]

    def get(self, request, *args, **kwargs):
        # 1. User & Lawyer Statistics
        total_users = CustomUser.objects.filter(role='user').count()
        total_lawyers = LawyerProfile.objects.count()
        pending_lawyers_qs = LawyerProfile.objects.filter(verification_status='pending').select_related('user').prefetch_related('verification_documents')
        approved_lawyers_count = LawyerProfile.objects.filter(verification_status='approved').count()
        rejected_lawyers_count = LawyerProfile.objects.filter(verification_status='rejected').count()

        # 2. CMS Menus Statistics (by location)
        total_sections = DynamicMenu.objects.count()
        active_sections_count = DynamicMenu.objects.filter(is_active=True).count()
        hidden_sections_count = DynamicMenu.objects.filter(is_active=False).count()

        sections_by_location = {
            'home_grid': DynamicMenu.objects.filter(location='home_grid').count(),
            'side_drawer': DynamicMenu.objects.filter(location='side_drawer').count(),
            'bottom_nav': DynamicMenu.objects.filter(location='bottom_nav').count(),
            'sub_menu': DynamicMenu.objects.filter(location='sub_menu').count(),
            'secondary_tools': DynamicMenu.objects.filter(location='secondary_tools').count(),
        }

        # 3. Dynamic Text & Consultation Statistics
        total_cms_texts = DynamicText.objects.count()
        total_consultations = ConsultationSession.objects.count()

        # 4. Pending Lawyers List Serialization
        pending_lawyers_serializer = LawyerDetailSerializer(pending_lawyers_qs, many=True, context={'request': request})
        
        # 5. CMS Menus Serialization
        all_menus_serializer = DynamicMenuSerializer(DynamicMenu.objects.all().order_by('location', 'order', 'id'), many=True)

        return Response(
            {
                'success': True,
                'metrics': {
                    'total_users': total_users,
                    'total_lawyers': total_lawyers,
                    'total_pending_lawyers': pending_lawyers_qs.count(),
                    'total_approved_lawyers': approved_lawyers_count,
                    'total_rejected_lawyers': rejected_lawyers_count,
                    'total_sections': total_sections,
                    'active_sections': active_sections_count,
                    'hidden_sections': hidden_sections_count,
                    'sections_by_location': sections_by_location,
                    'total_cms_texts': total_cms_texts,
                    'total_consultations': total_consultations,
                },
                'pending_lawyers': pending_lawyers_serializer.data,
                'app_sections': all_menus_serializer.data,
            },
            status=status.HTTP_200_OK
        )
