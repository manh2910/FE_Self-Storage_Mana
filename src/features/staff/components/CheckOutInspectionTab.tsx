import { useState } from 'react'
import { StaffIcon } from './StaffIcons'
import type { ReturnInspection } from '../model/staffDomain'

interface Props {
  returns: ReturnInspection[]
  onCompleteReturn: (returnRecord: ReturnInspection) => void
}

export function CheckOutInspectionTab({ returns, onCompleteReturn }: Props) {
  const [selectedReturn, setSelectedReturn] = useState<ReturnInspection | null>(null)
  const [cleanliness, setCleanliness] = useState<ReturnInspection['cleanliness']>('clean')
  const [equipmentCondition, setEquipmentCondition] = useState<ReturnInspection['equipmentCondition']>('good')
  const [accessDeviceReturned, setAccessDeviceReturned] = useState(true)
  const [penaltyAmount, setPenaltyAmount] = useState(0)
  const [penaltyReason, setPenaltyReason] = useState('')
  const [depositRefundStatus, setDepositRefundStatus] = useState<ReturnInspection['depositRefundStatus']>('full_refund')
  const [inspectionNotes, setInspectionNotes] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const pendingReturns = returns.filter((r) => r.status === 'pending_inspection')
  const completedReturns = returns.filter((r) => r.status === 'completed')

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const handleOpenInspection = (record: ReturnInspection) => {
    setSelectedReturn(record)
    setCleanliness(record.cleanliness)
    setEquipmentCondition(record.equipmentCondition)
    setAccessDeviceReturned(record.accessDeviceReturned)
    setPenaltyAmount(record.penaltyAmount)
    setPenaltyReason(record.penaltyReason || '')
    setDepositRefundStatus(record.depositRefundStatus)
    setInspectionNotes(record.inspectionNotes || '')
  }

  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReturn) return

    onCompleteReturn({
      ...selectedReturn,
      cleanliness,
      equipmentCondition,
      accessDeviceReturned,
      penaltyAmount,
      penaltyReason,
      depositRefundStatus,
      inspectionNotes,
      inspectorName: 'Lê Văn Hùng',
      status: 'completed',
    })

    setSelectedReturn(null)
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
            <StaffIcon name="checkout" size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Kiểm tra hiện trạng & Thủ tục trả kho
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Nghiệm thu hiện trạng vệ sinh, trang thiết bị, thu hồi thẻ từ/chìa khóa và giải quyết hoàn tiền cọc.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            {pendingReturns.length} hồ sơ chờ nghiệm thu
          </span>
        </div>
      </div>

      {showSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-2xs text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-emerald-600 font-bold">✓</span>
            Đã hoàn tất nghiệm thu trả kho. Phòng kho đã tự động chuyển sang trạng thái <strong>Cleaning</strong> để nhân viên làm sạch.
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-emerald-700/70 hover:text-emerald-900 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Pending Check-out queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Hồ sơ khách hàng trả kho hôm nay ({pendingReturns.length})
          </h3>
        </div>

        {pendingReturns.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
            Hiện không có hồ sơ nào đang chờ nghiệm thu trả kho trong ca trực.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReturns.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-base font-bold text-slate-900">Kho {item.unitCode}</span>
                      <span className="ml-2 text-xs font-mono text-slate-500">#{item.bookingCode}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-medium">
                      Chờ nghiệm thu
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Khách hàng:</span>
                      <span className="font-medium text-slate-900">{item.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số điện thoại:</span>
                      <span className="font-mono text-slate-800">{item.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ngày yêu cầu trả:</span>
                      <span className="text-slate-800">{item.returnDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Kiểm tra thực tế tại kho</span>
                  <button
                    onClick={() => handleOpenInspection(item)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
                  >
                    <StaffIcon name="verify" size={13} />
                    Tiến hành nghiệm thu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspection History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <StaffIcon name="document" className="text-slate-500" size={16} />
            Lịch sử biên bản trả kho gần đây
          </h3>
          <span className="text-xs text-slate-500">{completedReturns.length} biên bản</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-medium border-y border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Kho</th>
                <th className="px-4 py-2.5">Khách hàng</th>
                <th className="px-4 py-2.5">Ngày hoàn tất</th>
                <th className="px-4 py-2.5">Hiện trạng vệ sinh</th>
                <th className="px-4 py-2.5">Trang thiết bị</th>
                <th className="px-4 py-2.5">Thu hồi thiết bị</th>
                <th className="px-4 py-2.5">Hoàn tiền cọc</th>
                <th className="px-4 py-2.5">Ghi chú nghiệm thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {completedReturns.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.unitCode}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.customerName}</td>
                  <td className="px-4 py-3 text-slate-500">{item.returnDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      item.cleanliness === 'clean'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {item.cleanliness === 'clean' ? 'Sạch sẽ' : 'Cần dọn dẹp'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {item.equipmentCondition === 'good' ? 'Tốt, nguyên vẹn' : 'Trầy xước nhẹ'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <span>✓</span> Đã thu hồi
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      item.depositRefundStatus === 'full_refund'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {item.depositRefundStatus === 'full_refund' ? 'Hoàn 100%' : `Trừ ${formatCurrency(item.penaltyAmount)}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 italic max-w-xs truncate">
                    {item.inspectionNotes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Biên bản nghiệm thu trả kho {selectedReturn.unitCode}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khách hàng: <strong className="text-slate-800">{selectedReturn.customerName}</strong> ({selectedReturn.customerPhone})
                </p>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="text-slate-400 hover:text-slate-600 rounded p-1 transition"
              >
                <StaffIcon name="cross" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitInspection} className="space-y-4">
              {/* Cleanliness */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 block">
                  1. Hiện trạng vệ sinh kho lưu trữ:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCleanliness('clean')}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      cleanliness === 'clean'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Sạch sẽ, đã dọn đồ
                  </button>
                  <button
                    type="button"
                    onClick={() => setCleanliness('dusty')}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      cleanliness === 'dusty'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Bụi bẩn nhẹ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCleanliness('debris_left')
                      setPenaltyAmount(100000)
                      setPenaltyReason('Phí dọn dẹp rác thải tồn đọng')
                    }}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      cleanliness === 'debris_left'
                        ? 'border-rose-500 bg-rose-50 text-rose-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Còn rác cồng kềnh
                  </button>
                </div>
              </div>

              {/* Equipment condition */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 block">
                  2. Tình trạng cửa cuốn, bản lề và vách ngăn:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setEquipmentCondition('good')}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      equipmentCondition === 'good'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Tốt, nguyên vẹn
                  </button>
                  <button
                    type="button"
                    onClick={() => setEquipmentCondition('minor_scratches')}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      equipmentCondition === 'minor_scratches'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Trầy xước nhẹ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEquipmentCondition('damaged')
                      setPenaltyAmount(500000)
                      setPenaltyReason('Hư hỏng bản lề hoặc phụ kiện khóa')
                    }}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      equipmentCondition === 'damaged'
                        ? 'border-rose-500 bg-rose-50 text-rose-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Hư hỏng trang thiết bị
                  </button>
                </div>
              </div>

              {/* Access device return */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={accessDeviceReturned}
                    onChange={(e) => setAccessDeviceReturned(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Đã thu hồi đầy đủ chìa khóa vật lý, thẻ từ hoặc vô hiệu hóa mã PIN</span>
                </label>
              </div>

              {/* Penalty and Deposit refund */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Phương án hoàn tiền cọc:</label>
                    <select
                      value={depositRefundStatus}
                      onChange={(e) => setDepositRefundStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="full_refund">Hoàn cọc 100%</option>
                      <option value="partial_refund">Khấu trừ tiền cọc</option>
                      <option value="no_refund">Không hoàn cọc</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Số tiền khấu trừ (VNĐ):</label>
                    <input
                      type="number"
                      value={penaltyAmount}
                      onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-900 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {penaltyAmount > 0 && (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Lý do khấu trừ:</label>
                    <input
                      type="text"
                      value={penaltyReason}
                      onChange={(e) => setPenaltyReason(e.target.value)}
                      placeholder="Ví dụ: Phí vệ sinh rác thải tồn đọng hoặc sơn dặm vách..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">
                  Ghi chú kết luận nghiệm thu:
                </label>
                <textarea
                  rows={2}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Ghi chú thêm nếu có..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReturn(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
                >
                  <StaffIcon name="check" size={14} />
                  Xác nhận hoàn tất trả kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

