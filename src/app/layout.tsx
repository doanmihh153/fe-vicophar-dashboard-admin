import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { DashboardProvider } from '@/components/providers/DashboardContext';

/**
 * ===================================================================
 * ROOT LAYOUT - LAYOUT GỐC CỦA ỨNG DỤNG
 * ===================================================================
 *
 * Đây là layout cao nhất trong Next.js App Router.
 * Tất cả các pages đều được wrap bởi layout này.
 *
 * ===================================================================
 * CẤU TRÚC ROUTE GROUPS
 * ===================================================================
 *
 * src/app/
 * ├── layout.tsx              ← FILE NÀY (Root)
 * │
 * ├── (dashboard)/            ← Route group có sidebar
 * │   ├── layout.tsx          ← DashboardLayout wrapper
 * │   ├── page.tsx            ← Dashboard home (/)
 * │   ├── tasks/page.tsx      ← Tasks (/tasks)
 * │   └── settings/page.tsx   ← Settings (/settings)
 * │
 * └── (auth)/                 ← Route group KHÔNG có sidebar
 *     ├── layout.tsx          ← Simple centered layout
 *     └── login/page.tsx      ← Login (/login)
 *
 * ===================================================================
 * VAI TRÒ CỦA ROOT LAYOUT
 * ===================================================================
 *
 * Root Layout CHỈ chứa:
 * 1. <html> và <body> tags
 * 2. Global metadata
 * 3. Font loading
 * 4. Global providers (Theme, Dashboard state)
 *
 * Root Layout KHÔNG chứa:
 * - DashboardLayout (để auth pages không có sidebar)
 * - Bất kỳ UI cụ thể nào
 *
 * ===================================================================
 * TẠI SAO TÁCH DASHBOARDLAYOUT RA KHỎI ROOT?
 * ===================================================================
 *
 * Nếu DashboardLayout nằm trong RootLayout:
 * - TẤT CẢ pages đều có sidebar
 * - Login page có sidebar → sai UX
 * - Register page có sidebar → sai UX
 *
 * Khi tách ra route group (dashboard):
 * - Chỉ pages trong (dashboard)/* có sidebar
 * - Auth pages trong (auth)/* không có sidebar
 * - Flexible cho các use cases khác
 *
 * ===================================================================
 * PROVIDERS
 * ===================================================================
 *
 * 1. ThemeProvider
 *    - Quản lý dark/light mode
 *    - Sử dụng next-themes
 *    - Cần wrap toàn bộ app để theme consistent
 *
 * 2. DashboardProvider
 *    - Quản lý state cho layout (sidebar open/close, etc.)
 *    - Cần ở root vì state được share giữa các pages
 *    - Auth pages vẫn cần (để redirect về dashboard sau login)
 */

export const metadata: Metadata = {
  title: 'Admin Dashboard - Vicophar',
  description: 'Dashboard quản trị nội dung cho Vicophar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      {/*
       * ===============================================================
       * HEAD: Font Loading
       * ===============================================================
       *
       * Preconnect đến Google Fonts để tải font nhanh hơn.
       * Fonts được sử dụng:
       * - Momo Trust Sans: Font chính cho body text
       * - Momo Trust Display: Font cho headings
       * - Momo Signature: Font decorative
       */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Momo+Signature&family=Momo+Trust+Display&family=Momo+Trust+Sans:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        {/*
         * =============================================================
         * PROVIDER STACK
         * =============================================================
         *
         * Thứ tự providers (từ ngoài vào trong):
         * 1. ThemeProvider - Theme phải wrap tất cả
         * 2. DashboardProvider - State cho layout
         * 3. {children} - Route group layouts và pages
         *
         * LƯU Ý: Không có DashboardLayout ở đây!
         * DashboardLayout nằm trong (dashboard)/layout.tsx
         */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DashboardProvider defaultRightPanelMode="notes">
            {/*
             * Children ở đây là route group layouts:
             * - (dashboard)/layout.tsx → DashboardLayout
             * - (auth)/layout.tsx → Simple layout
             */}
            {children}
          </DashboardProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
