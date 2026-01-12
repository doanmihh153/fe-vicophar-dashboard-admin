/**
 * ===================================================================
 * DASHBOARD HOME PAGE
 * ===================================================================
 *
 * Trang chủ của Dashboard.
 *
 * Ví dụ cách sử dụng RightPanelSlot để custom sidebar phải:
 * - RightPanelSlot "slot" nội dung vào context
 * - DashboardLayout đọc từ context và render trong sidebar
 */

import { RightPanelSlot } from '@/components/providers/RightPanelContext';

export default function DashboardHomePage() {
  return (
    <>
      {/* Nội dung chính - render trong MainContent */}
      <div className="p-4">
        <h1 className="font-display text-2xl font-bold">Xin chào 👋</h1>
        <p className="text-muted-foreground mt-2">
          Đây là trang Dashboard chính.
        </p>
      </div>

      {/* Nội dung sidebar phải - slot qua Context */}
      <RightPanelSlot>
        <div className="p-4">
          <h3 className="font-display mb-4 text-lg">📊 Dashboard Stats</h3>
          <div className="space-y-3">
            <div className="bg-card border-border rounded-lg border p-3">
              <p className="text-sm font-medium">Tổng đơn hàng</p>
              <p className="text-primary text-2xl font-bold">1,234</p>
            </div>
            <div className="bg-card border-border rounded-lg border p-3">
              <p className="text-sm font-medium">Doanh thu hôm nay</p>
              <p className="text-primary text-2xl font-bold">5.2M ₫</p>
            </div>
          </div>
        </div>
      </RightPanelSlot>
    </>
  );
}
