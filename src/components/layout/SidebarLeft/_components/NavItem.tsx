'use client';

/**
 * NavItem Component
 * Component cho từng item trong navigation menu
 */

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { useDashboard } from '@/components/providers/DashboardContext';

export interface NavItemProps {
  /** Link href */
  href: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Label text */
  label: string;
  /** Badge content (optional) */
  badge?: string;
  /** Is this item active? */
  isActive?: boolean;
  /** onClick handler */
  onClick?: () => void;
}

export function NavItem({
  href,
  icon: Icon,
  label,
  badge,
  isActive = false,
  onClick,
}: NavItemProps) {
  const { isLeftSidebarCollapsed } = useDashboard();

  // Base classes cho tất cả items
  const baseClasses =
    'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors';

  // Classes cho active/inactive state
  const stateClasses = isActive
    ? 'relative text-foreground bg-accent/50'
    : 'text-muted-foreground hover:bg-accent hover:text-foreground';

  return (
    <a
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${stateClasses}`}
    >
      {/* Active Indicator (border xanh bên trái) */}
      {isActive && (
        <span className="bg-primary absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full" />
      )}

      {/* Icon */}
      <Icon className="h-5 w-5 shrink-0" />

      {/* Text + Badge (chỉ hiện khi không collapsed) */}
      {!isLeftSidebarCollapsed && (
        <>
          <span className={`sidebar-text ${isActive ? 'font-medium' : ''}`}>
            {label}
          </span>

          {/* Badge */}
          {badge && (
            <span className="bg-primary/10 text-primary sidebar-text ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
              {badge}
            </span>
          )}
        </>
      )}
    </a>
  );
}

export default NavItem;
