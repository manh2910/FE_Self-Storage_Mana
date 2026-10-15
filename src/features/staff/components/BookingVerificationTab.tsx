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
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <StaffIcon name="verify" className="text-blue-600" />
            Xác minh thông tin đặt kho
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Đối chiếu CCCD/CMND, kiểm tra chứng từ thanh toán và xác nhận quyền nhận kho của khách hàng tại quầy
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-semibold">
            {verifications.filter(v => v.verificationStatus === 'unverified').length} hồ sơ chờ xác minh
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo Mã đặt chỗ (BK-xxx), Tên khách hàng, SĐT, số CCCD hoặc Mã kho..."
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-xs"
          />
          <div className="absolute left-3.5 top-3 text-slate-400">
            <StaffIcon name="search" size={16} />
          </div>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-xs"
          >
            <option value="all">Tất cả trạng thái hồ sơ</option>
            <option value="unverified">Chờ xác minh tại quầy</option>
            <option value="verified">Đã xác minh (Sẵn sàng nhận kho)</option>
            <option value="checked_in">Đã nhận kho thành công</option>
          </select>
        </div>
      </div>

      {/* Table of bookings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4">Mã đặt chỗ</th>
                <th className="px-5 py-4">Khách hàng</th>
                <th className="px-5 py-4">Số CCCD / CMND</th>
                <th className="px-5 py-4">Kho gán</th>
                <th className="px-5 py-4">Thời hạn thuê</th>
                <th className="px-5 py-4">Thanh toán</th>
                <th className="px-5 py-4">Trạng thái xác minh</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isVerified = item.verificationStatus === 'verified'
                const isCheckedIn = item.verificationStatus === 'checked_in'
                const isUnverified = item.verificationStatus === 'unverified'

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-blue-700">
                      {item.bookingCode}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{item.customerName}</div>
                      <div className="text-xs text-slate-400">{item.customerPhone}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-700 font-semibold">
                      {item.customerIdCard}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                        {item.unitCode}
                      </span>
                      <span className="text-xs text-slate-500 ml-1.5">
                        ({item.unitType} · {item.unitArea}m²)
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      <div>Từ: {item.startDate}</div>
                      <div className="text-slate-400">Đến: {item.endDate}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {item.paymentStatus === 'Paid' ? 'Đã thanh toán đủ' : 'Thanh toán một phần'}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{formatCurrency(item.depositAmount)}</div>
                    </td>
                    <td className="px-5 py-4">
                      {isUnverified && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          Chờ đối chiếu CCCD
                        </span>
                      )}
                      {isVerified && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                          Đã xác minh hợp lệ
                        </span>
                      )}
                      {isCheckedIn && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                          Đã nhận kho
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {isUnverified && (
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                          >
                            Xác minh ngay
                          </button>
                        )}
                        {isVerified && (
                          <button
                            onClick={() => onProceedToHandover(item.bookingCode)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
                          >
                            <StaffIcon name="handover" size={13} />
                            Bàn giao kho
                          </button>
                        )}
                        {isCheckedIn && (
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition"
                          >
                            Xem hồ sơ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!filtered.length && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-sm text-slate-500">
                    Không tìm thấy hồ sơ đặt kho nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Chi tiết xác minh nhận kho</h3>
                <p className="text-xs text-slate-500">Mã đặt chỗ: <span className="font-bold text-blue-600">{selectedBooking.bookingCode}</span></p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600">
                <StaffIcon name="cross" size={20} />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-200 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block">Họ và tên khách hàng:</span>
                  <strong className="text-slate-800 text-sm">{selectedBooking.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Số điện thoại liên hệ:</span>
                  <strong className="text-slate-800 text-sm">{selectedBooking.customerPhone}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 block">Số Căn cước công dân (CCCD):</span>
                  <span className="font-mono font-bold text-slate-900 text-sm bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                    {selectedBooking.customerIdCard}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Kho được gán:</span>
                  <span className="font-bold text-blue-700 text-sm">
                    {selectedBooking.unitCode} ({selectedBooking.unitType} · {selectedBooking.unitArea}m²)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 block">Tiền cọc đảm bảo:</span>
                  <span className="font-semibold text-emerald-700">{formatCurrency(selectedBooking.depositAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tình trạng thanh toán:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedBooking.paymentStatus === 'Paid' ? 'Đã hoàn tất thanh toán' : 'Chưa hoàn tất'}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist for staff */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-800 block">Danh mục kiểm tra tại quầy:</label>
              <div className="space-y-2 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  <span>Đã đối chiếu thẻ Căn cước công dân gốc còn hạn sử dụng</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" defaultChecked={selectedBooking.paymentStatus === 'Paid'} className="rounded text-blue-600 focus:ring-blue-500" />
                  <span>Đã kiểm tra biên nhận / trạng thái thanh toán tiền thuê & tiền cọc</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  <span>Khách hàng có mặt trực tiếp hoặc có giấy ủy quyền hợp lệ</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Ghi chú xác thực / Bổ sung</label>
              <textarea
                rows={2}
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="Ghi chú xác thực (ví dụ: đã kiểm tra CCCD gốc, khách hẹn nhận kho ngay...)"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Đóng
              </button>
              {selectedBooking.verificationStatus === 'unverified' && (
                <button
                  type="button"
                  onClick={handleConfirmVerify}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <StaffIcon name="handover" size={14} />
                  Tiến hành bàn giao kho ngay →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
