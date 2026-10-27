import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
  Building,
  Eye,
  Award,
  AlertTriangle,
  Server,
  Lock,
  Percent,
  Sliders,
  Plus,
  Trash2,
  Edit,
  Edit3,
  Save,
  Menu as MenuIcon,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Search,
  UserPlus,
  Users,
  BookOpen,
  Sparkles,
  Phone,
  Video,
  MessageSquare,
  Link2,
  Globe,
  ExternalLink,
  Layers,
  Type,
  Tag,
  RotateCcw,
  Brain,
  HelpCircle,
} from 'lucide-react';
import {
  Lawyer,
  PlatformCommissionSettings,
  DynamicPage,
  MenuItem,
  AdminAssistant,
  CMSContent,
  CustomAppLink,
  LinkCategory,
  AppStatCard,
} from '../types/legal';
import { INITIAL_CMS } from '../data/mockData';

interface MasterAdminManagementPanelProps {
  lawyers: Lawyer[];
  onApproveLawyer: (lawyerId: string) => void;
  onRejectLawyer: (lawyerId: string, reason: string) => void;
  onUpdateLawyer: (updatedLawyer: Lawyer) => void;
  onDeleteLawyer: (lawyerId: string) => void;

  commissionSettings: PlatformCommissionSettings;
  onUpdateCommissionSettings: (newSettings: PlatformCommissionSettings) => void;

  pages: DynamicPage[];
  onCreatePage: (page: Omit<DynamicPage, 'id' | 'views' | 'updatedAt'>) => void;
  onUpdatePage: (updatedPage: DynamicPage) => void;
  onDeletePage: (pageId: string) => void;
  onViewPagePreview: (page: DynamicPage) => void;

  menus: MenuItem[];
  onUpdateMenus: (menus: MenuItem[]) => void;

  assistants: AdminAssistant[];
  onAddAssistant: (assistant: Omit<AdminAssistant, 'id' | 'lastLogin'>) => void;
  onUpdateAssistant: (assistant: AdminAssistant) => void;
  onDeleteAssistant: (assistantId: string) => void;
  activeAssistant: AdminAssistant;
  onSelectActiveAssistant: (assistant: AdminAssistant) => void;

  cms: CMSContent;
  onUpdateCMS: (newCMS: CMSContent) => void;
}

export const MasterAdminManagementPanel: React.FC<MasterAdminManagementPanelProps> = ({
  lawyers,
  onApproveLawyer,
  onRejectLawyer,
  onUpdateLawyer,
  onDeleteLawyer,

  commissionSettings,
  onUpdateCommissionSettings,

  pages,
  onCreatePage,
  onUpdatePage,
  onDeletePage,
  onViewPagePreview,

  menus,
  onUpdateMenus,

  assistants,
  onAddAssistant,
  onUpdateAssistant,
  onDeleteAssistant,
  activeAssistant,
  onSelectActiveAssistant,
  cms,
  onUpdateCMS,
}) => {
  // Navigation inside Admin Console
  const [adminTab, setAdminTab] = useState<
    'lawyers' | 'commission' | 'pages' | 'menus' | 'content-links' | 'assistants'
  >('lawyers');

  // Toast notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // RBAC Permission checks
  const perms = activeAssistant.permissions;
  const isSuper = activeAssistant.accessLevel === 'full';

  // -------------------------------------------------------------
  // TAB: APP SECTIONS, DEFAULT TEXTS & LINKS MANAGER STATE
  // -------------------------------------------------------------
  const [contentForm, setContentForm] = useState<CMSContent>({ ...cms });
  const [activeContentSection, setActiveContentSection] = useState<
    'all' | 'header-brand' | 'hero' | 'triage-vault' | 'stats' | 'footer' | 'links'
  >('all');
  const [newTagInput, setNewTagInput] = useState('');

  // Link Management Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<CustomAppLink | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrlOrTarget, setLinkUrlOrTarget] = useState('');
  const [linkCategory, setLinkCategory] = useState<LinkCategory>('footer-services');
  const [linkIsExternal, setLinkIsExternal] = useState(false);
  const [linkBadge, setLinkBadge] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkIsActive, setLinkIsActive] = useState(true);
  const [linkSearchQuery, setLinkSearchQuery] = useState('');
  const [linkFilterCategory, setLinkFilterCategory] = useState<'all' | LinkCategory>('all');

  const handleSaveContentChanges = () => {
    if (!perms.canManagePages && !perms.canManageMenus && !isSuper) {
      showToast('خطا: شما مجوز تغییر متون و تنظیمات بخش‌ها را ندارید.');
      return;
    }
    onUpdateCMS(contentForm);
    showToast('کلیه متون و تنظیمات بخش‌ها با موفقیت ذخیره و در سراسر سامانه اعمال شد.');
  };

  const handleResetToDefaultCMS = () => {
    if (!isSuper) {
      showToast('خطا: بازنشانی متون و پیوندها تنها توسط مدیر کل امکان‌پذیر است.');
      return;
    }
    setContentForm({ ...INITIAL_CMS });
    onUpdateCMS({ ...INITIAL_CMS });
    showToast('کلیه متون، بخش‌ها و پیوندهای پیش‌فرض به تنظیمات کارخانه بازگردانی شدند.');
  };

  const handleAddPopularTag = () => {
    if (newTagInput.trim() && !(contentForm.popularSearchTags || []).includes(newTagInput.trim())) {
      const updated = [...(contentForm.popularSearchTags || []), newTagInput.trim()];
      const updatedCMS = { ...contentForm, popularSearchTags: updated };
      setContentForm(updatedCMS);
      onUpdateCMS(updatedCMS);
      setNewTagInput('');
      showToast(`کلیدواژه «${newTagInput.trim()}» به جستجوهای پرطرفدار افزوده شد.`);
    }
  };

  const handleRemovePopularTag = (tagToRemove: string) => {
    const updated = (contentForm.popularSearchTags || []).filter((t) => t !== tagToRemove);
    const updatedCMS = { ...contentForm, popularSearchTags: updated };
    setContentForm(updatedCMS);
    onUpdateCMS(updatedCMS);
    showToast(`کلیدواژه «${tagToRemove}» حذف شد.`);
  };

  const handleOpenCreateLink = () => {
    setEditingLink(null);
    setLinkTitle('');
    setLinkUrlOrTarget('#lawyers');
    setLinkCategory('footer-services');
    setLinkIsExternal(false);
    setLinkBadge('');
    setLinkDescription('');
    setLinkIsActive(true);
    setLinkModalOpen(true);
  };

  const handleOpenEditLink = (link: CustomAppLink) => {
    setEditingLink(link);
    setLinkTitle(link.title);
    setLinkUrlOrTarget(link.urlOrTarget);
    setLinkCategory(link.category);
    setLinkIsExternal(link.isExternal);
    setLinkBadge(link.badge || '');
    setLinkDescription(link.description || '');
    setLinkIsActive(link.isActive);
    setLinkModalOpen(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perms.canManagePages && !perms.canManageMenus && !isSuper) {
      showToast('خطا: شما مجوز ایجاد یا ویرایش پیوندها را ندارید.');
      return;
    }
    if (!linkTitle.trim() || !linkUrlOrTarget.trim()) {
      showToast('خطا: وارد کردن عنوان و مقصد پیوند الزامی است.');
      return;
    }

    let updatedLinks = [...(contentForm.customLinks || [])];
    if (editingLink) {
      updatedLinks = updatedLinks.map((l) =>
        l.id === editingLink.id
          ? {
              ...l,
              title: linkTitle.trim(),
              urlOrTarget: linkUrlOrTarget.trim(),
              category: linkCategory,
              isExternal: linkIsExternal,
              badge: linkBadge.trim() || undefined,
              description: linkDescription.trim() || undefined,
              isActive: linkIsActive,
            }
          : l
      );
      showToast(`پیوند «${linkTitle}» به‌روزرسانی شد.`);
    } else {
      const newLink: CustomAppLink = {
        id: `link-${Date.now()}`,
        title: linkTitle.trim(),
        urlOrTarget: linkUrlOrTarget.trim(),
        category: linkCategory,
        isExternal: linkIsExternal,
        order: updatedLinks.length + 1,
        isActive: linkIsActive,
        badge: linkBadge.trim() || undefined,
        description: linkDescription.trim() || undefined,
      };
      updatedLinks.push(newLink);
      showToast(`پیوند جدید «${linkTitle}» افزوده شد.`);
    }

    const updatedCMS = { ...contentForm, customLinks: updatedLinks };
    setContentForm(updatedCMS);
    onUpdateCMS(updatedCMS);
    setLinkModalOpen(false);
  };

  const handleDeleteLink = (linkId: string) => {
    if (!perms.canManagePages && !perms.canManageMenus && !isSuper) {
      showToast('خطا: شما مجوز حذف پیوند را ندارید.');
      return;
    }
    const target = (contentForm.customLinks || []).find((l) => l.id === linkId);
    const updated = (contentForm.customLinks || []).filter((l) => l.id !== linkId);
    const updatedCMS = { ...contentForm, customLinks: updated };
    setContentForm(updatedCMS);
    onUpdateCMS(updatedCMS);
    showToast(`پیوند «${target?.title || ''}» حذف شد.`);
  };

  const handleToggleLinkActive = (linkId: string) => {
    const updated = (contentForm.customLinks || []).map((l) =>
      l.id === linkId ? { ...l, isActive: !l.isActive } : l
    );
    const updatedCMS = { ...contentForm, customLinks: updated };
    setContentForm(updatedCMS);
    onUpdateCMS(updatedCMS);
    showToast('وضعیت نمایش پیوند تغییر کرد.');
  };

  const handleMoveLink = (linkId: string, direction: 'up' | 'down') => {
    const links = [...(contentForm.customLinks || [])];
    const idx = links.findIndex((l) => l.id === linkId);
    if (idx === -1) return;
    if (direction === 'up' && idx > 0) {
      const tmp = links[idx];
      links[idx] = links[idx - 1];
      links[idx - 1] = tmp;
    } else if (direction === 'down' && idx < links.length - 1) {
      const tmp = links[idx];
      links[idx] = links[idx + 1];
      links[idx + 1] = tmp;
    }
    const updatedCMS = { ...contentForm, customLinks: links };
    setContentForm(updatedCMS);
    onUpdateCMS(updatedCMS);
  };

  // -------------------------------------------------------------
  // TAB 1: LAWYER MANAGEMENT & VERIFICATION
  // -------------------------------------------------------------
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>(
    lawyers.find((l) => l.verificationStatus === 'pending')?.id || lawyers[0]?.id || ''
  );
  const [inspectDocUrl, setInspectDocUrl] = useState<string | null>(null);
  const [inspectDocTitle, setInspectDocTitle] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState(
    'نقص در مدارک بارگذاری شده، عدم تطبیق شماره شبا با کد ملی یا انقضای پروانه وکالت در سامانه کانون'
  );
  const [lawyerFilter, setLawyerFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [lawyerSearch, setLawyerSearch] = useState('');
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);

  const selectedLawyer = lawyers.find((l) => l.id === selectedLawyerId) || lawyers[0];

  const filteredLawyers = lawyers.filter((l) => {
    if (lawyerFilter !== 'all' && l.verificationStatus !== lawyerFilter) return false;
    if (lawyerSearch.trim()) {
      const q = lawyerSearch.trim().toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.licenseNumber.includes(q) ||
        (l.specialties && l.specialties.some((s) => s.toLowerCase().includes(q))) ||
        l.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = lawyers.filter((l) => l.verificationStatus === 'pending').length;

  // -------------------------------------------------------------
  // TAB 2: COMMISSION & REVENUE SHARE
  // -------------------------------------------------------------
  const [commissionForm, setCommissionForm] = useState<PlatformCommissionSettings>({
    ...commissionSettings,
  });
  const [simAmount, setSimAmount] = useState<number>(1000000);
  const [simService, setSimService] = useState<'phone' | 'video' | 'text' | 'petition'>('video');

  const getSharePercent = (srv: 'phone' | 'video' | 'text' | 'petition') => {
    switch (srv) {
      case 'phone':
        return commissionForm.phoneSharePercent;
      case 'video':
        return commissionForm.videoSharePercent;
      case 'text':
        return commissionForm.textSharePercent;
      case 'petition':
        return commissionForm.petitionSharePercent;
    }
  };
  const activeRate = getSharePercent(simService);
  const siteEarning = Math.round((simAmount * activeRate) / 100);
  const vatEarning = Math.round((siteEarning * commissionForm.vatTaxPercent) / 100);
  const lawyerEarning = simAmount - siteEarning;

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perms.canManageCommission && !isSuper) {
      showToast('خطا: شما مجوز ویرایش تعرفه‌ها و سهم سایت را ندارید.');
      return;
    }
    onUpdateCommissionSettings(commissionForm);
    showToast('تنظیمات سهم سایت، درصد کارمزد و پارامترهای تسویه ذخیره شد.');
  };

  // -------------------------------------------------------------
  // TAB 3: DYNAMIC PAGE BUILDER (CMS)
  // -------------------------------------------------------------
  const [pageModalOpen, setPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageCategory, setPageCategory] = useState<
    'راهنمای حقوقی' | 'قوانین و مقررات' | 'تعرفه‌ها' | 'اطلاعیه عمومی'
  >('راهنمای حقوقی');
  const [pageAuthor, setPageAuthor] = useState('واحد حقوقی دادگستر');
  const [pageContent, setPageContent] = useState('');
  const [pagePublished, setPagePublished] = useState(true);

  const handleOpenNewPage = () => {
    setEditingPage(null);
    setPageTitle('');
    setPageSlug('');
    setPageCategory('راهنمای حقوقی');
    setPageAuthor(activeAssistant.name);
    setPageContent('');
    setPagePublished(true);
    setPageModalOpen(true);
  };

  const handleOpenEditPage = (page: DynamicPage) => {
    setEditingPage(page);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageCategory(page.category);
    setPageAuthor(page.author);
    setPageContent(page.content);
    setPagePublished(page.published);
    setPageModalOpen(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perms.canManagePages && !isSuper) {
      showToast('خطا: شما مجوز ایجاد یا ویرایش صفحات را ندارید.');
      return;
    }
    if (!pageTitle.trim() || !pageSlug.trim() || !pageContent.trim()) {
      showToast('لطفاً عنوان، آدرس اسلاگ و محتوای صفحه را وارد نمایید.');
      return;
    }

    if (editingPage) {
      onUpdatePage({
        ...editingPage,
        title: pageTitle.trim(),
        slug: pageSlug.trim().toLowerCase().replace(/\s+/g, '-'),
        category: pageCategory,
        author: pageAuthor,
        content: pageContent,
        published: pagePublished,
        updatedAt: new Date().toLocaleDateString('fa-IR'),
      });
      showToast(`صفحه «${pageTitle}» به‌روزرسانی شد.`);
    } else {
      onCreatePage({
        title: pageTitle.trim(),
        slug: pageSlug.trim().toLowerCase().replace(/\s+/g, '-'),
        category: pageCategory,
        author: pageAuthor,
        content: pageContent,
        published: pagePublished,
      });
      showToast(`صفحه جدید «${pageTitle}» با موفقیت منتشر شد.`);
    }
    setPageModalOpen(false);
  };

  // -------------------------------------------------------------
  // TAB 4: MENU & SUBMENU BUILDER
  // -------------------------------------------------------------
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [menuParentId, setMenuParentId] = useState<string | null>(null);
  const [menuItemTitle, setMenuItemTitle] = useState('');
  const [menuTarget, setMenuTarget] = useState('lawyers');
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  const handleAddTopMenu = () => {
    setMenuParentId(null);
    setEditingMenuItem(null);
    setMenuItemTitle('');
    setMenuTarget('lawyers');
    setMenuModalOpen(true);
  };

  const handleAddSubMenu = (parentId: string) => {
    setMenuParentId(parentId);
    setEditingMenuItem(null);
    setMenuItemTitle('');
    setMenuTarget('lawyers');
    setMenuModalOpen(true);
  };

  const handleEditMenu = (item: MenuItem, parentId?: string | null) => {
    setMenuParentId(parentId || null);
    setEditingMenuItem(item);
    setMenuItemTitle(item.title);
    setMenuTarget(item.targetTabOrSlug);
    setMenuModalOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perms.canManageMenus && !isSuper) {
      showToast('خطا: شما مجوز تغییر منوهای سایت را ندارید.');
      return;
    }
    if (!menuItemTitle.trim()) {
      showToast('لطفاً عنوان منو را وارد فرمایید.');
      return;
    }

    const updatedMenus = [...menus];

    if (editingMenuItem) {
      if (!menuParentId) {
        const idx = updatedMenus.findIndex((m) => m.id === editingMenuItem.id);
        if (idx !== -1) {
          updatedMenus[idx] = {
            ...updatedMenus[idx],
            title: menuItemTitle.trim(),
            targetTabOrSlug: menuTarget,
          };
        }
      } else {
        const parentIdx = updatedMenus.findIndex((m) => m.id === menuParentId);
        if (parentIdx !== -1 && updatedMenus[parentIdx].submenus) {
          updatedMenus[parentIdx].submenus = updatedMenus[parentIdx].submenus!.map((sub) =>
            sub.id === editingMenuItem.id
              ? { ...sub, title: menuItemTitle.trim(), targetTabOrSlug: menuTarget }
              : sub
          );
        }
      }
      showToast(`منوی «${menuItemTitle}» ذخیره شد.`);
    } else {
      if (!menuParentId) {
        const newMenu: MenuItem = {
          id: `menu-${Date.now()}`,
          title: menuItemTitle.trim(),
          targetTabOrSlug: menuTarget,
          order: updatedMenus.length + 1,
          isActive: true,
          submenus: [],
        };
        updatedMenus.push(newMenu);
        showToast(`منوی اصلی «${menuItemTitle}» افزوده شد.`);
      } else {
        const parentIdx = updatedMenus.findIndex((m) => m.id === menuParentId);
        if (parentIdx !== -1) {
          const newSub: MenuItem = {
            id: `sub-${Date.now()}`,
            title: menuItemTitle.trim(),
            targetTabOrSlug: menuTarget,
            order: (updatedMenus[parentIdx].submenus?.length || 0) + 1,
            isActive: true,
            parentId: menuParentId,
          };
          updatedMenus[parentIdx].submenus = [
            ...(updatedMenus[parentIdx].submenus || []),
            newSub,
          ];
          showToast(`زیرمنوی «${menuItemTitle}» اضافه شد.`);
        }
      }
    }

    onUpdateMenus(updatedMenus);
    setMenuModalOpen(false);
  };

  const handleDeleteMenu = (itemId: string, parentId?: string | null) => {
    if (!perms.canManageMenus && !isSuper) {
      showToast('خطا: شما مجوز حذف منو را ندارید.');
      return;
    }
    if (!confirm('آیا از حذف این منو اطمینان دارید؟')) return;

    let updatedMenus = [...menus];
    if (!parentId) {
      updatedMenus = updatedMenus.filter((m) => m.id !== itemId);
    } else {
      const pIdx = updatedMenus.findIndex((m) => m.id === parentId);
      if (pIdx !== -1 && updatedMenus[pIdx].submenus) {
        updatedMenus[pIdx].submenus = updatedMenus[pIdx].submenus!.filter((s) => s.id !== itemId);
      }
    }
    onUpdateMenus(updatedMenus);
    showToast('منو با موفقیت حذف گردید.');
  };

  const handleToggleMenuVisibility = (itemId: string, parentId?: string | null) => {
    if (!perms.canManageMenus && !isSuper) {
      showToast('خطا: مجوز تغییر وضعیت منو را ندارید.');
      return;
    }
    const updatedMenus = [...menus];
    if (!parentId) {
      const idx = updatedMenus.findIndex((m) => m.id === itemId);
      if (idx !== -1) {
        updatedMenus[idx].isActive = !updatedMenus[idx].isActive;
      }
    } else {
      const pIdx = updatedMenus.findIndex((m) => m.id === parentId);
      if (pIdx !== -1 && updatedMenus[pIdx].submenus) {
        const sIdx = updatedMenus[pIdx].submenus!.findIndex((s) => s.id === itemId);
        if (sIdx !== -1) {
          updatedMenus[pIdx].submenus![sIdx].isActive = !updatedMenus[pIdx].submenus![sIdx].isActive;
        }
      }
    }
    onUpdateMenus(updatedMenus);
  };

  const handleMoveMenuOrder = (
    itemId: string,
    direction: 'up' | 'down',
    parentId?: string | null
  ) => {
    if (!perms.canManageMenus && !isSuper) {
      showToast('خطا: مجوز جابجایی ترتیب منو را ندارید.');
      return;
    }
    const updatedMenus = [...menus];
    if (!parentId) {
      const idx = updatedMenus.findIndex((m) => m.id === itemId);
      if (direction === 'up' && idx > 0) {
        const temp = updatedMenus[idx];
        updatedMenus[idx] = updatedMenus[idx - 1];
        updatedMenus[idx - 1] = temp;
      } else if (direction === 'down' && idx < updatedMenus.length - 1) {
        const temp = updatedMenus[idx];
        updatedMenus[idx] = updatedMenus[idx + 1];
        updatedMenus[idx + 1] = temp;
      }
    } else {
      const pIdx = updatedMenus.findIndex((m) => m.id === parentId);
      if (pIdx !== -1 && updatedMenus[pIdx].submenus) {
        const subs = [...updatedMenus[pIdx].submenus!];
        const sIdx = subs.findIndex((s) => s.id === itemId);
        if (direction === 'up' && sIdx > 0) {
          const temp = subs[sIdx];
          subs[sIdx] = subs[sIdx - 1];
          subs[sIdx - 1] = temp;
        } else if (direction === 'down' && sIdx < subs.length - 1) {
          const temp = subs[sIdx];
          subs[sIdx] = subs[sIdx + 1];
          subs[sIdx + 1] = temp;
        }
        updatedMenus[pIdx].submenus = subs;
      }
    }
    onUpdateMenus(updatedMenus);
  };

  // -------------------------------------------------------------
  // TAB 5: ADMIN ASSISTANTS & RBAC
  // -------------------------------------------------------------
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<AdminAssistant | null>(null);
  const [assistantName, setAssistantName] = useState('');
  const [assistantEmail, setAssistantEmail] = useState('');
  const [assistantPhone, setAssistantPhone] = useState('');
  const [assistantRoleTitle, setAssistantRoleTitle] = useState<
    | 'مدیر کل (SuperAdmin)'
    | 'دستیار حقوقی و احراز مدارک'
    | 'ناظر مالی و تسویه'
    | 'دستیار محتوا و منوها'
  >('دستیار حقوقی و احراز مدارک');
  const [assistantAccessLevel, setAssistantAccessLevel] = useState<'full' | 'restricted'>(
    'restricted'
  );
  const [assistantPerms, setAssistantPerms] = useState({
    canVerifyLawyers: true,
    canDeleteLawyers: false,
    canManageCommission: false,
    canManagePages: true,
    canManageMenus: false,
    canManageCases: true,
    canAccessFinancials: false,
  });

  const handleOpenAddAssistant = () => {
    setEditingAssistant(null);
    setAssistantName('');
    setAssistantEmail('');
    setAssistantPhone('۰۹۱۲');
    setAssistantRoleTitle('دستیار حقوقی و احراز مدارک');
    setAssistantAccessLevel('restricted');
    setAssistantPerms({
      canVerifyLawyers: true,
      canDeleteLawyers: false,
      canManageCommission: false,
      canManagePages: true,
      canManageMenus: false,
      canManageCases: true,
      canAccessFinancials: false,
    });
    setAssistantModalOpen(true);
  };

  const handleOpenEditAssistant = (ast: AdminAssistant) => {
    setEditingAssistant(ast);
    setAssistantName(ast.name);
    setAssistantEmail(ast.email);
    setAssistantPhone(ast.phone);
    setAssistantRoleTitle(ast.roleTitle);
    setAssistantAccessLevel(ast.accessLevel);
    setAssistantPerms({ ...ast.permissions });
    setAssistantModalOpen(true);
  };

  const handleSaveAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuper) {
      showToast('خطا: تنها سوپرادمین مجاز به تعریف یا تغییر دسترسی دستیاران است.');
      return;
    }
    if (!assistantName.trim() || !assistantEmail.trim()) {
      showToast('نام و ایمیل دستیار الزامی است.');
      return;
    }

    if (editingAssistant) {
      onUpdateAssistant({
        ...editingAssistant,
        name: assistantName.trim(),
        email: assistantEmail.trim(),
        phone: assistantPhone.trim(),
        roleTitle: assistantRoleTitle,
        accessLevel: assistantAccessLevel,
        permissions:
          assistantAccessLevel === 'full'
            ? {
                canVerifyLawyers: true,
                canDeleteLawyers: true,
                canManageCommission: true,
                canManagePages: true,
                canManageMenus: true,
                canManageCases: true,
                canAccessFinancials: true,
              }
            : assistantPerms,
      });
      showToast(`دسترسی‌های دستیار «${assistantName}» به‌روزرسانی شد.`);
    } else {
      onAddAssistant({
        name: assistantName.trim(),
        email: assistantEmail.trim(),
        phone: assistantPhone.trim(),
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        roleTitle: assistantRoleTitle,
        accessLevel: assistantAccessLevel,
        permissions:
          assistantAccessLevel === 'full'
            ? {
                canVerifyLawyers: true,
                canDeleteLawyers: true,
                canManageCommission: true,
                canManagePages: true,
                canManageMenus: true,
                canManageCases: true,
                canAccessFinancials: true,
              }
            : assistantPerms,
        isActive: true,
      });
      showToast(`دستیار جدید «${assistantName}» به سیستم اضافه شد.`);
    }
    setAssistantModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/60 shadow-2xl shadow-amber-500/20 text-slate-100 px-5 py-3 rounded-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Master Admin Header & RBAC Persona Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-xl shadow-purple-900/30">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Sliders className="w-7 h-7 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white">
                  سیستم مدیریت جامع پلتفرم دادگستر (Master Admin Console)
                </h1>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-bold">
                  نسخه ۳.۴ سازمانی
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                کنترل متمرکز احراز هویت وکلای دادگستری، تعیین سهم کارمزد سایت، ساخت منو و زیرمنو، ایجاد صفحات حقوقی و مدیریت دستیاران
              </p>
            </div>
          </div>

          {/* Active Admin / Assistant Switcher for Live Testing */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <img
              src={activeAssistant.avatar}
              alt={activeAssistant.name}
              className="w-10 h-10 rounded-xl object-cover border border-purple-500/50"
            />
            <div className="text-right">
              <div className="text-[11px] text-slate-400">حساب فعال مدیریتی:</div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{activeAssistant.name}</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    activeAssistant.accessLevel === 'full'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {activeAssistant.roleTitle}
                </span>
              </div>
            </div>

            <div className="border-r border-slate-800 pr-3 mr-1">
              <select
                aria-label="تغییر حساب مدیریتی"
                value={activeAssistant.id}
                onChange={(e) => {
                  const target = assistants.find((a) => a.id === e.target.value);
                  if (target) {
                    onSelectActiveAssistant(target);
                    showToast(`حالت تست تغییر یافت به: ${target.name} (${target.roleTitle})`);
                  }
                }}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                {assistants.map((ast) => (
                  <option key={ast.id} value={ast.id}>
                    {ast.name} ({ast.roleTitle})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Permission Badges */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[10px]">
          <span className="text-slate-400 font-semibold">دسترسی‌های فعال شما:</span>
          {perms.canVerifyLawyers && (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check className="w-3 h-3" /> احراز و تایید وکلا
            </span>
          )}
          {perms.canDeleteLawyers && (
            <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check className="w-3 h-3" /> حذف و تعلیق وکلا
            </span>
          )}
          {perms.canManageCommission && (
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check className="w-3 h-3" /> تنظیم سهم سایت و تعرفه
            </span>
          )}
          {perms.canManagePages && (
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check className="w-3 h-3" /> ایجاد و ویرایش صفحات
            </span>
          )}
          {perms.canManageMenus && (
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check className="w-3 h-3" /> ساخت منو و زیرمنو
            </span>
          )}
          {perms.canAccessFinancials && (
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check className="w-3 h-3" /> نظارت و گزارش‌های مالی
            </span>
          )}
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setAdminTab('lawyers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'lawyers'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>احراز هویت و مدیریت وکلا</span>
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('commission')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'commission'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>تنظیم سهم سایت و وکلا (کارمزد)</span>
        </button>

        <button
          onClick={() => setAdminTab('pages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'pages'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>مدیریت صفحات و نوشتارها ({pages.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('menus')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'menus'
              ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <MenuIcon className="w-4 h-4" />
          <span>مدیریت منوها و زیرمنوها ({menus.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('content-links')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'content-links'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>مدیریت متون، بخش‌ها و پیوندها ({contentForm.customLinks?.length || 0})</span>
        </button>

        <button
          onClick={() => setAdminTab('assistants')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            adminTab === 'assistants'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>مدیران و دستیاران ({assistants.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LAWYER MANAGEMENT & VERIFICATION */}
      {/* ========================================================================= */}
      {adminTab === 'lawyers' && (
        <div className="space-y-6">
          {/* Action & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="جستجوی نام وکیل، شماره پروانه، تخصص..."
                  value={lawyerSearch}
                  onChange={(e) => setLawyerSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setLawyerFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    lawyerFilter === 'all'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  همه ({lawyers.length})
                </button>
                <button
                  onClick={() => setLawyerFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    lawyerFilter === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  در انتظار ({pendingCount})
                </button>
                <button
                  onClick={() => setLawyerFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    lawyerFilter === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تایید شده
                </button>
                <button
                  onClick={() => setLawyerFilter('rejected')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    lawyerFilter === 'rejected'
                      ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  رد شده
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              نمایش <span className="text-white font-bold">{filteredLawyers.length}</span> پرونده وکالت
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lawyers List */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                فهرست پرونده‌های وکلا:
              </h3>

              <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                {filteredLawyers.map((lawyer) => {
                  const isSelected = selectedLawyer?.id === lawyer.id;
                  return (
                    <div
                      key={lawyer.id}
                      onClick={() => setSelectedLawyerId(lawyer.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-amber-100 shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={lawyer.avatar}
                              alt={lawyer.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                                lawyer.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                              }`}
                              title={lawyer.isOnline ? 'آنلاین' : 'آفلاین'}
                            />
                          </div>

                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{lawyer.name}</span>
                              {lawyer.verificationStatus === 'approved' && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              پروانه: {lawyer.licenseNumber} • {lawyer.city}
                            </div>
                            <div className="text-[10px] text-amber-400 font-medium mt-0.5">
                              {lawyer.specialties && lawyer.specialties.slice(0, 2).join('، ')}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="text-right">
                          {lawyer.verificationStatus === 'pending' && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                              در انتظار تایید
                            </span>
                          )}
                          {lawyer.verificationStatus === 'approved' && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                              تایید نهایی
                            </span>
                          )}
                          {lawyer.verificationStatus === 'rejected' && (
                            <span className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">
                              رد شده
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredLawyers.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500">
                    هیچ وکیلی با این فیلتر یافت نشد.
                  </div>
                )}
              </div>
            </div>

            {/* Selected Lawyer Credentials & Full Actions */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {selectedLawyer ? (
                <>
                  {/* Lawyer Profile Banner & Primary Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={selectedLawyer.avatar}
                          alt={selectedLawyer.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50"
                        />
                        <button
                          onClick={() => {
                            setInspectDocUrl(selectedLawyer.avatar);
                            setInspectDocTitle(`عکس پرسنلی رسمی - ${selectedLawyer.name}`);
                          }}
                          className="absolute -bottom-1 -left-1 bg-slate-900 p-1 rounded-lg border border-slate-700 text-slate-300 hover:text-amber-400"
                          title="بزرگنمایی عکس پرسنلی"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-black text-white">{selectedLawyer.name}</h2>
                          <span className="text-xs text-slate-400">({selectedLawyer.title})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {selectedLawyer.barAssociation} • سابقه: {selectedLawyer.experienceYears} سال
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
                          <span>شماره تماس: {selectedLawyer.phone}</span>
                          <span>•</span>
                          <span>شهر: {selectedLawyer.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Edit & Delete Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingLawyer(selectedLawyer)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                        <span>ویرایش مشخصات</span>
                      </button>

                      {perms.canDeleteLawyers && (
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `آیا از حذف کامل وکیل «${selectedLawyer.name}» از سیستم دادگستر اطمینان دارید؟ این عمل غیرقابل بازگشت است.`
                              )
                            ) {
                              onDeleteLawyer(selectedLawyer.id);
                              showToast(`وکیل «${selectedLawyer.name}» با موفقیت حذف گردید.`);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-red-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف وکیل</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Document Inspection Cards: National ID, Bar License, Personnel Photo */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>مدارک هویتی و پروانه وکالت بارگذاری شده:</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* 1. Bar License */}
                      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
                            <span className="flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-amber-400" />
                              پروانه وکالت
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              {selectedLawyer.licenseNumber}
                            </span>
                          </div>
                          <img
                            src={
                              selectedLawyer.barLicenseDocUrl ||
                              'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
                            }
                            alt="پروانه وکالت"
                            className="w-full h-28 object-cover rounded-xl border border-slate-700/60 cursor-pointer hover:opacity-90"
                            onClick={() => {
                              setInspectDocUrl(
                                selectedLawyer.barLicenseDocUrl ||
                                  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                              );
                              setInspectDocTitle(`پروانه رسمی وکالت - ${selectedLawyer.name}`);
                            }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            setInspectDocUrl(
                              selectedLawyer.barLicenseDocUrl ||
                                'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                            );
                            setInspectDocTitle(`پروانه رسمی وکالت - ${selectedLawyer.name}`);
                          }}
                          className="mt-2 w-full py-1.5 rounded-lg bg-slate-800 text-[11px] font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>مشاهده با کیفیت بالا</span>
                        </button>
                      </div>

                      {/* 2. National ID Card */}
                      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
                            <span className="flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4 text-cyan-400" />
                              کارت ملی هوشمند
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {selectedLawyer.nationalId || '۰۰۲۹۱۸۴۷۵۶'}
                            </span>
                          </div>
                          <img
                            src={
                              selectedLawyer.idCardDocUrl ||
                              'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
                            }
                            alt="کارت ملی"
                            className="w-full h-28 object-cover rounded-xl border border-slate-700/60 cursor-pointer hover:opacity-90"
                            onClick={() => {
                              setInspectDocUrl(
                                selectedLawyer.idCardDocUrl ||
                                  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                              );
                              setInspectDocTitle(`کارت ملی هوشمند - ${selectedLawyer.name}`);
                            }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            setInspectDocUrl(
                              selectedLawyer.idCardDocUrl ||
                                'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                            );
                            setInspectDocTitle(`کارت ملی هوشمند - ${selectedLawyer.name}`);
                          }}
                          className="mt-2 w-full py-1.5 rounded-lg bg-slate-800 text-[11px] font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>مشاهده و تطبیق چهره</span>
                        </button>
                      </div>

                      {/* 3. Sheba & Banking Verification */}
                      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
                            <span className="flex items-center gap-1.5">
                              <Building className="w-4 h-4 text-emerald-400" />
                              حساب بانکی و شبا
                            </span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                              احراز شاپرک
                            </span>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-xs text-right">
                            <div className="text-[10px] text-slate-400">شماره شبا (تایید شده):</div>
                            <div className="font-mono text-emerald-400 text-[11px] break-all">
                              {selectedLawyer.shebaNumber}
                            </div>
                            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                              صاحب حساب: <span className="text-white font-medium">{selectedLawyer.name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-[10px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30 text-center">
                          ✓ استعلام ثبت‌احوال و تطبیق شبا با کد ملی مثبت است
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Specialization Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-slate-400">تخصص‌های اعلامی:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedLawyer.specialties &&
                          selectedLawyer.specialties.map((s: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-lg text-[11px]"
                            >
                              {s}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400">تعرفه‌های تنظیمی وکیل:</span>
                      <div className="mt-1.5 space-y-1 text-[11px] text-slate-300">
                        <div>
                          تلفنی (۳۰دقیقه):{' '}
                          <span className="text-white font-bold">
                            {(selectedLawyer.pricing?.phone30min || 450000).toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                        <div>
                          تصویری (۴۵دقیقه):{' '}
                          <span className="text-white font-bold">
                            {(selectedLawyer.pricing?.videoConsultation || 850000).toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Approval / Rejection Decision Action Bar */}
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {perms.canVerifyLawyers ? (
                        <>
                          <button
                            onClick={() => {
                              onApproveLawyer(selectedLawyer.id);
                              showToast(`مدارک و پروانه وکیل «${selectedLawyer.name}» تایید و فعال شد.`);
                            }}
                            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>تایید نهایی و صدور مجوز فعالیت</span>
                          </button>

                          <button
                            onClick={() => setShowRejectModal(true)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 font-bold text-xs flex items-center justify-center gap-2 border border-red-500/40 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>رد مدارک و ارسال اخطار پیامکی</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/30 flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span>شما مجوز تایید یا رد پرونده‌های وکلا را ندارید.</span>
                        </div>
                      )}
                    </div>

                    {/* Online Toggle by Admin */}
                    <button
                      onClick={() => {
                        onUpdateLawyer({
                          ...selectedLawyer,
                          isOnline: !selectedLawyer.isOnline,
                        });
                        showToast(
                          `وضعیت حضور وکیل به «${
                            !selectedLawyer.isOnline ? 'آنلاین' : 'آفلاین'
                          }» تغییر یافت.`
                        );
                      }}
                      className={`text-xs px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 cursor-pointer ${
                        selectedLawyer.isOnline
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          selectedLawyer.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                        }`}
                      />
                      <span>
                        وضعیت در سایت: {selectedLawyer.isOnline ? 'آنلاین (آماده تماس)' : 'آفلاین'}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-slate-400 text-xs">
                  هیچ وکیلی برای بررسی انتخاب نشده است.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PLATFORM REVENUE SHARE & COMMISSION MANAGEMENT */}
      {/* ========================================================================= */}
      {adminTab === 'commission' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Percent className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    تنظیمات سهم سایت، کارمزد مشاوره و قوانین تسویه حساب وکلا
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تعیین دقیق سهم پلتفرم دادگستر و سهم پرداختی به وکیل در انواع خدمات حقوقی آنلاین
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  سامانه پایا و ساتنا: متصل به شاپرک
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveCommission} className="mt-6 space-y-6">
              {/* Service Share Percentages */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>درصد سهم سایت در انواع خدمات حقوقی (کارمزد پلتفرم):</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Phone Consultation */}
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        مشاوره تلفنی
                      </span>
                      <span className="text-xs font-bold text-cyan-400">
                        {commissionForm.phoneSharePercent}٪ سهم سایت
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={commissionForm.phoneSharePercent}
                      onChange={(e) =>
                        setCommissionForm({
                          ...commissionForm,
                          phoneSharePercent: Number(e.target.value),
                        })
                      }
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>سهم وکیل: {100 - commissionForm.phoneSharePercent}٪</span>
                      <span>سهم دادگستر: {commissionForm.phoneSharePercent}٪</span>
                    </div>
                  </div>

                  {/* Video Consultation */}
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-amber-400" />
                        مشاوره تصویری
                      </span>
                      <span className="text-xs font-bold text-cyan-400">
                        {commissionForm.videoSharePercent}٪ سهم سایت
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="35"
                      step="1"
                      value={commissionForm.videoSharePercent}
                      onChange={(e) =>
                        setCommissionForm({
                          ...commissionForm,
                          videoSharePercent: Number(e.target.value),
                        })
                      }
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>سهم وکیل: {100 - commissionForm.videoSharePercent}٪</span>
                      <span>سهم دادگستر: {commissionForm.videoSharePercent}٪</span>
                    </div>
                  </div>

                  {/* Text Chat Consultation */}
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        مشاوره متنی و چت
                      </span>
                      <span className="text-xs font-bold text-cyan-400">
                        {commissionForm.textSharePercent}٪ سهم سایت
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      step="1"
                      value={commissionForm.textSharePercent}
                      onChange={(e) =>
                        setCommissionForm({
                          ...commissionForm,
                          textSharePercent: Number(e.target.value),
                        })
                      }
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>سهم وکیل: {100 - commissionForm.textSharePercent}٪</span>
                      <span>سهم دادگستر: {commissionForm.textSharePercent}٪</span>
                    </div>
                  </div>

                  {/* Petitions and Legal Drafting */}
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-rose-400" />
                        تنظیم دادخواست و لایحه
                      </span>
                      <span className="text-xs font-bold text-cyan-400">
                        {commissionForm.petitionSharePercent}٪ سهم سایت
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      step="1"
                      value={commissionForm.petitionSharePercent}
                      onChange={(e) =>
                        setCommissionForm({
                          ...commissionForm,
                          petitionSharePercent: Number(e.target.value),
                        })
                      }
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>سهم وکیل: {100 - commissionForm.petitionSharePercent}٪</span>
                      <span>سهم دادگستر: {commissionForm.petitionSharePercent}٪</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking, Tax & Payout Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    مالیات بر ارزش افزوده (VAT):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={commissionForm.vatTaxPercent}
                      onChange={(e) =>
                        setCommissionForm({
                          ...commissionForm,
                          vatTaxPercent: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <span className="absolute left-3 top-2 text-xs text-slate-500">درصد (٪)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    حداقل مبلغ درخواست تسویه حساب (تومان):
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={commissionForm.minimumPayoutAmount}
                    onChange={(e) =>
                      setCommissionForm({
                        ...commissionForm,
                        minimumPayoutAmount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    معادل: {(commissionForm.minimumPayoutAmount / 10).toLocaleString('fa-IR')} هزار تومان
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    سقف تسویه خودکار روزانه پایا (تومان):
                  </label>
                  <input
                    type="number"
                    step="1000000"
                    value={commissionForm.autoPayoutThreshold}
                    onChange={(e) =>
                      setCommissionForm({
                        ...commissionForm,
                        autoPayoutThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Settlement Gateway Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-white">فعالیت سوئیچ تسویه خودکار پایا</div>
                  <div className="text-[11px] text-slate-400">
                    در صورت فعال بودن، مبالغ تأیید شده مشاوره راس ساعت ۰۴:۰۰ صبح به شماره شبای وکیل حواله می‌گردد.
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={commissionForm.isSettlementActive}
                    onChange={(e) =>
                      setCommissionForm({
                        ...commissionForm,
                        isSettlementActive: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {/* Live Interactive Calculation Simulator */}
              <div className="bg-gradient-to-br from-slate-950 to-cyan-950/30 border border-cyan-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>ماشین‌حساب زنده شبیه‌سازی سهم سایت و وکیل:</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">محاسبه در کسری از ثانیه</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">مبلغ آزمایشی پرداخت موکل (تومان):</label>
                    <input
                      type="number"
                      step="100000"
                      value={simAmount}
                      onChange={(e) => setSimAmount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">نوع خدمت انتخاب شده:</label>
                    <select
                      value={simService}
                      onChange={(e) => setSimService(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="phone">مشاوره تلفنی ({commissionForm.phoneSharePercent}٪)</option>
                      <option value="video">مشاوره تصویری ({commissionForm.videoSharePercent}٪)</option>
                      <option value="text">مشاوره متنی ({commissionForm.textSharePercent}٪)</option>
                      <option value="petition">تنظیم دادخواست ({commissionForm.petitionSharePercent}٪)</option>
                    </select>
                  </div>
                </div>

                {/* Calculation breakdown cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
                    <div className="text-slate-400 text-[11px]">سهم خالص وکیل ({100 - activeRate}٪):</div>
                    <div className="text-base font-black text-emerald-400 mt-1">
                      {lawyerEarning.toLocaleString('fa-IR')} تومان
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
                    <div className="text-slate-400 text-[11px]">کارمزد پلتفرم دادگستر ({activeRate}٪):</div>
                    <div className="text-base font-black text-cyan-400 mt-1">
                      {siteEarning.toLocaleString('fa-IR')} تومان
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
                    <div className="text-slate-400 text-[11px]">مالیات بر ارزش افزوده ({commissionForm.vatTaxPercent}٪):</div>
                    <div className="text-base font-black text-amber-400 mt-1">
                      {vatEarning.toLocaleString('fa-IR')} تومان
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره تغییرات تعرفه‌ها و سهم سایت</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DYNAMIC PAGE BUILDER & ARTICLES */}
      {/* ========================================================================= */}
      {adminTab === 'pages' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    مدیریت صفحات پویا و مقالات حقوقی (Page Builder)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ایجاد، ویرایش، قالب‌بندی و انتشار صفحات مستقل حقوقی، راهنماها، بخشنامه‌ها و شرایط خدمات
                  </p>
                </div>
              </div>

              {perms.canManagePages && (
                <button
                  onClick={handleOpenNewPage}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ایجاد صفحه یا نوشتار جدید</span>
                </button>
              )}
            </div>

            {/* Pages Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
                        {page.category}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          page.published
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {page.published ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {page.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                      {page.content}
                    </p>

                    <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>پیوند: /{page.slug}</span>
                      <span>بازدید: {page.views.toLocaleString('fa-IR')}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewPagePreview(page)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>پیش‌نمایش</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {perms.canManagePages && (
                        <>
                          <button
                            onClick={() => handleOpenEditPage(page)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                            title="ویرایش صفحه"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`آیا از حذف صفحه «${page.title}» اطمینان دارید؟`)) {
                                onDeletePage(page.id);
                                showToast(`صفحه «${page.title}» حذف شد.`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 cursor-pointer"
                            title="حذف صفحه"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MENU & SUBMENU BUILDER */}
      {/* ========================================================================= */}
      {adminTab === 'menus' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                  <MenuIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    سازنده و مدیریت منوها و زیرمنوها (Menu Builder)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    طراحی ساختار ناوبری بالای سایت، اضافه کردن لینک به صفحات اختصاصی یا بخش‌های داخلی اپلیکیشن
                  </p>
                </div>
              </div>

              {perms.canManageMenus && (
                <button
                  onClick={handleAddTopMenu}
                  className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن منوی اصلی جدید</span>
                </button>
              )}
            </div>

            {/* Menu Tree List */}
            <div className="mt-6 space-y-4">
              {menus.map((menu, mIdx) => (
                <div
                  key={menu.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3"
                >
                  {/* Top Level Item Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">
                        {mIdx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{menu.title}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                            مقصد: {menu.targetTabOrSlug}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          تعداد زیرمنو: {menu.submenus?.length || 0}
                        </div>
                      </div>
                    </div>

                    {/* Actions on Top Level */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleMenuVisibility(menu.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          menu.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {menu.isActive ? 'فعال در هدر' : 'مخفی'}
                      </button>

                      {perms.canManageMenus && (
                        <>
                          <button
                            onClick={() => handleMoveMenuOrder(menu.id, 'up')}
                            disabled={mIdx === 0}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 cursor-pointer"
                            title="انتقال به بالا"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveMenuOrder(menu.id, 'down')}
                            disabled={mIdx === menus.length - 1}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 cursor-pointer"
                            title="انتقال به پایین"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAddSubMenu(menu.id)}
                            className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <FolderPlus className="w-3.5 h-3.5" />
                            <span>افزودن زیرمنو</span>
                          </button>
                          <button
                            onClick={() => handleEditMenu(menu)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            title="ویرایش منو"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(menu.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 cursor-pointer"
                            title="حذف منو"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Submenus Render */}
                  {menu.submenus && menu.submenus.length > 0 && (
                    <div className="mr-6 space-y-2 pt-1 border-r-2 border-purple-500/30 pr-3">
                      {menu.submenus.map((sub, sIdx) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                              {sIdx + 1}
                            </span>
                            <span className="font-bold text-slate-200">{sub.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded">
                              {sub.targetTabOrSlug}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleMenuVisibility(sub.id, menu.id)}
                              className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                                sub.isActive
                                  ? 'text-emerald-400 bg-emerald-500/10'
                                  : 'text-slate-500 bg-slate-800'
                              }`}
                            >
                              {sub.isActive ? 'نمایش' : 'مخفی'}
                            </button>

                            {perms.canManageMenus && (
                              <>
                                <button
                                  onClick={() => handleMoveMenuOrder(sub.id, 'up', menu.id)}
                                  disabled={sIdx === 0}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-400"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveMenuOrder(sub.id, 'down', menu.id)}
                                  disabled={sIdx === (menu.submenus?.length || 0) - 1}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-400"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleEditMenu(sub, menu.id)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMenu(sub.id, menu.id)}
                                  className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MULTI-ADMIN RBAC & ASSISTANTS */}
      {/* ========================================================================= */}
      {adminTab === 'assistants' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    تعیین مدیران و دستیاران با سطوح دسترسی محدود و گسترده (RBAC)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تعریف ادمین‌های سامانه و اعطای اختیارات مجزا برای تایید وکلا، تسویه مالی، ویرایش منوها و مقالات
                  </p>
                </div>
              </div>

              {isSuper && (
                <button
                  onClick={handleOpenAddAssistant}
                  className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>تعریف مدیر یا دستیار جدید</span>
                </button>
              )}
            </div>

            {/* Assistants List */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {assistants.map((ast) => {
                const isCurrentActive = ast.id === activeAssistant.id;
                return (
                  <div
                    key={ast.id}
                    className={`bg-slate-950 border rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all ${
                      isCurrentActive
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={ast.avatar}
                            alt={ast.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-bold text-white">{ast.name}</h3>
                              {isCurrentActive && (
                                <span className="text-[9px] bg-indigo-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                                  ورود فعلی شما
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{ast.email}</div>
                            <div className="text-[10px] text-indigo-400 font-semibold mt-0.5">
                              {ast.roleTitle}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                            ast.accessLevel === 'full'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ast.accessLevel === 'full' ? 'دسترسی کامل (سوپرادمین)' : 'دسترسی تفکیک‌شده'}
                        </span>
                      </div>

                      {/* Permissions List */}
                      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 space-y-1.5 text-[11px]">
                        <div className="text-[10px] font-bold text-slate-400 mb-1">مجوزهای فعال:</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <span
                            className={
                              ast.permissions.canVerifyLawyers
                                ? 'text-emerald-400'
                                : 'text-slate-600 line-through'
                            }
                          >
                            ✓ تایید و رد مدارک وکلا
                          </span>
                          <span
                            className={
                              ast.permissions.canDeleteLawyers
                                ? 'text-emerald-400'
                                : 'text-slate-600 line-through'
                            }
                          >
                            ✓ حذف وکلای خاطی
                          </span>
                          <span
                            className={
                              ast.permissions.canManageCommission
                                ? 'text-emerald-400'
                                : 'text-slate-600 line-through'
                            }
                          >
                            ✓ تنظیم سهم سایت و تعرفه
                          </span>
                          <span
                            className={
                              ast.permissions.canManagePages
                                ? 'text-emerald-400'
                                : 'text-slate-600 line-through'
                            }
                          >
                            ✓ ایجاد و ویرایش صفحات
                          </span>
                          <span
                            className={
                              ast.permissions.canManageMenus
                                ? 'text-emerald-400'
                                : 'text-slate-600 line-through'
                            }
                          >
                            ✓ مدیریت منو و زیرمنوها
                          </span>
                          <span
                            className={
                              ast.permissions.canAccessFinancials
                                ? 'text-emerald-400'
                                : 'text-slate-600 line-through'
                            }
                          >
                            ✓ مشاهده گزارش مالی و تسویه
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => {
                          onSelectActiveAssistant(ast);
                          showToast(`به عنوان «${ast.name}» لاگین کردید.`);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                          isCurrentActive
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
                        }`}
                      >
                        {isCurrentActive ? 'کاربر جاری' : 'تست اختیارات این دستیار'}
                      </button>

                      {isSuper && ast.id !== 'admin-super' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditAssistant(ast)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            title="ویرایش دسترسی‌ها"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`آیا از حذف دستیار «${ast.name}» اطمینان دارید؟`)) {
                                onDeleteAssistant(ast.id);
                                showToast(`دستیار «${ast.name}» حذف شد.`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 cursor-pointer"
                            title="حذف دستیار"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: APP SECTIONS, DEFAULT TEXTS & LINKS MANAGER */}
      {/* ========================================================================= */}
      {adminTab === 'content-links' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Type className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white">
                  مدیریت متون، پیوندها و بخش‌های سایت (Sections & Links Customizer)
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                امکان بازنویسی تمامی متون پیش‌فرض هدر، بنر اصلی، تریاژ هوشمند، گاوصندوق، فوتر و ایجاد و سفارشی‌سازی پیوندها
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleOpenCreateLink}
                className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>ایجاد پیوند جدید</span>
              </button>

              <button
                type="button"
                onClick={handleSaveContentChanges}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تمامی تغییرات متون</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('آیا از بازنشانی متون و پیوندهای کلیه بخش‌ها به تنظیمات اولیه اطمینان دارید؟')) {
                    handleResetToDefaultCMS();
                  }
                }}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                title="بازگردانی به پیش‌فرض کارخانه"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">بازنشانی پیش‌فرض</span>
              </button>
            </div>
          </div>

          {/* Section Sub-Nav Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            {[
              { id: 'all', label: 'همه بخش‌ها', icon: Layers },
              { id: 'header-brand', label: 'هدر و برندینگ', icon: ShieldCheck },
              { id: 'hero', label: 'بنر اصلی و جستجو', icon: Sparkles },
              { id: 'triage-vault', label: 'تریاژ هوش مصنوعی و گاوصندوق', icon: Brain },
              { id: 'stats', label: 'کارت‌های آماری', icon: Award },
              { id: 'footer', label: 'فوتر و ضمانت‌نامه‌ها', icon: Globe },
              { id: 'links', label: `مدیریت پیوندها (${contentForm.customLinks?.length || 0})`, icon: Link2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveContentSection(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeContentSection === tab.id
                      ? 'bg-slate-100 text-slate-950 shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* 1. HEADER & BRANDING */}
          {/* ========================================================= */}
          {(activeContentSection === 'all' || activeContentSection === 'header-brand') && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">متون بخش هدر و برندینگ (Header & Identity)</h3>
                </div>
                <span className="text-[11px] text-slate-400">نمایش در نوار بالای سایت و لوگو</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">نام برند سامانه:</label>
                  <input
                    type="text"
                    value={contentForm.brandName || ''}
                    onChange={(e) => setContentForm({ ...contentForm, brandName: e.target.value })}
                    placeholder="دادگستر"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">شعار سازمانی زیر لوگو:</label>
                  <input
                    type="text"
                    value={contentForm.brandTagline || ''}
                    onChange={(e) => setContentForm({ ...contentForm, brandTagline: e.target.value })}
                    placeholder="سامانه جامع هوشمند حقوقی و وکالت برخط"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">شماره تماس فوری و اورژانس قضایی:</label>
                  <input
                    type="text"
                    value={contentForm.contactEmergencyPhone || ''}
                    onChange={(e) => setContentForm({ ...contentForm, contactEmergencyPhone: e.target.value })}
                    placeholder="۰۲۱-۸۸۸۸۴۴۰۰"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">برچسب عنوان تماس اضطراری:</label>
                  <input
                    type="text"
                    value={contentForm.contactEmergencyLabel || ''}
                    onChange={(e) => setContentForm({ ...contentForm, contactEmergencyLabel: e.target.value })}
                    placeholder="پشتیبانی ۲۴ ساعته دعاوی فوری"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">متن نوار متحرک اعلان هدر (Announcement Ticker):</label>
                  <textarea
                    rows={2}
                    value={contentForm.announcementTicker || ''}
                    onChange={(e) => setContentForm({ ...contentForm, announcementTicker: e.target.value })}
                    placeholder="اعلان مهم..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. HERO BANNER & SEARCH */}
          {/* ========================================================= */}
          {(activeContentSection === 'all' || activeContentSection === 'hero') && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">متون بنر اصلی، جستجو و برچسب‌ها (Hero Section)</h3>
                </div>
                <span className="text-[11px] text-slate-400">صفحه اصلی پلتفرم</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 mb-1 font-semibold">تیتر اصلی صفحه (Hero Headline):</label>
                    <input
                      type="text"
                      value={contentForm.heroTitle || ''}
                      onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-300 mb-1 font-semibold">زیرتیتر و توضیحات بنر (Hero Subtitle):</label>
                    <textarea
                      rows={2}
                      value={contentForm.heroSubtitle || ''}
                      onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">برچسب نشان بالای تیتر (Badge):</label>
                    <input
                      type="text"
                      value={contentForm.heroBadge || ''}
                      onChange={(e) => setContentForm({ ...contentForm, heroBadge: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">متن راهنمای ورودی کادر جستجو (Placeholder):</label>
                    <input
                      type="text"
                      value={contentForm.heroSearchPlaceholder || ''}
                      onChange={(e) => setContentForm({ ...contentForm, heroSearchPlaceholder: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">متن دکمه شروع تریاژ هوشمند (CTA 1):</label>
                    <input
                      type="text"
                      value={contentForm.heroTriageButtonText || ''}
                      onChange={(e) => setContentForm({ ...contentForm, heroTriageButtonText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">متن دکمه پیگیری در سامانه عدل ایران (CTA 2):</label>
                    <input
                      type="text"
                      value={contentForm.heroTrackingButtonText || ''}
                      onChange={(e) => setContentForm({ ...contentForm, heroTrackingButtonText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Popular Search Tags Editor */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <label className="block text-slate-300 font-semibold">کلیدواژه‌های پرطرفدار جستجو (Popular Search Tags):</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {(contentForm.popularSearchTags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-200"
                      >
                        <Tag className="w-3 h-3 text-amber-400" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePopularTag(tag)}
                          className="hover:text-red-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="کلیدواژه جدید (مثلا: سرقفلی)..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPopularTag();
                        }
                      }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddPopularTag}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                    >
                      افزودن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. AI TRIAGE & DOCUMENT VAULT */}
          {/* ========================================================= */}
          {(activeContentSection === 'all' || activeContentSection === 'triage-vault') && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">متون بخش تریاژ حقوقی هوش مصنوعی و امنیت گاوصندوق</h3>
                </div>
                <span className="text-[11px] text-slate-400">کارت تریاژ و هشدارهای امنیتی</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">عنوان کارت تریاژ هوشمند:</label>
                  <input
                    type="text"
                    value={contentForm.triageCardTitle || ''}
                    onChange={(e) => setContentForm({ ...contentForm, triageCardTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">متن وضعیت آنلاین موتور AI:</label>
                  <input
                    type="text"
                    value={contentForm.triageCardStatusText || ''}
                    onChange={(e) => setContentForm({ ...contentForm, triageCardStatusText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">نشان نسخه سال قوانین:</label>
                  <input
                    type="text"
                    value={contentForm.triageCardLawYearBadge || ''}
                    onChange={(e) => setContentForm({ ...contentForm, triageCardLawYearBadge: e.target.value })}
                    placeholder="قوانین ۱۴۰۳"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">متن دکمه تست آنلاین تریاژ:</label>
                  <input
                    type="text"
                    value={contentForm.triageCardCtaText || ''}
                    onChange={(e) => setContentForm({ ...contentForm, triageCardCtaText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">پیام حفظ محرمانگی وکالت:</label>
                  <input
                    type="text"
                    value={contentForm.triageCardConfidentialityNotice || ''}
                    onChange={(e) => setContentForm({ ...contentForm, triageCardConfidentialityNotice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">پیام سرعت پردازش و پاسخدهی:</label>
                  <input
                    type="text"
                    value={contentForm.triageCardSpeedNotice || ''}
                    onChange={(e) => setContentForm({ ...contentForm, triageCardSpeedNotice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">۴ ویژگی برجسته تریاژ (Bullet Points):</label>
                  <div className="space-y-2">
                    {(contentForm.triageCardFeatures || [
                      'دسته‌بندی خودکار دعوا',
                      'استخراج مواد قانونی',
                      'تخمین ادله اثبات',
                      'معرفی وکیل متخصص',
                    ]).map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold w-6 text-center">{fIdx + 1}.</span>
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...(contentForm.triageCardFeatures || [])];
                            newFeatures[fIdx] = e.target.value;
                            setContentForm({ ...contentForm, triageCardFeatures: newFeatures });
                          }}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">متن اطلاعیه امنیتی گاوصندوق اسناد (AES-256 Vault):</label>
                  <textarea
                    rows={2}
                    value={contentForm.documentVaultSecurityNotice || ''}
                    onChange={(e) => setContentForm({ ...contentForm, documentVaultSecurityNotice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">متن سلب مسئولیت قانونی تریاژ هوشمند (Disclaimer):</label>
                  <textarea
                    rows={2}
                    value={contentForm.triageLegalDisclaimer || ''}
                    onChange={(e) => setContentForm({ ...contentForm, triageLegalDisclaimer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. STATS CARDS */}
          {/* ========================================================= */}
          {(activeContentSection === 'all' || activeContentSection === 'stats') && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">کارت‌های آماری صفحه اصلی (Platform Statistics)</h3>
                </div>
                <span className="text-[11px] text-slate-400">۴ آمار کلیدی اعتماد سازمانی</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {(contentForm.statsCards || []).map((stat, sIdx) => (
                  <div key={stat.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-bold">کارت آماری شماره {sIdx + 1}:</div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">مقدار یا عدد:</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updatedStats = [...(contentForm.statsCards || [])];
                          updatedStats[sIdx] = { ...updatedStats[sIdx], value: e.target.value };
                          setContentForm({ ...contentForm, statsCards: updatedStats });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">عنوان و برچسب:</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updatedStats = [...(contentForm.statsCards || [])];
                          updatedStats[sIdx] = { ...updatedStats[sIdx], label: e.target.value };
                          setContentForm({ ...contentForm, statsCards: updatedStats });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">تم رنگی کارت:</label>
                      <select
                        value={stat.color}
                        onChange={(e) => {
                          const updatedStats = [...(contentForm.statsCards || [])];
                          updatedStats[sIdx] = { ...updatedStats[sIdx], color: e.target.value as any };
                          setContentForm({ ...contentForm, statsCards: updatedStats });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      >
                        <option value="amber">طلایی (Amber)</option>
                        <option value="emerald">سبز زمردی (Emerald)</option>
                        <option value="cyan">آبی فیروزه‌ای (Cyan)</option>
                        <option value="purple">بنفش (Purple)</option>
                        <option value="blue">آبی تیره (Blue)</option>
                        <option value="rose">قرمز گل‌بهی (Rose)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. FOOTER & GUARANTEES */}
          {/* ========================================================= */}
          {(activeContentSection === 'all' || activeContentSection === 'footer') && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">متون فوتر، ضمانت‌نامه‌ها و حقوق مالکیت (Footer & Policies)</h3>
                </div>
                <span className="text-[11px] text-slate-400">انتهای تمامی صفحات سامانه</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">متن مأموریت و چشم‌انداز در فوتر:</label>
                  <textarea
                    rows={2}
                    value={contentForm.footerMissionText || ''}
                    onChange={(e) => setContentForm({ ...contentForm, footerMissionText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">متن ضمانت ۱۰۰٪ بازگشت وجه مشاوره:</label>
                  <textarea
                    rows={2}
                    value={contentForm.consultationGuaranteeText || ''}
                    onChange={(e) => setContentForm({ ...contentForm, consultationGuaranteeText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">نشان امنیت ۱ (مجوز کانون وکلا):</label>
                  <input
                    type="text"
                    value={contentForm.footerSecurityBadge1 || ''}
                    onChange={(e) => setContentForm({ ...contentForm, footerSecurityBadge1: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">نشان امنیت ۲ (معماری سرور):</label>
                  <input
                    type="text"
                    value={contentForm.footerSecurityBadge2 || ''}
                    onChange={(e) => setContentForm({ ...contentForm, footerSecurityBadge2: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">متن حقوق مادی و معنوی (Copyright):</label>
                  <input
                    type="text"
                    value={contentForm.footerCopyrightText || ''}
                    onChange={(e) => setContentForm({ ...contentForm, footerCopyrightText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. FULL CUSTOM LINKS MANAGER */}
          {/* ========================================================= */}
          {(activeContentSection === 'all' || activeContentSection === 'links') && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">
                      مدیریت جامع پیوندها و مسیرهای وب‌سایت ({contentForm.customLinks?.length || 0} پیوند)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    ایجاد، ویرایش، تغییر مقصد (داخلی/خارجی)، تغییر دسته‌بندی و فعال یا غیرفعال‌سازی لینک‌های هدر، فوتر و خدمات
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreateLink}
                  className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن پیوند جدید</span>
                </button>
              </div>

              {/* Filters & Search for Links */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="جستجو در عنوان یا آدرس پیوند..."
                    value={linkSearchQuery}
                    onChange={(e) => setLinkSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-white placeholder-slate-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-slate-400 whitespace-nowrap">دسته‌بندی:</span>
                  <select
                    value={linkFilterCategory}
                    onChange={(e) => setLinkFilterCategory(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white w-full sm:w-auto"
                  >
                    <option value="all">همه دسته‌ها ({contentForm.customLinks?.length || 0})</option>
                    <option value="header-top">نوار بالایی هدر (Header Top)</option>
                    <option value="footer-services">خدمات و بخش‌های فوتر</option>
                    <option value="footer-judicial">سامانه‌ها و مراجع قضایی</option>
                    <option value="footer-quick">پیوندهای سریع و قوانین</option>
                    <option value="action-banner">نوار اکشن (Action Banner)</option>
                  </select>
                </div>
              </div>

              {/* Links Table / Card List */}
              <div className="space-y-3">
                {(contentForm.customLinks || [])
                  .filter((link) => {
                    if (linkFilterCategory !== 'all' && link.category !== linkFilterCategory) return false;
                    if (linkSearchQuery.trim()) {
                      const q = linkSearchQuery.trim().toLowerCase();
                      return (
                        link.title.toLowerCase().includes(q) ||
                        link.urlOrTarget.toLowerCase().includes(q) ||
                        (link.badge && link.badge.toLowerCase().includes(q))
                      );
                    }
                    return true;
                  })
                  .map((link, idx) => {
                    const getCategoryLabel = (cat: LinkCategory) => {
                      switch (cat) {
                        case 'header-top': return 'نوار بالای هدر';
                        case 'header-nav': return 'منوی هدر';
                        case 'footer-services': return 'خدمات در فوتر';
                        case 'footer-judicial': return 'مراجع قضایی در فوتر';
                        case 'footer-quick': return 'پیوند سریع در فوتر';
                        case 'action-banner': return 'نوار اکشن';
                      }
                    };

                    return (
                      <div
                        key={link.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          link.isActive
                            ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                            : 'bg-slate-950/40 border-slate-900 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex flex-col gap-1 items-center shrink-0 pt-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveLink(link.id, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30 cursor-pointer"
                              title="انتقال به بالا"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLink(link.id, 'down')}
                              disabled={idx === (contentForm.customLinks?.length || 0) - 1}
                              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30 cursor-pointer"
                              title="انتقال به پایین"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-bold text-white truncate">{link.title}</h4>
                              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                                {getCategoryLabel(link.category)}
                              </span>
                              {link.badge && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-bold">
                                  {link.badge}
                                </span>
                              )}
                              {link.isExternal ? (
                                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <ExternalLink className="w-2.5 h-2.5" /> تب جدید
                                </span>
                              ) : (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                                  داخلی
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 font-mono truncate dir-ltr text-right">
                              {link.urlOrTarget}
                            </p>
                            {link.description && (
                              <p className="text-[11px] text-slate-400">{link.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleLinkActive(link.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              link.isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {link.isActive ? 'فعال در سایت' : 'غیرفعال'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditLink(link)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                            title="ویرایش پیوند"
                          >
                            <Edit className="w-4 h-4 text-amber-400" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`آیا از حذف پیوند «${link.title}» اطمینان دارید؟`)) {
                                handleDeleteLink(link.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors cursor-pointer"
                            title="حذف پیوند"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT CUSTOM LINK */}
      {/* ========================================================================= */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Link2 className="w-5 h-5" />
                <span>{editingLink ? 'ویرایش مشخصات پیوند' : 'ایجاد پیوند سفارشی جدید'}</span>
              </div>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">عنوان پیوند (Link Title):</label>
                <input
                  type="text"
                  required
                  placeholder="مثلا: استعلام اصالت اسناد مالکیت..."
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">مقصد پیوند یا آدرس (Target / URL):</label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    required
                    placeholder="#lawyers یا https://example.ir یا page:legal-tariffs"
                    value={linkUrlOrTarget}
                    onChange={(e) => setLinkUrlOrTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono dir-ltr text-right"
                  />
                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                    <span>پیشنهادهای آماده:</span>
                    {['#lawyers', '#cases', '#consultations', '#calendar', '#documents', '#qna', '#triage', 'https://adliran.ir', 'page:legal-tariffs'].map((sugg) => (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => {
                          setLinkUrlOrTarget(sugg);
                          setLinkIsExternal(sugg.startsWith('http'));
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded cursor-pointer"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">محل نمایش / دسته‌بندی:</label>
                  <select
                    value={linkCategory}
                    onChange={(e) => setLinkCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="footer-services">خدمات و بخش‌ها (فوتر)</option>
                    <option value="footer-judicial">سامانه‌ها و مراجع قضایی (فوتر)</option>
                    <option value="footer-quick">پیوندهای سریع و قوانین (فوتر)</option>
                    <option value="header-top">نوار بالای هدر (Header Top)</option>
                    <option value="header-nav">منوی هدر (Header Nav)</option>
                    <option value="action-banner">نوار اکشن (Action Banner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">برچسب ویژه (Badge اختیاری):</label>
                  <input
                    type="text"
                    placeholder="مثلا: جدید، رسمی، E2EE..."
                    value={linkBadge}
                    onChange={(e) => setLinkBadge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">توضیح کوتاه زیر پیوند (اختیاری):</label>
                <input
                  type="text"
                  placeholder="توضیح تکمیلی یا کاربرد این پیوند..."
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={linkIsExternal}
                    onChange={(e) => setLinkIsExternal(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>باز شدن در تب جدید مرورگر (External / Target _blank)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={linkIsActive}
                    onChange={(e) => setLinkIsActive(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>فعال و منتشر شده در سایت</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  {editingLink ? 'ذخیره تغییرات پیوند' : 'افزودن پیوند'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: HIGH-RES DOCUMENT & CREDENTIAL INSPECTION */}
      {/* ========================================================================= */}
      {inspectDocUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">{inspectDocTitle}</h3>
              </div>
              <button
                onClick={() => setInspectDocUrl(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-black/50 rounded-2xl p-2 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={inspectDocUrl}
                alt={inspectDocTitle}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>گواهی اصالت دیجیتال و کد هش امنیتی استعلام گردیده است.</span>
              <button
                onClick={() => setInspectDocUrl(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REJECT LAWYER WITH REASON */}
      {/* ========================================================================= */}
      {showRejectModal && selectedLawyer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>ثبت عدم احراز و رد پرونده وکیل</span>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              با رد این درخواست، وضعیت وکیل «{selectedLawyer.name}» به حالت «رد شده» تغییر یافته و متن
              پیامک اخطار قانونی به شماره {selectedLawyer.phone} ارسال خواهد شد.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                دلیل رد مدارک و شرح نواقص:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onRejectLawyer(selectedLawyer.id, rejectReason);
                  setShowRejectModal(false);
                  showToast(`درخواست وکیل «${selectedLawyer.name}» رد گردید و پیامک ارسال شد.`);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/30"
              >
                <XCircle className="w-4 h-4" />
                <span>تایید رد و ارسال پیامک اخطار</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT LAWYER PROFILE */}
      {/* ========================================================================= */}
      {editingLawyer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Edit className="w-5 h-5" />
                <span>ویرایش اطلاعات وکیل دادگستری</span>
              </div>
              <button
                onClick={() => setEditingLawyer(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  value={editingLawyer.name}
                  onChange={(e) => setEditingLawyer({ ...editingLawyer, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">عنوان تخصصی:</label>
                <input
                  type="text"
                  value={editingLawyer.title}
                  onChange={(e) => setEditingLawyer({ ...editingLawyer, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">شماره پروانه وکالت:</label>
                <input
                  type="text"
                  value={editingLawyer.licenseNumber}
                  onChange={(e) =>
                    setEditingLawyer({ ...editingLawyer, licenseNumber: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">شهر محل اشتغال:</label>
                <input
                  type="text"
                  value={editingLawyer.city}
                  onChange={(e) => setEditingLawyer({ ...editingLawyer, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">هزینه مشاوره تلفنی ۳۰ دقیقه (تومان):</label>
                <input
                  type="number"
                  step="50000"
                  value={editingLawyer.pricing?.phone30min || 450000}
                  onChange={(e) =>
                    setEditingLawyer({
                      ...editingLawyer,
                      pricing: {
                        ...editingLawyer.pricing,
                        phone30min: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">هزینه مشاوره تصویری ۴۵ دقیقه (تومان):</label>
                <input
                  type="number"
                  step="50000"
                  value={editingLawyer.pricing?.videoConsultation || 850000}
                  onChange={(e) =>
                    setEditingLawyer({
                      ...editingLawyer,
                      pricing: {
                        ...editingLawyer.pricing,
                        videoConsultation: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingLawyer(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onUpdateLawyer(editingLawyer);
                  setEditingLawyer(null);
                  showToast(`مشخصات وکیل «${editingLawyer.name}» به‌روزرسانی شد.`);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE / EDIT DYNAMIC PAGE (PAGE BUILDER) */}
      {/* ========================================================================= */}
      {pageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <BookOpen className="w-5 h-5" />
                <span>{editingPage ? 'ویرایش صفحه / نوشتار' : 'ایجاد صفحه یا نوشتار جدید'}</span>
              </div>
              <button
                onClick={() => setPageModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">عنوان صفحه یا مقاله:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: آیین‌نامه مطالبه مهریه از طریق ثبت"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">آدرس یکتا (Slug انگلیسی یا فارسی):</label>
                  <input
                    type="text"
                    required
                    placeholder="mehrieh-claim-guide"
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">دسته‌بندی موضوعی:</label>
                  <select
                    value={pageCategory}
                    onChange={(e) => setPageCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="راهنمای حقوقی">راهنمای حقوقی</option>
                    <option value="قوانین و مقررات">قوانین و مقررات</option>
                    <option value="تعرفه‌ها">تعرفه‌ها</option>
                    <option value="اطلاعیه عمومی">اطلاعیه عمومی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">نویسنده یا مرجع تاییدکننده:</label>
                  <input
                    type="text"
                    value={pageAuthor}
                    onChange={(e) => setPageAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">متن کامل نوشتار یا صفحه حقوقی:</label>
                <textarea
                  rows={8}
                  required
                  placeholder="محتوا، مواد قانونی، تبصره‌ها و راهنمایی‌های موکلین..."
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white leading-relaxed focus:outline-none focus:border-emerald-400 font-sans"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-medium">وضعیت انتشار عمومی در سایت:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pagePublished}
                    onChange={(e) => setPagePublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
                >
                  {editingPage ? 'ذخیره ویرایش صفحه' : 'انتشار صفحه جدید'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CREATE / EDIT MENU & SUBMENU */}
      {/* ========================================================================= */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <MenuIcon className="w-5 h-5" />
                <span>
                  {editingMenuItem
                    ? 'ویرایش منو'
                    : menuParentId
                    ? 'افزودن زیرمنوی جدید'
                    : 'افزودن منوی اصلی جدید'}
                </span>
              </div>
              <button
                onClick={() => setMenuModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">عنوان نمایشی منو:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قوانین چک صیادی"
                  value={menuItemTitle}
                  onChange={(e) => setMenuItemTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  مقصد پیوند (بخش‌های سامانه یا صفحات اختصاصی):
                </label>
                <select
                  value={menuTarget}
                  onChange={(e) => setMenuTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <optgroup label="بخش‌های اصلی نرم‌افزار">
                    <option value="dashboard">داشبورد من</option>
                    <option value="lawyers">بانک وکلای دادگستری</option>
                    <option value="cases">پیگیری پرونده و ثنا</option>
                    <option value="consultations">مشاوره تصویری و چت امن</option>
                    <option value="calendar">تقویم جلسات دادگاه</option>
                    <option value="documents">گاوصندوق اسناد و اوراق</option>
                    <option value="qna">پرسش و پاسخ حقوقی</option>
                    <option value="sms">پیامک‌ها و مهلت‌های قانونی</option>
                    <option value="triage-modal">پنجره تریاژ هوش مصنوعی</option>
                  </optgroup>

                  {pages.length > 0 && (
                    <optgroup label="صفحات اختصاصی ساخته‌شده (Page Builder)">
                      {pages.map((p) => (
                        <option key={p.id} value={`page:${p.slug}`}>
                          صفحه: {p.title}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold"
                >
                  ذخیره منو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: CREATE / EDIT ADMIN ASSISTANT (RBAC) */}
      {/* ========================================================================= */}
      {assistantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Users className="w-5 h-5" />
                <span>{editingAssistant ? 'ویرایش دسترسی دستیار' : 'تعریف مدیر / دستیار جدید'}</span>
              </div>
              <button
                onClick={() => setAssistantModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAssistant} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: نگار صادقی"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">ایمیل کاری سازمانی:</label>
                  <input
                    type="email"
                    required
                    placeholder="negar@dadgostar.ir"
                    value={assistantEmail}
                    onChange={(e) => setAssistantEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">شماره همراه:</label>
                  <input
                    type="text"
                    value={assistantPhone}
                    onChange={(e) => setAssistantPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">عنوان سمت سازمانی:</label>
                  <select
                    value={assistantRoleTitle}
                    onChange={(e) => setAssistantRoleTitle(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="دستیار حقوقی و احراز مدارک">دستیار حقوقی و احراز مدارک</option>
                    <option value="ناظر مالی و تسویه">ناظر مالی و تسویه</option>
                    <option value="دستیار محتوا و منوها">دستیار محتوا و منوها</option>
                    <option value="مدیر کل (SuperAdmin)">مدیر کل (SuperAdmin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">سطح کلی دسترسی:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssistantAccessLevel('restricted')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      assistantAccessLevel === 'restricted'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    دستیار با دسترسی محدود
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssistantAccessLevel('full')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      assistantAccessLevel === 'full'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    مدیر با دسترسی کامل (Full)
                  </button>
                </div>
              </div>

              {/* Granular Permissions Checkboxes */}
              {assistantAccessLevel === 'restricted' && (
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-slate-300 mb-1">
                    تعیین تک‌تک کلیدهای دسترسی:
                  </div>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assistantPerms.canVerifyLawyers}
                      onChange={(e) =>
                        setAssistantPerms({
                          ...assistantPerms,
                          canVerifyLawyers: e.target.checked,
                        })
                      }
                      className="accent-indigo-500 rounded"
                    />
                    <span>تایید یا رد پروانه و هویت وکلا (`canVerifyLawyers`)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assistantPerms.canDeleteLawyers}
                      onChange={(e) =>
                        setAssistantPerms({
                          ...assistantPerms,
                          canDeleteLawyers: e.target.checked,
                        })
                      }
                      className="accent-indigo-500 rounded"
                    />
                    <span>حذف یا تعلیق پرونده وکلا (`canDeleteLawyers`)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assistantPerms.canManageCommission}
                      onChange={(e) =>
                        setAssistantPerms({
                          ...assistantPerms,
                          canManageCommission: e.target.checked,
                        })
                      }
                      className="accent-indigo-500 rounded"
                    />
                    <span>تنظیم کارمزد سایت، تعرفه‌ها و سهم وکلا (`canManageCommission`)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assistantPerms.canManagePages}
                      onChange={(e) =>
                        setAssistantPerms({
                          ...assistantPerms,
                          canManagePages: e.target.checked,
                        })
                      }
                      className="accent-indigo-500 rounded"
                    />
                    <span>ایجاد، ویرایش و حذف صفحات و نوشتارها (`canManagePages`)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assistantPerms.canManageMenus}
                      onChange={(e) =>
                        setAssistantPerms({
                          ...assistantPerms,
                          canManageMenus: e.target.checked,
                        })
                      }
                      className="accent-indigo-500 rounded"
                    />
                    <span>ساخت و مرتب‌سازی منوها و زیرمنوها (`canManageMenus`)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assistantPerms.canAccessFinancials}
                      onChange={(e) =>
                        setAssistantPerms({
                          ...assistantPerms,
                          canAccessFinancials: e.target.checked,
                        })
                      }
                      className="accent-indigo-500 rounded"
                    />
                    <span>دسترسی به گزارش‌های مالی، تراکنش‌ها و تسویه (`canAccessFinancials`)</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssistantModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold"
                >
                  {editingAssistant ? 'ذخیره تغییرات دسترسی' : 'ایجاد حساب دستیار'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
