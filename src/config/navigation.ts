import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

export interface NavItemConfig {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

export interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

export const NAV_SECTIONS: NavSectionConfig[] = [
  {
    title: 'Menu',
    items: [
      {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
      },
      {
        title: 'Tasks',
        href: '/tasks',
        icon: ClipboardList,
        badge: '12+',
      },
      {
        title: 'Calendar',
        href: '/calendar',
        icon: Calendar,
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      },
      {
        title: 'Team',
        href: '/team',
        icon: Users,
      },
    ],
  },
  {
    title: 'General',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
      {
        title: 'Help',
        href: '/help',
        icon: HelpCircle,
      },
      {
        title: 'Logout',
        href: '#',
        icon: LogOut,
      },
    ],
  },
];
