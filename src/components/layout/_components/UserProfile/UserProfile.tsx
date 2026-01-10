'use client';

import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

interface UserProfileProps {
  isLoading: boolean;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export function UserProfile({
  isLoading,
  name,
  email,
  avatarUrl,
}: UserProfileProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Avatar Slot */}
      {isLoading ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : (
        <img
          src={avatarUrl}
          alt={name}
          className="h-10 w-10 rounded-full object-cover"
        />
      )}

      <div className="flex flex-col">
        {/* Name Slot */}
        {isLoading ? (
          <Skeleton className="mb-1 h-4 w-[120px]" />
        ) : (
          <span className="text-sm font-medium">{name}</span>
        )}

        {/* Email Slot */}
        {isLoading ? (
          <Skeleton className="h-3 w-[150px]" />
        ) : (
          <span className="text-muted-foreground text-xs">{email}</span>
        )}
      </div>
    </div>
  );
}
