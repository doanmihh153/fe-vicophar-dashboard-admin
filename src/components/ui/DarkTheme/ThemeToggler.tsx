'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';

import {
  ThemeToggler as AnimateThemeToggler,
  type ThemeSelection,
  type Resolved,
  type Direction,
} from '@/components/animate-ui/primitives/effects/theme-toggler';

/* 
  CẤU HÌNH THEME TOGGLER (Hướng dẫn sử dụng)
  
  Component này sử dụng @animate-ui/primitives-effects-theme-toggler để tạo hiệu ứng chuyển đổi theme.
  Nó tích hợp với next-themes để quản lý state (light/dark/system).

  Cách cấu hình:
  1. Đảm bảo đã bọc ứng dụng trong <ThemeProvider> tại layout.tsx.
  2. Component này nhận prop `direction` để chỉnh hướng lan tỏa của hiệu ứng (mặc định 'top-right').
  3. Icon (Monitor, Moon, Sun) được import từ lucide-react, có thể thay thế bằng icon khác nếu muốn.
  
  Logic chuyển đổi:
  - Nếu đang là 'dark' -> chuyển sang 'light'
  - Nếu đang là 'system' -> chuyển sang 'dark'
  - Nếu khác -> chuyển về 'system'
  (Có thể tùy chỉnh logic này trong hàm onClick bên dưới)
*/

interface ThemeTogglerProps {
  direction?: Direction; // Hướng của hiệu ứng chuyển cảnh
  className?: string; // Class tùy chỉnh thêm cho button
}

export const ThemeToggler = ({
  direction = 'ltr',
  className,
}: ThemeTogglerProps) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <AnimateThemeToggler
      theme={theme as ThemeSelection}
      resolvedTheme={resolvedTheme as Resolved}
      setTheme={setTheme}
      direction={direction}
    >
      {({ effective, toggleTheme }) => {
        const nextTheme =
          effective === 'dark'
            ? 'light'
            : effective === 'system'
              ? 'dark'
              : 'system';

        return (
          <button
            onClick={() => toggleTheme(nextTheme)}
            className={`bg-accent text-accent-foreground hover:bg-accent/80 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${className}`}
            title={`Switch to ${nextTheme} mode`}
          >
            {effective === 'system' ? (
              <Monitor className="h-5 w-5" />
            ) : effective === 'dark' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>
        );
      }}
    </AnimateThemeToggler>
  );
};
