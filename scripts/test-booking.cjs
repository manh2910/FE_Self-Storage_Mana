const { readFileSync } = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const { test } = require('node:test')
const assert = require('node:assert/strict')
const filename = path.resolve(__dirname, '../src/features/booking/domain.ts')
const js = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
const loaded = new Module(filename, module)
loaded.filename = filename
loaded.paths = module.paths
loaded._compile(js, filename)
const { addMonths, quote, overlaps, validateInput, DemoBookingStore, signatureMatches } = loaded.exports
function setup() {
  const map = new Map()
  const adapter = { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) }
  return { map, store: new DemoBookingStore(adapter), adapter }
}
const unit = { id: 'D1-S01', monthlyPrice: 800000, available: true }
const input = { requestId: 'test-request-1', unitId: unit.id, startDate: '2026-10-20', months: 3, fullName: 'Khách hàng Demo', email: 'demo@example.com', phone: '0900000000', notes: '', accepted: true }
const today = '2026-10-12'
test('Calendar months clamp month-end and account for leap years', () => {
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28')
  assert.equal(addMonths('2028-01-31', 1), '2028-02-29')
  assert.equal(addMonths('2026-12-31', 2), '2027-02-28')
  assert.throws(() => addMonths('2026-02-30', 1))
})
test('Quote uses one-month deposit, with bounded integer amounts and duration', () => {
  assert.deepEqual(quote(800000, 3), { rentalTotal: 2400000, deposit: 800000, total: 3200000 })
  for (const months of [0, 13, 1.5, NaN]) assert.throws(() => quote(800000, months))
  assert.throws(() => quote(Number.MAX_SAFE_INTEGER, 12))
})
test('Validation rejects past/invalid dates, contact details and missing consent', () => {
  assert.deepEqual(validateInput(input, today), {})
  const errors = validateInput({ ...input, startDate: '2026-01-01', fullName: '', email: 'invalid', phone: '1', accepted: false }, today)
  for (const key of ['startDate', 'fullName', 'email', 'phone', 'accepted']) assert.ok(errors[key])
})
test('Half-open rental intervals allow adjacent bookings and reject overlaps', () => {
  assert.equal(overlaps('2026-10-20', '2027-01-20', '2027-01-20', '2027-02-20'), false)
  const { store } = setup()
  store.create(0, input, unit, today)
  assert.throws(() => store.create(0, { ...input, requestId: 'second', startDate: '2026-11-20' }, unit, today), /already have a booking/)
  assert.equal(store.create(0, { ...input, requestId: 'adjacent', startDate: '2027-01-20' }, unit, today).status, 'pending')
})
test('Creation and payment are idempotent and survive store reconstruction', () => {
  const { store, adapter } = setup()
  const first = store.create(0, input, unit, today)
  assert.equal(store.create(0, input, unit, today).id, first.id)
  assert.equal(store.list(0).length, 1)
  const paid = store.pay(0, first.id)
  assert.deepEqual(store.pay(0, first.id), paid)
  assert.equal(new DemoBookingStore(adapter).list(0)[0].status, 'confirmed')
})
test('Each account has separate records and cannot pay another account’s order', () => {
  const { store } = setup()
  const first = store.create(1, input, unit, today)
  assert.deepEqual(store.list(2), [])
  assert.throws(() => store.pay(2, first.id))
})
test('Cancellation releases local overlap and prevents further payment', () => {
  const { store } = setup()
  const first = store.create(0, input, unit, today)
  store.cancel(0, first.id)
  assert.throws(() => store.pay(0, first.id))
  assert.equal(store.create(0, { ...input, requestId: 'replacement' }, unit, today).status, 'pending')
})
test('Unavailable unit and mismatched unit are rejected', () => {
  const { store } = setup()
  assert.throws(() => store.create(0, input, { ...unit, available: false }, today))
  assert.throws(() => store.create(0, { ...input, unitId: 'other' }, unit, today))
})
test('Corrupt data is reported without overwriting it', () => {
  const { map, store } = setup()
  const key = 'selfstorage:demo-bookings:v1:0'
  map.set(key, '{invalid')
  assert.throws(() => store.create(0, input, unit, today), /corrupted/)
  assert.equal(map.get(key), '{invalid')
})
test('Altered stored amounts are rejected', () => {
  const { map, store } = setup()
  const first = store.create(0, input, unit, today)
  map.set('selfstorage:demo-bookings:v1:0', JSON.stringify([{ ...first, total: 1 }]))
  assert.throws(() => store.list(0), /Invalid/)
})
test('Storage failure never reports a successful booking', () => {
  const store = new DemoBookingStore({ getItem: () => null, setItem: () => { throw new Error('QuotaExceededError') } })
  assert.throws(() => store.create(0, input, unit, today), /Unable to save/)
})

test('Contract signature matches the renter name with normalized case and whitespace', () => {
  assert.equal(signatureMatches('  KHÁCH   HÀNG DEMO ', input.fullName), true)
  assert.equal(signatureMatches('Người khác', input.fullName), false)
  assert.equal(signatureMatches('', input.fullName), false)
})
test('Signed contract survives reload and rejects invalid signatures and timestamps', () => {
  const { store, adapter } = setup()
  const contract = { version: 'storage-preview-v1', signedName: input.fullName, signedAt: '2026-10-13T10:00:00.000Z' }
  const booking = store.create(9, { ...input, contract }, unit, today)
  assert.deepEqual(new DemoBookingStore(adapter).list(9)[0].contract, contract)
  assert.deepEqual(booking.contract, contract)
  assert.throws(() => setup().store.create(9, { ...input, contract: { ...contract, signedName: 'Người khác' } }, unit, today))
  assert.throws(() => setup().store.create(9, { ...input, contract: { ...contract, signedAt: 'invalid' } }, unit, today))
})
