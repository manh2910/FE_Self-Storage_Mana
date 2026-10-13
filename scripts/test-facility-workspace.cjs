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
  loaded.require = request => request === './storageUnits' ? load('storageUnits') : require(request)
  loaded._compile(ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename)
  return loaded.exports
}
const { loadWorkspace, saveWorkspace, assignUnit, rentalAction, reports, candidates, updateWorkspaceUnits, validPeriod, dateOffset } = load('facilityWorkspace')
function setup() { const values=new Map();const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};return {storage,w:loadWorkspace(storage)} }
test('Allocation respects type, area, availability and rental period; repeated allocation fails',()=>{
  let { w }=setup()
  assert.equal(candidates(w,w.requests[0]).length,1)
  assert.equal(candidates(w,w.requests[1]).length,0)
  assert.throws(()=>assignUnit(w,'REQ-001','sample-b202'))
  w=assignUnit(w,'REQ-001','sample-a101')
  assert.equal(w.rentals.at(-1).stage,'Chờ bàn giao')
  assert.equal(w.rentals.at(-1).payment,'Chờ thanh toán')
  assert.equal(w.units[0].status,'Đang thuê')
  assert.throws(()=>assignUnit(w,'REQ-001','sample-a101'))
})
test('Handover and return update the contract and release inventory without changing payment',()=>{
  let { w }=setup();w=assignUnit(w,'REQ-001','sample-a101');const id=w.rentals.at(-1).id
  assert.throws(()=>rentalAction(w,id,'return'))
  w=rentalAction(w,id,'handover');assert.equal(w.rentals.at(-1).stage,'Đang thuê')
  w=rentalAction(w,id,'return');assert.equal(w.units[0].status,'Còn trống');assert.equal(w.rentals.at(-1).stage,'Đã trả');assert.equal(w.rentals.at(-1).payment,'Chờ thanh toán')
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
  assert.equal(w.units[0].status,'Bảo trì');assert.equal(w.units.at(-1).status,'Đang thuê');assert.equal(w.rentals.at(-1).unitId,'replacement')
})
test('Active contracts prevent disabling or resizing rented units',()=>{
  const { w }=setup();const rented=w.units.find(u=>u.status==='Đang thuê')
  assert.throws(()=>updateWorkspaceUnits(w,w.units.map(u=>u.id===rented.id?{...u,status:'Vô hiệu hóa'}:u)))
  assert.throws(()=>updateWorkspaceUnits(w,w.units.map(u=>u.id===rented.id?{...u,area:100}:u)))
  assert.equal(updateWorkspaceUnits(w,w.units.map(u=>({...u,price:u.price+100000}))).rentals[0].amount,w.rentals[0].amount)
})
test('Workspace reloads atomically, reports exclude unpaid revenue and reflect actual inventory',()=>{
  let {w,storage}=setup();w=assignUnit(w,'REQ-001','sample-a101');saveWorkspace(storage,w)
  const restored=loadWorkspace(storage);assert.deepEqual(restored,w)
  const report=reports(restored);assert.equal(report.total,4);assert.equal(report.available,0);assert.equal(report.rented,3);assert.equal(report.revenue,1500000);assert.equal(report.overdue.length,1)
  assert.throws(()=>saveWorkspace({setItem(){throw Error('quota')}},w))
})
