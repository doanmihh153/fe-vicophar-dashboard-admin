import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-sidebar/80 animate-pulse rounded-2xl', className)}
      {...props}
    />
  );
}
