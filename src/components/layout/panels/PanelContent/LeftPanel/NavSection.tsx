'use client';

import React from 'react';

/**
 * ---------------------------------------------------------------
 * NavSection - Một section chứa nhiều NavItem
 * ---------------------------------------------------------------
 *
 * Ví dụ: Section "MENU" chứa Dashboard, Tasks, Calendar, etc.
 *
 * Title của section cũng ẩn bằng opacity khi collapsed.
 */
export function NavSection({
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
      {/*
       * SECTION TITLE: ẩn bằng opacity + height
       *
       * Không dùng hidden vì sẽ gây layout shift.
       * h-0 + overflow-hidden ẩn mà vẫn giữ DOM.
       */}
      <div
        className={`text-muted-foreground px-3 text-xs tracking-wider uppercase transition-all duration-200 ${
          isCollapsed
            ? 'mb-0 h-0 overflow-hidden opacity-0'
            : 'mb-2 h-auto opacity-100'
        } `}
      >
        {title}
      </div>

      {/* Container cho các NavItem */}
      <div className="space-y-1">{children}</div>
    </div>
  );
}
