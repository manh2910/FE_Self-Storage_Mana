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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-800">
      {/* Top Announcement Bar */}
      <div className="bg-[#183B2B] text-slate-200 text-xs py-2 px-6 flex justify-between items-center border-b border-emerald-900/50">
        <span className="hidden sm:inline">Cổng thông tin Dịch vụ Khách hàng - SelfStorage Portal</span>
        <div className="flex items-center gap-4 ml-auto text-[11px]">
          <span className="text-emerald-400 font-medium">Hotline 24/7: (+84) 909-149-563</span>
        </div>
      </div>

      {/* Main Customer Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo thương hiệu */}
          <Link to="/customer" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#183B2B] flex items-center justify-center text-white font-black text-lg shadow-md group-hover:bg-emerald-700 transition">
              SS
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider block uppercase text-slate-900">SelfStorage</span>
              <span className="text-[10px] text-emerald-700 font-bold tracking-widest uppercase">Customer Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors py-2 border-b-2 ${
                    isActive
                      ? 'text-emerald-700 border-emerald-700 font-bold'
                      : 'text-slate-600 border-transparent hover:text-emerald-700'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout Button */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
              <p className="text-[10px] text-emerald-700 font-bold uppercase">Khách hàng</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-sm shadow-sm">
              {user?.fullName?.charAt(0) || 'C'}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#183B2B] hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition uppercase tracking-wider"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex md:hidden overflow-x-auto gap-6 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`whitespace-nowrap font-semibold ${
              location.pathname === item.path ? 'text-emerald-700 font-bold' : 'text-slate-600'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
        <Outlet />
      </main>

      {/* Footer đồng bộ DriveEasy */}
      <footer className="bg-[#0F261C] text-slate-400 py-10 text-xs border-t border-emerald-900/60 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Self-Storage Facility Rental System. All rights reserved.</p>
          <p>Hotline Hỗ Trợ Khách Hàng: (+84) 909-149-563 | Email: support@selfstorage.local</p>
        </div>
      </footer>
    </div>
  )
}