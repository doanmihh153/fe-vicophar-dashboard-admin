import React from 'react';
import { Newspaper, FileText, Package, FileEdit } from 'lucide-react';
import { MetricCard3D } from '@/components/custom/MetricCard3D';
import { STAT_PLACEHOLDERS, type StatItem } from '../../../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface StatOverviewProps {
  /** Danh sách stat items */
  stats?: StatItem[];
  /** Trạng thái loading */
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StatOverview({ stats, isLoading }: StatOverviewProps) {
  // Helper items để tránh undefined khi loading hoặc data lỗi
  const items = stats ?? STAT_PLACEHOLDERS;

  // Find từng item theo ID
  const news = items.find((s) => s.id === 'news') || items[0];
  const articles = items.find((s) => s.id === 'articles') || items[1];
  const products = items.find((s) => s.id === 'products') || items[2];
  const drafts = items.find((s) => s.id === 'drafts') || items[3];

  return (
    <section>
      {/* Grid container - responsive 4 → 2 → 1 cột */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. TIN TỨC - Teal Theme */}
        <MetricCard3D
          label={news.label}
          value={news.value}
          href={news.href}
          icon={Newspaper}
          loading={isLoading}
          // Custom Styles
          className="bg-sky-500 dark:bg-sky-700"
          iconClassName="text-sky-800 dark:text-sky-400"
          patternClassName="text-sky-900 dark:text-sky-300"
          color="#fff"
        />

        {/* 2. BÀI VIẾT - Blue Theme */}
        <MetricCard3D
          label={articles.label}
          value={articles.value}
          href={articles.href}
          icon={FileText}
          loading={isLoading}
          // Custom Styles
          className="bg-emerald-500 dark:bg-emerald-700"
          iconClassName="text-emerald-800 dark:text-emerald-400"
          patternClassName="text-emerald-900 dark:text-emerald-300"
          color="#fff"
        />

        {/* 3. SẢN PHẨM - Emerald Theme */}
        <MetricCard3D
          label={products.label}
          value={products.value}
          href={products.href}
          icon={Package}
          loading={isLoading}
          // Custom Styles
          className="bg-cyan-500 dark:bg-cyan-700"
          iconClassName="text-cyan-800 dark:text-cyan-400"
          patternClassName="text-cyan-900 dark:text-cyan-300"
          color="#fff"
        />

        {/* 4. BẢN NHÁP - Orange Theme */}
        <MetricCard3D
          label={drafts.label}
          value={drafts.value}
          href={drafts.href}
          icon={FileEdit}
          loading={isLoading}
          // Custom Styles
          className="bg-orange-500 dark:bg-orange-700"
          iconClassName="text-orange-800 dark:text-orange-400"
          patternClassName="text-orange-900 dark:text-orange-300"
          color="#fff"
        />
      </div>
    </section>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default StatOverview;
