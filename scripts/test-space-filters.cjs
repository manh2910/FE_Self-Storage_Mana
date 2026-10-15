const { readFileSync } = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const { test } = require('node:test')
const assert = require('node:assert/strict')
function load(name) {
  const filename = path.resolve(__dirname, '../src/features/booking/' + name + '.ts')
  const loaded = new Module(filename, module)
  loaded.filename = filename; loaded.paths = module.paths
  loaded.require = request => request.startsWith('./') ? load(request.slice(2)) : require(request)
  loaded._compile(ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename)
  return loaded.exports
}
const { filterError, availableSpaces, filterParams } = load('spaceFilters')
const { storageUnits } = load('catalog')
const { localToday, addMonths } = load('domain')
const filters = { location: '', size: '', startDate: localToday(), months: 3, type: '', maxPrice: '' }

test('The 24-month option survives filters and navigation while unsupported options are rejected', () => {
  const longRental = { ...filters, months: 24 }
  assert.equal(filterError(longRental), '')
  assert.equal(filterParams(longRental).get('months'), '24')
  assert.ok(availableSpaces(storageUnits, longRental, []).length > 0)
  assert.ok(filterError({ ...filters, months: 2 }))
  assert.ok(filterError({ ...filters, months: 25 }))
})
test('Only available catalog units matching location, size, type and budget are shown', () => {
  assert.equal(availableSpaces(storageUnits, filters, []).length, 5)
  assert.equal(availableSpaces(storageUnits, {...filters, type:'cold'}, []).length, 0)
  const matched=availableSpaces(storageUnits,{...filters,location:'district-1',size:'small',type:'standard',maxPrice:'800000'},[])
  assert.deepEqual(matched.map(u=>u.id),['D1-S01'])
  assert.equal(availableSpaces(storageUnits,{...filters,maxPrice:'700000'},[]).length,0)
})
test('Past dates, malformed dates, out-of-range durations and invalid prices cannot produce selectable results',()=>{
  for(const change of [{startDate:'2020-01-01'},{startDate:'2026-02-30'},{months:0},{months:1.5},{months:13},{maxPrice:'-1'},{maxPrice:'1.5'},{maxPrice:'Infinity'}]){
    assert.ok(filterError({...filters,...change}))
    assert.deepEqual(availableSpaces(storageUnits,{...filters,...change},[]),[])
  }
})
test('Existing non-cancelled bookings block overlap but adjacent and cancelled bookings do not',()=>{
  const end=addMonths(filters.startDate,filters.months)
  const occupied={unitId:'D1-S01',startDate:filters.startDate,endDate:end,status:'pending'}
  assert.equal(availableSpaces(storageUnits,filters,[occupied]).some(u=>u.id===occupied.unitId),false)
  assert.equal(availableSpaces(storageUnits,filters,[{...occupied,status:'confirmed'}]).some(u=>u.id===occupied.unitId),false)
  assert.equal(availableSpaces(storageUnits,filters,[{...occupied,status:'cancelled'}]).some(u=>u.id===occupied.unitId),true)
  assert.equal(availableSpaces(storageUnits,{...filters,startDate:end},[occupied]).some(u=>u.id===occupied.unitId),true)
})
test('All applied preferences survive query-string navigation to customer details',()=>{
  const next={...filters,location:'district-1',size:'small',type:'standard',maxPrice:'1500000'}
  const params=filterParams(next)
  for(const [key,value] of Object.entries(next))assert.equal(params.get(key),String(value))
})
