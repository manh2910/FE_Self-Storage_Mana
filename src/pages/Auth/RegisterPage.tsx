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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 font-sans text-slate-800 px-4 py-8">
      {/* Brand Logo Header */}
      <div className="mb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
            SS
          </div>
          <span className="text-2xl font-extrabold text-white tracking-wider uppercase">SelfStorage</span>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Đăng ký tài khoản mới</h1>
          <p className="text-xs text-slate-500 mt-1">Trở thành khách hàng thuê kho tự phục vụ</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-xs font-medium">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Họ và tên</label>
            <input
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition"
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Số điện thoại</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition"
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50 text-sm uppercase tracking-wider"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link to="/" className="hover:text-orange-600 transition font-medium">
            &larr; Về trang chủ
          </Link>
          <p>
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-orange-600 hover:underline font-bold">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}