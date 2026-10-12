import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function StaffDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-[#0B192C] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Facility Staff Portal</h1>
            <p className="text-xs text-orange-400">Nhân viên trực cơ sở kho</p>
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
            <h2 className="text-xl font-bold text-slate-900">Nhiệm vụ trực ca hôm nay</h2>
            <p className="text-sm text-slate-500 mt-1">Xử lý check-in khách hàng, bàn giao mã truy cập và kiểm tra tình trạng trả kho.</p>
          </div>
          <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg border border-green-200">
            Ca trực: Hoạt động
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StaffCard title="Check-in & Bàn giao kho" desc="Xác nhận reservation, cấp mã PIN, thẻ khóa cho khách đến nhận unit." flow="Flow 2" />
          <StaffCard title="Danh sách khách hôm nay" desc="Theo dõi danh sách khách cần nhận kho, trả kho hoặc cần hỗ trợ trong ngày." flow="Flow 2, 7" />
          <StaffCard title="Cập nhật trạng thái kho" desc="Đổi trạng thái unit sang Occupied, Maintenance, Cleaning sau khi kiểm tra." flow="Flow 2, 5" />
          <StaffCard title="Xử lý sự cố tại chỗ" desc="Hỗ trợ vấn đề mất khóa, lỗi mã truy cập, hư hỏng thiết bị hoặc ticket phát sinh." flow="Flow 7" />
          <StaffCard title="Kiểm tra khi trả kho" desc="Ghi nhận tình trạng thiết bị, đánh giá mức độ hư hại và tính phí phạt nếu có." flow="Flow 6" />
        </div>
      </main>
    </div>
  )
}

function StaffCard({ title, desc, flow }: { title: string; desc: string; flow: string }) {
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