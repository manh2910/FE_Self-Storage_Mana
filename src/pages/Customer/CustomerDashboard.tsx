import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function CustomerDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-12">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white p-8 md:p-14 shadow-xl">
        <div className="max-w-2xl relative z-10">
          <span className="text-orange-400 font-semibold text-xs tracking-widest uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/25">
            Self-Storage Made Simple
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-4 leading-tight">
            Không gian lưu trữ cho những gì <span className="text-orange-400">quan trọng nhất.</span>
          </h1>
          <p className="text-slate-300 mt-4 text-sm md:text-base leading-relaxed">
            Xin chào <strong className="text-white">{user?.fullName}</strong>! Khám phá giải pháp thuê kho tự phục vụ sạch sẽ, an toàn và mức giá cạnh tranh nhất ngay hôm nay.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-8 bg-white p-3 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3 text-slate-800">
            <div className="flex-1 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Cơ sở kho</label>
              <select className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none mt-0.5 cursor-pointer">
                <option>Tất cả cơ sở tại TP.HCM</option>
                <option>Cơ sở Quận 1 - TP.HCM</option>
                <option>Cơ sở Thủ Đức - TP.HCM</option>
              </select>
            </div>
            <div className="flex-1 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Kích thước kho</label>
              <select className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none mt-0.5 cursor-pointer">
                <option>Mọi kích thước</option>
                <option>Kho nhỏ (5m²)</option>
                <option>Kho trung bình (10m²)</option>
                <option>Kho lớn (20m²)</option>
                <option>Kho lạnh bảo quản</option>
              </select>
            </div>
            <Link
              to="/customer/browse"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center text-sm uppercase tracking-wide"
            >
              Tìm kho ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Account Overview Stats với hiệu ứng hover nổi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Kho đang thuê" value="0" subtitle="Đơn vị hoạt động" link="/customer/units" btnText="Quản lý" />
        <StatCard title="Đơn đặt chỗ" value="0" subtitle="Chờ check-in / cọc" link="/customer/browse" btnText="Xem chỗ" />
        <StatCard title="Hóa đơn chờ" value="0" subtitle="Cần thanh toán" link="/customer/payments" btnText="Thanh toán" />
        <StatCard title="Yêu cầu hỗ trợ" value="0" subtitle="Ticket đang mở" link="/customer/support" btnText="Tạo ticket" />
      </div>

      {/* Popular Unit Sizes Section với hiệu ứng hover card */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Storage Solutions For Every Need</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Các loại kích thước kho phổ biến</h2>
          <p className="text-slate-500 text-sm mt-1">Lựa chọn không gian phù hợp với nhu cầu lưu trữ thực tế của bạn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <UnitSizeCard
            size="5m² (Tiêu chuẩn nhỏ)"
            desc="Phù hợp lưu trữ vali, thùng hàng cá nhân hoặc đồ đạc ít."
            price="800.000đ"
            flow="Flow 1"
          />
          <UnitSizeCard
            size="10m² (Tiêu chuẩn trung bình)"
            desc="Lưu trữ đồ đạc chuyển nhà phòng trọ hoặc hàng hóa kinh doanh nhỏ."
            price="1.400.000đ"
            flow="Flow 1"
          />
          <UnitSizeCard
            size="20m² (Kho lớn)"
            desc="Không gian rộng chứa nội thất gia đình lớn hoặc kho hàng doanh nghiệp."
            price="2.500.000đ"
            flow="Flow 1"
          />
          <UnitSizeCard
            size="5m² (Kho lạnh chuyên dụng)"
            desc="Bảo quản hàng hóa yêu cầu nhiệt độ ổn định, thực phẩm, dược phẩm."
            price="1.500.000đ"
            flow="Flow 1"
          />
        </div>
      </div>

      {/* Trust & Features Bar */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureItem
          title="Bảo mật 24/7"
          desc="Hệ thống camera giám sát hiện đại và bảo vệ túc trực an toàn tuyệt đối."
        />
        <FeatureItem
          title="Truy cập dễ dàng"
          desc="Giờ giấc linh hoạt, ra vào tự phục vụ bằng mã PIN hoặc thẻ từ cá nhân."
        />
        <FeatureItem
          title="Nhận kho nhanh"
          desc="Thủ tục nhanh chóng, hỗ trợ xe đẩy và thiết bị nâng hạ miễn phí tại cơ sở."
        />
        <FeatureItem
          title="Hỗ trợ tận tâm"
          desc="Đội ngũ nhân viên cơ sở luôn sẵn sàng hỗ trợ bạn trong mọi tình huống."
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, link, btnText }: { title: string; value: string; subtitle: string; link: string; btnText: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl font-extrabold text-slate-900">{value}</span>
          <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-400">Trạng thái</span>
        <Link to={link} className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wide hover:translate-x-0.5 transition-transform">
          {btnText} &rarr;
        </Link>
      </div>
    </div>
  )
}

function UnitSizeCard({ size, desc, price, flow }: { size: string; desc: string; price: string; flow: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-orange-400 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200">
            {flow}
          </span>
          <span className="text-xs text-slate-400 font-medium">Khả dụng</span>
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-orange-600 transition-colors">{size}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">{desc}</p>
      </div>
      <div>
        <div className="mb-4">
          <span className="text-xs text-slate-400 block">Giá từ</span>
          <span className="text-xl font-extrabold text-slate-900">{price}</span>
          <span className="text-xs text-slate-500">/tháng</span>
        </div>
        <Link
          to="/customer/browse"
          className="w-full block text-center py-2.5 bg-slate-900 hover:bg-orange-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-sm active:scale-95"
        >
          Xem chi tiết & Đặt
        </Link>
      </div>
    </div>
  )
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-2 group">
      <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center mb-3 group-hover:bg-orange-500 group-hover:text-white transition-all duration-200">
        ✓
      </div>
      <h4 className="font-bold text-white text-base group-hover:text-orange-400 transition-colors">{title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
    </div>
  )
}