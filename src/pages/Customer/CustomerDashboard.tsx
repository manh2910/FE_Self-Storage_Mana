import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function CustomerDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-10">
      {/* Hero Banner với phong cách DriveEasy */}
      <div className="relative rounded-3xl overflow-hidden bg-[#183B2B] text-white py-14 px-8 md:px-14 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb1871279?auto=format&fit=crop&q=80&w=1920"
            alt="Customer Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="text-emerald-400 font-bold text-xs tracking-widest uppercase bg-emerald-900/60 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Customer Portal
          </span>
          <h1 className="text-3xl md:text-5xl font-black">Xin chào, {user?.fullName}!</h1>
          <p className="text-slate-200 text-sm leading-relaxed">
            Quản lý hợp đồng thuê kho, theo dõi trạng thái unit và lịch sử thanh toán tiện lợi.
          </p>
          <div className="pt-2">
            <Link
              to="/customer/browse"
              className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition text-xs uppercase tracking-wider"
            >
              + Đặt kho mới ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Thống kê KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Kho đang thuê" value="1" subtitle="Unit hoạt động" link="/customer/units" />
        <StatCard title="Đơn đặt chỗ" value="0" subtitle="Chờ check-in" link="/customer/browse" />
        <StatCard title="Hóa đơn chờ TT" value="0" subtitle="Cần thanh toán" link="/customer/payments" />
        <StatCard title="Yêu cầu hỗ trợ" value="1" subtitle="Ticket đang mở" link="/customer/support" />
      </div>

      {/* Quản lý nghiệp vụ */}
      <div className="space-y-6 pb-10">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">DASHBOARD SUITE</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">Danh mục quản lý chính</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            to="/customer/browse"
            title="Tìm kiếm & Đặt kho"
            description="Tra cứu cơ sở kho, chọn loại kho tiêu chuẩn hoặc kho lạnh và nhận mã đặt chỗ."
            flow="Flow 1"
          />
          <ActionCard
            to="/customer/units"
            title="Quản lý kho đang thuê"
            description="Xem thông tin unit, mã PIN cửa tự động và thời hạn hợp đồng đang hoạt động."
            flow="Flow 3"
          />
          <ActionCard
            to="/customer/payments"
            title="Thanh toán trực tuyến"
            description="Thanh toán tiền cọc, phí thuê định kỳ hàng tháng và xem lịch sử giao dịch."
            flow="Flow 4"
          />
          <ActionCard
            to="/customer/support"
            title="Gửi yêu cầu hỗ trợ"
            description="Tạo sự cố kỹ thuật về mã truy cập, ổ khóa hoặc kiểm tra nhiệt độ kho."
            flow="Flow 7"
          />
          <ActionCard
            to="/customer/units"
            title="Gia hạn & Trả kho"
            description="Yêu cầu gia hạn thêm thời gian thuê hoặc đăng ký thủ tục trả kho khi hết hạn."
            flow="Flow 6"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, link }: { title: string; value: string; subtitle: string; link: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl font-black text-slate-900">{value}</span>
          <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
        <Link to={link} className="text-xs font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wide">
          Quản lý &rarr;
        </Link>
      </div>
    </div>
  )
}

function ActionCard({ to, title, description, flow }: { to: string; title: string; description: string; flow: string }) {
  return (
    <Link
      to={to}
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-700 transition block group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg group-hover:bg-[#183B2B] group-hover:text-white transition-colors">
          {flow}
        </span>
      </div>
      <h4 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">
        {title}
      </h4>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </Link>
  )
}