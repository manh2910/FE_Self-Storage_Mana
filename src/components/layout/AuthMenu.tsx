import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
const action='inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-4 sm:text-sm'
export default function AuthMenu(){
  const {isAuthenticated,user,logout}=useAuth()
  const [error,setError]=useState('')
  function signOut(){try{logout();setError('')}catch{setError('Unable to log out. Check browser storage and try again.')}}
  return <div className="relative ml-auto flex shrink-0 items-center gap-1.5" role="group" aria-label="Account">{isAuthenticated?<><span className="hidden max-w-28 truncate text-xs text-slate-600 xl:block" title={user?.fullName}>{user?.fullName}</span><button type="button" className={`${action} border border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700`} onClick={signOut}>Logout</button></>:<><Link to="/login" className={`${action} text-slate-700 hover:bg-blue-50 hover:text-blue-700`}>Login</Link><Link to="/register" className={`${action} border border-blue-600 bg-blue-600 text-white hover:bg-blue-700`}>Register</Link></>}{error&&<p role="alert" className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-red-200 bg-white p-3 text-xs text-red-700 shadow-lg">{error}</p>}</div>
}
