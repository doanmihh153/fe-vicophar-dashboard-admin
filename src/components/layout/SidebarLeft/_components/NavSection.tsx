'use client';

/**
 * NavSection Component
 * Wrapper cho một section trong navigation (MENU, GENERAL, etc.)
 */

import React, { type ReactNode } from 'react';
import { useDashboard } from '@/components/providers/DashboardContext';

export interface NavSectionProps {
  /** Title của section (e.g., "Menu", "General") */
  title: string;
  /** Các NavItem children */
  children: ReactNode;
}

export function NavSection({ title, children }: NavSectionProps) {
  const { isLeftSidebarCollapsed } = useDashboard();

  return (
    <div className="mb-6">
      {/* Section Label - Ẩn khi collapsed */}
      {!isLeftSidebarCollapsed && (
        <p className="text-muted-foreground sidebar-text mb-3 px-3 text-xs font-semibold tracking-wider uppercase">
          {title}
        </p>
      )}

      {/* Navigation Items */}
      <nav className="space-y-1">{children}</nav>
    </div>
  );
}

export default NavSection;
