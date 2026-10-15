import type { Booking } from './domain'
import { addMonths, isDate, isRentalDuration, localToday, overlaps } from './domain'
import type { StorageUnit } from './catalog'
export interface SpaceFilters { location: string; size: string; startDate: string; months: number; type: string; maxPrice: string }
export function filterError(filters: SpaceFilters): string {
  if (!isDate(filters.startDate) || filters.startDate < localToday()) return 'Choose a rental start date on or after today.'
  if (!isRentalDuration(filters.months)) return 'Choose a rental duration of 1, 3, 6, 12 or 24 months.'
  if (filters.maxPrice && (!Number.isSafeInteger(Number(filters.maxPrice)) || Number(filters.maxPrice) <= 0)) return 'The maximum monthly price must be a positive whole number.'
  return ''
}
export function availableSpaces(units: StorageUnit[], filters: SpaceFilters, bookings: Booking[]): StorageUnit[] {
  if (filterError(filters)) return []
  const endDate = addMonths(filters.startDate, filters.months)
  return units.filter(unit => unit.available && (!filters.location || unit.location === filters.location) && (!filters.size || unit.size === filters.size) && (!filters.type || unit.type === filters.type) && (!filters.maxPrice || unit.monthlyPrice <= Number(filters.maxPrice)) && !bookings.some(booking => booking.unitId === unit.id && booking.status !== 'cancelled' && overlaps(filters.startDate, endDate, booking.startDate, booking.endDate)))
}
export function filterParams(filters: SpaceFilters): URLSearchParams {
  const params = new URLSearchParams({ startDate: filters.startDate, months: String(filters.months) })
  for (const key of ['location','size','type','maxPrice'] as const) if (filters[key]) params.set(key, filters[key])
  return params
}
