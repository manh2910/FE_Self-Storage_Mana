import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { Link, useSearchParams } from 'react-router-dom'
import { customerReturnPath } from '../../features/booking/returnPath'
import { authApi } from '../../api/authApi'
import AuthLayout, { authField, authButton, PasswordField } from './AuthLayout'
export default function RegisterPage(){
  const [form,setForm]=useState({fullName:'',email:'',phoneNumber:'',password:''})
  const [confirmation,setConfirmation]=useState('')
  const [error,setError]=useState('')
  const [success,setSuccess]=useState(false)
  const [loading,setLoading]=useState(false)
  const [params]=useSearchParams()
  const next=customerReturnPath(params.get('next'))
  const loginPath=next?`/login?next=${encodeURIComponent(next)}`:'/login'
  async function submit(event:FormEvent){event.preventDefault();if(loading||success)return;setError('');if(form.password!==confirmation){setError('Passwords do not match. Please confirm your password again.');return}if(!form.fullName.trim()){setError('Enter your full name.');return}setLoading(true)
    try{await authApi.register({...form,fullName:form.fullName.trim(),email:form.email.trim(),phoneNumber:form.phoneNumber.trim()});setSuccess(true);setForm({...form,password:''});setConfirmation('')}
    catch(error){setError(isAxiosError(error)?error.response?.data?.message||'Unable to create your account. Please try again.':'Unable to create your account. Please try again.')}
    finally{setLoading(false)}
  }
  return <AuthLayout mode="register">{error&&<p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}{success?<div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"><h2 className="font-semibold text-emerald-800">Your account is ready.</h2><p className="my-3 text-sm leading-6 text-emerald-800">You can now log in with your email and password.</p><Link className={authButton} to={loginPath}>Continue to Login</Link></div>:<form onSubmit={submit} className="space-y-4" aria-busy={loading}><div><label htmlFor="register-name" className="mb-2 block text-sm font-medium text-slate-700">Full name</label><input id="register-name" autoComplete="name" required maxLength={100} disabled={loading} className={authField} placeholder="Your full name" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></div><div><label htmlFor="register-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label><input id="register-email" type="email" autoComplete="email" required maxLength={254} disabled={loading} className={authField} placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div><div><label htmlFor="register-phone" className="mb-2 block text-sm font-medium text-slate-700">Phone number <span className="font-normal text-slate-400">(optional)</span></label><input id="register-phone" type="tel" autoComplete="tel" maxLength={25} disabled={loading} className={authField} placeholder="Your contact number" value={form.phoneNumber} onChange={e=>setForm({...form,phoneNumber:e.target.value})}/></div><PasswordField id="register-password" label="Password" autoComplete="new-password" required minLength={6} disabled={loading} placeholder="At least 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><PasswordField id="register-confirmation" label="Confirm password" autoComplete="new-password" required minLength={6} disabled={loading} placeholder="Enter your password again" value={confirmation} onChange={e=>setConfirmation(e.target.value)}/><button type="submit" className={authButton} disabled={loading}>{loading?'Creating account…':'Register'}</button></form>}<p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link to={loginPath} className="inline-flex min-h-11 items-center font-semibold text-blue-600 hover:underline">Login</Link></p></AuthLayout>
}
