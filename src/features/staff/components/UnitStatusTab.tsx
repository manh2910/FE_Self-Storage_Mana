import { useState } from 'react'
import { StaffIcon } from './StaffIcons'
import type { ManagedUnit, unitStatuses } from '../../manager/model/storageUnits'

interface Props {
  units: ManagedUnit[]
  onUpdateStatus: (unitId: string, status: typeof unitStatuses[number], reason?: string) => void
}

export function UnitStatusTab({ units, onUpdateStatus }: Props) {
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [selectedUnit, setSelectedUnit] = useState<ManagedUnit | null>(null)
  const [newStatus, setNewStatus] = useState<typeof unitStatuses[number]>('Available')
  const [statusNote, setStatusNote] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string>('')

  const statusColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    Available: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    Occupied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-600' },
    Cleaning: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
    Maintenance: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200', dot: 'bg-orange-600' },
    Deactivated: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', dot: 'bg-slate-400' },
  }

  const statusLabels: Record<string, string> = {
    Available: 'Sẵn sàng thuê',
    Occupied: 'Đang có khách',
    Cleaning: 'Đang dọn vệ sinh',
    Maintenance: 'Đang bảo trì',
    Deactivated: 'Tạm ngưng dùng'
  }

  const filtered = units.filter((u) => {
    const matchStatus = filter === 'all' || u.status === filter
    const matchSearch =
      u.code.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase()) ||
      u.type.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const countByStatus = (status: string) => units.filter(u => u.status === status).length

  const handleOpenUpdateModal = (unit: ManagedUnit) => {
    setSelectedUnit(unit)
    setNewStatus(unit.status)
    setStatusNote('')
  }

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUnit) return

    onUpdateStatus(selectedUnit.id, newStatus, statusNote)
    setToastMessage(`Đã cập nhật kho ${selectedUnit.code} sang trạng thái "${statusLabels[newStatus]}"`)
    setTimeout(() => setToastMessage(''), 4000)
    setSelectedUnit(null)
  }

  // Quick 1-click status transitions
  const handleQuickAction = (unit: ManagedUnit, targetStatus: typeof unitStatuses[number]) => {
    onUpdateStatus(unit.id, targetStatus, `Chuyển trạng thái nhanh từ quầy nhân viên trực`)
    setToastMessage(`Đã cập nhật kho ${unit.code} sang "${statusLabels[targetStatus]}"`)
    setTimeout(() => setToastMessage(''), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <StaffIcon name="status" className="text-blue-600" />
            Cập nhật & Theo dõi trạng thái kho lưu trữ
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm tra sơ đồ hiện trạng kho, đổi trạng thái sau bàn giao, trả kho, vệ sinh hoặc khi phát hiện hư hỏng cần bảo trì
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-500">Tổng cộng: <strong>{units.length}</strong> kho</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
            {countByStatus('Available')} sẵn sàng
          </span>
          <span className="text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-md">
            {countByStatus('Cleaning')} cần dọn
          </span>
          <span className="text-orange-800 font-semibold bg-orange-50 px-2.5 py-1 rounded-md">
            {countByStatus('Maintenance')} đang sửa
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-blue-600 text-white p-3.5 rounded-xl flex items-center justify-between shadow-md text-xs font-bold">
          <div className="flex items-center gap-2">
            <StaffIcon name="check" size={16} />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white">
            <StaffIcon name="cross" size={14} />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl border transition ${
              filter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả ({units.length})
          </button>
          <button
            onClick={() => setFilter('Available')}
            className={`px-3.5 py-2 rounded-xl border transition ${
              filter === 'Available' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50'
            }`}
          >
            Sẵn sàng ({countByStatus('Available')})
          </button>
          <button
            onClick={() => setFilter('Occupied')}
            className={`px-3.5 py-2 rounded-xl border transition ${
              filter === 'Occupied' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-slate-200 hover:bg-blue-50'
            }`}
          >
            Đang thuê ({countByStatus('Occupied')})
          </button>
          <button
            onClick={() => setFilter('Cleaning')}
            className={`px-3.5 py-2 rounded-xl border transition ${
              filter === 'Cleaning' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-800 border-slate-200 hover:bg-amber-50'
            }`}
          >
            Đang dọn vệ sinh ({countByStatus('Cleaning')})
          </button>
          <button
            onClick={() => setFilter('Maintenance')}
            className={`px-3.5 py-2 rounded-xl border transition ${
              filter === 'Maintenance' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-orange-800 border-slate-200 hover:bg-orange-50'
            }`}
          >
            Đang bảo trì ({countByStatus('Maintenance')})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã kho (A-101), tầng, loại..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pl-9 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <StaffIcon name="search" size={14} />
          </div>
        </div>
      </div>

      {/* Grid of Storage Units */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((unit) => {
          const color = statusColors[unit.status] || statusColors.Available

          return (
            <div
              key={unit.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{unit.code}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{unit.location}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${color.bg} ${color.text} ${color.border}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`}></span>
                    {statusLabels[unit.status]}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Loại kho: <strong className="text-slate-800">{unit.type}</strong></span>
                  <span>Diện tích: <strong className="text-slate-800">{unit.area} m²</strong></span>
                </div>
              </div>

              {/* Action buttons on card */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                {unit.status === 'Cleaning' && (
                  <button
                    onClick={() => handleQuickAction(unit, 'Available')}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                    title="Dọn xong, sẵn sàng đón khách"
                  >
                    <StaffIcon name="check" size={13} />
                    Xong vệ sinh → Sẵn sàng
                  </button>
                )}

                {unit.status === 'Maintenance' && (
                  <button
                    onClick={() => handleQuickAction(unit, 'Cleaning')}
                    className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                    title="Đã sửa xong, chuyển sang dọn dẹp"
                  >
                    <StaffIcon name="check" size={13} />
                    Sửa xong → Cần dọn
                  </button>
                )}

                {unit.status === 'Occupied' && (
                  <button
                    onClick={() => handleOpenUpdateModal(unit)}
                    className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    Chi tiết & Đổi trạng thái
                  </button>
                )}

                {unit.status === 'Available' && (
                  <button
                    onClick={() => handleOpenUpdateModal(unit)}
                    className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    Cập nhật trạng thái
                  </button>
                )}

                <button
                  onClick={() => handleOpenUpdateModal(unit)}
                  className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-lg text-xs"
                  title="Tùy chọn nâng cao"
                >
                  <StaffIcon name="wrench" size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Update Status */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cập nhật trạng thái kho {selectedUnit.code}
                </h3>
                <p className="text-xs text-slate-500">{selectedUnit.location} · {selectedUnit.type} ({selectedUnit.area}m²)</p>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="text-slate-400 hover:text-slate-600">
                <StaffIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Chọn trạng thái mới cho kho:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-500"
                >
                  <option value="Available">Sẵn sàng cho thuê (Available)</option>
                  <option value="Occupied">Đang có khách thuê (Occupied)</option>
                  <option value="Cleaning">Đang dọn vệ sinh (Cleaning)</option>
                  <option value="Maintenance">Đang kiểm tra / Bảo trì (Maintenance)</option>
                  <option value="Deactivated">Tạm ngưng hoạt động (Deactivated)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Lý do thay đổi / Ghi chú kiểm tra thực tế:
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Ví dụ: Đã hoàn tất vệ sinh sàn, hoặc hỏng bóng đèn cần thợ điện thay thế..."
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedUnit(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
