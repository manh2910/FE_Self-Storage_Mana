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

  const pendingReturns = returns.filter(r => r.status === 'pending_inspection')
  const completedReturns = returns.filter(r => r.status === 'completed')

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
      status: 'completed'
    })

    setSelectedReturn(null)
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <StaffIcon name="checkout" className="text-emerald-600" />
            Kiểm tra hiện trạng & Thủ tục trả kho (Check-out)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Nghiệm thu vệ sinh, kiểm tra hư hại trang thiết bị, thu hồi thẻ/chìa khóa và quyết định hoàn cọc cho khách hàng
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            {pendingReturns.length} hồ sơ chờ kiểm tra trả kho
          </span>
        </div>
      </div>

      {showSuccessToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 font-bold text-sm">
            <StaffIcon name="check" size={18} />
            Đã hoàn tất nghiệm thu trả kho! Kho đã tự động chuyển sang trạng thái Cleaning để tiến hành dọn vệ sinh.
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="text-white/80 hover:text-white">
            <StaffIcon name="cross" size={16} />
          </button>
        </div>
      )}

      {/* Pending Check-out queue */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          Danh sách khách hàng đang làm thủ tục trả kho hôm nay:
        </h3>

        {pendingReturns.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            Hiện không có hồ sơ nào đang chờ kiểm tra trả kho trong ca trực này.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReturns.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-base font-extrabold text-blue-700">Kho {item.unitCode}</span>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold">
                      Chờ nghiệm thu trả kho
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Khách hàng: <strong className="text-slate-900">{item.customerName}</strong></div>
                    <div>Số điện thoại: <span className="text-slate-700">{item.customerPhone}</span></div>
                    <div>Mã hợp đồng / đặt chỗ: <span className="font-mono text-blue-600 font-semibold">{item.bookingCode}</span></div>
                    <div>Ngày yêu cầu trả: <span className="text-slate-700">{item.returnDate}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Kiểm tra thực tế tại kho</span>
                  <button
                    onClick={() => handleOpenInspection(item)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <StaffIcon name="verify" size={14} />
                    Tiến hành kiểm tra & Nghiệm thu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspection History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <StaffIcon name="document" className="text-slate-500" size={16} />
          Biên bản trả kho đã hoàn tất gần đây
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Kho</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Ngày hoàn tất</th>
                <th className="px-4 py-3">Hiện trạng vệ sinh</th>
                <th className="px-4 py-3">Tình trạng trang thiết bị</th>
                <th className="px-4 py-3">Thu hồi thẻ / chìa</th>
                <th className="px-4 py-3">Hoàn cọc</th>
                <th className="px-4 py-3">Ghi chú nghiệm thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {completedReturns.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5 font-bold text-blue-700">{item.unitCode}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{item.customerName}</td>
                  <td className="px-4 py-3.5 text-slate-500">{item.returnDate}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                      {item.cleanliness === 'clean' ? 'Sạch sẽ' : 'Cần dọn dẹp'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {item.equipmentCondition === 'good' ? 'Tốt, nguyên vẹn' : 'Xước nhẹ'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-emerald-600 font-bold">✓ Đã thu hồi</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                      {item.depositRefundStatus === 'full_refund' ? 'Hoàn 100%' : `Trừ ${formatCurrency(item.penaltyAmount)}`}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 italic max-w-xs truncate">
                    {item.inspectionNotes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Biên bản kiểm tra trả kho {selectedReturn.unitCode}
                </h3>
                <p className="text-xs text-slate-500">Khách hàng: <strong className="text-slate-800">{selectedReturn.customerName}</strong> ({selectedReturn.customerPhone})</p>
              </div>
              <button onClick={() => setSelectedReturn(null)} className="text-slate-400 hover:text-slate-600">
                <StaffIcon name="cross" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitInspection} className="space-y-5">
              {/* Cleanliness */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  1. Hiện trạng vệ sinh kho lưu trữ:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCleanliness('clean')}
                    className={`p-3 rounded-xl border text-center transition ${
                      cleanliness === 'clean' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold' : 'border-slate-200 bg-white'
                    }`}
                  >
                    ✓ Sạch sẽ, đã dọn đồ
                  </button>
                  <button
                    type="button"
                    onClick={() => setCleanliness('dusty')}
                    className={`p-3 rounded-xl border text-center transition ${
                      cleanliness === 'dusty' ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold' : 'border-slate-200 bg-white'
                    }`}
                  >
                    Có bụi bẩn nhẹ
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCleanliness('debris_left'); setPenaltyAmount(100000); setPenaltyReason('Phí dọn dẹp rác thải để lại') }}
                    className={`p-3 rounded-xl border text-center transition ${
                      cleanliness === 'debris_left' ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold' : 'border-slate-200 bg-white'
                    }`}
                  >
                    Còn rác cồng kềnh
                  </button>
                </div>
              </div>

              {/* Equipment condition */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  2. Tình trạng cửa cuốn, vách ngăn và ổ khóa:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setEquipmentCondition('good')}
                    className={`p-3 rounded-xl border text-center transition ${
                      equipmentCondition === 'good' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold' : 'border-slate-200 bg-white'
                    }`}
                  >
                    ✓ Tốt, nguyên vẹn
                  </button>
                  <button
                    type="button"
                    onClick={() => setEquipmentCondition('minor_scratches')}
                    className={`p-3 rounded-xl border text-center transition ${
                      equipmentCondition === 'minor_scratches' ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold' : 'border-slate-200 bg-white'
                    }`}
                  >
                    Trầy xước nhẹ
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEquipmentCondition('damaged'); setPenaltyAmount(500000); setPenaltyReason('Hư hỏng bản lề cửa hoặc ổ khóa') }}
                    className={`p-3 rounded-xl border text-center transition ${
                      equipmentCondition === 'damaged' ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold' : 'border-slate-200 bg-white'
                    }`}
                  >
                    Hư hỏng trang thiết bị
                  </button>
                </div>
              </div>

              {/* Access device return */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={accessDeviceReturned}
                    onChange={(e) => setAccessDeviceReturned(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Đã thu hồi đầy đủ chìa khóa vật lý / thẻ từ RFID hoặc hủy mã PIN điện tử</span>
                </label>
              </div>

              {/* Penalty and Deposit refund */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Quyết định hoàn trả tiền cọc:</label>
                    <select
                      value={depositRefundStatus}
                      onChange={(e) => setDepositRefundStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-800"
                    >
                      <option value="full_refund">Hoàn cọc 100% (Không phát sinh)</option>
                      <option value="partial_refund">Hoàn cọc 1 phần (Khấu trừ hư hại/vệ sinh)</option>
                      <option value="no_refund">Không hoàn cọc</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Chi phí khấu trừ / đền bù (VNĐ):</label>
                    <input
                      type="number"
                      value={penaltyAmount}
                      onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-rose-700"
                    />
                  </div>
                </div>

                {penaltyAmount > 0 && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lý do khấu trừ tiền cọc:</label>
                    <input
                      type="text"
                      value={penaltyReason}
                      onChange={(e) => setPenaltyReason(e.target.value)}
                      placeholder="Ví dụ: Phí vệ sinh rác thải tồn đọng hoặc sơn sửa vết nứt..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Ghi chú kết luận nghiệm thu trả kho:
                </label>
                <textarea
                  rows={2}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Ghi chú chi tiết cho biên bản trả kho..."
                  className="w-full text-xs border border-slate-300 rounded-xl p-3"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReturn(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5"
                >
                  <StaffIcon name="check" size={15} />
                  Ký xác nhận nghiệm thu trả kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
