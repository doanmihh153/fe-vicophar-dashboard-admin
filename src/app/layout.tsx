import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { DashboardProvider } from '@/components/providers/DashboardContext';
import { DashboardLayout } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Vicophar',
  description: 'Dashboard quản trị nội dung cho Vicophar',
};

/**
 * ===================================================================
 * ROOT LAYOUT
 * ===================================================================
 *
 * Layout gốc của ứng dụng Next.js.
 * Cấu trúc providers (từ ngoài vào trong):
 * 1. ThemeProvider - Quản lý dark/light mode
 * 2. DashboardProvider - Quản lý state cho layout (sidebar, panels)
 * 3. DashboardLayout - Layout 3 cột chính
 *
 * Sidebar trái và phải được render trực tiếp trong DashboardLayout.
 * Children (các page) sẽ được render vào MainContent.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
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
        {/* ThemeProvider: Quản lý dark/light mode */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* DashboardProvider: Quản lý state cho layout */}
          <DashboardProvider defaultRightPanelMode="notes">
            {/* 
              DashboardLayout: Layout 3 cột
              - Sidebar trái: Navigation (placeholder)
              - Center: Header + MainContent (children)
              - Sidebar phải: Notes/Tasks/Options (placeholder)
            */}
            <DashboardLayout headerTitle="Dashboard">
              {children}
            </DashboardLayout>
          </DashboardProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
