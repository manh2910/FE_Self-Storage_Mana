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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTabKey>('accounts')
  const [adminState, setAdminState] = useState<AdminSystemState>(() => loadAdminData())

  useEffect(() => {
    saveAdminData(adminState)
  }, [adminState])

  const appendAuditLog = (action: string, targetEntity: string, details: string, severity: ActivityAuditEntry['severity'] = 'Info') => {
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
    appendAuditLog('Tạo tài khoản mới', `User: ${user.username}`, `Đã tạo tài khoản cho ${user.fullName} với vai trò ${user.role}`)
  }

  const handleUpdateUser = (updatedUser: AdminUserAccount) => {
    setAdminState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    }))
    appendAuditLog('Cập nhật tài khoản', `User: ${updatedUser.username}`, `Cập nhật thông tin và vai trò ${updatedUser.role}`)
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
    appendAuditLog('Cập nhật ma trận phân quyền', 'Role Matrix', 'Đã điều chỉnh ma trận phân quyền vai trò người dùng trong hệ thống', 'Warning')
  }

  // Facility Data Access Handlers
  const handleUpdateAccess = (updated: FacilityAccessConfig[]) => {
    setAdminState((prev) => ({
      ...prev,
      facilityAccessList: updated,
    }))
    appendAuditLog('Cập nhật quyền truy cập cơ sở', 'Facility Scoping', 'Đã điều chỉnh phân bổ dữ liệu cơ sở cho nhân sự phụ trách')
  }

  const tabs: { key: AdminTabKey; label: string; icon: string; count?: number }[] = [
    { key: 'accounts', label: 'Quản lý tài khoản', icon: 'users', count: adminState.users.length },
    { key: 'roles', label: 'Phân quyền vai trò', icon: 'shield', count: 4 },
    { key: 'data-access', label: 'Cấu hình quyền dữ liệu', icon: 'building', count: adminState.facilityAccessList.length },
    { key: 'audit', label: 'Theo dõi nhật ký', icon: 'history', count: adminState.activityLogs.length + adminState.loginLogs.length },
    { key: 'terminology', label: 'Bản dịch & Chuẩn SRS', icon: 'dictionary' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* STRICT SINGLE-LINE STICKY HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 h-16 whitespace-nowrap overflow-x-auto no-scrollbar">
          {/* Left Brand - Strictly 1 Line */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <Link to="/" className="flex items-center gap-2 text-slate-900 font-extrabold text-base tracking-tight hover:text-blue-600 transition">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm font-black text-sm">
                SS
              </span>
              <span>SelfStorage</span>
            </Link>
            <span className="h-4 w-px bg-slate-200" />
            <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              QUẢN TRỊ VIÊN HỆ THỐNG
            </span>
          </div>

          {/* Center Navigation Tabs - Strictly 1 Line */}
          <nav className="flex items-center gap-1.5 shrink-0 whitespace-nowrap" aria-label="Admin Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <AdminIcon name={tab.icon} size={15} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Actions & Status - Strictly 1 Line */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">Khuong Le (Root)</span>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition shrink-0 whitespace-nowrap"
            >
              <AdminIcon name="arrow-left" size={13} />
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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
  )
}