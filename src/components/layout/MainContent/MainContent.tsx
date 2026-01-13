/**
 * ===================================================================
 * MAIN CONTENT COMPONENT
 * ===================================================================
 *
 * Container cho nội dung chính của mỗi page.
 * Sử dụng THUẦN TailwindCSS utility classes.
 *
 * CHỨC NĂNG:
 * - Scroll độc lập (overflow-y-auto)
 * - Chiếm toàn bộ không gian còn lại sau header (flex-1)
 * - Padding mặc định có thể tắt
 *
 * QUAN TRỌNG:
 * - overflow-y-auto: Scroll độc lập, không ảnh hưởng sidebar/header
 * - overscroll-contain: Ngăn scroll chain đến parent
 */

import React, { type ReactNode } from 'react';

/* ===== TYPES ===== */

interface MainContentProps {
  /** Nội dung page (children từ layout) */
  children: ReactNode;
  /** Class Tailwind bổ sung (từ parent) */
  className?: string;
  /** Tắt padding mặc định */
  noPadding?: boolean;
}

/* ===== COMPONENT ===== */

export function MainContent({
  children,
  className = '',
  noPadding = false,
}: MainContentProps) {
  return (
    <main
      className={`flex-1 overflow-x-hidden overflow-y-auto overscroll-contain ${noPadding ? '' : 'pt-4 lg:pt-6'} ${className} `}
      role="main"
      aria-label="Nội dung chính"
    >
      {children}
    </main>
  );
}

/* ===== EXPORT MẶC ĐỊNH ===== */
export default MainContent;
