import { useState } from 'react'
import { AdminIcon } from './AdminIcons'
import type { AdminUserAccount } from '../model/adminDomain'
import type { UserRole } from '../../auth/types/auth'

interface Props {
  users: AdminUserAccount[]
  onAddUser: (user: Omit<AdminUserAccount, 'id' | 'createdAt' | 'lastLoginAt'>) => void
  onUpdateUser: (user: AdminUserAccount) => void
  onToggleStatus: (userId: string, newStatus: AdminUserAccount['status']) => void
}

export function AccountManagementTab({ users, onAddUser, onUpdateUser, onToggleStatus }: Props) {
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [editingUser, setEditingUser] = useState<AdminUserAccount | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [resetPassUser, setResetPassUser] = useState<AdminUserAccount | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [newUser, setNewUser] = useState<Omit<AdminUserAccount, 'id' | 'createdAt' | 'lastLoginAt'>>({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'FacilityStaff',
    assignedFacilityId: 'fac-d1',
    assignedFacilityName: 'Cơ sở Quận 1 (TP.HCM)',
    status: 'Active',
  })

  const roleLabels: Record<UserRole, { label: string; badgeClass: string }> = {
    StorageCustomer: { label: 'Khách hàng thuê kho', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
    FacilityStaff: { label: 'Nhân viên cơ sở', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    FacilityManager: { label: 'Quản lý cơ sở', badgeClass: 'bg-blue-50 text-blue-800 border-blue-200' },
    BusinessOperationsManager: { label: 'Quản lý Điều hành (BOM)', badgeClass: 'bg-purple-50 text-purple-800 border-purple-200' },
    SystemAdministrator: { label: 'Quản trị viên (Admin)', badgeClass: 'bg-rose-50 text-rose-800 border-rose-200' },
  }

  const facilitiesList = [
    { id: 'all', name: 'Toàn hệ thống (Toàn quốc)' },
    { id: 'fac-d1', name: 'Cơ sở Quận 1 (TP.HCM)' },
    { id: 'fac-td', name: 'Cơ sở Thủ Đức (TP.HCM)' },
    { id: 'fac-bt', name: 'Cơ sở Bình Thạnh (TP.HCM)' },
    { id: 'fac-q7', name: 'Cơ sở Quận 7 (TP.HCM)' },
    { id: 'fac-cg', name: 'Cơ sở Cầu Giấy (Hà Nội)' },
  ]

  const filtered = users.filter((u) => {
    const matchRole = filterRole === 'all' || u.role === filterRole
    const matchStatus = filterStatus === 'all' || u.status === filterStatus
    const matchSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phoneNumber.includes(search)
    return matchRole && matchStatus && matchSearch
  })

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.username.trim() || !newUser.fullName.trim()) return

    const fac = facilitiesList.find((f) => f.id === newUser.assignedFacilityId)
    onAddUser({
      ...newUser,
      assignedFacilityName: fac?.name || 'Chưa phân bổ',
    })
    setShowAddModal(false)
    setNewUser({
      username: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'FacilityStaff',
      assignedFacilityId: 'fac-d1',
      assignedFacilityName: 'Cơ sở Quận 1 (TP.HCM)',
      status: 'Active',
    })
    triggerToast('Đã tạo tài khoản người dùng mới thành công!')
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    const fac = facilitiesList.find((f) => f.id === editingUser.assignedFacilityId)
    onUpdateUser({
      ...editingUser,
      assignedFacilityName: fac?.name || editingUser.assignedFacilityName,
    })
    setEditingUser(null)
    triggerToast('Đã cập nhật thông tin tài khoản thành công!')
  }

  const handleConfirmResetPass = () => {
    if (!resetPassUser) return
    triggerToast(`Đã cấp lại mật khẩu tạm thời cho ${resetPassUser.username}: [SelfStorage@2026]`)
    setResetPassUser(null)
  }

  const activeCount = users.filter((u) => u.status === 'Active').length
  const suspendedCount = users.filter((u) => u.status === 'Suspended').length

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng tài khoản</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{users.length}</span>
            <span className="text-xs text-slate-500">người dùng</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Đang hoạt động: <strong className="text-emerald-700">{activeCount}</strong> tài khoản
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nhân sự nội bộ</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {users.filter((u) => u.role !== 'StorageCustomer').length}
            </span>
            <span className="text-xs text-slate-500">nhân sự</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Gồm Staff, FM, BOM & Admin</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng thuê kho</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {users.filter((u) => u.role === 'StorageCustomer').length}
            </span>
            <span className="text-xs text-slate-500">tài khoản</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Khách cá nhân & Doanh nghiệp</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang tạm khóa</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{suspendedCount}</span>
            <span className="text-xs text-rose-600 font-semibold">Tài khoản</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Tạm đình chỉ hoặc nợ quá hạn</p>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-medium shadow-2xs">
          <span>✓ {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Toolbar: Search, Filters & Add user button */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="search"
              placeholder="Tìm theo họ tên, username, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-slate-50/70 border border-slate-300 rounded-lg px-3 py-2 pl-9 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <AdminIcon name="search" size={13} />
            </div>
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="StorageCustomer">Khách hàng thuê kho</option>
            <option value="FacilityStaff">Nhân viên cơ sở</option>
            <option value="FacilityManager">Quản lý cơ sở</option>
            <option value="BusinessOperationsManager">Quản lý Điều hành (BOM)</option>
            <option value="SystemAdministrator">Quản trị viên (Admin)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Suspended">Đang khóa</option>
            <option value="Pending">Chờ kích hoạt</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-2xs flex items-center gap-1.5"
        >
          <AdminIcon name="plus" size={14} />
          Thêm người dùng mới
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Họ tên & Tài khoản</th>
                <th className="px-4 py-3">Thông tin liên hệ</th>
                <th className="px-4 py-3">Vai trò hệ thống</th>
                <th className="px-4 py-3">Cơ sở phân công phụ trách</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Đăng nhập gần nhất</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((user) => {
                const roleMeta = roleLabels[user.role] || roleLabels.FacilityStaff
                return (
                  <tr key={user.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{user.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-400">@{user.username}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      <div>{user.email}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{user.phoneNumber}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${roleMeta.badgeClass}`}>
                        {roleMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {user.assignedFacilityName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          user.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : user.status === 'Suspended'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {user.status === 'Active' ? '● Hoạt động' : user.status === 'Suspended' ? 'Đã khóa' : 'Chờ xác thực'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{user.lastLoginAt}</td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="px-2 py-1 text-slate-600 hover:text-blue-600 border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-50 transition"
                        title="Chỉnh sửa tài khoản"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setResetPassUser(user)}
                        className="px-2 py-1 text-slate-600 hover:text-amber-700 border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-50 transition"
                        title="Cấp lại mật khẩu"
                      >
                        Pass
                      </button>
                      {user.status === 'Active' ? (
                        <button
                          onClick={() => onToggleStatus(user.id, 'Suspended')}
                          className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded text-[11px] font-medium transition"
                          title="Khóa tài khoản"
                        >
                          Khóa
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleStatus(user.id, 'Active')}
                          className="px-2 py-1 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded text-[11px] font-medium transition"
                          title="Mở khóa tài khoản"
                        >
                          Mở
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!filtered.length && (
          <div className="p-8 text-center text-xs text-slate-500">
            Không tìm thấy tài khoản người dùng nào phù hợp.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Thêm người dùng mới vào hệ thống</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <AdminIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên đăng nhập (Username):</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: staff.anhtu"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Họ và tên đầy đủ:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Anh Tú"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email liên hệ:</label>
                  <input
                    type="email"
                    required
                    placeholder="anhtu@selfstorage.vn"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    required
                    placeholder="09xx..."
                    value={newUser.phoneNumber}
                    onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vai trò hệ thống:</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium"
                  >
                    <option value="StorageCustomer">Khách hàng thuê kho</option>
                    <option value="FacilityStaff">Nhân viên cơ sở</option>
                    <option value="FacilityManager">Quản lý cơ sở</option>
                    <option value="BusinessOperationsManager">Quản lý Điều hành (BOM)</option>
                    <option value="SystemAdministrator">Quản trị viên (Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cơ sở phân công:</label>
                  <select
                    value={newUser.assignedFacilityId}
                    onChange={(e) => setNewUser({ ...newUser, assignedFacilityId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium"
                  >
                    {facilitiesList.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-[11px] border border-slate-200">
                Mật khẩu khởi tạo mặc định sẽ được gửi qua email của người dùng: <strong>SelfStorage@2026</strong>. Người dùng sẽ được yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Chỉnh sửa tài khoản: {editingUser.fullName} (@{editingUser.username})
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <AdminIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ và tên:</label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email:</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    required
                    value={editingUser.phoneNumber}
                    onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vai trò hệ thống:</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium"
                  >
                    <option value="StorageCustomer">Khách hàng thuê kho</option>
                    <option value="FacilityStaff">Nhân viên cơ sở</option>
                    <option value="FacilityManager">Quản lý cơ sở</option>
                    <option value="BusinessOperationsManager">Quản lý Điều hành (BOM)</option>
                    <option value="SystemAdministrator">Quản trị viên (Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cơ sở phân công:</label>
                  <select
                    value={editingUser.assignedFacilityId}
                    onChange={(e) => setEditingUser({ ...editingUser, assignedFacilityId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium"
                  >
                    {facilitiesList.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Cấp lại mật khẩu</h3>
              <button onClick={() => setResetPassUser(null)} className="text-slate-400 hover:text-slate-600">
                <AdminIcon name="cross" size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản <strong>@{resetPassUser.username}</strong> ({resetPassUser.fullName})?
            </p>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
              Mật khẩu mới tạm thời sẽ được tạo ngẫu nhiên và gửi tới email: <strong>{resetPassUser.email}</strong>.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setResetPassUser(null)}
                className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmResetPass}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-2xs"
              >
                Xác nhận cấp lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
