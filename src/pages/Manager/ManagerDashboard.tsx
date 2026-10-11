import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ManagerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-[#0B192C] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Facility Manager Portal</h1>
            <p className="text-xs text-orange-400">Quản lý chi nhánh / cơ sở kho</p>
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
            <h2 className="text-xl font-bold text-slate-900">Quản trị cơ sở được phân công</h2>
            <p className="text-sm text-slate-500 mt-1">Quản lý toàn bộ đơn vị kho, phân công nhân viên và giám sát doanh thu cơ sở.</p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-200">
            Chi nhánh: TP.HCM Main
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ManagerCard title="Quản lý đơn vị kho" desc="Cấu hình loại kho, kích thước, vị trí, giá thuê và trạng thái từng unit." flow="Flow 5" />
          <ManagerCard title="Gán kho cho khách" desc="Thực hiện gán storage unit cụ thể cho khách dựa trên loại và thời gian đặt." flow="Flow 1, 2" />
          <ManagerCard title="Hợp đồng & Thanh toán" desc="Theo dõi danh sách khách hàng hiện tại, thời hạn hợp đồng và trạng thái thanh toán." flow="Flow 3, 4" />
          <ManagerCard title="Bàn giao, Trả & Gia hạn" desc="Quản lý toàn diện quy trình bàn giao, trả kho, gia hạn và xử lý quá hạn." flow="Flow 2, 6" />
          <ManagerCard title="Phân công nhân viên" desc="Phân công nhân viên trực ca hỗ trợ bàn giao, kiểm tra và xử lý sự cố." flow="Flow 5, 7" />
          <ManagerCard title="Báo cáo cơ sở" desc="Xem thống kê tỷ lệ sử dụng kho, doanh thu và các trường hợp quá hạn." flow="Flow 4, 5" />
        </div>
      </main>
    </div>
  )
}

function ManagerCard({ title, desc, flow }: { title: string; desc: string; flow: string }) {
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