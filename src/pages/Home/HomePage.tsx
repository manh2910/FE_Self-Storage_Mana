import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_HOME } from '../../routes/roleRoutes'

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const dashboardPath = user ? ROLE_HOME[user.role] : null

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-[#0B192C] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-lg shadow group-hover:bg-orange-600 transition">
              SS
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider block uppercase text-white">SelfStorage</span>
              <span className="text-[10px] text-orange-400 font-semibold tracking-widest uppercase">Self-Facility Rental</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-slate-300 hover:text-orange-400 transition">Tính năng</a>
            <a href="#units" className="text-slate-300 hover:text-orange-400 transition">Các loại kho</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-orange-400 transition">Cách hoạt động</a>
            <a href="#contact" className="text-slate-300 hover:text-orange-400 transition">Liên hệ</a>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-slate-300 hidden sm:inline">
                  Xin chào, <strong className="text-white">{user.fullName}</strong>
                </span>
                {dashboardPath && (
                  <Link
                    to={dashboardPath}
                    className="px-4 py-2 text-sm font-semibold text-orange-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    Vào hệ thống
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
                >
                  Đăng ký ngay
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white py-20 md:py-28 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-orange-400 font-semibold text-xs tracking-widest uppercase bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
            Self-Storage Management System
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Thuê kho tự phục vụ <span className="text-orange-400">an toàn & linh hoạt</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Hệ thống quản lý không gian lưu trữ hiện đại. Đặt chỗ trực tuyến, nhận kho nhanh chóng với mã truy cập thông minh, quản lý hợp đồng và thanh toán mọi lúc.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
            >
              Bắt đầu thuê kho
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Core Features</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">Tính năng toàn diện cho mọi Actor</h2>
          <p className="text-slate-500 text-sm mt-2">Hỗ trợ đầy đủ các quy trình từ khách hàng, nhân viên đến quản trị viên.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Đặt chỗ & Thanh toán online</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Khách hàng dễ dàng lựa chọn cơ sở, loại kho (tiêu chuẩn hoặc kho lạnh), đặt cọc và thanh toán phí thuê linh hoạt.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">🔑</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Check-in & Bàn giao kho</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Nhân viên cơ sở kiểm tra lịch hẹn, bàn giao unit, cấp mã PIN truy cập hoặc thẻ khóa an toàn cho khách.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Quản lý & Báo cáo vận hành</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Quản lý cơ sở và vận hành theo dõi doanh thu, tỷ lệ sử dụng kho, xử lý gia hạn và sự cố tự động.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0B192C] text-slate-400 py-10 mt-auto border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">© 2026 Self-Storage Facility Rental System. All rights reserved.</p>
          <p className="text-xs">Hotline hỗ trợ: 0909149563 (Mạnh) | Email: support@selfstorage.local</p>
        </div>
      </footer>
    </div>
  )
}