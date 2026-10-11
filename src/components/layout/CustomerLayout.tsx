import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { name: 'Tổng quan', path: '/customer' },
    { name: 'Tìm & Đặt kho', path: '/customer/browse' },
    { name: 'Kho của tôi', path: '/customer/units' },
    { name: 'Lịch sử thanh toán', path: '/customer/payments' },
    { name: 'Hỗ trợ sự cố', path: '/customer/support' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navbar */}
      <header className="bg-[#0B192C] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo thương hiệu */}
          <Link to="/customer" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-lg shadow group-hover:bg-orange-600 group-hover:scale-105 transition-all duration-200">
              SS
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider block text-white uppercase group-hover:text-orange-400 transition-colors">SelfStorage</span>
              <span className="text-[10px] text-orange-400 font-semibold tracking-widest uppercase">Self-Facility Rental</span>
            </div>
          </Link>

          {/* Navigation Links với hiệu ứng hover */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-all duration-200 py-2 px-1 border-b-2 ${
                    isActive
                      ? 'border-orange-500 text-orange-400 font-semibold'
                      : 'border-transparent text-slate-200 hover:text-orange-400 hover:border-orange-400'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile & Logout với hover */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <p className="text-xs text-slate-400">Hỗ trợ 24/7</p>
              <p className="text-sm font-bold text-orange-400">(+84) 909-149-563</p>
            </div>

            <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user?.fullName}</p>
                <p className="text-xs text-slate-400">Khách hàng</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-orange-400 font-bold flex items-center justify-center shadow-inner">
                {user?.fullName?.charAt(0) || 'C'}
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-95"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex md:hidden overflow-x-auto gap-4 border-b border-slate-800 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`whitespace-nowrap py-1 transition-colors ${location.pathname === item.path ? 'text-orange-400 font-bold border-b-2 border-orange-400' : 'text-slate-300 hover:text-orange-300'}`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <Outlet />
      </main>

      {/* Footer với hiệu ứng hover link */}
      <footer className="bg-[#0B192C] text-slate-400 py-10 mt-auto border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                SS
              </div>
              <span className="text-white font-bold uppercase tracking-wider">SelfStorage System</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống quản lý và cho thuê kho lưu trữ tự phục vụ an toàn, bảo mật và linh hoạt hàng đầu.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3 uppercase text-xs tracking-wider">Liên kết nhanh</p>
            <ul className="space-y-2 text-xs">
              <li><Link to="/customer/browse" className="hover:text-orange-400 hover:translate-x-1 transition-all inline-block">Tìm kiếm & Đặt kho</Link></li>
              <li><Link to="/customer/units" className="hover:text-orange-400 hover:translate-x-1 transition-all inline-block">Quản lý kho đang thuê</Link></li>
              <li><Link to="/customer/payments" className="hover:text-orange-400 hover:translate-x-1 transition-all inline-block">Lịch sử thanh toán</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3 uppercase text-xs tracking-wider">Cơ sở nổi bật</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-slate-200 transition-colors">Chi nhánh Quận 1, TP.HCM</li>
              <li className="hover:text-slate-200 transition-colors">Chi nhánh Thủ Đức, TP.HCM</li>
              <li className="hover:text-slate-200 transition-colors">Chi nhánh Bình Thạnh, TP.HCM</li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3 uppercase text-xs tracking-wider">Liên hệ hỗ trợ</p>
            <p className="text-xs text-slate-300">Hotline: 0909149563 (Mạnh)</p>
            <p className="text-xs text-slate-300 mt-1">Email: support@selfstorage.local</p>
            <p className="text-xs text-slate-400 mt-3">Thứ Hai - Chủ Nhật: 7:00 AM - 7:00 PM</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-xs text-center text-slate-500">
          © 2026 Self-Storage Facility Rental and Management System. All rights reserved.
        </div>
      </footer>
    </div>
  )
}