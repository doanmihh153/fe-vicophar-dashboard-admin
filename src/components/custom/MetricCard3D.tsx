import React from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

interface MetricCard3DProps {
  /** Label hiển thị bên dưới giá trị (VD: Tin tức) */
  label: string;
  /** Giá trị chính (VD: 24) */
  value: string | number;
  /** Icon hiển thị (Component/Lucide Icon) */
  icon: React.ElementType;
  /** Màu sắc chủ đạo cho Icon (Hex hoặc CSS Var). Default: currentColor */
  color?: string;
  /** Màu nền của Card (Hex hoặc CSS Var). Default: var(--dashboard-surface-1) */
  bgColor?: string;
  /** Đường dẫn khi click vào card */
  href?: string;
  /** Text hiển thị khi hover (VD: Xem chi tiết). Default: "Xem chi tiết" */
  actionLabel?: string;
  /** Trạng thái loading */
  loading?: boolean;
  /** Class tùy chỉnh cho wrapper */
  className?: string;
  /** Class tùy chỉnh cho Icon */
  iconClassName?: string;
  /** Class tùy chỉnh cho Pattern Dots (dùng text-color để chỉnh màu dots) */
  patternClassName?: string;
}

export function MetricCard3D({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
  href,
  actionLabel = 'Xem chi tiết',
  loading = false,
  className,
  iconClassName,
  patternClassName,
}: MetricCard3DProps) {
  if (loading) {
    return (
      <div className={cn('stat-card-3d min-h-[160px]', className)}>
        <div className="space-y-3">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <Skeleton className="absolute -right-4 -bottom-4 h-24 w-24 opacity-20" />
      </div>
    );
  }

  // Default background class (can be overridden by className thanks to tailwind-merge)
  const defaultBg = 'bg-[var(--dashboard-surface-1)]';

  // Wrapper tag: Link nếu có href, div nếu không
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          'stat-card-3d group min-h-[160px] cursor-pointer',
          defaultBg,
          className
        )}
        style={{ backgroundColor: bgColor }}
      >
        <CardContent
          label={label}
          value={value}
          icon={Icon}
          color={color}
          actionLabel={actionLabel}
          iconClassName={iconClassName}
          patternClassName={patternClassName}
        />
      </Link>
    );
  }

  return (
    <div
      className={cn(
        'stat-card-3d group min-h-[160px] cursor-pointer',
        defaultBg,
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      <CardContent
        label={label}
        value={value}
        icon={Icon}
        color={color}
        actionLabel={actionLabel}
        iconClassName={iconClassName}
        patternClassName={patternClassName}
      />
    </div>
  );
}

// Sub-component để tránh lặp code content
function CardContent({
  label,
  value,
  icon: Icon,
  color,
  actionLabel,
  iconClassName,
  patternClassName,
}: Omit<MetricCard3DProps, 'loading' | 'className' | 'href' | 'bgColor'>) {
  return (
    <>
      <div className={cn('stat-card-3d-pattern', patternClassName)} />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <span className="font-display block text-3xl text-white lg:text-4xl">
            {value}
          </span>
          <span className="font-signature mt-1 block text-base text-white/60 transition-colors duration-300 group-hover:text-white lg:text-xl">
            {label}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'translate-y-2 rounded-full py-1 text-sm font-semibold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100',
              // Nếu dùng tailwind class cho text color thì apply vào đây nếu muốn,
              // nhưng ở đây tạm thời chỉ apply color hex cho logic cũ.
              // Nếu muốn text color từ iconClassName ảnh hưởng button này thì cần logic phức tạp hơn.
              // Tạm thời giữ logic Hex cũ + className mới nếu có.
              iconClassName
            )}
            style={{
              color: color,
              backgroundColor: color ? `${color}1A` : undefined,
            }}
          >
            {actionLabel}
          </span>
        </div>
      </div>
      <Icon
        className={cn('stat-card-3d-icon', iconClassName)}
        style={{
          // Only apply inline color if no class provided, OR let class override via !important check (hard).
          // Better: Apply color only if iconClassName is missing?
          // But user might want hex color + class structure.
          // Correct approach: if iconClassName has 'text-', we probably ignore color?
          // Simplest: `style={{ color: iconClassName ? undefined : color, ... }}`
          color: iconClassName ? undefined : color,
          fill: iconClassName ? undefined : color,
          fillOpacity: 0.1,
        }}
      />
    </>
  );
}
