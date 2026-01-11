/**
 * ===================================================================
 * TEAM PAGE
 * ===================================================================
 *
 * Trang quản lý team, hiển thị tại URL: /team
 *
 * File: src/app/(dashboard)/team/page.tsx
 * Tự động có DashboardLayout từ (dashboard)/layout.tsx
 */

import { Users, Plus, Mail, MoreVertical } from 'lucide-react';

export default function TeamPage() {
  // Placeholder team members
  const members = [
    {
      name: 'Nguyễn Văn A',
      role: 'Admin',
      email: 'a.nguyen@vicophar.com',
      avatar: 'A',
    },
    {
      name: 'Trần Thị B',
      role: 'Editor',
      email: 'b.tran@vicophar.com',
      avatar: 'B',
    },
    {
      name: 'Lê Văn C',
      role: 'Viewer',
      email: 'c.le@vicophar.com',
      avatar: 'C',
    },
    {
      name: 'Phạm Thị D',
      role: 'Editor',
      email: 'd.pham@vicophar.com',
      avatar: 'D',
    },
    {
      name: 'Hoàng Văn E',
      role: 'Admin',
      email: 'e.hoang@vicophar.com',
      avatar: 'E',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Team</h1>
            <p className="text-muted-foreground text-sm">
              Quản lý thành viên trong team
            </p>
          </div>
        </div>

        <button className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Mời thành viên
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member, i) => (
          <div key={i} className="border-border rounded-xl border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      member.role === 'Admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : member.role === 'Editor'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
              <button className="hover:bg-accent rounded-lg p-1 transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              {member.email}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
