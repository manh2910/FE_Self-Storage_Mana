export type StorageSize = 'small' | 'medium' | 'large'
export interface StorageUnit {
  id: string; facility: string; location: string; address: string; name: string
  size: StorageSize; area: number; type: 'standard' | 'cold'; monthlyPrice: number
  image: string; description: string; available: boolean
}
export const storageUnits: StorageUnit[] = [
  { id: 'D1-S01', facility: 'SelfStorage District 1', location: 'district-1', address: 'District 1, Ho Chi Minh City (sample location)', name: 'Small Unit S01', size: 'small', area: 5, type: 'standard', monthlyPrice: 800000, image: '/images/storage-small.webp', description: 'Ideal for boxes, suitcases and personal belongings.', available: true },
  { id: 'D1-M01', facility: 'SelfStorage District 1', location: 'district-1', address: 'District 1, Ho Chi Minh City (sample location)', name: 'Medium Unit M01', size: 'medium', area: 10, type: 'standard', monthlyPrice: 1400000, image: '/images/storage-medium.webp', description: 'Room for furniture and the contents of a small apartment.', available: true },
  { id: 'TD-S02', facility: 'SelfStorage Thu Duc', location: 'thu-duc', address: 'Thu Duc, Ho Chi Minh City (sample location)', name: 'Small Unit S02', size: 'small', area: 5, type: 'standard', monthlyPrice: 750000, image: '/images/storage-small.webp', description: 'Store seasonal items, documents and personal belongings.', available: true },
  { id: 'TD-M02', facility: 'SelfStorage Thu Duc', location: 'thu-duc', address: 'Thu Duc, Ho Chi Minh City (sample location)', name: 'Medium Unit M02', size: 'medium', area: 10, type: 'standard', monthlyPrice: 1300000, image: '/images/storage-medium.webp', description: 'Store furniture while moving or renovating your home.', available: true },
  { id: 'TD-L01', facility: 'SelfStorage Thu Duc', location: 'thu-duc', address: 'Thu Duc, Ho Chi Minh City (sample location)', name: 'Large Unit L01', size: 'large', area: 20, type: 'standard', monthlyPrice: 2500000, image: '/images/storage-hero.webp', description: 'Spacious storage for large furniture and business inventory.', available: true },
  { id: 'TD-C01', facility: 'SelfStorage Thu Duc', location: 'thu-duc', address: 'Thu Duc, Ho Chi Minh City (sample location)', name: 'Cold Storage C01', size: 'small', area: 5, type: 'cold', monthlyPrice: 1500000, image: '/images/storage-hero.webp', description: 'Sample cold storage. Confirm storage conditions with the facility.', available: false },
]
export const money = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'VND' }).format(value)
export const sizeLabels: Record<StorageSize, string> = { small: 'Small storage', medium: 'Medium storage', large: 'Large storage' }
