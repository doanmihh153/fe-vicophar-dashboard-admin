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
  return (
    <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative flex min-h-full flex-col items-center justify-center">
      {/*
       * Theme Toggler
       * Đặt góc phải trên để dễ access
       */}
      <div className="absolute top-4 right-4">
        <ThemeToggler />
      </div>

      <div className="container max-w-4xl px-4 py-16">
        <main className="flex flex-col items-center gap-8 text-center">
          {/* Badge */}
          <div className="border-border bg-secondary/50 text-secondary-foreground inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-sm">
            <span>✨ Project Initialized Successfully</span>
          </div>

          {/* Hero */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Next.js <span className="text-muted-foreground">+</span> Tailwind{' '}
            <span className="text-muted-foreground">+</span> Zod
          </h1>

          <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
            A premium, production-ready starter template configured with the
            best modern practices. Typescript, ESLint, Prettier, and Clean
            Architecture helpers are ready to go.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="/tasks"
              className={cn(
                'inline-flex h-12 items-center justify-center gap-2 rounded-full',
                'bg-primary text-primary-foreground px-8 text-sm font-medium',
                'transition-all hover:opacity-90 active:scale-95'
              )}
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/settings"
              className={cn(
                'inline-flex h-12 items-center justify-center gap-2 rounded-full',
                'border-input bg-background border px-8 text-sm font-medium',
                'hover:bg-accent hover:text-accent-foreground transition-all active:scale-95'
              )}
            >
              <Terminal className="h-4 w-4" />
              Documentation
            </a>
          </div>

          {/* Feature Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 text-left sm:grid-cols-3">
            {[
              {
                title: 'Type Safe',
                desc: 'Full TypeScript support with strict validation using Zod for robust data handling.',
              },
              {
                title: 'Modern Styling',
                desc: 'Tailwind CSS v4 with a custom premium design system and Shadcn-compatible tokens.',
              },
              {
                title: 'Clean Architecture',
                desc: 'Organized structure with standard utility helpers for scalable development.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group border-border bg-card relative overflow-hidden rounded-2xl border p-6 transition-all hover:shadow-lg"
              >
                <div className="bg-primary/10 text-primary mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
