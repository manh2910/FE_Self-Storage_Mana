const { readFileSync } = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const { test } = require('node:test')
const assert = require('node:assert/strict')
function load(name) {
  const filename = path.resolve(__dirname, '../src/pages/Manager/' + name + '.ts')
  const loaded = new Module(filename, module)
  loaded.filename = filename; loaded.paths = module.paths
  loaded.require = request => request.startsWith('.') ? load(request.startsWith('./') ? request.slice(2) : request) : require(request)
  loaded._compile(ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename)
  return loaded.exports
}
const { saveStaff, deleteStaff, loadWorkspace, saveWorkspace, assignUnit, rentalAction, reports, candidates, updateWorkspaceUnits, validPeriod, dateOffset } = load('facilityWorkspace')
function setup() { const values=new Map();const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};return {storage,w:loadWorkspace(storage)} }
test('Allocation respects type, area, availability and rental period; repeated allocation fails',()=>{
  let { w }=setup()
  assert.equal(candidates(w,w.requests[0]).length,1)
  assert.equal(candidates(w,w.requests[1]).length,0)
  assert.throws(()=>assignUnit(w,'REQ-001','sample-b202'))
  w=assignUnit(w,'REQ-001','sample-a101')
  assert.equal(w.rentals.at(-1).stage,'Awaiting handover')
  assert.equal(w.rentals.at(-1).payment,'Pending payment')
  assert.equal(w.units[0].status,'Occupied')
  assert.throws(()=>assignUnit(w,'REQ-001','sample-a101'))
})
test('Handover and return update the contract and send the unit to cleaning without changing payment',()=>{
  let { w }=setup();w=assignUnit(w,'REQ-001','sample-a101');const id=w.rentals.at(-1).id
  assert.throws(()=>rentalAction(w,id,'return'))
  w=rentalAction(w,id,'handover');assert.equal(w.rentals.at(-1).stage,'Occupied')
  w=rentalAction(w,id,'return');assert.equal(w.units[0].status,'Cleaning');assert.equal(w.rentals.at(-1).stage,'Returned');assert.equal(w.rentals.at(-1).payment,'Pending payment')
  assert.throws(()=>rentalAction(w,id,'renew',dateOffset(200)))
})
test('Renewals reject invalid dates and overlapping contracts',()=>{
  let { w }=setup();const r=w.rentals[0]
  assert.throws(()=>rentalAction(w,r.id,'renew',r.end))
  assert.throws(()=>rentalAction(w,r.id,'renew','2026-02-30'))
  w={...w,rentals:[...w.rentals,{...r,id:'conflict',start:dateOffset(10),end:dateOffset(50)}]}
  assert.throws(()=>rentalAction(w,r.id,'renew',dateOffset(30)))
  assert.equal(validPeriod('2026-02-30','2026-03-10'),false)
})
test('A failed handover can move to a compatible unit; the old unit goes to maintenance',()=>{
  let { w }=setup();w={...w,units:[...w.units,{...w.units[0],id:'replacement',code:'A-NEW'}]};w=assignUnit(w,'REQ-001','sample-a101');const id=w.rentals.at(-1).id
  w=rentalAction(w,id,'reassign','replacement')
  assert.equal(w.units[0].status,'Maintenance');assert.equal(w.units.at(-1).status,'Occupied');assert.equal(w.rentals.at(-1).unitId,'replacement')
})
test('Active contracts prevent disabling or resizing rented units',()=>{
  const { w }=setup();const rented=w.units.find(u=>u.status==='Occupied')
  assert.throws(()=>updateWorkspaceUnits(w,w.units.map(u=>u.id===rented.id?{...u,status:'Deactivated'}:u)))
  assert.throws(()=>updateWorkspaceUnits(w,w.units.map(u=>u.id===rented.id?{...u,area:100}:u)))
  assert.equal(updateWorkspaceUnits(w,w.units.map(u=>({...u,price:u.price+100000}))).rentals[0].amount,w.rentals[0].amount)
})
test('Workspace reloads atomically, reports exclude unpaid revenue and reflect actual inventory',()=>{
  let {w,storage}=setup();w=assignUnit(w,'REQ-001','sample-a101');saveWorkspace(storage,w)
  const restored=loadWorkspace(storage);assert.deepEqual(restored,w)
  const report=reports(restored);assert.equal(report.total,4);assert.equal(report.available,0);assert.equal(report.rented,3);assert.equal(report.revenue,1500000);assert.equal(report.overdue.length,1)
  assert.throws(()=>saveWorkspace({setItem(){throw Error('quota')}},w))
})

test('Legacy Vietnamese workspace labels load in English without changing customer names',()=>{
  const {w,storage}=setup()
  const legacy=JSON.stringify(w).replaceAll('Occupied','Đang thuê').replaceAll('Available','Còn trống').replaceAll('Maintenance','Bảo trì').replaceAll('Pending payment','Chờ thanh toán').replaceAll('Paid','Đã thanh toán').replaceAll('Pending','Chờ thực hiện')
  storage.setItem('selfstorage:fm-workspace:v1',legacy)
  const restored=loadWorkspace(storage)
  assert.deepEqual(restored,w)
})

test('Staff CRUD persists and editing preserves task ownership',()=>{
  let {w,storage}=setup()
  w=saveStaff(w,{name:'  Alex Nguyen  ',position:'  Support  '})
  const member=w.staff.at(-1)
  assert.equal(member.name,'Alex Nguyen')
  assert.equal(member.position,'Support')
  w=saveStaff(w,{name:'Alex Tran',position:'Supervisor'},member.id)
  assert.equal(w.staff.at(-1).id,member.id)
  const assigned=w.staff.find(s=>s.id===w.tasks[0].staffId)
  w=saveStaff(w,{name:assigned.name,position:'Senior inspector'},assigned.id)
  assert.equal(w.tasks[0].staffId,assigned.id)
  saveWorkspace(storage,w)
  assert.deepEqual(loadWorkspace(storage),w)
  w=deleteStaff(w,member.id)
  saveWorkspace(storage,w)
  assert.ok(!loadWorkspace(storage).staff.some(s=>s.id===member.id))
})
test('Staff validation rejects blank fields, missing records and deletion with task history',()=>{
  const {w}=setup()
  assert.throws(()=>saveStaff(w,{name:'   ',position:'Support'}))
  assert.throws(()=>saveStaff(w,{name:'Alex',position:' '}))
  assert.throws(()=>saveStaff(w,{name:'Alex',position:'Support'},'missing'))
  assert.throws(()=>deleteStaff(w,'missing'))
  assert.throws(()=>deleteStaff(w,w.tasks[0].staffId))
  assert.throws(()=>deleteStaff({...w,tasks:w.tasks.map(t=>({...t,status:'Completed'}))},w.tasks[0].staffId))
})

const {saveShift,removeShift,saveStaffTask,reviewStaffTask,staffPerformance}=load('staffManagementDomain')
test('Dated shifts reject overlaps, invalid dates and unavailable staff; changes persist',()=>{
  let {w,storage}=setup()
  const draft={staffId:w.staff[0].id,date:dateOffset(1),start:'08:00',end:'14:00',label:'Morning'}
  w=saveShift(w,draft)
  const id=w.shifts[0].id
  assert.throws(()=>saveShift(w,{...draft,start:'13:00',end:'16:00'}))
  assert.throws(()=>saveShift(w,{...draft,date:'2026-02-30'}))
  assert.throws(()=>saveShift(w,{...draft,start:'14:00',end:'08:00'}))
  w=saveShift(w,{...draft,start:'14:00',end:'20:00'})
  w=saveShift(w,{...draft,start:'07:00',end:'12:00'},id)
  saveWorkspace(storage,w)
  assert.deepEqual(loadWorkspace(storage),w)
  w=saveStaff(w,{...w.staff[0],availability:'On leave'},w.staff[0].id)
  assert.throws(()=>saveShift(w,{...draft,date:dateOffset(2)}))
  w=removeShift(w,id)
  assert.equal(w.shifts.length,1)
})
test('Staff profiles persist contacts and status; unavailable staff reject new assignments',()=>{
  let {w,storage}=setup()
  const member=w.staff[0]
  assert.throws(()=>saveStaff(w,{...member,email:'broken'},member.id))
  w=saveStaff(w,{...member,email:'alex@example.com',phone:'+84 900 123 456',status:'Active',availability:'On leave'},member.id)
  saveWorkspace(storage,w)
  assert.equal(loadWorkspace(storage).staff[0].email,'alex@example.com')
  const draft={title:'Inspect unit',staffId:member.id,unitId:'',due:dateOffset(2),status:'Pending',progress:0}
  assert.throws(()=>saveStaffTask(w,draft))
  w=saveStaff(w,{...w.staff[0],availability:'Working'},member.id)
  w=saveStaffTask(w,draft)
  assert.equal(w.tasks.at(-1).staffId,member.id)
})
test('Task progress, reassignment, review and late completion metrics remain consistent',()=>{
  let {w,storage}=setup()
  const draft={title:'Inspect unit',staffId:w.staff[0].id,unitId:'',due:dateOffset(-1),status:'In progress',progress:40}
  w=saveStaffTask(w,draft)
  const id=w.tasks.at(-1).id
  assert.equal(staffPerformance(w,draft.staffId).overdue,1)
  assert.throws(()=>saveStaffTask(w,{...draft,progress:101},id))
  assert.throws(()=>reviewStaffTask(w,id))
  w=saveStaffTask(w,{...draft,status:'Completed',progress:100},id)
  assert.equal(w.tasks.at(-1).completedAt,dateOffset(0))
  w=reviewStaffTask(w,id)
  assert.equal(staffPerformance(w,draft.staffId).late,1)
  assert.equal(staffPerformance(w,draft.staffId).reviewed,1)
  w=saveStaffTask(w,{...draft,staffId:w.staff[2].id,status:'Pending',progress:0},id)
  assert.equal(w.tasks.at(-1).reviewedAt,undefined)
  assert.equal(w.tasks.at(-1).completedAt,undefined)
  assert.equal(staffPerformance(w,draft.staffId).total,0)
  saveWorkspace(storage,w)
  assert.deepEqual(loadWorkspace(storage),w)
})

const { incomingBookings,receiveBooking }=load('incomingHandovers')
const { DemoBookingStore }=load('../../features/booking/domain')
function incomingSetup(){
  const values=new Map()
  const storage={get length(){return values.size},key:index=>[...values.keys()][index]??null,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)}
  return {storage,store:new DemoBookingStore(storage),w:loadWorkspace(storage)}
}
const bookingInput={requestId:'handover-order',unitId:'D1-S01',startDate:dateOffset(1),months:3,fullName:'Alex Nguyen',email:'alex@example.com',phone:'0901234567',notes:'',accepted:true}
test('Handover intake receives District 1 bookings with actual customer, date and order ID',()=>{
  const {storage,store,w}=incomingSetup()
  const b=store.create(0,bookingInput,{id:'D1-S01',monthlyPrice:800000,available:true})
  const rows=incomingBookings(storage,w)
  assert.equal(rows.length,1)
  assert.equal(rows[0].booking.id,b.id)
  assert.equal(rows[0].booking.fullName,'Alex Nguyen')
  assert.equal(rows[0].booking.email,'alex@example.com')
  assert.equal(rows[0].booking.phone,'0901234567')
  assert.equal(rows[0].booking.startDate,bookingInput.startDate)
  store.create(1,{...bookingInput,requestId:'other-facility',unitId:'TD-S02'},{id:'TD-S02',monthlyPrice:750000,available:true})
  assert.equal(incomingBookings(storage,w).length,1)
  store.cancel(0,b.id)
  assert.equal(incomingBookings(storage,w).length,0)
  assert.throws(()=>receiveBooking(w,storage,0,b.id))
})
test('Customer handovers persist once without changing payments and retain cancelled history',()=>{
  let {storage,store,w}=incomingSetup()
  const b=store.create(0,bookingInput,{id:'D1-S01',monthlyPrice:800000,available:true})
  w=receiveBooking(w,storage,0,b.id)
  assert.throws(()=>receiveBooking(w,storage,0,b.id))
  saveWorkspace(storage,w)
  assert.deepEqual(loadWorkspace(storage),w)
  assert.ok(incomingBookings(storage,w)[0].receivedAt)
  assert.equal(store.list(0)[0].status,'pending')
  store.cancel(0,b.id)
  assert.equal(incomingBookings(storage,w)[0].booking.status,'cancelled')
})

test('Facility summary counts cleaning separately and cleaning units cannot be allocated',()=>{
  let {w,storage}=setup()
  w=assignUnit(w,'REQ-001','sample-a101')
  const id=w.rentals.at(-1).id
  w=rentalAction(w,id,'handover')
  w=rentalAction(w,id,'return')
  const summary=reports(w)
  assert.equal(summary.total,4)
  assert.equal(summary.available,0)
  assert.equal(summary.rented,2)
  assert.equal(summary.cleaning,1)
  assert.equal(summary.maintenance,1)
  assert.equal(summary.total,summary.available+summary.rented+summary.cleaning+summary.maintenance+summary.deactivated)
  assert.equal(candidates(w,{...w.requests[0],rentalId:undefined}).length,0)
  saveWorkspace(storage,w)
  assert.equal(reports(loadWorkspace(storage)).cleaning,1)
  const cleaned=updateWorkspaceUnits(w,w.units.map(u=>u.id==='sample-a101'?{...u,status:'Available'}:u))
  assert.equal(reports(cleaned).cleaning,0)
  assert.equal(reports(cleaned).available,1)
  const empty=reports({...w,units:[],rentals:[]})
  assert.equal(empty.total,0)
  assert.equal(empty.cleaning,0)
})
