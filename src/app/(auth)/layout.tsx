/**
 * ===================================================================
 * AUTH ROUTE GROUP LAYOUT
 * ===================================================================
 *
 * Layout cho tất cả pages trong route group (auth).
 *
 * ===================================================================
 * ĐẶC ĐIỂM QUAN TRỌNG
 * ===================================================================
 *
 * Layout này KHÔNG có DashboardLayout.
 * Các pages trong (auth)/* sẽ:
 * - KHÔNG có SidebarLeft
 * - KHÔNG có SidebarRight
 * - KHÔNG có Header
 *
 * Phù hợp cho:
 * - Login page
 * - Register page
 * - Forgot password page
 * - Reset password page
 * - Email verification page
 *
 * ===================================================================
 * STYLE
 * ===================================================================
 *
 * Layout này cung cấp:
 * - Full screen height (min-h-screen)
 * - Centered content (flex items-center justify-center)
 * - Background color từ theme
 *
 * Các pages con có thể override style nếu cần.
 *
 * ===================================================================
 * ROUTE MAPPING
 * ===================================================================
 *
 * Route group (auth) không ảnh hưởng URL:
 * - (auth)/login/page.tsx      → URL: /login
 * - (auth)/register/page.tsx   → URL: /register
 * - (auth)/forgot/page.tsx     → URL: /forgot
 */

/**
 * Auth Layout Props
 */
interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Auth Group Layout Component
 *
 * Simple centered layout cho auth pages.
 * Không có sidebars, không có header.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
}
