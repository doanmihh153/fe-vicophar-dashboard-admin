'use client';

import React from 'react';
import MainIcon from '@/assets/icons/MainIcon';
interface LeftPanelHeaderProps {
  showHeader: boolean;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}

/**
 * =========================================================
 * HEADER: Logo + Toggle Button
 * =========================================================
 *
 * Chỉ hiển thị khi showHeader = true.
 * - true: Render trong grid mode (có space)
 * - false: Render trong drawer (drawer có header riêng)
 *
 * Cấu trúc:
 * ┌──────────────────────────────────┐
 * │ [Logo]              [Toggle Btn] │
 * └──────────────────────────────────┘
 */
export function LeftPanelHeader({
  showHeader,
  isCollapsed,
  onToggleCollapse,
}: LeftPanelHeaderProps) {
  if (!showHeader) return null;

  return (
    <div
      className={`flex min-h-[56px] items-center transition-all duration-300 ${
        isCollapsed ? 'justify-center p-2' : 'justify-start px-4'
      }`}
    >
      {/*
       * MAIN ICON: Logo icon
       * - Collapsed: Hiện (w-8) - Thay thế cho Text
       * - Expanded: Ẩn (w-0) - Để nhường chỗ cho Text (User request)
       */}
      <MainIcon
        className={`shrink-0 transition-all duration-300 ${
          isCollapsed
            ? 'h-8 w-8 opacity-100'
            : 'h-8 w-0 overflow-hidden opacity-0'
        }`}
      />

      {/*
       * LOGO TEXT:
       * - Collapsed: Ẩn (w-0)
       * - Expanded: Hiện (w-auto)
       */}
      <span
        className={`font-display text-button-header text-lg whitespace-nowrap transition-all duration-200 lg:text-2xl ${
          isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
        } `}
      >
        Vicophar
      </span>
    </div>
  );
}
