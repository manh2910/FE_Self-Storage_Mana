import { useState } from 'react'
import { StaffIcon } from './StaffIcons'
import type { IncidentTicket } from '../model/staffDomain'

interface Props {
  incidents: IncidentTicket[]
  onAddIncident: (ticket: Omit<IncidentTicket, 'id' | 'reportedAt'>) => void
  onResolveIncident: (ticketId: string, resolutionNotes: string) => void
  onUpdateIncidentStatus: (ticketId: string, status: IncidentTicket['status']) => void
}

export function IncidentHandlingTab({ incidents, onAddIncident, onResolveIncident, onUpdateIncidentStatus }: Props) {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [resolvingTicket, setResolvingTicket] = useState<IncidentTicket | null>(null)
  const [resolutionText, setResolutionText] = useState<string>('')
  const [quickPinTicket, setQuickPinTicket] = useState<IncidentTicket | null>(null)
  const [generatedNewPin, setGeneratedNewPin] = useState<string>('938102')

  const [newIncident, setNewIncident] = useState({
    unitCode: '',
    customerName: '',
    customerPhone: '',
    type: 'pin_error' as IncidentTicket['type'],
    title: '',
    description: '',
    priority: 'urgent' as IncidentTicket['priority'],
    status: 'open' as IncidentTicket['status'],
    assignedTo: 'Lê Văn Hùng'
  })

  const typeLabels: Record<IncidentTicket['type'], { label: string; icon: string }> = {
    lost_key: { label: 'Mất chìa khóa', icon: 'key' },
    pin_error: { label: 'Quên / Lỗi mã PIN', icon: 'pin' },
    door_stuck: { label: 'Kẹt cửa kho', icon: 'wrench' },
    damage: { label: 'Hư hỏng thiết bị kho', icon: 'wrench' },
    support_request: { label: 'Yêu cầu hỗ trợ tại chỗ', icon: 'user' },
    other: { label: 'Vấn đề phát sinh khác', icon: 'incident' }
  }

  const priorityBadges: Record<IncidentTicket['priority'], { label: string; class: string }> = {
    urgent: { label: 'Khẩn cấp', class: 'bg-rose-50 text-rose-700 border-rose-200' },
    high: { label: 'Ưu tiên cao', class: 'bg-amber-50 text-amber-800 border-amber-200' },
    normal: { label: 'Bình thường', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    low: { label: 'Thấp', class: 'bg-slate-50 text-slate-600 border-slate-200' },
  }

  const filtered = incidents.filter((item) => {
    const matchStatus = filterStatus === 'all' || item.status === filterStatus
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.unitCode.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const openCount = incidents.filter(i => i.status === 'open' || i.status === 'in_progress').length

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIncident.title.trim()) return

    onAddIncident(newIncident)
    setShowAddModal(false)
    setNewIncident({
      unitCode: '',
      customerName: '',
      customerPhone: '',
      type: 'pin_error',
      title: '',
      description: '',
      priority: 'urgent',
      status: 'open',
      assignedTo: 'Lê Văn Hùng'
    })
  }

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolvingTicket) return
    onResolveIncident(resolvingTicket.id, resolutionText || 'Đã kiểm tra và xử lý xong tại chỗ cho khách hàng.')
    setResolvingTicket(null)
    setResolutionText('')
  }

  const handleExecuteQuickPin = () => {
    if (!quickPinTicket) return
    onResolveIncident(
      quickPinTicket.id,
      `Đã xác thực CCCD khách hàng và cấp mã PIN truy cập mới [${generatedNewPin}]. Khách đã thao tác mở cửa kho thành công.`
    )
    setQuickPinTicket(null)
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
            <StaffIcon name="incident" size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Tiếp nhận & Xử lý sự cố tại chỗ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Xử lý mất chìa, quên hoặc lỗi mã PIN, kẹt cửa kho, thiết bị hư hỏng hoặc hỗ trợ mượn dụng cụ xe kéo cho khách tại quầy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            {openCount} sự cố cần xử lý
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
          >
            <StaffIcon name="plus" size={13} />
            Tiếp nhận sự cố mới
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-md transition ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
          >
            Tất cả ({incidents.length})
          </button>
          <button
            onClick={() => setFilterStatus('open')}
            className={`px-3 py-1.5 rounded-md transition ${filterStatus === 'open' ? 'bg-white text-rose-700 shadow-2xs' : 'hover:text-slate-900'}`}
          >
            Mới tiếp nhận ({incidents.filter(i => i.status === 'open').length})
          </button>
          <button
            onClick={() => setFilterStatus('in_progress')}
            className={`px-3 py-1.5 rounded-md transition ${filterStatus === 'in_progress' ? 'bg-white text-amber-800 shadow-2xs' : 'hover:text-slate-900'}`}
          >
            Đang xử lý ({incidents.filter(i => i.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-3 py-1.5 rounded-md transition ${filterStatus === 'resolved' ? 'bg-white text-emerald-700 shadow-2xs' : 'hover:text-slate-900'}`}
          >
            Đã giải quyết ({incidents.filter(i => i.status === 'resolved').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo kho, khách, sự cố..."
            className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-1.5 pl-9 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          <div className="absolute left-3 top-2 text-slate-400">
            <StaffIcon name="search" size={13} />
          </div>
        </div>
      </div>

      {/* List of Incidents */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isResolved = item.status === 'resolved'
          const isInProgress = item.status === 'in_progress'
          const isOpen = item.status === 'open'
          const priority = priorityBadges[item.priority]
          const typeMeta = typeLabels[item.type] || typeLabels.other

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-4 transition shadow-2xs ${
                isResolved
                  ? 'border-slate-200 bg-slate-50/40 opacity-80'
                  : item.priority === 'urgent'
                  ? 'border-rose-200 bg-rose-50/15'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-500">#{item.id}</span>
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${priority.class}`}>
                      {priority.label}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {typeMeta.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{item.description}</p>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {isOpen && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      Mới tiếp nhận
                    </span>
                  )}
                  {isInProgress && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      Đang xử lý
                    </span>
                  )}
                  {isResolved && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Đã giải quyết
                    </span>
                  )}
                </div>
              </div>

              {/* Meta details */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Kho: {item.unitCode}
                  </span>
                  <span>Khách: <strong className="text-slate-800">{item.customerName}</strong> ({item.customerPhone})</span>
                  <span>Thời gian: {item.reportedAt}</span>
                  <span>Phụ trách: {item.assignedTo}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {!isResolved && (
                    <>
                      {item.type === 'pin_error' && (
                        <button
                          onClick={() => {
                            setQuickPinTicket(item)
                            setGeneratedNewPin(Math.floor(100000 + Math.random() * 900000).toString())
                          }}
                          className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                        >
                          <StaffIcon name="pin" size={13} />
                          Đổi mã PIN nhanh
                        </button>
                      )}

                      {isOpen && (
                        <button
                          onClick={() => onUpdateIncidentStatus(item.id, 'in_progress')}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium transition"
                        >
                          Nhận xử lý
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setResolvingTicket(item)
                          setResolutionText('')
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <StaffIcon name="check" size={13} />
                        Hoàn tất xử lý
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Resolution details if resolved */}
              {isResolved && item.resolutionNotes && (
                <div className="mt-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                  <span className="font-semibold">Giải pháp đã thực hiện ({item.resolvedAt}):</span> {item.resolutionNotes}
                </div>
              )}
            </div>
          )
        })}

        {!filtered.length && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            Không tìm thấy sự cố nào trong danh sách.
          </div>
        )}
      </div>

      {/* Add Incident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Tiếp nhận yêu cầu sự cố tại cơ sở</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded p-1 transition"
              >
                <StaffIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mã kho phát sinh</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: A-102"
                    value={newIncident.unitCode}
                    onChange={(e) => setNewIncident({ ...newIncident, unitCode: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phân loại sự cố</label>
                  <select
                    value={newIncident.type}
                    onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value as any })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  >
                    <option value="pin_error">Quên / Lỗi mã PIN truy cập</option>
                    <option value="lost_key">Mất chìa khóa / Thẻ từ</option>
                    <option value="door_stuck">Kẹt cửa cuốn / Bản lề</option>
                    <option value="damage">Hư hỏng thiết bị kho</option>
                    <option value="support_request">Hỗ trợ xe kéo / Dụng cụ</option>
                    <option value="other">Vấn đề khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tên khách hàng</label>
                  <input
                    type="text"
                    required
                    placeholder="Tên khách"
                    value={newIncident.customerName}
                    onChange={(e) => setNewIncident({ ...newIncident, customerName: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    required
                    placeholder="SĐT khách"
                    value={newIncident.customerPhone}
                    onChange={(e) => setNewIncident({ ...newIncident, customerPhone: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tiêu đề sự cố</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bàn phím PIN chập chờn không nhận số"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi nhận chi tiết mô tả của khách hàng hoặc tình trạng quan sát được..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mức độ ưu tiên</label>
                <select
                  value={newIncident.priority}
                  onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value as any })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="urgent">Khẩn cấp (Cần xử lý ngay)</option>
                  <option value="high">Ưu tiên cao</option>
                  <option value="normal">Bình thường</option>
                  <option value="low">Thấp</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-2xs transition"
                >
                  Tiếp nhận phiếu sự cố
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick PIN Reset Modal */}
      {quickPinTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Cấp lại mã PIN mở kho khẩn cấp</h3>
              <button
                onClick={() => setQuickPinTicket(null)}
                className="text-slate-400 hover:text-slate-600 rounded p-1 transition"
              >
                <StaffIcon name="cross" size={18} />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg space-y-1.5 text-xs border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Khách hàng:</span>
                <span className="font-semibold text-slate-900">{quickPinTicket.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kho phát sinh:</span>
                <span className="font-semibold text-slate-900">{quickPinTicket.unitCode}</span>
              </div>
              <p className="text-slate-500 italic pt-1 border-t border-slate-200 text-[11px]">
                Lưu ý: Đối chiếu CCCD của khách tại quầy trước khi cấp lại mã số PIN.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Mã PIN mới 6 số ngẫu nhiên:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generatedNewPin}
                  onChange={(e) => setGeneratedNewPin(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-lg text-slate-900 tracking-widest flex-1 text-center"
                />
                <button
                  type="button"
                  onClick={() => setGeneratedNewPin(Math.floor(100000 + Math.random() * 900000).toString())}
                  className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-medium transition"
                  title="Sinh lại mã khác"
                >
                  <StaffIcon name="refresh" size={16} />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickPinTicket(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleExecuteQuickPin}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-2xs transition"
              >
                Xác nhận & Cấp mã PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Incident Modal */}
      {resolvingTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Hoàn tất xử lý sự cố</h3>
              <button
                onClick={() => setResolvingTicket(null)}
                className="text-slate-400 hover:text-slate-600 rounded p-1 transition"
              >
                <StaffIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-4">
              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã kho:</span>
                  <span className="font-semibold text-slate-900">{resolvingTicket.unitCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Khách hàng:</span>
                  <span className="font-semibold text-slate-900">{resolvingTicket.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tiêu đề sự cố:</span>
                  <span className="text-slate-800 font-medium truncate max-w-[200px]">{resolvingTicket.title}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Biện pháp & kết quả xử lý:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi nhận phương án xử lý (ví dụ: đã thay pin mới cho ổ khóa, hoặc cấp lại chìa khóa dự phòng...)"
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-2xs transition"
                >
                  Ký xác nhận hoàn tất
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

