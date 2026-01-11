'use client';

/**
 * ===================================================================
 * DASHBOARD LAYOUT - LAYOUT CHÍNH
 * ===================================================================
 *
 * ===================================================================
 * NGUYÊN TẮC GRID ỔN ĐỊNH (CỰC KỲ QUAN TRỌNG)
 * ===================================================================
 *
 * DESKTOP GRID LUÔN LUÔN CÓ 3 CỘT
 * ---------------------------------
 *
 * ❌ SAI (đổi số cột):
 * - RIGHT OPEN:  grid-cols-[260px_1fr_320px] (3 cột)
 * - RIGHT CLOSE: grid-cols-[260px_1fr]       (2 cột)
 *
 * ✅ ĐÚNG (giữ 3 cột):
 * - LEFT OPEN   + RIGHT OPEN:   260px 1fr 320px
 * - LEFT CLOSE  + RIGHT OPEN:   64px  1fr 320px
 * - LEFT OPEN   + RIGHT CLOSE:  260px 1fr 0px
 * - LEFT CLOSE  + RIGHT CLOSE:  64px  1fr 0px  ← QUAN TRỌNG!
 *
 * ⚠️ PHẢI DÙNG 0px (KHÔNG PHẢI 0)
 * --------------------------------
 * grid-cols-[64px_1fr_0]   ← SAI! Browser drop grid
 * grid-cols-[64px_1fr_0px] ← ĐÚNG!
 */

import React, { type ReactNode, useEffect } from 'react';

// Hooks
import { useIsDesktop } from '@/hooks';
import { useDashboard } from '@/components/providers/DashboardContext';

// Components
import { Header } from '@/components/layout/Header';
import { MainContent } from '@/components/layout/MainContent';
import {
  DrawerPanel,
  LeftPanelContent,
  RightPanelContent,
} from '@/components/layout/panels';

/* ===== TYPES ===== */

interface DashboardLayoutProps {
  children: ReactNode;
  headerTitle?: string;
  headerActions?: ReactNode;
  headerContent?: ReactNode;
  sidebarContent?: ReactNode;
  rightPanelContent?: ReactNode;
  noPadding?: boolean;
  className?: string;
}

/* ===== COMPONENT ===== */

export function DashboardLayout({
  children,
  headerTitle = 'Dashboard',
  headerActions,
  headerContent,
  sidebarContent,
  rightPanelContent,
  noPadding = false,
  className = '',
}: DashboardLayoutProps) {
  const isDesktop = useIsDesktop();

  const {
    isLeftOpen,
    setLeftOpen,
    isLeftCollapsed,
    toggleLeftCollapse,
    isRightOpen,
    setRightOpen,
    toggleLeft,
    toggleRight,
  } = useDashboard();

  /**
   * AUTO SYNC STATE KHI BREAKPOINT THAY ĐỔI
   */
  useEffect(() => {
    if (isDesktop) {
      setLeftOpen(true);
      setRightOpen(true);
    } else {
      setLeftOpen(false);
      setRightOpen(false);
    }
  }, [isDesktop, setLeftOpen, setRightOpen]);

  /**
   * ===== TÍNH TOÁN GRID COLUMNS =====
   *
   * 4 TRẠNG THÁI HỢP LỆ (DESKTOP):
   * 1. LEFT OPEN   + RIGHT OPEN   → 260px 1fr 320px
   * 2. LEFT CLOSE  + RIGHT OPEN   → 64px  1fr 320px
   * 3. LEFT OPEN   + RIGHT CLOSE  → 260px 1fr 0px
   * 4. LEFT CLOSE  + RIGHT CLOSE  → 64px  1fr 0px
   *
   * ⚠️ BẮT BUỘC:
   * - Dùng 0px (KHÔNG PHẢI 0)
   * - Không dùng auto
   * - Không bỏ cột
   */
  const getGridColumns = (): string => {
    // Tablet/Mobile: 1 cột
    if (!isDesktop) {
      return 'grid-cols-1';
    }

    // Desktop: LUÔN 3 cột với giá trị EXPLICIT
    const leftWidth = isLeftCollapsed ? '64px' : '260px';
    const rightWidth = isRightOpen ? '320px' : '0px'; // ⚠️ PHẢI LÀ 0px

    return `grid-cols-[${leftWidth}_1fr_${rightWidth}]`;
  };

  return (
    <>
      {/* ===== GRID LAYOUT (DESKTOP) ===== */}
      <div
        className={`grid h-screen w-screen overflow-hidden ${getGridColumns()} transition-all duration-300 ease-in-out ${className} `}
      >
        {/* ===== CỘT 1: SIDEBAR LEFT ===== */}
        {/**
         * LUÔN RENDER trên Desktop
         * Collapse = đổi width column (260px → 64px)
         * Content bên trong ẩn bằng opacity, KHÔNG unmount
         */}
        {isDesktop && (
          <aside className="bg-sidebar border-sidebar-border flex h-screen flex-col overflow-hidden border-r transition-all duration-300">
            {sidebarContent || (
              <LeftPanelContent
                showHeader={true}
                isCollapsed={isLeftCollapsed}
                onToggleCollapse={toggleLeftCollapse}
              />
            )}
          </aside>
        )}

        {/* ===== CỘT 2: MAIN AREA ===== */}
        <div className="grid h-screen min-w-0 grid-rows-[64px_1fr] overflow-hidden">
          <Header
            title={headerTitle}
            actions={headerActions}
            className="border-border bg-background flex h-16 items-center border-b px-4"
          >
            {headerContent}
          </Header>

          <MainContent
            noPadding={noPadding}
            className="bg-background overflow-x-hidden overflow-y-auto overscroll-contain"
          >
            {children}
          </MainContent>
        </div>

        {/* ===== CỘT 3: SIDEBAR RIGHT ===== */}
        {/**
         * LUÔN RENDER để giữ grid 3 cột ổn định
         * Close = width 0px (do grid-template-columns)
         * Content ẩn bằng overflow-hidden
         *
         * ❌ KHÔNG:
         * - unmount (isRightOpen && <SidebarRight />)
         * - hidden
         * - display: none
         */}
        {isDesktop && (
          <aside
            className={`bg-sidebar border-sidebar-border flex h-screen flex-col overflow-hidden border-l transition-all duration-300 ${isRightOpen ? '' : 'pointer-events-none'} `}
          >
            {rightPanelContent || <RightPanelContent />}
          </aside>
        )}
      </div>

      {/* ===== DRAWER LAYER (TABLET/MOBILE) ===== */}
      {!isDesktop && (
        <>
          <DrawerPanel
            side="left"
            isOpen={isLeftOpen}
            onClose={toggleLeft}
            headerTitle="Vicophar"
          >
            {sidebarContent || <LeftPanelContent showHeader={false} />}
          </DrawerPanel>

          <DrawerPanel
            side="right"
            isOpen={isRightOpen}
            onClose={toggleRight}
            showCloseButton={false}
          >
            {rightPanelContent || <RightPanelContent showCloseButton={true} />}
          </DrawerPanel>
        </>
      )}
    </>
  );
}

export default DashboardLayout;
