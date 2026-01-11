/**
 * ===================================================================
 * MAIN CONTENT COMPONENT
 * ===================================================================
 *
 * Container cho nội dung chính của mỗi page.
 * Đây là nơi render {children} từ các page components.
 *
 * Đặc điểm:
 * - Scroll độc lập (không ảnh hưởng sidebar và header)
 * - Chiếm toàn bộ không gian còn lại sau header
 * - Có padding mặc định
 */

import React, { type ReactNode } from 'react';

/* ===== TYPES ===== */

interface MainContentProps {
  /** Nội dung page (children từ layout) */
  children: ReactNode;
  /** Class CSS bổ sung */
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
      className={`main-content ${noPadding ? 'p-0!' : ''} ${className}`}
      role="main"
      aria-label="Nội dung chính"
    >
      {children}
    </main>
  );
}

/* ===== EXPORT MẶC ĐỊNH ===== */
export default MainContent;
