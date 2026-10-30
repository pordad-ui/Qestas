export type MenuLocation = 
  | 'home_grid'
  | 'side_drawer'
  | 'bottom_nav'
  | 'sub_menu'
  | 'secondary_tools';

export type IconStyle = 'colored' | 'linear' | 'minimal';

export interface DynamicMenuItem {
  id: string;
  location: MenuLocation;
  title: string;
  slug: string;
  target_url: string; // e.g. '#cases', '#lawyers', '#consultation', '#triage', '#documents', '#wallet', '#calendar', '#qna', '#ablaghieh'
  icon_name: string; // Icon identifier e.g. 'Gavel', 'Users', 'Briefcase', 'BookOpen', 'MessageSquare', 'FileEdit', 'ShieldCheck'
  icon_style: IconStyle;
  color_theme?: string; // 'amber' | 'teal' | 'indigo' | 'cyan' | 'emerald' | 'purple' | 'rose'
  badge_text?: string;
  description?: string;
  order: number;
  is_active: boolean; // Soft delete / Hide toggle
}

export type TextCategory = 
  | 'brand'
  | 'header'
  | 'hero_card'
  | 'timeline'
  | 'actions'
  | 'bottom_nav'
  | 'drawer'
  | 'tools'
  | 'common';

export interface DynamicTextItem {
  key: string;
  value: string;
  category: TextCategory;
  label: string;
  description?: string;
}
