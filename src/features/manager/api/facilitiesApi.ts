import axiosClient from '../../../shared/api/axiosClient'

export interface RealFacility {
  facilityId: number
  facilityCode: string
  facilityName: string
  cityName: string
  address: string
  phoneNumber: string
  totalUnits: number
}

/** Lấy danh sách các cơ sở kho từ Database thật */
export async function fetchFacilitiesFromDB(): Promise<RealFacility[]> {
  try {
    const response = await axiosClient.get<RealFacility[]>('/facilities')
    return response.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách cơ sở từ database:', err)
    return []
  }
}