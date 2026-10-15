import { parseManagerData } from './managerStorage'
export const unitTypes = ['Small', 'Medium', 'Large'] as const
export const unitStatuses = ['Available', 'Occupied', 'Cleaning', 'Maintenance', 'Deactivated'] as const
export interface ManagedUnit {
  id: string
  code: string
  type: typeof unitTypes[number]
  area: number
  location: string
  price: number
  status: typeof unitStatuses[number]
}
export type UnitDraft = Omit<ManagedUnit, 'id'>
export const initialUnits: ManagedUnit[] = [
  { id: 'sample-a101', code: 'A-101', type: 'Small', area: 5, location: 'Floor 1 · Zone A', price: 850000, status: 'Available' },
  { id: 'sample-a102', code: 'A-102', type: 'Medium', area: 10, location: 'Floor 1 · Zone A', price: 1500000, status: 'Occupied' },
  { id: 'sample-b201', code: 'B-201', type: 'Large', area: 20, location: 'Floor 2 · Zone B', price: 2800000, status: 'Occupied' },
  { id: 'sample-b202', code: 'B-202', type: 'Medium', area: 10, location: 'Floor 2 · Zone B', price: 1500000, status: 'Maintenance' },
]
export function validateUnit(draft: UnitDraft, units: ManagedUnit[], editingId?: string): Partial<Record<keyof UnitDraft, string>> {
  const errors: Partial<Record<keyof UnitDraft, string>> = {}
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,29}$/.test(draft.code.trim())) errors.code = 'Unit codes must contain 1–30 letters, digits, hyphens or underscores.'
  else if (units.some(unit => unit.id !== editingId && unit.code.toUpperCase() === draft.code.trim().toUpperCase())) errors.code = 'Unit code already exists. Use a different code.'
  if (!unitTypes.includes(draft.type)) errors.type = 'Select a valid unit type.'
  if (!Number.isFinite(draft.area) || draft.area <= 0 || draft.area > 10000) errors.area = 'Area must be greater than 0 and no more than 10,000 m².'
  if (!draft.location.trim() || draft.location.trim().length > 120) errors.location = 'Enter a unit location with up to 120 characters.'
  if (!Number.isSafeInteger(draft.price) || draft.price <= 0) errors.price = 'Rental price must be a positive whole number (VND).'
  if (!unitStatuses.includes(draft.status)) errors.status = 'Select a valid status.'
  return errors
}
const storageKey = 'selfstorage:fm-units:v1'
export function readUnits(storage: Pick<Storage, 'getItem'>): ManagedUnit[] {
  const workspace = storage.getItem('selfstorage:fm-workspace:v1')
  const raw = workspace ? JSON.stringify(parseManagerData(workspace).units) : storage.getItem(storageKey)
  if (raw === null) return initialUnits.map(unit => ({ ...unit }))
  const value: unknown = parseManagerData(raw)
  if (!Array.isArray(value)) throw new Error('Invalid unit data')
  const result: ManagedUnit[] = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') throw new Error('Invalid unit data')
    const unit = entry as ManagedUnit
    if (typeof unit.id !== 'string' || !unit.id || typeof unit.code !== 'string' || typeof unit.location !== 'string' || result.some(item => item.id === unit.id) || Object.keys(validateUnit(unit, result)).length) throw new Error('Invalid unit data')
    result.push(unit)
  }
  return result
}
export function writeUnits(storage: Pick<Storage, 'setItem'>, units: ManagedUnit[]) {
  const workspace = (storage as Storage).getItem?.('selfstorage:fm-workspace:v1')
  if (workspace) {
    const value = parseManagerData(workspace)
    for (const rental of value.rentals || []) {
      if (rental.stage === 'Returned') continue
      const previous = value.units.find((u: ManagedUnit) => u.id === rental.unitId)
      const next = units.find(u => u.id === rental.unitId)
      if (!next || next.status !== 'Occupied' || next.type !== previous.type || next.area !== previous.area) throw new Error('This unit has an active contract. Resolve the contract first.')
    }
    storage.setItem('selfstorage:fm-workspace:v1', JSON.stringify({ ...value, units }))
  } else storage.setItem(storageKey, JSON.stringify(units))
}
