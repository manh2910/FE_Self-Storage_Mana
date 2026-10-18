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

  const statusBadges: Record<string, { label: string; class: string; dot: string }> = {
    Available: { label: 'Sẵn sàng thuê', class: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    Occupied: { label: 'Đang có khách', class: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-600' },
    Cleaning: { label: 'Đang dọn vệ sinh', class: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
    Maintenance: { label: 'Đang bảo trì', class: 'bg-orange-50 text-orange-800 border-orange-200', dot: 'bg-orange-600' },
    Deactivated: { label: 'Tạm ngưng', class: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
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
    setToastMessage(`Đã cập nhật kho ${selectedUnit.code} sang "${statusBadges[newStatus]?.label || newStatus}"`)
    setTimeout(() => setToastMessage(''), 3500)
    setSelectedUnit(null)
  }

  const handleQuickAction = (unit: ManagedUnit, targetStatus: typeof unitStatuses[number]) => {
    onUpdateStatus(unit.id, targetStatus, `Chuyển nhanh trạng thái tại quầy`)
    setToastMessage(`Đã cập nhật kho ${unit.code} sang "${statusBadges[targetStatus]?.label || targetStatus}"`)
    setTimeout(() => setToastMessage(''), 3500)
  }

  return (
    <div className="space-y-5">
      {toastMessage && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-medium shadow-sm">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white">
            <StaffIcon name="cross" size={14} />
          </button>
        </div>
      )}

      {/* Filter Tabs and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'all' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả ({units.length})
          </button>
          <button
            onClick={() => setFilter('Available')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'Available' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sẵn sàng ({countByStatus('Available')})
          </button>
          <button
            onClick={() => setFilter('Occupied')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'Occupied' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Đang thuê ({countByStatus('Occupied')})
          </button>
          <button
            onClick={() => setFilter('Cleaning')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'Cleaning' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Cần vệ sinh ({countByStatus('Cleaning')})
          </button>
          <button
            onClick={() => setFilter('Maintenance')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'Maintenance' ? 'bg-orange-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Bảo trì ({countByStatus('Maintenance')})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã kho, vị trí, tầng..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pl-8 text-xs focus:bg-white focus:border-blue-500 focus:outline-hidden"
          />
          <div className="absolute left-2.5 top-2 text-slate-400">
            <StaffIcon name="search" size={13} />
          </div>
        </div>
      </div>

      {/* Grid of Storage Units */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filtered.map((unit) => {
          const badge = statusBadges[unit.status] || statusBadges.Available

          return (
            <div
              key={unit.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{unit.code}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{unit.location}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${badge.class}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}></span>
                    {badge.label}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Loại: <strong className="text-slate-700">{unit.type}</strong></span>
                  <span>Diện tích: <strong className="text-slate-700">{unit.area} m²</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                {unit.status === 'Cleaning' && (
                  <button
                    onClick={() => handleQuickAction(unit, 'Available')}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition text-center"
                  >
                    Dọn xong → Sẵn sàng
                  </button>
                )}

                {unit.status === 'Maintenance' && (
                  <button
                    onClick={() => handleQuickAction(unit, 'Cleaning')}
                    className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition text-center"
                  >
                    Sửa xong → Cần dọn
                  </button>
                )}

                {unit.status !== 'Cleaning' && unit.status !== 'Maintenance' && (
                  <button
                    onClick={() => handleOpenUpdateModal(unit)}
                    className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition text-center"
                  >
                    Đổi trạng thái
                  </button>
                )}

                <button
                  onClick={() => handleOpenUpdateModal(unit)}
                  className="px-2 py-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg text-xs"
                  title="Chi tiết & Ghi chú"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-lg border border-slate-200 space-y-3.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Cập nhật kho {selectedUnit.code}
                </h3>
                <span className="text-[11px] text-slate-400">{selectedUnit.location}</span>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="text-slate-400 hover:text-slate-600">
                <StaffIcon name="cross" size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Trạng thái mới:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800"
                >
                  <option value="Available">Sẵn sàng thuê (Available)</option>
                  <option value="Occupied">Đang có khách thuê (Occupied)</option>
                  <option value="Cleaning">Đang dọn vệ sinh (Cleaning)</option>
                  <option value="Maintenance">Đang bảo trì / Sửa chữa (Maintenance)</option>
                  <option value="Deactivated">Tạm ngưng sử dụng (Deactivated)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Ghi chú hiện trạng:</label>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Ghi nhận hiện trạng thực tế..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedUnit(null)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
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
