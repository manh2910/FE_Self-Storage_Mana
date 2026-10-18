import { useState } from 'react'
import { OperationsIcon } from './OperationsIcons'
import { formatVND, type FacilityItem } from '../model/operationsDomain'

interface Props {
  facilities: FacilityItem[]
  onAddFacility: (item: Omit<FacilityItem, 'id'>) => void
  onUpdateFacility: (item: FacilityItem) => void
}

export function FacilityDirectoryTab({ facilities, onAddFacility, onUpdateFacility }: Props) {
  const [search, setSearch] = useState('')
  const [filterCity, setFilterCity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingFacility, setEditingFacility] = useState<FacilityItem | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<FacilityItem | null>(null)

  const [newFacility, setNewFacility] = useState<Omit<FacilityItem, 'id'>>({
    code: '',
    name: '',
    district: '',
    city: 'TP. Hồ Chí Minh',
    address: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    totalUnits: 50,
    occupiedUnits: 0,
    totalArea: 600,
    status: 'active',
    openHours: '06:00 - 22:00 (Thẻ từ 24/7)',
    amenities: ['Bảo vệ 24/7', 'Camera AI nhận diện', 'Kiểm soát nhiệt độ & độ ẩm'],
    monthlyRevenue: 0,
  })

  const [amenityInput, setAmenityInput] = useState('')

  const filtered = facilities.filter((f) => {
    const matchCity = filterCity === 'all' || f.city === filterCity
    const matchStatus = filterStatus === 'all' || f.status === filterStatus
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.code.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase()) ||
      f.managerName.toLowerCase().includes(search.toLowerCase())
    return matchCity && matchStatus && matchSearch
  })

  const totalCapacity = facilities.reduce((sum, f) => sum + f.totalUnits, 0)
  const totalOccupied = facilities.reduce((sum, f) => sum + f.occupiedUnits, 0)
  const totalArea = facilities.reduce((sum, f) => sum + f.totalArea, 0)
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFacility.name.trim() || !newFacility.code.trim()) return

    onAddFacility(newFacility)
    setShowAddModal(false)
    setNewFacility({
      code: '',
      name: '',
      district: '',
      city: 'TP. Hồ Chí Minh',
      address: '',
      managerName: '',
      managerPhone: '',
      managerEmail: '',
      totalUnits: 50,
      occupiedUnits: 0,
      totalArea: 600,
      status: 'active',
      openHours: '06:00 - 22:00 (Thẻ từ 24/7)',
      amenities: ['Bảo vệ 24/7', 'Camera AI nhận diện', 'Kiểm soát nhiệt độ & độ ẩm'],
      monthlyRevenue: 0,
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFacility) return
    onUpdateFacility(editingFacility)
    setEditingFacility(null)
  }

  const handleAddAmenity = (isEdit = false) => {
    if (!amenityInput.trim()) return
    if (isEdit && editingFacility) {
      setEditingFacility({
        ...editingFacility,
        amenities: [...editingFacility.amenities, amenityInput.trim()],
      })
    } else {
      setNewFacility({
        ...newFacility,
        amenities: [...newFacility.amenities, amenityInput.trim()],
      })
    }
    setAmenityInput('')
  }

  const handleRemoveAmenity = (index: number, isEdit = false) => {
    if (isEdit && editingFacility) {
      setEditingFacility({
        ...editingFacility,
        amenities: editingFacility.amenities.filter((_, i) => i !== index),
      })
    } else {
      setNewFacility({
        ...newFacility,
        amenities: newFacility.amenities.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cơ sở hoạt động</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{facilities.length}</span>
            <span className="text-xs text-slate-500">cơ sở toàn quốc</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            {facilities.filter((f) => f.status === 'active').length} đang mở cửa
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng phòng kho</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalCapacity}</span>
            <span className="text-xs text-slate-500">phòng kho</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Đang cho thuê: <strong className="text-slate-800">{totalOccupied}</strong> kho
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tỷ lệ lấp đầy TB</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{overallOccupancy}%</span>
            <span className="text-xs text-emerald-600 font-semibold">Mục tiêu: 85%</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${overallOccupancy}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng diện tích kho</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalArea.toLocaleString()}</span>
            <span className="text-xs text-slate-500">m² sàn cho thuê</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Doanh thu TB: <strong>~{formatVND(Math.round(facilities.reduce((s, f) => s + f.monthlyRevenue, 0) / facilities.length))}/cơ sở</strong>
          </p>
        </div>
      </div>

      {/* Control Bar: Filter, Search & Add button */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="search"
              placeholder="Tìm theo tên cơ sở, mã, quận, người quản lý..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-slate-50/70 border border-slate-300 rounded-lg px-3 py-2 pl-9 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <OperationsIcon name="search" size={14} />
            </div>
          </div>

          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="all">Tất cả khu vực (Khu vực)</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="upgrading">Đang nâng cấp</option>
            <option value="paused">Tạm dừng</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-2xs flex items-center gap-1.5"
        >
          <OperationsIcon name="plus" size={14} />
          Thêm cơ sở mới
        </button>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const occupancy = Math.round((item.occupiedUnits / item.totalUnits) * 100)
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {item.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'upgrading'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.status === 'active' ? 'Đang hoạt động' : item.status === 'upgrading' ? 'Đang nâng cấp' : 'Tạm dừng'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">{item.name}</h3>
                  </div>

                  <button
                    onClick={() => setEditingFacility(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition"
                    title="Chỉnh sửa thông tin cơ sở"
                  >
                    <OperationsIcon name="edit" size={15} />
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-1">
                  <span className="shrink-0 text-slate-400">📍</span>
                  <span>{item.address}</span>
                </p>

                {/* Metrics */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Tỷ lệ lấp đầy kho:</span>
                    <span className="font-bold text-slate-900">
                      {occupancy}% ({item.occupiedUnits}/{item.totalUnits} kho)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancy >= 80 ? 'bg-emerald-500' : occupancy >= 60 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${occupancy}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-500">Doanh thu tháng này:</span>
                    <span className="font-semibold text-emerald-700">{formatVND(item.monthlyRevenue)}</span>
                  </div>
                </div>

                {/* Manager info */}
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quản lý cơ sở:</span>
                    <strong className="text-slate-800">{item.managerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hotline / Zalo:</span>
                    <span className="font-mono text-slate-700">{item.managerPhone}</span>
                  </div>
                </div>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {amenity}
                    </span>
                  ))}
                  {item.amenities.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{item.amenities.length - 3} tiện ích
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">{item.openHours}</span>
                <button
                  onClick={() => setSelectedDetail(item)}
                  className="font-semibold text-blue-600 hover:text-blue-800 transition text-xs"
                >
                  Xem chi tiết ↗
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Facility Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {selectedDetail.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedDetail.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Địa chỉ: {selectedDetail.address}</p>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="text-slate-400 hover:text-slate-600">
                <OperationsIcon name="cross" size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-400">Trưởng cơ sở:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedDetail.managerName}</p>
              </div>
              <div>
                <span className="text-slate-400">Số điện thoại:</span>
                <p className="font-mono text-slate-800 mt-0.5">{selectedDetail.managerPhone}</p>
              </div>
              <div>
                <span className="text-slate-400">Email liên hệ:</span>
                <p className="font-mono text-slate-800 mt-0.5">{selectedDetail.managerEmail}</p>
              </div>
              <div>
                <span className="text-slate-400">Giờ phục vụ tại quầy:</span>
                <p className="font-medium text-slate-800 mt-0.5">{selectedDetail.openHours}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tiện ích & Trang bị cơ sở:</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedDetail.amenities.map((a, i) => (
                  <span key={i} className="text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium">
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setEditingFacility(selectedDetail)
                  setSelectedDetail(null)
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs"
              >
                Chỉnh sửa cơ sở
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(showAddModal || editingFacility) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingFacility ? `Chỉnh sửa cơ sở ${editingFacility.code}` : 'Thêm cơ sở lưu trữ mới vào hệ thống'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingFacility(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <OperationsIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={editingFacility ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã cơ sở (Code):</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: SS-HCM-Q2"
                    value={editingFacility ? editingFacility.code : newFacility.code}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, code: e.target.value })
                        : setNewFacility({ ...newFacility, code: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên cơ sở:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: SelfStorage Quận 2"
                    value={editingFacility ? editingFacility.name : newFacility.name}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, name: e.target.value })
                        : setNewFacility({ ...newFacility, name: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thành phố / Tỉnh:</label>
                  <select
                    value={editingFacility ? editingFacility.city : newFacility.city}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, city: e.target.value })
                        : setNewFacility({ ...newFacility, city: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium text-slate-800"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quận / Huyện:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Quận 2"
                    value={editingFacility ? editingFacility.district : newFacility.district}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, district: e.target.value })
                        : setNewFacility({ ...newFacility, district: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 block mb-1">Địa chỉ chi tiết:</label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên đường, phường..."
                  value={editingFacility ? editingFacility.address : newFacility.address}
                  onChange={(e) =>
                    editingFacility
                      ? setEditingFacility({ ...editingFacility, address: e.target.value })
                      : setNewFacility({ ...newFacility, address: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Người quản lý cơ sở:</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên"
                    value={editingFacility ? editingFacility.managerName : newFacility.managerName}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, managerName: e.target.value })
                        : setNewFacility({ ...newFacility, managerName: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại liên hệ:</label>
                  <input
                    type="text"
                    required
                    placeholder="09xx..."
                    value={editingFacility ? editingFacility.managerPhone : newFacility.managerPhone}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, managerPhone: e.target.value })
                        : setNewFacility({ ...newFacility, managerPhone: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email quản lý:</label>
                  <input
                    type="email"
                    required
                    placeholder="quanly@selfstorage.vn"
                    value={editingFacility ? editingFacility.managerEmail : newFacility.managerEmail}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, managerEmail: e.target.value })
                        : setNewFacility({ ...newFacility, managerEmail: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tổng số phòng kho:</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingFacility ? editingFacility.totalUnits : newFacility.totalUnits}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, totalUnits: Number(e.target.value) })
                        : setNewFacility({ ...newFacility, totalUnits: Number(e.target.value) })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tổng diện tích sàn (m²):</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingFacility ? editingFacility.totalArea : newFacility.totalArea}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, totalArea: Number(e.target.value) })
                        : setNewFacility({ ...newFacility, totalArea: Number(e.target.value) })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trạng thái vận hành:</label>
                  <select
                    value={editingFacility ? editingFacility.status : newFacility.status}
                    onChange={(e) =>
                      editingFacility
                        ? setEditingFacility({ ...editingFacility, status: e.target.value as any })
                        : setNewFacility({ ...newFacility, status: e.target.value as any })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium text-slate-800"
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="upgrading">Đang nâng cấp cơ sở</option>
                    <option value="paused">Tạm dừng vận hành</option>
                  </select>
                </div>
              </div>

              {/* Amenities builder */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700 block">Tiện ích cơ sở:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Thêm tiện ích (VD: Kho lạnh, Camera AI, Thang hàng...)"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddAmenity(!!editingFacility)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition"
                  >
                    + Thêm
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(editingFacility ? editingFacility.amenities : newFacility.amenities).map((a, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      <span>{a}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(idx, !!editingFacility)}
                        className="text-slate-400 hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingFacility(null)
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                >
                  {editingFacility ? 'Lưu thay đổi' : 'Tạo mới cơ sở'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
