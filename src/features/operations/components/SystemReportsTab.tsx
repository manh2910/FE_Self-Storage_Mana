import { useState } from 'react'
import { OperationsIcon } from './OperationsIcons'
import {
  formatVND,
  sampleReportRows,
  type SystemReportRow,
  type FacilityItem,
} from '../model/operationsDomain'

interface Props {
  facilities: FacilityItem[]
}

export function SystemReportsTab({ facilities }: Props) {
  const [filterFacility, setFilterFacility] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterRentalStatus, setFilterRentalStatus] = useState('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [reports] = useState<SystemReportRow[]>(sampleReportRows)

  const filtered = reports.filter((item) => {
    const matchFac = filterFacility === 'all' || item.facilityName === filterFacility
    const matchType = filterType === 'all' || item.unitType === filterType
    const matchRental = filterRentalStatus === 'all' || item.rentalStatus === filterRentalStatus
    const matchPayment = filterPaymentStatus === 'all' || item.paymentStatus === filterPaymentStatus
    const matchSearch =
      item.contractCode.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.unitCode.toLowerCase().includes(search.toLowerCase())
    return matchFac && matchType && matchRental && matchPayment && matchSearch
  })

  const totalFilteredRevenue = filtered.reduce((sum, r) => sum + r.monthlyRent, 0)
  const totalFilteredDeposit = filtered.reduce((sum, r) => sum + r.depositPaid, 0)
  const overdueCount = filtered.filter((r) => r.rentalStatus === 'Overdue' || r.paymentStatus === 'Overdue').length

  const handleExportCSV = () => {
    const headers = [
      'Mã hợp đồng',
      'Cơ sở lưu trữ',
      'Mã phòng kho',
      'Loại kho',
      'Tên khách hàng',
      'Loại khách',
      'Ngày bắt đầu',
      'Ngày kết thúc',
      'Giá thuê tháng (VNĐ)',
      'Tiền cọc (VNĐ)',
      'Trạng thái thuê',
      'Trạng thái thanh toán',
    ]

    const rows = filtered.map((r) => [
      r.contractCode,
      `"${r.facilityName}"`,
      r.unitCode,
      r.unitType,
      `"${r.customerName}"`,
      r.customerType,
      r.startDate,
      r.endDate,
      r.monthlyRent,
      r.depositPaid,
      r.rentalStatus,
      r.paymentStatus,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Bao_Cao_He_Thong_SelfStorage_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <OperationsIcon name="report" className="text-blue-600" size={20} />
            Báo cáo toàn hệ thống theo cơ sở, loại kho & doanh thu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem chi tiết danh sách hợp đồng thuê, tình trạng tiền cọc và xuất báo cáo ra file Excel / CSV hoặc In PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
            title="In hoặc lưu PDF"
          >
            <OperationsIcon name="printer" size={14} />
            In báo cáo
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
            title="Xuất dữ liệu ra file Excel / CSV"
          >
            <OperationsIcon name="download" size={14} />
            Xuất file Excel / CSV
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          <div className="lg:col-span-2 relative">
            <input
              type="search"
              placeholder="Tìm theo mã HĐ, tên khách hàng, mã kho..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 pl-9 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <OperationsIcon name="search" size={13} />
            </div>
          </div>

          <div>
            <select
              value={filterFacility}
              onChange={(e) => setFilterFacility(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
            >
              <option value="all">Tất cả cơ sở ({facilities.length})</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
            >
              <option value="all">Tất cả loại kho</option>
              <option value="Small">Small (5m²)</option>
              <option value="Medium">Medium (10m²)</option>
              <option value="Large">Large (20m²)</option>
              <option value="Cold">Cold Storage</option>
            </select>
          </div>

          <div>
            <select
              value={filterRentalStatus}
              onChange={(e) => setFilterRentalStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
            >
              <option value="all">Tất cả trạng thái thuê</option>
              <option value="Active">Đang thuê (Active)</option>
              <option value="Pending_Handover">Chờ nhận kho</option>
              <option value="Overdue">Quá hạn hợp đồng</option>
              <option value="Returned">Đã trả kho</option>
            </select>
          </div>

          <div>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="Paid">Đã thanh toán</option>
              <option value="Pending">Chờ thanh toán</option>
              <option value="Overdue">Nợ cước / Quá hạn</option>
            </select>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Hiển thị <strong>{filtered.length}</strong> kết quả phù hợp bộ lọc
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>
              Tổng tiền thuê tháng: <strong className="text-slate-900">{formatVND(totalFilteredRevenue)}</strong>
            </span>
            <span>
              Tiền cọc lưu giữ: <strong className="text-slate-900">{formatVND(totalFilteredDeposit)}</strong>
            </span>
            {overdueCount > 0 && (
              <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {overdueCount} hợp đồng quá hạn
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mã hợp đồng</th>
                <th className="px-4 py-3">Cơ sở lưu trữ</th>
                <th className="px-4 py-3">Kho</th>
                <th className="px-4 py-3">Loại kho</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Thời hạn thuê</th>
                <th className="px-4 py-3">Giá thuê tháng</th>
                <th className="px-4 py-3">Tiền cọc</th>
                <th className="px-4 py-3">Trạng thái thuê</th>
                <th className="px-4 py-3">Thanh toán</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-mono font-bold text-blue-700">{r.contractCode}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">{r.facilityName}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">{r.unitCode}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {r.unitType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-900">{r.customerName}</div>
                    <span className="text-[10px] text-slate-400">({r.customerType})</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {r.startDate} ➔ {r.endDate}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{formatVND(r.monthlyRent)}</td>
                  <td className="px-4 py-3.5 text-slate-600">{formatVND(r.depositPaid)}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        r.rentalStatus === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : r.rentalStatus === 'Overdue'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : r.rentalStatus === 'Pending_Handover'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {r.rentalStatus === 'Active'
                        ? 'Đang thuê'
                        : r.rentalStatus === 'Overdue'
                        ? 'Quá hạn'
                        : r.rentalStatus === 'Pending_Handover'
                        ? 'Chờ bàn giao'
                        : 'Đã trả kho'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.paymentStatus === 'Paid'
                          ? 'text-emerald-700 bg-emerald-50'
                          : r.paymentStatus === 'Pending'
                          ? 'text-amber-800 bg-amber-50'
                          : 'text-rose-700 bg-rose-50'
                      }`}
                    >
                      {r.paymentStatus === 'Paid' ? '✓ Đã thanh toán' : r.paymentStatus === 'Pending' ? 'Đang chờ' : 'Nợ cước'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filtered.length && (
          <div className="p-8 text-center text-xs text-slate-500">
            Không tìm thấy báo cáo nào phù hợp với bộ lọc đã chọn.
          </div>
        )}
      </div>
    </div>
  )
}
