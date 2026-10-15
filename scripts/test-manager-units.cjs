const { readFileSync } = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const { test } = require('node:test')
const assert = require('node:assert/strict')
const filename = path.resolve(__dirname, '../src/pages/Manager/storageUnits.ts')
const js = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
const loaded = new Module(filename, module)
loaded.filename = filename
loaded.paths = module.paths
loaded.require = request => {
  if (request !== './managerStorage') return require(request)
  const parserPath = path.resolve(__dirname, '../src/pages/Manager/managerStorage.ts')
  const parser = new Module(parserPath, module)
  parser._compile(ts.transpileModule(readFileSync(parserPath, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, parserPath)
  return parser.exports
}
loaded._compile(js, filename)
const { readUnits, writeUnits, validateUnit } = loaded.exports
function setup() {
  const values = new Map()
  return { values, storage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) } }
}
const draft = { code: 'C-301', type: 'Small', area: 5, location: 'Tầng 3 · Khu C', price: 850000, status: 'Available' }
test('Unit codes reject case-insensitive duplicates but allow editing the same unit', () => {
  const { storage } = setup()
  const units = readUnits(storage)
  assert.ok(validateUnit({ ...draft, code: ' a-101 ' }, units).code)
  assert.deepEqual(validateUnit(units[0], units, units[0].id), {})
})
test('Required fields, area, price and enum values are validated', () => {
  for (const area of [0, -1, NaN, Infinity, 10001]) assert.ok(validateUnit({ ...draft, area }, []).area)
  for (const price of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.ok(validateUnit({ ...draft, price }, []).price)
  assert.ok(validateUnit({ ...draft, location: ' ' }, []).location)
  assert.ok(validateUnit({ ...draft, code: 'bad code' }, []).code)
  assert.ok(validateUnit({ ...draft, type: 'Unknown' }, []).type)
  assert.ok(validateUnit({ ...draft, status: 'Unknown' }, []).status)
})
test('Add, edit, deactivate and reactivate persist across reloads', () => {
  const { storage } = setup()
  let units = [...readUnits(storage), { ...draft, id: 'new-unit' }]
  writeUnits(storage, units)
  assert.equal(readUnits(storage).length, 5)
  units = readUnits(storage).map(unit => unit.id === 'new-unit' ? { ...unit, price: 950000, status: 'Deactivated' } : unit)
  writeUnits(storage, units)
  assert.equal(readUnits(storage).find(unit => unit.id === 'new-unit').price, 950000)
  assert.equal(readUnits(storage).find(unit => unit.id === 'new-unit').status, 'Deactivated')
  units = readUnits(storage).map(unit => unit.id === 'new-unit' ? { ...unit, status: 'Available' } : unit)
  writeUnits(storage, units)
  assert.equal(readUnits(storage).find(unit => unit.id === 'new-unit').status, 'Available')
})
test('Corrupt data is reported without overwriting existing storage', () => {
  const { values, storage } = setup()
  for (const raw of ['broken json', '{}', '[null]', JSON.stringify([{ ...draft, id: '1' }, { ...draft, id: '2' }]), JSON.stringify([{ ...draft, id: '1', price: -10 }])]) {
    values.set('selfstorage:fm-units:v1', raw)
    assert.throws(() => readUnits(storage))
    assert.equal(values.get('selfstorage:fm-units:v1'), raw)
  }
})
test('An empty list stays empty and failed storage writes are reported', () => {
  const { storage } = setup()
  writeUnits(storage, [])
  assert.deepEqual(readUnits(storage), [])
  assert.throws(() => writeUnits({ setItem() { throw new Error('quota exceeded') } }, []))
})
