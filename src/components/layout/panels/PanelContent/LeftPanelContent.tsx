'use client';

/**
 * ===================================================================
 * LEFT PANEL CONTENT - NỘI DUNG SIDEBAR TRÁI
 * ===================================================================
 *
 * ===================================================================
 * NGUYÊN TẮC COLLAPSE (CỰC KỲ QUAN TRỌNG)
 * ===================================================================
 *
 * COLLAPSE ≠ REMOVE
 * COLLAPSE = GIỮ NODE + ĐỔI CÁCH HIỂN THỊ
 *
 * Cấu trúc 2 lớp:
 * ┌─────────────────────────────────┐
 * │ NavItem (LUÔN render)          │
 * │  ├─ Icon (LUÔN hiển thị)       │
 * │  └─ Text (opacity-0 khi collapse) │
 * └─────────────────────────────────┘
 *
 * ❌ SAI:
 * - {!isCollapsed && <span>Text</span>} ← unmount DOM
 * - hidden ← display: none
 * - w-0 cho cả wrapper ← mất click area
 *
 * ✅ ĐÚNG:
 * - <span className={isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}>
 * - overflow-hidden để text không tràn
 * - transition để animation mượt
 *
 * VÌ SAO PHẢI LÀM THẾ NÀY?
 * -------------------------
 * Khi collapse bằng conditional render:
 * - DOM structure thay đổi
 * - Browser phải reflow
 * - Grid có thể bị vỡ vì content thay đổi đột ngột
 *
 * Khi collapse bằng opacity/width:
 * - DOM structure giữ nguyên
 * - Chỉ thay đổi visual
 * - Grid ổn định
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Icons
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

/* ===== TYPES ===== */

interface LeftPanelContentProps {
  showHeader?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

/* ===== SUB-COMPONENTS ===== */

/**
 * NavItem với cấu trúc 2 lớp cho collapse
 */
interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  href?: string;
}

function NavItem({
  icon: Icon,
  label,
  badge,
  isActive = false,
  isCollapsed = false,
  href = '#',
}: NavItemProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      } `}
      /**
       * MIN-WIDTH để giữ click area khi collapsed
       * Không để w-0 vì sẽ mất khả năng click
       */
      style={{ minWidth: isCollapsed ? '40px' : undefined }}
    >
      {/* ===== ICON: LUÔN HIỂN THỊ ===== */}
      <Icon className="h-5 w-5 flex-shrink-0" />

      {/* ===== TEXT + BADGE: ẨN BẰNG OPACITY/WIDTH ===== */}
      {/**
       * KHÔNG dùng: {!isCollapsed && <span>{label}</span>}
       * VÌ: Sẽ unmount DOM, gây reflow
       *
       * DÙNG: opacity-0 + w-0 + overflow-hidden
       * VÌ: Giữ DOM, chỉ ẩn visual
       */}
      <span
        className={`flex-1 truncate whitespace-nowrap transition-all duration-200 ${
          isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
        } `}
      >
        {label}
      </span>

      {/* Badge cũng ẩn bằng opacity */}
      {badge && (
        <span
          className={`bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs font-medium transition-all duration-200 ${isCollapsed ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} `}
        >
          {badge}
        </span>
      )}
    </a>
  );
}

/**
 * NavSection với title ẩn khi collapsed
 */
function NavSection({
  title,
  isCollapsed,
  children,
}: {
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="py-2">
      {/* Title: ẩn bằng opacity, KHÔNG unmount */}
      <div
        className={`text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'} `}
      >
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/* ===== MAIN COMPONENT ===== */

export function LeftPanelContent({
  showHeader = true,
  isCollapsed = false,
  onToggleCollapse,
}: LeftPanelContentProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ===== HEADER: Logo + Toggle Button ===== */}
      {showHeader && (
        <div className="border-border flex min-h-[56px] items-center justify-between border-b p-3">
          {/* Logo: ẩn bằng opacity, KHÔNG unmount */}
          <span
            className={`font-display text-lg font-bold transition-all duration-200 ${
              isCollapsed
                ? 'w-0 overflow-hidden opacity-0'
                : 'w-auto opacity-100'
            } `}
          >
            Vicophar
          </span>

          {/* Toggle Button: LUÔN hiển thị */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex-shrink-0 rounded-lg p-2 transition-colors"
              aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      )}

      {/* ===== NAVIGATION ===== */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto px-2 py-2">
        <NavSection title="Menu" isCollapsed={isCollapsed}>
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            isActive
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={ClipboardList}
            label="Tasks"
            badge="12+"
            isCollapsed={isCollapsed}
          />
          <NavItem icon={Calendar} label="Calendar" isCollapsed={isCollapsed} />
          <NavItem
            icon={BarChart3}
            label="Analytics"
            isCollapsed={isCollapsed}
          />
          <NavItem icon={Users} label="Team" isCollapsed={isCollapsed} />
        </NavSection>

        <NavSection title="General" isCollapsed={isCollapsed}>
          <NavItem icon={Settings} label="Settings" isCollapsed={isCollapsed} />
          <NavItem icon={HelpCircle} label="Help" isCollapsed={isCollapsed} />
          <NavItem icon={LogOut} label="Logout" isCollapsed={isCollapsed} />
        </NavSection>
      </div>

      {/* ===== PROMO CARD: ẩn bằng opacity + scale ===== */}
      <div
        className={`mt-auto p-3 transition-all duration-200 ${
          isCollapsed
            ? 'h-0 scale-95 overflow-hidden p-0 opacity-0'
            : 'h-auto scale-100 opacity-100'
        } `}
      >
        <div className="from-primary/20 to-primary/5 rounded-xl bg-gradient-to-br p-4">
          <div className="mb-2 text-sm font-medium">
            Download our Mobile App
          </div>
          <div className="text-muted-foreground mb-3 text-xs">
            Get easy in another way
          </div>
          <button className="bg-primary text-primary-foreground w-full rounded-lg py-2 text-sm font-medium transition-opacity hover:opacity-90">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeftPanelContent;
