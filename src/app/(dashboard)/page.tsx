/**
 * ===================================================================
 * DASHBOARD HOME PAGE
 * ===================================================================
 *
 * Trang chủ của Dashboard, hiển thị tại URL: /
 *
 * ===================================================================
 * ROUTE MAPPING
 * ===================================================================
 *
 * File: src/app/(dashboard)/page.tsx
 * URL: / (root)
 *
 * Route group (dashboard) không ảnh hưởng URL.
 * File page.tsx trong (dashboard)/ sẽ map tới root URL.
 *
 * ===================================================================
 * LAYOUT INHERITANCE
 * ===================================================================
 *
 * Page này được wrap bởi:
 * 1. RootLayout (providers)
 * 2. DashboardGroupLayout (DashboardLayout)
 *
 * Do đó tự động có:
 * - SidebarLeft (navigation)
 * - Header
 * - MainContent (nội dung page này)
 * - SidebarRight (notes/tasks)
 */

import { ArrowRight, CheckCircle2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggler } from '@/components/ui/DarkTheme';

/**
 * Dashboard Home Page Component
 *
 * Hiển thị welcome message và feature highlights.
 * Đây là placeholder - có thể thay bằng dashboard stats, charts, etc.
 */
export default function DashboardHomePage() {
  return <>Xin chào</>;
}
