import axiosClient from '../../../shared/api/axiosClient'

export interface RealCustomerUnit {
  id: string
  code: string
  type: string
  area: number
  location: string
  price: number
  status: string
  facilityName: string
}

/** Lấy danh sách ô kho thực tế từ SQL Server qua Backend API */
export async function fetchCustomerUnitsFromDB(): Promise<RealCustomerUnit[]> {
  try {
    const response = await axiosClient.get<RealCustomerUnit[]>('/units')
    if (response.data && Array.isArray(response.data)) {
      return response.data
    }
    return []
  } catch (err) {
    console.error('Lỗi khi tải danh sách kho cho khách hàng từ DB:', err)
    return []
  }
}