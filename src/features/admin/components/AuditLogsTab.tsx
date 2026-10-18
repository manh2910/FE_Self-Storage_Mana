import { useState } from 'react'
import { AdminIcon } from './AdminIcons'
import type { LoginLogEntry, ActivityAuditEntry } from '../model/adminDomain'
import type { UserRole } from '../../auth/types/auth'

interface Props {
  loginLogs: LoginLogEntry[]
  activityLogs: ActivityAuditEntry[]
}

export function AuditLogsTab({ loginLogs, activityLogs }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'login' | 'activity'>('login')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const roleLabels: Record<UserRole, string> = {
    StorageCustomer: 'Khách hàng',
    FacilityStaff: 'Nhân viên cơ sở',
    FacilityManager: 'Quản lý cơ sở',
    BusinessOperationsManager: 'Quản lý ĐHKD (BOM)',
    SystemAdministrator: 'Quản trị viên',
  }

  const filteredLoginLogs = loginLogs.filter((l) => {
    const matchStatus = filterStatus === 'all' || l.status === filterStatus
    const matchSearch =
      l.username.toLowerCase().includes(search.toLowerCase()) ||
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.ipAddress.includes(search) ||
      l.device.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const filteredActivityLogs = activityLogs.filter((a) => {
    const matchSeverity = filterSeverity === 'all' || a.severity === filterSeverity
    const matchSearch =
      a.actorName.toLowerCase().includes(search.toLowerCase()) ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.targetEntity.toLowerCase().includes(search.toLowerCase()) ||
      a.facilityName.toLowerCase().includes(search.toLowerCase())
    return matchSeverity && matchSearch
  })

  const handleExportCSV = () => {
    const filename = activeSubTab === 'login' ? 'login_history_audit.csv' : 'activity_audit_logs.csv'
    triggerToast(`Đã xuất dữ liệu nhật ký thành công: ${filename}`)
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
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <AdminIcon name="history" size={18} />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Theo dõi nhật ký hệ thống (System & Security Audit Trail)
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 max-w-3xl">
            Giám sát thời gian thực lịch sử đăng nhập người dùng, phiên truy cập, địa chỉ IP, thiết bị, và
            toàn bộ nhật ký các thao tác trọng yếu (thay đổi giá, cấp mã PIN, khóa kho quá hạn, phân quyền).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveSubTab('login')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeSubTab === 'login'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lịch sử đăng nhập ({loginLogs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('activity')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeSubTab === 'activity'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nhật ký kiểm toán ({activityLogs.length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <AdminIcon name="download" size={14} />
            Xuất CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <AdminIcon name="search" size={15} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeSubTab === 'login'
                ? 'Tìm kiếm theo tên đăng nhập, IP, thiết bị...'
                : 'Tìm kiếm theo người thực hiện, thao tác, đối tượng...'
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        {activeSubTab === 'login' ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0">Trạng thái:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Success">Thành công (Success)</option>
              <option value="Failed">Thất bại (Failed)</option>
              <option value="Suspicious">Cảnh báo nghi vấn (Suspicious)</option>
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0">Mức độ rủi ro:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="Info">Thông tin (Info)</option>
              <option value="Warning">Cảnh báo (Warning)</option>
              <option value="Critical">Nghiêm trọng (Critical)</option>
            </select>
          </div>
        )}
      </div>

      {/* SubTab 1: Login History Table */}
      {activeSubTab === 'login' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                  <th className="py-3 px-4">Thời gian đăng nhập</th>
                  <th className="py-3 px-4">Người dùng</th>
                  <th className="py-3 px-4">Vai trò</th>
                  <th className="py-3 px-4">Địa chỉ IP</th>
                  <th className="py-3 px-4">Thiết bị & Trình duyệt</th>
                  <th className="py-3 px-3 text-center">Trạng thái</th>
                  <th className="py-3 px-4">Ghi chú bảo mật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoginLogs.map((log) => {
                  const statusStyles: Record<LoginLogEntry['status'], { label: string; badge: string }> = {
                    Success: { label: 'Thành công', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                    Failed: { label: 'Thất bại', badge: 'bg-rose-50 text-rose-800 border-rose-200' },
                    Suspicious: { label: 'Cảnh báo dò quét', badge: 'bg-amber-50 text-amber-900 border-amber-300' },
                  }
                  const s = statusStyles[log.status]

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                        {log.loginTime}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{log.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">@{log.username}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700">{roleLabels[log.role] || log.role}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                        {log.ipAddress}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {log.device}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${s.badge}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {log.note || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Activity Audit Table */}
      {activeSubTab === 'activity' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Người thực hiện</th>
                  <th className="py-3 px-4">Hành động kiểm toán</th>
                  <th className="py-3 px-4">Đối tượng tác động</th>
                  <th className="py-3 px-4">Phạm vi cơ sở</th>
                  <th className="py-3 px-3 text-center">Mức độ</th>
                  <th className="py-3 px-4">Chi tiết thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActivityLogs.map((act) => {
                  const severityBadges: Record<
                    ActivityAuditEntry['severity'],
                    { label: string; badge: string }
                  > = {
                    Info: { label: 'Thông tin', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
                    Warning: { label: 'Cảnh báo', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
                    Critical: { label: 'Nghiêm trọng', badge: 'bg-rose-50 text-rose-800 border-rose-200 font-bold' },
                  }
                  const sev = severityBadges[act.severity]

                  return (
                    <tr key={act.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                        {act.timestamp}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{act.actorName}</div>
                        <div className="text-[11px] text-slate-400">{roleLabels[act.role] || act.role}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {act.action}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {act.targetEntity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {act.facilityName}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${sev.badge}`}>
                          {sev.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                        {act.details}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
