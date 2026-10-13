import { readUnits, type ManagedUnit } from './storageUnits'
export const workspaceKey = 'selfstorage:fm-workspace:v1'
export interface Rental { id: string; customer: string; unitId: string; start: string; end: string; payment: 'Đã thanh toán' | 'Chờ thanh toán'; amount: number; stage: 'Chờ bàn giao' | 'Đang thuê' | 'Đã trả' }
export interface Request { id: string; customer: string; type: ManagedUnit['type']; area: number; start: string; end: string; rentalId?: string }
export interface Staff { id: string; name: string; position: string }
export interface Task { id: string; title: string; staffId: string; unitId: string; due: string; status: 'Chờ thực hiện' | 'Đang thực hiện' | 'Hoàn thành' }
export interface Workspace { units: ManagedUnit[]; rentals: Rental[]; requests: Request[]; staff: Staff[]; tasks: Task[] }
export function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
export function dateOffset(days: number) { const d = new Date(); d.setDate(d.getDate()+days); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function validDate(value: string) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value }
export function validPeriod(start: string, end: string) { return validDate(start) && validDate(end) && start < end }
export function loadWorkspace(storage: Pick<Storage,'getItem'>): Workspace {
  const units = readUnits(storage)
  const raw = storage.getItem(workspaceKey)
  if (raw) {
    const value = JSON.parse(raw) as Workspace
    if (!Array.isArray(value.rentals) || !Array.isArray(value.requests) || !Array.isArray(value.staff) || !Array.isArray(value.tasks)) throw new Error('Dữ liệu cơ sở không hợp lệ.')
    if (value.rentals.some(r => !r || typeof r.id !== 'string' || typeof r.customer !== 'string' || !units.some(u=>u.id===r.unitId) || !validPeriod(r.start,r.end) || !Number.isSafeInteger(r.amount) || r.amount < 0 || !['Đã thanh toán','Chờ thanh toán'].includes(r.payment) || !['Chờ bàn giao','Đang thuê','Đã trả'].includes(r.stage))) throw new Error('Dữ liệu hợp đồng không hợp lệ.')
    const uniqueIds = (items: { id: string }[]) => items.every(item => item && typeof item.id === 'string' && item.id) && new Set(items.map(item=>item.id)).size === items.length
    if (![value.rentals, value.requests, value.staff, value.tasks].every(uniqueIds)) throw new Error('Mã dữ liệu bị trùng hoặc không hợp lệ.')
    if (value.staff.some(s=>typeof s.name!=='string'||!s.name.trim()||typeof s.position!=='string')) throw new Error('Dữ liệu nhân viên không hợp lệ.')
    if (value.requests.some(r=>typeof r.customer!=='string'||!['Small','Medium','Large'].includes(r.type)||!Number.isFinite(r.area)||r.area<=0||!validPeriod(r.start,r.end)||(r.rentalId&&!value.rentals.some(item=>item.id===r.rentalId)))) throw new Error('Dữ liệu đơn đặt không hợp lệ.')
    if (value.tasks.some(t=>typeof t.title!=='string'||!t.title.trim()||!value.staff.some(s=>s.id===t.staffId)||!validDate(t.due)||!['Chờ thực hiện','Đang thực hiện','Hoàn thành'].includes(t.status)||(t.unitId&&!units.some(u=>u.id===t.unitId)))) throw new Error('Dữ liệu nhiệm vụ không hợp lệ.')
    return { ...value, units }
  }
  const rentals: Rental[] = units.filter(u=>u.status==='Đang thuê').map((u,i)=>({id:`HD-${i+1}`,customer:i===0?'Trần Hoàng Nam':'Lê Thanh Hà',unitId:u.id,start:dateOffset(-35),end:dateOffset(i===0?7:-3),payment:i===0?'Đã thanh toán':'Chờ thanh toán',amount:u.price,stage:'Đang thuê'}))
  return { units, rentals, requests: [{id:'REQ-001',customer:'Nguyễn Minh Anh',type:'Small',area:5,start:dateOffset(1),end:dateOffset(91)},{id:'REQ-002',customer:'Phạm Gia Huy',type:'Medium',area:10,start:dateOffset(2),end:dateOffset(182)}], staff:[{id:'staff-1',name:'Nguyễn Phương',position:'Bàn giao & hỗ trợ khách'},{id:'staff-2',name:'Trần Đức',position:'Kiểm tra & bảo trì'},{id:'staff-3',name:'Lê Mai',position:'Hỗ trợ hợp đồng'}], tasks:[{id:'task-1',title:'Kiểm tra cơ sở đầu ca',staffId:'staff-2',unitId:units[0]?.id||'',due:today(),status:'Chờ thực hiện'}] }
}
export function saveWorkspace(storage: Pick<Storage,'setItem'>, value: Workspace) { storage.setItem(workspaceKey, JSON.stringify(value)) }
export function candidates(w: Workspace, req: Request, excludeRentalId?: string) { return w.units.filter(u=>u.type===req.type && u.area>=req.area && u.status==='Còn trống' && !w.rentals.some(r=>r.id!==excludeRentalId && r.unitId===u.id && r.stage!=='Đã trả' && req.start<r.end && r.start<req.end)) }
export function assignUnit(w: Workspace, requestId: string, unitId: string): Workspace {
  const req=w.requests.find(r=>r.id===requestId)
  if (!req || req.rentalId || !validPeriod(req.start,req.end)) throw new Error('Yêu cầu không còn khả dụng.')
  const unit=candidates(w,req).find(u=>u.id===unitId)
  if (!unit) throw new Error('Kho không phù hợp hoặc không còn trống trong thời hạn thuê.')
  const rentalId=crypto.randomUUID()
  return {...w,units:w.units.map(u=>u.id===unitId?{...u,status:'Đang thuê'}:u),requests:w.requests.map(r=>r.id===requestId?{...r,rentalId}:r),rentals:[...w.rentals,{id:rentalId,customer:req.customer,unitId,start:req.start,end:req.end,payment:'Chờ thanh toán',amount:unit.price,stage:'Chờ bàn giao'}]}
}
export function rentalAction(w: Workspace, id: string, action: 'handover'|'return'|'renew'|'reassign', value=''): Workspace {
  const rental=w.rentals.find(r=>r.id===id)
  if (!rental || rental.stage==='Đã trả') throw new Error('Hợp đồng không còn hiệu lực.')
  if (action==='return' && rental.stage!=='Đang thuê') throw new Error('Chỉ nhận lại kho đã bàn giao.')
  if (action==='handover' && rental.stage!=='Chờ bàn giao') throw new Error('Kho đã được bàn giao.')
  if (action==='renew' && (!validPeriod(rental.end,value) || value <= today() || w.rentals.some(r=>r.id!==id && r.unitId===rental.unitId && r.stage!=='Đã trả' && rental.end<r.end && r.start<value))) throw new Error('Ngày gia hạn không hợp lệ hoặc trùng hợp đồng khác.')
  let units=w.units
  if (action==='return') units=units.map(u=>u.id===rental.unitId?{...u,status:'Còn trống'}:u)
  if (action==='reassign') {
    const old=units.find(u=>u.id===rental.unitId)
    if (rental.stage!=='Chờ bàn giao' || !old || !candidates(w,{id:'',customer:rental.customer,type:old.type,area:old.area,start:rental.start,end:rental.end},id).some(u=>u.id===value)) throw new Error('Không thể đổi sang kho đã chọn.')
    units=units.map(u=>u.id===value?{...u,status:'Đang thuê'}:u.id===old.id?{...u,status:'Bảo trì'}:u)
  }
  return {...w,units,rentals:w.rentals.map(r=>r.id!==id?r:{...r,stage:action==='handover'?'Đang thuê':action==='return'?'Đã trả':r.stage,end:action==='renew'?value:r.end,unitId:action==='reassign'?value:r.unitId})}
}
export function reports(w: Workspace) { const active=w.rentals.filter(r=>r.stage!=='Đã trả'); return {total:w.units.length,available:w.units.filter(u=>u.status==='Còn trống').length,rented:w.units.filter(u=>u.status==='Đang thuê').length,revenue:w.rentals.filter(r=>r.payment==='Đã thanh toán').reduce((s,r)=>s+r.amount,0),overdue:active.filter(r=>r.end<today())} }

export function updateWorkspaceUnits(w: Workspace, units: ManagedUnit[]): Workspace {
  for (const rental of w.rentals) {
    if (rental.stage === 'Đã trả') continue
    const previous = w.units.find(u=>u.id===rental.unitId)
    const next = units.find(u=>u.id===rental.unitId)
    if (!next || !previous || next.status !== 'Đang thuê' || next.type !== previous.type || next.area !== previous.area) throw new Error('Kho có hợp đồng đang hoạt động. Xử lý trả kho hoặc đổi kho trong trang vận hành trước khi đổi trạng thái, loại hoặc diện tích.')
  }
  return { ...w, units }
}
