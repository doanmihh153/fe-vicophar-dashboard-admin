/**
 * ===================================================================
 * SETTINGS PAGE
 * ===================================================================
 *
 * Trang cài đặt, hiển thị tại URL: /settings
 *
 * File: src/app/(dashboard)/settings/page.tsx
 * Tự động có DashboardLayout từ (dashboard)/layout.tsx
 */

import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    {
      title: 'Tài khoản',
      description: 'Quản lý thông tin cá nhân và tài khoản',
      icon: User,
      items: [
        { label: 'Họ và tên', value: 'Nguyễn Văn Admin' },
        { label: 'Email', value: 'admin@vicophar.com' },
        { label: 'Số điện thoại', value: '+84 123 456 789' },
      ],
    },
    {
      title: 'Thông báo',
      description: 'Cài đặt email và push notifications',
      icon: Bell,
      items: [
        { label: 'Email thông báo', value: 'Bật', toggle: true },
        { label: 'Push notifications', value: 'Bật', toggle: true },
        { label: 'Nhắc nhở task', value: 'Bật', toggle: true },
      ],
    },
    {
      title: 'Bảo mật',
      description: 'Mật khẩu và xác thực 2 bước',
      icon: Shield,
      items: [
        { label: 'Đổi mật khẩu', value: 'Cập nhật lần cuối: 30 ngày trước' },
        { label: 'Xác thực 2 bước', value: 'Tắt', toggle: true },
      ],
    },
    {
      title: 'Giao diện',
      description: 'Theme và tùy chỉnh hiển thị',
      icon: Palette,
      items: [
        { label: 'Theme', value: 'System' },
        { label: 'Ngôn ngữ', value: 'Tiếng Việt' },
        { label: 'Sidebar mặc định', value: 'Mở rộng' },
      ],
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý cài đặt tài khoản và ứng dụng
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="border-border rounded-xl border">
            <div className="border-border flex items-center gap-3 border-b p-4">
              <div className="bg-primary/10 text-primary rounded-lg p-2">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {section.description}
                </p>
              </div>
            </div>

            <div className="divide-border divide-y">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between p-4">
                  <span>{item.label}</span>
                  {item.toggle ? (
                    <button className="bg-primary relative h-6 w-11 rounded-full transition-colors">
                      <span className="bg-primary-foreground absolute top-1 right-1 h-4 w-4 rounded-full transition-transform" />
                    </button>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="bg-primary text-primary-foreground rounded-lg px-6 py-2 font-medium transition-opacity hover:opacity-90">
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
