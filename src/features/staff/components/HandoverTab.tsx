import { useState } from 'react'
import { StaffIcon } from './StaffIcons'
import type { BookingVerification, HandoverRecord } from '../model/staffDomain'

interface Props {
  verifications: BookingVerification[]
  handovers: HandoverRecord[]
  activeBookingCode?: string
  onCompleteHandover: (record: Omit<HandoverRecord, 'id' | 'handoverTime'>) => void
}

export function HandoverTab({ verifications, handovers, activeBookingCode, onCompleteHandover }: Props) {
  // Available verified bookings that are ready for handover
  const readyBookings = verifications.filter(v => v.verificationStatus === 'verified')

  const [selectedBookingCode, setSelectedBookingCode] = useState<string>(
    activeBookingCode || (readyBookings[0]?.bookingCode || '')
  )

  const selectedBooking = verifications.find(v => v.bookingCode === selectedBookingCode)

  // Handover form state
  const [accessMethod, setAccessMethod] = useState<'pin' | 'card' | 'key'>('pin')
  const [accessCode, setAccessCode] = useState<string>('749201')
  const [checklist, setChecklist] = useState({
    unitCleaned: true,
    doorLockChecked: true,
    accessDeviceHanded: true,
    safetyRulesExplained: true,
    contractSigned: true
  })
  const [customerConfirmed, setCustomerConfirmed] = useState(true)
  const [handoverNotes, setHandoverNotes] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const generateRandomPin = () => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString()
    setAccessCode(pin)
  }

  const handleCheckboxChange = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleExecuteHandover = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBooking) return

    onCompleteHandover({
      bookingCode: selectedBooking.bookingCode,
      unitCode: selectedBooking.unitCode,
      customerName: selectedBooking.customerName,
      customerPhone: selectedBooking.customerPhone,
      accessMethod,
      accessCode,
      checklist,
      staffName: 'Lê Văn Hùng',
      customerConfirmed,
      notes: handoverNotes || 'Bàn giao hoàn tất tại cơ sở kho. Khách hàng đã nhận và thử mã truy cập thành công.'
    })

    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 4000)

    // Switch to next ready booking if any
    const remaining = readyBookings.filter(b => b.bookingCode !== selectedBookingCode)
    if (remaining.length > 0) {
      setSelectedBookingCode(remaining[0].bookingCode)
    } else {
      setSelectedBookingCode('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <StaffIcon name="handover" className="text-emerald-600" />
            Hỗ trợ nhận kho & Bàn giao phương thức truy cập
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình bàn giao kho lưu trữ, kiểm tra ổ khóa, cấp mã PIN số / thẻ từ NFC / chìa khóa và xác nhận khách hàng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            {readyBookings.length} khách đang sẵn sàng bàn giao
          </span>
        </div>
      </div>

      {showSuccessToast && (
        <div className="bg-emerald-500 text-white p-4 rounded-xl flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2 font-bold text-sm">
            <StaffIcon name="check" size={18} />
            Đã hoàn tất bàn giao kho thành công! Trạng thái kho đã tự động cập nhật sang Occupied.
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="text-white/80 hover:text-white">
            <StaffIcon name="cross" size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Handover Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
              Thực hiện thủ tục bàn giao kho
            </h3>
            {selectedBooking && (
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Kho {selectedBooking.unitCode} ({selectedBooking.unitType})
              </span>
            )}
          </div>

          {/* Select Customer */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Chọn khách hàng đã xác minh đang chờ nhận kho:
            </label>
            {readyBookings.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Hiện không có khách nào đang chờ bàn giao. Hãy chuyển qua tab <span className="font-bold text-blue-600">Xác minh đặt kho</span> để xác thực khách mới đến.
              </div>
            ) : (
              <select
                value={selectedBookingCode}
                onChange={(e) => setSelectedBookingCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-500 transition"
              >
                {readyBookings.map((b) => (
                  <option key={b.bookingCode} value={b.bookingCode}>
                    [{b.bookingCode}] {b.customerName} — Kho {b.unitCode} ({b.unitArea}m²) — SĐT: {b.customerPhone}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedBooking && (
            <form onSubmit={handleExecuteHandover} className="space-y-6">
              {/* Selected info card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Khách nhận kho:</span>
                  <strong className="text-slate-900">{selectedBooking.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Số điện thoại:</span>
                  <span className="text-slate-700 font-semibold">{selectedBooking.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Vị trí kho:</span>
                  <span className="font-bold text-blue-700">Kho {selectedBooking.unitCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">CCCD đối chiếu:</span>
                  <span className="font-mono text-slate-700">{selectedBooking.customerIdCard}</span>
                </div>
              </div>

              {/* Step: Access Device / Method */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Phương thức truy cập & Thiết bị cấp phát:</span>
                  <span className="text-[11px] font-normal text-slate-400">Chọn 1 trong 3 hình thức</span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => { setAccessMethod('pin'); setAccessCode('749201') }}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      accessMethod === 'pin' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <StaffIcon name="pin" size={16} className={accessMethod === 'pin' ? 'text-blue-600' : 'text-slate-400'} />
                      Mã PIN điện tử
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Cấp mã số mở khóa cửa tự động</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAccessMethod('card'); setAccessCode('CARD-NFC-8821') }}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      accessMethod === 'card' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <StaffIcon name="card" size={16} className={accessMethod === 'card' ? 'text-blue-600' : 'text-slate-400'} />
                      Thẻ từ NFC
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Quẹt thẻ từ mở cửa tầng & kho</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAccessMethod('key'); setAccessCode(`KEY-${selectedBooking.unitCode}-01`) }}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      accessMethod === 'key' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <StaffIcon name="key" size={16} className={accessMethod === 'key' ? 'text-blue-600' : 'text-slate-400'} />
                      Chìa khóa cơ
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Bàn giao bộ 02 chìa khóa vật lý</p>
                  </button>
                </div>

                {/* Input for Access Code */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      {accessMethod === 'pin' ? 'Mã số PIN cấp cho khách (6 số):' : accessMethod === 'card' ? 'Mã số thẻ từ RFID được gán:' : 'Mã số chìa khóa bàn giao:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-base font-extrabold text-blue-700 tracking-wider w-full max-w-xs"
                    />
                  </div>
                  {accessMethod === 'pin' && (
                    <button
                      type="button"
                      onClick={generateRandomPin}
                      className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <StaffIcon name="refresh" size={13} />
                      Tạo mã ngẫu nhiên
                    </button>
                  )}
                </div>
              </div>

              {/* Step: Inspection & Safety Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Checklist kiểm tra thực tế & thủ tục trước khi giao chìa:
                </label>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.unitCleaned}
                      onChange={() => handleCheckboxChange('unitCleaned')}
                      className="rounded text-blue-600"
                    />
                    <span>Kho lưu trữ đã được dọn sạch sẽ, sàn khô ráo, đèn chiếu sáng hoạt động tốt</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.doorLockChecked}
                      onChange={() => handleCheckboxChange('doorLockChecked')}
                      className="rounded text-blue-600"
                    />
                    <span>Đã thử đóng mở cửa cuốn / cửa sắt và kiểm tra ổ khóa tại chỗ cùng khách hàng</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.accessDeviceHanded}
                      onChange={() => handleCheckboxChange('accessDeviceHanded')}
                      className="rounded text-blue-600"
                    />
                    <span>Đã bàn giao phương tiện truy cập và khách đã thao tác thử thành công</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.safetyRulesExplained}
                      onChange={() => handleCheckboxChange('safetyRulesExplained')}
                      className="rounded text-blue-600"
                    />
                    <span>Đã phổ biến quy định PCCC, cấm lưu trữ chất nổ, độc hại, động vật và giờ hoạt động 24/7</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.contractSigned}
                      onChange={() => handleCheckboxChange('contractSigned')}
                      className="rounded text-blue-600"
                    />
                    <span>Khách hàng đã ký vào hợp đồng và biên bản bàn giao lưu giữ tại cơ sở</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ghi chú bàn giao bổ sung:</label>
                <textarea
                  rows={2}
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  placeholder="Ghi chú thêm về chìa khóa, hiện trạng bàn giao hoặc yêu cầu đặc biệt của khách..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              {/* Customer Confirmation checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800">
                  <input
                    type="checkbox"
                    checked={customerConfirmed}
                    onChange={(e) => setCustomerConfirmed(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Xác nhận: Khách hàng {selectedBooking.customerName} đã nhận bàn giao kho và đồng ý nhận chìa/mã PIN</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!customerConfirmed}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition shadow-md flex items-center gap-2"
                >
                  <StaffIcon name="check" size={16} />
                  Hoàn tất bàn giao & Kích hoạt kho
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Handover History & Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <StaffIcon name="document" className="text-blue-600" size={17} />
              Lịch sử bàn giao gần đây
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">{handovers.length} biên bản</span>
          </div>

          <div className="space-y-3">
            {handovers.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-blue-700">Kho {item.unitCode}</span>
                    <span className="text-slate-500 block">{item.customerName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Đã bàn giao
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                  <span>
                    Truy cập: <strong className="font-mono text-slate-800">{item.accessCode}</strong> ({item.accessMethod.toUpperCase()})
                  </span>
                  <span>{item.handoverTime}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Nhân viên thực hiện: {item.staffName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
