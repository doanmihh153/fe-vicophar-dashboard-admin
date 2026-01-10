import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-1/3" /> {/* Title */}
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-32" /> {/* Cards */}
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}
