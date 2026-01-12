/**
 * ============================================
 * HEADER USER COMPONENT
 * ============================================
 *
 * Component hiển thị avatar user và dropdown menu profile.
 *
 * Tính năng:
 * - Avatar trigger mở dropdown
 * - Ảnh bìa phía trên (tỉ lệ 3.2:1)
 * - Avatar lớn đè lên ảnh bìa
 * - Tên + Email + Nút chỉnh sửa
 * - Skeleton loading state
 *
 * Cấu trúc files:
 * - HeaderUser.tsx: Component chính (file này)
 * - types.ts: TypeScript interfaces
 * - data.ts: Mock data
 * - useUser.ts: Custom hook xử lý logic
 */

'use client';

import React from 'react';
import { User, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';
import { TextHover } from '@/components/ui/TextHover';
import { Skeleton } from '@/components/ui/Skeleton';

// Local imports
import type { HeaderUserProps } from './types';
import { useUser } from './useUser';

export function HeaderUser({
  user,
  isLoading,
  onEditProfile,
}: HeaderUserProps) {
  // Hook xử lý logic loading và fetch data
  const { userData, loading } = useUser({ user, isLoading });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-sidebar flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 transition-colors"
          aria-label="Menu người dùng"
        >
          {/* Avatar nhỏ ở trigger button */}
          <div className="bg-background flex h-full w-full items-center justify-center overflow-hidden rounded-full">
            {loading ? (
              <Skeleton className="h-full w-full rounded-full" />
            ) : userData?.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt={`Avatar của ${userData.name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="text-muted-foreground h-5 w-5" />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="bg-sidebar text-sidebar-foreground z-50 min-w-[280px] overflow-hidden rounded-xl border p-0 shadow-lg"
      >
        {/* Ảnh bìa ở trên cùng - Tỉ lệ 3.2:1 */}
        <div className="relative w-full" style={{ aspectRatio: '3.2 / 1' }}>
          {loading ? (
            <Skeleton className="h-full w-full rounded-none" />
          ) : userData?.coverUrl ? (
            <img
              src={userData.coverUrl}
              alt="Ảnh bìa"
              className="h-full w-full object-cover"
            />
          ) : (
            // Gradient placeholder khi không có ảnh bìa
            <div className="from-primary/30 via-primary/50 to-primary/30 h-full w-full bg-linear-to-r" />
          )}
        </div>

        {/* Nội dung phía dưới ảnh bìa */}
        <div className="relative flex flex-col items-center px-4 pb-4">
          {/* Avatar to - Đẩy lên trên để đè ảnh bìa */}
          <div className="bg-sidebar border-sidebar -mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4">
            {loading ? (
              <Skeleton className="h-full w-full rounded-full" />
            ) : userData?.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt={`Avatar của ${userData.name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              // Placeholder icon khi không có avatar
              <div className="bg-muted flex h-full w-full items-center justify-center rounded-full">
                <User className="text-muted-foreground h-10 w-10" />
              </div>
            )}
          </div>

          {/* Tên và Email */}
          <div className="mt-2 text-center">
            {loading ? (
              <>
                <Skeleton className="mx-auto mb-1 h-5 w-28 rounded-md" />
                <Skeleton className="mx-auto h-4 w-36 rounded-md" />
              </>
            ) : (
              <>
                <p className="font-signature text-base">{userData?.name}</p>
                <p className="text-muted-foreground text-sm">
                  {userData?.email}
                </p>
              </>
            )}
          </div>

          {/* Nút Chỉnh sửa hồ sơ */}
          <button
            className="mt-3 flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50"
            disabled={loading}
            onClick={onEditProfile}
            aria-label="Chỉnh sửa hồ sơ cá nhân"
          >
            <Pencil className="h-3.5 w-3.5" />
            <TextHover>Chỉnh sửa hồ sơ</TextHover>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
