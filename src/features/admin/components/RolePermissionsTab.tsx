import { useState } from 'react'
import { AdminIcon } from './AdminIcons'
import type { RoleMatrixConfig } from '../model/adminDomain'
import type { UserRole } from '../../auth/types/auth'

interface Props {
  rolesConfig: RoleMatrixConfig[]
  onUpdateRoleMatrix: (updated: RoleMatrixConfig[]) => void
}

export function RolePermissionsTab({ rolesConfig, onUpdateRoleMatrix }: Props) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('FacilityStaff')
  const [localRoles, setLocalRoles] = useState<RoleMatrixConfig[]>(rolesConfig)
  const [viewMode, setViewMode] = useState<'detail' | 'matrix'>('detail')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const currentRoleConfig = localRoles.find((r) => r.role === selectedRole) || localRoles[0]

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleToggle = (
    role: UserRole,
    moduleId: string,
    field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canExport'
  ) => {
    setLocalRoles((prev) =>
      prev.map((r) => {
        if (r.role !== role) return r
        return {
          ...r,
          modules: r.modules.map((m) => {
            if (m.id !== moduleId) return m
            return {
              ...m,
              [field]: !m[field],
            }
          }),
        }
      })
    )
  }

  const handleSave = () => {
    onUpdateRoleMatrix(localRoles)
    triggerToast('Đã lưu cấu hình phân quyền vai trò vào hệ thống thành công!')
  }

  const handleResetToDefault = () => {
    setLocalRoles(rolesConfig)
    triggerToast('Đã khôi phục cài đặt phân quyền gốc mặc định!')
  }

  const rolePillStyles: Record<UserRole, { badge: string; color: string }> = {
    StorageCustomer: { badge: 'Khách hàng', color: 'border-slate-300 text-slate-700 bg-slate-50' },
    FacilityStaff: { badge: 'Nhân viên', color: 'border-emerald-300 text-emerald-700 bg-emerald-50' },
    FacilityManager: { badge: 'Quản lý cơ sở', color: 'border-blue-300 text-blue-700 bg-blue-50' },
    BusinessOperationsManager: { badge: 'Vận hành KD (BOM)', color: 'border-purple-300 text-purple-700 bg-purple-50' },
    SystemAdministrator: { badge: 'Quản trị viên', color: 'border-rose-300 text-rose-700 bg-rose-50' },
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl animate-fade-in border border-slate-700">
          <AdminIcon name="check" size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <AdminIcon name="shield" size={18} />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Phân quyền vai trò người dùng (Role-Based Access Control)
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 max-w-3xl">
            Cấu hình quyền hạn tương tác (Xem, Tạo, Sửa, Xóa, Xuất báo cáo) cho từng vai trò trong hệ thống Self-Storage:
            Khách hàng, Nhân viên quầy, Quản lý cơ sở, và Quản lý Điều hành Kinh doanh.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode('detail')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'detail'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cấu hình chi tiết
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'matrix'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ma trận tổng quan
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <AdminIcon name="check" size={14} />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {viewMode === 'detail' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Roles Selector Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
              Danh sách vai trò ({localRoles.length})
            </div>
            {localRoles.map((r) => {
              const isSelected = r.role === selectedRole
              const style = rolePillStyles[r.role]
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={`w-full text-left p-3.5 rounded-xl border transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{r.roleNameVi}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${style.color}`}>
                      {style.badge}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2">{r.description}</div>
                  <div className="mt-2 text-[11px] font-medium text-slate-600 flex items-center gap-1">
                    <span className="text-slate-400">Phạm vi:</span>
                    <span className="font-semibold text-blue-700">{r.scope}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Module Capabilities Config for Selected Role */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{currentRoleConfig.roleNameVi}</h3>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {currentRoleConfig.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{currentRoleConfig.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Phạm vi dữ liệu:</span>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  {currentRoleConfig.scope}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600">
                    <th className="py-3 px-4 font-bold">Phân hệ chức năng</th>
                    <th className="py-3 px-3 font-bold text-center w-24">Xem (View)</th>
                    <th className="py-3 px-3 font-bold text-center w-24">Tạo mới (Create)</th>
                    <th className="py-3 px-3 font-bold text-center w-24">Chỉnh sửa (Edit)</th>
                    <th className="py-3 px-3 font-bold text-center w-24">Xóa (Delete)</th>
                    <th className="py-3 px-3 font-bold text-center w-24">Xuất báo cáo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRoleConfig.modules.map((mod) => (
                    <tr key={mod.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div>{mod.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {mod.id}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={mod.canView}
                          onChange={() => handleToggle(currentRoleConfig.role, mod.id, 'canView')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={mod.canCreate}
                          onChange={() => handleToggle(currentRoleConfig.role, mod.id, 'canCreate')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={mod.canEdit}
                          onChange={() => handleToggle(currentRoleConfig.role, mod.id, 'canEdit')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={mod.canDelete}
                          onChange={() => handleToggle(currentRoleConfig.role, mod.id, 'canDelete')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={mod.canExport}
                          onChange={() => handleToggle(currentRoleConfig.role, mod.id, 'canExport')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                * Thay đổi sẽ áp dụng ngay sau khi ấn nút <strong className="text-slate-800">Lưu thay đổi</strong>.
              </span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold"
              >
                <AdminIcon name="refresh" size={13} />
                Khôi phục mặc định
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Unified Matrix View */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Bảng so sánh phân quyền tổng quan (4 vai trò cốt lõi)</h3>
            <span className="text-xs text-slate-500">Ký hiệu: ✓ Có quyền | ✗ Không có quyền</span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-3 px-4 font-bold">Phân hệ chức năng</th>
                <th className="py-3 px-3 font-bold text-center">Khách hàng thuê kho</th>
                <th className="py-3 px-3 font-bold text-center">Nhân viên cơ sở</th>
                <th className="py-3 px-3 font-bold text-center">Quản lý cơ sở</th>
                <th className="py-3 px-3 font-bold text-center">Quản lý ĐHKD (BOM)</th>
                <th className="py-3 px-3 font-bold text-center">Quản trị viên (Admin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Tìm kiếm & Đặt kho lưu trữ', keys: ['m-storage'] },
                { name: 'Quản lý hợp đồng & Phê duyệt', keys: ['m-contract'] },
                { name: 'Cấp mã PIN & Xử lý quá hạn', keys: ['m-access'] },
                { name: 'Quản lý nhân sự & Cơ sở', keys: ['m-facility'] },
                { name: 'Chính sách giá & Báo cáo toàn hệ thống', keys: ['m-system'] },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{item.name}</td>
                  {localRoles.map((r) => {
                    const mod = r.modules[idx]
                    const hasAccess = mod ? mod.canView : false
                    const hasWrite = mod ? mod.canEdit || mod.canCreate : false
                    return (
                      <td key={r.role} className="py-3 px-3 text-center">
                        {hasWrite ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ✓ Toàn quyền
                          </span>
                        ) : hasAccess ? (
                          <span className="inline-flex items-center gap-1 text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            ✓ Chỉ xem
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">✗ Không</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
