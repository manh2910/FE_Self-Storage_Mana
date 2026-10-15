import { useState, useEffect, useCallback } from 'react'
import type { User, UserRole } from '../types/auth'
import { authChanged, readAuthState, persistAuth, clearAuth } from './authSession'

export function useAuth(){
  const [state,setState]=useState(()=>readAuthState(localStorage))
  useEffect(()=>{
    const refresh=()=>setState(readAuthState(localStorage))
    const onStorage=(event:StorageEvent)=>{if(event.key===null||event.key==='token'||event.key==='user')refresh()}
    window.addEventListener(authChanged,refresh)
    window.addEventListener('storage',onStorage)
    refresh()
    return()=>{window.removeEventListener(authChanged,refresh);window.removeEventListener('storage',onStorage)}
  },[])
  const login=useCallback((token:string,user:User)=>{persistAuth(localStorage,token,user);window.dispatchEvent(new Event(authChanged))},[])
  const logout=useCallback(()=>{clearAuth(localStorage);window.dispatchEvent(new Event(authChanged))},[])
  return {...state,login,logout}
}
export function hasRole(user:User|null,roles:UserRole[]):boolean{return !!user&&roles.includes(user.role)}
