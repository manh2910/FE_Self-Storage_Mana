import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { customerReturnPath } from '../../features/booking/returnPath'
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
  const [params] = useSearchParams()
  const next = customerReturnPath(params.get('next'))
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : ''
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
      navigate(user.role === 'StorageCustomer' && next ? next : home)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign-in failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 font-sans text-slate-800 px-4">
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
          <h1 className="text-2xl font-extrabold text-slate-900">Sign in to your account</h1>
          <p className="text-xs text-slate-500 mt-1">Professional self-storage management</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition"
              placeholder="customer@selfstorage.local"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50 text-sm uppercase tracking-wider"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-5 border-t border-slate-100 pt-5">
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link to="/" className="hover:text-orange-600 transition font-medium">
            &larr; Back to home
          </Link>
          <p>
            Do not have an account?{' '}
            <Link to={`/register${nextQuery}`} className="text-orange-600 hover:underline font-bold">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
