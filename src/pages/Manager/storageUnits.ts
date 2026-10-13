export const unitTypes = ['Small', 'Medium', 'Large'] as const
export const unitStatuses = ['Còn trống', 'Đang thuê', 'Bảo trì', 'Vô hiệu hóa'] as const
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
  { id: 'sample-a101', code: 'A-101', type: 'Small', area: 5, location: 'Tầng 1 · Khu A', price: 850000, status: 'Còn trống' },
  { id: 'sample-a102', code: 'A-102', type: 'Medium', area: 10, location: 'Tầng 1 · Khu A', price: 1500000, status: 'Đang thuê' },
  { id: 'sample-b201', code: 'B-201', type: 'Large', area: 20, location: 'Tầng 2 · Khu B', price: 2800000, status: 'Đang thuê' },
  { id: 'sample-b202', code: 'B-202', type: 'Medium', area: 10, location: 'Tầng 2 · Khu B', price: 1500000, status: 'Bảo trì' },
]
export function validateUnit(draft: UnitDraft, units: ManagedUnit[], editingId?: string): Partial<Record<keyof UnitDraft, string>> {
  const errors: Partial<Record<keyof UnitDraft, string>> = {}
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,29}$/.test(draft.code.trim())) errors.code = 'Mã kho gồm 1–30 chữ, số, dấu gạch ngang hoặc gạch dưới.'
  else if (units.some(unit => unit.id !== editingId && unit.code.toUpperCase() === draft.code.trim().toUpperCase())) errors.code = 'Mã kho đã tồn tại. Vui lòng dùng mã khác.'
  if (!unitTypes.includes(draft.type)) errors.type = 'Chọn loại kho hợp lệ.'
  if (!Number.isFinite(draft.area) || draft.area <= 0 || draft.area > 10000) errors.area = 'Diện tích phải lớn hơn 0 và không vượt quá 10.000 m².'
  if (!draft.location.trim() || draft.location.trim().length > 120) errors.location = 'Nhập vị trí kho, tối đa 120 ký tự.'
  if (!Number.isSafeInteger(draft.price) || draft.price <= 0) errors.price = 'Giá thuê phải là số nguyên dương hợp lệ (VNĐ).'
  if (!unitStatuses.includes(draft.status)) errors.status = 'Chọn trạng thái hợp lệ.'
  return errors
}
const storageKey = 'selfstorage:fm-units:v1'
export function readUnits(storage: Pick<Storage, 'getItem'>): ManagedUnit[] {
  const workspace = storage.getItem('selfstorage:fm-workspace:v1')
  const raw = workspace ? JSON.stringify(JSON.parse(workspace).units) : storage.getItem(storageKey)
  if (raw === null) return initialUnits.map(unit => ({ ...unit }))
  const value: unknown = JSON.parse(raw)
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
    const value = JSON.parse(workspace)
    for (const rental of value.rentals || []) {
      if (rental.stage === 'Đã trả') continue
      const previous = value.units.find((u: ManagedUnit) => u.id === rental.unitId)
      const next = units.find(u => u.id === rental.unitId)
      if (!next || next.status !== 'Đang thuê' || next.type !== previous.type || next.area !== previous.area) throw new Error('Kho có hợp đồng đang hoạt động; hãy xử lý hợp đồng trước.')
    }
    storage.setItem('selfstorage:fm-workspace:v1', JSON.stringify({ ...value, units }))
  } else storage.setItem(storageKey, JSON.stringify(units))
}
