/**
 * ============================================
 * SIDEBAR RIGHT - WRAPPER ĐƠN GIẢN
 * ============================================
 *
 * Chỉ là wrapper để mỗi page tự define nội dung sidebar.
 *
 * Cách sử dụng trong page:
 * ------------------------
 * ```tsx
 * // Trong page.tsx - truyền rightSidebar vào DashboardLayout
 * export default function ProductsPage() {
 *   return (
 *     <DashboardLayout rightSidebar={
 *       <div>
 *         <h3>Product Filters</h3>
 *         <FilterOptions />
 *       </div>
 *     }>
 *       <ProductList />
 *     </DashboardLayout>
 *   );
 * }
 * ```
 */

'use client';

import React, { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useDashboard } from '@/components/providers/DashboardContext';

// ============================================
// TYPES
// ============================================
interface SidebarRightProps {
  /** Nội dung sidebar - mỗi page tự define */
  children?: ReactNode;
  /** Class CSS bổ sung */
  className?: string;
  /** Có hiển thị nút đóng không (mặc định: true) */
  showCloseButton?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================
export function SidebarRight({ children, className = '' }: SidebarRightProps) {
  return (
    <aside
      className={`flex h-full flex-col ${className}`}
      aria-label="Sidebar phụ trợ"
    >
      {/* Content: Mỗi page tự truyền vào */}
      <div className="flex-1 overflow-y-auto">
        {children || (
          <div className="text-muted-foreground p-4 text-center text-sm">
            Chưa có nội dung sidebar
          </div>
        )}
      </div>
    </aside>
  );
}

export default SidebarRight;
