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
  const readyBookings = verifications.filter(v => v.verificationStatus === 'verified')

  const [selectedBookingCode, setSelectedBookingCode] = useState<string>(
    activeBookingCode || (readyBookings[0]?.bookingCode || '')
  )

  const selectedBooking = verifications.find(v => v.bookingCode === selectedBookingCode)

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
  const [showToast, setShowToast] = useState(false)

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
      notes: handoverNotes || 'Bàn giao hoàn tất tại cơ sở kho.'
    })

    setShowToast(true)
    setTimeout(() => setShowToast(false), 3500)

    const remaining = readyBookings.filter(b => b.bookingCode !== selectedBookingCode)
    if (remaining.length > 0) {
      setSelectedBookingCode(remaining[0].bookingCode)
    } else {
      setSelectedBookingCode('')
    }
  }

  return (
    <div className="space-y-5">
      {showToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <StaffIcon name="check" size={14} className="text-emerald-600" />
            Đã hoàn tất bàn giao kho thành công. Trạng thái kho đã chuyển sang "Đang có khách" (Occupied).
          </div>
          <button onClick={() => setShowToast(false)} className="text-emerald-500 hover:text-emerald-700">
            <StaffIcon name="cross" size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Handover Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Thủ tục bàn giao kho & Phương thức mở khóa</h3>
              <p className="text-slate-500 mt-0.5">Cấp phát mã PIN hoặc thẻ từ và ký xác nhận nghiệm thu bàn giao</p>
            </div>
            {selectedBooking && (
              <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                Kho {selectedBooking.unitCode}
              </span>
            )}
          </div>

          {/* Select Customer */}
          <div>
            <label className="font-medium text-slate-700 block mb-1">
              Khách hàng chờ nhận kho ({readyBookings.length} khách):
            </label>
            {readyBookings.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500">
                Chưa có khách nào trong danh sách sẵn sàng. Hãy qua tab <strong>Xác minh đặt kho</strong> để duyệt CCCD trước.
              </div>
            ) : (
              <select
                value={selectedBookingCode}
                onChange={(e) => setSelectedBookingCode(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500"
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
            <form onSubmit={handleExecuteHandover} className="space-y-4">
              {/* Customer Info Box */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[11px]">Khách nhận:</span>
                  <strong className="text-slate-900">{selectedBooking.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                  <span className="text-slate-800">{selectedBooking.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Vị trí kho:</span>
                  <span className="font-semibold text-blue-700">Kho {selectedBooking.unitCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">CCCD:</span>
                  <span className="font-mono text-slate-800">{selectedBooking.customerIdCard}</span>
                </div>
              </div>

              {/* Access Method Option */}
              <div className="space-y-2">
                <label className="font-medium text-slate-700 block">Phương thức mở khóa cấp cho khách:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setAccessMethod('pin'); setAccessCode('749201') }}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      accessMethod === 'pin' ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <StaffIcon name="pin" size={14} />
                      Mã PIN số
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Khóa điện tử</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAccessMethod('card'); setAccessCode('CARD-NFC-8821') }}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      accessMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <StaffIcon name="card" size={14} />
                      Thẻ từ RFID
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Quẹt mở cửa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAccessMethod('key'); setAccessCode(`KEY-${selectedBooking.unitCode}-01`) }}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      accessMethod === 'key' ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <StaffIcon name="key" size={14} />
                      Chìa khóa cơ
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Bộ 02 chìa vật lý</span>
                  </button>
                </div>

                {/* Access Code input */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-mono font-bold text-slate-800"
                    />
                  </div>
                  {accessMethod === 'pin' && (
                    <button
                      type="button"
                      onClick={generateRandomPin}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
                    >
                      Sinh mã ngẫu nhiên
                    </button>
                  )}
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5">
                <label className="font-medium text-slate-700 block">Checklist bàn giao:</label>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={checklist.unitCleaned} onChange={() => handleCheckboxChange('unitCleaned')} className="rounded text-blue-600" />
                    <span>Kho sạch sẽ, đèn chiếu sáng hoạt động tốt</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={checklist.doorLockChecked} onChange={() => handleCheckboxChange('doorLockChecked')} className="rounded text-blue-600" />
                    <span>Đã thử đóng mở cửa và thử khóa cùng khách</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={checklist.accessDeviceHanded} onChange={() => handleCheckboxChange('accessDeviceHanded')} className="rounded text-blue-600" />
                    <span>Đã cấp phương tiện mở kho và khách đã thử mở thành công</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={checklist.safetyRulesExplained} onChange={() => handleCheckboxChange('safetyRulesExplained')} className="rounded text-blue-600" />
                    <span>Đã hướng dẫn quy định PCCC và giờ giấc ra vào</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={checklist.contractSigned} onChange={() => handleCheckboxChange('contractSigned')} className="rounded text-blue-600" />
                    <span>Khách hàng đã ký biên bản bàn giao lưu giữ tại cơ sở</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-medium text-slate-700 block mb-1">Ghi chú bàn giao:</label>
                <input
                  type="text"
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  placeholder="Ghi chú thêm nếu có..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5"
                />
              </div>

              {/* Confirmation */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
                  <input
                    type="checkbox"
                    checked={customerConfirmed}
                    onChange={(e) => setCustomerConfirmed(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Xác nhận: Khách hàng đã kiểm tra thực tế và nhận bàn giao</span>
                </label>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!customerConfirmed}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-semibold transition"
                >
                  Hoàn tất bàn giao kho
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: History */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 text-xs">
          <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Biên bản bàn giao gần đây</h3>
            <span className="text-slate-400">{handovers.length} hồ sơ</span>
          </div>

          <div className="space-y-2.5">
            {handovers.map((item) => (
              <div key={item.id} className="p-3 rounded-lg border border-slate-200/80 bg-slate-50 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Kho {item.unitCode}</span>
                  <span className="text-[11px] text-slate-400">{item.handoverTime}</span>
                </div>
                <div className="text-slate-600 font-medium">{item.customerName}</div>
                <div className="text-[11px] text-slate-500">
                  Mã truy cập: <span className="font-mono font-semibold text-slate-800">{item.accessCode}</span> ({item.accessMethod.toUpperCase()})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
