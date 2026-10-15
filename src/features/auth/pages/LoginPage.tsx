import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { customerReturnPath } from '../../booking/model/returnPath'
import { authApi } from '../api/authApi'
import { useAuth } from '../hooks/useAuth'
import { ROLE_HOME } from '../../../app/routes/roleRoutes'
import type { UserRole } from '../types/auth'
import AuthLayout, { authField, authButton, PasswordField } from '../components/AuthLayout'
export default function LoginPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate()
  const {login}=useAuth()
  const [params]=useSearchParams()
  const next=customerReturnPath(params.get('next'))
  const nextQuery=next?`?next=${encodeURIComponent(next)}`:''
  async function submit(event:FormEvent){event.preventDefault();if(loading)return;setError('');setLoading(true)
    try{const res=await authApi.login({email:email.trim(),password});const user={userId:res.user.userId,fullName:res.user.fullName,email:res.user.email,phoneNumber:res.user.phoneNumber,role:res.user.roleCode as UserRole,status:res.user.status};login(res.token,user);navigate(user.role==='StorageCustomer'&&next?next:ROLE_HOME[user.role]||'/',{replace:true})}
    catch(error){setError(isAxiosError(error)?error.response?.data?.message||'Unable to log in. Check your details and try again.':'Unable to save your session. Check browser storage and try again.')}
    finally{setLoading(false)}
  }
  return <AuthLayout mode="login">{error&&<p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}<form onSubmit={submit} className="space-y-5" aria-busy={loading}><div><label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label><input id="login-email" type="email" autoComplete="username" required maxLength={254} disabled={loading} className={authField} placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></div><PasswordField id="login-password" label="Password" autoComplete="current-password" required disabled={loading} placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)}/><button type="submit" className={authButton} disabled={loading}>{loading?'Logging in…':'Login'}</button></form><p className="mt-6 text-center text-sm text-slate-500">New to SelfStorage? <Link className="inline-flex min-h-11 items-center font-semibold text-blue-600 hover:underline" to={`/register${nextQuery}`}>Create an account</Link></p></AuthLayout>
}
