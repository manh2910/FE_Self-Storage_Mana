import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdminIcon } from '../components/AdminIcons'
import {
  loadAdminData,
  saveAdminData,
  type AdminSystemState,
  type AdminUserAccount,
  type RoleMatrixConfig,
  type FacilityAccessConfig,
  type ActivityAuditEntry,
} from '../model/adminDomain'
import { AccountManagementTab } from '../components/AccountManagementTab'
import { RolePermissionsTab } from '../components/RolePermissionsTab'
import { DataAccessConfigTab } from '../components/DataAccessConfigTab'
import { AuditLogsTab } from '../components/AuditLogsTab'
import { TerminologySpecTab } from '../components/TerminologySpecTab'

type AdminTabKey = 'accounts' | 'roles' | 'data-access' | 'audit' | 'terminology'

interface NavItem {
  key: AdminTabKey
  label: string
  shortLabel: string
  icon: string
  count?: number
}

interface NavGroup {
  groupTitle: string
  items: NavItem[]
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTabKey>('accounts')
  const [adminState, setAdminState] = useState<AdminSystemState>(() => loadAdminData())
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    saveAdminData(adminState)
  }, [adminState])

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next))
      } catch {}
      return next
    })
  }

  const appendAuditLog = (
    action: string,
    targetEntity: string,
    details: string,
    severity: ActivityAuditEntry['severity'] = 'Info'
  ) => {
    const newLog: ActivityAuditEntry = {
      id: `act-${Date.now()}`,
      actorName: 'Lê Nguyễn Quốc Khương (Admin)',
      role: 'SystemAdministrator',
      action,
      targetEntity,
      facilityName: 'Toàn hệ thống',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      severity,
      details,
    }
    setAdminState((prev) => ({
      ...prev,
      activityLogs: [newLog, ...prev.activityLogs],
    }))
  }

  // Account Management handlers
  const handleAddUser = (newUser: Omit<AdminUserAccount, 'id' | 'createdAt' | 'lastLoginAt'>) => {
    const user: AdminUserAccount = {
      ...newUser,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: 'Chưa đăng nhập',
    }
    setAdminState((prev) => ({
      ...prev,
      users: [user, ...prev.users],
    }))
    appendAuditLog(
      'Tạo tài khoản mới',
      `User: ${user.username}`,
      `Đã tạo tài khoản cho ${user.fullName} với vai trò ${user.role}`
    )
  }

  const handleUpdateUser = (updatedUser: AdminUserAccount) => {
    setAdminState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    }))
    appendAuditLog(
      'Cập nhật tài khoản',
      `User: ${updatedUser.username}`,
      `Cập nhật thông tin và vai trò ${updatedUser.role}`
    )
  }

  const handleToggleStatus = (userId: string, newStatus: AdminUserAccount['status']) => {
    const target = adminState.users.find((u) => u.id === userId)
    setAdminState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
    }))
    if (target) {
      appendAuditLog(
        newStatus === 'Active' ? 'Kích hoạt tài khoản' : 'Khóa / Đình chỉ tài khoản',
        `User: ${target.username}`,
        `Chuyển trạng thái tài khoản sang ${newStatus}`,
        newStatus === 'Suspended' ? 'Warning' : 'Info'
      )
    }
  }

  // Role Matrix Handlers
  const handleUpdateRoleMatrix = (updated: RoleMatrixConfig[]) => {
    setAdminState((prev) => ({
      ...prev,
      rolesConfig: updated,
    }))
    appendAuditLog(
      'Cập nhật ma trận phân quyền',
      'Role Matrix',
      'Đã điều chỉnh ma trận phân quyền vai trò người dùng trong hệ thống',
      'Warning'
    )
  }

  // Facility Data Access Handlers
  const handleUpdateAccess = (updated: FacilityAccessConfig[]) => {
    setAdminState((prev) => ({
      ...prev,
      facilityAccessList: updated,
    }))
    appendAuditLog(
      'Cập nhật quyền truy cập cơ sở',
      'Facility Scoping',
      'Đã điều chỉnh phân bổ dữ liệu cơ sở cho nhân sự phụ trách'
    )
  }

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'Quản trị hệ thống',
      items: [
        {
          key: 'accounts',
          label: 'Quản lý tài khoản',
          shortLabel: 'Tài khoản',
          icon: 'users',
          count: adminState.users.length,
        },
        {
          key: 'roles',
          label: 'Phân quyền vai trò',
          shortLabel: 'Vai trò',
          icon: 'shield',
          count: 5,
        },
        {
          key: 'data-access',
          label: 'Cấu hình quyền dữ liệu',
          shortLabel: 'Quyền dữ liệu',
          icon: 'building',
          count: adminState.facilityAccessList.length,
        },
      ],
    },
    {
      groupTitle: 'An ninh & Giám sát',
      items: [
        {
          key: 'audit',
          label: 'Theo dõi nhật ký',
          shortLabel: 'Nhật ký',
          icon: 'history',
          count: adminState.activityLogs.length + adminState.loginLogs.length,
        },
      ],
    },
    {
      groupTitle: 'Tài liệu & Chuẩn hóa',
      items: [
        {
          key: 'terminology',
          label: 'Bản dịch & Chuẩn SRS',
          shortLabel: 'SRS & Từ điển',
          icon: 'dictionary',
        },
      ],
    },
  ]

  const allNavItems = navGroups.flatMap((g) => g.items)
  const activeItem = allNavItems.find((i) => i.key === activeTab) || allNavItems[0]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {/* 1. SLENDER COMPACT SINGLE-LINE TOP HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="w-full px-3 sm:px-4 flex items-center justify-between gap-3 h-12 whitespace-nowrap overflow-x-auto no-scrollbar">
          {/* Left: Sidebar Toggle + Compact Brand + Breadcrumb */}
          <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer"
              title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
              aria-label={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            >
              <AdminIcon name="panel-left" size={15} />
            </button>

            <Link
              to="/"
              className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm tracking-tight hover:text-blue-600 transition shrink-0"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white font-black text-xs">
                SS
              </span>
              <span>SelfStorage</span>
            </Link>

            <span className="h-3.5 w-px bg-slate-200 shrink-0" />

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                ADMIN
              </span>
              <span className="text-slate-300 hidden sm:inline text-xs">/</span>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                {activeItem.label}
              </span>
            </div>
          </div>

          {/* Right: Status Pill + Admin Profile + Return Home */}
          <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2 py-0.5 text-[11px] text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-semibold">Hệ thống Trực tuyến</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs border-l border-slate-200 pl-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                K
              </div>
              <span className="font-semibold text-slate-700 text-xs">Khuong Le (Root)</span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition shrink-0 whitespace-nowrap"
            >
              <AdminIcon name="arrow-left" size={12} />
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: COMPACT COLLAPSIBLE LEFT SIDEBAR + MAIN CONTENT AREA */}
      <div className="flex flex-1 min-h-[calc(100vh-3rem)]">
        {/* === SLENDER COMPACT LEFT SIDEBAR === */}
        <aside
          className={`shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out flex flex-col z-30 sticky top-12 h-[calc(100vh-3rem)] ${
            isCollapsed ? 'w-13' : 'w-52 sm:w-56'
          }`}
          aria-label="Admin Navigation Sidebar"
        >
          {/* Compact Top Header of Sidebar */}
          <div className="px-2.5 py-2 border-b border-slate-100 flex items-center justify-between h-9">
            {!isCollapsed ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Chức năng
                </span>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                  title="Thu gọn menu"
                >
                  <AdminIcon name="chevron-left" size={14} />
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                  title="Mở rộng menu"
                >
                  <AdminIcon name="chevron-right" size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Compact Navigation Items List */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-3 no-scrollbar">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-0.5">
                {!isCollapsed ? (
                  <div className="px-2 pt-1 pb-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {group.groupTitle}
                  </div>
                ) : (
                  groupIdx > 0 && <div className="border-t border-slate-100 my-1.5" />
                )}

                {group.items.map((item) => {
                  const isActive = activeTab === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveTab(item.key)}
                      title={`${item.label}${item.count !== undefined ? ` (${item.count})` : ''}`}
                      className={`w-full flex items-center rounded-lg transition text-left relative group ${
                        isCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-1.5'
                      } ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`}>
                          <AdminIcon name={item.icon} size={15} />
                        </span>
                        {!isCollapsed && (
                          <span className="text-xs font-medium truncate leading-none">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {/* Badge Counter */}
                      {!isCollapsed && item.count !== undefined && (
                        <span
                          className={`ml-1.5 shrink-0 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                            isActive
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}

                      {/* Indicator dot when collapsed */}
                      {isCollapsed && item.count !== undefined && (
                        <span
                          className={`absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full ${
                            isActive ? 'bg-white' : 'bg-blue-500'
                          }`}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Minimal Compact Footer Toggle */}
          <div className="p-1.5 border-t border-slate-100 bg-slate-50/50">
            {!isCollapsed ? (
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition shadow-2xs"
              >
                <AdminIcon name="chevron-left" size={13} />
                <span>Thu gọn menu</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center py-1 text-slate-400 hover:text-blue-600 transition"
                title="Mở rộng menu"
              >
                <AdminIcon name="chevron-right" size={14} />
              </button>
            )}
          </div>
        </aside>

        {/* === RIGHT MAIN CONTENT AREA === */}
        <main className="flex-1 min-w-0 p-4 sm:p-5 lg:p-6 overflow-y-auto">
          {activeTab === 'accounts' && (
            <AccountManagementTab
              users={adminState.users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {activeTab === 'roles' && (
            <RolePermissionsTab
              rolesConfig={adminState.rolesConfig}
              onUpdateRoleMatrix={handleUpdateRoleMatrix}
            />
          )}

          {activeTab === 'data-access' && (
            <DataAccessConfigTab
              facilityAccessList={adminState.facilityAccessList}
              onUpdateAccess={handleUpdateAccess}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogsTab
              loginLogs={adminState.loginLogs}
              activityLogs={adminState.activityLogs}
            />
          )}

          {activeTab === 'terminology' && <TerminologySpecTab />}
        </main>
      </div>
    </div>
  )
}