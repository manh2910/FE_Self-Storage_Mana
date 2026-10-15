import { parseManagerData } from './managerStorage'
import { readUnits, type ManagedUnit } from './storageUnits'
export const workspaceKey = 'selfstorage:fm-workspace:v1'
export interface Rental { id: string; customer: string; unitId: string; start: string; end: string; payment: 'Paid' | 'Pending payment'; amount: number; stage: 'Awaiting handover' | 'Occupied' | 'Returned' }
export interface Request { id: string; customer: string; type: ManagedUnit['type']; area: number; start: string; end: string; rentalId?: string }
export const staffAvailability = ['Available', 'Working', 'On leave', 'Unavailable'] as const
export interface Staff { id: string; name: string; position: string; email?: string; phone?: string; status?: 'Active'|'Inactive'; availability?: typeof staffAvailability[number] }
export interface StaffShift { id: string; staffId: string; date: string; start: string; end: string; label: string }
export interface Task { id: string; title: string; staffId: string; unitId: string; due: string; status: 'Pending' | 'In progress' | 'Completed'; progress?: number; completedAt?: string; reviewedAt?: string }
export interface BookingHandover { bookingId: string; userId: number; receivedAt: string }
export interface Workspace { units: ManagedUnit[]; rentals: Rental[]; requests: Request[]; staff: Staff[]; tasks: Task[]; shifts?: StaffShift[]; bookingHandovers?: BookingHandover[] }
export function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
export function dateOffset(days: number) { const d = new Date(); d.setDate(d.getDate()+days); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function validDate(value: string) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value }
export function validPeriod(start: string, end: string) { return validDate(start) && validDate(end) && start < end }
export function loadWorkspace(storage: Pick<Storage,'getItem'>): Workspace {
  const units = readUnits(storage)
  const raw = storage.getItem(workspaceKey)
  if (raw) {
    const value = parseManagerData(raw) as Workspace
    if (!Array.isArray(value.rentals) || !Array.isArray(value.requests) || !Array.isArray(value.staff) || !Array.isArray(value.tasks)) throw new Error('Invalid facility data.')
    if (value.rentals.some(r => !r || typeof r.id !== 'string' || typeof r.customer !== 'string' || !units.some(u=>u.id===r.unitId) || !validPeriod(r.start,r.end) || !Number.isSafeInteger(r.amount) || r.amount < 0 || !['Paid','Pending payment'].includes(r.payment) || !['Awaiting handover','Occupied','Returned'].includes(r.stage))) throw new Error('Invalid contract data.')
    const uniqueIds = (items: { id: string }[]) => items.every(item => item && typeof item.id === 'string' && item.id) && new Set(items.map(item=>item.id)).size === items.length
    if (![value.rentals, value.requests, value.staff, value.tasks].every(uniqueIds)) throw new Error('Duplicate or invalid record IDs.')
    if (value.staff.some(s=>typeof s.name!=='string'||!s.name.trim()||typeof s.position!=='string')) throw new Error('Invalid staff data.')
    if (value.requests.some(r=>typeof r.customer!=='string'||!['Small','Medium','Large'].includes(r.type)||!Number.isFinite(r.area)||r.area<=0||!validPeriod(r.start,r.end)||(r.rentalId&&!value.rentals.some(item=>item.id===r.rentalId)))) throw new Error('Invalid reservation data.')
    if (value.tasks.some(t=>typeof t.title!=='string'||!t.title.trim()||!value.staff.some(s=>s.id===t.staffId)||!validDate(t.due)||!['Pending','In progress','Completed'].includes(t.status)||(t.unitId&&!units.some(u=>u.id===t.unitId)))) throw new Error('Invalid task data.')
    if (value.staff.some(s => (s.email !== undefined && typeof s.email !== 'string') || (s.phone !== undefined && typeof s.phone !== 'string') || (s.status !== undefined && !['Active','Inactive'].includes(s.status)) || (s.availability !== undefined && !staffAvailability.includes(s.availability)))) throw new Error('Invalid staff profile.')
    if (value.shifts !== undefined && (!Array.isArray(value.shifts) || !uniqueIds(value.shifts) || value.shifts.some(s => !value.staff.some(p=>p.id===s.staffId) || !validDate(s.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(s.start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(s.end) || s.start>=s.end || typeof s.label!=='string'))) throw new Error('Invalid shift data.')
    if (value.tasks.some(t => (t.progress !== undefined && (!Number.isInteger(t.progress) || t.progress<0 || t.progress>100)) || (t.completedAt !== undefined && !validDate(t.completedAt)) || (t.reviewedAt !== undefined && !validDate(t.reviewedAt)))) throw new Error('Invalid task progress.')
    if (value.bookingHandovers !== undefined && (!Array.isArray(value.bookingHandovers) || value.bookingHandovers.some(h=>!h || typeof h.bookingId!=='string' || !Number.isSafeInteger(h.userId) || h.userId<0 || typeof h.receivedAt!=='string' || !Number.isFinite(Date.parse(h.receivedAt))) || new Set(value.bookingHandovers.map(h=>`${h.userId}:${h.bookingId}`)).size!==value.bookingHandovers.length)) throw new Error('Invalid booking handover records.')
    return { ...value, units }
  }
  const rentals: Rental[] = units.filter(u=>u.status==='Occupied').map((u,i)=>({id:`HD-${i+1}`,customer:i===0?'Trần Hoàng Nam':'Lê Thanh Hà',unitId:u.id,start:dateOffset(-35),end:dateOffset(i===0?7:-3),payment:i===0?'Paid':'Pending payment',amount:u.price,stage:'Occupied'}))
  return { units, rentals, requests: [{id:'REQ-001',customer:'Nguyễn Minh Anh',type:'Small',area:5,start:dateOffset(1),end:dateOffset(91)},{id:'REQ-002',customer:'Phạm Gia Huy',type:'Medium',area:10,start:dateOffset(2),end:dateOffset(182)}], staff:[{id:'staff-1',name:'Nguyễn Phương',position:'Handovers & customer support'},{id:'staff-2',name:'Trần Đức',position:'Inspections & maintenance'},{id:'staff-3',name:'Lê Mai',position:'Contract support'}], tasks:[{id:'task-1',title:'Start-of-shift facility inspection',staffId:'staff-2',unitId:units[0]?.id||'',due:today(),status:'Pending'}] }
}
export function saveWorkspace(storage: Pick<Storage,'setItem'>, value: Workspace) { storage.setItem(workspaceKey, JSON.stringify(value)) }
export function candidates(w: Workspace, req: Request, excludeRentalId?: string) { return w.units.filter(u=>u.type===req.type && u.area>=req.area && u.status==='Available' && !w.rentals.some(r=>r.id!==excludeRentalId && r.unitId===u.id && r.stage!=='Returned' && req.start<r.end && r.start<req.end)) }
export function assignUnit(w: Workspace, requestId: string, unitId: string): Workspace {
  const req=w.requests.find(r=>r.id===requestId)
  if (!req || req.rentalId || !validPeriod(req.start,req.end)) throw new Error('This request is no longer available.')
  const unit=candidates(w,req).find(u=>u.id===unitId)
  if (!unit) throw new Error('The unit is unsuitable or unavailable for the rental period.')
  const rentalId=crypto.randomUUID()
  return {...w,units:w.units.map(u=>u.id===unitId?{...u,status:'Occupied'}:u),requests:w.requests.map(r=>r.id===requestId?{...r,rentalId}:r),rentals:[...w.rentals,{id:rentalId,customer:req.customer,unitId,start:req.start,end:req.end,payment:'Pending payment',amount:unit.price,stage:'Awaiting handover'}]}
}
export function rentalAction(w: Workspace, id: string, action: 'handover'|'return'|'renew'|'reassign', value=''): Workspace {
  const rental=w.rentals.find(r=>r.id===id)
  if (!rental || rental.stage==='Returned') throw new Error('The contract is no longer active.')
  if (action==='return' && rental.stage!=='Occupied') throw new Error('Only units already handed over can be returned.')
  if (action==='handover' && rental.stage!=='Awaiting handover') throw new Error('The unit has already been handed over.')
  if (action==='renew' && (!validPeriod(rental.end,value) || value <= today() || w.rentals.some(r=>r.id!==id && r.unitId===rental.unitId && r.stage!=='Returned' && rental.end<r.end && r.start<value))) throw new Error('Invalid renewal date or conflicting contract period.')
  let units=w.units
  if (action==='return') units=units.map(u=>u.id===rental.unitId?{...u,status:'Cleaning'}:u)
  if (action==='reassign') {
    const old=units.find(u=>u.id===rental.unitId)
    if (rental.stage!=='Awaiting handover' || !old || !candidates(w,{id:'',customer:rental.customer,type:old.type,area:old.area,start:rental.start,end:rental.end},id).some(u=>u.id===value)) throw new Error('Cannot reassign to the selected unit.')
    units=units.map(u=>u.id===value?{...u,status:'Occupied'}:u.id===old.id?{...u,status:'Maintenance'}:u)
  }
  return {...w,units,rentals:w.rentals.map(r=>r.id!==id?r:{...r,stage:action==='handover'?'Occupied':action==='return'?'Returned':r.stage,end:action==='renew'?value:r.end,unitId:action==='reassign'?value:r.unitId})}
}
export function reports(w: Workspace) { const active=w.rentals.filter(r=>r.stage!=='Returned'); return {total:w.units.length,available:w.units.filter(u=>u.status==='Available').length,rented:w.units.filter(u=>u.status==='Occupied').length,cleaning:w.units.filter(u=>u.status==='Cleaning').length,maintenance:w.units.filter(u=>u.status==='Maintenance').length,deactivated:w.units.filter(u=>u.status==='Deactivated').length,revenue:w.rentals.filter(r=>r.payment==='Paid').reduce((s,r)=>s+r.amount,0),overdue:active.filter(r=>r.end<today())} }

export function updateWorkspaceUnits(w: Workspace, units: ManagedUnit[]): Workspace {
  for (const rental of w.rentals) {
    if (rental.stage === 'Returned') continue
    const previous = w.units.find(u=>u.id===rental.unitId)
    const next = units.find(u=>u.id===rental.unitId)
    if (!next || !previous || next.status !== 'Occupied' || next.type !== previous.type || next.area !== previous.area) throw new Error('This unit has an active contract. Return or reassign it before changing its status, type or area.')
  }
  return { ...w, units }
}

export function saveStaff(w: Workspace, draft: Omit<Staff, 'id'>, id?: string): Workspace {
  const name = draft.name.trim()
  const position = draft.position.trim()
  if (!name || name.length > 100 || !position || position.length > 120) throw new Error('Enter a name (up to 100 characters) and role (up to 120 characters).')
  if (id && !w.staff.some(s => s.id === id)) throw new Error('This staff member no longer exists. Reload the page.')
  const email = draft.email?.trim() || ''
  const phone = draft.phone?.trim() || ''
  if (email && (email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw new Error('Enter a valid email address.')
  if (phone && !/^[+\d() .-]{6,25}$/.test(phone)) throw new Error('Enter a valid phone number (6–25 characters).')
  if (draft.status && !['Active','Inactive'].includes(draft.status)) throw new Error('Select a valid staff status.')
  if (draft.availability && !staffAvailability.includes(draft.availability)) throw new Error('Select a valid availability.')
  const previous = w.staff.find(s=>s.id===id)
  const member: Staff = { ...previous, ...draft, id: id || crypto.randomUUID(), name, position, ...(draft.email!==undefined?{email}:{}), ...(draft.phone!==undefined?{phone}:{}) }
  return { ...w, staff: id ? w.staff.map(s => s.id === id ? member : s) : [...w.staff, member] }
}
export function deleteStaff(w: Workspace, id: string): Workspace {
  if (!w.staff.some(s => s.id === id)) throw new Error('This staff member no longer exists. Reload the page.')
  if (w.tasks.some(t => t.staffId === id)) throw new Error('Reassign this staff member’s tasks before deleting them, including completed tasks.')
  return { ...w, staff: w.staff.filter(s => s.id !== id), ...(w.shifts?{shifts:w.shifts.filter(s=>s.staffId!==id)}:{}) }
}
