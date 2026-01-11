'use client';

/**
 * ===================================================================
 * SIDEBAR LEFT COMPONENT
 * ===================================================================
 *
 * Sidebar trái chứa navigation menu của dashboard.
 * Sử dụng THUẦN TailwindCSS utility classes.
 *
 * RESPONSIVE BEHAVIOR:
 * - Desktop/Tablet (>= 768px): Hiển thị trong grid layout
 * - Mobile (< 768px): Chuyển thành drawer fixed overlay
 *
 * QUAN TRỌNG:
 * - Trên mobile, component render drawer riêng với fixed positioning
 * - Overlay backdrop khi mở
 * - Close button để đóng drawer
 */

import React, { type ReactNode, useEffect, useState } from 'react';
import { useDashboard } from '@/components/providers/DashboardContext';
import { X } from 'lucide-react';

// Sub-components
import { NavItem, NavSection, SidebarHeader, PromoCard } from './_components';

// Lucide Icons
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

/* ===== HOOK: Detect mobile breakpoint ===== */
/**
 * Hook kiểm tra viewport có đang ở mobile không
 * @param breakpoint - Breakpoint để xác định mobile (mặc định 768px - md)
 */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Kiểm tra lần đầu khi mount
    checkIsMobile();

    // Lắng nghe resize
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}

/* ===== TYPES ===== */

interface SidebarLeftProps {
  /** Override toàn bộ nội dung sidebar */
  children?: ReactNode;
  /** Class Tailwind bổ sung (từ parent) */
  className?: string;
}

/* ===== COMPONENT ===== */

export function SidebarLeft({ children, className = '' }: SidebarLeftProps) {
  const { isLeftSidebarCollapsed, isLeftSidebarOpen, toggleLeftSidebar } =
    useDashboard();

  // Phát hiện mobile breakpoint (< 768px)
  const isMobile = useIsMobile(768);

  /**
   * NỘI DUNG SIDEBAR
   * Tách riêng để có thể reuse cho cả desktop và mobile drawer
   */
  const SidebarContent = (
    <>
      {/* Header: Logo + Toggle (chỉ hiện trên desktop) */}
      {!isMobile && <SidebarHeader brandName="Vicophar" />}

      {/* Navigation Content */}
      {children || (
        <div className="flex-1 overflow-y-auto px-3">
          {/* Section: Menu */}
          <NavSection title="Menu">
            <NavItem
              href="#"
              icon={LayoutDashboard}
              label="Dashboard"
              isActive
            />
            <NavItem href="#" icon={ClipboardList} label="Tasks" badge="12+" />
            <NavItem href="#" icon={Calendar} label="Calendar" />
            <NavItem href="#" icon={BarChart3} label="Analytics" />
            <NavItem href="#" icon={Users} label="Team" />
          </NavSection>

          {/* Section: General */}
          <NavSection title="General">
            <NavItem href="#" icon={Settings} label="Settings" />
            <NavItem href="#" icon={HelpCircle} label="Help" />
            <NavItem href="#" icon={LogOut} label="Logout" />
          </NavSection>
        </div>
      )}

      {/* Footer: Promo Card (chỉ hiện khi không collapsed) */}
      {(!isLeftSidebarCollapsed || isMobile) && (
        <div className="mt-auto p-4">
          <PromoCard
            title="Download our&#10;Mobile App"
            description="Get easy in another way"
            buttonText="Download"
          />
        </div>
      )}
    </>
  );

  /**
   * MOBILE DRAWER
   * Render drawer fixed overlay trên mobile (< 768px)
   */
  if (isMobile) {
    return (
      <>
        {/* Overlay Backdrop - click để đóng */}
        {isLeftSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity"
            onClick={toggleLeftSidebar}
            aria-label="Đóng menu"
          />
        )}

        {/* Drawer Container */}
        <aside
          className={`bg-card fixed top-0 left-0 z-50 flex h-screen w-[85vw] max-w-[300px] transform flex-col shadow-xl transition-transform duration-300 ease-in-out ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}
          aria-label="Menu điều hướng"
        >
          {/* Close Button */}
          <div className="border-border flex items-center justify-between border-b p-4">
            <span className="font-display text-lg font-bold">Vicophar</span>
            <button
              onClick={toggleLeftSidebar}
              className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg p-2 transition-colors"
              aria-label="Đóng menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar Content */}
          {SidebarContent}
        </aside>
      </>
    );
  }

  /**
   * DESKTOP/TABLET VIEW
   * Render sidebar trong grid layout (từ parent DashboardLayout)
   * className được truyền từ parent với responsive classes
   */
  return (
    <aside
      className={`${className} flex-col`}
      aria-label="Sidebar điều hướng chính"
    >
      {/* Container wrapper với styling */}
      <div className="bg-card m-3 flex flex-1 flex-col overflow-hidden rounded-2xl shadow-lg">
        {SidebarContent}
      </div>
    </aside>
  );
}

/* ===== EXPORT MẶC ĐỊNH ===== */
export default SidebarLeft;
