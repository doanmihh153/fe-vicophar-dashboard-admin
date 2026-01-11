/**
 * ===================================================================
 * ANALYTICS PAGE
 * ===================================================================
 *
 * Trang phân tích, hiển thị tại URL: /analytics
 *
 * File: src/app/(dashboard)/analytics/page.tsx
 * Tự động có DashboardLayout từ (dashboard)/layout.tsx
 */

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';

export default function AnalyticsPage() {
  // Placeholder stats
  const stats = [
    {
      title: 'Doanh thu',
      value: '₫125.4M',
      change: '+12.5%',
      up: true,
      icon: DollarSign,
    },
    {
      title: 'Đơn hàng',
      value: '1,284',
      change: '+8.2%',
      up: true,
      icon: ShoppingCart,
    },
    {
      title: 'Khách hàng',
      value: '3,427',
      change: '+15.3%',
      up: true,
      icon: Users,
    },
    {
      title: 'Tỷ lệ chuyển đổi',
      value: '3.2%',
      change: '-2.1%',
      up: false,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground text-sm">
              Thống kê và phân tích dữ liệu
            </p>
          </div>
        </div>

        <select className="border-border bg-background rounded-lg border px-4 py-2 text-sm">
          <option>7 ngày qua</option>
          <option>30 ngày qua</option>
          <option>90 ngày qua</option>
          <option>Năm nay</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="border-border rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div className="bg-primary/10 text-primary rounded-lg p-2">
                <stat.icon className="h-5 w-5" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm ${stat.up ? 'text-green-600' : 'text-red-600'}`}
              >
                {stat.up ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="border-border rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Doanh thu theo tháng</h3>
        <div className="flex h-64 items-end justify-between gap-2">
          {[40, 65, 45, 80, 55, 90, 75, 60, 85, 70, 95, 80].map((height, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="bg-primary/20 hover:bg-primary/30 w-full rounded-t transition-colors"
                style={{ height: `${height}%` }}
              />
              <span className="text-muted-foreground text-xs">T{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
