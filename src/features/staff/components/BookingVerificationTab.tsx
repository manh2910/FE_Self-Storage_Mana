import { useState } from 'react'
import { StaffIcon } from './StaffIcons'
import type { BookingVerification } from '../model/staffDomain'

interface Props {
  verifications: BookingVerification[]
  onVerifyBooking: (id: string, notes?: string) => void
  onProceedToHandover: (bookingCode: string) => void
}

export function BookingVerificationTab({ verifications, onVerifyBooking, onProceedToHandover }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unverified' | 'verified' | 'checked_in'>('all')
  const [selectedBooking, setSelectedBooking] = useState<BookingVerification | null>(null)
  const [verifyNotes, setVerifyNotes] = useState('')

  const filtered = verifications.filter((item) => {
    const matchSearch =
      item.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.customerPhone.includes(search) ||
      item.customerIdCard.includes(search) ||
      item.unitCode.toLowerCase().includes(search.toLowerCase())

    const matchStatus = statusFilter === 'all' || item.verificationStatus === statusFilter
    return matchSearch && matchStatus
  })

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const handleOpenModal = (booking: BookingVerification) => {
    setSelectedBooking(booking)
    setVerifyNotes(booking.notes || '')
  }

  const handleConfirmVerify = () => {
    if (!selectedBooking) return
    onVerifyBooking(selectedBooking.id, verifyNotes)
    setSelectedBooking(null)
  }

  return (
    <div className="space-y-5">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[260px] relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo Mã đặt (BK-xxx), Tên khách, SĐT, số CCCD hoặc Mã kho..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pl-9 text-xs focus:bg-white focus:border-blue-500 focus:outline-hidden transition"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <StaffIcon name="search" size={14} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="unverified">Chờ đối chiếu CCCD ({verifications.filter(v => v.verificationStatus === 'unverified').length})</option>
            <option value="verified">Đã xác minh ({verifications.filter(v => v.verificationStatus === 'verified').length})</option>
            <option value="checked_in">Đã nhận kho ({verifications.filter(v => v.verificationStatus === 'checked_in').length})</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Mã đặt chỗ</th>
                <th className="px-4 py-3.5">Khách hàng</th>
                <th className="px-4 py-3.5">Số CCCD đối chiếu</th>
                <th className="px-4 py-3.5">Kho thuê</th>
                <th className="px-4 py-3.5">Thời gian thuê</th>
                <th className="px-4 py-3.5">Thanh toán cọc</th>
                <th className="px-4 py-3.5">Trạng thái hồ sơ</th>
                <th className="px-4 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => {
                const isVerified = item.verificationStatus === 'verified'
                const isCheckedIn = item.verificationStatus === 'checked_in'
                const isUnverified = item.verificationStatus === 'unverified'

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold font-mono text-blue-700">
                      {item.bookingCode}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{item.customerName}</div>
                      <div className="text-[11px] text-slate-400">{item.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-800">
                      {item.customerIdCard}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-800">Kho {item.unitCode}</span>
                      <span className="text-slate-400 ml-1">({item.unitType} · {item.unitArea}m²)</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      <div>{item.startDate}</div>
                      <div className="text-[11px] text-slate-400">đến {item.endDate}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{formatCurrency(item.depositAmount)}</div>
                      <span className={`inline-block text-[10px] font-semibold ${item.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {item.paymentStatus === 'Paid' ? 'Đã thanh toán đủ' : 'Thanh toán một phần'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {isUnverified && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          Chờ đối chiếu CCCD
                        </span>
                      )}
                      {isVerified && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                          Đã xác minh hợp lệ
                        </span>
                      )}
                      {isCheckedIn && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                          Đã nhận kho
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {isUnverified && (
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition"
                        >
                          Xác minh CCCD
                        </button>
                      )}
                      {isVerified && (
                        <button
                          onClick={() => onProceedToHandover(item.bookingCode)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition"
                        >
                          Bàn giao kho →
                        </button>
                      )}
                      {isCheckedIn && (
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-800 font-medium text-xs transition"
                        >
                          Xem chi tiết
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {!filtered.length && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-xs text-slate-400">
                    Không tìm thấy hồ sơ đặt kho nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-lg border border-slate-200 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Chi tiết đối chiếu đặt kho</h3>
                <span className="font-mono text-blue-600 font-semibold">{selectedBooking.bookingCode}</span>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600">
                <StaffIcon name="cross" size={16} />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Họ tên khách hàng:</span>
                  <strong className="text-slate-800 text-xs">{selectedBooking.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                  <span className="text-slate-700">{selectedBooking.customerPhone}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[11px]">Số CCCD đăng ký:</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                    {selectedBooking.customerIdCard}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Vị trí kho:</span>
                  <span className="font-bold text-slate-800">Kho {selectedBooking.unitCode} ({selectedBooking.unitArea}m²)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-slate-800 block">Quy trình xác thực:</label>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Đã kiểm tra thẻ Căn cước công dân / CMND gốc</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" defaultChecked={selectedBooking.paymentStatus === 'Paid'} className="rounded text-blue-600" />
                  <span>Đã đối chiếu chứng từ thanh toán tiền đặt cọc</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Khách hàng có mặt trực tiếp tại quầy cơ sở</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Ghi chú xác thực:</label>
              <textarea
                rows={2}
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="Ghi nhận thêm thông tin nếu có..."
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
              >
                Đóng
              </button>
              {selectedBooking.verificationStatus === 'unverified' && (
                <button
                  type="button"
                  onClick={handleConfirmVerify}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  Xác nhận hợp lệ ✓
                </button>
              )}
              {selectedBooking.verificationStatus === 'verified' && (
                <button
                  type="button"
                  onClick={() => {
                    const code = selectedBooking.bookingCode
                    setSelectedBooking(null)
                    onProceedToHandover(code)
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
                >
                  Tiến hành bàn giao →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
