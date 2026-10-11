import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function OperationsDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-[#0B192C] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Business Operations Portal</h1>
            <p className="text-xs text-orange-400">Quản lý vận hành toàn hệ thống</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Xin chào, <strong>{user?.fullName}</strong></span>
            <button onClick={() => { logout(); navigate('/') }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Chiến lược & Chính sách toàn hệ thống</h2>
            <p className="text-sm text-slate-500 mt-1">Quản lý tất cả cơ sở kho, thiết lập giá thuê, chính sách đặt cọc và báo cáo doanh thu.</p>
          </div>
          <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-200">
            Phạm vi: Toàn quốc
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OpsCard title="Quản lý danh sách Facility" desc="Quản lý toàn bộ các cơ sở kho lưu trữ trong toàn hệ thống Self-Storage." flow="Flow 4, 5" />
          <OpsCard title="Cấu hình chính sách thuê" desc="Thiết lập quy định đặt cọc, gia hạn, hủy đặt chỗ, trả kho và xử lý quá hạn." flow="Flow 4, 6" />
          <OpsCard title="Quản lý Giá & Phí phụ" desc="Thiết lập khung giá thuê, phí phụ, phí quá hạn và chính sách giảm giá/ưu đãi." flow="Flow 4" />
          <OpsCard title="Doanh thu & Hiệu suất" desc="Giám sát doanh thu, tỷ lệ lấp đầy và hiệu suất hoạt động của từng cơ sở." flow="Flow 4" />
          <OpsCard title="Báo cáo hệ thống" desc="Xem và xuất báo cáo tổng hợp theo cơ sở, loại kho, doanh thu và hợp đồng." flow="Flow 4" />
        </div>
      </main>
    </div>
  )
}

function OpsCard({ title, desc, flow }: { title: string; desc: string; flow: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition cursor-pointer group">
      <div className="flex justify-between items-start mb-3">
        <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg">{flow}</span>
      </div>
      <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-orange-600 transition-colors">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}