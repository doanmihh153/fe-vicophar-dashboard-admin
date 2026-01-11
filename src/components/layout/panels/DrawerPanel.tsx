'use client';

/**
 * ===================================================================
 * DRAWER PANEL - UI PRIMITIVE CHO DRAWER MODE
 * ===================================================================
 *
 * Component này là UI PRIMITIVE thuần cho sidebar khi render dạng drawer.
 * Được sử dụng trên Mobile và Tablet (khi sidebar cần overlay).
 * Đây thuộc lớp PANEL RENDERER trong kiến trúc 3 lớp.
 *
 * ===================================================================
 * NGUYÊN TẮC QUAN TRỌNG
 * ===================================================================
 * 1. KHÔNG CHỨA LOGIC BREAKPOINT
 *    - Không sử dụng useBreakpoint
 *    - Không check window.innerWidth
 *    - Không có if/else mobile/desktop
 *
 * 2. CHỈ RENDER UI DỰA TRÊN PROPS
 *    - Nhận side ('left' | 'right')
 *    - Nhận isOpen (boolean)
 *    - Nhận onClose (callback)
 *    - Nhận children (nội dung)
 *
 * 3. PARENT QUYẾT ĐỊNH KHI NÀO RENDER
 *    - Component này không tự quyết định có render hay không
 *    - DashboardLayout quyết định render dựa trên breakpoint
 *
 * ===================================================================
 * CẤU TRÚC
 * ===================================================================
 * <DrawerPanel>
 *   ├─ Overlay (backdrop mờ, click để đóng)
 *   └─ Panel (sidebar content, position: fixed)
 *
 * ===================================================================
 * ANIMATION
 * ===================================================================
 * - Left drawer: Trượt từ trái sang (-translate-x-full ↔ translate-x-0)
 * - Right drawer: Trượt từ phải sang (translate-x-full ↔ translate-x-0)
 * - Duration: 300ms
 * - Easing: ease-in-out
 */

import React, { type ReactNode } from 'react';
import { X } from 'lucide-react';

/* ===== TYPES ===== */

interface DrawerPanelProps {
  /** Vị trí drawer: trái hoặc phải */
  side: 'left' | 'right';

  /** Drawer có đang mở không */
  isOpen: boolean;

  /** Callback khi đóng drawer (click overlay hoặc close button) */
  onClose: () => void;

  /** Nội dung bên trong drawer */
  children: ReactNode;

  /** Classes Tailwind bổ sung */
  className?: string;

  /** Hiển thị close button hay không */
  showCloseButton?: boolean;

  /** Title hiển thị trong header (optional) */
  headerTitle?: string;
}

/* ===== COMPONENT ===== */

export function DrawerPanel({
  side,
  isOpen,
  onClose,
  children,
  className = '',
  showCloseButton = true,
  headerTitle,
}: DrawerPanelProps) {
  /**
   * KHÔNG CÓ LOGIC BREAKPOINT Ở ĐÂY
   * Component chỉ render UI dựa trên props được truyền vào
   */

  /**
   * POSITION CLASSES
   * - Left drawer: left-0
   * - Right drawer: right-0
   */
  const positionClasses = side === 'left' ? 'left-0' : 'right-0';

  /**
   * TRANSFORM CLASSES
   * Animation trượt vào/ra
   * - Left: -translate-x-full (đóng) ↔ translate-x-0 (mở)
   * - Right: translate-x-full (đóng) ↔ translate-x-0 (mở)
   */
  const transformClasses = isOpen
    ? 'translate-x-0'
    : side === 'left'
      ? '-translate-x-full'
      : 'translate-x-full';

  /**
   * WIDTH CLASSES
   * - 85vw trên mobile nhỏ
   * - Max 300px cho left, 320px cho right
   */
  const widthClasses =
    side === 'left' ? 'w-[85vw] max-w-[300px]' : 'w-[85vw] max-w-[320px]';

  return (
    <>
      {/* ===== OVERLAY BACKDROP ===== */}
      {/**
       * - fixed inset-0: Phủ toàn màn hình
       * - z-40: Dưới drawer panel (z-50)
       * - bg-black/50: Nền đen 50% opacity
       * - Click để đóng drawer
       * - CHỈ render khi isOpen = true
       */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={onClose}
          aria-label="Đóng drawer"
        />
      )}

      {/* ===== DRAWER PANEL ===== */}
      <aside
        className={`fixed top-0 ${positionClasses} z-50 h-screen ${widthClasses} bg-sidebar flex transform flex-col shadow-xl ${transformClasses} transition-transform duration-300 ease-in-out ${className} `}
        aria-label={side === 'left' ? 'Menu điều hướng' : 'Panel phụ trợ'}
        aria-hidden={!isOpen}
      >
        {/* ===== HEADER (với close button) ===== */}
        {(showCloseButton || headerTitle) && (
          <div className="border-border flex items-center justify-between border-b p-4">
            {/* Title nếu có */}
            {headerTitle && (
              <span className="font-display text-lg font-bold">
                {headerTitle}
              </span>
            )}

            {/* Spacer nếu không có title */}
            {!headerTitle && <div />}

            {/* Close button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg p-2 transition-colors"
                aria-label="Đóng drawer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* ===== CONTENT ===== */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </>
  );
}

/* ===== DEFAULT EXPORT ===== */
export default DrawerPanel;
