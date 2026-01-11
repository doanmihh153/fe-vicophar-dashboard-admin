/**
 * ===================================================================
 * DASHBOARD ROUTE GROUP LAYOUT
 * ===================================================================
 *
 * Layout cho tất cả pages trong route group (dashboard).
 *
 * ===================================================================
 * ROUTE GROUP LÀ GÌ?
 * ===================================================================
 *
 * Route group trong Next.js được đánh dấu bằng dấu ngoặc đơn: (name)
 *
 * Đặc điểm:
 * - KHÔNG ảnh hưởng đến URL path
 * - Cho phép tổ chức routes logic
 * - Cho phép có layout riêng cho nhóm routes
 *
 * Ví dụ:
 * - (dashboard)/page.tsx      → URL: /
 * - (dashboard)/tasks/page.tsx → URL: /tasks
 * - (auth)/login/page.tsx      → URL: /login
 *
 * ===================================================================
 * VAI TRÒ CỦA FILE NÀY
 * ===================================================================
 *
 * File này wrap DashboardLayout cho TẤT CẢ pages trong (dashboard)/*
 *
 * Các pages trong (dashboard)/:
 * - / (Dashboard home)
 * - /tasks
 * - /calendar
 * - /analytics
 * - /team
 * - /settings
 *
 * Tất cả đều tự động có:
 * - SidebarLeft (navigation)
 * - Header
 * - MainContent
 * - SidebarRight (notes/tasks)
 *
 * ===================================================================
 * THÊM PAGE MỚI
 * ===================================================================
 *
 * Để thêm page mới vào dashboard:
 * 1. Tạo folder trong (dashboard)/, ví dụ: (dashboard)/reports/
 * 2. Tạo file page.tsx trong folder
 * 3. Page tự động có DashboardLayout
 *
 * Ví dụ:
 * ```
 * // (dashboard)/reports/page.tsx
 * export default function ReportsPage() {
 *   return <div>Reports content</div>;
 * }
 * ```
 * → URL: /reports với đầy đủ sidebar
 */

import { DashboardLayout } from '@/components/layout';

/**
 * Props interface cho layout
 * children = page content được render trong MainContent
 */
interface DashboardGroupLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Group Layout
 *
 * Wrap DashboardLayout cho tất cả pages trong (dashboard)/*
 * Không cần config gì thêm - DashboardLayout tự xử lý responsive.
 */
export default function DashboardGroupLayout({
  children,
}: DashboardGroupLayoutProps) {
  return (
    <DashboardLayout
      /*
       * headerTitle: Title mặc định cho header
       * Có thể override trong từng page bằng cách sử dụng
       * DashboardLayout trực tiếp với props khác
       */
      headerTitle="Dashboard"
    >
      {children}
    </DashboardLayout>
  );
}
