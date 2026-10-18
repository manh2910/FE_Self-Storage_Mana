import { useState } from 'react'
import { OperationsIcon } from './OperationsIcons'
import {
  formatVND,
  type PricingTier,
  type AdditionalFee,
  type PromotionPolicy,
} from '../model/operationsDomain'

interface Props {
  pricingTiers: PricingTier[]
  additionalFees: AdditionalFee[]
  promotions: PromotionPolicy[]
  onUpdatePricingTier: (tier: PricingTier) => void
  onAddAdditionalFee: (fee: Omit<AdditionalFee, 'id'>) => void
  onUpdateAdditionalFee: (fee: AdditionalFee) => void
  onAddPromotion: (promo: Omit<PromotionPolicy, 'id' | 'usageCount'>) => void
  onUpdatePromotion: (promo: PromotionPolicy) => void
}

export function PricingFeesTab({
  pricingTiers,
  additionalFees,
  promotions,
  onUpdatePricingTier,
  onAddAdditionalFee,
  onUpdateAdditionalFee,
  onAddPromotion,
  onUpdatePromotion,
}: Props) {
  const [activeSection, setActiveSection] = useState<'tiers' | 'fees' | 'promos'>('tiers')

  // Modals state
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null)
  const [editingFee, setEditingFee] = useState<AdditionalFee | null>(null)
  const [showAddFeeModal, setShowAddFeeModal] = useState(false)
  const [editingPromo, setEditingPromo] = useState<PromotionPolicy | null>(null)
  const [showAddPromoModal, setShowAddPromoModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [newFee, setNewFee] = useState<Omit<AdditionalFee, 'id'>>({
    code: '',
    name: '',
    category: 'service',
    standardAmount: 100000,
    unit: 'Lần áp dụng',
    description: '',
    isActive: true,
  })

  const [newPromo, setNewPromo] = useState<Omit<PromotionPolicy, 'id' | 'usageCount'>>({
    code: '',
    title: '',
    type: 'percent',
    discountValue: 10,
    minLeaseMonths: 3,
    validUntil: '2026-12-31',
    targetCustomers: 'all',
    status: 'active',
  })

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTier) return
    onUpdatePricingTier(editingTier)
    setEditingTier(null)
    triggerToast('Đã lưu khung giá thuê kho cơ sở!')
  }

  const handleSaveFee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFee) return
    onUpdateAdditionalFee(editingFee)
    setEditingFee(null)
    triggerToast('Đã lưu biểu phí phụ thu!')
  }

  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFee.name.trim() || !newFee.code.trim()) return
    onAddAdditionalFee(newFee)
    setShowAddFeeModal(false)
    setNewFee({
      code: '',
      name: '',
      category: 'service',
      standardAmount: 100000,
      unit: 'Lần áp dụng',
      description: '',
      isActive: true,
    })
    triggerToast('Đã thêm biểu phí mới!')
  }

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPromo) return
    onUpdatePromotion(editingPromo)
    setEditingPromo(null)
    triggerToast('Đã cập nhật chương trình khuyến mại!')
  }

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPromo.code.trim() || !newPromo.title.trim()) return
    onAddPromotion(newPromo)
    setShowAddPromoModal(false)
    setNewPromo({
      code: '',
      title: '',
      type: 'percent',
      discountValue: 10,
      minLeaseMonths: 3,
      validUntil: '2026-12-31',
      targetCustomers: 'all',
      status: 'active',
    })
    triggerToast('Đã tạo chính sách khuyến mãi mới!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <OperationsIcon name="pricing" size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Quản lý khung giá thuê, biểu phí & chính sách khuyến mãi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Thiết lập giá niêm yết theo loại kho, biểu phí đền bù / dịch vụ phát sinh, phí trễ hạn và các gói voucher ưu đãi.
            </p>
          </div>
        </div>

        {/* Sub-section Switcher */}
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveSection('tiers')}
            className={`px-3 py-1.5 rounded-md transition ${activeSection === 'tiers' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
          >
            1. Khung giá thuê kho ({pricingTiers.length})
          </button>
          <button
            onClick={() => setActiveSection('fees')}
            className={`px-3 py-1.5 rounded-md transition ${activeSection === 'fees' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
          >
            2. Biểu phí & Phí phạt ({additionalFees.length})
          </button>
          <button
            onClick={() => setActiveSection('promos')}
            className={`px-3 py-1.5 rounded-md transition ${activeSection === 'promos' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
          >
            3. Khuyến mãi & Giảm giá ({promotions.length})
          </button>
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

      {/* SECTION 1: PRICING TIERS */}
      {activeSection === 'tiers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Khung giá thuê chuẩn theo quy cách phòng kho
            </h3>
            <span className="text-xs text-slate-500">Giá chưa bao gồm VAT (10%)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Loại: {tier.unitType}
                    </span>
                    <button
                      onClick={() => setEditingTier(tier)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition"
                      title="Chỉnh sửa khung giá"
                    >
                      <OperationsIcon name="edit" size={15} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{tier.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Diện tích tiêu chuẩn: <strong>{tier.areaM2} m²</strong></p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[11px] text-slate-400 block">Giá thuê tháng niêm yết:</span>
                    <div className="text-lg font-black text-slate-900 mt-0.5">
                      {formatVND(tier.baseMonthlyPrice)}
                      <span className="text-xs font-normal text-slate-500">/tháng</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tiền đặt cọc:</span>
                      <strong className="text-slate-800">{formatVND(tier.securityDeposit)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ưu đãi theo quý (3T):</span>
                      <span className="text-emerald-700 font-semibold">Giảm {tier.quarterlyDiscountPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ưu đãi cả năm (12T):</span>
                      <span className="text-emerald-700 font-semibold">Giảm {tier.annualDiscountPercent}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditingTier(tier)}
                  className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition"
                >
                  Điều chỉnh mức giá
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ADDITIONAL & OVERDUE FEES */}
      {activeSection === 'fees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Biểu phí phát sinh, đền bù & phạt quá hạn ({additionalFees.length})
            </h3>
            <button
              onClick={() => setShowAddFeeModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
            >
              <OperationsIcon name="plus" size={13} />
              Thêm khoản phí
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mã phí</th>
                  <th className="px-4 py-3">Tên khoản phí / Dịch vụ</th>
                  <th className="px-4 py-3">Phân loại</th>
                  <th className="px-4 py-3">Định mức thu</th>
                  <th className="px-4 py-3">Đơn vị tính</th>
                  <th className="px-4 py-3">Mô tả quy định</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {additionalFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3.5 font-mono font-semibold text-blue-700">{fee.code}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-900">{fee.name}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          fee.category === 'overdue'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : fee.category === 'penalty'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {fee.category === 'overdue'
                          ? 'Quá hạn'
                          : fee.category === 'penalty'
                          ? 'Chế tài phạt'
                          : 'Dịch vụ'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {fee.standardAmount === 0 ? (
                        <span className="text-emerald-600 font-semibold">Miễn phí</span>
                      ) : (
                        formatVND(fee.standardAmount)
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{fee.unit}</td>
                    <td className="px-4 py-3.5 text-slate-500 max-w-xs">{fee.description}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setEditingFee(fee)}
                        className="px-2.5 py-1 text-slate-600 hover:text-blue-600 border border-slate-200 rounded-md font-medium text-[11px] hover:bg-slate-50 transition"
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: PROMOTIONS */}
      {activeSection === 'promos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Chính sách giảm giá, khuyến mại & voucher ({promotions.length})
            </h3>
            <button
              onClick={() => setShowAddPromoModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
            >
              <OperationsIcon name="plus" size={13} />
              Tạo gói ưu đãi mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                      {promo.code}
                    </span>
                    <button
                      onClick={() => setEditingPromo(promo)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition"
                    >
                      <OperationsIcon name="edit" size={15} />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{promo.title}</h4>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Mức chiết khấu:</span>
                    <span className="text-base font-extrabold text-blue-700">
                      {promo.type === 'percent'
                        ? `Giảm ${promo.discountValue}%`
                        : promo.type === 'free_days'
                        ? `Miễn phí ${promo.discountValue} ngày`
                        : `Giảm ${formatVND(promo.discountValue)}`}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Thời hạn tối thiểu:</span>
                      <strong>Từ {promo.minLeaseMonths} tháng trở lên</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Đối tượng:</span>
                      <span>
                        {promo.targetCustomers === 'new_customer'
                          ? 'Khách mới'
                          : promo.targetCustomers === 'corporate'
                          ? 'Doanh nghiệp'
                          : 'Tất cả khách'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hạn áp dụng:</span>
                      <span className="text-slate-800">{promo.validUntil}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lượt đã áp dụng:</span>
                      <strong className="text-emerald-700">{promo.usageCount} lượt</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditingPromo(promo)}
                  className="w-full py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition"
                >
                  Chỉnh sửa điều kiện
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Tier Modal */}
      {editingTier && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Điều chỉnh khung giá: {editingTier.name}</h3>
              <button onClick={() => setEditingTier(null)} className="text-slate-400 hover:text-slate-600">
                <OperationsIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTier} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Giá thuê niêm yết hàng tháng (VNĐ):</label>
                <input
                  type="number"
                  required
                  step={50000}
                  value={editingTier.baseMonthlyPrice}
                  onChange={(e) => setEditingTier({ ...editingTier, baseMonthlyPrice: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mức cọc an ninh (VNĐ):</label>
                <input
                  type="number"
                  required
                  step={50000}
                  value={editingTier.securityDeposit}
                  onChange={(e) => setEditingTier({ ...editingTier, securityDeposit: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Giảm thuê theo Quý (%):</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={editingTier.quarterlyDiscountPercent}
                    onChange={(e) => setEditingTier({ ...editingTier, quarterlyDiscountPercent: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Giảm thuê theo Năm (%):</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={editingTier.annualDiscountPercent}
                    onChange={(e) => setEditingTier({ ...editingTier, annualDiscountPercent: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs"
                >
                  Lưu khung giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Fee Modal */}
      {(showAddFeeModal || editingFee) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingFee ? 'Chỉnh sửa khoản phí' : 'Thêm biểu phí mới'}
              </h3>
              <button
                onClick={() => {
                  setShowAddFeeModal(false)
                  setEditingFee(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <OperationsIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={editingFee ? handleSaveFee : handleCreateFee} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mã định danh phí (Code):</label>
                <input
                  type="text"
                  required
                  placeholder="VD: FEE-LOCK-RESET"
                  value={editingFee ? editingFee.code : newFee.code}
                  onChange={(e) =>
                    editingFee
                      ? setEditingFee({ ...editingFee, code: e.target.value })
                      : setNewFee({ ...newFee, code: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên khoản phí / Dịch vụ:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Phí cấp lại thẻ từ"
                  value={editingFee ? editingFee.name : newFee.name}
                  onChange={(e) =>
                    editingFee
                      ? setEditingFee({ ...editingFee, name: e.target.value })
                      : setNewFee({ ...newFee, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Định mức thu (VNĐ):</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10000}
                    value={editingFee ? editingFee.standardAmount : newFee.standardAmount}
                    onChange={(e) =>
                      editingFee
                        ? setEditingFee({ ...editingFee, standardAmount: Number(e.target.value) })
                        : setNewFee({ ...newFee, standardAmount: Number(e.target.value) })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Đơn vị tính:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Lần / Ngày"
                    value={editingFee ? editingFee.unit : newFee.unit}
                    onChange={(e) =>
                      editingFee
                        ? setEditingFee({ ...editingFee, unit: e.target.value })
                        : setNewFee({ ...newFee, unit: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả và quy định áp dụng:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ghi rõ điều kiện tính phí..."
                  value={editingFee ? editingFee.description : newFee.description}
                  onChange={(e) =>
                    editingFee
                      ? setEditingFee({ ...editingFee, description: e.target.value })
                      : setNewFee({ ...newFee, description: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFeeModal(false)
                    setEditingFee(null)
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs"
                >
                  {editingFee ? 'Lưu thay đổi' : 'Thêm khoản phí'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Promo Modal */}
      {(showAddPromoModal || editingPromo) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingPromo ? 'Chỉnh sửa ưu đãi' : 'Tạo gói ưu đãi mới'}
              </h3>
              <button
                onClick={() => {
                  setShowAddPromoModal(false)
                  setEditingPromo(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <OperationsIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={editingPromo ? handleSavePromo : handleCreatePromo} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã Voucher (Code):</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: HE2026"
                    value={editingPromo ? editingPromo.code : newPromo.code}
                    onChange={(e) =>
                      editingPromo
                        ? setEditingPromo({ ...editingPromo, code: e.target.value.toUpperCase() })
                        : setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hạn sử dụng:</label>
                  <input
                    type="date"
                    required
                    value={editingPromo ? editingPromo.validUntil : newPromo.validUntil}
                    onChange={(e) =>
                      editingPromo
                        ? setEditingPromo({ ...editingPromo, validUntil: e.target.value })
                        : setNewPromo({ ...newPromo, validUntil: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên chương trình ưu đãi:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Giảm giá hè cho sinh viên & khách cá nhân"
                  value={editingPromo ? editingPromo.title : newPromo.title}
                  onChange={(e) =>
                    editingPromo
                      ? setEditingPromo({ ...editingPromo, title: e.target.value })
                      : setNewPromo({ ...newPromo, title: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hình thức giảm:</label>
                  <select
                    value={editingPromo ? editingPromo.type : newPromo.type}
                    onChange={(e) =>
                      editingPromo
                        ? setEditingPromo({ ...editingPromo, type: e.target.value as any })
                        : setNewPromo({ ...newPromo, type: e.target.value as any })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium"
                  >
                    <option value="percent">Phần trăm (%)</option>
                    <option value="free_days">Số ngày miễn phí</option>
                    <option value="fixed_amount">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Giá trị giảm:</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingPromo ? editingPromo.discountValue : newPromo.discountValue}
                    onChange={(e) =>
                      editingPromo
                        ? setEditingPromo({ ...editingPromo, discountValue: Number(e.target.value) })
                        : setNewPromo({ ...newPromo, discountValue: Number(e.target.value) })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-blue-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPromoModal(false)
                    setEditingPromo(null)
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs"
                >
                  {editingPromo ? 'Lưu thay đổi' : 'Kích hoạt ưu đãi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
