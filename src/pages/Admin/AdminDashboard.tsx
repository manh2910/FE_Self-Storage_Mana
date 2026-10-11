import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-[#0B192C] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">System Administrator Portal</h1>
            <p className="text-xs text-orange-400">Quản trị hệ thống & Phân quyền</p>
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
            <h2 className="text-xl font-bold text-slate-900">Quản trị tài khoản & Bảo mật</h2>
            <p className="text-sm text-slate-500 mt-1">Quản lý user, gán role cho 5 Actor, cấu hình quyền truy cập và kiểm tra nhật ký hệ thống.</p>
          </div>
          <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200">
            Quyền: Root Admin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard title="Quản lý tài khoản" desc="Tạo mới, khóa hoặc kích hoạt tài khoản người dùng trong toàn hệ thống." />
          <AdminCard title="Gán Role hệ thống" desc="Phân quyền tài khoản cho Storage Customer, Staff, Manager và BOM." />
          <AdminCard title="Phân quyền dữ liệu" desc="Cấu hình quyền truy cập cơ sở kho và dữ liệu theo từng vai trò cụ thể." />
          <AdminCard title="Lịch sử đăng nhập" desc="Theo dõi lịch sử truy cập hệ thống và trạng thái phiên đăng nhập của user." />
          <AdminCard title="Audit Logs" desc="Giám sát chi tiết các thao tác thay đổi dữ liệu (Create, Update, Delete)." />
        </div>
      </main>
    </div>
  )
}

function AdminCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition cursor-pointer group">
      <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-orange-600 transition-colors">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}