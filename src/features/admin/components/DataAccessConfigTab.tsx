import { useState } from 'react'
import { AdminIcon } from './AdminIcons'
import type { FacilityAccessConfig } from '../model/adminDomain'
import type { UserRole } from '../../auth/types/auth'

interface Props {
  facilityAccessList: FacilityAccessConfig[]
  onUpdateAccess: (updated: FacilityAccessConfig[]) => void
}

export function DataAccessConfigTab({ facilityAccessList, onUpdateAccess }: Props) {
  const [accessList, setAccessList] = useState<FacilityAccessConfig[]>(facilityAccessList)
  const [filterFacility, setFilterFacility] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState<FacilityAccessConfig | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const facilitiesList = [
    { id: 'all', name: 'Toàn hệ thống (Toàn quốc)' },
    { id: 'fac-d1', name: 'Cơ sở Quận 1 (TP.HCM)' },
    { id: 'fac-td', name: 'Cơ sở Thủ Đức (TP.HCM)' },
    { id: 'fac-bt', name: 'Cơ sở Bình Thạnh (TP.HCM)' },
    { id: 'fac-q7', name: 'Cơ sở Quận 7 (TP.HCM)' },
    { id: 'fac-cg', name: 'Cơ sở Cầu Giấy (Hà Nội)' },
  ]

  const [newItem, setNewItem] = useState<Omit<FacilityAccessConfig, 'id' | 'updatedAt'>>({
    userId: 'usr-new',
    userName: '',
    role: 'FacilityStaff',
    assignedFacilityId: 'fac-d1',
    assignedFacilityName: 'Cơ sở Quận 1 (TP.HCM)',
    accessLevel: 'OperationalOnly',
    canManagePricing: false,
    canManageStaff: false,
    canExportReports: false,
  })

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const filtered = accessList.filter((item) => {
    const matchFacility = filterFacility === 'all' || item.assignedFacilityId === filterFacility
    const matchSearch =
      item.userName.toLowerCase().includes(search.toLowerCase()) ||
      item.assignedFacilityName.toLowerCase().includes(search.toLowerCase())
    return matchFacility && matchSearch
  })

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    const fac = facilitiesList.find((f) => f.id === editingItem.assignedFacilityId)
    const updated = accessList.map((item) =>
      item.id === editingItem.id
        ? {
            ...editingItem,
            assignedFacilityName: fac?.name || editingItem.assignedFacilityName,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : item
    )
    setAccessList(updated)
    onUpdateAccess(updated)
    setEditingItem(null)
    triggerToast('Đã cập nhật cấu hình quyền truy cập cơ sở!')
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.userName.trim()) return

    const fac = facilitiesList.find((f) => f.id === newItem.assignedFacilityId)
    const created: FacilityAccessConfig = {
      ...newItem,
      id: `fa-${Date.now()}`,
      assignedFacilityName: fac?.name || 'Chưa xác định',
      updatedAt: new Date().toISOString().split('T')[0],
    }

    const updated = [created, ...accessList]
    setAccessList(updated)
    onUpdateAccess(updated)
    setShowAddModal(false)
    setNewItem({
      userId: 'usr-new',
      userName: '',
      role: 'FacilityStaff',
      assignedFacilityId: 'fac-d1',
      assignedFacilityName: 'Cơ sở Quận 1 (TP.HCM)',
      accessLevel: 'OperationalOnly',
      canManagePricing: false,
      canManageStaff: false,
      canExportReports: false,
    })
    triggerToast('Đã phân quyền truy cập cơ sở mới cho nhân sự!')
  }

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn thu hồi cấu hình truy cập này?')) {
      const updated = accessList.filter((item) => item.id !== id)
      setAccessList(updated)
      onUpdateAccess(updated)
      triggerToast('Đã thu hồi quyền truy cập!')
    }
  }

  const roleLabels: Record<UserRole, string> = {
    StorageCustomer: 'Khách hàng',
    FacilityStaff: 'Nhân viên cơ sở',
    FacilityManager: 'Quản lý cơ sở',
    BusinessOperationsManager: 'Quản lý ĐHKD (BOM)',
    SystemAdministrator: 'Quản trị viên',
  }

  const accessLevelBadges: Record<
    FacilityAccessConfig['accessLevel'],
    { label: string; class: string }
  > = {
    FullAccess: { label: 'Toàn quyền (Full Access)', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    OperationalOnly: { label: 'Tác vụ quầy (Operational)', class: 'bg-blue-50 text-blue-800 border-blue-200' },
    ReadOnly: { label: 'Chỉ đọc (Read Only)', class: 'bg-slate-100 text-slate-700 border-slate-200' },
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
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <AdminIcon name="building" size={18} />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Cấu hình quyền truy cập dữ liệu theo cơ sở (Facility Scoping)
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 max-w-3xl">
            Giới hạn phạm vi dữ liệu người dùng có thể nhìn thấy và thao tác: Quản lý và nhân viên chỉ truy cập được dữ liệu phòng kho,
            hợp đồng và mã truy cập tại cơ sở được chỉ định. Chỉ Quản lý ĐHKD và Quản trị viên có quyền truy cập toàn hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition shrink-0"
        >
          <AdminIcon name="plus" size={14} />
          Phân bổ quyền cơ sở
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cơ sở đang hoạt động</div>
          <div className="mt-2 text-2xl font-black text-slate-900">5 Cơ sở</div>
          <div className="mt-1 text-xs text-slate-500">TP. Hồ Chí Minh & Hà Nội</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nhân sự đã phân bổ</div>
          <div className="mt-2 text-2xl font-black text-blue-600">{accessList.length} Nhân sự</div>
          <div className="mt-1 text-xs text-slate-500">Gồm Quản lý & Nhân viên quầy</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toàn quyền (Full Access)</div>
          <div className="mt-2 text-2xl font-black text-emerald-600">
            {accessList.filter((a) => a.accessLevel === 'FullAccess').length} Tài khoản
          </div>
          <div className="mt-1 text-xs text-slate-500">Quản lý cơ sở & Quản lý BOM</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cấp quyền xuất báo cáo</div>
          <div className="mt-2 text-2xl font-black text-purple-600">
            {accessList.filter((a) => a.canExportReports).length} Nhân sự
          </div>
          <div className="mt-1 text-xs text-slate-500">Quyền xuất tệp CSV/Excel</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <AdminIcon name="search" size={15} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên nhân sự hoặc cơ sở..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 shrink-0">Lọc cơ sở:</span>
          <select
            value={filterFacility}
            onChange={(e) => setFilterFacility(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả cơ sở</option>
            {facilitiesList.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Access Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="py-3 px-4">Nhân sự</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Cơ sở phân công</th>
                <th className="py-3 px-4">Mức truy cập</th>
                <th className="py-3 px-3 text-center">Quản lý giá</th>
                <th className="py-3 px-3 text-center">Quản lý NV</th>
                <th className="py-3 px-3 text-center">Xuất báo cáo</th>
                <th className="py-3 px-4 text-center">Cập nhật</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const badge = accessLevelBadges[item.accessLevel]
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.userName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {item.userId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">{roleLabels[item.role] || item.role}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-blue-700">
                        <AdminIcon name="building" size={13} className="text-slate-400" />
                        <span>{item.assignedFacilityName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${badge.class}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {item.canManagePricing ? (
                        <span className="text-emerald-600 font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {item.canManageStaff ? (
                        <span className="text-emerald-600 font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {item.canExportReports ? (
                        <span className="text-purple-600 font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                      {item.updatedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                          title="Chỉnh sửa quyền truy cập"
                        >
                          <AdminIcon name="edit" size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Thu hồi quyền"
                        >
                          <AdminIcon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Chỉnh sửa quyền truy cập: {editingItem.userName}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <AdminIcon name="cross" size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cơ sở được phân công (Facility Scope)</label>
                <select
                  value={editingItem.assignedFacilityId}
                  onChange={(e) => setEditingItem({ ...editingItem, assignedFacilityId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  {facilitiesList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cấp độ truy cập (Access Level)</label>
                <select
                  value={editingItem.accessLevel}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      accessLevel: e.target.value as FacilityAccessConfig['accessLevel'],
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="FullAccess">Toàn quyền quản lý cơ sở (Full Access)</option>
                  <option value="OperationalOnly">Tác vụ quầy & Bàn giao nhận kho (Operational Only)</option>
                  <option value="ReadOnly">Chỉ xem dữ liệu (Read Only)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-semibold text-slate-700 block">Quyền bổ sung:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.canManagePricing}
                    onChange={(e) => setEditingItem({ ...editingItem, canManagePricing: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Được phép thiết lập / điều chỉnh khung giá thuê và phụ phí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.canManageStaff}
                    onChange={(e) => setEditingItem({ ...editingItem, canManageStaff: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Được phép quản lý và phân công lịch trực nhân viên cơ sở</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.canExportReports}
                    onChange={(e) => setEditingItem({ ...editingItem, canExportReports: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Được phép xuất dữ liệu báo cáo (CSV / Excel / PDF)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
                >
                  Lưu cấu hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Phân bổ quyền truy cập cơ sở</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <AdminIcon name="cross" size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên nhân sự phụ trách *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Gia Bảo"
                  value={newItem.userName}
                  onChange={(e) => setNewItem({ ...newItem, userName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vai trò</label>
                  <select
                    value={newItem.role}
                    onChange={(e) => setNewItem({ ...newItem, role: e.target.value as UserRole })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="FacilityStaff">Nhân viên cơ sở</option>
                    <option value="FacilityManager">Quản lý cơ sở</option>
                    <option value="BusinessOperationsManager">Quản lý ĐHKD (BOM)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cơ sở phân công</label>
                  <select
                    value={newItem.assignedFacilityId}
                    onChange={(e) => setNewItem({ ...newItem, assignedFacilityId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    {facilitiesList.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cấp độ truy cập</label>
                <select
                  value={newItem.accessLevel}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      accessLevel: e.target.value as FacilityAccessConfig['accessLevel'],
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="OperationalOnly">Tác vụ quầy & Bàn giao nhận kho (Operational Only)</option>
                  <option value="FullAccess">Toàn quyền quản lý cơ sở (Full Access)</option>
                  <option value="ReadOnly">Chỉ xem dữ liệu (Read Only)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-semibold text-slate-700 block">Quyền hạn bổ sung:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.canManagePricing}
                    onChange={(e) => setNewItem({ ...newItem, canManagePricing: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Cho phép điều chỉnh giá thuê & phụ phí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.canManageStaff}
                    onChange={(e) => setNewItem({ ...newItem, canManageStaff: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Cho phép phân công lịch trực nhân viên</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.canExportReports}
                    onChange={(e) => setNewItem({ ...newItem, canExportReports: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Cho phép xuất tệp báo cáo</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
                >
                  Xác nhận phân bổ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
