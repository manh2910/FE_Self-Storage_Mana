import { useState } from 'react'
import { OperationsIcon } from './OperationsIcons'
import {
  formatVND,
  calculateFacilityPerformance,
  type FacilityItem,
} from '../model/operationsDomain'

interface Props {
  facilities: FacilityItem[]
}

export function PerformanceAnalyticsTab({ facilities }: Props) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'year'>('month')
  const [sortField, setSortField] = useState<'occupancy' | 'revenue' | 'growth'>('occupancy')

  const performanceList = calculateFacilityPerformance(facilities)

  const sortedList = [...performanceList].sort((a, b) => {
    if (sortField === 'occupancy') return b.occupancyRate - a.occupancyRate
    if (sortField === 'revenue') return b.currentMonthRevenue - a.currentMonthRevenue
    if (sortField === 'growth') return b.growthRate - a.growthRate
    return 0
  })

  const totalRevenue = facilities.reduce((sum, f) => sum + f.monthlyRevenue, 0)
  const prevRevenue = performanceList.reduce((sum, p) => sum + p.previousMonthRevenue, 0)
  const totalCapacity = facilities.reduce((sum, f) => sum + f.totalUnits, 0)
  const totalOccupied = facilities.reduce((sum, f) => sum + f.occupiedUnits, 0)
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0
  const overallGrowth = prevRevenue > 0 ? +(((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : 0
  const totalArea = facilities.reduce((sum, f) => sum + f.totalArea, 0)
  const overallRevPAM = totalArea > 0 ? Math.round(totalRevenue / totalArea) : 0

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <OperationsIcon name="analytics" className="text-blue-600" size={20} />
            Theo dõi doanh thu, tỷ lệ sử dụng kho & hiệu suất vận hành
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu tổng hợp thời gian thực từ tất cả các cơ sở lưu trữ trên toàn quốc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Kỳ thống kê:</span>
          <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
            <button
              onClick={() => setSelectedTimeframe('month')}
              className={`px-3 py-1.5 rounded-md transition ${selectedTimeframe === 'month' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              Tháng này
            </button>
            <button
              onClick={() => setSelectedTimeframe('quarter')}
              className={`px-3 py-1.5 rounded-md transition ${selectedTimeframe === 'quarter' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              Quý gần nhất
            </button>
            <button
              onClick={() => setSelectedTimeframe('year')}
              className={`px-3 py-1.5 rounded-md transition ${selectedTimeframe === 'year' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              Năm 2026
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Financial & Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng doanh thu kỳ này</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              +{overallGrowth}% MoM
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{formatVND(totalRevenue)}</div>
          <p className="mt-2 text-xs text-slate-500">
            Kỳ trước: <strong>{formatVND(prevRevenue)}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ lệ lấp đầy hệ thống</span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Mục tiêu: 85%
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{overallOccupancy}%</div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${overallOccupancy >= 85 ? 'bg-emerald-500' : 'bg-blue-600'}`}
              style={{ width: `${overallOccupancy}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hiệu suất sàn (RevPAM)</span>
            <span className="text-[11px] text-slate-400">Doanh thu/m²</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{formatVND(overallRevPAM)}</div>
          <p className="mt-2 text-xs text-slate-500">
            Trên tổng diện tích: <strong>{totalArea.toLocaleString()} m²</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quy mô kho đang thuê</span>
            <span className="text-[11px] text-slate-500">Hệ thống</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {totalOccupied} / {totalCapacity}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Còn trống: <strong className="text-emerald-700">{totalCapacity - totalOccupied} kho sẵn sàng</strong>
          </p>
        </div>
      </div>

      {/* Facility Benchmarking Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Bảng so sánh hiệu suất & Xếp hạng vận hành giữa các cơ sở
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đánh giá tỷ lệ lấp đầy kho, tốc độ tăng trưởng doanh thu và hiệu suất sàn RevPAM.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Sắp xếp theo:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
            >
              <option value="occupancy">Tỷ lệ lấp đầy cao nhất</option>
              <option value="revenue">Doanh thu cao nhất</option>
              <option value="growth">Tăng trưởng nhanh nhất</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="px-4 py-3">Xếp hạng</th>
                <th className="px-4 py-3">Tên cơ sở lưu trữ</th>
                <th className="px-4 py-3">Tỷ lệ lấp đầy</th>
                <th className="px-4 py-3">Số kho đang thuê</th>
                <th className="px-4 py-3">Doanh thu tháng này</th>
                <th className="px-4 py-3">Tăng trưởng MoM</th>
                <th className="px-4 py-3">RevPAM (VNĐ/m²)</th>
                <th className="px-4 py-3 text-center">Đánh giá hiệu suất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedList.map((item, index) => (
                <tr key={item.facilityId} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-bold text-slate-400">#{index + 1}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{item.facilityName}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <span className="font-bold text-slate-900 w-9">{item.occupancyRate}%</span>
                      <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.occupancyRate >= 85
                              ? 'bg-emerald-500'
                              : item.occupancyRate >= 70
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.occupancyRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <strong>{item.occupiedUnits}</strong> / {item.totalUnits} kho
                  </td>
                  <td className="px-4 py-3.5 font-bold text-emerald-700">{formatVND(item.currentMonthRevenue)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`font-semibold ${item.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.growthRate >= 0 ? `+${item.growthRate}%` : `${item.growthRate}%`}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-800">{formatVND(item.revPAM)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                        item.rating === 'excellent'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : item.rating === 'good'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {item.rating === 'excellent'
                        ? '★ Xuất sắc (≥85%)'
                        : item.rating === 'good'
                        ? 'Đạt mục tiêu'
                        : 'Cần đẩy mạnh sale'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Structure Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h4 className="font-bold text-slate-900">Cơ cấu doanh thu theo loại kho</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Kho vừa (Medium 10m²)</span>
                <strong>42% (183.5 triệu)</strong>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Kho lớn (Large 20m²)</span>
                <strong>31% (135.5 triệu)</strong>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '31%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Kho nhỏ (Small 5m²)</span>
                <strong>18% (78.6 triệu)</strong>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Kho lạnh kiểm soát nhiệt</span>
                <strong>9% (39.3 triệu)</strong>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-600 rounded-full" style={{ width: '9%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h4 className="font-bold text-slate-900">Chỉ số tài chính trọng yếu</h4>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Giá thuê bình quân/kho:</span>
              <strong className="text-slate-900">1.520.000 VNĐ/tháng</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Thời hạn hợp đồng TB:</span>
              <strong className="text-slate-900">7.8 tháng</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Tỷ lệ gia hạn thành công:</span>
              <strong className="text-emerald-700">91.4%</strong>
            </div>
            <div className="flex justify-between py-1">
              <span>Tỷ lệ nợ quá hạn:</span>
              <strong className="text-amber-700">1.8% (Trong tầm kiểm soát)</strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h4 className="font-bold text-slate-900">Khuyến nghị chiến lược vận hành</h4>
          <ul className="space-y-2 text-slate-600 text-xs">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Cơ sở Quận 1 & Thủ Đức</strong> đạt lấp đầy trên 80%, cân nhắc tăng giá thuê 5% cho đợt hợp đồng mới.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-blue-600 font-bold">ℹ</span>
              <span><strong>Cơ sở Cầu Giấy</strong> đang nâng cấp kho lạnh, dự kiến sẽ tăng 15% doanh thu sau khi hoàn thiện.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-600 font-bold">⚠</span>
              <span>Đẩy mạnh chương trình ưu đãi dài hạn cho nhóm kho nhỏ để tối ưu 100% diện tích sàn trống.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
