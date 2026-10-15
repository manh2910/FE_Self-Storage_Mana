import type { User } from '../types/auth'
export const authChanged='selfstorage:auth-changed'
export interface AuthState { user:User|null; token:string|null; isAuthenticated:boolean; isLoading:boolean }
export const guestState:AuthState={user:null,token:null,isAuthenticated:false,isLoading:false}
export function readAuthState(storage:Pick<Storage,'getItem'>):AuthState {
  try{
    const token=storage.getItem('token')
    const raw=storage.getItem('user')
    if(!token||!raw)return guestState
    const user=JSON.parse(raw) as User
    if(!user||!Number.isSafeInteger(user.userId)||typeof user.fullName!=='string'||typeof user.email!=='string'||!['StorageCustomer','FacilityStaff','FacilityManager','BusinessOperationsManager','SystemAdministrator'].includes(user.role))return guestState
    return {user,token,isAuthenticated:true,isLoading:false}
  }catch{return guestState}
}
export function persistAuth(storage:Pick<Storage,'setItem'|'removeItem'>,token:string,user:User){
  try{storage.setItem('user',JSON.stringify(user));storage.setItem('token',token)}catch(error){storage.removeItem('token');storage.removeItem('user');throw error}
}
export function clearAuth(storage:Pick<Storage,'removeItem'>){storage.removeItem('token');storage.removeItem('user')}
