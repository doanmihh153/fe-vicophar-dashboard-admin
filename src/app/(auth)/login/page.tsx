/**
 * ===================================================================
 * LOGIN PAGE
 * ===================================================================
 *
 * Trang đăng nhập, hiển thị tại URL: /login
 *
 * ===================================================================
 * ROUTE MAPPING
 * ===================================================================
 *
 * File: src/app/(auth)/login/page.tsx
 * URL: /login
 *
 * Route group (auth) không ảnh hưởng URL.
 *
 * ===================================================================
 * LAYOUT
 * ===================================================================
 *
 * Page này được wrap bởi:
 * 1. RootLayout (providers - Theme, Dashboard)
 * 2. AuthLayout (simple centered layout)
 *
 * KHÔNG có:
 * - SidebarLeft
 * - SidebarRight
 * - Header
 *
 * Đây là ví dụ của page KHÔNG thuộc DashboardLayout.
 */

import { KeyRound, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

/**
 * Login Page Component
 *
 * Placeholder login form.
 * TODO: Thêm form validation, authentication logic.
 */
export default function LoginPage() {
  return (
    <div className="w-full max-w-md px-4">
      {/*
       * LOGIN CARD
       * Card container cho login form
       */}
      <div className="border-border bg-card rounded-2xl border p-8 shadow-lg">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-bold">Đăng nhập</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Chào mừng quay lại! Đăng nhập để tiếp tục.
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <input
                type="email"
                placeholder="admin@vicophar.com"
                className="border-border bg-background focus:ring-primary w-full rounded-lg border py-2.5 pr-4 pl-10 focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Mật khẩu</label>
            <div className="relative">
              <KeyRound className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                className="border-border bg-background focus:ring-primary w-full rounded-lg border py-2.5 pr-10 pl-10 focus:ring-2 focus:outline-none"
              />
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                <EyeOff className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-primary text-sm hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary text-primary-foreground w-full rounded-lg py-2.5 font-medium transition-opacity hover:opacity-90"
          >
            Đăng nhập
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="border-border absolute inset-0 flex items-center">
            <div className="border-border w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card text-muted-foreground px-2">hoặc</span>
          </div>
        </div>

        {/* Social Login */}
        <button className="border-border hover:bg-accent w-full rounded-lg border py-2.5 font-medium transition-colors">
          Đăng nhập với Google
        </button>

        {/* Register Link */}
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>

      {/* Back to Dashboard */}
      <p className="text-muted-foreground mt-4 text-center text-sm">
        <Link href="/" className="hover:text-foreground transition-colors">
          ← Quay về Dashboard
        </Link>
      </p>
    </div>
  );
}
