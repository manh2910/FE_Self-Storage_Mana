import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_HOME } from '../../routes/roleRoutes'

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const dashboardPath = user ? ROLE_HOME[user.role] : null

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#183B2B] text-slate-200 text-xs py-2 px-6 flex justify-between items-center border-b border-emerald-900/50">
        <span className="hidden sm:inline">✨ Tặng ngay 10% cho hợp đồng thuê kho từ 6 tháng trở lên - Mã: WELCOME10</span>
        <div className="flex items-center gap-4 ml-auto text-[11px]">
          <span className="text-emerald-400 font-medium">Hotline 24/7: (+84) 909-149-563</span>
          <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-md font-bold transition">
            Đăng ký ngay
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#183B2B] flex items-center justify-center text-white font-black text-lg shadow-md group-hover:bg-emerald-700 transition">
              SS
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider block uppercase text-slate-900">SelfStorage</span>
              <span className="text-[10px] text-emerald-700 font-bold tracking-widest uppercase">Rent. Store. Belong.</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <Link to="/" className="text-emerald-700 font-bold">Trang chủ</Link>
            <a href="#types" className="hover:text-emerald-700 transition">Loại kho</a>
            <a href="#facilities" className="hover:text-emerald-700 transition">Cơ sở kho</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition">Cách hoạt động</a>
            <a href="#contact" className="hover:text-emerald-700 transition">Liên hệ</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                  Xin chào, <strong className="text-slate-900">{user.fullName}</strong>
                </span>
                {dashboardPath && (
                  <Link to={dashboardPath} className="px-4 py-2 text-sm font-bold text-emerald-800 bg-emerald-50 rounded-xl transition hover:bg-emerald-100">
                    Vào hệ thống
                  </Link>
                )}
                <button onClick={logout} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-[#183B2B] hover:bg-emerald-800 rounded-xl shadow-md transition">
                  Đặt kho ngay &rarr;
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section chuẩn mẫu DriveEasy */}
      <section className="relative bg-slate-900 text-white py-16 lg:py-24 px-6 overflow-hidden">

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-emerald-400 font-bold text-xs tracking-widest uppercase bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-500/30">
              EXPLORE MORE. WORRY LESS.
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Premium <br />
              <span className="text-emerald-400">Storage Rentals</span> <br />
              for Every Need
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-lg">
              Kho lưu trữ an toàn. Thời gian thuê linh hoạt. Bảo vệ tài sản tuyệt đối. Dù bạn chuyển nhà, cất giữ đồ đạc cá nhân hay mở rộng kho hàng kinh doanh — chúng tôi đều có giải pháp phù hợp.
            </p>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <HeroBadge icon="📦" title="Đa dạng diện tích" desc="5m² - 20m²" />
              <HeroBadge icon="🛡️" title="Bảo hiểm 100%" desc="An toàn tuyệt đối" />
              <HeroBadge icon="📍" title="Nhiều cơ sở" desc="HN & TP.HCM" />
              <HeroBadge icon="🎧" title="Hỗ trợ 24/7" desc="Tận tâm chu đáo" />
            </div>
          </div>

          {/* Right Floating Booking Form (Pill Tabs + Clean Form) */}
          <div className="lg:col-span-6">
            <div className="bg-white text-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-100 max-w-md mx-auto lg:ml-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl">Tra cứu & Đặt kho</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Nhận mã đặt kho giữ chỗ ngay lập tức</p>
                </div>
                <div className="bg-slate-100 p-1 rounded-full flex text-xs font-bold">
                  <button className="px-3 py-1.5 bg-[#183B2B] text-white rounded-full shadow-sm">Kho Khô</button>
                  <button className="px-3 py-1.5 text-slate-600 hover:text-slate-900">Kho Lạnh</button>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Chọn Cơ sở kho</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-600">
                    <option>Kho Tự Quản Cầu Giấy (Hà Nội)</option>
                    <option>Kho Tự Quản Tân Thuận (Q.7, TP.HCM)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Ngày bắt đầu</label>
                    <input type="date" defaultValue="2026-11-01" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Thời gian thuê</label>
                    <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none">
                      <option>1 Tháng</option>
                      <option>3 Tháng</option>
                      <option>6 Tháng (-5%)</option>
                      <option>12 Tháng (-10%)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Loại kho / Kích thước</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-600">
                    <option>Kho Tiêu Chuẩn 5m² (800.000đ/tháng)</option>
                    <option>Kho Tiêu Chuẩn 10m² (1.400.000đ/tháng)</option>
                    <option>Kho Tiêu Chuẩn 20m² (2.500.000đ/tháng)</option>
                    <option>Kho Lạnh Bảo Quản 5m² (1.500.000đ/tháng)</option>
                  </select>
                </div>

                <Link
                  to="/register"
                  className="w-full py-4 bg-[#183B2B] hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg transition block text-center uppercase text-xs tracking-wider pt-4"
                >
                  Tìm kiếm & Giữ chỗ ngay &rarr;
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet / Storage Unit Types Section */}
      <section id="types" className="py-20 max-w-7xl mx-auto px-6 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">OUR UNITS</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-1">Các loại kho lưu trữ chuẩn</h2>
          </div>
          <Link to="/register" className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            Xem tất cả loại kho &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <UnitTypeCard
            image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
            title="Kho Nhỏ 5m²"
            desc="Cất giữ vali, thùng đồ cá nhân & tài liệu."
            price="800.000đ/th"
          />
          <UnitTypeCard
            image="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800"
            title="Kho Vừa 10m²"
            desc="Đồ đạc căn hộ 1-2 phòng ngủ, đồ chuyển nhà."
            price="1.400.000đ/th"
          />
          <UnitTypeCard
            image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800"
            title="Kho Lớn 20m²"
            desc="Chứa nội thất gia đình lớn hoặc hàng hóa sỉ."
            price="2.500.000đ/th"
          />
          <UnitTypeCard
            image="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800"
            title="Kho Lạnh 5m²-10m²"
            desc="Bảo quản thực phẩm, mỹ phẩm, đồ đắt tiền."
            price="1.500.000đ/th"
          />
        </div>
      </section>

      {/* How It Works (3 Simple Steps) chuẩn mẫu */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">HOW IT WORKS</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-1">Thuê kho đơn giản trong 3 bước</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <StepCard
              step="1"
              icon="📅"
              title="Đặt kho Online"
              desc="Chọn cơ sở, loại kho phù hợp và nhận mã giữ chỗ trực tuyến tức thì."
            />
            <StepCard
              step="2"
              icon="🔑"
              title="Check-in & Nhận mã PIN"
              desc="Nhân viên cơ sở hướng dẫn nghiệm thu kho và bàn giao mã PIN / thẻ từ cá nhân."
            />
            <StepCard
              step="3"
              icon="📦"
              title="Tự do Cất giữ đồ"
              desc="Ra vào kho tự do 24/7, quản lý hợp đồng và gia hạn trực tiếp trên ứng dụng."
            />
          </div>
        </div>
      </section>

      {/* Footer chuẩn mẫu DriveEasy */}
      <footer id="contact" className="bg-[#0F261C] text-slate-300 py-16 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">SS</div>
              <span className="text-white font-extrabold uppercase tracking-wider">SelfStorage</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your space, our priority. Hệ thống cho thuê và quản lý kho tự quản thông minh, bảo mật hàng đầu Việt Nam.
            </p>
          </div>
          <div>
            <p className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Liên kết nhanh</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-emerald-400 transition">Trang chủ</Link></li>
              <li><a href="#types" className="hover:text-emerald-400 transition">Danh sách loại kho</a></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition">Quy trình 3 bước</a></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition">Đăng nhập Portal</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Loại kho dịch vụ</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Kho tiêu chuẩn 5m²</li>
              <li>Kho tiêu chuẩn 10m²</li>
              <li>Kho tiêu chuẩn 20m²</li>
              <li>Kho lạnh kiểm soát độ ẩm</li>
            </ul>
          </div>
          <div>
            <p className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Liên hệ cơ sở</p>
            <p className="text-xs text-slate-400">12 Duy Tân, Cầu Giấy, Hà Nội</p>
            <p className="text-xs text-slate-400 mt-1">Khu Chế Xuất Tân Thuận, Q.7, TP.HCM</p>
            <p className="text-xs text-emerald-400 font-bold mt-2">Hotline: (+84) 909-149-563</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-emerald-900/60 text-xs text-center text-slate-500">
          © 2026 Self-Storage Facility Rental System. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function HeroBadge({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div>
        <h4 className="font-bold text-white text-xs">{title}</h4>
        <p className="text-[10px] text-slate-400">{desc}</p>
      </div>
    </div>
  )
}

function UnitTypeCard({ image, title, desc, price }: { image: string; title: string; desc: string; price: string }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition group">
      <div className="h-44 overflow-hidden relative bg-slate-100">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <span className="absolute top-3 right-3 bg-[#183B2B] text-white px-3 py-1 rounded-full text-[11px] font-bold">
          {price}
        </span>
      </div>
      <div className="p-5 space-y-1.5">
        <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function StepCard({ step, icon, title, desc }: { step: string; icon: string; title: string; desc: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl relative hover:border-emerald-600 transition">
      <div className="w-10 h-10 rounded-full bg-[#183B2B] text-white font-black flex items-center justify-center text-sm mb-6 shadow-md">
        {step}
      </div>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}
