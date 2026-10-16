import { useState } from 'react'
import { OperationsIcon } from './OperationsIcons'
import type { RentalPolicyConfig } from '../model/operationsDomain'

interface Props {
  policies: RentalPolicyConfig[]
  onAddPolicy: (policy: Omit<RentalPolicyConfig, 'id' | 'lastUpdated'>) => void
  onUpdatePolicy: (policy: RentalPolicyConfig) => void
}

export function RentalPoliciesTab({ policies, onAddPolicy, onUpdatePolicy }: Props) {
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [editingPolicy, setEditingPolicy] = useState<RentalPolicyConfig | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const [newPolicy, setNewPolicy] = useState<Omit<RentalPolicyConfig, 'id' | 'lastUpdated'>>({
    category: 'deposit',
    title: '',
    description: '',
    value: '',
    appliesTo: 'all',
    updatedBy: 'Lê Nguyễn Quốc Khương (BOM)',
  })

  const categoryLabels: Record<RentalPolicyConfig['category'], { label: string; icon: string; badgeClass: string }> = {
    deposit: { label: 'Đặt cọc & Hoàn cọc', icon: 'pricing', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    renewal: { label: 'Gia hạn hợp đồng', icon: 'refresh', badgeClass: 'bg-blue-50 text-blue-800 border-blue-200' },
    cancellation: { label: 'Hủy giữ chỗ / Hợp đồng', icon: 'cross', badgeClass: 'bg-rose-50 text-rose-800 border-rose-200' },
    moveout: { label: 'Trả kho & Nghiệm thu', icon: 'check', badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    overdue: { label: 'Xử lý quá hạn thanh toán', icon: 'alert', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
  }

  const filtered = policies.filter((p) => {
    const matchCat = filterCategory === 'all' || p.category === filterCategory
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.value.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPolicy.title.trim()) return

    onAddPolicy(newPolicy)
    setShowAddModal(false)
    setNewPolicy({
      category: 'deposit',
      title: '',
      description: '',
      value: '',
      appliesTo: 'all',
      updatedBy: 'Lê Nguyễn Quốc Khương (BOM)',
    })
    triggerToast()
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPolicy) return

    const now = new Date().toISOString().slice(0, 10)
    onUpdatePolicy({
      ...editingPolicy,
      lastUpdated: now,
      updatedBy: 'Lê Nguyễn Quốc Khương (BOM)',
    })
    setEditingPolicy(null)
    triggerToast()
  }

  const triggerToast = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <OperationsIcon name="policy" size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Chính sách & Quy định cho thuê chung toàn hệ thống
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Thiết lập các tiêu chuẩn đặt cọc, gia hạn hợp đồng, hủy đặt chỗ, quy trình trả kho và chế tài xử lý nợ quá hạn.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-2xs flex items-center gap-1.5"
        >
          <OperationsIcon name="plus" size={14} />
          Thêm quy định mới
        </button>
      </div>

      {showToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-medium shadow-2xs">
          <span>✓ Đã cập nhật chính sách cho thuê thành công! Quy định mới có hiệu lực trên toàn hệ thống.</span>
          <button onClick={() => setShowToast(false)} className="text-emerald-700 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600 gap-1">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-md transition ${filterCategory === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
          >
            Tất cả ({policies.length})
          </button>
          <button
            onClick={() => setFilterCategory('deposit')}
            className={`px-3 py-1.5 rounded-md transition ${filterCategory === 'deposit' ? 'bg-white text-emerald-800 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
          >
            Đặt cọc
          </button>
          <button
            onClick={() => setFilterCategory('renewal')}
            className={`px-3 py-1.5 rounded-md transition ${filterCategory === 'renewal' ? 'bg-white text-blue-800 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
          >
            Gia hạn
          </button>
          <button
            onClick={() => setFilterCategory('cancellation')}
            className={`px-3 py-1.5 rounded-md transition ${filterCategory === 'cancellation' ? 'bg-white text-rose-800 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
          >
            Hủy giữ chỗ
          </button>
          <button
            onClick={() => setFilterCategory('moveout')}
            className={`px-3 py-1.5 rounded-md transition ${filterCategory === 'moveout' ? 'bg-white text-indigo-800 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
          >
            Trả kho
          </button>
          <button
            onClick={() => setFilterCategory('overdue')}
            className={`px-3 py-1.5 rounded-md transition ${filterCategory === 'overdue' ? 'bg-white text-amber-800 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
          >
            Xử lý quá hạn
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề, nội dung quy chuẩn..."
            className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-1.5 pl-9 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-2 text-slate-400">
            <OperationsIcon name="search" size={13} />
          </div>
        </div>
      </div>

      {/* Policies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const meta = categoryLabels[item.category] || categoryLabels.deposit
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${meta.badgeClass}`}>
                      {meta.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">#{item.id}</span>
                  </div>

                  <button
                    onClick={() => setEditingPolicy(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition"
                    title="Chỉnh sửa chính sách"
                  >
                    <OperationsIcon name="edit" size={15} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">Giá trị / Tiêu chuẩn áp dụng:</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                    {item.value}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Phạm vi: <strong className="text-slate-600">{item.appliesTo === 'all' ? 'Toàn bộ cơ sở' : 'Theo cơ sở'}</strong>
                </span>
                <span>Cập nhật: {item.lastUpdated}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingPolicy) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingPolicy ? 'Chỉnh sửa chính sách cho thuê' : 'Thêm quy định cho thuê mới'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingPolicy(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <OperationsIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={editingPolicy ? handleEditSubmit : handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phân loại danh mục:</label>
                  <select
                    value={editingPolicy ? editingPolicy.category : newPolicy.category}
                    onChange={(e) =>
                      editingPolicy
                        ? setEditingPolicy({ ...editingPolicy, category: e.target.value as any })
                        : setNewPolicy({ ...newPolicy, category: e.target.value as any })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium text-slate-800"
                  >
                    <option value="deposit">Đặt cọc & Hoàn cọc</option>
                    <option value="renewal">Gia hạn hợp đồng</option>
                    <option value="cancellation">Hủy giữ chỗ / Hợp đồng</option>
                    <option value="moveout">Trả kho & Nghiệm thu</option>
                    <option value="overdue">Xử lý quá hạn thanh toán</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phạm vi áp dụng:</label>
                  <select
                    value={editingPolicy ? editingPolicy.appliesTo : newPolicy.appliesTo}
                    onChange={(e) =>
                      editingPolicy
                        ? setEditingPolicy({ ...editingPolicy, appliesTo: e.target.value as any })
                        : setNewPolicy({ ...newPolicy, appliesTo: e.target.value as any })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium text-slate-800"
                  >
                    <option value="all">Toàn hệ thống (Tất cả cơ sở)</option>
                    <option value="custom">Tùy biến theo cơ sở</option>
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 block mb-1">Tiêu đề chính sách / quy định:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thời gian ân hạn thanh toán tiền thuê"
                  value={editingPolicy ? editingPolicy.title : newPolicy.title}
                  onChange={(e) =>
                    editingPolicy
                      ? setEditingPolicy({ ...editingPolicy, title: e.target.value })
                      : setNewPolicy({ ...newPolicy, title: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 block mb-1">Giá trị / Định mức áp dụng:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 3 ngày ân hạn · 100% tiền cọc · 50.000 VNĐ/ngày"
                  value={editingPolicy ? editingPolicy.value : newPolicy.value}
                  onChange={(e) =>
                    editingPolicy
                      ? setEditingPolicy({ ...editingPolicy, value: e.target.value })
                      : setNewPolicy({ ...newPolicy, value: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold text-blue-700"
                />
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 block mb-1">Mô tả chi tiết và hướng dẫn thi hành:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi rõ các điều kiện, mốc thời gian và trách nhiệm của khách hàng/nhân viên..."
                  value={editingPolicy ? editingPolicy.description : newPolicy.description}
                  onChange={(e) =>
                    editingPolicy
                      ? setEditingPolicy({ ...editingPolicy, description: e.target.value })
                      : setNewPolicy({ ...newPolicy, description: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingPolicy(null)
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                >
                  {editingPolicy ? 'Lưu cập nhật' : 'Ban hành chính sách'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
