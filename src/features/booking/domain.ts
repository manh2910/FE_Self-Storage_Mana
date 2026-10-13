export interface BookingInput {
  requestId: string; unitId: string; startDate: string; months: number
  fullName: string; email: string; phone: string; notes: string; accepted: boolean
  contract?: { version: 'storage-preview-v1'; signedName: string; signedAt: string }
}
export interface Booking extends BookingInput {
  id: string; userId: number; createdAt: string; endDate: string; monthlyPrice: number
  rentalTotal: number; deposit: number; total: number; status: 'pending' | 'confirmed' | 'cancelled'
  paymentId?: string; paidAt?: string
}
export interface BookableUnit { id: string; monthlyPrice: number; available: boolean }
export interface StorageAdapter { getItem(key: string): string | null; setItem(key: string, value: string): void }
export function localToday(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
export function isDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value
}
export function addMonths(value: string, months: number): string {
  if (!isDate(value) || !Number.isInteger(months) || months < 1 || months > 12) throw new Error('Invalid rental period.')
  const [year, month, day] = value.split('-').map(Number)
  const lastDay = new Date(Date.UTC(year, month - 1 + months + 1, 0)).getUTCDate()
  return new Date(Date.UTC(year, month - 1 + months, Math.min(day, lastDay))).toISOString().slice(0, 10)
}
export function quote(monthlyPrice: number, months: number) {
  if (!Number.isSafeInteger(monthlyPrice) || monthlyPrice <= 0 || !Number.isInteger(months) || months < 1 || months > 12) throw new Error('Invalid price or rental duration.')
  const rentalTotal = monthlyPrice * months
  const deposit = monthlyPrice
  if (!Number.isSafeInteger(rentalTotal + deposit)) throw new Error('The cost exceeds the supported limit.')
  return { rentalTotal, deposit, total: rentalTotal + deposit }
}
export function overlaps(start: string, end: string, otherStart: string, otherEnd: string) {
  return start < otherEnd && otherStart < end
}
export function validateInput(input: BookingInput, today = localToday()) {
  const errors: Record<string, string> = {}
  if (!isDate(input.startDate) || input.startDate < today) errors.startDate = 'Choose a start date on or after today.'
  if (!Number.isInteger(input.months) || input.months < 1 || input.months > 12) errors.months = 'Choose a rental duration between 1 and 12 months.'
  if (input.fullName.trim().length < 2 || input.fullName.trim().length > 100) errors.fullName = 'Full name must contain 2 to 100 characters.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.email.length > 254) errors.email = 'Enter a valid email address.'
  if (!/^\+?[\d\s().-]{8,20}$/.test(input.phone.trim()) || input.phone.replace(/\D/g, '').length < 8) errors.phone = 'Enter a valid phone number (8–15 digits).'
  if (input.phone.replace(/\D/g, '').length > 15) errors.phone = 'Phone number must not exceed 15 digits.'
  if (input.notes.length > 500) errors.notes = 'Notes must not exceed 500 characters.'
  if (!input.accepted) errors.accepted = 'Accept the preview terms before confirming.'
  if (input.contract && (input.contract.version !== 'storage-preview-v1' ||
    typeof input.contract.signedName !== 'string' || !signatureMatches(input.contract.signedName, input.fullName) ||
    typeof input.contract.signedAt !== 'string' || !Number.isFinite(Date.parse(input.contract.signedAt)))) {
    errors.signature = 'Invalid agreement signature details.'
  }
  return errors
}
export function signatureMatches(signature: string, fullName: string): boolean {
  const normalize = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi')
  return signature.trim().length >= 2 && signature.trim().length <= 100 && normalize(signature) === normalize(fullName)
}
function isBooking(value: unknown, userId: number): value is Booking {
  if (!value || typeof value !== 'object') return false
  const b = value as Booking
  const valid = b.userId === userId && typeof b.id === 'string' && typeof b.requestId === 'string' && typeof b.unitId === 'string' &&
    isDate(b.startDate) && isDate(b.endDate) && b.endDate > b.startDate && Number.isInteger(b.months) && b.months >= 1 && b.months <= 12 &&
    typeof b.fullName === 'string' && typeof b.email === 'string' && typeof b.phone === 'string' && typeof b.notes === 'string' &&
    Number.isSafeInteger(b.monthlyPrice) && b.monthlyPrice > 0 && Number.isSafeInteger(b.total) && b.total > 0 &&
    ['pending', 'confirmed', 'cancelled'].includes(b.status) && typeof b.createdAt === 'string' && Number.isFinite(Date.parse(b.createdAt))
  if (!valid || b.accepted !== true || Object.keys(validateInput(b, '0000-01-01')).length) return false
  const costs = quote(b.monthlyPrice, b.months)
  return b.endDate === addMonths(b.startDate, b.months) && b.rentalTotal === costs.rentalTotal && b.deposit === costs.deposit && b.total === costs.total &&
    (b.status !== 'confirmed' || (typeof b.paymentId === 'string' && typeof b.paidAt === 'string' && Number.isFinite(Date.parse(b.paidAt))))
}
export class DemoBookingStore {
  constructor(private storage: StorageAdapter) {}
  private key(userId: number) { return `selfstorage:demo-bookings:v1:${userId}` }
  list(userId: number): Booking[] {
    const raw = this.storage.getItem(this.key(userId))
    if (!raw) return []
    let parsed: unknown
    try { parsed = JSON.parse(raw) } catch { throw new Error('Browser booking data is corrupted. Contact support; existing data has not been overwritten.') }
    if (!Array.isArray(parsed) || !parsed.every(b => isBooking(b, userId))) throw new Error('Invalid booking data. Existing data has been preserved.')
    return parsed
  }
  private save(userId: number, bookings: Booking[]) {
    try { this.storage.setItem(this.key(userId), JSON.stringify(bookings)) }
    catch { throw new Error('Unable to save in this browser. Check storage permissions or capacity and try again.') }
  }
  create(userId: number, input: BookingInput, unit: BookableUnit, today = localToday()): Booking {
    if (!Number.isSafeInteger(userId) || userId < 0) throw new Error('Invalid customer identifier.')
    const bookings = this.list(userId)
    const existing = bookings.find(b => b.requestId === input.requestId)
    if (existing) return existing
    const errors = validateInput(input, today)
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0])
    if (!/^[a-zA-Z0-9-]{1,100}$/.test(input.requestId) || input.unitId !== unit.id || !unit.available) throw new Error('This unit cannot be booked. Choose another unit.')
    const endDate = addMonths(input.startDate, input.months)
    if (bookings.some(b => b.unitId === unit.id && b.status !== 'cancelled' && overlaps(input.startDate, endDate, b.startDate, b.endDate))) throw new Error('You already have a booking for this unit during this period. Choose different dates or another unit.')
    const booking: Booking = { ...input, fullName: input.fullName.trim(), email: input.email.trim(), phone: input.phone.trim(), notes: input.notes.trim(),
      id: `DEMO-${input.requestId}`, userId, createdAt: new Date().toISOString(), endDate, monthlyPrice: unit.monthlyPrice, ...quote(unit.monthlyPrice, input.months), status: 'pending' }
    this.save(userId, [booking, ...bookings])
    return booking
  }
  pay(userId: number, id: string): Booking {
    const bookings = this.list(userId)
    const booking = bookings.find(b => b.id === id)
    if (!booking || booking.status === 'cancelled') throw new Error('This booking is no longer eligible for payment simulation.')
    if (booking.status === 'confirmed') return booking
    const updated: Booking = { ...booking, status: 'confirmed', paymentId: `PAY-${booking.requestId}`, paidAt: new Date().toISOString() }
    this.save(userId, bookings.map(b => b.id === id ? updated : b))
    return updated
  }
  cancel(userId: number, id: string): Booking {
    const bookings = this.list(userId)
    const booking = bookings.find(b => b.id === id)
    if (!booking) throw new Error('Booking not found on this browser.')
    const updated: Booking = { ...booking, status: 'cancelled' }
    this.save(userId, bookings.map(b => b.id === id ? updated : b))
    return updated
  }
}
