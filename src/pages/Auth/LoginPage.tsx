import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_HOME } from '../../routes/roleRoutes'
import type { UserRole } from '../../types/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      const user = {
        userId: res.user.userId,
        fullName: res.user.fullName,
        email: res.user.email,
        phoneNumber: res.user.phoneNumber,
        role: res.user.roleCode as UserRole,
        status: res.user.status,
      }
      login(res.token, user)
      const home = ROLE_HOME[user.role] || '/'
      navigate(home)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
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
          alt="[Chưa có hình ảnh nền đăng nhập - Hãy thay link ảnh vào đây]"
          className="w-full h-full object-cover text-white font-semibold text-xs p-4"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:bg-emerald-500 transition">
              SS
            </div>
            <span className="text-2xl font-black text-white tracking-wider uppercase">SelfStorage</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100 text-slate-800">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900">Đăng nhập hệ thống</h1>
            <p className="text-xs text-slate-500 mt-1">Truy cập Portal dành cho khách hàng & nhân viên</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email đăng nhập</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white outline-none transition"
                placeholder="customer@selfstorage.local"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mật khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#183B2B] hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-emerald-700 font-bold transition">
              &larr; Về trang chủ
            </Link>
            <p>
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-emerald-700 hover:underline font-bold">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}