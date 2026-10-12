import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../api/authApi'

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await authApi.register(form)
      setSuccess('Đăng ký tài khoản thành công! Đang chuyển hướng...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã tồn tại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-900 font-sans px-4 py-12 overflow-hidden">
      {/* Background Image với text alt màu trắng dễ nhận biết khi chưa load ảnh */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src=""
          alt="[Chưa có hình ảnh nền đăng ký - Hãy thay link ảnh vào đây]"
          className="w-full h-full object-cover text-white font-semibold text-xs p-4"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
              SS
            </div>
            <span className="text-2xl font-black text-white tracking-wider uppercase">SelfStorage</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100 text-slate-800">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900">Đăng ký tài khoản</h1>
            <p className="text-xs text-slate-500 mt-1">Trở thành khách hàng thuê kho tự quản</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Họ và tên</label>
              <input
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white outline-none transition"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white outline-none transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Số điện thoại</label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white outline-none transition"
                placeholder="0909xxxxxx"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mật khẩu</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#183B2B] hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-emerald-700 font-bold transition">
              &larr; Về trang chủ
            </Link>
            <p>
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-emerald-700 hover:underline font-bold">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}