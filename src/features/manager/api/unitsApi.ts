import axiosClient from '../../../shared/api/axiosClient'

export interface RealStorageUnit {
  id: string
  code: string
  type: string
  area: number
  location: string
  price: number
  status: string
  facilityName: string
}

/** Lấy danh sách toàn bộ ô kho từ Database thật qua Backend API */
export async function fetchUnitsFromDB(): Promise<RealStorageUnit[]> {
  try {
    const response = await axiosClient.get<RealStorageUnit[]>('/units')
    return response.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách kho từ database:', err)
    return []
  }
}

/** Cập nhật trạng thái kho trực tiếp xuống Database thật */
export async function updateUnitStatusInDB(unitCodeOrId: string, status: string, reason?: string): Promise<boolean> {
  try {
    await axiosClient.put(`/units/${unitCodeOrId}/status`, { status, reason })
    return true
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái kho:', err)
    return false
  }
}